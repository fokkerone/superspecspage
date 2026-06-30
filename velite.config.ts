import rehypeSlug from "rehype-slug";
import { defineCollection, defineConfig, s } from "velite";

const docs = defineCollection({
  name: "Doc",
  pattern: "docs/**/*.mdx",
  schema: s.object({
    title: s.string(),
    description: s.string().optional(),
    slug: s.path(),
    order: s.number().optional().default(99),
    published: s.boolean().default(true),
    body: s.mdx(),
    toc: s.toc(),
    tocOverride: s.array(
      s.object({
        title: s.string(),
        id: s.string(),
        depth: s.number().optional().default(2),
      }),
    ).optional(),
    section: s.path().transform((path) => {
      // path looks like "docs/getting-started/installation"
      const parts = path.split("/");
      // parts[0] = "docs", parts[1] = section or filename, parts[2] = filename (if nested)
      return parts.length >= 3 ? parts[1] : null;
    }),
  }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { docs },
  mdx: {
    rehypePlugins: [rehypeSlug],
    remarkPlugins: [],
  },
});
