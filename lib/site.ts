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
  { title: "Artwork", href: "/artwork", imageSrc: "/artwork.jpeg" },
  { title: "Picks", href: "/picks", imageSrc: "/the_been.jpg" },
  { title: "About", href: "/about", imageSrc: "/the_been.jpg" },
  { title: "Contact", href: "/contact", imageSrc: "/hotBrittany1.jpeg" },
];
