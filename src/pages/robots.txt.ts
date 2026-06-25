import type { APIContext } from "astro";

export function GET(context: APIContext): Response {
  if (!context.site) {
    throw new Error("robots.txt を生成するには astro.config.mjs の `site` を設定してください");
  }
  const sitemapUrl = new URL("/sitemap-index.xml", context.site).toString();
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
