import { defineMcp } from "@lovable.dev/mcp-js";
import searchProducts from "./tools/search-products";
import listBrands from "./tools/list-brands";
import listBlogPosts from "./tools/list-blog-posts";
import getBlogPost from "./tools/get-blog-post";

export default defineMcp({
  name: "dripway-mcp",
  title: "DRIPWAY",
  version: "0.1.0",
  instructions:
    "DRIPWAY is a discovery engine for niche, emerging, and underground fashion brands. Use these tools to search products, browse brands, and read DRIPWAY's editorial posts. Shop links point to thedripway.com and its affiliate partners.",
  tools: [searchProducts, listBrands, listBlogPosts, getBlogPost],
});