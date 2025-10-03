# u256id
U256ID is a 256-bit identifier (uint256) with strict, interoperable encoding and validation rules.

- Specification: see the normative Usage Specification below (MUST/SHOULD/MAY).
- Repos:
  - Contracts: `packages/contracts`
  - SDK (Deno/TypeScript): `packages/sdk`

Quick start:

- Build contracts: `forge build`
- Test contracts: `forge test`
- SDK tests: `deno test packages/sdk`

## U256ID — Usage Specification (Normative)

本書は U256ID の厳格な使用仕様を定義する。実装は本仕様に従うことで相互運用性を確保できる。

### 1. 用語と規範語

本書では [RFC 2119] に準拠し、MUST / MUST NOT / SHOULD / SHOULD NOT / MAY を規範語として使用する。

- **U256ID**: 256bit の符号なし整数（uint256）を識別子とする規格。
- **Canonical ID**: uint256 を `0x` + 64 桁小文字 hex で表現したテキスト形式。
- **HR(Base58) 表現**: 人間可読の Base58 表現（接頭辞 `u2:` を含む）。
- **Short 表示**: 省略表示（`u2s:<head8>…<tail8>`）。入力不可。
- **Version nibble**: 上位 4bit。ID のバージョンを示す。
  - **v0**: 純乱数（`vvvv = 0000b`）。
  - **v1**: 時系列ソート可能（`vvvv = 0001b`、後述のフィールド配置）。

注意: 生成は常にオフチェーンで行うこと。オンチェーンでの乱数生成は安全でない。

### 2. データモデル

#### 2.1 ビット配置（共通）

| ビット位置 (MSB→LSB) | 長さ | 名称     | 説明                                  |
| --- | --- | --- | --- |
| 255..252              | 4    | version | 上位 4bit。`0x0 = v0`, `0x1 = v1`。 |
| 251..0                | 252  | payload | バージョン固有フィールド。           |

#### 2.2 v0: Random

| フィールド | 位置     | 長さ | 値/意味                              |
| --- | --- | --- | --- |
| version  | 255..252 | 4    | `0000b`                            |
| R        | 251..0   | 252  | CSPRNG による 252bit の乱数         |

#### 2.3 v1: Time-sortable

| フィールド | 位置     | 長さ | 値/意味                                                                 |
| --- | --- | --- | --- |
| version  | 255..252 | 4    | `0001b`                                                                 |
| T        | 251..204 | 48   | Unix 時刻 (ms)、範囲: `[0, 2^48-1]`                                     |
| N        | 203..172 | 32   | NodeID。プロセス/ノードごとに固定（起動時に乱数初期化、または構成で指定） |
| C        | 171..156 | 16   | 単調カウンタ（同一 ms 内で `+1`、`0xffff` で wrap してよい）            |
| R        | 155..0   | 156  | 追加乱数（CSPRNG）。分散生成時の衝突確率低減                            |

### 3. 表現

#### 3.1 Canonical（正準）

- **形式**: `0x` + 64 桁 小文字 hex。
- **正規表現**:

```
^0x[0-9a-f]{64}$
```

- **エンディアン**: big-endian（文字列先頭が MSB）。
- **規範**:
  - すべての保存・比較・署名・API I/O の基準は Canonical でなければならない（MUST）。
  - 実装は 大小文字混在を拒否し、小文字に正規化すること（MUST）。

#### 3.2 HR(Base58)

- **形式**: `u2:` + Base58（Bitcoin alphabet）。
- **Alphabet**: `123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`
- **往復可能**: HR ⇄ Canonical は 完全可逆でなければならない（MUST）。
- **規範**:
  - 受理時、実装は `u2:` の有無を許容してよい（MAY）。
  - 受理時、Base58 以外の文字が含まれる場合は エラー（MUST）。
  - HR は表示・入力に用いてよい（MAY）。ただし保存は Canonical（MUST）。

#### 3.3 Short（表示専用）

- **形式**: `u2s:<head8>…<tail8>`（例: `u2s:3fa85f64…a9d3f6bc`）
- **規範**:
  - Short は表示専用であり、入力として受理してはならない（MUST NOT）。
  - 衝突回避の観点から、Short 同士を比較・同定に使ってはならない（MUST NOT）。

### 4. 生成要件（オフチェーン）

#### 4.1 共通

- 乱数は暗号論的安全な CSPRNG を使用しなければならない（MUST）。
  - JS/Deno: `crypto.getRandomValues`
  - Node: `crypto.webcrypto.getRandomValues`
- 次は 禁止（MUST NOT）:
  - `Math.random()`
  - ブロックハッシュや timestamp を乱数源とする on-chain 生成

#### 4.2 v0

- 先頭 4bit を `0000b` に設定し、残り 252bit を CSPRNG で埋めなければならない（MUST）。

#### 4.3 v1

- `version = 0001b` を設定し、以下の手順でフィールドを埋める（MUST）:
  1. `T = Date.now()` の ms 値を 48bit にマスク。
  2. `N =` Node 固有 32bit 値（起動時または構成で固定）。
  3. `C =` 同一 ms 内で単調増加（wrap 可）。
  4. `R =` CSPRNG の 156bit。
- `T` は単調非減少であるべき（SHOULD）。システム時計が後退した場合でも `C` で順序を補うことが望ましい（SHOULD）。

### 5. 検証（Validation）要件

#### 5.1 Canonical 検証

| ステップ | 条件                                   | 動作                                      |
| --- | --- | --- |
| 1      | 文字列が `^0x[0-9a-f]{64}$` に一致するか | 不一致なら `INVALID_FORMAT` でエラー       |
| 2      | 数値に解釈可（uint256）か                | 不可なら `INVALID_VALUE` でエラー          |
| 3      | `version = (id >> 252) & 0xF`            | 実装が未対応の version の場合 `UNSUPPORTED_VERSION` |

#### 5.2 HR(Base58) 検証

| ステップ | 条件                              | 動作                                      |
| --- | --- | --- |
| 1      | 先頭 `u2:` は あってもなくても可     | 有れば除去                                |
| 2      | Base58 アルファベットのみか          | それ以外があれば `INVALID_BASE58`         |
| 3      | Base58 → 整数復元                    | 復元失敗で `INVALID_BASE58`               |
| 4      | 整数を 256bit にパディング           | `0x+64hex` に変換                         |
| 5      | 5.1 の Canonical 検証を実施          | エラーを伝播                              |

実装は HR 入力 → Canonical 正規化 の順で保存すること（MUST）。

### 6. 相互運用（UUID ブリッジ）

- `uuidToU256`: UUID(16B) を 下位 128bit に格納し、上位 128bit = 0 を満たす Canonical を生成（MUST）。
- `u256ToUuid`: 上位 128bit = 0 を満たす場合のみ UUID 文字列に戻してよい（MAY）。
- **規範**:
  - ブリッジ使用時、受理側は 上位 128bit = 0 を MUST で検証すること。
  - UUID v7 等の時系列性は U256ID v1 の `T` とは互換ではない（情報が別領域）。

### 7. API／DB 運用規範

#### 7.1 API

| 項目 | 規範 |
| --- | --- |
| 入力 | Canonical または HR を受理してよい（MAY）。受理後は Canonical に正規化（MUST）。Short は拒否（MUST NOT）。 |
| 出力 | Canonical を返す（MUST）。UI 向けエンドポイントは HR を併記してもよい（MAY）。 |
| エラー | 本仕様のエラーコード（8章）で返すことが望ましい（SHOULD）。 |

#### 7.2 データベース

| 項目 | 推奨 |
| --- | --- |
| 型 | 固定長 `CHAR(66)`（`0x+64hex`）。`CHECK` 制約で正規表現検証。 |
| 主キー | Canonical を PK とする。B-Tree で v1 の時系列局所性が有利。 |
| セカンダリ | 必要に応じ `ts_ms`（v1 の `T`）等の導出列を作成しインデックス。 |

### 8. エラーコード（推奨）

| コード | 意味 | 条件 |
| --- | --- | --- |
| `INVALID_FORMAT` | 形式エラー | 正規表現不一致（Canonical）/ 長さ不正 |
| `INVALID_VALUE` | 値エラー | uint256 として解釈不可 |
| `UNSUPPORTED_VERSION` | 未対応バージョン | `version` が実装外 |
| `INVALID_BASE58` | Base58 不正 | HR の文字集合/復号失敗 |
| `DISALLOWED_SHORT` | Short 入力 | `u2s:` 入力を拒否 |
| `UPPER128_NOT_ZERO` | 上位ゼロ要件違反 | UUID ブリッジ逆変換時 |

### 9. 例（相互確認用）

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

- Round-trip (Canonical):

```
0x0f97c2a48e7f5e09f417f2c4e833d78d8e214ad64d6cfbb7a50f62ebd7138a4f
```

#### 9.2 v1 Canonical（フィールド抽出例）

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

### 10. セキュリティ考慮事項

- **CSPRNG の強度**: 実装はプラットフォーム標準の CSPRNG を使用すること（MUST）。
- **衝突**: v0/v1 ともに現実的に無視可能だが、ユニーク制約と 重複時リトライを実装すること（SHOULD）。
- **推測耐性**: v1 は `T` を含むため生成時刻が漏洩する。秘匿要件がある場合は v0 を選択すること（SHOULD）。
- **入力検証**: HR/Canonical いずれも厳格に検証し、不正文字・サイズ・未対応バージョンを拒否すること（MUST）。
- **Short の誤用**: Short を比較・入力に用いることは 禁止（MUST NOT）。

### 11. アルゴリズム（参考実装レベル）

#### 11.1 HR(Base58) エンコード（擬似コード）

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

#### 11.2 HR(Base58) デコード（擬似コード）

```pseudo
function fromBase58(hr):
  s := hr.startsWith("u2:") ? hr[3:] : hr
  assert(all(c in ALPHABET for c in s))
  x := 0
  for c in s:
    x := x * 58 + indexOf(ALPHABET, c)
  return toCanonical256Hex(x)  // 0x + 64 hex (lowercase)
```

### 12. 相互運用上の注意

- **ERC-721/1155**: `tokenId` は uint256 であるため、U256ID の Canonical をそのまま利用できる。
- **OpenZeppelin**: `Strings.toHexString(tokenId, 32)` で `0x+64hex` が得られる。
- **UUID 系システム**: `uuidToU256` により下位 128bit へ詰めることでブリッジ可能（上位 128bit = 0 を常に検証）。

### 13. 適合性（Conformance）

実装は次の全要件を満たすとき、本仕様に**適合している（conformant）**と見なす。

1. Canonical を唯一の保存・比較形式とし、`^0x[0-9a-f]{64}$` に適合（MUST）。
2. HR(Base58) のエンコード/デコードが Canonical と相互可逆（MUST）。
3. Short を入力として拒否（MUST）。
4. v0/v1 の生成規則（4.2/4.3）に準拠（MUST）。
5. 入力検証（5章）のエラー条件で正しく失敗（MUST）。
6. CSPRNG を使用（MUST）。
7. UUID ブリッジの上位 128bit = 0 検証（MUST）。

### 付録 A. 正規表現・ABNF（参考）

- **Canonical 正規表現**:

```
^0x[0-9a-f]{64}$
```

- **HR(Base58) 正規表現（接頭辞任意）**:

```
^(?:u2:)?[1-9A-HJ-NP-Za-km-z]+$
```

- **ABNF（簡易）**:

```
canonical = "0x" 64HEXDIG-LC
64HEXDIG-LC = 64*64( %x30-39 / %x61-66 ) ; 0-9, a-f

hr        = ["u2:"] 1*base58char
base58char = %x31-39 / %x41-48 / %x4A-4E / %x50-5A / %x61-6B / %x6D-7A
            ; 1-9 A-H J-N P-Z a-k m-z

short     = "u2s:" 8HEXDIG-LC "…" 8HEXDIG-LC
8HEXDIG-LC = 8*8( %x30-39 / %x61-66 )
```

### 付録 B. 実装者向け試験項目（Conformance Test Checklist）

- 入力正規化:
  - HR 入力（`u2:` あり/なし）→ Canonical 正規化（MUST）。
  - 大小文字混在の hex を拒否（MUST）。
- Canonical 検証:
  - `^0x[0-9a-f]{64}$` に一致しない場合 `INVALID_FORMAT`（MUST）。
  - uint256 に解釈不可なら `INVALID_VALUE`（MUST）。
  - 未対応 version は `UNSUPPORTED_VERSION`（MUST）。
- HR(Base58) 検証:
  - Alphabet 外文字を検出で `INVALID_BASE58`（MUST）。
  - デコード→256bit パディング→Canonical 化（MUST）。
- 生成（v0/v1）:
  - CSPRNG 使用（MUST）。
  - v0: 上位 4bit = `0000b`、残り 252bit 乱数（MUST）。
  - v1: `T` 48bit、`N` 32bit、`C` 16bit、`R` 156bit、`T` 非減少（SHOULD）。
- Short:
  - 入力として拒否し `DISALLOWED_SHORT` を返す（MUST）。
- UUID ブリッジ:
  - `uuidToU256`: 上位 128bit = 0 を満たす Canonical を生成（MUST）。
  - `u256ToUuid`: 上位 128bit = 0 のみ許可。違反は `UPPER128_NOT_ZERO`（MUST）。
- API/DB:
  - API 入力: Canonical/HR のみ受理、Short 拒否（MUST）。
  - API 出力: Canonical を返却（MUST）。
  - DB: `CHAR(66)` と `CHECK` 制約を設定（SHOULD）。

— 参考: RFC 2119（規範語の解釈）
