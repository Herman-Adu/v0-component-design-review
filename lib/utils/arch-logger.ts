/**
 * Architectural Observability Logger
 *
 * Purpose: Validate and prove n-tier architecture boundaries are respected
 * - Data Layer: JSON → Content Builder
 * - Repository Layer: Single source of truth data access
 * - View Model Layer: DTO → UI transformations
 * - Server Component Layer: Data orchestration
 * - Client Component Layer: UI interactivity only
 *
 * Usage: Development-only logging stripped in production builds
 */

type LogLevel = "INFO" | "WARN" | "ERROR";
type Layer = "DATA" | "REPO" | "VIEW" | "PAGE" | "CLNT" | "FEAT";

interface LogEntry {
  layer: Layer;
  level: LogLevel;
  message: string;
  data?: Record<string, unknown>;
  timestamp?: number;
}

const EMOJI_MAP: Record<Layer, string> = {
  DATA: "🗄️ ",
  REPO: "📦",
  VIEW: "🎨",
  PAGE: "🖥️ ",
  CLNT: "⚡",
  FEAT: "🧩",
};

const LEVEL_EMOJI: Record<LogLevel, string> = {
  INFO: "✓",
  WARN: "⚠️ ",
  ERROR: "❌",
};

/**
 * Core logging function with structured format
 */
function log(entry: LogEntry): void {
  // Only log in development
  if (process.env.NODE_ENV === "production") return;

  const { layer, level, message, data } = entry;
  const emoji = EMOJI_MAP[layer];
  const levelEmoji = LEVEL_EMOJI[level];
  const prefix = `[${layer}] ${emoji}`;

  // Color coding based on level
  const style =
    level === "ERROR"
      ? "color: #ef4444; font-weight: bold"
      : level === "WARN"
        ? "color: #f59e0b; font-weight: bold"
        : "color: #10b981";

  if (typeof window === "undefined") {
    // Server-side (Node) - no color, just text
    console.log(`${prefix} ${levelEmoji} ${message}`, data ? data : "");
  } else {
    // Client-side - styled console
    console.log(`%c${prefix} ${levelEmoji} ${message}`, style, data || "");
  }
}

/**
 * Data Layer Logging
 * Validates JSON is single source of truth
 */
export const dataLogger = {
  loadStart(contentType: string, source: string) {
    log({
      layer: "DATA",
      level: "INFO",
      message: `Loading ${contentType} from ${source}`,
    });
  },

  loadComplete(contentType: string, count: number, source: string) {
    log({
      layer: "DATA",
      level: "INFO",
      message: `Loaded ${count} ${contentType} records from ${source}`,
      data: { count, source },
    });
  },

  validationSuccess(contentType: string, count: number) {
    log({
      layer: "DATA",
      level: "INFO",
      message: `✓ Schema validation passed for ${count} ${contentType}`,
    });
  },

  validationError(contentType: string, slug: string, errors: string[]) {
    log({
      layer: "DATA",
      level: "ERROR",
      message: `Schema validation FAILED for ${contentType} "${slug}"`,
      data: { errors },
    });
  },
};

/**
 * Repository Layer Logging
 * Validates single access point for data
 */
export const repoLogger = {
  queryStart(
    repo: string,
    operation: string,
    params?: Record<string, unknown>,
  ) {
    log({
      layer: "REPO",
      level: "INFO",
      message: `${repo}.${operation}()`,
      data: params,
    });
  },

  queryComplete(repo: string, operation: string, resultCount: number | null) {
    log({
      layer: "REPO",
      level: "INFO",
      message: `${repo}.${operation}() → ${resultCount !== null ? `${resultCount} records` : "null"}`,
      data: { resultCount },
    });
  },

  bypassed(file: string, message: string) {
    log({
      layer: "REPO",
      level: "ERROR",
      message: `BOUNDARY VIOLATION: ${file} bypassing repository - ${message}`,
    });
  },
};

/**
 * View Model Layer Logging
 * Validates DTO → ViewModel transformations
 */
export const viewLogger = {
  transform(viewModel: string, sourceType: string, targetType: string) {
    log({
      layer: "VIEW",
      level: "INFO",
      message: `${viewModel}: ${sourceType} → ${targetType}`,
    });
  },

  transformComplete(viewModel: string, count?: number) {
    log({
      layer: "VIEW",
      level: "INFO",
      message: `${viewModel} transformation complete${count ? ` (${count} records)` : ""}`,
    });
  },
};

/**
 * Page Layer Logging (Server Components)
 * Validates server-side data fetching
 */
export const pageLogger = {
  render(route: string, params?: Record<string, unknown>) {
    log({
      layer: "PAGE",
      level: "INFO",
      message: `SERVER RENDER: ${route}`,
      data: params,
    });
  },

  dataFetch(route: string, dataType: string, count: number | null) {
    log({
      layer: "PAGE",
      level: "INFO",
      message: `${route} fetched ${count !== null ? count : "null"} ${dataType}`,
      data: { count },
    });
  },

  staticGeneration(route: string, count: number) {
    log({
      layer: "PAGE",
      level: "INFO",
      message: `generateStaticParams: ${route} → ${count} paths`,
    });
  },

  clientBoundaryViolation(page: string, violation: string) {
    log({
      layer: "PAGE",
      level: "ERROR",
      message: `BOUNDARY VIOLATION: ${page} - ${violation}`,
    });
  },
};

/**
 * Client Component Layer Logging
 * Validates client-only interactivity
 */
export const clientLogger = {
  hydrate(component: string, initialData?: Record<string, unknown>) {
    log({
      layer: "CLNT",
      level: "INFO",
      message: `Hydrating ${component}`,
      data: initialData,
    });
  },

  interaction(
    component: string,
    action: string,
    data?: Record<string, unknown>,
  ) {
    log({
      layer: "CLNT",
      level: "INFO",
      message: `${component}: ${action}`,
      data,
    });
  },

  serverImportViolation(component: string, importPath: string) {
    log({
      layer: "CLNT",
      level: "ERROR",
      message: `BOUNDARY VIOLATION: Client component "${component}" importing server-only module "${importPath}"`,
    });
  },
};

/**
 * Feature Layer Logging
 * Validates feature isolation
 */
export const featureLogger = {
  load(feature: string, dependencies: string[]) {
    log({
      layer: "FEAT",
      level: "INFO",
      message: `Loading feature: ${feature}`,
      data: { dependencies },
    });
  },

  crossImport(fromFeature: string, toFeature: string, file: string) {
    log({
      layer: "FEAT",
      level: "WARN",
      message: `CROSS-FEATURE IMPORT: ${fromFeature} importing from ${toFeature} (${file})`,
    });
  },
};

/**
 * General boundary violation reporter
 */
export function reportViolation(
  layer: Layer,
  violation: string,
  details?: Record<string, unknown>,
) {
  log({
    layer,
    level: "ERROR",
    message: `ARCHITECTURE VIOLATION: ${violation}`,
    data: details,
  });
}

/**
 * Architecture health check summary
 */
export function logArchitectureSummary(stats: {
  totalRecords: number;
  sourceFiles: number;
  violations: number;
}) {
  const level: LogLevel = stats.violations > 0 ? "WARN" : "INFO";
  log({
    layer: "DATA",
    level,
    message: `Architecture Health: ${stats.totalRecords} records from ${stats.sourceFiles} files, ${stats.violations} violations`,
    data: stats,
  });
}
