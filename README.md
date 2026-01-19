# Granular Sand Shader

A high-definition micro-sands texture simulation using WebGL shaders with Next.js, Tailwind CSS v4, and Bun runtime.

## Features

- WebGL shader-based granular sand texture
- Multi-layered noise with high-frequency micro-textures
- Sharpened shimmer glints simulating individual mineral reflections
- Strict TypeScript type-safety without `any` types
- Tailwind CSS v4 for styling
- Bun runtime for optimal performance

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: Bun
- **Styling**: Tailwind CSS v4
- **3D Graphics**: Three.js
- **Language**: TypeScript (strict mode)

## Prerequisites

- Bun >= 1.0.0

## Installation

```bash
bun install
```

## Development

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Build

```bash
bun run build
```

## Type Checking

```bash
bun run type-check
```

## Project Structure

See `STRUCTURE.md` for detailed project tree.

## Shader Details

The shader implements:

- Classic Simplex noise for organic terrain
- High-frequency grain patterns (2500x scale)
- Wind veil effects with elongated streaks
- Dynamic slope-based lighting
- Granular shimmer with sharp glints
- Colors: #EEEBE5 (Light) and #E2D2C3 (Mid/Shadow)
