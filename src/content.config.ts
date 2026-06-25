import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const pageCollection = defineCollection({
  loader: glob({ base: "./src/content/page", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    pageTitle: z.string(),
    description: z.string().optional(),
    pubDate: z.date().optional(),
    updatedDate: z.date().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { page: pageCollection };
