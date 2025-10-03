.PHONY: help install clean dev build test install-browser install-node install-bun install-edge

# Default target
help:
	@echo "Available targets:"
	@echo "  make install    - Install dependencies for all examples"
	@echo "  make clean      - Clean all node_modules and build artifacts"
	@echo "  make dev        - Run dev servers for all examples in parallel"
	@echo "  make build      - Build all examples"
	@echo "  make test       - Run tests for all examples"

# Install all dependencies
install: install-browser install-node install-bun install-edge
	@echo "✅ All dependencies installed"

install-browser:
	@echo "📦 Installing browser dependencies..."
	@cd browser && pnpm install

install-node:
	@echo "📦 Installing node dependencies..."
	@cd node && npm install

install-bun:
	@echo "📦 Installing bun dependencies..."
	@cd bun && bun install

install-edge:
	@echo "📦 Installing edge dependencies..."
	@cd edge && npm install

# Clean all
clean:
	@echo "🧹 Cleaning all examples..."
	@rm -rf browser/node_modules browser/dist
	@rm -rf node/node_modules
	@rm -rf bun/node_modules
	@rm -rf edge/node_modules edge/.wrangler
	@echo "✅ Clean completed"

# Development - run all in parallel
dev:
	@echo "🚀 Starting development servers..."
	@./scripts/dev-parallel.sh

# Build all
build:
	@echo "🔨 Building all examples..."
	@cd browser && npm run build
	@echo "✅ Build completed"

# Test all
test:
	@echo "🧪 Running tests..."
	@./scripts/test-parallel.sh
