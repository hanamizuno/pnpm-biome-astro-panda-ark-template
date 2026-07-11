# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.
ユーザーとの会話やドキュメント・コメント・コミットメッセージ・プルリクエストは日本語で書いてください。

## プロジェクト概要

pnpm + Biome + Astro + Panda CSS + Ark UI ベースのテンプレートプロジェクトです。
Astro 7 による静的サイト生成、Panda CSS 1.10 による型安全スタイリング、Ark UI 5 + React 19 によるヘッドレスコンポーネント (Islands)、Biome 2 による高速フォーマット/リント、vitest による単体テストを標準構成としています。

コンテナ構成: `Dockerfile`（マルチステージ: `dev` / `builder` / `prod` / `devcontainer`）、`compose.dev.yml`（開発）、`compose.yml`（本番、`astro preview` で `dist/` を配信）。Dev Container（`.devcontainer/devcontainer.json`）は AI エージェント CLI（Claude Code / Codex / GitHub CLI）を Dev Container Features と post-create フック経由で重ねて注入する実行環境も兼ねます。見た目のデバッグ用に headless Chromium + Chrome DevTools MCP（`chrome-devtools-mcp`）も同梱しており、エージェントが Astro 開発サーバー（http://localhost:4321）の画面をスクリーンショット等で確認できます。さらにホスト設定 — グローバル gitignore、git identity（user.name / user.email）、Claude Code の settings / statusline — も継承します（`.devcontainer/initialize.sh` がステージングし、`.devcontainer/post-start.sh` がコンテナ内へ反映）。`node_modules` と pnpm ストアは named volume でホストの bind mount から分離しています（プラットフォーム固有バイナリの混在による再インストールループ防止。詳細は `.devcontainer/README.md`）。

## 重要な前提

- **Biome は `.astro` を解析しません**: `*.ts` / `*.tsx` / `*.json` / `*.jsonc` のみを担当します。`.astro` ファイルのフォーマットは Astro VS Code 拡張 (`astro-build.astro-vscode`) が行い、型/構文の検証は `astro check` (= `pnpm check` / `pnpm typecheck`) で行います。CI には `.astro` 専用のフォーマッタチェックを置いていません。
- **Panda codegen は `pnpm install` で自動実行されます**: `package.json` の `prepare` スクリプト (`panda codegen`) が npm/pnpm の install ライフサイクルで走り、`styled-system/` を生成します。`panda.config.ts` を編集した後は `pnpm prepare` を手動で再実行してください。
- **`styled-system/` と `.astro/` は git 管理外**です（生成物）。
- **テストカバレッジの計測対象は `src/utils/**` に限定**しています（Astro コンポーネント / pages / layouts は対象外）。Astro コンポーネントのテストは scope 外で、必要なら `jsdom` などを追加してください。

## 開発コマンド

### 基本的なコマンド

```bash
# 開発サーバー (http://localhost:4321)
pnpm dev

# ビルド (dist/ を生成)
pnpm build

# ビルド成果物を配信
pnpm preview

# Panda Studio (http://localhost:3000)
pnpm studio

# astro check (型 + 構文)
pnpm check
# pre-commit からは `pnpm typecheck` (同義のエイリアス) で呼ばれる
pnpm typecheck

# Panda codegen 手動実行 (panda.config.ts 変更後など)
pnpm prepare

# テスト
pnpm test
# カバレッジ計測
pnpm test:cov
# ベンチマーク
pnpm bench

# フォーマット適用 / 検査
pnpm fmt
pnpm fmt:check

# リント
pnpm lint

# リリース前一括チェック (biome ci + astro check + vitest + astro build)
pnpm release-check

# シークレットスキャン
pnpm scan:secrets
```

### pnpm コマンド

```bash
pnpm install --frozen-lockfile  # 依存インストール (prepare で panda codegen が走る)
pnpm add <package-name>         # 依存追加
pnpm add -D <package-name>      # 開発依存追加
pnpm update                     # 依存更新
```

## アーキテクチャ概要

### ディレクトリ構造

```
.
├── src/
│   ├── config.ts                # サイトメタデータ (title/description/author/RSS)
│   ├── content.config.ts        # Content Collections スキーマ (Zod)
│   ├── content/page/index.md    # ホームページサンプル
│   ├── layouts/Base.astro       # SEO / OGP / RSS link / inline テーマ初期化スクリプト
│   ├── components/
│   │   ├── Header.astro         # ナビ + ThemeMenu Island (client:load)
│   │   ├── Footer.astro
│   │   └── ThemeMenu.tsx        # React Island: Ark UI Menu でテーマ切替
│   ├── pages/
│   │   ├── [...slug].astro      # Content Collections からの動的ルート
│   │   ├── 404.astro
│   │   ├── robots.txt.ts        # 動的生成
│   │   └── rss.xml.ts           # updatedDate/pubDate 順、draft 除外
│   ├── styles/global.css        # @layer reset, base, tokens, recipes, utilities;
│   └── utils/
│       ├── theme.ts             # localStorage / matchMedia / data-theme 操作
│       └── theme.test.ts        # vitest サンプル
├── public/                      # 静的アセット (favicon 等)
├── styled-system/               # Panda codegen 出力 (git 管理外)
├── .astro/                      # Astro 型生成出力 (git 管理外)
├── dist/                        # ビルド成果物 (git 管理外)
├── docs/
│   └── knowledge/               # OKF v0.1 知識バンドル（architecture / adr / conventions / runbooks / research）
├── package.json                 # スクリプト / 依存
├── pnpm-lock.yaml
├── pnpm-workspace.yaml          # allowBuilds (esbuild, sharp) / overrides (依存の強制解決)
├── tsconfig.json                # astro/tsconfigs/strict を extends
├── biome.json                   # Biome 設定 (`.astro` / styled-system は除外)
├── astro.config.mjs             # Astro 設定 (mdx / sitemap / react / remark/rehype)
├── panda.config.ts              # Panda CSS 設定 (semantic tokens / conditions / globalCss)
├── postcss.config.cjs           # @pandacss/dev/postcss
├── vitest.config.ts             # vitest 設定 (coverage は src/utils/** のみ)
├── AGENTS.md                    # AI エージェント用ガイドライン (本ファイル)
├── CLAUDE.md                    # AGENTS.md へのシンボリックリンク
├── CHANGELOG.md
├── LICENSE                      # MIT
├── README.md
├── .editorconfig
├── .gitattributes               # 改行コードを LF に統一
├── .vscode/                     # エディタ設定 (Biome / EditorConfig / Astro 拡張の推奨)
├── .npmrc                       # pnpm 挙動設定 (engine-strict 等)
├── .nvmrc                       # Node.js バージョン固定
├── .pre-commit-config.yaml      # biome / astro check / secretlint
├── .secretlintrc.json
├── .secretlintignore
├── .zizmor.yml                  # GitHub Actions セキュリティ設定 (全アクション hash-pin 強制)
├── Dockerfile                   # マルチステージ (dev / builder / prod / devcontainer)
├── compose.yml                  # 本番 (target: prod, 4321)
├── compose.dev.yml              # 開発 (target: dev, bind mount, 4321)
├── .devcontainer/
│   ├── devcontainer.json        # Dev Container 設定 (Astro 拡張 + Biome 拡張。node_modules は volume でホストと分離)
│   ├── initialize.sh            # ホスト側ステージング (gitignore / git identity / Claude 設定)
│   ├── post-create.sh           # 初回構築 (pnpm ストア設定 / pnpm install / Codex / Chrome DevTools MCP)
│   ├── post-start.sh            # 起動時にホスト設定を反映
│   ├── codex-config.toml        # Codex CLI 初期設定
│   └── README.md                # エージェント実行環境の詳細 (認証 / 隔離範囲 / PAT 運用)
└── .github/
    ├── dependabot.yml           # GitHub Actions / docker / devcontainers を週次更新 (cooldown 7 日)
    ├── CODEOWNERS               # @REPLACE-ME (派生先で要置換)
    ├── PULL_REQUEST_TEMPLATE.md
    ├── labels.yml               # ラベル定義 (dependencies / meta 含む)
    ├── labeler.yml              # ハーネス変更 PR に meta ラベルを付けるパス定義
    ├── copilot-instructions.md
    ├── ISSUE_TEMPLATE/          # issue forms (bug / enhancement / task)
    ├── scripts/sync-labels.sh
    └── workflows/
        ├── lint.yml             # biome ci + astro check + secretlint
        ├── test.yml             # Node 24/25 マトリクス + vitest + astro build
        ├── lint_gha.yml         # GitHub Actions 自体のリント (actionlint + zizmor)
        ├── lint_docker.yml      # Dockerfile のリント (hadolint)
        ├── security.yml         # 依存関係のセキュリティ監査 + Trivy (毎日)
        ├── sbom.yml             # CycloneDX SBOM 生成 (cdxgen)
        ├── deps-update.yml      # 依存関係の自動更新 (毎週月曜)
        ├── labels.yml           # ラベル同期
        ├── label_pr.yml         # PR 自動ラベリング (actions/labeler)
        └── copilot-setup-steps.yml
```

### 設定ファイル

#### astro.config.mjs

- **site**: 本番公開 URL (canonical / OGP / sitemap / RSS / robots.txt が参照)。派生先で必ず置換
- **integrations**: `mdx()`, `sitemap()`, `react()`
- **markdown.processor**: `unified()` で remark/rehype プラグインを有効化 (`remark-breaks` + `rehype-external-links` で外部リンクを `target=_blank`)

#### panda.config.ts

- **preflight**: CSS リセット有効
- **strictPropertyValues / shorthands: false**: 型安全性重視
- **semanticTokens.colors**: `background` / `foreground` / `card` / `cardForeground` / `primary` / `primaryForeground` / `muted` / `mutedForeground` / `border` を `_light` / `_dark` で定義
- **conditions**: `light` / `dark` を `[data-theme='X'] &` で定義
- **globalCss**: `data-theme` 属性によるカラースキーム + リンク色

#### biome.json (v2)

- **vcs**: git 連携、`.gitignore` を尊重
- **formatter**: 行幅 100、スペース 2 / **javascript.formatter**: ダブルクォート、セミコロンあり
- **linter**: 推奨ルール
- **files.includes**: `**/*.astro`, `**/styled-system`, `**/.astro` を明示的に除外（Biome は `.astro` を解析しない）

#### tsconfig.json

- `astro/tsconfigs/strict` を `extends`
- `include: [".astro/types.d.ts", "**/*"]`, `exclude: ["dist", "styled-system"]`

#### vitest.config.ts

- **include**: `src/**/*.test.{ts,tsx}` / **benchmark.include**: `src/**/*.bench.{ts,tsx}`
- **coverage.include**: `src/utils/**/*.{ts,tsx}` に限定（Astro コンポーネント / pages / layouts は対象外）
- **coverage thresholds**: 80%（lines / functions / branches / statements）

#### GitHub Actions

継続的インテグレーション：

- **lint.yml**: プッシュ/PR 時のコード品質チェック（`biome ci .` + `astro check` + `secretlint`）
- **test.yml**: プッシュ/PR 時のテスト実行とカバレッジ計測（PR にカバレッジレポートをコメント。fork PR はスキップ） + `astro build` のスモークテスト
- **lint_gha.yml**: Actions 自体のリント（actionlint + zizmor、全アクション hash-pin 強制）
- **lint_docker.yml**: Dockerfile のリント（hadolint）
- **security.yml**: `pnpm audit` + Trivy fs スキャンを毎日実行（push / cron 時は SARIF を Security タブへ集約）
- **sbom.yml**: CycloneDX SBOM を生成して artifact にアップロード（cdxgen）
- **deps-update.yml**: `pnpm update` を毎週月曜実行、`pnpm release-check` 通過後に PR を自動作成
- **labels.yml**: `.github/labels.yml` のラベル定義をリポジトリへ同期
- **label_pr.yml**: `.github/labeler.yml` のパス定義に基づき、開発ハーネス変更 PR に `meta` ラベルを自動付与
- **copilot-setup-steps.yml**: GitHub Copilot 用の環境セットアップ

すべてのワークフローはトップレベル `permissions: {}` + ジョブ単位の最小権限で運用し、アクションは commit SHA（docker は digest）で固定しています（`.zizmor.yml` の `hash-pin` ポリシーで強制）。

### 技術選択

- **Node.js v24**: LTS ランタイム
- **pnpm 11**: 高速・効率的なパッケージマネージャー
- **Biome v2**: 高速なフォーマッター・リンター（TS/TSX/JSON 担当）
- **Astro 7**: 静的サイト生成（Islands アーキテクチャ）
- **Panda CSS 1.10**: 型安全な CSS-in-JS（codegen 方式、ランタイムなし）
- **Ark UI 5**: ヘッドレスコンポーネント（Panda CSS と組み合わせて利用）
- **React 19**: Astro Islands 用
- **vitest**: TypeScript ネイティブなテストランナー
- **TypeScript 5.x**: 型安全性とより良い開発体験

#### pre-commit hooks

`.pre-commit-config.yaml` で定義されたフック：

- **biome-check**: コミット前にフォーマット + リントチェック（`.astro` は `types_or` で自動除外）
- **typecheck**: `astro check`（`.ts` / `.tsx` / `.astro` の変更時に実行）
- **secretlint**: シークレット検出

セットアップ: [prek をインストール](https://github.com/j178/prek?tab=readme-ov-file#installation)後、`prek install` を実行

## 開発のベストプラクティス

1. **型安全性**: TypeScript / Astro / Panda CSS の型システムを最大限活用（特に `strictPropertyValues`）
2. **codegen の維持**: `panda.config.ts` 変更後は `pnpm prepare`
3. **Astro Islands**: インタラクティブな部品のみ `client:*` ディレクティブで水和（過剰な水和を避ける）
4. **小さなコミット**: 論理的な単位でコミット
5. **CI/CD**: GitHub Actions で品質を保証
6. **ドキュメント**: コードの意図を明確に記述
