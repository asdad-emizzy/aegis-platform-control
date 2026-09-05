# Security Remediation

## Objective

Remediate the currently reported repository security findings by fixing their actual root causes — not by suppressing scanner output. This was a dedicated Security Remediation Phase, separate from and prior to any resumption of Slice 11 (which was explicitly out of scope).

## Baseline

Reproduced with the same tooling that produced the original report (`secscan:v0.3`, wrapping `semgrep`, `osv-scanner`, `gitleaks`, `trivy`, `syft`, `grype`):

```text
Security Issues: 125
Occurrences:     126
CRITICAL   3
HIGH       74
MEDIUM     44
LOW        4
Security Status: FAILED
EXIT_CODE=1
```

## Findings Classification

| # | Root cause | Category | Findings covered |
|---|---|---|---|
| 1 | `@babel/core@7.29.0` (transitive, via `@tanstack/router-plugin`, `@tanstack/start-plugin-core`, `@vitejs/plugin-react`) — arbitrary source-map file read (CVE-2026-49356) | Transitive dependency vulnerability | 1 |
| 2 | `brace-expansion@1.1.14` (transitive, via `minimatch@3.1.5` ← `eslint`) and `brace-expansion@5.0.5` (transitive, via `minimatch@10.2.5` ← `@typescript-eslint/typescript-estree`) — exponential-time DoS (CVE-2026-13149), duplicated across 2 resolved versions × multiple GHSA IDs | Transitive dependency vulnerability, duplicate scanner reports | 6 (dev-only) |
| 3 | `browserslist@4.28.2` (transitive, via `@babel/helper-compilation-targets` ← `@babel/core`) — prototype-pollution crash (GHSA-73wf) and unbounded cache growth (GHSA-c83g) | Transitive dependency vulnerability | 4 |
| 4 | `js-yaml@4.1.1` (transitive, via `@eslint/eslintrc` ← `eslint`) — three separate quadratic-CPU DoS advisories (`!!omap` resolution, merge-key chains, repeated merge aliases) | Transitive dependency vulnerability, duplicate osv-scanner/trivy report for one GHSA | 4 |
| 5 | `nanoid@3.3.12` (transitive, via `postcss` ← `vite`) — infinite loop on zero/negative size | Transitive dependency vulnerability | 2 |
| 6 | `postcss@8.5.15` (transitive, via `vite`) — two source-map path-traversal advisories (one an incomplete fix of the other) | Transitive dependency vulnerability | 2 |
| 7 | `esbuild@0.25.12` bundled Go toolchain (`stdlib@go1.23.12`), reached via the platform binary `@esbuild/darwin-arm64/bin/esbuild` — dozens of `grype` CVE/GO- findings against the *embedded Go standard library* used to compile esbuild's native binary, not against esbuild's own JS-visible behavior; plus one esbuild-specific advisory (GHSA-g7r4, Windows dev-server path traversal) present in the separately-resolved nested `esbuild@0.27.7` (via `tsx`) | **Bundled/toolchain vulnerability** (consolidated root cause — one outdated Go toolchain used to build multiple esbuild releases) | ~105 (single consolidated remediation) |
| 8 | `bunfig.toml` `minimumReleaseAge = 86400` (24h) below Semgrep's recommended 7-day / 604800s threshold | Configuration/security-policy finding | 1 |

Duplicate-finding note: `GHSA-5p4m-2wfm-xmqj` (js-yaml) was reported by both `osv-scanner` and `trivy` for the same package/version — counted once as a root cause, not twice.

## Root Causes

1. **esbuild's bundled Go toolchain** was the single largest cluster (~105 of 126 occurrences, including all 3 CRITICAL findings). `grype` scans the *compiled Go standard library embedded inside esbuild's native binary* — every esbuild release ships a Go-compiled executable, and `grype` flags every known Go stdlib CVE against whatever Go version that binary was built with, regardless of whether esbuild's own JavaScript-facing behavior is affected. esbuild 0.25.12 (top-level, resolved as an optional peer of `vite@8.0.16`) and the separately-resolved nested esbuild 0.27.7 (a hard dependency of `tsx`, itself an optional peer of `vite`) were both built with outdated Go toolchains. esbuild 0.27.0+ updated its Go compiler from 1.23.12 → 1.25.4, and 0.28.0 updated it again to 1.26.1 — each release closing the accumulated stdlib CVEs. Upgrading the resolved esbuild version therefore replaces the vulnerable bundled binary and resolves the entire cluster in one action; no manual patching of Go internals was performed or needed.
2. **Five npm-published JS dependencies were behind their available patched versions**: `@babel/core`, `browserslist`, `js-yaml`, `nanoid`, `postcss`. None are declared directly in `package.json` — all are metadependencies pulled in transitively by build/dev tooling (`@tanstack/router-plugin`, `@vitejs/plugin-react`, `eslint`, `vite`). Each vulnerable version was already superseded by a patched release on the same major/minor line, so no direct dependency's own version needed to change.
3. **`brace-expansion`** is a further-nested transitive dependency of `minimatch`, itself pulled in by `eslint` (3.x line) and `@typescript-eslint/typescript-estree` (10.x line). Both resolved versions (1.1.14 and 5.0.5) predated the same upstream DoS fix.
4. **`bunfig.toml`'s `minimumReleaseAge`** was configured at 24 hours, which Semgrep's `bun-missing-minimum-release-age` rule flags as insufficient — the rule's own remediation message recommends 604800 seconds (7 days) specifically because malicious or compromised npm releases are most often caught and unpublished within the first week.

## Remediation Performed

All fixes were applied as **minimum-safe version bumps** via npm-style `overrides` in `package.json` (Bun supports `"overrides"` the same as npm), targeting the exact vulnerable packages without upgrading any direct dependency's own declared range and without a broad `bun update`. No package was deleted, no lockfile line was hand-edited, and no scanner/rule was disabled.

| Package | Before | After | Type |
|---|---|---|---|
| `esbuild` (all resolutions) | `0.25.12`, `0.27.7` | `0.28.2` | Toolchain (Go 1.23.12 → 1.26.x); resolves the entire `stdlib@go1.23.12` grype cluster and the esbuild-specific Windows path-traversal advisory |
| `@babel/core` | `7.29.0` | `7.29.7` | Transitive |
| `browserslist` | `4.28.2` | `4.28.8` | Transitive |
| `js-yaml` | `4.1.1` | `4.3.2` | Transitive |
| `nanoid` | `3.3.12` | `3.3.18` | Transitive |
| `postcss` | `8.5.15` | `8.5.26` (satisfies `^8.5.23`) | Transitive |
| `brace-expansion` | `1.1.14` / `5.0.5` | `1.1.18` (both consumers hoisted to this patched 1.x release) | Transitive, dev-only |

`postcss@^8.5.23` was deliberately chosen over the newest `8.5.28` because `8.5.28` was published only 1 day before this remediation — installing it would have violated the corrected 7-day `minimumReleaseAge` guard. `8.5.23` is the oldest release that already contains both PostCSS source-map security fixes and is well past the 7-day threshold.

The lockfile was regenerated with `bun install` (full clean reinstall, i.e. `rm -rf node_modules bun.lock && bun install`) rather than hand-edited, per the mandatory dependency remediation rules. A single top-level `brace-expansion` override (rather than a nested/parent-scoped override) was used deliberately: Bun's nested-override syntax requires bumping `lockfileVersion` to 3, which triggered a much larger, unrelated dependency churn (many transitive dev-tool versions moving) when tested. The simpler top-level override achieves the same security outcome — both `minimatch@3` and `minimatch@10` consumers hoist to the single patched `brace-expansion@1.1.18` install — with a minimal, reviewable lockfile diff, confirmed not to break `eslint`/`typescript-eslint` (see Validation).

## Dependency Changes

`package.json` — added an `"overrides"` block (no existing dependency ranges changed):

```jsonc
"overrides": {
  "esbuild": "^0.28.2",
  "@babel/core": "^7.29.7",
  "browserslist": "^4.28.8",
  "js-yaml": "^4.3.2",
  "nanoid": "^3.3.18",
  "postcss": "^8.5.23",
  "brace-expansion": "^1.1.16"
}
```

`bun.lock` — regenerated to reflect the overridden resolutions above. Diff is scoped to: the seven overridden packages, their own transitive dependencies that necessarily moved with them (e.g. `browserslist`'s `caniuse-lite`, `electron-to-chromium`, `node-releases`, `update-browserslist-db`; the platform-specific `@esbuild/*` binaries), and the `esbuild@0.27.7` nested resolution under `tsx` moving to `0.28.2`. No unrelated package changed version.

## Configuration Changes

`bunfig.toml` — `install.minimumReleaseAge` raised from `86400` (24h) to `604800` (7 days), matching Semgrep's `bun-missing-minimum-release-age` rule recommendation exactly. The existing `minimumReleaseAgeExcludes` allowlist (`@lovable.dev/*` packages) was left unchanged — no new exclusions were added, and no package was force-installed by bypassing this guard.

## Validation

| Check | Result |
|---|---|
| `bun install` | PASS — clean install, 424 packages, no resolution errors |
| `tsc --noEmit` | PASS — no errors |
| `bun run build` | PASS — Vite/Nitro build completed successfully |
| `bun run lint` | Same 96 pre-existing errors / 9 warnings as before remediation (confirmed via `git stash` comparison) — all pre-existing Prettier formatting complaints in files untouched by this remediation; **no new lint errors introduced** |
| Tests | NOT APPLICABLE — no test script/framework exists in `package.json` (unchanged from prior slices) |
| `eslint` smoke test against `src/lib/incidents.ts` | PASS — ran successfully using the hoisted `brace-expansion@1.1.18`, confirming no breakage from the version-range mismatch with `minimatch@10`'s declared `^5.0.5` |

## Security Scan Before

```text
Security Issues: 125
Occurrences:     126
CRITICAL   3
HIGH       74
MEDIUM     44
LOW        4
Security Status: FAILED
EXIT_CODE=1
```

## Security Scan After

Re-ran the identical scan command (`secscan:v0.3 scan /workspace --fail-on high`) against the remediated repository:

```text
Security Issues: 0
Occurrences:     0

semgrep      SUCCESS
osv-scanner  SUCCESS
gitleaks     SUCCESS
trivy        SUCCESS
syft         SUCCESS
grype        SUCCESS

Security Status: PASSED
EXIT_CODE=0
```

## Security Delta

```text
Critical: 3 → 0
High:     74 → 0
Medium:   44 → 0
Low:       4 → 0
Total:   125 → 0
Status:  FAILED → PASSED
```

## Resolved Root Causes

- esbuild bundled Go toolchain (all `stdlib@go1.23.12` grype findings, ~105 occurrences, all 3 CRITICAL findings) — resolved by upgrading esbuild to `0.28.2`.
- `@babel/core` arbitrary source-map read — resolved.
- `brace-expansion` exponential-time DoS (both 1.x and 5.x resolutions) — resolved.
- `browserslist` prototype-pollution crash and unbounded cache growth — resolved.
- `js-yaml` quadratic-CPU DoS (all three advisories) — resolved.
- `nanoid` infinite-loop DoS (both advisories) — resolved.
- `postcss` source-map path traversal (both advisories) — resolved.
- `bunfig.toml` insufficient `minimumReleaseAge` — resolved (24h → 7 days, matching the Semgrep rule's own recommendation).

## Remaining Findings

None. The full scan (`semgrep`, `osv-scanner`, `gitleaks`, `trivy`, `syft`, `grype`) reports 0 findings across all severities after remediation.

## Risk Assessment

No remaining Critical or High findings to assess. All identified vulnerabilities were in build-time/dev-time tooling (bundler, transpiler, linter, CSS processor) rather than runtime application dependencies — the Aegis production bundle does not execute `esbuild`, `@babel/core`, `js-yaml`, or `eslint`'s dependency tree at runtime; these tools operate only during `bun install`, `bun run build`, `bun run dev`, and `bun run lint`. This reduces the production blast radius of the (now-remediated) findings, though the risk to CI/CD integrity, developer environments, and build-artifact supply-chain security was still real and is why remediation was performed rather than deferred, per the "development dependencies still matter" instruction.

## Deferred Work

None identified. Every reported finding was remediated with a root-cause fix; no finding required a documented "not currently remediable" exception.

## Conclusion

All 125 reported security findings (126 occurrences) were resolved through seven targeted, minimum-safe dependency version overrides plus one configuration correction — no scanner was disabled, no finding was suppressed, no unrelated dependency was upgraded, and no Aegis application/architecture code was touched. The largest single cluster (the esbuild bundled Go toolchain, accounting for ~105 occurrences and all 3 CRITICAL findings) was correctly diagnosed as one consolidated root cause rather than dozens of independent application vulnerabilities, and resolved by a single esbuild version bump. Build, TypeScript, and lint validation confirm no regression was introduced. The repository's security scan now reports `PASSED` with 0 findings across all six scanners.
