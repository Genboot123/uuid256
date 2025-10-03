#!/usr/bin/env bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo ""
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}${BLUE}  UUID256 Examples - Running All Tests in Parallel${NC}"
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

START_TIME=$(date +%s)

# Create temp directory for logs
LOGDIR="$(mktemp -d)"
trap "rm -rf $LOGDIR" EXIT

FAILED=0
PASSED=0

# Run node tests
(
  echo -e "${GREEN}[node]${NC} ${BOLD}Starting Node.js tests...${NC}"
  cd node
  if npm run test 2>&1 | while IFS= read -r line; do
    echo -e "${GREEN}[node]${NC} $line"
  done; then
    echo -e "${GREEN}[node] ${BOLD}✅ Tests passed${NC}"
    exit 0
  else
    echo -e "${RED}[node] ${BOLD}❌ Tests failed${NC}"
    exit 1
  fi
) &
NODE_PID=$!

# Run bun tests
(
  echo -e "${YELLOW}[bun]${NC} ${BOLD}Starting Bun tests...${NC}"
  cd bun
  if npm run test 2>&1 | while IFS= read -r line; do
    echo -e "${YELLOW}[bun]${NC} $line"
  done; then
    echo -e "${YELLOW}[bun] ${BOLD}✅ Tests passed${NC}"
    exit 0
  else
    echo -e "${RED}[bun] ${BOLD}❌ Tests failed${NC}"
    exit 1
  fi
) &
BUN_PID=$!

# Run edge tests
(
  echo -e "${CYAN}[edge]${NC} ${BOLD}Starting Edge Worker tests...${NC}"
  cd edge
  if npm run test 2>&1 | while IFS= read -r line; do
    echo -e "${CYAN}[edge]${NC} $line"
  done; then
    echo -e "${CYAN}[edge] ${BOLD}✅ Tests passed${NC}"
    exit 0
  else
    echo -e "${RED}[edge] ${BOLD}❌ Tests failed${NC}"
    exit 1
  fi
) &
EDGE_PID=$!

# Run browser tests
(
  echo -e "${MAGENTA}[browser]${NC} ${BOLD}Starting Browser tests...${NC}"
  cd browser
  if npm run test 2>&1 | while IFS= read -r line; do
    echo -e "${MAGENTA}[browser]${NC} $line"
  done; then
    echo -e "${MAGENTA}[browser] ${BOLD}✅ Tests passed${NC}"
    exit 0
  else
    echo -e "${RED}[browser] ${BOLD}❌ Tests failed${NC}"
    exit 1
  fi
) &
BROWSER_PID=$!

# Wait for all tests and check exit codes
wait $NODE_PID && PASSED=$((PASSED + 1)) || FAILED=$((FAILED + 1))
wait $BUN_PID && PASSED=$((PASSED + 1)) || FAILED=$((FAILED + 1))
wait $EDGE_PID && PASSED=$((PASSED + 1)) || FAILED=$((FAILED + 1))
wait $BROWSER_PID && PASSED=$((PASSED + 1)) || FAILED=$((FAILED + 1))

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}${BLUE}  Test Results Summary${NC}"
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${GREEN}✅ Passed:${NC} ${BOLD}$PASSED${NC} / 4 test suites"
if [ $FAILED -gt 0 ]; then
  echo -e "  ${RED}❌ Failed:${NC} ${BOLD}$FAILED${NC} / 4 test suites"
fi
echo -e "  ${BLUE}⏱  Duration:${NC} ${BOLD}${DURATION}s${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${BOLD}${GREEN}🎉 All tests passed successfully!${NC}"
  echo ""
  exit 0
else
  echo -e "${BOLD}${RED}💥 Some tests failed. Please check the output above for details.${NC}"
  echo ""
  exit 1
fi
