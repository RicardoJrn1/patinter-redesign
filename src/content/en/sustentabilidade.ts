// English copy of the "Company > Sustainability > Sustainability Commitments" page
// (/sustentabilidade/compromissos). Source: the official English page,
// https://www.patinter.com/en/gca/index.php?id=61 (read 2026-11-24). Every word is the official one:
// headings in capitals are set in normal case, and a few evident typos are fixed, each with a comment
// holding the official spelling. No figure is computed, rounded, added or converted: each is written
// as the English page writes it, separators included ("306 841,1 MWh", "79,233 tCO₂e", "22.4 tCO₂e").
// The indicators' official numbering ("1)", "2)"…) is left out, as in the Portuguese file.
//
// The English page is newer than the Portuguese one and differs from it in places: other figures,
// some target and result lines it does not have, a different opening. This file follows the English
// page throughout; the ids are the Portuguese file's, each theme and indicator matched by meaning.
//
// An indicator's line is stored in parts — its label, its value and, after the official dash, its note —
// so the page can set them apart. Joined back (label + ": " + value + " — " + note) they give the
// official sentence.

import type * as pt from "@/content/sustentabilidade";

export type { CommitmentTheme, Indicator, IndicatorLine } from "@/content/sustentabilidade";

/** The page's place in the official menu ("Company" › "Sustainability"). */
export const commitmentsPlace: typeof pt.commitmentsPlace = { group: "Company", page: "Sustainability" };

export const commitmentsOpening: typeof pt.commitmentsOpening = {
  /** the official H1, said in full */
  title: "Sustainability Commitments",
  titleLines: ["Sustainability", "Commitments"],
  lead: "At Patinter, growing sustainably is more than a principle; it is our greatest challenge. Every day, we strive for continuous improvement across all areas of our operations, with service excellence, environmental protection, and the safety, health and well-being of our employees as integral pillars of our culture.",
};

/** Official "Our Commitment". */
export const commitmentsIntro: typeof pt.commitmentsIntro = {
  label: "Our Commitment",
  statement:
    "Our sustainability commitments reflect our ambition to be recognised as a sustainable transport company, a driver of local development and an agent of change at global level.",
};

export const commitmentThemes: typeof pt.commitmentThemes = [
  {
    id: "ambiente",
    title: "Environment",
    paragraphs: [
      "Patinter regularly identifies and assesses environmental aspects at all its operating locations, implementing measures to reduce the environmental impact of its activities.",
    ],
    subsection: {
      title: "Emissions",
      paragraphs: [
        "Reducing GHG emissions is a priority for Patinter. We invest in a modern fleet, more efficient equipment, continuous eco-driving training, timely preventive maintenance, tyre pressure monitoring and route optimisation, a set of measures that we continue to strengthen to reduce our environmental impact.",
      ],
    },
    indicatorsTitle: "Targets",
    indicators: [
      {
        id: "consumo-energetico",
        name: "Fleet energy consumption",
        // the English page states no target for this indicator
        lines: [
          // official: "306\n841,1 MWh" (a line break inside the figure), joined with a space as in the
          // 2025 figure
          { kind: "resultado", label: "2024 result", value: "306 841,1 MWh" },
          // official: "2025 result::"
          { kind: "resultado", label: "2025 result", value: "313 070,7 MWh" },
        ],
      },
      {
        id: "ambito-1",
        name: "CO₂eq emissions – Scope 1",
        // the English page states no target for this indicator
        lines: [
          { kind: "resultado", label: "2024 result", value: "79,233 tCO₂e" },
          {
            kind: "resultado",
            label: "2025 result",
            value: "85,954 tCO₂e",
            note: "an increase of 8.5%, explained by the growth in operational activity in 2025 and the resulting increase in fleet fuel consumption.",
          },
        ],
      },
      {
        id: "ambito-2",
        name: "CO₂eq emissions – Scope 2",
        // the English page states no targets for this indicator
        lines: [
          {
            kind: "resultado",
            label: "2025 result – market-based",
            value: "0 tCO₂e",
            note: "result arising from the purchase of electricity from renewable sources.",
          },
          {
            kind: "resultado",
            label: "2025 result – location-based",
            value: "22.4 tCO₂e",
            note: "value calculated based on the average electricity production mix of the grid.",
          },
        ],
      },
      {
        id: "intensidade",
        name: "Emissions intensity",
        lines: [
          { kind: "objetivo", label: "2030 target", value: "25% reduction compared to 2024" },
          { kind: "resultado", label: "2024 result", value: "1.03 tCO₂e/1,000 km" },
          {
            kind: "resultado",
            label: "2025 result",
            value: "1.02 tCO₂e/1,000 km",
            // official: "1.02 tCO₂e/1,000 km – the reduction…" (an en dash before the note, where every
            // other note on the page follows an em dash)
            note: "the reduction is associated with eco-driving and defensive driving practices, the use of HVO, fleet maintenance and the use of Euro VI vehicles.",
          },
        ],
      },
      {
        id: "residuos",
        name: "Waste recovery rate",
        lines: [
          { kind: "objetivo", label: "Target", value: "Reach 90%" },
          { kind: "resultado", label: "2024 result", value: "94.8%", note: "target exceeded." },
          {
            kind: "resultado",
            label: "2025 result",
            value: "95.53%",
            note: "an improvement of 0.73 percentage points compared to 2024, keeping the recovery rate above the defined target.",
          },
        ],
      },
    ],
  },
  {
    id: "pessoas",
    title: "People and Development",
    paragraphs: [
      "People are at the heart of Patinter’s operations. We therefore work every day to provide our employees with a safe and comfortable working environment that supports their professional and personal development.",
      "We are also committed to ensuring that all employees receive a living wage, in full compliance with labour legislation and the Collective Bargaining Agreement in force.",
    ],
    indicators: [
      {
        id: "salario-digno",
        name: "Living wage",
        lines: [
          {
            kind: "objetivo",
            label: "2030 target",
            value: "100% of employees paid at or above the living wage benchmark (WageIndicator Foundation) in every year up to 2030.",
          },
          { kind: "base", label: "2024 baseline", value: "100%" },
        ],
      },
      {
        id: "satisfacao",
        name: "Employee satisfaction",
        lines: [{ kind: "objetivo", label: "2030 target", value: "at least 97% (2024 baseline: 90%)" }],
      },
      {
        id: "rotatividade",
        name: "Employee turnover rate",
        lines: [
          { kind: "objetivo", label: "2030 target", value: "below 10% (2024 baseline: 11.4%)" },
          { kind: "resultado", label: "2025 result", value: "15.8%" },
        ],
      },
      {
        id: "formacao",
        name: "Training",
        lines: [{ kind: "resultado", label: "2025 result", value: "an average of 17.7 hours per employee" }],
      },
      {
        id: "contratacao-coletiva",
        name: "Collective bargaining",
        lines: [{ kind: "resultado", label: "2025 result", value: "100% of employees covered by collective bargaining agreements" }],
      },
    ],
  },
  {
    id: "saude-seguranca",
    title: "Occupational Health and Safety",
    // the official page has a lone "Objectives" line between the title and these paragraphs, with nothing
    // under it (the indicators come later, under their own heading); it is left out
    paragraphs: [
      "Putting life first is the principle that guides Patinter’s health and safety strategy. We rigorously identify hazards and systematically assess risks, supported by effective preventive and corrective management and continuous investment in technological solutions that reduce the risks inherent in transport operations.",
      "We regularly organise awareness sessions, workshops and internal campaigns that encourage responsible behaviour and strengthen our safety culture. The Patinter WellCare programme provides support in ergonomics, physiotherapy and sleep health, complemented by regular health screenings. It also promotes physical activity initiatives that encourage healthier lifestyles and strengthen connections among employees.",
    ],
    indicatorsTitle: "Occupational Health and Safety Indicators",
    // the English page states no targets for these indicators
    indicators: [
      {
        id: "acidentes-numero",
        name: "Number of recordable work-related accidents",
        lines: [
          { kind: "resultado", label: "2023 result", value: "24" },
          { kind: "resultado", label: "2024 result", value: "25" },
          {
            kind: "resultado",
            label: "2025 result",
            value: "27",
            note: "a slight increase, mainly associated with falls in the workplace.",
          },
        ],
      },
      {
        id: "acidentes-taxa",
        name: "Rate of recordable work-related accidents",
        lines: [
          { kind: "resultado", label: "2023 result", value: "14.8" },
          { kind: "resultado", label: "2024 result", value: "13.4" },
          {
            kind: "resultado",
            label: "2025 result",
            value: "14.2",
            note: "the increase compared with 2024 should be considered in the context of the reduction in total hours worked, which affects the calculation of this indicator.",
          },
        ],
      },
      {
        id: "dias-perdidos",
        name: "Number of days lost due to work-related accidents or illnesses",
        lines: [
          { kind: "resultado", label: "2023 result", value: "897" },
          { kind: "resultado", label: "2024 result", value: "889" },
          {
            kind: "resultado",
            label: "2025 result",
            value: "1,490",
            note: "an increase associated with the slight rise in workplace accidents and the higher number of absence days resulting from the recorded incidents.",
          },
        ],
      },
      {
        id: "mortes-trabalho",
        name: "Fatalities resulting from work-related accidents",
        lines: [
          {
            kind: "resultado",
            label: "2025 result",
            value: "0",
            note: "the number of fatalities resulting from work-related accidents remained at zero.",
          },
        ],
      },
    ],
  },
  {
    id: "seguranca-rodoviaria",
    // official: "ROAD SAFETY " (in capitals, with a trailing space); set in title case, like the other
    // themes' titles
    title: "Road Safety",
    paragraphs: [
      // official: ends "…with us.&nbsp;" (a trailing non-breaking space)
      "Road safety is a core pillar for Patinter. We work continuously to ensure the highest safety standards for our employees and for everyone who shares the road with us.",
    ],
    indicatorsTitle: "Targets",
    indicators: [
      {
        id: "incidencia",
        name: "Road accident incidence rate",
        // the English page states no 2025 result for this indicator
        lines: [
          { kind: "base", label: "2024 baseline", value: "2.1 accidents per million kilometres" },
          {
            kind: "objetivo",
            label: "2030 target",
            value: "≤ 1.7 accidents per million kilometres",
            note: "a target focused on reducing road accidents by measuring the number of accidents against the total distance travelled.",
          },
        ],
      },
      {
        id: "mercadoria",
        name: "Number of cargo-related incidents attributable to Patinter",
        // the English page states no 2025 result for this indicator
        lines: [
          { kind: "base", label: "2024 baseline", value: "27" },
          {
            kind: "objetivo",
            label: "2030 target",
            value: "≤ 15",
            note: "the aim is to strengthen prevention and operational control while safeguarding the integrity of the goods transported.",
          },
        ],
      },
      {
        id: "mortos-estrada",
        name: "Number of fatalities in road accidents attributable to Patinter",
        // the English page states no target for this indicator
        lines: [
          { kind: "resultado", label: "2024 result", value: "0" },
          { kind: "resultado", label: "2025 result", value: "0", note: "maintaining the target of zero fatalities." },
        ],
      },
      {
        id: "feridos-graves",
        name: "Number of serious injuries in road accidents attributable to Patinter",
        // the English page states no target for this indicator
        lines: [
          { kind: "resultado", label: "2024 result", value: "0" },
          {
            kind: "resultado",
            label: "2025 result",
            value: "0",
            note: "maintaining the target of zero serious injuries, in line with the company’s culture of prevention and road safety.",
          },
        ],
      },
    ],
  },
  {
    id: "etica",
    title: "Ethics, Integrity and Human Rights",
    paragraphs: [],
    indicatorsTitle: "Targets",
    indicators: [
      {
        id: "infracoes",
        name: "Ethical, legal and operational breaches",
        lines: [
          // the English page says "2024 result" here (the Portuguese page: "Resultado 2025"); kept
          { kind: "resultado", label: "2024 result", value: "0" },
          {
            kind: "objetivo",
            label: "2030 target",
            value: "0",
            note: "maintaining a culture of integrity, compliance and adherence to applicable requirements.",
          },
        ],
      },
      {
        id: "discriminacao",
        name: "Incidents of discrimination, including harassment",
        lines: [
          {
            kind: "resultado",
            label: "2025 result",
            value: "0",
            note: "no incidents of discrimination or harassment were recorded during the reporting period.",
          },
        ],
      },
      {
        id: "direitos-humanos",
        name: "Human rights-related complaints/reports",
        lines: [
          {
            kind: "resultado",
            label: "2025 result",
            value: "0",
            note: "no complaints concerning these matters were received through internal channels or formal reporting mechanisms.",
          },
        ],
      },
      {
        id: "corrupcao",
        name: "Convictions or sanctions related to corruption and bribery",
        lines: [
          {
            kind: "resultado",
            label: "2025 result",
            value: "0",
            note: "no convictions, fines or financial sanctions related to corruption or bribery were recorded.",
          },
        ],
      },
    ],
    closing: {
      paragraph:
        "Patinter’s Code of Ethics is regularly reviewed to ensure that it remains up to date and continues to promote an ethical and sustainable leadership approach. The Code sets out the guidelines governing professional interactions and compliance with it is also mandatory for all prospective Patinter suppliers.",
      // the official link text runs over two source lines ("…Code of" / "Ethics and Conduct."), shown as
      // one; the official link is http:// (a document of its own, not the Portuguese one); the same
      // document over https
      link: {
        label: "Click to see the Patinter Code of Ethics and Conduct.",
        href: "https://drive.google.com/file/d/1i1nyuWpp-Q4cTYi6SSePC5QzbdY9DbHH/view?usp=sharing",
      },
    },
  },
];

/** The official page's last line. */
// official: "&nbsp;Last updated: September 2026" (a leading non-breaking space)
export const commitmentsUpdated: typeof pt.commitmentsUpdated = "Last updated: September 2026";

/** The official page's call to action, under the official menu group's name. */
export const commitmentsContact: typeof pt.commitmentsContact = {
  label: "Contacts",
  link: { label: "Contact us", href: "https://www.patinter.com/en/gca/index.php?id=48" },
};
