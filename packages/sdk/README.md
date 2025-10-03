<div align="center">

<h1>U256ID</h1>

<p>U256ID v2 (canonical: 0x + 64 hex; HR: Base58; versions: v0, v1)</p>

<p>
      <a href="https://jsr.io/@posaune0423/u256id">
        <img src="https://jsr.io/badges/@posaune0423/u256id" alt="" />
      </a>
      <a href="https://jsr.io/@posaune0423/u256id">
        <img src="https://jsr.io/badges/@posaune0423/u256id/score" alt="" />
      </a>
      <a href="https://github.com/posaune0423/u256id/actions/workflows/test-sdk.yml">
        <img alt="CI" src="https://github.com/posaune0423/u256id/actions/workflows/test-sdk.yml/badge.svg" />
      </a>
      <a href="https://www.npmjs.com/package/u256id">
        <img src="https://img.shields.io/npm/v/u256id.svg" alt="npm package" />
      </a>
      <a href="https://npmjs.org/package/u256id">
        <img alt="downloads" src="https://img.shields.io/npm/d18m/u256id" />
      </a>
  </p>
</div>

U256ID is a 256-bit identifier (uint256) with strict, interoperable encoding and
validation rules.

- Specification: see the normative Usage Specification below (MUST/SHOULD/MAY).
- Repos:
  - Contracts: `packages/contracts`
  - SDK (Deno/TypeScript): `packages/sdk`

Quick start:

- Build contracts: `forge build`
- Test contracts: `forge test`
- SDK tests: `deno test packages/sdk`
- Examples: `packages/examples` contains runnable scripts
- Examples: see `packages/examples` (moved out of runtime)

## U256ID — Usage Specification (Normative)

This document defines the strict usage specification for U256ID. Implementations
that follow this specification ensure interoperability.

### 1. Terms and Normative Words

We follow [RFC 2119]; MUST / MUST NOT / SHOULD / SHOULD NOT / MAY are used as
normative words.

- **U256ID**: A specification that uses a 256-bit unsigned integer (uint256) as
  an identifier.
- **Canonical ID**: Text form that represents a uint256 as `0x` + 64 lowercase
  hex digits.
- **HR (Base58) form**: Human‑readable Base58 form (includes prefix `u2:`).
- **Short display**: Abbreviated display (`u2s:<head8>…<tail8>`). Not acceptable
  as input.
- **Version nibble**: The top 4 bits indicating the version of the ID.
  - **v0**: Pure randomness (`vvvv = 0000b`).
  - **v1**: Time‑sortable (`vvvv = 0001b`) with the field layout described
    below.

Note: Generation MUST always happen off‑chain. On‑chain random generation is
unsafe.

### 2. Data Model

#### 2.1 Bit layout (common)

| Bit position (MSB→LSB) | Len | Name    | Description                         |
| ---------------------- | --- | ------- | ----------------------------------- |
| 255..252               | 4   | version | Top 4 bits. `0x0 = v0`, `0x1 = v1`. |
| 251..0                 | 252 | payload | Version‑specific fields.            |

#### 2.2 v0: Random

| Field   | Pos      | Len | Value/Meaning                    |
| ------- | -------- | --- | -------------------------------- |
| version | 255..252 | 4   | `0000b`                          |
| R       | 251..0   | 252 | 252‑bit randomness from a CSPRNG |

#### 2.3 v1: Time‑sortable

| Field   | Pos      | Len | Value/Meaning                                                                |
| ------- | -------- | --- | ---------------------------------------------------------------------------- |
| version | 255..252 | 4   | `0001b`                                                                      |
| T       | 251..204 | 48  | Unix time (ms), range `[0, 2^48-1]`                                          |
| N       | 203..172 | 32  | NodeID. Fixed per process/node (randomized at start or configured)           |
| C       | 171..156 | 16  | Monotonic counter within the same ms (`+1`); wrapping at `0xffff` is allowed |
| R       | 155..0   | 156 | Additional randomness (CSPRNG) to reduce collision risk in distributed gen   |

### 3. Representations

#### 3.1 Canonical

- **Form**: `0x` + 64 lowercase hex digits.
- **Regex**:

```
^0x[0-9a-f]{64}$
```

- **Endianness**: big‑endian (string head is MSB).
- **Rules**:
  - Canonical MUST be the basis for all storage, comparison, signing, and API
    I/O.
  - Implementations MUST reject mixed‑case hex and normalize to lowercase.

#### 3.2 HR (Base58)

- **Form**: `u2:` + Base58 (Bitcoin alphabet).
- **Alphabet**: `123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`
- **Round‑trip**: HR ⇄ Canonical MUST be fully reversible.
- **Rules**:
  - On input, implementations MAY accept with or without the `u2:` prefix.
  - On input, characters outside the Base58 alphabet MUST be rejected.
  - HR MAY be used for display/input; storage MUST use Canonical.

#### 3.3 Short (display‑only)

- **Form**: `u2s:<head8>…<tail8>` (e.g., `u2s:3fa85f64…a9d3f6bc`).
- **Rules**:
  - Short is display‑only and MUST NOT be accepted as input.
  - For collision avoidance, Short MUST NOT be used for comparison/identity.

### 4. Generation Requirements (Off‑chain)

#### 4.1 Common

- Randomness MUST come from a CSPRNG.
  - JS/Deno: `crypto.getRandomValues`
  - Node: `crypto.webcrypto.getRandomValues`
- The following are prohibited (MUST NOT):
  - `Math.random()`
  - On‑chain generation using blockhash or timestamp as a randomness source

#### 4.2 v0

- Set the top 4 bits to `0000b` and fill the remaining 252 bits with CSPRNG
  randomness (MUST).

#### 4.3 v1

- Set `version = 0001b` and fill fields as follows (MUST):
  1. `T = Date.now()` in ms, masked to 48 bits.
  2. `N =` node‑specific 32‑bit value (fixed at startup or via config).
  3. `C =` monotonically increasing within the same ms (wrapping allowed).
  4. `R =` 156 bits from a CSPRNG.
- `T` SHOULD be monotonic non‑decreasing. If the system clock moves backward, it
  is desirable to compensate ordering with `C` (SHOULD).

### 5. Validation Requirements

#### 5.1 Canonical Validation

| Step | Condition                         | Action                                              |
| ---- | --------------------------------- | --------------------------------------------------- |
| 1    | String matches `^0x[0-9a-f]{64}$` | If not, error `INVALID_FORMAT`                      |
| 2    | Interpretable as uint256          | If not, error `INVALID_VALUE`                       |
| 3    | `version = (id >> 252) & 0xF`     | If unsupported version, error `UNSUPPORTED_VERSION` |

#### 5.2 HR (Base58) Validation

| Step | Condition                        | Action                           |
| ---- | -------------------------------- | -------------------------------- |
| 1    | Prefix `u2:` optional            | Remove if present                |
| 2    | Only Base58 alphabet characters  | Otherwise error `INVALID_BASE58` |
| 3    | Decode Base58 to integer         | On failure, `INVALID_BASE58`     |
| 4    | Left‑pad to 256 bits             | Convert to `0x+64hex`            |
| 5    | Perform Canonical validation 5.1 | Propagate errors                 |

Implementations MUST store input by normalizing HR → Canonical.

### 6. Interop (UUID Bridge)

- `uuidToU256`: Place UUID (16B) into the lower 128 bits and produce a Canonical
  with upper 128 bits = 0 (MUST).
- `u256ToUuid`: Only convert back to a UUID string when upper 128 bits = 0
  (MAY).
- **Rules**:
  - When using the bridge, receivers MUST verify upper 128 bits = 0.
  - Time‑ordering semantics of UUID v7 are not compatible with U256ID v1 `T`
    (information located elsewhere).

### 7. API / DB Operational Rules

#### 7.1 API

| Item   | Rule                                                                                                  |
| ------ | ----------------------------------------------------------------------------------------------------- |
| Input  | MAY accept Canonical or HR; after acceptance, normalize to Canonical (MUST). Reject Short (MUST NOT). |
| Output | Return Canonical (MUST). UI‑facing endpoints MAY also include HR.                                     |
| Error  | Prefer returning the error codes defined in Section 8 (SHOULD).                                       |

#### 7.2 Database

| Item      | Recommendation                                                       |
| --------- | -------------------------------------------------------------------- |
| Type      | Fixed‑length `CHAR(66)` (`0x+64hex`). Validate via regex `CHECK`     |
| Primary   | Use Canonical as PK. B‑Tree benefits from v1’s temporal locality.    |
| Secondary | Create derived columns such as `ts_ms` (v1 `T`) as needed and index. |

### 8. Error Codes (Recommended)

| Code                  | Meaning              | Condition                                   |
| --------------------- | -------------------- | ------------------------------------------- |
| `INVALID_FORMAT`      | Format error         | Regex mismatch (Canonical) / invalid length |
| `INVALID_VALUE`       | Value error          | Not interpretable as uint256                |
| `UNSUPPORTED_VERSION` | Unsupported ver.     | `version` not supported by implementation   |
| `INVALID_BASE58`      | Base58 error         | HR alphabet violation / decode failure      |
| `DISALLOWED_SHORT`    | Short input          | Reject `u2s:` input                         |
| `UPPER128_NOT_ZERO`   | Upper‑zero violation | On reverse conversion in UUID bridge        |

### 9. Examples (For Cross‑checking)

#### 9.1 v0 Canonical → HR → Canonical

- Canonical:

```
0x0f97c2a48e7f5e09f417f2c4e833d78d8e214ad64d6cfbb7a50f62ebd7138a4f
```

Version = 0

- HR:

```
u2:3r5w3iBq7G8fYQkz8x5f7J6NRcQ1k3Qkq1S5G5if9PjT
```

- Round‑trip (Canonical):

```
0x0f97c2a48e7f5e09f417f2c4e833d78d8e214ad64d6cfbb7a50f62ebd7138a4f
```

#### 9.2 v1 Canonical (Field Extraction Example)

- Canonical:

```
0x1a00017c5d53a4f100012abbd61ff8349817dcaa47b9e2e8941f2395dc3c4b71
```

Version = 1

```
T(ms) = (id >> 204) & ((1<<48)-1)
N     = (id >> 172) & 0xffffffff
C     = (id >> 156) & 0xffff
```

### 10. Security Considerations

- **CSPRNG strength**: Implementations MUST use the platform‑standard CSPRNG.
- **Collisions**: For both v0 and v1 they are practically negligible, but
  implement unique constraints and retry on duplicates (SHOULD).
- **Guess resistance**: v1 includes `T`, which may leak generation time; if
  secrecy is needed prefer v0 (SHOULD).
- **Input validation**: Validate HR/Canonical strictly and reject invalid
  characters, sizes, and unsupported versions (MUST).
- **Short misuse**: Using Short for comparison/input is forbidden (MUST NOT).

### 11. Algorithms (Reference‑level)

#### 11.1 HR (Base58) Encode (pseudo)

```pseudo
function toBase58(u256):
  n := u256 (bigint)
  if n == 0: return "u2:1"
  s := ""
  while n > 0:
    (n, rem) := divmod(n, 58)
    s := ALPHABET[rem] + s
  return "u2:" + s
```

#### 11.2 HR (Base58) Decode (pseudo)

```pseudo
function fromBase58(hr):
  s := hr.startsWith("u2:") ? hr[3:] : hr
  assert(all(c in ALPHABET for c in s))
  x := 0
  for c in s:
    x := x * 58 + indexOf(ALPHABET, c)
  return toCanonical256Hex(x)  // 0x + 64 hex (lowercase)
```

### 12. Interoperability Notes

- **ERC‑721/1155**: Since `tokenId` is uint256, U256ID Canonical can be used as
  is.
- **OpenZeppelin**: `Strings.toHexString(tokenId, 32)` yields `0x+64hex`.
- **UUID systems**: Bridging is possible by packing into lower 128 bits via
  `uuidToU256` (always verify upper 128 bits = 0).

### 13. Conformance

An implementation is considered **conformant** when all of the following are
met:

1. Canonical is the sole form for storage/comparison and matches
   `^0x[0-9a-f]{64}$` (MUST).
2. HR (Base58) encode/decode is fully reversible with Canonical (MUST).
3. Short is rejected as input (MUST).
4. Generation rules for v0/v1 (4.2/4.3) are followed (MUST).
5. Validation fails correctly under the error conditions in Section 5 (MUST).
6. A CSPRNG is used (MUST).
7. UUID bridge verifies upper 128 bits = 0 (MUST).

### Appendix A. Regex & ABNF (Reference)

- **Canonical regex**:

```
^0x[0-9a-f]{64}$
```

- **HR (Base58) regex (optional prefix)**:

```
^(?:u2:)?[1-9A-HJ-NP-Za-km-z]+$
```

- **ABNF (simplified)**:

```
canonical = "0x" 64HEXDIG-LC
64HEXDIG-LC = 64*64( %x30-39 / %x61-66 ) ; 0-9, a-f

hr        = ["u2:"] 1*base58char
base58char = %x31-39 / %x41-48 / %x4A-4E / %x50-5A / %x61-6B / %x6D-7A
            ; 1-9 A-H J-N P-Z a-k m-z

short     = "u2s:" 8HEXDIG-LC "…" 8HEXDIG-LC
8HEXDIG-LC = 8*8( %x30-39 / %x61-66 )
```

### Appendix B. Conformance Test Checklist

- Input normalization:
  - HR input (with/without `u2:`) → normalize to Canonical (MUST).
  - Reject mixed‑case hex (MUST).
- Canonical validation:
  - If not matching `^0x[0-9a-f]{64}$`, return `INVALID_FORMAT` (MUST).
  - If not interpretable as uint256, return `INVALID_VALUE` (MUST).
  - If unsupported version, return `UNSUPPORTED_VERSION` (MUST).
- HR (Base58) validation:
  - If characters outside alphabet, return `INVALID_BASE58` (MUST).
  - Decode → 256‑bit padding → Canonical (MUST).
- Generation (v0/v1):
  - Use CSPRNG (MUST).
  - v0: upper 4 bits `0000b`, remaining 252 bits random (MUST).
  - v1: `T` 48‑bit, `N` 32‑bit, `C` 16‑bit, `R` 156‑bit; `T` non‑decreasing
    (SHOULD).
- Short:
  - Reject as input and return `DISALLOWED_SHORT` (MUST).
- UUID bridge:
  - `uuidToU256`: produce Canonical with upper 128 bits = 0 (MUST).
  - `u256ToUuid`: allow only if upper 128 bits = 0; otherwise
    `UPPER128_NOT_ZERO` (MUST).
- API/DB:
  - API input: accept only Canonical/HR; reject Short (MUST).
  - API output: return Canonical (MUST).
  - DB: set `CHAR(66)` with `CHECK` constraint (SHOULD).

— Reference: RFC 2119 (interpretation of normative words)
