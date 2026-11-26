// Interface words the redesign writes itself, in each language: buttons, the skip link, labels for
// screen readers, and the descriptions of the photographs (alt text: what each one shows, and nothing
// more — no place or date is claimed). They are not copy from the official site, which has no such
// words (only "News by category" / "Notícias por categoria" is the official news page's own). The
// English ones are plain translations of the Portuguese.

import type { Locale } from "@/lib/i18n";

const pt = {
  skipToContent: "Ir para o conteúdo",
  homeLink: "Patinter — início",
  menu: "Menu",
  close: "Fechar",
  mainMenu: "Menu principal",
  search: "Pesquisar",
  language: "Idioma",
  /** said after an external link's text */
  newTab: " (abre noutro separador)",
  footerNav: "Rodapé",
  onThisPage: "Nesta página",
  heroServices: "Serviços Patinter",
  newsByCategory: "Notícias por categoria",
  alt: {
    roadAerial: "Camião de cabine amarela e reboque vermelho em andamento numa estrada, visto de cima e desfocado pela velocidade",
    archiveLorry: "Fotografia antiga, a preto e branco, de um camião com toldo onde se lê PATINTER",
    bridgeLorry: "Camião Patinter de cabine amarela e reboque vermelho numa ponte sobre uma albufeira; a paisagem em volta a preto e branco",
    motorwayHills: "Camião Patinter numa autoestrada entre colinas de pinheiros, visto do alto ao pôr do sol",
    teamMemberRedShirt: "Colaborador da Patinter de t-shirt vermelha, a sorrir, diante de um camião amarelo com o nome Patinter",
    loadCheck: "Colaboradores de colete refletor a verificar a carga junto a um camião Patinter, no cais de um armazém",
    trafficCone: "Cone de sinalização laranja e branco sobre asfalto escuro",
    kidsTeam: "Equipa de crianças com o equipamento laranja da Patinter num pavilhão, com os treinadores",
    studyVisit: "Alunos numa visita de estudo, à volta de uma mesa com materiais, a ouvir uma mulher que segura uma folha",
    stagePlay: "Dois atores em palco, sentados diante de um grande mapa, com cartazes onde se lê «Um motorista»",
    exerciseSession: "Colaboradores de colete refletor de pé numa sala, numa sessão de exercício",
    firefighters: "Dois bombeiros voluntários diante de camiões de bombeiros, com cartazes onde se lê «Social» e «Responsability»",
    bridgeAerial: "Camião Patinter numa ponte, visto de cima",
    qualityClipboard: "Colaboradora de colete refletor com uma prancheta onde se lê «Quality», junto a um camião Patinter",
    sunsetLorry: "Camião Patinter numa estrada ao pôr do sol",
  },
};

const en: typeof pt = {
  skipToContent: "Skip to content",
  homeLink: "Patinter — home",
  menu: "Menu",
  close: "Close",
  mainMenu: "Main menu",
  search: "Search",
  language: "Language",
  newTab: " (opens in a new tab)",
  footerNav: "Footer",
  onThisPage: "On this page",
  heroServices: "Patinter services",
  newsByCategory: "News by category",
  alt: {
    roadAerial: "Lorry with a yellow cab and red trailer moving along a road, seen from above and blurred by speed",
    archiveLorry: "Old black-and-white photograph of a lorry with a canvas cover reading PATINTER",
    bridgeLorry: "Patinter lorry with a yellow cab and red trailer on a bridge over a reservoir; the landscape around it in black and white",
    motorwayHills: "Patinter lorry on a motorway between pine-covered hills, seen from above at sunset",
    teamMemberRedShirt: "Patinter employee in a red T-shirt, smiling, in front of a yellow lorry bearing the Patinter name",
    loadCheck: "Employees in high-visibility vests checking the load beside a Patinter lorry, at a warehouse dock",
    trafficCone: "Orange and white traffic cone on dark asphalt",
    kidsTeam: "Children's team in Patinter's orange kit in a sports hall, with their coaches",
    studyVisit: "Students on a study visit, around a table with materials, listening to a woman holding a sheet of paper",
    stagePlay: "Two actors on stage, seated in front of a large map, with signs reading “Um motorista”",
    exerciseSession: "Employees in high-visibility vests standing in a room, during an exercise session",
    firefighters: "Two volunteer firefighters in front of fire engines, with signs reading “Social” and “Responsability”",
    bridgeAerial: "Patinter lorry on a bridge, seen from above",
    qualityClipboard: "Employee in a high-visibility vest holding a clipboard reading “Quality”, beside a Patinter lorry",
    sunsetLorry: "Patinter lorry on a road at sunset",
  },
};

export const ui: Record<Locale, typeof pt> = { pt, en };
