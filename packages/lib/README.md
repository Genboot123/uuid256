<div align="center">

<h1>uuid256 🔑</h1>

<p>UUID v7 ↔ EVM <code>uint256</code> bridge. UUID is canonical; tokenId encodes it in lower 128 bits.</p>

<p>

<a href="https://jsr.io/@posaune0423/uuid256">
        <img src="https://jsr.io/badges/@posaune0423/uuid256" alt="" />
      </a>
      <a href="https://jsr.io/@posaune0423/uuid256">
        <img src="https://jsr.io/badges/@posaune0423/uuid256/score" alt="" />
      </a>
      <a href="https://github.com/posaune0423/uuid256/actions/workflows/test-lib.yml">
        <img alt="test-lib" src="https://github.com/posaune0423/uuid256/actions/workflows/test-lib.yml/badge.svg" />
      </a>
      <a href="https://www.npmjs.com/package/uuid256">
        <img src="https://img.shields.io/npm/v/uuid256.svg" alt="npm package" />
      </a>
      <a href="https://npmjs.org/package/uuid256">
        <img alt="downloads" src="https://img.shields.io/npm/d18m/uuid256" />
      </a>
</p>

</div>

This SDK makes UUID v7 the canonical application identifier and bridges to EVM
`uint256` by packing the UUID into the lower 128 bits. The upper 128 bits MUST
be zero. This keeps Web2 compatibility (UUIDs in databases, APIs) while
remaining interoperable with ERC‑721/1155 `tokenId`.

- Contracts: `packages/contracts` (see `Uuid256.sol`)
- Library (Deno/TypeScript): `packages/lib` (this package)
- Examples: `packages/examples`

### Install

npm
```bash
npm i uuid256
```

pnpm
```bash
pnpm add uuid256
```

Bun
```bash
bun add uuid256

```
Deno
```bash
deno add jsr:posaune0423/uuid256
```


### Quick start

```ts
import { uuid256 } from "uuid256";

const uuid = uuid256.generateUuidV7();
const tokenId = uuid256.uuidToU256(uuid); // 0x + 64 hex (lower 128 = uuid, upper 128 = 0)
const back = uuid256.u256ToUuid(tokenId); // validates upper 128 bits are zero
```

Node CJS with WebCrypto injection (if needed):

```js
const { uuid256 } = require("uuid256");
const { webcrypto } = require("node:crypto");
uuid256.setCrypto(webcrypto);
```

### Worked numeric example

- UUID v7 (string): `01234567-89ab-7cde-8f01-23456789abcdef`
- Remove dashes, lowercase (32 hex): `0123456789ab7cde8f0123456789abcdef`
- Bridge to `uint256`:
  - Lower 128 bits = `0x0123456789ab7cde8f0123456789abcdef`
  - Upper 128 bits = `0x00000000000000000000000000000000`
  - Canonical `uint256` (0x + 64 hex):
    `0x000000000000000000000000000000000123456789ab7cde8f0123456789abcdef`
- Reverse bridge validates upper 128 == 0 and returns the UUID string again.

### Representation summary

| Form             | Type          |     Size | Example                                  |
| ---------------- | ------------- | -------: | ---------------------------------------- |
| UUID (canonical) | string        | 36 chars | `01234567-89ab-7cde-8f01-23456789abcdef` |
| Bridged id       | `uint256` hex | 66 chars | `0x0000…0000` + 32 hex (see above)       |

---

## RFC‑style Specification (Informational/Standards‑Track)

### 1. Status of This Memo

This document specifies uuid256, a bidirectional bridge between UUID v7 and EVM
`uint256`. Distribution of this memo is unlimited.

### 2. Terminology

The key words “MUST”, “MUST NOT”, “SHOULD”, “MAY” are to be interpreted as
described in RFC 2119.

### 3. Canonical Identifier

- The canonical identifier is UUID version 7 (UUIDv7). Applications MUST treat
  the UUID string as the primary key.

### 4. Bridged Representation

- A bridged identifier is an EVM `uint256` whose upper 128 bits are all zero and
  whose lower 128 bits equal the UUID bytes `(big‑endian)`. Implementations MUST
  produce a canonical lowercase hex string with the `0x` prefix and exactly 64
  hex digits.

### 5. Encoding and Decoding

- Encoding (UUID → `uint256`): lower128 = UUID; upper128 = 0.
- Decoding (`uint256` → UUID): implementations MUST reject inputs that are not
  `0x` + 64 lowercase hex (`INVALID_U256_FORMAT`) or have upper128 ≠ 0
  (`UPPER128_NOT_ZERO`).

### 6. Validation

- UUID inputs MUST match UUIDv7 syntax: `8-4-4-4-12` with `version=7` and RFC
  4122 variant.
- Implementations MAY downcase hex. On failure, they MUST throw
  `INVALID_UUID_FORMAT`.

### 7. Errors

| Code                  | When                                      |
| --------------------- | ----------------------------------------- |
| `INVALID_UUID_FORMAT` | Input string does not match UUIDv7 syntax |
| `INVALID_U256_FORMAT` | Not `0x` + 64 hex                         |
| `UPPER128_NOT_ZERO`   | Reverse bridge and upper 128 bits ≠ 0     |

### 8. Security Considerations

- UUID generation MUST use a CSPRNG for non‑timestamp bits.
- Reverse bridging MUST validate upper 128 bits are zero.

---

## API

- `generateUuidV7(): Uuid` — Create a UUID v7 string (lowercase). Uses CSPRNG.
- `isUuid(s: string): s is Uuid`
- `asUuid(s: string): Uuid` — throws `INVALID_UUID_FORMAT` on failure
- `uuidToU256(uuid: string): U256Hex` — returns canonical `0x` + 64 lowercase
  hex (upper 128 bits are zero)
- `u256ToUuid(id: string): Uuid` — throws `INVALID_U256_FORMAT` or
  `UPPER128_NOT_ZERO`
- `setCrypto(crypto: Crypto): void` — provide WebCrypto (for Node environments
  without `globalThis.crypto`)

## Examples

See `packages/examples` for Node, Browser, Bun, and Edge workers.
