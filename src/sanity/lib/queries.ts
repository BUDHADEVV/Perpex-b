import { groq } from "next-sanity";

export const HERO_QUERY = groq`*[_type == "hero"][0]{
  heroTitle,
  heroSubtitle,
  heroTagline,
  heroButtonText,
  "videoUrl": videoUrl,
  "desktopImages": desktopImages[].asset->url
}`;

export const EXPERTS_QUERY = groq`*[_type == "expert"]{
  name,
  "imageUrl": image.asset->url,
  link
}`;

export const ROADMAP_QUERY = groq`*[_type == "roadmap"] | order(badge asc) {
  title,
  badge,
  items,
  hasEmoji
}`;

export const FAQ_QUERY = groq`*[_type == "faq"]{
  question,
  answer
}`;

export const PROGRAM_QUERY = groq`*[_type == "program"]{
  text,
  icon
}`;
