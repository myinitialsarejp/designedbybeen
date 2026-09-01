export const siteConfig = {
  name: "Designed By Been",
  legalName: "Benji Dunn LLC",
  description:
    "Portfolio of Designed By Been — residential, commercial, and academic design work, artwork, and picks.",
  social: {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
  },
} as const;

export type NavItem = {
  title: string;
  href: string;
  children?: NavItem[];
};

export const mainNav: NavItem[] = [
  {
    title: "Portfolio",
    href: "/portfolio",
    children: [
      { title: "Residential", href: "/portfolio/residential" },
      { title: "Commercial", href: "/portfolio/commercial" },
      { title: "Academic Work", href: "/portfolio/academic" },
    ],
  },
  { title: "Artwork", href: "/artwork" },
  { title: "Picks", href: "/picks" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];
