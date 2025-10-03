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

- `src/` — production contracts (e.g. `U256ID.sol`, `MyNFT.sol`)
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

### Deploy

Set environment variables (recommended):

```shell
$ export RPC_URL=<https://sepolia.infura.io/v3/XXXXX>
$ export PRIVATE_KEY=<0x...>   # use a funded deployer key; keep it secret
```

`U256ID.sol` is a pure library and is not deployed. Deploy `MyNFT` with constructor args:

```shell
$ forge create \
  --rpc-url "$RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  src/MyNFT.sol:MyNFT \
  --constructor-args "MyNFT" "MNFT" "https://example.com/metadata/"
```

Mint using an off-chain generated U256ID (see SDK at `packages/sdk/README.md`):

```shell
# Replace $NFT with the deployed address and $TOKEN_ID with a valid v0/v1 U256ID
$ cast send "$NFT" "mint(address,uint256)" <recipient_address> $TOKEN_ID \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY"

# Read tokenURI
$ cast call "$NFT" "tokenURI(uint256)" $TOKEN_ID --rpc-url "$RPC_URL"
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
