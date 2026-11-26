// Copy of the "Sobre nós > Sustentabilidade > Políticas e Sistemas de Gestão" page
// (/sustentabilidade/politicas). Source: the official page, https://www.patinter.com/pt/gca/index.php?id=34
// (read 2026-11-24). Every word is the official one: headings in capitals are set in sentence case and
// one typo is fixed (commented). The documents are the official links; the Google Drive ones are given
// over https (the official page links them over http). Two empty links in the official markup (around
// line breaks, with no text, so not visible) are left out.

/** The page's place in the official menu ("Sobre nós" › "Sustentabilidade"). */
import type { PagePlace } from "@/content/site";

export const policiesPlace: PagePlace = { group: "Sobre nós", page: "Sustentabilidade" };

export const policiesOpening = {
  /** the official H1, said in full */
  title: "Políticas e Sistemas de Gestão",
  titleLines: ["Políticas e", "Sistemas de", "Gestão"],
  lead: "A Patinter assume a Qualidade, Ambiente, Segurança no trabalho, Segurança Rodoviária e Conciliação entre a vida pessoal, familiar e profissional como um modo de gestão, envolvendo a intervenção participativa de todos os colaboradores, de forma a assegurar a competitividade da empresa e a justa remuneração dos serviços prestados.",
};

/** An official document: what it is, the standard it answers to (certificates), and where it is. */
export type PolicyDocument = { label: string; code?: string; href: string };

export type PoliciesPart = {
  id: "sistemas-de-gestao" | "politicas";
  title: string;
  paragraphs: string[];
  /** the official sentence that introduces the documents */
  listLabel: string;
  documents: PolicyDocument[];
};

export const policiesParts: PoliciesPart[] = [
  {
    id: "sistemas-de-gestao",
    title: "Sistemas de Gestão",
    paragraphs: [
      "Os sistemas de gestão da Qualidade, Ambiente, Segurança e Saúde no Trabalho, Conciliação e Segurança Rodoviária implementados na Patinter baseiam-se na estratégia e nos compromissos que a empresa assume.",
    ],
    listLabel: "Consulte os nossos certificados:",
    documents: [
      { label: "Sistema de gestão da Qualidade", code: "ISO 9001", href: "https://drive.google.com/file/d/1SkeuRk_13lGW-5oEw12yauQJwSVgyqiE/view?usp=sharing" },
      { label: "Sistema de gestão do Ambiente", code: "ISO 14001", href: "https://drive.google.com/file/d/1hxkfhg0vDg6e_RSAUSkTwgjP7iircanI/view?usp=sharing" },
      {
        label: "Sistema de gestão da Segurança e Saúde Ocupacional",
        code: "ISO 45001",
        href: "https://drive.google.com/file/d/1Qnr-2789fyDAZxNefwBNTBvc_LHxn5xd/view?usp=sharing",
      },
      {
        label: "Conciliação entre a vida profissional, familiar e pessoal",
        code: "NP 4522",
        href: "https://drive.google.com/file/d/1Z4sdFVKRI_mIC08lF7tDvnwS97Y3NwtS/view?usp=sharing",
      },
      { label: "Sistema de Gestão da Segurança Rodoviária", code: "ISO 39001", href: "https://drive.google.com/file/d/1J63jkYP6y8luaZpbHK7AI6TAfWRFwVIs/view?usp=sharing" },
      {
        label: "BPD de Medicamentos para Uso Humano e de Dispositivos Médicos",
        code: "2013/C 343/01",
        href: "https://drive.google.com/file/d/1lIvKeH-jqrANH2PTTv2wVgxIwNxjBr6d/view?usp=sharing",
      },
    ],
  },
  {
    id: "politicas",
    title: "Políticas",
    paragraphs: [
      // official: "estas politicas"
      "As nossas políticas têm como objetivo informar com transparência o posicionamento da Patinter e os princípios que orientam a sua atividade. Em consonância com as melhores práticas do mercado e a legislação em vigor, estas políticas são instrumentos que refletem o compromisso da empresa com a ética e a responsabilidade social, ambiental e económica.",
    ],
    listLabel: "Consulte as nossas políticas:",
    documents: [
      { label: "Política do Sistema de Gestão", href: "https://www.patinter.com/fotos/editor2/politica_sg_r62025.pdf" },
      { label: "Política de Saúde e Segurança", href: "https://drive.google.com/file/d/1aWoSBv0k-ADOjuidV4opbH9yLyGh25Z0/view?usp=sharing" },
      { label: "Política Ambiental", href: "https://drive.google.com/file/d/1t3bHu6jvB0a7xxC2cwPD38omZ7wjC5C0/view?usp=sharing" },
      {
        label: "Política da Conciliação entre a Vida Profissional, Familiar e Pessoal",
        href: "https://drive.google.com/file/d/1riCKcf5Zco5wMMzCkMuRuKRNnL2x4wb-/view?usp=sharing",
      },
      { label: "Política de Compras Sustentáveis", href: "https://drive.google.com/file/d/15dGmKLaaFZjszPmFmKCzTC6goB4Z06J_/view?usp=sharing" },
      { label: "Política de Diversidade e Inclusão", href: "https://drive.google.com/file/d/1XgNRmdCl97TRFHj2L9fmoPFKd6H0DmdU/view?usp=drive_link" },
    ],
  },
];

/** The official page's call to action (as on the other pages), under the official menu group's name. */
export const policiesContact = {
  label: "Contactos",
  link: { label: "Contacte-nos", href: "https://www.patinter.com/pt/gca/index.php?id=48" },
};
