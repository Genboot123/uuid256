# UUID256 Examples

E2E test examples for uuid256 library on **Base Sepolia** (Node.js, Bun, Browser, Edge).

## Quick Start

```bash
# 1. Install dependencies (from packages/examples/)
npm install

# Install Playwright for browser tests
cd browser && npx playwright install chromium && cd ..

# 2. Set environment variables
export CONTRACT_ADDRESS=0x...  # Your deployed contract on Base Sepolia
export PRIVATE_KEY=0x...       # Required for Node/Bun/Edge (with Base Sepolia funds)

# 3. Run tests (using TurboRepo for parallel execution)
npm run test    # Run all tests in parallel
npm run e2e     # Run all e2e tests in parallel
npm run build   # Build all projects in parallel
```

## TurboRepo Commands

All commands are executed in parallel across all environments using TurboRepo:

| Command | Description |
|---------|-------------|
| `npm run test` | Run all test scripts in parallel |
| `npm run e2e` | Run all e2e tests in parallel |
| `npm run build` | Build all projects (browser vite build) |
| `npm run dev` | Start all dev servers in parallel |
| `npm run clean` | Clean all node_modules and build artifacts |

## Runtime Details

| Runtime | Auth Method | Usage |
|---------|-------------|-------|
| **Node.js** | `PRIVATE_KEY` env | `cd node && npm run e2e` |
| **Bun** | `PRIVATE_KEY` env | `cd bun && bun run e2e` |
| **Edge** | `PRIVATE_KEY` env | `cd edge && npm run e2e` |
| **Browser** | MetaMask/Wallet | `cd browser && npm run dev` |

**Browser example** uses Wallet Connect (MetaMask) - no private key in code!

## Manual Testing (Individual Environments)

If you want to test a specific environment:

```bash
# Node.js
cd node && npm run e2e

# Bun
cd bun && bun run e2e

# Edge (Cloudflare Workers)
cd edge && npm run e2e

# Browser (with MetaMask)
cd browser && npm run dev
# Visit http://localhost:5173/?addr=0x... and connect wallet
```
