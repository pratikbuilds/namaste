# Namaste

Namaste is an Expo React Native wallet app for travelers paying QR merchants in Nepal. The current prototype walks users through onboarding, explains how payments work, lets them top up a wallet, lands them on a wallet home screen, and opens a QR scanner flow.

## App Flow

The primary journey is intentionally local and linear:

```text
onboarding -> how it works -> top up wallet -> wallet home -> scan QR
```

`App.tsx` is the flow host. It delegates transition state to `src/navigation/app-flow.ts` and keeps Expo Router for standalone routes such as `/wallet`, `/top-up-wallet`, and `/scan-qr`.

## Product Surface

- Onboarding screen with Google entry and trust highlights.
- How-it-works screen with three illustrated payment steps.
- Wallet top-up flow with USD input, NPR quote, payment method selection, and fixed bottom CTA.
- Wallet home with balance, recent activity, saved QR places, profile tab, and bottom navigation.
- Scan QR screen with camera permission handling, torch state, and scan-result preview.

## Project Structure

```text
app/                         Expo Router route entries
App.tsx                      local onboarding-to-wallet flow host
src/components/              reusable UI primitives and shared visual pieces
src/data/                    shaped product data used by screens
src/hooks/                   stateful flow modules, such as top-up and scan sessions
src/navigation/              app flow and asset warmup modules
src/screens/                 full-screen product surfaces
src/theme/                   typography, motion, surface, CTA, and layout primitives
src/utils/                   platform helpers such as haptics
```

Important modules:

- `src/navigation/app-flow.ts` owns local app-flow transitions.
- `src/hooks/use-top-up-amount.ts` owns top-up amount, quote, CTA, and payment method state.
- `src/hooks/use-scan-qr-session.ts` owns camera permission, torch state, scanned data, and preview state.
- `src/data/wallet-home.ts` defines wallet home state, tabs, transactions, and saved places.
- `src/components/pressable-scale.tsx` centralizes press feedback and reduced-motion behavior.
- `src/theme/design.ts` holds shared color, surface, and motion tokens.

## Local Development

Install dependencies:

```sh
bun install
```

Start Expo:

```sh
bun run start
```

Start the web target:

```sh
bun run web
```

Expo Go is usually fastest with:

```sh
bunx expo start --go --clear
```

If LAN is unreliable, use Expo's tunnel mode from the CLI prompt.

## Quality Gates

Run TypeScript:

```sh
bun run typecheck
```

Run lint and Prettier checks:

```sh
bun run lint
```

Run both:

```sh
bun run check
```

For focused UI changes, prefer `bun run typecheck` plus targeted ESLint on touched source files. Full lint also checks generated and repo-wide files.

## Design Standards

- Keep screen modules readable and product-facing.
- Put reusable behavior behind small modules with clear interfaces.
- Use shared primitives for press feedback, haptics, motion, typography, and CTA styling.
- Keep motion subtle, under 300ms, and respectful of reduced motion.
- Avoid dead affordances: anything that looks tappable should either do something or not look tappable.
- Prefer visual polish that improves clarity over decoration.

## Repository Standards

- Keep application code in `src/`.
- Use kebab-case file names.
- Prefer `@/` imports for app modules.
- Do not commit secrets. Use `.env.example` to document required variables.
- Do not commit local browser artifacts; `.playwright-mcp/` is ignored.
- Run `bun run check` before opening a pull request.

## Known Development Note

The web target may log a NativeWind dark-mode warning:

```text
Cannot manually set color scheme, as dark mode is type 'media'
```

This is a development-console warning and is separate from the wallet UI flow.
