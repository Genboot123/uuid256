# UUID256 Examples

This directory contains examples of using the uuid256 library in different environments.

## Environments

- **browser/** - React + Vite + Tailwind CSS browser application
- **node/** - Node.js example (ESM and CommonJS)
- **bun/** - Bun runtime example
- **edge/** - Cloudflare Workers edge runtime example

## Quick Start

### Install Dependencies

```bash
make install
```

This will install dependencies for all examples in parallel.

### Development

```bash
make dev
```

Starts all development servers in parallel:
- Browser: http://localhost:5173
- Edge: http://localhost:8787

### Build

```bash
make build
```

Builds all examples.

### Test

```bash
make test
```

Runs all tests in parallel.

### Clean

```bash
make clean
```

Removes all node_modules and build artifacts.

## Individual Environment Commands

### Browser

```bash
cd browser
npm install
npm run dev      # Start dev server
npm run build    # Build for production
npm run test     # Run tests
```

### Node

```bash
cd node
npm install
npm run test     # Run tests
```

### Bun

```bash
cd bun
bun install
bun run test     # Run tests
```

### Edge

```bash
cd edge
npm install
cp .env.example .env
# Edit .env and add your PRIVATE_KEY
npm run dev      # Start Wrangler dev server
npm run test     # Run tests
```

**Note:** This example uses ethers.js for blockchain interaction. You need a private key with Base Sepolia testnet ETH.

## Environment Variables

For testing with actual contract deployment, create a `.env` file in the contract directory:

```bash
PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=0xb081A8327db8e5c6BbDC13d9C452b13ef37a941c
```

## Makefile Targets

- `make help` - Show available targets
- `make install` - Install all dependencies
- `make clean` - Clean all node_modules and artifacts
- `make dev` - Run dev servers in parallel
- `make build` - Build all examples
- `make test` - Run all tests in parallel
