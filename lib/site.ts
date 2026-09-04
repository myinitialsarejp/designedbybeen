export const siteConfig = {
  name: "Designed By Been",
  legalName: "Benji Dunn LLC",
  description:
    "Portfolio of Designed By Been — residential and commercial design work, artwork, and picks.",
  social: {
    instagram: "https://instagram.com/designedbybeen",
    tiktok: "https://tiktok.com/@designwithbeen",
  },
} as const;

export type NavItem = {
  title: string;
  href: string;
  imageSrc: string;
  // CSS object-position for the home-page panel, e.g. "center", "top", "50% 30%".
  objectPosition?: string;
  // Zoom/crop scale for the home-page panel; 1 = no zoom, >1 crops in (e.g. 1.2).
  objectZoom?: number;
  children?: NavItem[];
};

export const mainNav: NavItem[] = [
  {
    title: "Portfolio",
    href: "/portfolio",
    imageSrc: "/portfolioMoneyShot.png",
    children: [
      { title: "Residential", href: "/portfolio/residential", imageSrc: "/residentialMoneyShot.png" },
      { title: "Commercial", href: "/portfolio/commercial", imageSrc: "/commercialMoneyShot.png" },
    ],
  },
  { title: "Artwork", href: "/artwork", imageSrc: "/artworkMoneyShot.jpeg" },
  { title: "Picks", href: "/picks", imageSrc: "/the_been.jpg" },
  { title: "About", href: "/about", imageSrc: "/hotDirectorBrittany_genexpand.png", objectPosition: "50% 40%"},
  { title: "Contact", href: "/contact", imageSrc: "/the_been_expanded.png"},
];
