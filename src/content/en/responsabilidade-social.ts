// English copy of the "Company > Sustainability > Corporate Social Responsibility" page
// (/sustentabilidade/responsabilidade-social), the counterpart of content/responsabilidade-social.ts.
// Source: the official English page, https://www.patinter.com/en/gca/index.php?id=32 (read 2026-11-24).
// Every word is the official one, in the official order; a few evident typos are fixed, each with a
// comment holding the official spelling: a stray full stop, two quotations opened with a straight
// quote and closed with a curly one, and the few straight apostrophes among the page's curly ones.
// The ids are the Portuguese file's (the page's keys for anchors and photos). The English page is not
// a translation of the Portuguese one paragraph for paragraph: its introduction is another text, in
// two paragraphs, and some chapters have more paragraphs; each follows the English page.

import type * as pt from "@/content/responsabilidade-social";

/** The page's place in the official menu ("Company" › "Sustainability"). */
export const socialPlace: typeof pt.socialPlace = { group: "Company", page: "Sustainability" };

/**
 * The official H1, and its introduction. The official page sets the introduction as two paragraphs;
 * here the first is the opening's lead and the second opens the page's body, under it.
 */
export const socialOpening: typeof pt.socialOpening = {
  title: "Corporate Social Responsibility",
  titleLines: ["Corporate", "Social", "Responsibility"],
  // official: "the company's values" (a straight apostrophe)
  lead: "Patinter believes that citizenship and social responsibility are an important asset for the company. Its activities in this area are oriented towards the promotion of activities that cover the surrounding community, stakeholders and employees, transmitting them the importance of the sense of freedom, justice, dignity and solidarity, which are also part of the company’s values.",
  statement:
    "Patinter attaches a high importance to all activities within its corporate social responsibility policy and as an organization aims to make a positive contribution to Society, Economy and Environment. An example of this is the Patinter Cares programme, which consists of a set of welfare, education, culture, sports, volunteer work and social solidarity actions with target audiences.",
};

// Each commitment: `title` is the official heading; `short` is the same heading without the
// "Commitment to" every one of them starts with (WellCare's: without its "Commitment"), the page's index.
export const socialCommitments: typeof pt.socialCommitments = [
  {
    id: "educacao",
    // official: "Commitment to Education, Science and Innovation." (a full stop after the heading)
    title: "Commitment to Education, Science and Innovation",
    short: "Education, Science and Innovation",
    paragraphs: [
      "Knowledge is a driving force of progress, and at Patinter we support projects that promote education, science and innovation as pillars of sustainable development.",
      "Our partnership with the Academi@ STEM Mangualde reflects this commitment. Through organised study visits, we give students the opportunity to gain direct insight into the transport and logistics sector. During these visits, they explore topics such as the geography of freight transport, water management and reuse, energy efficiency, road safety and the repurposing of used tyres.",
      "The visits also include a stop at our wastewater treatment plant (ETAR) and a short lorry ride within our facilities — an educational, hands-on and inspiring experience.",
      "Beyond this initiative, Patinter also supports applied research projects, technology development centres and programmes that strengthen the link between the business sector and academia. We collaborate with universities, innovation hubs and regional institutions that promote critical thinking, scientific literacy and the development of sustainable solutions, helping to build skills among the next generation.",
    ],
  },
  {
    id: "desporto",
    title: "Commitment to Sport, Training, and Community",
    short: "Sport, Training, and Community",
    paragraphs: [
      "We believe that sport is a driving force for personal and social growth. That’s why we invest in sports projects that stand out for their organisation, innovation, and positive impact. From roller hockey to football, our collaboration extends across the country, promoting not only sports participation but also a culture of excellence and continuous development.",
      "We particularly value partnerships with training schools located in the interior of the country, especially those situated close to our facilities. By supporting these institutions, we recognise their crucial role in nurturing young talent and strengthening local communities. This strategic alignment enables us not only to boost sports development but also to reinforce our commitment to social responsibility, contributing to the sustainable progress of the regions in which we operate.",
      "Our commitment goes beyond financial support; it involves creating conditions that promote access to sport, well-being, and education for young people. Through these initiatives, we aim to cultivate values such as discipline, teamwork, and resilience, which are essential for success both in sport and in life.",
    ],
  },
  {
    id: "cultura",
    title: "Commitment to Culture and Artistic Expression",
    short: "Culture and Artistic Expression",
    // the official page sets the play's title, Viajantes Solitários, in italics (these are plain strings)
    paragraphs: [
      "We recognise culture as an essential element of social and human development. That’s why we support initiatives that foster artistic creation, democratise access to culture, and encourage the emergence of new talent.",
      "Our commitment is reflected in our support for a wide range of cultural expressions — from theatre to circus, from cinema to the visual arts. Through strategic partnerships, we invest in projects that enrich cultural production and strengthen the connection between art and community.",
      // official: `("Lone Travellers”)` (opened with a straight quote, closed with a curly one)
      "In 2015, in collaboration with Teatro Viriato — of which we are patrons — and Teatro do Vestido, we presented the play Viajantes Solitários (“Lone Travellers”), a unique production that gives voice to the life stories of lorry drivers. Based on carefully gathered testimonies, this piece transformed personal experiences into poetic drama, offering a deep and sensitive portrayal of lives shaped by constant movement.",
      "The performance captures the essence of a life lived across kilometres of distance, transient nights, and an intimate knowledge of roads, motorways, roadside restaurants, and temporary lodgings.",
      "More than a narrative about physical displacement, Viajantes Solitários is a portrait of Portuguese restlessness: the desire to leave, the longing to return, and the relentless need to keep moving forward.",
    ],
  },
  {
    id: "wellcare",
    title: "WellCare Commitment – Wellbeing and Quality of Life",
    short: "WellCare – Wellbeing and Quality of Life",
    paragraphs: [
      "The WellCare Project, developed by Patinter, was created to promote the overall wellbeing of our employees, aligning health, balance and satisfaction. With this programme, we aim to provide a safe, healthy and inspiring working environment, where each employee feels valued and in harmony with their personal and professional goals.",
      // official: `— "a state of … infirmity” —` (opened with a straight quote, closed with a curly one)
      "Inspired by the World Health Organization’s definition of health — “a state of complete physical, mental and social wellbeing, and not merely the absence of disease or infirmity” — WellCare embraces a holistic approach to each individual. Our commitment is to support employees in an ongoing process of life enhancement, by encouraging healthy habits, positive behaviours and attitudes that help unlock their full potential.",
    ],
    areas: {
      intro: "The project is structured around four key areas of action:",
      // official: each area's name in bold, followed by a colon ("Curative and Preventive Health: Ensuring…")
      items: [
        { name: "Curative and Preventive Health", text: "Ensuring the necessary care to prevent illness and support recovery when needed." },
        { name: "Ergonomics and Physiotherapy", text: "Implementing solutions that improve posture and comfort in the workplace, reducing the risk of injury." },
        { name: "Workplace Exercise", text: "Promoting targeted exercises to relieve tension and improve wellbeing throughout the working day." },
        { name: "Psychology and Nutrition", text: "Providing emotional support and dietary guidance to foster a healthy, balanced lifestyle." },
      ],
      outro:
        "These focus areas have been carefully selected to ensure that each employee has access to resources and tools that support a higher quality of life — both professionally and personally.",
    },
  },
  {
    id: "solidariedade",
    title: "Commitment to Solidarity",
    short: "Solidarity",
    paragraphs: [
      "We believe that the true success of a company is not measured solely by financial results, but by the positive impact it generates in society. Guided by this principle, we lead and participate in a variety of social solidarity projects, taking an active role in supporting institutions and causes that promote human dignity and wellbeing.",
    ],
    subsections: [
      {
        title: "Supporting Children and the Elderly – Caring for the Most Vulnerable",
        paragraphs: [
          "Recognising the importance of caring for the most vulnerable, Patinter has established strategic partnerships with childcare institutions and care homes for the elderly. These collaborations allow us to contribute to social inclusion by providing resources and support that improve the quality of life for children and seniors facing vulnerability, abandonment or isolation.",
        ],
      },
      {
        title: "Volunteer Firefighters – Supporting Community Protection",
        paragraphs: [
          "Fully aware of the vital role played by volunteer fire brigades, Patinter offers maintenance and logistical support to ensure these teams can continue protecting our communities efficiently and safely.",
        ],
      },
      {
        title: "Local Associations – Strengthening Communities",
        paragraphs: [
          "Our social responsibility goes beyond major partnerships. We actively collaborate with grassroots associations that make a difference on the ground, supporting projects in social inclusion, education, health, culture and sport. These initiatives help to strengthen the social fabric, foster solidarity and build stronger, more cohesive communities.",
        ],
      },
    ],
  },
  {
    id: "seguranca-rodoviaria",
    title: "Commitment to Road Safety",
    short: "Road Safety",
    paragraphs: [
      "Road safety is at the heart of Patinter’s identity.",
      "As one of Europe’s leading players in the transport sector, Patinter embraces road safety not merely as a set of measures, but as a deeply rooted culture — a mindset that shapes our daily operations. We are constantly assessing our performance and seeking initiatives that help reduce both the frequency and severity of road accidents. Our commitment is clear: to protect what matters most — the lives and wellbeing of our employees and all those who share the road with them.",
      "This investment in safety has consistently proven to be a successful strategy. Over the years, we have seen a steady decline in accidents and related costs, reinforcing the credibility of the service we provide and strengthening the trust placed in us by clients, partners and the wider community.",
    ],
    // official: opened with a straight quote and closed with a curly one; the page sets both
    quote:
      "We believe that implementing a Road Traffic Safety Management System, and achieving ISO 39001 certification, allows us to formalise and structure this commitment. It also sets an example for others in the industry. We strive to make a positive contribution to the image of the transport sector by promoting a safety-first culture and elevating the value of the professional driver.",
    // the official list numbers its items in the text ("1) …", "2) …"); the page numbers them itself.
    // Items 4, 9 and 10 end without the semicolon the others have: as on the official page.
    steps: {
      intro: "Measures and actions:",
      items: [
        "Development of a diagnosis to verify the existing practices and procedures in the company (e.g. timely preventive maintenance, purchase of vehicles with driving support systems, etc.) and preparation of the respective report;",
        "Revision of the system documentation in accordance with ISO 39001;",
        "Creation of a Safety Committee to monitor, analyse and discuss road accidents and hold meetings;",
        "Adoption of a detailed investigation procedure for road accidents and the drafting of a model Accident Investigation Report (including an Action Plan)",
        "Initial and continuous training in Road Accidents and Safety, Defensive Driving, Cargo Securing, Safety and Health at Work;",
        "Establishment of a Road Emergency Plan to guarantee response in the event of a road accident - holding a road accident drill to test emergency response;",
        "Measures to increase the field of vision while driving and reduce and signpost blind spots - placing of angle film to widen the field of vision, placing of blind spot signposting stickers (French legislation), creation of mirror adjustment guide;",
        // official: "the learner driver's driving style", "the learner's profile" (straight apostrophes)
        "Revision of the practical initial training procedure (test drive) and assessment of the learner driver’s driving style - analysis of the learner’s profile according to defined criteria;",
        "Reduction in the maximum speed limitation of vehicles - setting the speed limiter at 88km/h instead of 90km/h",
        "Information campaigns",
        "Recognition of drivers with zero accidents.",
      ],
    },
  },
];

/** The official page's call to action (as on the other pages), under the official menu group's name. */
export const socialContact: typeof pt.socialContact = {
  label: "Contacts",
  link: { label: "Contact us", href: "https://www.patinter.com/en/gca/index.php?id=48" },
};
