"use client";

/**
 * ColorPicker — full-spectrum HSV colour picker
 *
 * Architecture: single-file molecule composing internal atoms.
 * Zero new dependencies — uses @radix-ui/react-slider + @radix-ui/react-popover
 * already present in the project.
 *
 * Atoms (internal):
 *   SaturationValueField  — 2-D CSS gradient canvas with draggable cursor
 *   HueSlider             — rainbow Radix slider for hue selection
 *
 * Public API:
 *   <ColorPicker
 *     value="#f59e0b"
 *     onChange={(hex) => …}
 *     label="Primary"
 *     presets={["#f59e0b", …]}   // caller-owned, domain-specific
 *     contrastWith="#ffffff"      // optional — shows live WCAG badge
 *   />
 */

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// =============================================================================
// Color math — pure functions, zero external deps
// =============================================================================

type Rgb = { r: number; g: number; b: number };
type Hsv = { h: number; s: number; v: number };

const HEX_RE = /^#([0-9a-fA-F]{3}){1,2}$/;

export function isValidHex(hex: string): boolean {
  return HEX_RE.test(hex);
}

function hexToRgb(hex: string): Rgb | null {
  if (!isValidHex(hex)) return null;
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff };
}

function rgbToHex({ r, g, b }: Rgb): string {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

function rgbToHsv({ r, g, b }: Rgb): Hsv {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  if (delta > 0) {
    if (max === rn) h = 60 * (((gn - bn) / delta) % 6);
    else if (max === gn) h = 60 * ((bn - rn) / delta + 2);
    else h = 60 * ((rn - gn) / delta + 4);
  }
  if (h < 0) h += 360;

  return { h, s: max === 0 ? 0 : delta / max, v: max };
}

function hsvToRgb({ h, s, v }: Hsv): Rgb {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;

  if (h < 60)       { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else              { r = c; b = x; }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function hexToHsv(hex: string): Hsv {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToHsv(rgb) : { h: 0, s: 0, v: 1 };
}

function hsvToHex(hsv: Hsv): string {
  return rgbToHex(hsvToRgb(hsv));
}

// WCAG 2.1 relative luminance + contrast ratio
function sRgbLinear(c: number): number {
  const lin = c / 255;
  return lin <= 0.03928 ? lin / 12.92 : Math.pow((lin + 0.055) / 1.055, 2.4);
}

function luminance({ r, g, b }: Rgb): number {
  return 0.2126 * sRgbLinear(r) + 0.7152 * sRgbLinear(g) + 0.0722 * sRgbLinear(b);
}

function wcagContrastRatio(hex1: string, hex2: string): number | null {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return null;
  const l1 = luminance(rgb1), l2 = luminance(rgb2);
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
}

// =============================================================================
// Internal atoms
// =============================================================================

/** 2-D saturation × value field rendered via CSS gradients (no canvas) */
function SaturationValueField({
  hue,
  saturation,
  value,
  onChange,
}: {
  hue: number;
  saturation: number;
  value: number;
  onChange: (s: number, v: number) => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const pick = React.useCallback(
    (e: React.PointerEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const s = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const v = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
      onChange(s, v);
    },
    [onChange],
  );

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      pick(e);
    },
    [pick],
  );

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (!(e.buttons & 1)) return;
      pick(e);
    },
    [pick],
  );

  const cursorHex = hsvToHex({ h: hue, s: saturation, v: value });

  return (
    <div
      ref={ref}
      className="relative h-36 w-full rounded-md cursor-crosshair touch-none select-none overflow-hidden"
      style={{
        background: [
          "linear-gradient(to bottom, transparent 0%, #000 100%)",
          `linear-gradient(to right, #fff 0%, hsl(${hue}, 100%, 50%) 100%)`,
        ].join(", "),
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
    >
      <div
        className="absolute w-3.5 h-3.5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none ring-2 ring-white"
        style={{
          left: `${saturation * 100}%`,
          top: `${(1 - value) * 100}%`,
          backgroundColor: cursorHex,
          boxShadow: "0 0 0 1px rgba(0,0,0,0.45), 0 2px 4px rgba(0,0,0,0.4)",
        }}
      />
    </div>
  );
}

/** Hue strip — @radix-ui/react-slider with rainbow gradient track */
function HueSlider({ hue, onChange }: { hue: number; onChange: (h: number) => void }) {
  return (
    <SliderPrimitive.Root
      min={0}
      max={360}
      step={1}
      value={[hue]}
      onValueChange={([h]) => onChange(h)}
      className="relative flex w-full touch-none select-none items-center"
    >
      <SliderPrimitive.Track
        className="relative h-3 w-full grow overflow-hidden rounded-full"
        style={{
          background:
            "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
        }}
      >
        {/* Range fill is transparent — the rainbow track IS the visual indicator */}
        <SliderPrimitive.Range className="absolute h-full bg-transparent" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="block h-4 w-4 rounded-full border-2 border-white shadow-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        style={{ backgroundColor: `hsl(${hue}, 100%, 50%)` }}
        aria-label="Hue"
      />
    </SliderPrimitive.Root>
  );
}

// =============================================================================
// WCAG badge helper
// =============================================================================

function WcagBadge({ ratio }: { ratio: number }) {
  const { label, cls } =
    ratio >= 7
      ? { label: "AAA", cls: "bg-green-500/15 text-green-400 border-green-500/25" }
      : ratio >= 4.5
        ? { label: "AA", cls: "bg-green-500/15 text-green-400 border-green-500/25" }
        : ratio >= 3
          ? { label: "AA Large", cls: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25" }
          : { label: "Fail", cls: "bg-red-500/15 text-red-400 border-red-500/25" };

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-md border px-2.5 py-1.5 text-xs",
        cls,
      )}
    >
      <span className="font-medium">Contrast ratio</span>
      <span className="font-mono font-semibold">
        {ratio.toFixed(2)}:1 · {label}
      </span>
    </div>
  );
}

// =============================================================================
// Public component
// =============================================================================

export interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
  label?: string;
  /** Caller-owned preset palette — domain-specific, not hardcoded in the component */
  presets?: string[];
  /** When supplied, renders a live WCAG contrast ratio badge */
  contrastWith?: string;
  disabled?: boolean;
  className?: string;
}

export function ColorPicker({
  value,
  onChange,
  label,
  presets,
  contrastWith,
  disabled,
  className,
}: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [hsv, setHsv] = React.useState<Hsv>(() => hexToHsv(value));
  const [hexInput, setHexInput] = React.useState(value);
  const [copied, setCopied] = React.useState(false);

  // Capture original colour when popover opens for the before/after preview
  const originalRef = React.useRef(value);
  React.useEffect(() => {
    if (open) originalRef.current = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Sync internal HSV when the value prop changes externally (e.g. preset click, reset)
  React.useEffect(() => {
    setHsv(hexToHsv(value));
    setHexInput(value);
  }, [value]);

  const commitHsv = React.useCallback(
    (newHsv: Hsv) => {
      setHsv(newHsv);
      const hex = hsvToHex(newHsv);
      setHexInput(hex);
      onChange(hex);
    },
    [onChange],
  );

  const handleHexInput = (raw: string) => {
    const normalised = (raw.startsWith("#") ? raw : `#${raw}`).slice(0, 7);
    setHexInput(normalised);
    if (isValidHex(normalised)) {
      const newHsv = hexToHsv(normalised);
      setHsv(newHsv);
      onChange(normalised);
    }
  };

  const handleHexBlur = () => {
    if (!isValidHex(hexInput)) setHexInput(value);
  };

  const copyHex = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const rgb = hexToRgb(value);
  const contrast = contrastWith ? wcagContrastRatio(value, contrastWith) : null;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-lg border border-border px-2.5 py-1.5 hover:bg-muted/50 transition-colors cursor-pointer w-full text-left group disabled:pointer-events-none disabled:opacity-50"
            aria-label={`Pick ${label ?? "colour"}, currently ${value}`}
          >
            <div
              className="w-8 h-8 rounded-md border border-border/60 shadow-sm shrink-0 transition-transform group-hover:scale-105"
              style={{ backgroundColor: value }}
            />
            <div className="flex-1 min-w-0">
              {label && (
                <p className="text-xs font-medium text-foreground truncate">{label}</p>
              )}
              <p className="text-[11px] font-mono text-muted-foreground">{value.toUpperCase()}</p>
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-72 p-0" align="start" sideOffset={8}>
          <div className="p-3 space-y-3">
            {/* 2-D saturation × value field */}
            <SaturationValueField
              hue={hsv.h}
              saturation={hsv.s}
              value={hsv.v}
              onChange={(s, v) => commitHsv({ h: hsv.h, s, v })}
            />

            {/* Hue slider */}
            <HueSlider hue={hsv.h} onChange={(h) => commitHsv({ h, s: hsv.s, v: hsv.v })} />

            {/* Before/after preview + hex input + copy */}
            <div className="flex items-center gap-2">
              {/* Before / After split chip */}
              <div
                className="shrink-0 h-7 w-12 rounded border border-border overflow-hidden"
                title={`Before: ${originalRef.current} → After: ${value}`}
              >
                <div
                  className="h-full w-1/2 float-left"
                  style={{ backgroundColor: originalRef.current }}
                />
                <div className="h-full w-1/2 float-left" style={{ backgroundColor: value }} />
              </div>

              {/* Hex input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={hexInput}
                  onChange={(e) => handleHexInput(e.target.value)}
                  onBlur={handleHexBlur}
                  spellCheck={false}
                  maxLength={7}
                  className="w-full rounded-md border border-border bg-background px-2.5 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  aria-label="Hex colour value"
                />
                {!isValidHex(hexInput) && (
                  <p className="absolute -bottom-4 left-0 text-[10px] text-destructive">
                    Invalid hex
                  </p>
                )}
              </div>

              {/* Copy hex to clipboard */}
              <button
                type="button"
                onClick={copyHex}
                className="shrink-0 rounded-md border border-border p-1.5 hover:bg-muted/50 transition-colors"
                aria-label="Copy hex value to clipboard"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </button>
            </div>

            {/* RGB channel readout */}
            {rgb && (
              <div className="grid grid-cols-3 gap-1.5">
                {(["r", "g", "b"] as const).map((ch) => (
                  <div
                    key={ch}
                    className="flex flex-col items-center rounded border border-border/50 py-1 bg-muted/30"
                  >
                    <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground">
                      {ch}
                    </span>
                    <span className="text-[11px] font-mono text-foreground">{rgb[ch]}</span>
                  </div>
                ))}
              </div>
            )}

            {/* WCAG contrast ratio (optional — only when contrastWith is supplied) */}
            {contrast !== null && <WcagBadge ratio={contrast} />}

            {/* Preset swatches (optional — caller-provided) */}
            {presets && presets.length > 0 && (
              <>
                <div className="h-px bg-border" />
                <div className="flex flex-wrap gap-1.5">
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setHsv(hexToHsv(preset));
                        setHexInput(preset);
                        onChange(preset);
                      }}
                      className={cn(
                        "w-6 h-6 rounded-md border transition-all hover:scale-110",
                        preset.toLowerCase() === value.toLowerCase()
                          ? "border-accent ring-1 ring-accent"
                          : "border-border/60",
                      )}
                      style={{ backgroundColor: preset }}
                      title={preset}
                      aria-label={`Set colour to ${preset}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
