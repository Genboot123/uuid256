# Repository Guidelines

## Project Structure & Module Organization
The monorepo lives under `packages/`. `packages/lib` holds the Deno/TypeScript SDK; production code is under `src/uuid256` with public exports in `mod.ts`, and unit tests in `tests/`. `packages/contracts` hosts the Foundry project (`src/` for Solidity, `test/` for Forge tests, `script/` for deployment helpers); run all Forge commands from this directory because `out/` and `.env` are localized there. Sample consumers live in `packages/examples/*` (Node, Browser, Bun, Edge) and expect the npm bundle produced in `packages/lib/npm/`.

## Build, Test, and Development Commands
From `packages/lib`: use `deno test` for the SDK suite, `deno lint` before pushing, and `deno fmt` to apply formatting. Generate the npm distribution with `deno run -A scripts/build_npm.ts`, then link examples with `npm install` inside each example. For iterative development run `deno task dev` to watch `src/`. From `packages/contracts`: `forge build` compiles contracts, `forge test` runs Solidity tests, `forge snapshot` captures gas metrics, and `forge fmt` enforces formatting.

## Coding Style & Naming Conventions
TypeScript modules follow Deno defaults: 2-space indent, ESM imports, and camelCase functions (`uuidToU256`). Export barrels live in `mod.ts` files. Prefer explicit return types for exported APIs and narrow types via helper guards like `asUuid`. Solidity contracts target the compiler settings in `foundry.toml`; use `Uint256` naming and keep storage/public functions in PascalCase per current sources.

## Testing Guidelines
Keep SDK specs under `packages/lib/tests`, mirroring the module path (`uuid256/mod.test.ts`). For regressions add descriptive `test("behavior", ...)` blocks using BDD helpers from `@std/testing`. Foundry tests belong in `packages/contracts/test` and should assert canonical bridging invariants; snapshot expensive operations when possible. Collect coverage with `deno test --coverage=coverage` or `forge coverage` if you need metrics before a release.

## Commit & Pull Request Guidelines
Follow the existing conventional prefix style (`docs:`, `chore:`, `feat:`) and write imperative subject lines under 72 characters. Group related changes per commit—SDK code and Solidity updates usually land separately. Pull requests should summarize behavioral changes, link any tracking issues, list manual/automated test commands (`deno test`, `forge test`), and include screenshots or transaction hashes when touching deployment scripts.

## Security & Configuration Tips
Never commit private keys or `.env`; use `.env.example` in `packages/contracts` as the template. Validate that bridged IDs keep upper 128 bits zero before interacting with live chains, and document any new error codes or revert reasons in the README to aid downstream integrators.
