import { defineQuery } from "next-sanity";

export const PROJECTS_BY_CATEGORY_QUERY = defineQuery(
  `*[_type == "project" && category == $category] | order(publishedAt desc){ _id, title, slug, summary, coverImage }`
);

export const PROJECT_QUERY = defineQuery(
  `*[_type == "project" && slug.current == $slug][0]{ _id, title, category, summary, location, architect, designer, coverImage, gallery, "videos": videos[]{ caption, "url": asset->url, "mimeType": asset->mimeType } }`
);

export const SITE_SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings"][0]{ title, instagramUrl, tiktokUrl }`
);
