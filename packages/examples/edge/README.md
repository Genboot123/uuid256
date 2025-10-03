# Edge Runtime Example

This example demonstrates using uuid256 with ethers.js in Cloudflare Workers.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.dev.vars` file:
```bash
cp .dev.vars.example .dev.vars
```

3. Edit `.dev.vars` and add your private key:
```bash
# .dev.vars
PRIVATE_KEY=0x1234567890abcdef...
```

**Important:** Never commit `.dev.vars` to git. It's already in `.gitignore`.

## Development

Start the development server:

```bash
npm run dev
```

The worker will be available at http://localhost:8787

Open your browser and visit the URL to see the UUID generation and bridging in action.

## Testing

Run the e2e test:

```bash
npm test
```

This will start a Wrangler dev server and test the worker functionality.

## Deployment

Deploy to Cloudflare Workers:

```bash
wrangler login    # First time only
wrangler deploy
```

## What This Demo Shows

This example demonstrates:
- Generating UUIDv7 in an edge environment (Cloudflare Workers)
- Bridging UUID to uint256 format
- Minting an NFT with the bridged tokenId using ethers.js
- Reading back NFT data from the contract
- Full blockchain interaction from edge runtime

The response includes:
```json
{
  "uuid": "01936b5e-7890-7abc-def0-123456789abc",
  "bridged": "01936b5e7890def0123456789abc000000000000000000000000000000000000",
  "tokenId": "123456789...",
  "owner": "0xYourAddress...",
  "tokenURI": "ipfs://...",
  "txHash": "0x123...",
  "timestamp": "2024-10-03T14:50:00.000Z"
}
```

## Notes

- Uses ethers.js v6 (compatible with Cloudflare Workers)
- Connects to Base Sepolia testnet
- Requires a private key with testnet ETH
- Environment variables are loaded from `.dev.vars` for local development
