// English copy of the "Company > Sustainability > Sponsorships" page (/sustentabilidade/patrocinios), the
// counterpart of content/patrocinios.ts. Source: the official English page,
// https://www.patinter.com/en/gca/index.php?id=69 (read 2026-11-24): its text and its request form,
// field by field. Every word is the official one: headings in capitals are set in normal case and the
// uneven spaces around one heading's slashes are evened (commented). The one line that is not official
// is the demonstration notice (see
// `sponsorshipForm.demoNotice`). The ids and field names are the Portuguese file's (the page's keys).
// The English page has no link to the sponsorship policy (the Portuguese one has "Consulte a nossa
// Política de Patrocínios."), so `sponsorshipIntro.policy` is left empty here.

import type * as pt from "@/content/patrocinios";

/** The page's place in the official menu ("Company" › "Sustainability"). */
export const sponsorshipPlace: typeof pt.sponsorshipPlace = { group: "Company", page: "Sustainability" };

export const sponsorshipOpening: typeof pt.sponsorshipOpening = {
  title: "Sponsorships",
  titleLines: ["Sponsorships"],
  lead: "At Patinter, we believe in shared progress. We are committed to growing alongside society, supporting initiatives that reflect our values and strengthen the path we have forged as a brand.",
};

export const sponsorshipIntro: typeof pt.sponsorshipIntro = {
  // the official page sets these two sentences as two paragraphs
  statement:
    "Sponsorships and corporate support are a natural extension of this commitment. Through them, we create value, foster lasting relationships, and deepen our connection with the communities and audiences around us.",
  /** NONE ON THE ENGLISH PAGE: it has no link to the sponsorship policy, so there is no official text
   *  or link for it. Left empty (the shape is the Portuguese one); a page that shows this line should
   *  leave it out when `label` is empty. */
  policy: { before: "", label: "", href: "" },
  formIntro:
    "If you wish to submit a sponsorship request, please complete the form below. Each proposal will be carefully evaluated based on its relevance, coherence, and potential impact.",
};

export const sponsorshipForm: typeof pt.sponsorshipForm = {
  // every field is required on the official form (marked *)
  groups: [
    {
      id: "entidade",
      // official: "COMPANY"
      title: "Company",
      fields: [
        { name: "entidade-nome", label: "Name" },
        { name: "entidade-atividade", label: "Activity" },
        { name: "entidade-contribuinte", label: "Tax Number (VAT)" },
      ],
    },
    {
      id: "contacto",
      // official: "CONTACT PERSON RESPONSIBLE FOR THE REQUEST"
      title: "Contact person responsible for the request",
      fields: [
        { name: "contacto-nome", label: "Name" },
        { name: "contacto-telefone", label: "Phone", type: "tel" },
        { name: "contacto-email", label: "E-mail", type: "email" },
        { name: "contacto-morada", label: "Address" },
        { name: "contacto-localidade", label: "Location" },
        { name: "contacto-codigo-postal", label: "Postal Code" },
      ],
    },
    {
      id: "projeto",
      // official: "PROJECT/ EVENT/ INITIATIVE"
      title: "Project / Event / Initiative",
      fields: [
        { name: "projeto-nome", label: "Name" },
        { name: "projeto-localidade", label: "Location" },
        { name: "projeto-descricao", label: "Description", type: "textarea" },
        { name: "projeto-inicio", label: "Expected Start Date", type: "date" },
        { name: "projeto-conclusao", label: "Expected End Date", type: "date" },
      ],
    },
    {
      id: "classificacao",
      // official: "CLASSIFICATION OF SPONSORSHIP TYPE AND AREA OF ACTIVITY"
      title: "Classification of sponsorship type and area of activity",
      fields: [
        { name: "classificacao-acoes", label: "Description of main actions", type: "textarea" },
        { name: "classificacao-objetivos", label: "Objectives", type: "textarea" },
        { name: "classificacao-publico", label: "Target Audience" },
      ],
    },
    {
      id: "proposta",
      // official: "TYPE AND VALUE OF THE PROPOSAL"
      title: "Type and value of the proposal",
      fields: [
        { name: "proposta-tipo", label: "Type of Proposal" },
        { name: "proposta-valor", label: "Value of the Proposal" },
      ],
    },
  ],
  // the official file field: its label, the text beside it until a file is chosen, and its button
  attachment: {
    // official: "PRESENTATION OF THE PROJECT"
    title: "Presentation of the project",
    label: "New file for upload",
    button: "Search",
    empty: "No file selected",
  },
  consent: "I declare that I have read the Privacy Policy and authorize the treatment of my personal data identified in this form",
  submit: "Send",
  // NOT OFFICIAL: English translation of the approved Portuguese line
  demoNotice: "Demonstration form: the request was not sent.",
};

/** The official page's call to action (as on the other pages), under the official menu group's name. */
export const sponsorshipContact: typeof pt.sponsorshipContact = {
  label: "Contacts",
  link: { label: "Contact us", href: "https://www.patinter.com/en/gca/index.php?id=48" },
};
