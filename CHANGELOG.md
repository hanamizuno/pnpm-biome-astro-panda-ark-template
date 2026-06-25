# Changelog

このプロジェクトに対するすべての重要な変更を記録します。

フォーマットは [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に基づいています。

## [Unreleased]

### Added

- 初回リリース: `pnpm-biome-template` のツールチェイン（pnpm 11 + Biome 2 + Node 24 + vitest + AI Agent DevContainer + GitHub workflows + pre-commit hooks）と `deno-astro-panda-ark-template` のフロントエンドスタック（Astro 7 + Panda CSS 1.10 + Ark UI 5 + React 19, Content Collections, MDX, sitemap, RSS, light/dark テーマシステム）を融合
- `package.json` の `prepare` スクリプト (`panda codegen`) で `pnpm install` 時に `styled-system/` を自動生成
- Dockerfile を Astro 用に再構成（`dev` / `builder` / `prod` / `devcontainer` の 5 ステージ、本番は `pnpm preview` でポート 4321 配信）
- `.vscode/settings.json` と `.devcontainer/devcontainer.json` に `[astro]` 用フォーマッタ上書き（`astro-build.astro-vscode`）と `[typescriptreact]` ルールを追加
- `src/utils/theme.test.ts` を追加（vitest が動作することを示すサンプル）
- `.github/workflows/test.yml` に `astro build` のスモークテストを追加

### Changed

- TypeScript は `^5.9.3` を採用（`@astrojs/check 0.9` との互換性を優先）
- `biome.json` の `files.excludes` に `.astro` / `styled-system` / `.astro` を追加
- `vitest.config.ts` の `coverage.include` を `src/utils/**` に限定（Astro コンポーネント・pages・layouts は対象外）
- `.pre-commit-config.yaml` の `typecheck` フックを `astro check` に置換
- `.gitignore` / `.dockerignore` / `.secretlintignore` に `.astro` / `styled-system` / `styled-system-studio` を追加
- `pnpm-workspace.yaml` の `allowBuilds` に `sharp` を追加（Astro 画像最適化用）

### Removed

- `src/main.ts` / `src/main.test.ts` / `src/main.bench.ts`（Astro `src/` に置換）
- `tsconfig.build.json`（tsc emit ステップ不要）
- Deno 関連ファイル全般（`deno.json` / `deno.lock` / Deno タスク経由のスクリプト）
