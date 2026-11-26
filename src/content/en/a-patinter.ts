// English copy of the "Sobre nós > A Patinter" page (/a-patinter), in the shape of
// src/content/a-patinter.ts. Source: the official English page "About us",
// https://www.patinter.com/en/gca/index.php?id=9 (read 2026-11-24). Every word is the official one;
// only the case changes (the official headings are in capitals) and a handful of evident typos are
// fixed, each with a comment holding the official spelling. English that is awkward but intelligible
// stays as written. Nothing is added, reworded, translated or computed: in particular, no year or age
// is ever derived from today's date. The official markup's non-breaking spaces are read as spaces.
//
// The official English page is not a translation of the Portuguese one: the lead, the mission and
// vision, the history's lead and some milestones say other things. Each item keeps the id of its
// Portuguese counterpart, matched by meaning (the components use the ids as anchors and photo keys).
//
// '59' is also the home page's figure (presence.history in site.ts). Both are the official figure and
// both go stale on the same day: update them together.

import type * as pt from "@/content/a-patinter";

export type { AboutChapter, AboutMilestone, AboutPlatform, AboutReading, AboutStatement, AboutValue } from "@/content/a-patinter";

/** The page's place in the official English menu ("Company" › "About us"). */
export const aboutPlace: typeof pt.aboutPlace = { group: "Company", page: "About us" };

// ------------------------------------------------------------------ opening

/**
 * The official H1 ("About us") on two lines, and the official lead. The English lead is not the
 * Portuguese one (it speaks of full truck load, not of five decades of know-how): kept as written.
 */
export const aboutOpening: typeof pt.aboutOpening = {
  titleLines: ["About", "us"],
  /** said in full, for the document outline and screen readers */
  title: "About us",
  lead: "Assuming a prominent place among the leading companies in Europe, Patinter is an innovative haulage company specializing in full truck load.",
};

/** In-page index: the official headings only, each pointing at its section's id. */
export const aboutIndex: typeof pt.aboutIndex = [
  { label: "Mission", href: "#missao" },
  { label: "Vision", href: "#visao" },
  { label: "Values", href: "#valores" },
  { label: "History", href: "#historia" },
];

// ------------------------------------------------------------------ today

/**
 * The figures read out of the official paragraphs (AboutReading): the small words that lead into
 * each, the figure, its unit and what qualifies it. Every fragment is an exact substring of
 * `paragraphs` (a tab's first letter set in capitals, as in the Portuguese file); the figures stay as
 * written ('5,000' and '1,200' keep their thousands commas; no '+'), so the figure counter must read
 * them without the comma. The ledger is decorative — the paragraphs are what screen readers get.
 */
export const aboutToday: typeof pt.aboutToday = {
  paragraphs: [
    "With over 59 years of experience, Patinter is one of the leading road freight transport operators in Europe.",
    "Our operations extend across six strategically located platforms in Portugal (Mangualde, Maia, and Alverca do Ribatejo), France (Paris), Spain (Álava), and Germany (Magdeburg), enabling us to provide transport, distribution, and logistics solutions to more than 5,000 clients across various industries.",
    "With a modern fleet and a multicultural team of 1,200 professionals from over 15 nationalities, Patinter upholds an unwavering commitment to quality, safety, and sustainability.",
  ],
  readings: [
    { id: "experiencia", tab: "With over", figure: "59", unit: "years", qualifier: "of experience" },
    { id: "clientes", tab: "To more than", figure: "5,000", unit: "clients", qualifier: "across various industries" },
    // '1,200' always carries its unit: the home page's '+1200' counts vehicles, a different fact
    { id: "profissionais", tab: "A multicultural team of", figure: "1,200", unit: "professionals" },
    { id: "nacionalidades", tab: "From over", figure: "15", unit: "nationalities" },
  ],
  platforms: {
    // 'six' stays a word, as the official paragraph writes it
    tab: "Six strategically located platforms",
    // in the paragraph's order, the places as it names them (the English paragraph says 'Magdeburg'
    // where the Portuguese one says 'Magdeburgo')
    countries: [
      { id: "portugal", country: "Portugal", places: ["Mangualde", "Maia", "Alverca do Ribatejo"] },
      { id: "franca", country: "France", places: ["Paris"] },
      { id: "espanha", country: "Spain", places: ["Álava"] },
      { id: "alemanha", country: "Germany", places: ["Magdeburg"] },
    ],
  },
};

// ------------------------------------------------------------------ mission and vision

/**
 * Official "MISSION" and "VISION". They are not the Portuguese statements: the English mission is
 * close to the Portuguese vision, and the English vision has no Portuguese counterpart. Each keeps the
 * id of the heading it sits under on the official page.
 */
export const aboutPurpose: typeof pt.aboutPurpose = [
  {
    id: "missao",
    label: "Mission",
    text: "We work every day to remain a leading road freight supplier, covering all the Atlantic routes and constantly investing in the finest and most updated resources, besides creating and developing simultaneously transport and logistics services solutions with added value propositions, which actively contribute to the success of our customers in the markets they operate.",
  },
  {
    id: "visao",
    label: "Vision",
    text: "Remain a reference in the European transport market, always endeavoring to achieve excellence in management and high-quality services.",
  },
];

// ------------------------------------------------------------------ values

/** Official "VALUES", in the official order. The numbers the page shows (01–06) are presentation. */
export const aboutValues: typeof pt.aboutValues = {
  label: "Values",
  items: [
    {
      id: "sustentabilidade",
      name: "Sustainability",
      text: "The highest standards of safety and quality underlie the development of our work. We are keen to ensure the economic, environmental and social sustainability of the company by believing in long-term sustainable growth.",
    },
    {
      id: "inovacao",
      name: "Innovation",
      text: "We promote continuous improvement efforts and entrepreneurial capacity in our management model through the development and innovation of new processes, methods and services.",
    },
    {
      id: "excelencia",
      name: "Excellence",
      text: "We stand for standards of excellence in providing our services, always benefiting our customers.",
    },
    {
      id: "integridade",
      name: "Integrity",
      text: "We act responsibly and transparently in all the activities we develop, always acting honestly and professionally, respecting the norms and rules defined.",
    },
    {
      id: "orgulho",
      name: "Proud to be Patinter",
      text: "United for the same purpose and desire to win, we are a cohesive team that prides itself on being part of a company that makes a difference, that honours its history and cares for its employees.",
    },
    {
      id: "humildade",
      name: "Humility",
      text: "Rooted in our humble organizational culture is a way of being that defines the interpersonal relationship of our team.",
    },
  ],
};

// ------------------------------------------------------------------ history

/**
 * Official "HISTORY": its lead and its four chapters (of their official titles, only "ORIGIN" is in
 * capitals). The English lead is longer than the Portuguese one ("present in over 20 countries").
 */
export const aboutHistory: typeof pt.aboutHistory = {
  title: "History",
  lead: "Currently being one of the leading European transport groups present in over 20 countries, Patinter keeps in its organisational culture the impression of both the people and the place where it was born, cultivating the values and determination of its founder over the years.",
  chapters: [
    {
      id: "origem",
      title: "Origin",
      paragraphs: [
        // 'PAT–PARIS' with an en dash, as the official English page writes it (the Portuguese has a hyphen)
        "The origins of the Patinter Group date back to 1964, when a car assembly plant was established in Mangualde, Portugal. At the time, there were no national transport operators capable of meeting the logistical needs of this manufacturing unit. In response, the French transport company PAT–PARIS AQUITAINE partnered with the plant to establish a subsidiary in Portugal, giving rise to Patinter.",
        "Initially specialising in the transport of automotive parts, Patinter became the first Portuguese company to operate trailer trucks with licences for 40 tonnes and 13 metres in length.",
        "The year 1967 marked the formal establishment of Patinter, although operations only began in 1968, following the completion of the necessary legal procedures.",
        "Following the 25 April 1974 Revolution, Patinter faced a period of economic and financial instability, which ultimately led to the separation of the founding companies.",
      ],
    },
    {
      id: "um-novo-inicio",
      title: "A new beginning",
      // three paragraphs, as the official English page has them (the Portuguese page has four, and
      // dates the traineeship to 1966)
      paragraphs: [
        "José dos Santos Polónio was the first Patinter's driver. Due to his experience and professionalism, José Polónio was invited to do a traineeship at Paris Aquitaine, in Paris, also becoming responsible for the first 3 vehicles of Patinter.",
        "Later, José separated from Patinter and established his own transport company named Azurtrans with head office in Porto.",
        // official: "Isabel e José  —  transforming" (the Portuguese "e", and a double space each side
        // of the dash)
        "Recognising Patinter's potential, José Polónio bought the company in 1986. For management strategy reasons and believing his family's potential and charisma, José Polónio delegated different areas of the \"new\" Patinter to his sons — António José, Francisco, Alberto, Isabel and José — transforming it into a family company with strong and proactive features.",
      ],
    },
    {
      id: "o-grande-crescimento",
      title: "The big growth",
      paragraphs: [
        "The new Administration adopted an expansion strategy with a strong vision of prosperity since its beginning and in only 5 years it increased the number of vehicles of its fleet from 8 to 70 lorries.",
        "The strong growth of the automotive sector and the requirements it established in the transport market boosted Patinter's internationalisation and the foundation of the group. In the late 90's, Patinter invested in new markets in a sustainable way, building facilities that would adapt to future traffic flows.",
      ],
    },
    {
      id: "pioneirismo-tecnologico",
      title: "Technological pioneering",
      paragraphs: [
        // official: "Since 1994, Information technology" (a capital mid-sentence)
        "Since 1994, information technology was considered an important factor in improving the developed work and a distinction factor for the customer. Consequently, in the same year a satellite-based monitoring and communication system was installed in a significant part of the fleet with pioneer technology in Portugal.",
      ],
    },
  ],
};

// ------------------------------------------------------------------ 1999 — 2020

/**
 * The official page's dated milestones, all twelve, in order (the same twelve years as the Portuguese
 * page; the official page shows them in a carousel without a heading: the page labels them with their
 * own first and last years). Each entry's facts are one per line, as written (final full stops missing
 * in the source stay missing).
 */
export const aboutMilestones: typeof pt.aboutMilestones = [
  {
    year: "1999",
    title: "Patinter Spain",
    // the official markup runs these two facts together, the second after a "- " (a list mark, not a
    // word: the timeline draws its own); they are two lines here
    lines: [
      "Establishment of Patinter España with the aim of promoting the development and consolidation of the parent company.",
      "Awarding of the Quality Certification.",
    ],
  },
  {
    year: "2000",
    title: "Patinter France",
    // in the official English order (the Portuguese entry names Patinter France first)
    lines: ["Opening of the facilities built in Maia, Grande Porto, Portugal", "Incorporation and coming into service of Patinter France, Paris."],
  },
  {
    year: "2001",
    title: "Patinter Spain",
    // one fact: the Portuguese entry's second (the administrative area in Mangualde) is not on the English page
    lines: ["Construction of its own facilities in Vitória, Spain, adequate to logistics operations and traffic support."],
  },
  {
    year: "2002",
    title: "Patinter Spain",
    lines: ["Patinter invested efforts in opening another branch office for administrative support in Madrid"],
  },
  { year: "2003", title: "Patinter Germany", lines: ["Establishment of Patinter Deutschland."] },
  {
    year: "2004",
    title: "Patinter Czech",
    lines: ["As a result of the relocation of the automotive sector to the East, Patinter established in Czech Republic the 7th company of the group - Patinter CZECH."],
  },
  {
    year: "2005",
    // official: "OSHAS 18001:1999"; the entry's own text writes OHSAS, as the standard is named
    title: "OHSAS 18001:1999",
    lines: ["Implementation of the Occupational Safety and Health Management System according to the OHSAS 18001:1999 Standard."],
  },
  {
    year: "2008",
    title: "Patinter II",
    lines: [
      "The company strategically invested in the logistics and housing sector, thus establishing Patinter II, Logística e Imobiliária S.A with head office in Alverca do Ribatejo for location strategy reasons.",
    ],
  },
  {
    year: "2009",
    // the English entry does not name the Agrifood service, as the Portuguese one does
    title: "New services",
    lines: [
      "Earlier this year, Patinter invested in new services in the logistics and distribution area, specifically in the national distribution of foodstuff transported in refrigerated vehicles in the metropolitan areas of Lisbon and Porto.",
    ],
  },
  {
    year: "2014",
    title: "Patinter UK",
    lines: [
      "The constant market changes lead Patinter to invest in new services in different markets. Moreover, in this year Patinter UK is born in London, a new company with its core in the shipping container transport services.",
    ],
  },
  {
    year: "2019",
    title: "Environmental management system certification",
    // official: "NP EN ISO 14001: 2015" (a space after the colon; the standard is ISO 14001:2015)
    lines: [
      "Patinter has obtained certification of the environmental management system according to the NP EN ISO 14001:2015 standard, the standard that attests to the compliance with the best environmental practices.",
    ],
  },
  {
    year: "2020",
    title: "Patinter innovates with certification aimed at family and professional balance",
    lines: [
      "In the transportation sector, Patinter is the first Portuguese company certified in the standard that foresees a balance between its employees’ private and work life.",
    ],
  },
];

/** The timeline's label, from its own first and last entries ("1999 — 2020"): no word is added. */
export const aboutMilestonesLabel: typeof pt.aboutMilestonesLabel = `${aboutMilestones[0].year} — ${aboutMilestones[aboutMilestones.length - 1].year}`;

// ------------------------------------------------------------------ contact

/**
 * The official page's call to action ("Contact us" → the official contact form), under the official
 * menu group's name ("Contacts"). It opens the official site in a new tab until this site has its own
 * contact page.
 */
export const aboutContact: typeof pt.aboutContact = {
  label: "Contacts",
  link: { label: "Contact us", href: "https://www.patinter.com/en/gca/index.php?id=48" },
};
