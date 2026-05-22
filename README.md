# Namaste

Production-ready Expo React Native app for Namaste.

## Local Development

```sh
bun install
bun run start
```

## Quality Gates

```sh
bun run typecheck
bun run lint
bun run check
```

The project is configured with strict TypeScript, Expo ESLint, Prettier, NativeWind, and CI checks.

## Repository Standards

- Keep application code in `src/`.
- Use kebab-case file names.
- Prefer `@/` imports for app modules.
- Do not commit secrets. Use `.env.example` to document required variables.
- Run `bun run check` before opening a pull request.
