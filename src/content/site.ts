// Site copy. Everything here is taken from the official site (https://www.patinter.com/pt/) or from
// the redesign brief; nothing institutional is invented. Sources are noted next to each block.

/**
 * A menu entry; `href` once its page exists on this site (an internal route). An entry with `links` is
 * a heading over its own pages (as the official menu's "Sustentabilidade"), not a page itself.
 */
export type MenuLink = { label: string; href?: string; links?: MenuLink[] };
export type MenuGroup = { title: string; links: MenuLink[] };
/** Where an inner page sits in the menu (its group and its entry), shown above its title. */
export type PagePlace = { group: string; page: string };

/**
 * Menu overlay structure, mirroring the official site's main menu (patinter.com/pt), shared by the
 * Header's menu and the Footer. An entry with an href is a link to its page on this site; the others
 * have no page yet, so they render as inert buttons that stay keyboard-reachable until they do.
 */
export const menuGroups: MenuGroup[] = [
  {
    title: "Sobre nós",
    links: [
      { label: "A Patinter", href: "/a-patinter" },
      {
        label: "Sustentabilidade",
        links: [
          { label: "Compromissos de Sustentabilidade", href: "/sustentabilidade/compromissos" },
          { label: "Responsabilidade Social e Corporativa", href: "/sustentabilidade/responsabilidade-social" },
          { label: "Políticas e Sistemas de Gestão", href: "/sustentabilidade/politicas" },
          { label: "Patrocínios", href: "/sustentabilidade/patrocinios" },
        ],
      },
      { label: "Media", href: "/noticias" },
    ],
  },
  {
    title: "O que fazemos",
    links: [{ label: "Transporte" }, { label: "Logística & Armazenagem" }, { label: "Distribuição" }, { label: "Frota & IT" }],
  },
  {
    title: "Pessoas",
    links: [{ label: "A Vida na Patinter" }, { label: "Junta-te à nossa Equipa" }, { label: "Estágios e projetos académicos" }],
  },
  {
    title: "Contactos",
    links: [
      { label: "Onde Estamos" },
      { label: "Formulário de contacto" },
      { label: "Livro de reclamações" },
      { label: "Canal de denúncia" },
      { label: "Livro de Elogios" },
    ],
  },
];

/** Language switch (visual only for now — there is no i18n routing yet). */
export const languages = [
  { code: "PT", label: "Português" },
  { code: "EN", label: "English" },
];

/** Official signature, PT version (meta descriptions of patinter.com). */
export const signature = ["Quanto mais longe vamos,", "mais perto estamos de si."];

export type HeroSlideId = "transporte" | "distribuicao" | "logistica";

export type HeroSlide = {
  id: HeroSlideId;
  /** service name, shown as a small label above the display title ("01 / Transporte") */
  label: string;
  titleLines: [string, string];
  description: string;
  /** describes only what the photograph shows: nothing is claimed about where it was taken */
  image: { alt: string };
};

/**
 * Hero (brief §4): the three services, one chapter each, in the order of the hero brief (Transporte,
 * Logística, Distribuição). Every word is the official copy: "SERVICE — DISPLAY TITLE — description",
 * exactly as the patinter.com/pt home slideshow presents them. The photographs are that slideshow's
 * too, each with its own service (see `chapterArt` in Hero.tsx).
 */
export const heroSlides: HeroSlide[] = [
  {
    id: "transporte",
    label: "Transporte",
    titleLines: ["Soluções", "globais"],
    description: "Num mundo global, apresentamos soluções de transporte adequadas às suas necessidades.",
    image: {
      // patinter.com home slideshow — /fotos/galerias/_dsc2082_5_159782300966c771b62c900_1.jpg
      alt: "Camião da frota Patinter, cabine laranja e reboque vermelho, numa via rápida ao entardecer",
    },
  },
  {
    id: "logistica",
    label: "Logística",
    titleLines: ["A aguardar", "expedição"],
    description:
      "Oferecemos um serviço personalizado de qualidade, assente num forte network de infraestruturas de logística e armazenagem.",
    image: {
      // patinter.com home slideshow — /fotos/galerias/img_destaquebig3_2091056052e98563b6_1_46914788959e09f4967aa0_1.jpg
      alt: "Operadora sorridente num armazém, entre caixas de cartão e estantes",
    },
  },
  {
    id: "distribuicao",
    label: "Distribuição",
    titleLines: ["Trabalhar sem", "preocupações"],
    description: "Asseguramos a distribuição rigorosa dos seus produtos, garantimos-lhe a sua satisfação.",
    image: {
      // patinter.com home slideshow — /fotos/galerias/img_destaquebig2_669756052e7643f7b_1.jpg
      alt: "Operador com auscultadores diante de ecrãs de acompanhamento e de um mapa de rotas",
    },
  },
];

/** Shown once in the hero, in the band under the chapters (desktop). */
export const heroTagline = signature;

/**
 * Cinematic opening of the hero (IntroLogo.tsx): only the logo on black, no copy on screen. The page's
 * h1 is screen-reader text in the hero; `skip` is the keyboard way past the opening.
 */
export const heroIntro = {
  title: "Patinter — soluções globais de transporte e logística",
  skip: "Saltar introdução",
};

export type FleetReading = {
  id: "veiculos" | "idade" | "ambiente" | "conducao";
  /** the fleet itself (on the dark stage) or the environment (on the light one) */
  act: "frota" | "ambiente";
  /** the small words that lead into the figure */
  tab: string;
  figure: string;
  /** the one sign that qualifies the figure (+ or %), set in the accent colour */
  accent?: string;
  unit: string;
  qualifier?: string;
  /** the figure as it reads in the band at the bottom of the screen — official words only, never a
   *  rewording that could change what the figure claims */
  mark: [figure: string, word: string];
  /** the whole statement, as screen readers hear it (the visual figure is decorative) */
  statement: string;
};

/**
 * Fleet figures (patinter.com/pt home page, the fleet block under the slideshow). Every word and
 * figure is the official one: nothing is rounded, reformatted or added — '+1200' and '100 kms' stay
 * as the official site writes them. Only the case changes (the official block is all caps).
 */
export const fleet: { label: string; titleLines: [string, string]; readings: FleetReading[] } = {
  label: "Frota",
  titleLines: ["A nossa", "frota"],
  readings: [
    {
      id: "veiculos",
      act: "frota",
      tab: "Num total de",
      figure: "+1200",
      accent: "+",
      unit: "veículos",
      mark: ["+1200", "Veículos"],
      statement: "Num total de +1200 veículos.",
    },
    {
      id: "idade",
      act: "frota",
      tab: "Tem",
      figure: "3",
      unit: "anos",
      qualifier: "de média de idade",
      mark: ["3", "Anos de média de idade"],
      statement: "Tem 3 anos de média de idade.",
    },
    {
      id: "ambiente",
      act: "ambiente",
      tab: "Normas ambientais",
      figure: "99%",
      accent: "%",
      unit: "frota",
      qualifier: "Euro 5 · Euro 6",
      mark: ["99%", "Euro 5 · Euro 6"],
      statement: "Normas ambientais: 99% frota Euro 5, Euro 6.",
    },
    {
      id: "conducao",
      act: "ambiente",
      tab: "A permanente formação e condução económica dos nossos condutores permite poupar",
      figure: "1,2",
      unit: "litros por cada 100 kms",
      // the official verb, not a shortened unit: '1,2 litros / 100 kms' would read as consumption
      mark: ["1,2", "Permite poupar"],
      statement:
        "A permanente formação e condução económica dos nossos condutores permite poupar 1,2 litros por cada 100 kms.",
    },
  ],
};

export type PresenceCountry = {
  id: "portugal" | "espanha" | "franca" | "alemanha";
  name: string;
  /** where the company is, each place as its official address writes it */
  places: string[];
};

/**
 * History and presence (patinter.com/pt home page, the block under the fleet's: "59 ANOS DE HISTÓRIA",
 * "EM 04 PAÍSES"). That block's map shows the four countries without naming them; the names and the
 * places are the official "Onde Estamos" page's (patinter.com/pt/gca/index.php?id=6), in its order —
 * which is also the road's, west to east. Only the case changes (the official headings are all caps).
 */
export const presence: {
  label: string;
  history: { figure: string; unit: string; qualifier: string };
  reach: { tab: string; figure: string; unit: string };
  /** the whole statement, as screen readers hear it (the visual figures are decorative) */
  statement: string;
  countries: PresenceCountry[];
} = {
  label: "Onde estamos",
  history: { figure: "59", unit: "anos", qualifier: "de história" },
  reach: { tab: "Em", figure: "04", unit: "países" },
  statement: "59 anos de história, em 04 países.",
  countries: [
    { id: "portugal", name: "Portugal", places: ["Mangualde (sede)", "Maia", "Alverca do Ribatejo"] },
    { id: "espanha", name: "Espanha", places: ["Álava"] },
    { id: "franca", name: "França", places: ["Plessis Belleville"] },
    { id: "alemanha", name: "Alemanha", places: ["Magdeburg"] },
  ],
};

export type NewsItem = {
  /** the official date, ISO (the official pages write it dd / mm / yyyy) */
  date: string;
  title: string;
  href: string;
};

/**
 * News (patinter.com/pt home page: its three highlighted news, in its order, which is also newest
 * first). Titles and dates are the official articles' own, word for word. The links open those
 * articles on the official site, in a new tab (as the redesign's Media page, /noticias, does too; the
 * user chose to keep these three as they are, 2026-11-24); the GDP one points to its patinter.com
 * address, as the official news list does (the home page links it through patinter.net). To change a
 * news item, change it here.
 */
export const news: { label: string; all: { label: string; href: string }; items: NewsItem[] } = {
  label: "Notícias",
  all: { label: "Ver todas as notícias", href: "https://www.patinter.com/pt/noticias/" },
  items: [
    {
      date: "2026-05-06",
      title: "A Patinter é Gold no programa Preferred Carrier 2026 da project44.",
      href: "https://www.patinter.com/pt/noticias/a-patinter-e-gold-no-programa-preferred-carrier-2026-da-project44/",
    },
    {
      date: "2026-02-09",
      title: "Certificação GDP reforça operação da Patinter no transporte rodoviário de medicamentos",
      href: "https://www.patinter.com/pt/noticias/certificacao-gdp-patinter-transporte-medicamentos/",
    },
    {
      date: "2024-06-07",
      title: "Patinter promove a inclusão profissional de pessoas com deficiência e incapacidade.",
      href: "https://www.patinter.com/pt/noticias/patinter-promove-a-inclusao-profissional-de-pessoas-com-deficiencia-e-incapacidade/",
    },
  ],
};

/**
 * Footer (patinter.com/pt, the footer of every page): the logo with the signature, the same four
 * groups as the menu (`menuGroups`), the social profiles and the newsletter. The official footer
 * signs in English ("The Further we go / The closer we get to you"); this Portuguese page uses the
 * Portuguese signature (`signature`). The year is the official footer's, as written there.
 */
export const footer = {
  copyright: "Copyright ©2026 Patinter",
  newsletter: "Subscreva a nossa newsletter",
};

/** Official social profiles (site menu and footer). */
export const social = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/Patinter" },
  { label: "Instagram", href: "https://www.instagram.com/patinter_group/" },
  { label: "Facebook", href: "https://www.facebook.com/Patinter/" },
];

/** Head office (patinter.com — "Mangualde (sede)"). */
export const headOffice = { city: "Mangualde", country: "Portugal" };
