# Changelog

このプロジェクトに対するすべての重要な変更を記録します。

フォーマットは [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に基づいています。

## [Unreleased]

### Added

- `pnpm-biome-template` の 2026-06-26 以降の改善を取り込み:
  - `docs/knowledge/` — OKF v0.1 準拠の知識バンドルのスケルトン（architecture / adr / conventions / runbooks / research + サンプル）
  - `.github/workflows/lint_docker.yml`（hadolint）と `.github/workflows/sbom.yml`（cdxgen で CycloneDX SBOM 生成）
  - `.github/workflows/label_pr.yml` + `.github/labeler.yml` — 開発ハーネス変更 PR に `meta` ラベルを自動付与（glob は Astro 構成に合わせて `astro.config.mjs` / `panda.config.ts` / `postcss.config.cjs` を追加）
  - `security.yml` に Trivy fs スキャンを追加（push / cron 時は SARIF を Security タブへ集約）、トリガ paths に `Dockerfile` を追加
  - `.github/labels.yml` に `dependencies`（deps-update.yml が参照済みだったが未定義）と `meta` ラベルを追加
  - `.github/dependabot.yml` に `docker` / `devcontainers` エコシステムと全エコシステムの `cooldown`（7 日）を追加
  - Issue テンプレートを issue forms 化（`bug.yml` / `enhancement.yml` / `task.yml` + `config.yml` で空白 Issue を無効化）。旧 `.md` 形式は削除
  - PR テンプレートに `## Related issues` セクションを追加
  - `.github/copilot-instructions.md` を拡充（AGENTS.md へのポインタ + Astro 用 Key Commands）
  - `.gitattributes` を追加（改行コードを LF に統一）
  - Dev Container: `node_modules` と pnpm ストアを named volume でホストから分離（`devcontainer.json` の mounts + `post-create.sh` の storeDir 設定）
  - `.devcontainer/README.md` に「この隔離が担保しない範囲」「node_modules と pnpm ストアの分離」節と PAT 事前入力テンプレート URL を追加
  - `vitest.config.ts` の coverage reporter に `lcov` を追加
  - `.vscode/settings.json` に `source.fixAll.biome`、`extensions.json` に `editorconfig.editorconfig` を追加
  - README にテンプレート導入チェックリストの拡充（docs/knowledge 差し替え・`release-check` での健全性確認）

### Changed

- CI ワークフロー全体を最小権限化（トップレベル `permissions: {}` + ジョブ単位付与）、`cancel-in-progress` を PR 限定に変更、fork PR でのカバレッジコメントをスキップ
- `lint_gha.yml` に actionlint ジョブを追加し、zizmor を `uvx zizmor@1.26.1` でバージョン固定
- `.zizmor.yml` のポリシーを列挙式 `ref-pin` から全アクション `hash-pin` に強化
- `deps-update.yml` の更新後チェックを `pnpm test` から `pnpm release-check` に変更（astro build まで検証）
- `labels.yml` ワークフローの concurrency をミューテーション直列化（`cancel-in-progress: false`）
- Dockerfile: ベースイメージを digest 固定（Dependabot の docker エコシステムが追跡）、pnpm を 11.9.0 に固定、`COREPACK_HOME=/opt/corepack` で corepack キャッシュを共有、hadolint 対応（`SHELL -o pipefail` + `DL3008` の明示的許可）
- `package.json` の `packageManager` を pnpm 11.9.0 にハッシュ付きで固定、`@types/node` を engines（`>=24`）に合わせて `^24` に変更
- TypeScript 7（Go 製ネイティブコンパイラ）への更新を検証したが見送り: `@astrojs/check 0.9`（`@astrojs/language-server` 2.x）の peer 制約が `^5 || ^6` で、TS7 では `astro check` が `Cannot read properties of undefined (reading 'fileExists')` でクラッシュする。Astro 言語ツールが TS7 対応した時点で再検討（`typescript` は `^5.9.3` を維持）

## 0.0.0 - 2026-06-26

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
