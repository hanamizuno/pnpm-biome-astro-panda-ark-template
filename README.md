# pnpm + Biome + Astro + Panda CSS + Ark UI Template

[pnpm](https://pnpm.io/) + [Biome](https://biomejs.dev/) + [Astro](https://astro.build/) +
[Panda CSS](https://panda-css.com/) + [Ark UI](https://ark-ui.com/) のテンプレートです。

## 機能一覧

- Astro 7 による静的サイト生成（MDX / Content Collections / sitemap / RSS / robots.txt）
- Panda CSS 1.10 による型安全なスタイリング（セマンティックトークン + light/dark テーマ）
- Ark UI 5 + React 19 の Astro Islands（テーマメニューのサンプル付き）
- TypeScript による型安全な開発環境（Astro strict プリセット）
- Biome 2 による高速なフォーマット・リント（TS/TSX/JSON/JSONC を担当。`.astro` は Astro VS Code 拡張）
- テスト・ベンチマーク・カバレッジ計測（vitest, しきい値 80%、計測対象は `src/utils/**`）
- pre-commit hooks による品質保証（biome / astro check / secretlint）
- GitHub Actions による CI（Node 24/25 マトリクス、Actions と Features を sha256 固定、依存自動更新）
- シークレットスキャン（secretlint）
- VS Code Dev Containers: AI エージェントツールチェーン（Claude Code CLI、Codex CLI、GitHub CLI、共通ユーティリティ）を [Dev Container Features](https://containers.dev/implementors/features/) と post-create セットアップで重ねて注入
- Chrome DevTools MCP + headless Chromium: エージェントがコンテナ内で画面の見た目をデバッグ（スクリーンショット・コンソール・ネットワーク確認）

## セットアップ

```bash
corepack enable
pnpm install
```

`pnpm install` の `prepare` ライフサイクルで `panda codegen` が自動実行され、
`styled-system/` ディレクトリが生成されます。

`pnpm` は `package.json` の `packageManager` フィールド経由で corepack が自動的に正しいバージョンを使用します。

### pre-commit hooks（任意）

[prek](https://github.com/j178/prek) を[インストール](https://github.com/j178/prek?tab=readme-ov-file#installation)した後：

```bash
prek install
```

## 主なコマンド

```bash
pnpm dev            # Astro 開発サーバー（http://localhost:4321）
pnpm build          # Astro で dist/ にビルド
pnpm preview        # dist/ をローカル配信
pnpm studio         # Panda Studio（http://localhost:3000）
pnpm check          # astro check（型 + 構文）
pnpm test           # vitest 単体テスト
pnpm test:cov       # カバレッジ計測
pnpm bench          # ベンチマーク
pnpm fmt            # フォーマット適用
pnpm fmt:check      # フォーマット検査のみ
pnpm lint           # Biome リント
pnpm release-check  # CI 相当（biome ci + astro check + vitest + astro build）
pnpm scan:secrets   # シークレット検出
pnpm prepare        # panda codegen 手動実行（panda.config.ts 変更後など）
```

詳細は [AGENTS.md](AGENTS.md) を参照。

## 初期設定でやっておくこと

派生プロジェクトを作ったら、以下を自分の値に置換してください。

1. `astro.config.mjs` の `site: "https://example.com"` を公開 URL に変更
2. `src/config.ts` の `SITE` メタデータ（title / description / author 等）を編集
3. `public/favicon.svg` を自身の favicon に差し替え
4. `LICENSE` 内の `[yyyy] [name of copyright owner]` を年と著作権者名に置換
5. `.github/CODEOWNERS` の `@REPLACE-ME` を実在の GitHub ハンドルに置換
6. `package.json` の `name` を派生先のパッケージ名に変更

## プロジェクト構造

ディレクトリ構成・設定ファイルの詳細は [AGENTS.md](AGENTS.md) を参照してください。

## AI Agent Dev Container

VS Code Dev Container を AI コーディングエージェント（Claude Code / Codex 等）の実行環境としても利用できます。同梱ツール・認証手順・ホスト設定の継承・サンドボックスのモード・PAT 運用などの詳細は [.devcontainer/README.md](.devcontainer/README.md) を参照してください。

## リリースチェックリスト

1. `pnpm release-check` を実行してすべてのチェックが通ることを確認
2. `CHANGELOG.md` を更新
3. バージョンタグを作成

## ライセンス

[MIT](LICENSE)。`LICENSE` 内の `[yyyy] [name of copyright owner]` は派生先で年と著作権者名に置換してください。
