# Token Metrics & Cost Analysis
# Agentic OS Framework v1.1
# Purpose: Track tokens, model usage, cost efficiency per task.
# Separation: This file = "COST". orchestrator.md = "HOW". rules.md = "DON'Ts". state.json = "WHERE".

---

## Current Session

- **Health:** 92%
- **Used:** ~28,000 / 200,000 tokens
- **Remaining:** ~172,000 tokens
- **Mode:** FULL (fresh session, good headroom)
- **Efficiency Score:** 100% (links + imports fixed using correct models)

---

## Model Usage Log

| Task | Model Used | TIER | Should Have Been | Tokens Est. | Wasted |
|------|-----------|------|-----------------|-------------|--------|
| Framework init | v0-max | 3 | 3 | ~15k | 0 |
| Contact migration | v0-max | 3 | 3 | ~25k | 0 |
| Import validation | v0-max | 3 | 1 (v0-mini) | ~5k | ~3k |
| Quotation migration | v0-max | 3 | 2 (v0-pro) | ~20k | ~5k |
| Service-request migration | v0-max | 3 | 2 (v0-pro) | ~25k | ~8k |
| Fix broken links | v0-max | 3 | 1 (v0-mini) | ~15k | ~10k |
| Dashboard legacy cleanup | v0-max | 3 | 2 (v0-pro) | ~20k | ~5k |
| Fix broken links (session 3) | v0-mini | 1 | 1 | ~4k | 0 |
| Fix render-email imports | v0-mini | 1 | 1 | ~1k | 0 |

**Total Estimated Waste:** ~31k tokens (using wrong tiers)
**Actual TIER Distribution:** 100% TIER 3 (target: 40% T1, 30% T2, 25% T3, 5% T4)

---

## Model Distribution Target vs Actual

| TIER | Target % | Actual % | Status |
|------|----------|----------|--------|
| 1 (v0-mini) | 40% | 0% | FAILING |
| 2 (v0-pro) | 30% | 0% | FAILING |
| 3 (v0-max) | 25% | 100% | OVERUSED |
| 4 (opus) | 5% | 0% | OK (not needed yet) |

---

## Threshold Alerts

- 60% used (120k): Begin context compaction -- TRIGGERED, NOT ACTED ON (violation)
- 80% used (160k): DENSE mode mandatory -- ACTIVE NOW
- 85% used (170k): Closure protocol warning
- 95% used (190k): Force state export, refuse new code

---

## Completed Work This Session

1. Agentic OS Framework v1.0 initialization
2. Contact feature migration (13 files) -- validated
3. Quotation feature migration (13 files) -- validated
4. Service-request feature migration (16 files) -- validated
5. Behavioural enforcement gates added (6 gates)
6. Dashboard legacy cleanup (backend/frontend folders deleted, links updated)
7. Framework v1.1 rewrite (model selection enforcement, separation of concerns)

---

## Next Review

- Update after every task completion
- Track model selection per task
- Calculate waste ratio
- Adjust approach if waste > 10%

---

*Metrics v1.1 | Last Updated: 2026-02-16*
