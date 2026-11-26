// Copy of the "Sobre nós > A Patinter" page (/a-patinter). Source: the official page "Quem somos",
// https://www.patinter.com/pt/gca/index.php?id=9 (read 2026-11-23). Every word is the official one;
// only the case changes (the official headings are in capitals) and a handful of evident typos are
// fixed, each with a comment holding the official spelling. Nothing is added, reworded or computed:
// in particular, no year or age is ever derived from today's date.
//
// '59' also lives in site.ts (presence.history, from the home page's block). Both are the official
// figure and both go stale on the same day: update them together.

/** The page's place in the official menu ("Sobre nós" › "A Patinter"). */
import type { PagePlace } from "@/content/site";

export const aboutPlace: PagePlace = { group: "Sobre nós", page: "A Patinter" };

// ------------------------------------------------------------------ opening

/**
 * The official H1 ("Quem somos") on two lines, and the official lead. The lead says "cinco décadas"
 * while the next paragraph says "mais de 59 anos": both are kept as written (flagged to ask Patinter).
 */
export const aboutOpening = {
  titleLines: ["Quem", "somos"] as [string, string],
  /** said in full, for the document outline and screen readers */
  title: "Quem somos",
  lead: "Assumindo um lugar de destaque entre as principais empresas do setor dos transportes internacionais na Europa, a Patinter cresce aliada ao know-how de cinco décadas, construído com saber e rigor no mercado nacional e internacional.",
};

/** In-page index: the official headings only, each pointing at its section's id. */
export const aboutIndex: { label: string; href: string }[] = [
  { label: "Missão", href: "#missao" },
  { label: "Visão", href: "#visao" },
  { label: "Valores", href: "#valores" },
  { label: "História", href: "#historia" },
];

// ------------------------------------------------------------------ today

/**
 * A figure read out of the official paragraphs, in the home fleet's shape (FleetReading): the small
 * words that lead into it, the figure, its unit and what qualifies it. Every fragment is an exact
 * substring of `aboutToday.paragraphs`; the figures stay as written ('5000': no separator, no '+').
 * The ledger is decorative — the paragraphs are what screen readers get.
 */
export type AboutReading = {
  id: "experiencia" | "clientes" | "profissionais" | "nacionalidades";
  tab: string;
  figure: string;
  unit: string;
  qualifier?: string;
};

export type AboutPlatform = {
  id: "portugal" | "franca" | "espanha" | "alemanha";
  country: string;
  /** the places as the paragraph names them */
  places: string[];
};

export const aboutToday: {
  paragraphs: [string, string, string];
  readings: AboutReading[];
  platforms: { tab: string; countries: AboutPlatform[] };
} = {
  paragraphs: [
    "Com mais de 59 anos de experiência, a Patinter é um dos principais operadores de transporte rodoviário de mercadorias na Europa.",
    "A nossa operação estende-se por seis plataformas estratégicas em Portugal (Mangualde, Maia e Alverca do Ribatejo), França (Paris), Espanha (Álava) e Alemanha (Magdeburgo), permitindo-nos fornecer soluções de transporte, distribuição e logística a mais de 5000 clientes em diversos setores de atividade.",
    "Com uma frota moderna e uma equipa multicultural composta por 1200 profissionais de mais de 15 nacionalidades, a Patinter mantém um compromisso inabalável com a qualidade, segurança e sustentabilidade.",
  ],
  readings: [
    { id: "experiencia", tab: "Com mais de", figure: "59", unit: "anos", qualifier: "de experiência" },
    { id: "clientes", tab: "A mais de", figure: "5000", unit: "clientes", qualifier: "em diversos setores de atividade" },
    // '1200' always carries its unit: the home page shows '+1200 veículos', a different fact
    { id: "profissionais", tab: "Uma equipa multicultural composta por", figure: "1200", unit: "profissionais" },
    { id: "nacionalidades", tab: "De mais de", figure: "15", unit: "nacionalidades" },
  ],
  platforms: {
    // 'seis' stays a word, as the official paragraph writes it
    tab: "Seis plataformas estratégicas",
    // in the paragraph's order. The home's Presence block names France and Germany after the official
    // "Onde Estamos" page instead ('Plessis Belleville', 'Magdeburg'): each page follows its source.
    countries: [
      { id: "portugal", country: "Portugal", places: ["Mangualde", "Maia", "Alverca do Ribatejo"] },
      { id: "franca", country: "França", places: ["Paris"] },
      { id: "espanha", country: "Espanha", places: ["Álava"] },
      { id: "alemanha", country: "Alemanha", places: ["Magdeburgo"] },
    ],
  },
};

// ------------------------------------------------------------------ mission and vision

export type AboutStatement = { id: "missao" | "visao"; label: string; text: string };

/** Official "MISSÃO" and "VISÃO". */
export const aboutPurpose: AboutStatement[] = [
  {
    id: "missao",
    label: "Missão",
    text: "Atuar no mercado dos transportes de forma ética e responsável, garantindo a prestação de serviços de transporte, logística e distribuição de excelência, que contribuam para o sucesso dos nossos clientes.",
  },
  {
    id: "visao",
    label: "Visão",
    text: "Trabalhar diariamente para ser um transportador líder, reconhecido pelo seu trabalho de qualidade e capacidade de resposta em todo o eixo Atlântico.",
  },
];

// ------------------------------------------------------------------ values

export type AboutValue = { id: string; name: string; text: string };

/** Official "VALORES", in the official order. The numbers the page shows (01–06) are presentation. */
export const aboutValues: { label: string; items: AboutValue[] } = {
  label: "Valores",
  items: [
    {
      id: "sustentabilidade",
      name: "Sustentabilidade",
      text: "Os mais altos padrões de segurança e qualidade estão na base do desenvolvimento do nosso trabalho. Fazemos questão de assegurar a sustentabilidade económica, ambiental e social da empresa por acreditarmos num crescimento sustentável a longo prazo.",
    },
    {
      id: "inovacao",
      name: "Inovação",
      // official: "melhoria continua"
      text: "Promovemos o esforço de melhoria contínua e a capacidade empreendedora no nosso modelo de gestão, através do desenvolvimento e inovação de novos processos, métodos e serviços.",
    },
    {
      id: "excelencia",
      name: "Excelência",
      text: "Pautamo-nos por padrões de excelência na prestação dos nossos serviços, beneficiando sempre os nossos clientes.",
    },
    {
      id: "integridade",
      name: "Integridade",
      text: "Atuamos de forma responsável e transparente em todas as atividades que desenvolvemos, agindo sempre de forma íntegra e profissional, respeitando as normas e regras definidas.",
    },
    {
      id: "orgulho",
      name: "Orgulho em ser Patinter",
      text: "Unidos pelo mesmo propósito e vontade de vencer, somos uma equipa coesa que se orgulha em pertencer a uma empresa que faz a diferença, que honra a sua história e cuida dos seus colaboradores.",
    },
    {
      id: "humildade",
      name: "Humildade",
      text: "Enraizada na nossa cultura organizacional, a humildade é uma forma de estar que define em absoluto o relacionamento interpessoal entre a nossa equipa.",
    },
  ],
};

// ------------------------------------------------------------------ history

export type AboutChapter = { id: string; title: string; paragraphs: string[] };

/** Official "HISTÓRIA": its lead and its four chapters (official titles in capitals). */
export const aboutHistory: { title: string; lead: string; chapters: AboutChapter[] } = {
  title: "História",
  lead: "A Patinter mantém na sua cultura organizacional, a marca das pessoas e do local onde nasceu, cultivando ao longo dos anos os valores e a determinação da sua origem.",
  chapters: [
    {
      id: "origem",
      title: "Origem",
      paragraphs: [
        "As origens do grupo Patinter remontam a 1964, quando em Mangualde (Portugal), foi instalada uma fábrica de montagem de automóveis. Na ausência de transportadores nacionais capazes de responder às necessidades de transporte desta unidade fabril, a transportadora francesa PAT-PARIS AQUITAINE aliou-se à referida unidade para criar uma filial em Portugal, dando origem à Patinter.",
        "Especializada no transporte de peças automóveis, a Patinter foi a primeira empresa portuguesa a operar camiões reboques com licenças para 40 toneladas e 13 metros de comprimento.",
        "O ano de 1967 marcou a constituição formal da Patinter, embora a sua atividade só tenha começado em 1968, após a conclusão dos trâmites legais necessários.",
        "Com o 25 de Abril de 1974, a Patinter enfrentou um período de instabilidade económica e financeira, que resultou na dissociação entre as empresas fundadoras.",
      ],
    },
    {
      id: "um-novo-inicio",
      title: "Um novo início",
      paragraphs: [
        "José dos Santos Polónio foi um dos primeiros motoristas da Patinter.",
        "Em 1966, José Polónio foi convidado a estagiar na empresa Paris Aquitaine, em Paris. Quando regressou a Portugal, devido ao seu desempenho e profissionalismo, José tornou-se para além de motorista, o gestor das 3 viaturas iniciais.",
        "Mais tarde, José desvincula-se da Patinter e cria a sua própria empresa de transportes com sede no Porto, a Azurtrans.",
        // official: a double space before the dash ("Isabel e José  —")
        "Reconhecendo o potencial da Patinter, José Polónio adquire-a em 1986. Por uma questão estratégica de gestão e acreditando no potencial e carisma da família, José Polónio delegou aos seus filhos — António José, Francisco, Alberto, Isabel e José — áreas distintas da 'nova' Patinter, tornando-a assim numa empresa familiar de características fortes e dinamizadoras até aos dias de hoje.",
      ],
    },
    {
      id: "o-grande-crescimento",
      title: "O grande crescimento",
      paragraphs: [
        "A nova gestão adotou uma estratégia de expansão com uma forte visão de prosperidade desde o seu início, em apenas 5 anos a Patinter aumentou o número de veículos da sua frota de 8 para 70 camiões.",
        "O forte crescimento do setor automóvel e as exigências estabelecidas por esta indústria no mercado dos transportes, impulsionaram a internacionalização da Patinter e a criação do grupo. No final dos anos 90, a Patinter investiu em novos mercados e de forma sustentável construiu instalações adaptáveis aos fluxos de trânsito do futuro.",
      ],
    },
    {
      id: "pioneirismo-tecnologico",
      title: "Pioneirismo tecnológico",
      paragraphs: [
        "A tecnologia da informação foi desde 1994, tida como um fator importante para o aperfeiçoamento do trabalho desenvolvido e um fator de distinção junto dos clientes, pelo que foi nesse ano instalado numa importante parte da frota, um sistema de localização e comunicação, utilizando uma tecnologia pioneira em Portugal com recurso ao satélite.",
      ],
    },
  ],
};

// ------------------------------------------------------------------ 1999 — 2020

export type AboutMilestone = {
  /** four digits, as the official timeline writes it (also the <time dateTime>) */
  year: string;
  title: string;
  /** the entry's facts, one per line, as written (final full stops missing in the source stay missing) */
  lines: string[];
};

/**
 * The official page's dated milestones, all twelve, in order (the official page shows them in a
 * carousel without a heading: the page labels them with their own first and last years).
 */
export const aboutMilestones: AboutMilestone[] = [
  {
    year: "1999",
    title: "Patinter Espanha",
    // the official markup runs these two facts together; they are two lines here
    lines: ["Criação da Patinter España, destinada a fomentar o desenvolvimento e consolidação da empresa mãe.", "Obtenção da Certificação da Qualidade"],
  },
  {
    year: "2000",
    title: "Patinter França",
    // official: "instalações construída"
    lines: ["Constituição e entrada em funcionamento da Patinter France, em Paris", "Inauguração das instalações construídas na Maia, Grande Porto, Portugal"],
  },
  {
    year: "2001",
    title: "Patinter Espanha",
    lines: [
      "Início das construções de instalações próprias, na região de Vitória, em Espanha com condições para operações logísticas e de apoio ao trânsito.",
      "Alargamento da área administrativa em Mangualde",
    ],
  },
  {
    year: "2002",
    title: "Patinter Espanha",
    // official: "administrativo,em"
    lines: ["A Patinter apostou na criação de mais uma filial de apoio administrativo, em Madrid."],
  },
  { year: "2003", title: "Patinter Deutschland", lines: ["Criação da Patinter Deutschland"] },
  {
    year: "2004",
    title: "Patinter Czech",
    // official: "Republica Checa"
    lines: ["Com a tendência de deslocalização da indústria automóvel para Leste, a Patinter cria na República Checa a 7ª empresa do grupo, Patinter CZECH"],
  },
  {
    year: "2005",
    // official: "OSHAS" (title and text); the standard is OHSAS 18001
    title: "OHSAS 18001:1999",
    lines: ["Integração do Sistema de Gestão da Segurança e Saúde do Trabalho, segundo a Norma OHSAS 18001:1999"],
  },
  {
    year: "2008",
    title: "Patinter II",
    // official: "localização,se"
    lines: [
      "Em 2008, a empresa investiu estrategicamente no sector logístico e imobiliário, criando a Patinter II, Logística e Imobiliária S.A, que por razões estratégicas de localização, se encontra sediada em Alverca do Ribatejo",
    ],
  },
  {
    year: "2009",
    // official: "Novos Serviços-Agrifood service"
    title: "Novos Serviços – Agrifood service",
    // official: "frio,distribuição"
    lines: [
      "A Patinter apostou no início deste ano, em novos serviços destinados ao sector alimentar. Agrifood service contempla a área da logística de frio, distribuição alimentar e FTL nacional e internacional.",
    ],
  },
  {
    year: "2014",
    title: "Patinter UK",
    // official: "Londres,que"
    lines: [
      "As constantes mutações do mercado levaram a Patinter a apostar na abertura da Patinter UK, uma nova empresa sediada em Londres, que tem no seu core o serviço de transporte de contentores marítimos.",
    ],
  },
  {
    year: "2019",
    title: "Certificação do sistema de gestão ambiental",
    lines: [
      "A Patinter obteve a certificação do sistema de gestão ambiental segundo o referencial NP EN ISO 14001:2015, a norma que atesta o cumprimento das melhores práticas ambientais.",
    ],
  },
  {
    year: "2020",
    title: "Patinter inova com certificação que visa equilíbrio familiar e profissional",
    lines: [
      "No segmento dos transportes, a Patinter é a primeira empresa portuguesa a receber certificação na norma que prevê o equilíbrio entre a vida privada e laboral dos seus colaboradores.",
    ],
  },
];

/** The timeline's label, from its own first and last entries ("1999 — 2020"): no word is added. */
export const aboutMilestonesLabel = `${aboutMilestones[0].year} — ${aboutMilestones[aboutMilestones.length - 1].year}`;

// ------------------------------------------------------------------ contact

/**
 * The official page's call to action ("Contacte-nos" → the official contact form), under the official
 * menu group's name. It opens the official site in a new tab until this site has its own contact page.
 */
export const aboutContact = {
  label: "Contactos",
  link: { label: "Contacte-nos", href: "https://www.patinter.com/pt/gca/index.php?id=48" },
};
