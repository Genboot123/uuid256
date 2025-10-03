## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Install Foundry

macOS/Linux:

```shell
$ curl -L https://foundry.paradigm.xyz | bash
$ foundryup
```

Verify:

```shell
$ forge --version
$ anvil --version
```

## Project Layout

- `src/` — production contracts (e.g. `Uuid256.sol`, `Uuid256TestNFT.sol`)
- `test/` — Foundry tests (`*.t.sol`)
- `lib/` — vendored dependencies (do not edit directly)
- `out/` — build artifacts (auto-generated)

Run all commands from this directory: `packages/contracts/`.

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy `Uuid256TestNFT`

Create a `.env` in this directory (or export the variables):

```shell
cat > .env <<'EOF'
NAME=Uuid256TestNFT
SYMBOL=UTNFT
BASE_URI=ipfs://base/
RPC_URL=<https://sepolia.infura.io/v3/XXXXX>
PRIVATE_KEY=<0x...>  # funded deployer; keep it secret
# ETHERSCAN_API_KEY=<optional>
EOF
```

Deploy with `forge create`:

```shell
source .env
export ETH_RPC_URL="$RPC_URL"   # optional: lets Foundry default to this RPC

forge create src/Uuid256TestNFT.sol:Uuid256TestNFT \
  --rpc-url "$RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  --broadcast \
  --constructor-args "$NAME" "$SYMBOL" "$BASE_URI"

# With inline args and verification
forge create src/Uuid256TestNFT.sol:Uuid256TestNFT \
  --rpc-url "$RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  --broadcast \
  --verify \
  --etherscan-api-key "$ETHERSCAN_API_KEY" \
  --constructor-args "Uuid256TestNFT" "UTNFT" "ipfs://base/"
```

See Foundry docs for `forge create` and verification details: [Deploying and Verifying](https://getfoundry.sh/forge/deploying/).

Mint a bridged tokenId (lower 128 bits UUID; upper 128 must be zero):

```shell
# Example UUID bytes16 -> uint256 (keeps upper 128 bits zero)
TOKEN_ID=$(cast --to-uint256 0x01890f882bbf7c84bec06fbb8cbfcdad)
NFT=<deployed_address>

# Mint
cast send "$NFT" "mint(address,uint256)" <recipient_address> "$TOKEN_ID" \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY"

# Read tokenURI
cast call "$NFT" "tokenURI(uint256)" "$TOKEN_ID" --rpc-url "$RPC_URL"
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

## Notes

- Solidity version and settings are defined in `foundry.toml`. Run `forge fmt` before committing.
- Dependencies under `lib/` are vendored; update via `forge install` if/when needed, but avoid manual edits.
