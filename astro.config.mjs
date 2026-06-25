// @ts-check

import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import remarkBreaks from "remark-breaks";

// https://astro.build/config
export default defineConfig({
  // 本番で公開するサイトのURL。canonical・OGP・sitemap・RSS・robots.txt が参照します
  site: "https://example.com",
  integrations: [mdx(), sitemap(), react()],
  markdown: {
    // v7 から既定は Sätteri。remark/rehype プラグインを使うため unified() で従来の処理系を有効化する
    processor: unified({
      remarkPlugins: [remarkBreaks],
      rehypePlugins: [
        [
          rehypeExternalLinks,
          {
            target: "_blank",
          },
        ],
      ],
    }),
  },
});
