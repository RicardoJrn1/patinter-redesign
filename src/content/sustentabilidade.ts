// Copy of the "Sobre nós > Sustentabilidade > Compromissos de Sustentabilidade" page
// (/sustentabilidade/compromissos). Source: the official page,
// https://www.patinter.com/pt/gca/index.php?id=61 (read 2026-11-24). Every word is the official one:
// headings in capitals are set in sentence case, and a few evident typos are fixed, each with a comment
// holding the official spelling. No figure is computed, rounded or added.
//
// An indicator's line is stored in parts — its label, its value and, after the official dash, its note —
// so the page can set them apart. Joined back (label + ": " + value + " — " + note) they give the
// official sentence.

/** The page's place in the official menu ("Sobre nós" › "Sustentabilidade"). */
import type { PagePlace } from "@/content/site";

export const commitmentsPlace: PagePlace = { group: "Sobre nós", page: "Sustentabilidade" };

export const commitmentsOpening = {
  /** the official H1, said in full */
  title: "Compromissos de Sustentabilidade",
  titleLines: ["Compromissos de", "Sustentabilidade"] as [string, string],
  lead: "Na Patinter, o crescimento sustentável é um compromisso estratégico. Trabalhamos continuamente para melhorar o desempenho da nossa atividade, conciliando a excelência do serviço com a proteção do ambiente, a segurança rodoviária e a saúde, segurança e bem-estar dos nossos colaboradores.",
};

/** Official "OS NOSSOS COMPROMISSOS". */
export const commitmentsIntro = {
  label: "Os nossos compromissos",
  statement:
    "Os nossos compromissos de sustentabilidade orientam a redução dos impactos ambientais da nossa atividade, a proteção e valorização das pessoas, a promoção da segurança rodoviária e uma atuação assente na ética, na integridade e no respeito pelos direitos humanos.",
};

export type IndicatorLine = {
  /** what the line states: a target, a result, or the base year it is measured against */
  kind: "objetivo" | "resultado" | "base";
  label: string;
  value: string;
  /** the official explanation after the dash, if any */
  note?: string;
};

/** One official indicator, its lines in the official order. Its number (01, 02…) is presentation. */
export type Indicator = { id: string; name: string; lines: IndicatorLine[] };

export type CommitmentTheme = {
  id: "ambiente" | "pessoas" | "saude-seguranca" | "seguranca-rodoviaria" | "etica";
  title: string;
  paragraphs: string[];
  /** a sub-heading with its own text, before the indicators (Ambiente's "Emissões") */
  subsection?: { title: string; paragraphs: string[] };
  /** the official heading over the indicators, where the page has one */
  indicatorsTitle?: string;
  indicators: Indicator[];
  /** text and a link after the indicators (Ética's code of ethics) */
  closing?: { paragraph: string; link: { label: string; href: string } };
};

export const commitmentThemes: CommitmentTheme[] = [
  {
    id: "ambiente",
    title: "Ambiente",
    paragraphs: [
      "Certificada pela norma ISO 14001:2015, a Patinter identifica e avalia regularmente os aspetos ambientais em todos os locais onde opera, implementando medidas para reduzir o impacto da sua atividade no meio ambiente.",
    ],
    subsection: {
      title: "Emissões",
      paragraphs: [
        "A redução das emissões de GEE é uma prioridade para a Patinter. Investimos numa frota recente, em equipamentos mais eficientes, em formação contínua de condução económica, manutenção preventiva atempada, controlo de pressão dos pneus e otimização de rotas, um conjunto de medidas que continuamos a reforçar para reduzir o nosso impacto ambiental.",
      ],
    },
    indicatorsTitle: "Objetivos",
    indicators: [
      {
        id: "consumo-energetico",
        name: "Consumo energético da frota",
        lines: [
          // official: "Objetivo: Reduzir Monitorizar" (an editing slip; "Monitorizar" kept, as approved —
          // to confirm with Patinter)
          { kind: "objetivo", label: "Objetivo", value: "Monitorizar" },
          { kind: "resultado", label: "Resultado 2024", value: "306 841,1 MWh" },
          // official: "313392,4 MWh" (no space, unlike the 2024 figure)
          { kind: "resultado", label: "Resultado 2025", value: "313 392,4 MWh" },
        ],
      },
      {
        id: "ambito-1",
        name: "Emissões de CO₂eq – Âmbito 1",
        lines: [
          { kind: "objetivo", label: "Objetivo 2030", value: "Reduzir 12%" },
          { kind: "resultado", label: "Resultado 2024", value: "79 233 tCO₂e" },
          {
            kind: "resultado",
            label: "Resultado 2025",
            value: "85 954 tCO₂e",
            note: "aumento de 8,5%, explicado pelo crescimento da atividade operacional em 2025 e pelo consequente aumento do consumo de combustível da frota.",
          },
        ],
      },
      {
        id: "ambito-2",
        name: "Emissões de CO₂eq – Âmbito 2",
        lines: [
          { kind: "objetivo", label: "Objetivo 2030 – market-based", value: "0" },
          {
            kind: "resultado",
            label: "Resultado 2025 – market-based",
            value: "0 tCO₂e",
            note: "resultado decorrente da aquisição de eletricidade proveniente de fontes renováveis.",
          },
          // official: "location-based:Monitorizar"
          { kind: "objetivo", label: "Objetivo 2030 – location-based", value: "Monitorizar" },
          {
            kind: "resultado",
            label: "Resultado 2025 – location-based",
            value: "22,4 tCO₂e",
            note: "valor calculado com base no mix médio de produção elétrica da rede.",
          },
        ],
      },
      {
        id: "intensidade",
        name: "Intensidade de emissões",
        lines: [
          { kind: "objetivo", label: "Objetivo 2030", value: "Redução de 25% face a 2024" },
          { kind: "resultado", label: "Resultado 2024", value: "1,03 tCO₂e/mil km" },
          {
            kind: "resultado",
            label: "Resultado 2025",
            value: "1,02 tCO₂e/mil km",
            note: "o decréscimo está associado às boas práticas de condução económica e defensiva, utilização de HVO, manutenção da frota e utilização de frota EURO VI.",
          },
        ],
      },
      {
        id: "residuos",
        name: "Taxa de valorização de resíduos",
        lines: [
          { kind: "objetivo", label: "Objetivo", value: "Atingir 90%" },
          { kind: "resultado", label: "Resultado 2024", value: "94,8%", note: "objetivo superado." },
          {
            kind: "resultado",
            label: "Resultado 2025",
            value: "95,53%",
            note: "melhoria de 0,73 pontos percentuais face a 2024, mantendo a taxa de valorização acima da meta definida.",
          },
        ],
      },
    ],
  },
  {
    id: "pessoas",
    title: "Pessoas e Desenvolvimento",
    paragraphs: [
      "As pessoas são o centro da atividade da Patinter. Por isso, empenhamo-nos diariamente em proporcionar aos nossos colaboradores um ambiente de trabalho seguro, confortável e propício ao desenvolvimento profissional e pessoal.",
      "Comprometemo-nos ainda a garantir um salário digno a todos os colaboradores, cumprindo rigorosamente a legislação laboral e o Acordo Coletivo de Trabalho em vigor.",
    ],
    indicators: [
      {
        id: "salario-digno",
        name: "Salário digno",
        lines: [
          {
            kind: "objetivo",
            label: "Objetivo 2030",
            value: "100% dos colaboradores com remuneração igual ou superior ao salário digno de referência (WageIndicator Foundation), em cada ano até 2030.",
          },
          { kind: "base", label: "Ano-base 2024", value: "100%" },
        ],
      },
      {
        id: "satisfacao",
        name: "Satisfação dos colaboradores",
        lines: [{ kind: "objetivo", label: "Objetivo 2030", value: "igual ou superior a 98% (ano-base 2024: 92%)" }],
      },
      {
        id: "rotatividade",
        name: "Taxa de rotatividade",
        lines: [
          { kind: "objetivo", label: "Objetivo 2030", value: "inferior a 10% (ano-base 2024: 11,4%)" },
          { kind: "resultado", label: "Resultado 2025", value: "15,8%" },
        ],
      },
      {
        id: "formacao",
        name: "Formação",
        lines: [{ kind: "resultado", label: "Resultado 2025", value: "17,7 horas, em média, por colaborador" }],
      },
      {
        id: "contratacao-coletiva",
        name: "Contratação coletiva",
        lines: [{ kind: "resultado", label: "Resultado 2025", value: "100% dos colaboradores abrangidos" }],
      },
    ],
  },
  {
    id: "saude-seguranca",
    title: "Saúde e Segurança no Trabalho",
    paragraphs: [
      "Colocar a vida em primeiro lugar é o princípio que orienta a estratégia de saúde e segurança da Patinter. Identificamos rigorosamente os perigos e avaliamos sistematicamente os riscos, com uma gestão preventiva e corretiva eficaz, apoiada por investimento contínuo em soluções tecnológicas que reduzem os riscos inerentes à atividade de transporte.",
      "Promovemos regularmente ações de sensibilização, workshops e campanhas internas que incentivam comportamentos responsáveis e reforçam a nossa cultura de segurança. O programa Patinter WellCare integra acompanhamento nas áreas da ergonomia, fisioterapia e saúde do sono, complementado por rastreios regulares. Promove também iniciativas de atividade física que incentivam estilos de vida mais saudáveis e reforçam a ligação entre colaboradores.",
    ],
    indicatorsTitle: "Indicadores de Saúde e Segurança no Trabalho",
    indicators: [
      {
        id: "acidentes-numero",
        name: "Número de acidentes de trabalho registáveis",
        lines: [
          { kind: "objetivo", label: "Objetivo 2030", value: "Reduzir 15%" },
          { kind: "resultado", label: "Resultado 2023", value: "24" },
          { kind: "resultado", label: "Resultado 2024", value: "25" },
          {
            kind: "resultado",
            label: "Resultado 2025",
            value: "27",
            note: "ligeiro aumento, associado principalmente à ocorrência de quedas no local de trabalho.",
          },
        ],
      },
      {
        id: "acidentes-taxa",
        name: "Taxa de acidentes de trabalho registáveis",
        lines: [
          { kind: "objetivo", label: "Objetivo", value: "Reduzir 15%" },
          { kind: "resultado", label: "Resultado 2023", value: "12,6" },
          { kind: "resultado", label: "Resultado 2024", value: "13,4" },
          {
            kind: "resultado",
            label: "Resultado 2025",
            // official: "16.7" (a decimal point, unlike every other figure on the page)
            value: "16,7",
            note: "o aumento face a 2024 deve ser analisado tendo em conta a redução do número total de horas trabalhadas, que influencia o cálculo deste indicador.",
          },
        ],
      },
      {
        id: "dias-perdidos",
        name: "Número de dias perdidos devido a acidentes/doenças relacionados com o trabalho",
        lines: [
          { kind: "objetivo", label: "Objetivo 2030", value: "Reduzir 15%" },
          { kind: "resultado", label: "Resultado 2023", value: "897" },
          { kind: "resultado", label: "Resultado 2024", value: "889" },
          {
            kind: "resultado",
            label: "Resultado 2025",
            value: "1 490",
            note: "aumento associado ao ligeiro crescimento da sinistralidade e ao maior número de dias de ausência decorrentes das ocorrências registadas.",
          },
        ],
      },
      {
        id: "mortes-trabalho",
        name: "Mortes resultantes de acidentes de trabalho",
        lines: [
          { kind: "objetivo", label: "Objetivo 2030", value: "0" },
          {
            kind: "resultado",
            label: "Resultado 2025",
            value: "0",
            note: "manutenção de um resultado de zero mortes resultantes de acidentes de trabalho.",
          },
        ],
      },
    ],
  },
  {
    id: "seguranca-rodoviaria",
    title: "Segurança Rodoviária",
    paragraphs: [
      "A segurança rodoviária é um pilar essencial para a Patinter. Trabalhamos continuamente para garantir as melhores condições a todos os que partilham as estradas connosco, colaboradores e restantes utentes.",
    ],
    indicatorsTitle: "Objetivos",
    indicators: [
      {
        id: "incidencia",
        name: "Taxa de incidência de acidentes rodoviários",
        lines: [
          { kind: "base", label: "Ano base 2024", value: "2,1 acidentes por milhão de quilómetros" },
          { kind: "resultado", label: "Resultado 2025", value: "2,3 acidentes por milhão de quilómetros" },
          {
            kind: "objetivo",
            label: "Objetivo 2030",
            value: "≤ 1,7 acidentes por milhão de quilómetros",
            note: "objetivo orientado para a redução da sinistralidade, ajustando o número de acidentes ao volume de quilómetros percorridos.",
          },
        ],
      },
      {
        id: "mercadoria",
        name: "Número de ocorrências com mercadoria da responsabilidade da Patinter",
        lines: [
          { kind: "base", label: "Ano base 2024", value: "27" },
          {
            kind: "objetivo",
            label: "Objetivo 2030",
            value: "≤ 15",
            note: "pretende-se reforçar a prevenção, o controlo operacional e a integridade da mercadoria transportada.",
          },
          { kind: "resultado", label: "Resultado 2025", value: "34" },
        ],
      },
      {
        id: "mortos-estrada",
        name: "Número de mortos em acidentes rodoviários da nossa responsabilidade",
        lines: [
          // official: "Objetivo 2030:0"
          { kind: "objetivo", label: "Objetivo 2030", value: "0" },
          { kind: "resultado", label: "Resultado 2024", value: "0" },
          { kind: "resultado", label: "Resultado 2025", value: "0", note: "manutenção do objetivo de zero vítimas mortais." },
        ],
      },
      {
        id: "feridos-graves",
        name: "Número de feridos graves em acidentes rodoviários da nossa responsabilidade",
        lines: [
          { kind: "objetivo", label: "Objetivo 2030", value: "0" },
          { kind: "resultado", label: "Resultado 2024", value: "0" },
          {
            kind: "resultado",
            label: "Resultado 2025",
            value: "0",
            note: "manutenção de zero feridos graves, em linha com a cultura de prevenção e segurança rodoviária da empresa.",
          },
        ],
      },
    ],
  },
  {
    id: "etica",
    title: "Ética, Integridade e Direitos Humanos",
    paragraphs: [],
    indicatorsTitle: "Objetivos",
    indicators: [
      {
        id: "infracoes",
        name: "Infrações éticas, legais e operacionais",
        lines: [
          { kind: "resultado", label: "Resultado 2025", value: "0" },
          {
            kind: "objetivo",
            label: "Objetivo 2030",
            value: "0",
            note: "manutenção de uma cultura de integridade, conformidade e cumprimento dos requisitos aplicáveis.",
          },
        ],
      },
      {
        id: "discriminacao",
        name: "Incidentes de discriminação, incluindo assédio",
        lines: [
          {
            kind: "resultado",
            label: "Resultado 2025",
            value: "0",
            note: "não foram registados incidentes de discriminação ou assédio durante o período de reporte.",
          },
        ],
      },
      {
        id: "direitos-humanos",
        name: "Reclamações/denúncias relacionadas com direitos humanos",
        lines: [
          {
            kind: "resultado",
            label: "Resultado 2025",
            value: "0",
            note: "não foram registadas reclamações através dos canais internos ou dos mecanismos formais de denúncia relativamente a estas matérias.",
          },
        ],
      },
      {
        id: "corrupcao",
        name: "Condenações ou sanções relacionadas com corrupção e suborno",
        lines: [
          {
            kind: "resultado",
            label: "Resultado 2025",
            value: "0",
            note: "não foram registadas condenações, multas ou sanções financeiras relacionadas com corrupção ou suborno.",
          },
        ],
      },
    ],
    closing: {
      paragraph:
        "O Código de Ética da Patinter passa por contínuas avaliações para garantir a sua atualização constante, visando promover um estilo de liderança ética e sustentável. Este código, que estabelece as diretrizes a seguir nas interações profissionais, é também obrigatório para todos aqueles que pretendam tornar-se fornecedores da Patinter.",
      // the official link is http://; the same document over https
      link: { label: "Consulte aqui o nosso Código de Ética", href: "https://drive.google.com/file/d/1lhiGQE7sF00qwv0lu2UcTYTSJ57c2dtM/view?usp=sharing" },
    },
  },
];

/** The official page's last line. */
export const commitmentsUpdated: string = "Última atualização: setembro de 2026";

/** The official page's call to action (as on "Quem somos"), under the official menu group's name. */
export const commitmentsContact = {
  label: "Contactos",
  link: { label: "Contacte-nos", href: "https://www.patinter.com/pt/gca/index.php?id=48" },
};
