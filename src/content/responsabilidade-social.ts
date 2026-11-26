// Copy of the "Sobre nós > Sustentabilidade > Responsabilidade Social e Corporativa" page
// (/sustentabilidade/responsabilidade-social). Source: the official page,
// https://www.patinter.com/pt/gca/index.php?id=32 (read 2026-11-24). Every word is the official one, in
// the official order; a few evident typos are fixed, each with a comment holding the official spelling,
// and the official straight quotes ("…") are set as typographic ones (“…”).

/** The page's place in the official menu ("Sobre nós" › "Sustentabilidade"). */
import type { PagePlace } from "@/content/site";

export const socialPlace: PagePlace = { group: "Sobre nós", page: "Sustentabilidade" };

/**
 * The official H1, and its introduction. The official page sets the introduction as one paragraph; here
 * its first sentence is the opening's lead and the rest opens the page's body, under it.
 */
export const socialOpening = {
  title: "Responsabilidade Social e Corporativa",
  titleLines: ["Responsabilidade", "Social e", "Corporativa"],
  lead: "Na Patinter, acreditamos que o sucesso empresarial está intrinsecamente ligado ao compromisso com a sociedade.",
  statement:
    "A responsabilidade social não é apenas uma extensão das nossas atividades, mas sim uma parte integral da nossa visão. Procuramos contribuir de forma ativa para o desenvolvimento das comunidades onde estamos presentes, através da colaboração em projetos, parcerias e iniciativas que reforçam valores fundamentais e asseguram um impacto positivo e duradouro no ambiente, na economia e nas pessoas.",
};

export type SocialCommitment = {
  id: "educacao" | "desporto" | "cultura" | "wellcare" | "solidariedade" | "seguranca-rodoviaria";
  /** the official heading */
  title: string;
  /** the same heading without the "Compromisso com" every one of them starts with (the page's index) */
  short: string;
  paragraphs: string[];
  /** headed parts after the paragraphs (Solidariedade's three) */
  subsections?: { title: string; paragraphs: string[] }[];
  /** a list introduced by a sentence, each item a name and its text (WellCare's four areas) */
  areas?: { intro: string; items: { name: string; text: string }[]; outro?: string };
  /** a statement in quotation marks (Segurança Rodoviária) */
  quote?: string;
  /** a numbered list introduced by a sentence (Segurança Rodoviária's measures) */
  steps?: { intro: string; items: string[] };
};

export const socialCommitments: SocialCommitment[] = [
  {
    id: "educacao",
    title: "Compromisso com a Educação, Ciência e Inovação",
    short: "Educação, Ciência e Inovação",
    paragraphs: [
      "O conhecimento é motor de progresso, e na Patinter apoiamos projetos que promovem a educação, a ciência e a inovação como pilares do desenvolvimento sustentável.",
      "A nossa parceria com a Academi@ STEM Mangualde reflete esse compromisso. Através de visitas de estudo, proporcionamos aos alunos a oportunidade de conhecer de perto o setor dos transportes e da logística. Nestes momentos, têm contacto com temas como a geografia das viagens, a gestão e reutilização da água, a eficiência energética, a segurança rodoviária e o reaproveitamento de pneus usados.",
      "As visitas incluem também uma passagem pela nossa ETAR e uma mini viagem de camião no interior das nossas instalações — uma experiência educativa, concreta e inspiradora.",
      "Para além deste projeto, a Patinter apoia iniciativas de investigação aplicada, centros de desenvolvimento tecnológico e programas que reforçam a ligação entre o setor empresarial e o meio académico. Colaboramos com universidades, centros de inovação e entidades regionais que promovem o pensamento crítico, a literacia científica e a criação de soluções sustentáveis, contribuindo para o desenvolvimento de competências nas novas gerações.",
    ],
  },
  {
    id: "desporto",
    title: "Compromisso com o Desporto, a Formação e a Comunidade",
    short: "Desporto, Formação e Comunidade",
    paragraphs: [
      "Vemos o desporto como um motor de crescimento individual e coletivo, essencial para a criação de valores fundamentais que fortalecem a sociedade. Por isso, apoiamos projetos em diversas modalidades, de norte a sul do país, com prioridade para iniciativas estruturadas, de impacto real e focadas na excelência.",
      "Estabelecemos parcerias com escolas de formação, sobretudo no interior e nas proximidades das nossas instalações, reforçamos as comunidades locais e contribuímos para o desenvolvimento regional. Mais do que apoio financeiro, oferecemos acesso ao desporto, promovemos hábitos saudáveis e estimulamos o desenvolvimento pessoal.",
      "Através da nossa colaboração, inspiramos um estilo de vida ativo e contribuímos para uma sociedade mais justa e inclusiva.",
    ],
  },
  {
    id: "cultura",
    title: "Compromisso com a Cultura e a Expressão Artística",
    short: "Cultura e Expressão Artística",
    paragraphs: [
      "Reconhecemos a cultura como um elemento essencial para o desenvolvimento social e humano. Por isso, apoiamos iniciativas que promovem a criação artística, democratizam o acesso à cultura e impulsionam o surgimento de novos talentos.",
      "O nosso compromisso reflete-se no apoio a uma ampla variedade de manifestações culturais – do teatro ao circo, do cinema às artes visuais. Através de parcerias estratégicas, investimos em projetos que enriquecem a produção cultural e fortalecem a conexão entre a arte e a comunidade.",
      "Em 2015, em colaboração com o Teatro Viriato, do qual somos mecenas, e o Teatro do Vestido, apresentámos a peça “Viajantes Solitários”, um projeto singular que dá voz às histórias de vida e de estrada dos camionistas. Esta produção, baseada numa meticulosa recolha de relatos, transformou experiências pessoais em poesia dramatúrgica, abordando com profundidade a complexidade de uma vida marcada pela constante deslocação.",
      "O espetáculo retrata as particularidades de uma existência vivida em quilómetros de distância, noites transitórias e um conhecimento íntimo de estradas, autoestradas, restaurantes de beira de estrada e alojamentos temporários. Mais do que uma narrativa sobre deslocação física, “Viajantes Solitários” é um retrato da inquietação portuguesa: o desejo de partir, a saudade de regressar e a necessidade incessante de continuar a jornada.",
    ],
  },
  {
    id: "wellcare",
    title: "Compromisso WellCare – Bem-estar e Qualidade de Vida",
    short: "WellCare – Bem-estar e Qualidade de Vida",
    paragraphs: [
      "O Projeto WellCare, desenvolvido pela Patinter, foi criado para promover o bem-estar integral dos nossos colaboradores, alinhando saúde, equilíbrio e satisfação. Com este programa, visamos proporcionar um ambiente de trabalho seguro, saudável e inspirador, onde cada colaborador se sinta valorizado e em harmonia com os seus objetivos pessoais e profissionais.",
      // official: "processo continuo"
      "Inspirado na definição de saúde da Organização Mundial da Saúde (OMS) – “um estado de completo bem-estar físico, mental e social, e não apenas a ausência de doenças” –, o WellCare adota uma abordagem holística do indivíduo. O nosso compromisso é apoiar os colaboradores num processo contínuo de valorização da vida, através da promoção de hábitos saudáveis, comportamentos positivos e atitudes que maximizem o seu potencial.",
    ],
    areas: {
      intro: "O projeto está estruturado em quatro áreas estratégicas de atuação:",
      // official: a space before each colon ("Saúde Curativa e Preventiva : Garantir…")
      items: [
        { name: "Saúde Curativa e Preventiva", text: "Garantir o acompanhamento necessário para prevenir doenças e apoiar a recuperação, quando necessário." },
        { name: "Ergonomia e Fisioterapia", text: "Implementar soluções que melhorem a postura e o conforto no local de trabalho, reduzindo riscos de lesões." },
        { name: "Ginástica Laboral", text: "Promover exercícios específicos para aliviar tensões e aumentar o bem-estar durante a jornada de trabalho." },
        { name: "Psicologia e Nutrição", text: "Proporcionar suporte emocional e orientações alimentares que promovam uma vida equilibrada e saudável." },
      ],
      outro:
        "Estas áreas de intervenção foram cuidadosamente escolhidas para assegurar que cada colaborador tenha acesso a recursos e ferramentas que promovam uma qualidade de vida superior, tanto no contexto profissional como pessoal.",
    },
  },
  {
    id: "solidariedade",
    title: "Compromisso com a Solidariedade",
    short: "Solidariedade",
    paragraphs: [
      "Acreditamos que o verdadeiro sucesso de uma empresa não se limita aos resultados financeiros, mas sim ao impacto positivo que gera na sociedade. Com este princípio como guia, lideramos e participamos em diversos projetos de solidariedade social, assumindo um papel ativo no apoio a instituições e causas que promovem o bem-estar e a dignidade humana.",
    ],
    subsections: [
      {
        title: "Apoio às Crianças e Idosos – Cuidar dos Mais Vulneráveis",
        paragraphs: [
          "Reconhecendo a importância de cuidar dos mais vulneráveis, a Patinter estabelece parcerias estratégicas com instituições de acolhimento infantil e lares de idosos. Estas colaborações permitem-nos contribuir para a inclusão social, através do fornecimento de recursos e assistência que melhoram a qualidade de vida de crianças e idosos em situações de vulnerabilidade, abandono ou solidão.",
        ],
      },
      {
        title: "Bombeiros Voluntários – Suporte à Proteção das Comunidades",
        paragraphs: [
          "Sabendo da importância do trabalho realizado pelas corporações de Bombeiros Voluntários, a Patinter presta apoio de manutenção e logístico para que estas equipas possam continuar a proteger as nossas comunidades de forma eficiente e segura.",
        ],
      },
      {
        title: "Associações Locais – Fortalecer Comunidades",
        paragraphs: [
          "A nossa responsabilidade social vai além das grandes parcerias. Colaboramos com associações “que fazem diferença no terreno” em projetos que abrangem inclusão social, educação, saúde, cultura e desporto. Estas iniciativas fortalecem o tecido social, fomentam o espírito de solidariedade e criam uma maior coesão comunitária.",
        ],
      },
    ],
  },
  {
    id: "seguranca-rodoviaria",
    title: "Compromisso com a Segurança Rodoviária",
    short: "Segurança Rodoviária",
    paragraphs: [
      "A segurança rodoviária é a base do ADN da Patinter.",
      // official: "os custos associados aos mesmos tem vindo" (the subject is plural)
      "Como um dos principais players europeus, a Patinter encara a segurança rodoviária não como medida, mas como cultura e como forma de estar no dia-a-dia. Em constante avaliação e procura por ações que permitam diminuir a quantidade e a gravidade de acidentes rodoviários, a empresa reúne todos os meios disponíveis para proteger o que considera essencial: a vida e saúde dos seus colaboradores e de todos os que se cruzam com eles na estrada. Esta aposta tem demonstrado há vários anos que é uma política vencedora, uma vez que o número de acidentes e os custos associados aos mesmos têm vindo a diminuir, atestando a credibilidade do serviço prestado e transmitindo a confiança aos seus clientes, parceiros e a todos os que circulam na estrada.",
    ],
    // official: opened with a straight quote and closed with a curly one; the page sets both
    quote:
      "Acreditamos que a implementação de Sistema de Gestão de Segurança Rodoviária e a sua certificação pela ISO 39001 nos ajuda a formalizar e sistematizar este compromisso, servindo como exemplo para outras empresas do setor. Procuramos contribuir positivamente para a imagem do setor dos transportes, promovendo a cultura de segurança e valorizando a profissão do motorista.",
    steps: {
      intro: "Medidas e respetivas ações do Plano de Segurança Rodoviária:",
      items: [
        // official: "diagnostico"
        "Realização de diagnóstico para verificação de práticas e procedimentos existentes na empresa (por ex. manutenção preventiva atempada, aquisição de viaturas com os sistemas de apoio à condução, etc.) e elaboração do respetivo relatório;",
        "Revisão de documentação de sistema de acordo com a norma ISO 39001;",
        "Criação de Comissão de Segurança para monitorização, análise e discussão de acidentes rodoviários e realização de reuniões;",
        "Adoção de procedimento de investigação pormenorizada de acidentes rodoviários e elaboração do modelo de Relatório de investigação do acidente (incluindo o Plano de ações);",
        // official: "Formação inicial e continua"
        "Formação inicial e contínua em Sinistralidade e Segurança Rodoviária, Condução Defensiva, Acondicionamento de Carga, Segurança e Saúde no Trabalho;",
        "Elaboração de Plano de Emergência Rodoviário para garantir a resposta em caso de acidente rodoviário - realização de simulacro de acidente rodoviário para testar a resposta à emergência;",
        "Medidas para aumento do campo de visão na condução, redução e sinalização de ângulos mortos - colocação de película angular para alargamento de campo de visão, colocação de autocolantes de sinalização de ângulos mortos (legislação francesa), criação de guia de ajuste de espelhos;",
        "Revisão do procedimento de formação inicial prática (viagem de experiência) e avaliação de modo de condução do motorista iniciante - análise de perfil do formando segundo critérios definidos;",
        // official: "90km/h"
        "Redução na limitação de velocidade máxima das viaturas - aferição de limitador a 88 km/h em vez de 90 km/h;",
        "Campanhas informativas;",
        // official: "zero acidentes ." (a space before the stop)
        "Reconhecimento de motoristas com zero acidentes.",
      ],
    },
  },
];

/** The official page's call to action (as on the other pages), under the official menu group's name. */
export const socialContact = {
  label: "Contactos",
  link: { label: "Contacte-nos", href: "https://www.patinter.com/pt/gca/index.php?id=48" },
};
