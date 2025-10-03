<div align="center">

<h1>uuid256 (SDK, 日本語)</h1>

<p>UUID を正準（Canonical）とし、EVM の `uint256` へは下位 128bit 詰めでブリッジ</p>

<p>
  <a href="https://github.com/posaune0423/uuid256/actions/workflows/test-sdk.yml">
    <img alt="CI" src="https://github.com/posaune0423/uuid256/actions/workflows/test-sdk.yml/badge.svg" />
      </a>
      <a href="https://www.npmjs.com/package/u256id">
        <img src="https://img.shields.io/npm/v/u256id.svg" alt="npm package" />
      </a>
  </p>
</div>

本 SDK は UUID v7 を唯一の正準 ID とし、`uint256` tokenId へは「上位 128bit = 0、下位 128bit = UUID」を満たす形でブリッジします。

動機: Web2 の資産（UUID・DB・API）を損なわず、チェーン側の互換性（ERC‑721/1155）も確保するため。

- コントラクト: `packages/contracts`（`Uuid256.sol`）
  - SDK (Deno/TypeScript): `packages/sdk`
- サンプル: `packages/examples`

## ブリッジ規約

```
tokenId = uint256(uint128(uuid_bytes16))
// 上位 128bit は常に 0
```

## インストール

- npm（Node/Bun）: `npm i u256id`
- Deno: `import { uuid256 } from "npm:u256id"`

## クイックスタート

```ts
import { uuid256 } from "u256id";

// UUID v7 を生成（正準）
const uuid = uuid256.generateUuidV7();

// uint256 にブリッジ（0x+64hex、上位 128bit は 0）
const tokenId = uuid256.uuidToU256(uuid);

// 逆変換（上位 128bit = 0 を検証）
const back = uuid256.u256ToUuid(tokenId);
```

Node CJS で WebCrypto を注入する場合:

```js
const { uuid256 } = require("u256id");
const { webcrypto } = require("node:crypto");
uuid256.setCrypto(webcrypto);
```

## API

- `generateUuidV7(): Uuid`
  - UUID v7 文字列（`8-4-4-4-12`、小文字）を生成。
- `isUuid(s: string): s is Uuid`
- `asUuid(s: string): Uuid` — 不正形式なら `INVALID_UUID_FORMAT` を投げる
- `uuidToU256(uuid: string): U256Hex`
  - `0x+64hex` を返す。上位 128bit は 0。
- `u256ToUuid(id: string): Uuid`
  - `INVALID_U256_FORMAT`／`UPPER128_NOT_ZERO` を投げる場合がある。
- `setCrypto(crypto: Crypto): void`

## 仕様（要約・規範）

- 正準 ID は UUID（MUST）
- on‑chain 生成は禁止（MUST NOT）
- ブリッジは「下位 128bit = UUID、上位 128bit = 0」（MUST）
- 入力で `0x+64hex` を受理する場合、上位 128bit = 0 を検証（MUST）
- 出力は UUID（MUST）。補助的に `uint256` の併記は可（MAY）

## セキュリティ

- CSPRNG を使用（MUST）
- 逆変換時は上位 128bit = 0 の検証を必須（MUST）

— 参考: RFC 2119（規範語）
