import { defineQuery } from "next-sanity";

export const PROJECTS_BY_CATEGORY_QUERY = defineQuery(
  `*[_type == "project" && category == $category] | order(publishedAt desc){ _id, title, slug, summary, coverImage }`
);

export const PROJECT_QUERY = defineQuery(
  `*[_type == "project" && slug.current == $slug][0]{ _id, title, category, summary, location, architect, designer, coverImage, gallery, "video": video.asset->{url, mimeType} }`
);

export const JOURNAL_LIST_QUERY = defineQuery(
  `*[_type == "journal" && defined(slug.current)] | order(publishedAt desc){ _id, title, slug, excerpt, coverImage, publishedAt }`
);

export const JOURNAL_POST_QUERY = defineQuery(
  `*[_type == "journal" && slug.current == $slug][0]{ _id, title, body, coverImage, publishedAt }`
);

export const SITE_SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings"][0]{ title, instagramUrl, tiktokUrl }`
);
