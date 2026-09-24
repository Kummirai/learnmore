import type { MetadataRoute } from "next";

const SITE_URL = "https://relateworld.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/register", "/store/checkout", "/admin", "/profile", "/settings"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}