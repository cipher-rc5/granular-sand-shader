#!/bin/bash

# Setup script for granular-sand-shader project
# This script should be run in an environment with Bun installed

echo "Granular Sand Shader - Setup Script"
echo "===================================="
echo ""

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "Bun is not installed. Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    
    # Add bun to PATH for current session
    export PATH="$HOME/.bun/bin:$PATH"
    
    echo "Bun installed successfully!"
else
    echo "Bun is already installed: $(bun --version)"
fi

echo ""
echo "Installing dependencies..."
bun install

echo ""
echo "Setup complete!"
echo ""
echo "Available commands:"
echo "  bun run dev        - Start development server"
echo "  bun run build      - Build for production"
echo "  bun run start      - Start production server"
echo "  bun run type-check - Run TypeScript type checking"
