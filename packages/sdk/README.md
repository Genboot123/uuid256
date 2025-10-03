<div align="center">

<h1>uuid256 (SDK)</h1>

<p>UUID‑canonical SDK with a bridge to EVM `uint256` tokenId (lower 128 bits)</p>

<p>
  <a href="https://github.com/posaune0423/uuid256/actions/workflows/test-sdk.yml">
    <img alt="CI" src="https://github.com/posaune0423/uuid256/actions/workflows/test-sdk.yml/badge.svg" />
      </a>
      <a href="https://www.npmjs.com/package/u256id">
        <img src="https://img.shields.io/npm/v/u256id.svg" alt="npm package" />
      </a>
  </p>
</div>

This SDK treats UUID v7 as the sole canonical ID and bridges to EVM `uint256`
by packing the UUID into the lower 128 bits (upper 128 bits fixed to zero).

Why: keep Web2 compatibility (UUID as primary key, existing DB tooling) while
remaining interoperable with ERC‑721/1155 `tokenId`.

- Contracts: `packages/contracts` (see `Uuid256.sol`)
- SDK (Deno/TypeScript): `packages/sdk` (this package)
- Examples: `packages/examples`

## Bridge rule

```
tokenId = uint256(uint128(uuid_bytes16))
// upper 128 bits MUST be zero
```

## Install

- npm (Node/Bun): `npm i u256id`
- Deno (npm specifier): `import { uuid256 } from "npm:u256id"` or from your bundler

## Quick start

```ts
import { uuid256 } from "u256id";

// UUID v7 generation (canonical)
const uuid = uuid256.generateUuidV7();

// Bridge to uint256 (0x + 64 hex, upper 128 bits = 0)
const tokenId = uuid256.uuidToU256(uuid);

// Reverse bridge (validates upper 128 bits are zero)
const back = uuid256.u256ToUuid(tokenId);
```

Node CJS with WebCrypto injection (if needed):

```js
const { uuid256 } = require("u256id");
const { webcrypto } = require("node:crypto");
uuid256.setCrypto(webcrypto);
```

## API

- `generateUuidV7(): Uuid`
  - Create a UUID v7 string (`8-4-4-4-12`, lowercase). Uses CSPRNG.
- `isUuid(s: string): s is Uuid`
- `asUuid(s: string): Uuid` — throws `INVALID_UUID_FORMAT` on failure
- `uuidToU256(uuid: string): U256Hex`
  - Returns canonical `0x` + 64 lowercase hex; upper 128 bits are zero.
- `u256ToUuid(id: string): Uuid`
  - Throws `INVALID_U256_FORMAT` if not `0x+64hex`, and `UPPER128_NOT_ZERO` if the upper 128 bits are non‑zero.
- `setCrypto(crypto: Crypto): void`
  - Provide WebCrypto (Node environments that lack `globalThis.crypto`).

## Spec (normative summary)

- Canonical ID: UUID v7 (MUST)
- On‑chain generation: disallowed (MUST NOT)
- Bridge `uint256`: upper 128 bits = 0, lower 128 bits = UUID (MUST)
- API input: MAY accept `0x+64hex`; MUST validate `upper128 == 0` before reverse bridging
- API output: UUID (MUST), with optional `uint256` companion (MAY)

## Examples

See `packages/examples` for Node, Browser, Bun, and Edge workers.

## Security considerations

- Use CSPRNG (`crypto.getRandomValues`) (MUST)
- Always validate the upper 128 bits before reverse bridging (MUST)

— Reference: RFC 2119
