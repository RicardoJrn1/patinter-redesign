// English copy of the "Company > Sustainability > Integrated Management System Policy" page
// (/sustentabilidade/politicas), the counterpart of content/politicas.ts. Source: the official English
// page, https://www.patinter.com/en/gca/index.php?id=34 (read 2026-11-24). Every word is the official
// one: headings in capitals are set in normal case, and a few evident typos are fixed (commented). The
// documents are the official links, exactly as the official page gives them (the Google Drive ones
// over http). The ids are the Portuguese file's (the page's keys for anchors and photos). The official
// list of policies ends with a link that has no text (to another Google Drive file, not visible on the
// page and not in the Portuguese list): it is left out.

import type * as pt from "@/content/politicas";

/** The page's place in the official menu ("Company" › "Sustainability"). */
export const policiesPlace: typeof pt.policiesPlace = { group: "Company", page: "Sustainability" };

export const policiesOpening: typeof pt.policiesOpening = {
  /** the official H1, said in full */
  // official H1: "Integrated Management System policy"; the official menu: "Integrated Management System Policy"
  title: "Integrated Management System Policy",
  titleLines: ["Integrated", "Management", "System Policy"],
  // official: "the company's competitiveness" (a straight apostrophe)
  lead: "Patinter assumes Quality, Environment, Safety at Work, Road Safety and Conciliation between personal, family and professional life as a management mode, involving the participative intervention of all collaborators, in order to assure the company’s competitiveness and the fair remuneration of the services rendered.",
};

/** Each part: its official heading and text, the sentence that introduces its documents, the documents. */
export const policiesParts: typeof pt.policiesParts = [
  {
    id: "sistemas-de-gestao",
    // official: "QUALITY, HEALTH & SECURITY, ROAD SAFETY, ENVIRONMENT, WORK LIFE BALANCE" (in capitals)
    title: "Quality, Health & Security, Road Safety, Environment, Work Life Balance",
    paragraphs: [
      // official: "Safety and Health at Work , Work Life Balance" (a space before the comma)
      "The Quality, Environment, Safety and Health at Work, Work Life Balance (Conciliation) and Road Safety management systems implemented at Patinter are based on the strategy and commitments assumed by the company.",
    ],
    // the official heading (without a colon, unlike the policies' "Read our policies:")
    listLabel: "Consult our certificates",
    // official: "Quality Management System – ISO 9001", the standard being the link
    documents: [
      { label: "Quality Management System", code: "ISO 9001", href: "http://drive.google.com/file/d/1SkeuRk_13lGW-5oEw12yauQJwSVgyqiE/view?usp=sharing" },
      { label: "Environmental Management System", code: "ISO 14001", href: "http://drive.google.com/file/d/1hxkfhg0vDg6e_RSAUSkTwgjP7iircanI/view?usp=sharing" },
      {
        label: "Occupational Health and Safety Management System",
        code: "ISO 45001",
        href: "http://drive.google.com/file/d/1Qnr-2789fyDAZxNefwBNTBvc_LHxn5xd/view?usp=sharing",
      },
      {
        label: "Balance between Professional, Family and Personal Life",
        code: "NP 4522",
        href: "http://drive.google.com/file/d/1Z4sdFVKRI_mIC08lF7tDvnwS97Y3NwtS/view?usp=sharing",
      },
      { label: "Road Traffic Safety Management System", code: "ISO 39001", href: "http://drive.google.com/file/d/1J63jkYP6y8luaZpbHK7AI6TAfWRFwVIs/view?usp=sharing" },
      {
        label: "Good Distribution Practice (GDP) for Medicinal Products for Human Use and Medical Devices",
        code: "2013/C 343/01",
        href: "http://drive.google.com/file/d/1lIvKeH-jqrANH2PTTv2wVgxIwNxjBr6d/view?usp=sharing",
      },
    ],
  },
  {
    id: "politicas",
    title: "Policies",
    paragraphs: [
      "Our policies aim to communicate Patinter’s position and the principles that guide its activities clearly and transparently. In line with industry best practice and applicable legislation, these policies reflect the company’s commitment to ethics and social, environmental and economic responsibility.",
    ],
    listLabel: "Read our policies:",
    documents: [
      { label: "Management System Policy", href: "https://www.patinter.com/fotos/editor2/politica_sg_r62025.pdf" },
      { label: "Health and Safety Policy", href: "http://drive.google.com/file/d/1aWoSBv0k-ADOjuidV4opbH9yLyGh25Z0/view?usp=sharing" },
      { label: "Environmental Policy", href: "http://drive.google.com/file/d/1t3bHu6jvB0a7xxC2cwPD38omZ7wjC5C0/view?usp=sharing" },
      { label: "Work–Life Balance Policy", href: "http://drive.google.com/file/d/1riCKcf5Zco5wMMzCkMuRuKRNnL2x4wb-/view?usp=sharing" },
      { label: "Sustainable Procurement Policy", href: "http://drive.google.com/file/d/15dGmKLaaFZjszPmFmKCzTC6goB4Z06J_/view?usp=sharing" },
      { label: "Diversity and Inclusion Policy", href: "http://drive.google.com/file/d/1XgNRmdCl97TRFHj2L9fmoPFKd6H0DmdU/view?usp=drive_link" },
      // left out: the official link with no text, http://drive.google.com/file/d/1kVFKCl8cfrujfgDM1sG6KmalKAhO0f38/view?usp=sharing
    ],
  },
];

/** The official page's call to action (as on the other pages), under the official menu group's name. */
export const policiesContact: typeof pt.policiesContact = {
  label: "Contacts",
  link: { label: "Contact us", href: "https://www.patinter.com/en/gca/index.php?id=48" },
};
