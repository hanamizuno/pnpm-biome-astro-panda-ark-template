import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { SITE } from "../config";

export async function GET(context: APIContext) {
  if (!context.site) {
    throw new Error("RSS を生成するには astro.config.mjs の `site` を設定してください");
  }

  const pages = await getCollection("page");

  // 日付でソート（更新日または作成日）
  const sortedPages = pages.sort((a, b) => {
    const dateA = a.data.updatedDate || a.data.pubDate || new Date(0);
    const dateB = b.data.updatedDate || b.data.pubDate || new Date(0);
    return dateB.getTime() - dateA.getTime();
  });

  return rss({
    title: SITE.rss.title,
    description: SITE.rss.description,
    site: context.site,
    items: sortedPages
      .filter((page) => !page.data.draft) // 下書きを除外
      .map((page) => ({
        title: page.data.pageTitle,
        description: page.data.description || SITE.description,
        pubDate: page.data.pubDate || page.data.updatedDate || new Date(),
        link: page.id === "index" ? "/" : `/${page.id}/`,
        author: SITE.author,
      })),
    customData: SITE.rss.customData,
  });
}
