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
  imageSrc: string;
  children?: NavItem[];
};

export const mainNav: NavItem[] = [
  {
    title: "Portfolio",
    href: "/portfolio",
    imageSrc: "/the_been.jpg",
    children: [
      { title: "Residential", href: "/portfolio/residential", imageSrc: "/the_been.jpg" },
      { title: "Commercial", href: "/portfolio/commercial", imageSrc: "/the_been.jpg" },
      { title: "Academic Work", href: "/portfolio/academic", imageSrc: "/the_been.jpg" },
    ],
  },
  { title: "Artwork", href: "/artwork", imageSrc: "/the_been.jpg" },
  { title: "Picks", href: "/picks", imageSrc: "/the_been.jpg" },
  { title: "About", href: "/about", imageSrc: "/the_been.jpg" },
  { title: "Contact", href: "/contact", imageSrc: "/the_been.jpg" },
];
