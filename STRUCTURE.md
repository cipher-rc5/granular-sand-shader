# Project Structure

```
granular-sand-shader/
├── app/
│   ├── globals.css                 # Tailwind CSS v4 configuration and global styles
│   ├── layout.tsx                  # Root layout component with metadata
│   └── page.tsx                    # Main page component with UI overlay
├── components/
│   └── desert-sand.tsx             # WebGL shader component using Three.js
├── lib/
│   └── shader-constants.ts         # GLSL shader source code and color constants
├── types/
│   └── shader.types.ts             # TypeScript type definitions for shaders
├── .gitignore                      # Git ignore configuration
├── next.config.js                  # Next.js configuration
├── package.json                    # Bun package configuration
├── README.md                       # Project documentation
├── STRUCTURE.md                    # Project structure documentation (this file)
└── tsconfig.json                   # TypeScript configuration with strict mode
```

## Directory Descriptions

### `app/`

Next.js App Router directory containing:

- **globals.css**: Tailwind CSS v4 imports and custom theme variables
- **layout.tsx**: Root layout with HTML structure and metadata
- **page.tsx**: Home page component with shader background and UI elements

### `components/`

Reusable React components:

- **desert-sand.tsx**: Client-side WebGL shader component using Three.js

### `lib/`

Utility functions and constants:

- **shader-constants.ts**: GLSL vertex and fragment shader source code, sand color palette

### `types/`

TypeScript type definitions:

- **shader.types.ts**: Type-safe interfaces for shader uniforms and configuration

## Key Files

- **tsconfig.json**: Strict TypeScript configuration with `noImplicitAny` and comprehensive checks
- **next.config.js**: Next.js configuration for production builds
- **package.json**: Bun-compatible dependencies and scripts

## Coding Standards

- All TypeScript files include file header with path, description, and reference
- Snake_case naming convention for variables and functions
- Strict type-safety without `any` types
- No emojis in code or documentation
