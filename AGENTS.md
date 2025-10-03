# Repository Guidelines

## Project Structure & Module Organization
- Root `packages/` hosts two workspaces: `contracts/` for Solidity sources and `sdk/` for the Deno TypeScript client.
- `packages/contracts/src/` contains deployed contracts such as `U256ID.sol`; supporting scripts live in `script/`, while Foundry tests reside in `test/*.t.sol`.
- `packages/sdk/src/` holds the public API (`u256id.ts`, `main.ts`); unit tests live under `packages/sdk/tests/` with `*_test.ts` suffixes.
- Shared vendored dependencies for Foundry live in `packages/contracts/lib/`. Avoid editing them directly—update via `forge install` if needed.

## Build, Test, and Development Commands
- `forge build` compiles all Solidity contracts and verifies bytecode.
- `forge test` executes the Foundry suite in `packages/contracts/test/`.
- `forge fmt` auto-formats Solidity sources; run before opening a PR.
- `deno test packages/sdk` runs the TypeScript tests, including crypto helpers.
- `deno task dev` (from `packages/sdk/`) starts a watch-mode runner for manual experimentation.

## Coding Style & Naming Conventions
- Solidity: target compiler version defined in `foundry.toml`; keep functions/orderings consistent with existing files and prefer explicit visibility. Always run `forge fmt` (4-space indentation, lowercase hex literals).
- TypeScript: rely on the Deno toolchain—run `deno fmt` and `deno lint` before committing. Exported types/interfaces use PascalCase, functions lowerCamelCase, constants UPPER_SNAKE_CASE. Keep modules free of ambient globals; prefer pure functions.

## Testing Guidelines
- Solidity tests should mirror production contract names (`ContractName.t.sol`) and cover revert paths plus gas-sensitive scenarios (capture with `forge snapshot` when relevant).
- TypeScript tests live under `packages/sdk/tests/` using Deno’s built-in test runner; structure names as `describe("module")` with clear assertion messages. Add regression cases for boundary IDs (e.g., version nibble, zero values).
- Run both `forge test` and `deno test packages/sdk` locally before pushing.

## Commit & Pull Request Guidelines
- Existing history (`Initial commit`) follows a short, imperative headline—keep that style (≤72 chars), optionally prefixed with scope when helpful (`sdk: add v1 generator`).
- Reference related issues in the body, note any protocol or storage migrations, and summarize test output.
- Pull requests should describe contract or SDK surface changes, list manual verification steps, and include screenshots/logs if front-end or CLI output changes.
