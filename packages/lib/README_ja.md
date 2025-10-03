<div align="center">

<h1>uuid256 🔑</h1>

<p>UUID v7 を正準 ID とし、EVM の <code>uint256</code> とは「下位 128bit = UUID、上位 128bit = 0」で相互変換</p>

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

本 SDK はアプリの正準 ID を UUID v7 と定め、EVM `uint256` へは「上位 128bit を
0、下位 128bit に UUID」を 詰めるルールでブリッジします。Web2
側（DB・API）の資産を保ちつつ、ERC‑721/1155 の `tokenId` と互換性を確保します。

- コントラクト: `packages/contracts`（`Uuid256.sol`）
- ライブラリ (Deno/TypeScript): `packages/lib`
- サンプル: `packages/examples`

### インストール

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

### クイックスタート

```ts
import { uuid256 } from "uuid256";

const uuid = uuid256.generateUuidV7();
const tokenId = uuid256.uuidToU256(uuid); // 0x+64hex（下位 128 = UUID, 上位 128 = 0）
const back = uuid256.u256ToUuid(tokenId); // 上位 128bit = 0 を検証して UUID に戻す
```

Node CJS で WebCrypto を注入する場合:

```js
const { uuid256 } = require("uuid256");
const { webcrypto } = require("node:crypto");
uuid256.setCrypto(webcrypto);
```

### 数値例（ワークド例）

- UUID v7（文字列）: `01234567-89ab-7cde-8f01-23456789abcdef`
- ダッシュ除去・小文字（32 hex）: `0123456789ab7cde8f0123456789abcdef`
- `uint256` へブリッジ:
  - 下位 128bit = `0x0123456789ab7cde8f0123456789abcdef`
  - 上位 128bit = `0x00000000000000000000000000000000`
  - 正準表現（0x + 64 hex）:
    `0x000000000000000000000000000000000123456789ab7cde8f0123456789abcdef`
- 逆変換では上位 128bit = 0 を必ず検証し、元の UUID 文字列を返す。

### 表現サマリ

| 形式         | 型            |   サイズ | 例                                       |
| ------------ | ------------- | -------: | ---------------------------------------- |
| UUID（正準） | string        | 36 chars | `01234567-89ab-7cde-8f01-23456789abcdef` |
| ブリッジ ID  | `uint256` hex | 66 chars | `0x0000…0000` + 32 hex                   |

---

## RFC 風 仕様（情報・標準）

### 1. このメモの位置付け

uuid256 は UUID v7 と EVM `uint256` の相互ブリッジ仕様です。

### 2. 用語

「MUST」「MUST NOT」「SHOULD」「MAY」は RFC 2119 に従い解釈します。

### 3. 正準 ID

アプリの正準 ID は UUID v7 としなければなりません（MUST）。

### 4. ブリッジ表現

ブリッジ ID は EVM `uint256` とし、上位 128bit を 0、下位 128bit に UUID
を格納します（MUST）。 表現は `0x` + 64 桁の小文字 16 進数とします（MUST）。

### 5. 変換

- UUID → `uint256`: 下位 128 = UUID、上位 128 = 0。
- `uint256` → UUID: `0x+64hex` でない入力（`INVALID_U256_FORMAT`）や、上位 128 ≠
  0 （`UPPER128_NOT_ZERO`）は拒否します（MUST）。

### 6. 検証

- UUID は UUIDv7 構文（`8-4-4-4-12`、version=7、RFC 4122
  variant）を満たす必要があります（MUST）。
- 実装は小文字化してもかまいません（MAY）。不一致は `INVALID_UUID_FORMAT`
  を投げます（MUST）。

### 7. エラーコード

| コード                | 発生条件                  |
| --------------------- | ------------------------- |
| `INVALID_UUID_FORMAT` | UUIDv7 構文に一致しない   |
| `INVALID_U256_FORMAT` | `0x` + 64 hex ではない    |
| `UPPER128_NOT_ZERO`   | 逆変換時に上位 128bit ≠ 0 |

### 8. セキュリティ

- UUID 生成は CSPRNG を必ず使用します（MUST）。
- 逆変換時は上位 128bit = 0 の検証を必須とします（MUST）。

---

## API

- `generateUuidV7(): Uuid` — UUID v7（小文字）を生成。CSPRNG 使用。
- `isUuid(s: string): s is Uuid`
- `asUuid(s: string): Uuid` — 不正形式は `INVALID_UUID_FORMAT`
- `uuidToU256(uuid: string): U256Hex` — 正準 `0x+64hex` を返す（上位 128 = 0）
- `u256ToUuid(id: string): Uuid` — `INVALID_U256_FORMAT` / `UPPER128_NOT_ZERO`
  を投げ得る
- `setCrypto(crypto: Crypto): void` — Node など `globalThis.crypto`
  がない環境で注入

## サンプル

Node / Browser / Bun / Edge の例は `packages/examples` を参照してください。
