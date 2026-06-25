ARG NODE_VERSION=24
ARG DEBIAN_VERSION=bookworm

# ===== Stage 1: base (corepack + pnpm) =====
FROM node:${NODE_VERSION}-slim AS base

RUN corepack enable && corepack prepare pnpm@11 --activate
WORKDIR /app

# ===== Stage 2: development (compose.dev.yml で使用) =====
FROM base AS dev

WORKDIR /workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc ./
COPY panda.config.ts postcss.config.cjs ./
# `prepare` ライフサイクルで panda codegen が走り styled-system/ が生成される
RUN pnpm install --frozen-lockfile

USER node
EXPOSE 4321
CMD ["pnpm", "dev", "--", "--host", "0.0.0.0", "--port", "4321"]

# ===== Stage 3: builder (Astro でビルド) =====
FROM base AS builder

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc ./
COPY panda.config.ts postcss.config.cjs ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json astro.config.mjs ./
COPY public ./public
COPY src ./src
RUN pnpm build

# ===== Stage 4: production (astro preview で dist/ を配信) =====
FROM base AS prod

WORKDIR /app

COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node \
     /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/.npmrc ./
# dist 配信に panda codegen は不要なので --ignore-scripts でスキップ
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

USER node
EXPOSE 4321
ENTRYPOINT []
CMD ["pnpm", "preview", "--", "--host", "0.0.0.0", "--port", "4321"]

# ===== Stage 5: devcontainer =====
FROM mcr.microsoft.com/vscode/devcontainers/base:${DEBIAN_VERSION} AS devcontainer

ARG NODE_VERSION
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable \
    && corepack prepare pnpm@11 --activate

# chrome-devtools-mcp 用の headless Chromium と描画フォント（日本語含む）。
# コンテナ内ではカーネルサンドボックスを利用できないため --no-sandbox を付与する
# ラッパーを用意し、MCP からは executablePath でこれを指定する
# （--disable-dev-shm-usage は /dev/shm が小さい Docker 環境でのクラッシュ対策）。
RUN apt-get update \
    && apt-get install -y --no-install-recommends chromium fonts-noto-cjk fonts-liberation \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && printf '#!/bin/sh\nexec /usr/bin/chromium --no-sandbox --disable-dev-shm-usage "$@"\n' \
       > /usr/local/bin/chromium-no-sandbox \
    && chmod +x /usr/local/bin/chromium-no-sandbox

RUN mkdir -p /commandhistory /home/vscode/.claude /home/vscode/.codex /home/vscode/.config/gh \
    && chown -R vscode:vscode /commandhistory /home/vscode/.claude /home/vscode/.codex /home/vscode/.config \
    && ln -sf /home/vscode/.claude/.claude.json /home/vscode/.claude.json \
    && chown -h vscode:vscode /home/vscode/.claude.json

CMD ["sleep", "infinity"]
