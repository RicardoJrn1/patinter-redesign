// Copy of the "Sobre nós > Sustentabilidade > Patrocínios" page (/sustentabilidade/patrocinios). Source:
// the official page, https://www.patinter.com/pt/gca/index.php?id=69 (read 2026-11-24): its text, its
// link to the sponsorship policy and its request form, field by field. Every word is the official one:
// headings in capitals are set in sentence case and a few evident typos are fixed (commented). The one
// line that is not official is the demonstration notice (see `sponsorshipForm.demoNotice`).

/** The page's place in the official menu ("Sobre nós" › "Sustentabilidade"). */
import type { PagePlace } from "@/content/site";

export const sponsorshipPlace: PagePlace = { group: "Sobre nós", page: "Sustentabilidade" };

export const sponsorshipOpening = {
  title: "Patrocínios",
  titleLines: ["Patrocínios"],
  lead: "Na Patinter, acreditamos num crescimento com impacto partilhado. Por isso, apoiamos iniciativas alinhadas com os nossos valores e com o posicionamento que construímos como marca.",
};

export const sponsorshipIntro = {
  statement:
    "Os patrocínios e apoios corporativos refletem esse compromisso e reforçam a nossa ligação às comunidades e aos públicos com quem nos relacionamos.",
  /** "Consulte a nossa Política de Patrocínios." — the official sentence, its last words the link */
  policy: {
    before: "Consulte a nossa",
    label: "Política de Patrocínios",
    // the official link is http://; the same document over https
    href: "https://drive.google.com/file/d/1y2zA1aWVJ-Lp_XViKqTfxwVFszfEuaZn/view?usp=sharing",
  },
  formIntro:
    "Caso pretenda apresentar um pedido de patrocínio deverá fazê-lo através do preenchimento do formulário que se segue. Cada proposta será cuidadosamente analisada com base na sua relevância, coerência e potencial de impacto.",
};

export type SponsorshipField = {
  /** unique within the form */
  name: string;
  label: string;
  /** how it is typed in: the official form has text boxes only; the browser's own controls are used for
   *  the e-mail, the phone, the dates and the longer descriptions */
  type?: "text" | "email" | "tel" | "date" | "textarea";
};

export type SponsorshipGroup = { id: string; title: string; fields: SponsorshipField[] };

export const sponsorshipForm: {
  groups: SponsorshipGroup[];
  /** the last group: the project's presentation, a PDF */
  attachment: { title: string; label: string; button: string; empty: string };
  consent: string;
  submit: string;
  /** NOT OFFICIAL — approved by the user (2026-11-24): the form is not connected to anything yet, so a
   *  complete request is answered with this line instead of being sent */
  demoNotice: string;
} = {
  // every field is required on the official form (marked *)
  groups: [
    {
      id: "entidade",
      title: "Entidade",
      fields: [
        { name: "entidade-nome", label: "Nome" },
        { name: "entidade-atividade", label: "Atividade" },
        { name: "entidade-contribuinte", label: "Número de Contribuinte" },
      ],
    },
    {
      id: "contacto",
      title: "Contacto do responsável pela solicitação",
      fields: [
        { name: "contacto-nome", label: "Nome" },
        { name: "contacto-telefone", label: "Telefone (PT)", type: "tel" },
        { name: "contacto-email", label: "E-mail", type: "email" },
        { name: "contacto-morada", label: "Morada" },
        { name: "contacto-localidade", label: "Localidade" },
        { name: "contacto-codigo-postal", label: "Código Postal" },
      ],
    },
    {
      id: "projeto",
      // official: "PROJETO/ EVENTO/ INICIATIVA"
      title: "Projeto / Evento / Iniciativa",
      fields: [
        { name: "projeto-nome", label: "Nome" },
        { name: "projeto-localidade", label: "Localidade" },
        { name: "projeto-descricao", label: "Descrição", type: "textarea" },
        { name: "projeto-inicio", label: "Data Prevista de Início", type: "date" },
        { name: "projeto-conclusao", label: "Data Prevista de Conclusão", type: "date" },
      ],
    },
    {
      id: "classificacao",
      title: "Classificação do tipo de patrocínio e área de atuação",
      fields: [
        { name: "classificacao-acoes", label: "Descrição das principais ações", type: "textarea" },
        { name: "classificacao-objetivos", label: "Objetivos", type: "textarea" },
        // official: "Público- Alvo"
        { name: "classificacao-publico", label: "Público-Alvo" },
      ],
    },
    {
      id: "proposta",
      title: "Tipo e valor da proposta",
      fields: [
        { name: "proposta-tipo", label: "Tipo de Proposta" },
        { name: "proposta-valor", label: "Valor da Proposta" },
      ],
    },
  ],
  attachment: {
    title: "Apresentação do projeto",
    label: "Anexar apresentação do projeto em formato PDF",
    button: "Procurar",
    empty: "Nenhum ficheiro selecionado",
  },
  // official: "a Politica de Privacidade"
  consent: "Declaro que li a Política de Privacidade e autorizo o tratamento dos meus dados pessoais identificados neste formulário",
  submit: "Enviar",
  demoNotice: "Formulário em demonstração: o pedido não foi enviado.",
};

/** The official page's call to action (as on the other pages), under the official menu group's name. */
export const sponsorshipContact = {
  label: "Contactos",
  link: { label: "Contacte-nos", href: "https://www.patinter.com/pt/gca/index.php?id=48" },
};
