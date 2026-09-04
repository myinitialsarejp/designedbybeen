import { defineQuery } from "next-sanity";

export const PROJECTS_BY_CATEGORY_QUERY = defineQuery(
  `*[_type == "project" && category == $category] | order(publishedAt desc){ _id, title, slug, summary, coverImage }`
);

export const PROJECT_QUERY = defineQuery(
  `*[_type == "project" && category in ["residential", "commercial"] && slug.current == $slug][0]{ _id, title, category, summary, location, architect, designer, coverImage, gallery, "videos": videos[]{ caption, "url": asset->url, "mimeType": asset->mimeType }, "picks": picks[]->{ _id, title, link, image, "width": image.asset->metadata.dimensions.width, "height": image.asset->metadata.dimensions.height } }`
);

export const PICKS_QUERY = defineQuery(
  `*[_type == "pick" && defined(link) && defined(image.asset)] | order(_createdAt desc){
    _id,
    title,
    link,
    image,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height
  }`,
);

export const ARTWORK_QUERY = defineQuery(
  `*[_type == "artwork"] | order(date desc, _createdAt desc){ _id, image, "width": image.asset->metadata.dimensions.width, "height": image.asset->metadata.dimensions.height }`,
);

export const SITE_SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings"][0]{ title, instagramUrl, tiktokUrl }`
);
