# GitHub Copilot Instructions

See [AGENTS.md](../AGENTS.md) for the full project guidelines (structure, coding style, testing, commit and PR conventions).

## Key Commands

- Install dependencies: `pnpm install --frozen-lockfile` (runs `panda codegen` via the `prepare` lifecycle)
- Format & lint check: `pnpm fmt:check` / `pnpm lint`
- Type check (astro check): `pnpm check`
- Test: `pnpm test`
- Test with coverage: `pnpm test:cov`
- Build (Astro): `pnpm build`
- Regenerate Panda CSS output (after editing `panda.config.ts`): `pnpm prepare`
- Release check (CI-equivalent): `pnpm release-check`

## Language

- Respond in Japanese.
