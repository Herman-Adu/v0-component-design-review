import "server-only";

import { getCompanySettings } from "@/lib/strapi/global/company-settings/company-settings";
import { getEmailSettings } from "@/lib/strapi/global/email-settings/email-settings";
import { COMPANY, BRAND_COLORS, SLA } from "./email-config";

/**
 * Email Config Builder
 *
 * Async builder that loads company-setting and email-setting from Strapi
 * (or JSON mock on Vercel/CI) and merges with hardcoded fallback constants.
 *
 * All email services call buildEmailConfig() at send time.
 * Templates receive ResolvedEmailConfig and use it instead of importing
 * static consts directly — enabling single-Strapi-edit → all templates update.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export interface ResolvedEmailConfig {
  company: {
    name: string;
    tagline: string;
    legalName: string;
    address: string;
    phone: string;
    email: {
      support: string;
      noreply: string;
    };
    website: string;
    logoUrl: string | null;
    copyrightYear: string;
  };
  brand: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    headerGradientStart: string;
    headerGradientEnd: string;
  };
  email: {
    fromEmail: string;
    contactFromEmail: string;
    quotationFromEmail: string;
    replyToEmail: string;
    slaResponseHours: number;
    slaUrgentHours: number;
    footerDisclaimer: string | null;
    emailSignatureTemplate: string | null;
  };
  sla: typeof SLA;
}

// Derive lighter/darker variants from a base hex — avoids storing every shade in Strapi
function lighten(hex: string): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + 30);
  const g = Math.min(255, ((n >> 8) & 0xff) + 30);
  const b = Math.min(255, (n & 0xff) + 30);
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function darken(hex: string): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - 30);
  const g = Math.max(0, ((n >> 8) & 0xff) - 30);
  const b = Math.max(0, (n & 0xff) - 30);
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

let cachedConfig: ResolvedEmailConfig | undefined;

export async function buildEmailConfig(): Promise<ResolvedEmailConfig> {
  if (cachedConfig) return cachedConfig;

  const [company, emailSettings] = await Promise.all([
    getCompanySettings(),
    getEmailSettings(),
  ]);

  const primary = company?.brandPrimaryColor ?? BRAND_COLORS.primary;

  cachedConfig = {
    company: {
      name: company?.businessName ?? COMPANY.name,
      tagline: "Professional & Reliable",
      legalName: company?.businessName ?? COMPANY.legalName,
      address: company?.businessAddress ?? COMPANY.address.full,
      phone: company?.businessPhone ?? COMPANY.phone.primary,
      email: {
        support: emailSettings?.replyToEmail ?? company?.businessEmail ?? COMPANY.email.support,
        noreply: emailSettings?.fromEmail ?? COMPANY.email.noreply,
      },
      website: company?.website ?? COMPANY.website,
      logoUrl: company?.logoUrl ?? null,
      copyrightYear: new Date().getFullYear().toString(),
    },
    brand: {
      primary,
      primaryLight: lighten(primary),
      primaryDark: darken(primary),
      headerGradientStart: company?.brandSecondaryColor ?? BRAND_COLORS.headerGradient.start,
      headerGradientEnd: darken(company?.brandSecondaryColor ?? BRAND_COLORS.headerGradient.start),
    },
    email: {
      fromEmail: emailSettings?.fromEmail ?? COMPANY.email.noreply,
      contactFromEmail: emailSettings?.contactFromEmail ?? emailSettings?.fromEmail ?? COMPANY.email.noreply,
      quotationFromEmail: emailSettings?.quotationFromEmail ?? emailSettings?.fromEmail ?? COMPANY.email.noreply,
      replyToEmail: emailSettings?.replyToEmail ?? COMPANY.email.support,
      slaResponseHours: emailSettings?.slaResponseHours ?? 24,
      slaUrgentHours: emailSettings?.slaUrgentHours ?? 4,
      footerDisclaimer: emailSettings?.footerDisclaimer ?? null,
      emailSignatureTemplate: emailSettings?.emailSignatureTemplate ?? null,
    },
    sla: SLA,
  };

  return cachedConfig;
}

// ---------------------------------------------------------------------------
// Shared HTML helpers — accept ResolvedEmailConfig, produce consistent markup
// ---------------------------------------------------------------------------

/**
 * Logo block: real image when logoUrl is set, else brand-coloured initials box.
 */
export function getLogoHtml(config: ResolvedEmailConfig): string {
  const { logoUrl, name } = config.company;
  const { primary } = config.brand;

  if (logoUrl) {
    return `<img src="${logoUrl}" alt="${name}" style="height:56px;width:auto;max-width:200px;object-fit:contain;display:block;margin:0 auto;" />`;
  }

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return `<div style="display:inline-flex;align-items:center;justify-content:center;background:${primary};width:56px;height:56px;border-radius:12px;font-size:22px;font-weight:700;color:#ffffff;margin:0 auto;">${initials}</div>`;
}

/**
 * Consistent email header: gradient bg + logo + company name + tagline.
 * Used by all 6 templates.
 */
export function getSharedHeaderHtml(
  config: ResolvedEmailConfig,
  gradientStart?: string,
  gradientEnd?: string,
): string {
  const start = gradientStart ?? config.brand.headerGradientStart;
  const end = gradientEnd ?? config.brand.headerGradientEnd;

  return `
    <tr>
      <td style="background:linear-gradient(135deg,${start} 0%,${end} 100%);padding:32px 40px;border-radius:12px 12px 0 0;text-align:center;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="padding-bottom:16px;">
              ${getLogoHtml(config)}
            </td>
          </tr>
          <tr>
            <td align="center">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">${config.company.name}</h1>
              <p style="margin:6px 0 0;color:${config.brand.primaryLight};font-size:13px;">${config.company.tagline}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

/**
 * Consistent email footer: disclaimer (from email-setting) + legal name + address.
 */
export function getSharedFooterHtml(
  config: ResolvedEmailConfig,
  variant: "customer" | "business" = "customer",
): string {
  const disclaimer =
    config.email.footerDisclaimer ??
    "This email was sent as part of your interaction with us. Please do not reply directly to this message.";

  if (variant === "business") {
    return `
    <tr>
      <td style="padding:24px 40px;background-color:#f9fafb;border-top:1px solid #e5e7eb;border-radius:0 0 12px 12px;text-align:center;">
        <p style="margin:0;color:#6b7280;font-size:12px;line-height:1.6;">${config.company.name} — Internal Notification</p>
      </td>
    </tr>`;
  }

  return `
    <tr>
      <td style="padding:24px 40px;background-color:#f9fafb;border-top:1px solid #e5e7eb;border-radius:0 0 12px 12px;text-align:center;">
        <p style="margin:0 0 8px;color:#6b7280;font-size:11px;line-height:1.6;">${disclaimer}</p>
        <p style="margin:0;color:#9ca3af;font-size:11px;">&copy; ${config.company.copyrightYear} ${config.company.legalName} | ${config.company.address}</p>
      </td>
    </tr>`;
}
