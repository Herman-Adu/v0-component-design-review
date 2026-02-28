# Phase 7: Digital Marketing Extraction & Refactor - Notes and Learnings

## Executive Summary

Phase 7 extracted digital-marketing data into Strapi-style JSON mocks and refactored key pages to consume those JSON sources. After fixing script insertion logic and data paths, the build completed cleanly with no errors.

---

## Wins

1. **Clean separation of data and UI**
   - Digital marketing data now lives in `/data/strapi-mock/digital-marketing` and `/data/strapi-mock/platforms`.
   - Pages consume JSON via stable keys (`tools`, `ecosystem`, `journeys`, `quickChecklist`, etc.).

2. **Icon handling standardized**
   - JSON stores icon names as strings.
   - Pages map icons through `iconMap` with null-guards to avoid runtime crashes.

3. **Scripted refactor is repeatable**
   - Refactor script now inserts imports safely and only when corresponding arrays exist.
   - Import path mapping aligns with actual folder structure.

4. **Build verification passed**
   - `pnpm build` completed successfully after fixes.

---

## What Needed Improvement (and Was Fixed)

1. **Import insertion broke `"use client"` placement**
   - Root cause: import regex required semicolons, so insertion happened at position 0 and concatenated with `"use client"`.
   - Fix: insertion now detects `"use client"` and last import line (with or without semicolons).

2. **Incorrect JSON import paths**
   - Root cause: script used `overview/` and `platforms/google/` paths that don’t exist.
   - Fix: updated paths to `platforms/` and `digital-marketing/...`.

3. **JSON shape mismatched page expectations**
   - Journeys data lacked `icon`, `color`, and structured `steps`.
   - Fix: journeys JSON updated to include icon strings, color tokens, and step objects with `title`, `desc`, and `href`.

4. **Icon strings rendered as components**
   - Root cause: pages were still rendering `tool.icon` directly.
   - Fix: added icon maps + safe rendering guards.

---

## Best Practices Going Forward

1. **Always validate JSON schema against component usage**
   - If a component expects `icon`, `color`, `steps[].href`, ensure JSON provides them.

2. **Insert imports safely**
   - Detect `"use client"` first, then insert after the final import line.
   - Avoid assumptions about semicolons.

3. **Keep data paths consistent and centralized**
   - Prefer a single source of truth for JSON folders (`digital-marketing/`, `platforms/`).

4. **Guard icon rendering**
   - Use `iconMap` + null checks (`Icon ? <Icon /> : null`).

5. **Only add imports when data exists**
   - Script should skip unused arrays to avoid unnecessary or broken imports.

---

## Files of Interest

- Scripts:
  - `scripts/phase7-extract-digital-marketing-data.js`
  - `scripts/phase7-refactor-digital-marketing-pages.js`
- Data:
  - `data/strapi-mock/digital-marketing/**`
  - `data/strapi-mock/platforms/**`
- Reports:
  - `data/phase7-extraction-report.md`
  - `data/phase7-refactor-report.md`
