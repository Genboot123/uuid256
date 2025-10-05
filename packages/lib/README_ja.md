<div align="center">

<h1>uuid256 🔑</h1>

<p>UUID を正準 ID とし、EVM の <code>uint256</code> とは「下位 128bit = UUID、上位 128bit = 0」で相互変換</p>

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
        <img alt="downloads" src="https://img.shields.io/npm/dm/uuid256" />
      </a>
</p>
</div>

`uuid256` はアプリの正準 ID を UUID とし、EVM `uint256` へは「下位 128bit =
UUID、上位 128bit = 0」でブリッジします。オフチェーン（DB / API）の UUID
資産を保ちつつ、ERC‑721/1155 の `tokenId` と互換性を維持します。

検証・ブリッジは [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122) のすべての
UUID バージョンをサポートします（新規実装には v7 を推奨）。

- コントラクト: `packages/contracts`（`Uuid256.sol`）
- ライブラリ (Deno/TypeScript): `packages/lib`
- サンプル: `packages/examples`

## 背景と動機

### 課題

オフチェーン（DB / API）は UUID、ERC‑721/1155 は `uint256` の tokenId
を使います。この形式の違いが、独自マッピングや密結合を生みます。

よくある回避策と欠点：

1. UUID↔`uint256` のテーブル管理 → 実装増、故障点増加
2. 整数IDへ置換 → UUID の利点（衝突耐性・時系列性）を失う
3. オンチェーンで UUID を使う → ERC 非互換

### 解決策

決定論的・双方向・ステートレスなブリッジ：

- ✅ UUID を推奨する正準 ID
- ✅ 下位 128bit に決定論的にエンコード（上位 128bit は常に 0）
- ✅ 完全に可逆
- ✅ マッピング不要（純粋アルゴリズム）
- ✅ ERC‑721/1155 と互換

`tokenId` は UUID を `uint256` にエンコードした表現です。

---

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
import { generateUuidV7, u256ToUuid, uuidToU256 } from "uuid256";

const uuid = generateUuidV7();
const tokenId = uuidToU256(uuid); // 0x+64hex（下位 128 = UUID, 上位 128 = 0）
const back = u256ToUuid(tokenId); // 上位 128bit = 0 を検証して UUID に戻す
```

### 数値例

- UUID（文字列）: `01234567-89ab-7cde-8f01-23456789abcdef`
- ダッシュ除去・小文字（32 hex）: `0123456789ab7cde8f0123456789abcdef`
- `uint256` へブリッジ:
  - 下位 128bit = `0x0123456789ab7cde8f0123456789abcdef`
  - 上位 128bit = `0x00000000000000000000000000000000`
  - 正準表現（0x + 64 hex）:
    `0x000000000000000000000000000000000123456789ab7cde8f0123456789abcdef`
- 逆変換では上位 128bit = 0 を必ず検証し、元の UUID 文字列を返す。

### 表現

| 形式         | 型            |   サイズ | 例                                       |
| ------------ | ------------- | -------: | ---------------------------------------- |
| UUID（正準） | string        | 36 chars | `01234567-89ab-7cde-8f01-23456789abcdef` |
| ブリッジ ID  | `uint256` hex | 66 chars | `0x0000…0000` + 32 hex                   |

---

## 仕様

### 位置付け

UUID（RFC 4122）と EVM `uint256` の相互ブリッジを定義します（新規には v7
推奨）。

### 用語

「MUST」「MUST NOT」「SHOULD」「MAY」は RFC 2119 に従い解釈します。

### 正準 ID

- 正準 ID は UUID（v7 推奨）です。アプリは UUID
  文字列を主キーとして扱います（MUST）。

### ブリッジ表現

- ブリッジ ID は EVM `uint256` とし、上位 128bit を 0、下位 128bit に UUID
  を格納します（MUST）。 表現は `0x` + 64 桁の小文字 16 進数とします（MUST）。

### 変換

- UUID → `uint256`: 下位 128 = UUID、上位 128 = 0。
- `uint256` → UUID: `0x+64hex` でない入力（`INVALID_U256_FORMAT`）や、上位 128 ≠
  0（`UPPER128_NOT_ZERO`）は拒否します（MUST）。

### 検証

- UUID 入力は RFC 4122 に準拠した `8-4-4-4-12` 形式と正しい variant
  を満たす必要があります（バージョンは任意）。
- 小文字化は許容します（MAY）。不一致は `INVALID_UUID_FORMAT`
  を投げます（MUST）。

### エラー

| コード                | 発生条件                  |
| --------------------- | ------------------------- |
| `INVALID_UUID_FORMAT` | UUID 構文に一致しない     |
| `INVALID_U256_FORMAT` | `0x` + 64 hex ではない    |
| `UPPER128_NOT_ZERO`   | 逆変換時に上位 128bit ≠ 0 |

### セキュリティ

- UUID 生成は該当部分で CSPRNG を使用する必要があります（MUST）。
- 逆変換時は上位 128bit = 0 の検証を必須とします（MUST）。

---

## API

- `generateUuidV7(): Uuid` — UUID（小文字）を生成。CSPRNG 使用。
- `generateUuidV5(namespace: string, data: string | Uint8Array): Promise<Uuid>`
  — 名前ベースの決定論的 UUID。
- `isUuid(s: string): s is Uuid` — RFC 4122 の全バージョンを受け付ける。
- `isUuidV7(s: string): s is Uuid` — v7のみ検証。
- `asUuid(s: string): Uuid` — 不正形式は `INVALID_UUID_FORMAT`。
- `asUuidV7(s: string): Uuid` — 不正形式は `INVALID_UUID_FORMAT`。
- `uuidToU256(uuid: string): U256Hex` — 正準 `0x+64hex` を返す（上位 128 = 0）。
- `u256ToUuid(id: string): Uuid` — `INVALID_U256_FORMAT` / `UPPER128_NOT_ZERO`。
- `toCanonicalU256Hex(x: bigint): U256Hex` — returns canonical `0x` + 64
  lowercase hex

## サンプル

Node / Browser / Bun / Edge の例は `packages/examples` を参照してください。
