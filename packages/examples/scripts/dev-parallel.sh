#!/usr/bin/env bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting all development servers in parallel...${NC}"

# Create temp directory for logs
LOGDIR="$(mktemp -d)"
trap "rm -rf $LOGDIR" EXIT

# Start browser dev server
(
  cd browser
  echo -e "${GREEN}[browser]${NC} Starting Vite dev server..."
  npm run dev 2>&1 | while IFS= read -r line; do
    echo -e "${GREEN}[browser]${NC} $line"
  done
) &
BROWSER_PID=$!

# Start edge dev server
(
  cd edge
  echo -e "${YELLOW}[edge]${NC} Starting Wrangler dev server..."
  npm run dev 2>&1 | while IFS= read -r line; do
    echo -e "${YELLOW}[edge]${NC} $line"
  done
) &
EDGE_PID=$!

echo ""
echo -e "${BLUE}Development servers started:${NC}"
echo -e "  ${GREEN}Browser:${NC} http://localhost:5173"
echo -e "  ${YELLOW}Edge:${NC}    http://localhost:8787"
echo ""
echo -e "${RED}Press Ctrl+C to stop all servers${NC}"

# Wait for all background processes
wait $BROWSER_PID $EDGE_PID
