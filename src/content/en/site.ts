// Site copy, English. Everything here is taken from the official English site
// (https://www.patinter.com/en/, read 2026-11-24), block for block as content/site.ts takes it from the
// Portuguese one; nothing institutional is invented. Only the case changes (the official blocks are in
// capitals) and the evident typos are fixed, each with a comment holding the official spelling. Lines
// written for the redesign (not on the official site) are marked NOT OFFICIAL.

import type * as pt from "@/content/site";

/**
 * Menu overlay structure, mirroring the official English main menu (patinter.com/en), shared by the
 * Header's menu and the Footer. The official English menu has no complaints book (the Portuguese one's
 * "Livro de reclamações" is a Portuguese legal requirement): it is left out here too.
 */
export const menuGroups: typeof pt.menuGroups = [
  {
    title: "Company",
    links: [
      { label: "About us", href: "/en/about-us" },
      {
        label: "Sustainability",
        links: [
          { label: "Sustainability Commitments", href: "/en/sustainability/commitments" },
          { label: "Corporate Social Responsibility", href: "/en/sustainability/social-responsibility" },
          { label: "Integrated Management System Policy", href: "/en/sustainability/policies" },
          { label: "Sponsorships", href: "/en/sustainability/sponsorships" },
        ],
      },
      { label: "Media", href: "/en/news" },
    ],
  },
  {
    title: "Our Solutions",
    links: [{ label: "Road Freight" }, { label: "Logistics" }, { label: "Distribution" }, { label: "Fleet & IT" }],
  },
  {
    title: "Human Resources",
    links: [{ label: "Working at Patinter" }, { label: "Come Work with us" }, { label: "Internships and academic projects" }],
  },
  {
    title: "Contacts",
    links: [{ label: "Companies of the Group" }, { label: "Contact form" }, { label: "Reporting Channel" }, { label: "Book of Praise" }],
  },
];

export const languages: typeof pt.languages = [
  { code: "PT", label: "Português" },
  { code: "EN", label: "English" },
];

/**
 * Official signature, EN version (the official header and footer: "The Further we go / The closer we
 * get to you"), with the Portuguese version's punctuation so the two lines read as one sentence.
 */
// official: "The Further we go" (capital F)
export const signature: typeof pt.signature = ["The further we go,", "the closer we get to you."];

/**
 * Hero: the three services, in the Portuguese file's order. Every word is the official English home
 * slideshow's ("SERVICE — DISPLAY TITLE — description"). The descriptions of the photographs are the
 * redesign's own (the official images have no text), in English.
 */
export const heroSlides: typeof pt.heroSlides = [
  {
    id: "transporte",
    label: "Transport",
    titleLines: ["Global", "solutions"],
    description: "In a global world, we present transportation solutions tailored to your needs.",
    image: { alt: "Patinter fleet lorry, orange cab and red trailer, on a dual carriageway at dusk" },
  },
  {
    id: "logistica",
    label: "Logistics",
    titleLines: ["Awaiting", "dispatch"],
    description: "We offer a personalized service of quality, based on a strong network of infrastructures of logistics and storage.",
    image: { alt: "Smiling operator in a warehouse, among cardboard boxes and shelving" },
  },
  {
    id: "distribuicao",
    label: "Distribution",
    titleLines: ["Work without", "worries"],
    description: "We ensure the strict distribution of your products, we guarantee your satisfaction.",
    image: { alt: "Operator wearing a headset in front of tracking screens and a route map" },
  },
];

/** Shown once in the hero, in the band under the chapters (desktop). */
export const heroTagline: typeof pt.heroTagline = signature;

/** NOT OFFICIAL — English for the redesign's screen-reader title and the keyboard skip link. */
export const heroIntro: typeof pt.heroIntro = {
  title: "Patinter — global transport and logistics solutions",
  skip: "Skip intro",
};

/**
 * Fleet figures (patinter.com/en home page, the fleet block under the slideshow). Every word and
 * figure is the official English one, as written ("medium of age", "1,2 liters", "100 kms" included):
 * only the case changes.
 */
export const fleet: typeof pt.fleet = {
  label: "Fleet",
  titleLines: ["Our", "fleet"],
  readings: [
    {
      id: "veiculos",
      act: "frota",
      tab: "A total of",
      figure: "+1200",
      accent: "+",
      unit: "vehicles",
      mark: ["+1200", "Vehicles"],
      statement: "A total of +1200 vehicles.",
    },
    {
      id: "idade",
      act: "frota",
      tab: "Has",
      figure: "3",
      unit: "years",
      qualifier: "medium of age",
      mark: ["3", "Years medium of age"],
      statement: "Our fleet has 3 years medium of age.",
    },
    {
      id: "ambiente",
      act: "ambiente",
      tab: "Environmental standards",
      figure: "99%",
      accent: "%",
      unit: "fleet",
      qualifier: "Euro 5 · Euro 6",
      mark: ["99%", "Euro 5 · Euro 6"],
      statement: "Environmental standards: 99% fleet Euro 5, Euro 6.",
    },
    {
      id: "conducao",
      act: "ambiente",
      // official: "THE PERMANENT TRAINING AND ECONOMICAL DRIVING >OF OUR DRIVERS SAVES" (a stray '>')
      tab: "The permanent training and economical driving of our drivers saves",
      figure: "1,2",
      unit: "liters for each 100 kms",
      // the official verb, not a shortened unit (as the Portuguese 'Permite poupar')
      mark: ["1,2", "Saves"],
      statement: "The permanent training and economical driving of our drivers saves 1,2 liters for each 100 kms.",
    },
  ],
};

/**
 * History and presence (patinter.com/en home page: "59 YEARS Of HISTORY", "In 04 COUNTRIES"). The
 * names and the places are the official English "Locations" page's (patinter.com/en/gca/index.php?id=6),
 * in its order; "headquarter" is that page's own word for Mangualde.
 */
export const presence: typeof pt.presence = {
  label: "Locations",
  history: { figure: "59", unit: "years", qualifier: "of history" },
  reach: { tab: "In", figure: "04", unit: "countries" },
  statement: "59 years of history, in 04 countries.",
  countries: [
    { id: "portugal", name: "Portugal", places: ["Mangualde (headquarter)", "Maia", "Alverca do Ribatejo"] },
    { id: "espanha", name: "Spain", places: ["Álava"] },
    { id: "franca", name: "France", places: ["Plessis Belleville"] },
    { id: "alemanha", name: "Germany", places: ["Magdeburg"] },
  ],
};

/**
 * News (patinter.com/en home page: its three highlighted news, in its order). Titles and dates are the
 * official English articles' own, as the official English news list writes them. The links open those
 * articles on the official site, in a new tab, as the Portuguese strip does.
 */
export const news: typeof pt.news = {
  label: "News",
  // NOT OFFICIAL — English for the strip's own "Ver todas as notícias"
  all: { label: "See all news", href: "https://www.patinter.com/en/news/" },
  items: [
    {
      date: "2026-05-06",
      title: "Patinter achieves Gold status in project44’s 2026 Preferred Carrier Programme",
      href: "https://www.patinter.com/en/news/patinter-achieves-gold-status-in-project44-s-2026-preferred-carrier-programme/",
    },
    {
      date: "2026-02-09",
      title: "GDP certification strengthens Patinter’s road transport operation for medicinal products",
      href: "https://www.patinter.com/en/news/gdp-certification-patinter-road-transport-medicinal-products/",
    },
    {
      date: "2024-06-07",
      title: "Patinter Promotes Professional Inclusion of People with Disabilities",
      href: "https://www.patinter.com/en/news/patinter-promotes-professional-inclusion-of-people-with-disabilities/",
    },
  ],
};

/** Footer (patinter.com/en, the footer of every page). */
export const footer: typeof pt.footer = {
  copyright: "Copyright ©2026 Patinter",
  // official: "SUBSCRIBE TO OUR NEWSLETTER"
  newsletter: "Subscribe to our newsletter",
};

/** Official social profiles (site menu and footer). */
export const social: typeof pt.social = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/Patinter" },
  { label: "Instagram", href: "https://www.instagram.com/patinter_group/" },
  { label: "Facebook", href: "https://www.facebook.com/Patinter/" },
];

/** Head office (patinter.com/en — "Headquarter", Mangualde). */
export const headOffice: typeof pt.headOffice = { city: "Mangualde", country: "Portugal" };
