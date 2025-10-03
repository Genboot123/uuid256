#!/usr/bin/env bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}Running all e2e tests in parallel...${NC}"

# Create temp directory for logs
LOGDIR="$(mktemp -d)"
trap "rm -rf $LOGDIR" EXIT

FAILED=0

# Run node e2e
(
  cd node
  if npm run e2e 2>&1 | while IFS= read -r line; do
    echo -e "${GREEN}[node]${NC} $line"
  done; then
    echo -e "${GREEN}[node] ✅ E2E passed${NC}"
  else
    echo -e "${RED}[node] ❌ E2E failed${NC}"
    exit 1
  fi
) &
NODE_PID=$!

# Run bun e2e
(
  cd bun
  if npm run e2e 2>&1 | while IFS= read -r line; do
    echo -e "${YELLOW}[bun]${NC} $line"
  done; then
    echo -e "${YELLOW}[bun] ✅ E2E passed${NC}"
  else
    echo -e "${RED}[bun] ❌ E2E failed${NC}"
    exit 1
  fi
) &
BUN_PID=$!

# Run edge e2e
(
  cd edge
  if npm run e2e 2>&1 | while IFS= read -r line; do
    echo -e "${CYAN}[edge]${NC} $line"
  done; then
    echo -e "${CYAN}[edge] ✅ E2E passed${NC}"
  else
    echo -e "${RED}[edge] ❌ E2E failed${NC}"
    exit 1
  fi
) &
EDGE_PID=$!

# Run browser e2e
(
  cd browser
  if npm run e2e 2>&1 | while IFS= read -r line; do
    echo -e "${BLUE}[browser]${NC} $line"
  done; then
    echo -e "${BLUE}[browser] ✅ E2E passed${NC}"
  else
    echo -e "${RED}[browser] ❌ E2E failed${NC}"
    exit 1
  fi
) &
BROWSER_PID=$!

# Wait for all e2e tests and check exit codes
wait $NODE_PID || FAILED=$((FAILED + 1))
wait $BUN_PID || FAILED=$((FAILED + 1))
wait $EDGE_PID || FAILED=$((FAILED + 1))
wait $BROWSER_PID || FAILED=$((FAILED + 1))

echo ""
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All e2e tests passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ $FAILED e2e test suite(s) failed${NC}"
  exit 1
fi
