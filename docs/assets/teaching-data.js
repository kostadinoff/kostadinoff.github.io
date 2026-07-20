/* ============================================================================
   Teaching materials — single source of truth
   ----------------------------------------------------------------------------
   Shape:

     TEACHING_DATA = {
       updated: "YYYY-MM-DD",
       disciplines: [
         {
           id:    "slug",                    // stable, used in URLs (#slug)
           title: "Discipline name",
           blurb: "One sentence describing the discipline.",
           languages: [
             {
               code:  "en" | "bg",           // any code is allowed
               label: "English",
               years: [
                 {
                   id:    "2025-2026",       // unique within the language
                   label: "2025/2026",       // the academic year — the only
                                             // level between language and
                                             // the two collections
                   note:  "optional line shown under the heading",
                   lectures: [ item, ... ],  // lecture slides
                   handouts: [ item, ... ]   // student handouts
                 }
               ]
             }
           ]
         }
       ]
     }

   An `item` is:

     {
       title:       "Class 1 — Definition and Scope",
       description: "What the material covers.",
       tags:        ["demography", "colloquium"],
       date:        "2025-09-30",     // upload / publication date
       version:     "1.0",            // bump when you replace the file
       files:       [ { label: "Slides (PDF)", href: "path/to.pdf", kind: "pdf" } ],
       links:       [ { label: "NotebookLM", href: "https://..." } ]   // optional
     }

   Academic years
   --------------
   The academic year is the only grouping between a language and the two
   collections — there is deliberately no "year of study" level. The page has
   an academic-year selector which opens on the most recent year that actually
   has materials, so nothing goes stale in September.

   To publish 2026/2027 materials, add a new block with label "2026/2027"
   *alongside* the 2025/2026 one. Do not delete the old block: past cohorts
   stay browsable as an archive, and that is the point.

   Adding material = adding an object here. Nothing else needs to change:
   search, filtering, counts, and ordering are all derived at runtime.
   ========================================================================== */

window.TEACHING_DATA = {
  updated: "2026-07-20",

  /* The year currently being taught. Used only for labelling — the filter
     itself opens on the newest academic year that has materials. */
  currentAcademicYear: "2026/2027",

  disciplines: [
    /* ---------------------------------------------------------------- */
    {
      id: "social-medicine",
      title: "Social medicine",
      blurb:
        "Practical classes for medical students: determinants of health, demography, health systems, and the organisation of care.",
      languages: [
        {
          code: "en",
          label: "English",
          years: [
            {
              id: "2025-2026",
              label: "2025/2026",
              note: "Practical classes for the English-language medical programme.",
              lectures: [
                {
                  title: "Class 1 · Social medicine — definition and scope",
                  description:
                    "What social medicine studies, how it differs from clinical medicine, and the place of population thinking in practice.",
                  tags: ["introduction", "scope"],
                  date: "2025-09-29",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "2025-2026-classes/practical-class-01.pdf", kind: "pdf" }]
                },
                {
                  title: "Class 2 · Methods for sociological research in medicine",
                  description:
                    "Survey design, sampling, interviewing, and the interpretation of sociological data in health research.",
                  tags: ["methods", "surveys", "research design"],
                  date: "2025-10-06",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "2025-2026-classes/practical-class-02.pdf", kind: "pdf" }]
                },
                {
                  title: "Class 3 · Demography indices",
                  description:
                    "Natality, mortality, natural increase, fertility and life expectancy — how they are computed and what they mean.",
                  tags: ["demography", "indicators"],
                  date: "2025-10-13",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "2025-2026-classes/practical-class-03.pdf", kind: "pdf" }]
                },
                {
                  title: "Class 4 · Risk factors and causality. Measurement of disease and exposure",
                  description:
                    "Prevalence and incidence, measures of association, and the criteria used to argue from association to cause.",
                  tags: ["epidemiology", "causality", "risk"],
                  date: "2025-10-20",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "2025-2026-classes/practical-class-04.pdf", kind: "pdf" }]
                },
                {
                  title: "Class 5 · Burden of disease — medico-social aspects",
                  description:
                    "DALYs, YLL and YLD, and how burden-of-disease estimates are used to set health priorities.",
                  tags: ["burden of disease", "DALY", "priorities"],
                  date: "2025-10-27",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "2025-2026-classes/practical-class-05.pdf", kind: "pdf" }]
                },
                {
                  title: "Class 6 · Primary health care. Outpatient care. GP functions",
                  description:
                    "The structure of primary care, the gatekeeping role of the general practitioner, and outpatient service organisation.",
                  tags: ["primary care", "health systems"],
                  date: "2025-11-03",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "2025-2026-classes/practical-class-06.pdf", kind: "pdf" }]
                },
                {
                  title: "Class 7 · Hospital care — functions, structure, organisation, quality",
                  description:
                    "Hospital typology and financing, bed-use indicators, and approaches to measuring quality of care.",
                  tags: ["hospital care", "quality", "health systems"],
                  date: "2025-11-10",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "2025-2026-classes/practical-class-07.pdf", kind: "pdf" }]
                },
                {
                  title: "Class 8 · Dispensary method. Occupational medicine",
                  description:
                    "Systematic follow-up of chronic patients, and the recognition and prevention of occupational disease.",
                  tags: ["prevention", "occupational health"],
                  date: "2025-11-17",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "2025-2026-classes/practical-class-08.pdf", kind: "pdf" }]
                },
                {
                  title: "Class 9 · Expert evaluation of temporary incapacity for work",
                  description:
                    "Sick leave, the medical expert committees, and the documentation a treating physician is responsible for.",
                  tags: ["incapacity", "legislation"],
                  date: "2025-11-24",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "2025-2026-classes/practical-class-09.pdf", kind: "pdf" }]
                },
                {
                  title: "Class 10 · Physician's liability. Social history of the patient",
                  description:
                    "Forms of professional liability and how to take a structured social history.",
                  tags: ["liability", "social history"],
                  date: "2025-12-01",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "2025-2026-classes/practical-class-10.pdf", kind: "pdf" }]
                },
                {
                  title: "Class 12 · Maternal and child health. Family planning",
                  description:
                    "Maternal and infant mortality, antenatal care, and family planning services.",
                  tags: ["maternal health", "child health"],
                  date: "2025-12-15",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "2025-2026-classes/practical-class-12.pdf", kind: "pdf" }]
                },
                {
                  title: "Class 13 · Health culture and health behaviour. Health education",
                  description:
                    "Models of health behaviour and the design of health-education interventions.",
                  tags: ["health promotion", "behaviour"],
                  date: "2026-01-12",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "2025-2026-classes/practical-class-13.pdf", kind: "pdf" }]
                },
                {
                  title: "Class 14 · Public health planning, economy, and marketing",
                  description:
                    "Planning cycles, health financing, basic health economics, and social marketing of health services.",
                  tags: ["health economics", "planning"],
                  date: "2026-01-19",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "2025-2026-classes/practical-class-14.pdf", kind: "pdf" }]
                }
              ],
              handouts: [
                {
                  title: "Class 11 · Colloquium — protocol and assessment guidelines",
                  description:
                    "How the colloquium is run, what is assessed, and how the marks are formed.",
                  tags: ["colloquium", "assessment"],
                  date: "2025-12-08",
                  version: "1.0",
                  files: [{ label: "Handout (PDF)", href: "2025-2026-classes/practical-class-11.pdf", kind: "pdf" }]
                },
                {
                  title: "Class 15 · Seminar review — social medicine with medical ethics",
                  description:
                    "End-of-course revision handout covering the full seminar programme.",
                  tags: ["revision", "exam"],
                  date: "2026-01-26",
                  version: "1.0",
                  files: [{ label: "Handout (PDF)", href: "2025-2026-classes/practical-class-15.pdf", kind: "pdf" }]
                }
              ]
            }
          ]
        },
        {
          code: "bg",
          label: "Български",
          years: [
            {
              id: "2025-2026",
              label: "2025/2026",
              note: "Материали за практическите занятия по социална медицина.",
              lectures: [
                {
                  title: "Занятие 1 · Социалната медицина като наука",
                  description: "Предмет, методи и място на социалната медицина сред медицинските науки.",
                  tags: ["въведение"],
                  date: "2025-09-29",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/social-medicine-bg/practical-class-01.pdf", kind: "pdf" }]
                },
                {
                  title: "Занятие 2 · Социологични методи",
                  description: "Анкетни проучвания, извадки, интервю и анализ на социологични данни в медицината.",
                  tags: ["методи", "анкети"],
                  date: "2025-10-06",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/social-medicine-bg/practical-class-02.pdf", kind: "pdf" }]
                },
                {
                  title: "Занятие 3 · Медицинска демография",
                  description: "Раждаемост, смъртност, естествен прираст и средна продължителност на живота.",
                  tags: ["демография", "показатели"],
                  date: "2025-10-13",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/social-medicine-bg/practical-class-03.pdf", kind: "pdf" }]
                },
                {
                  title: "Занятие 4 · Приложна епидемиология — I част",
                  description: "Измерване на заболяемост и болестност; описателни епидемиологични проучвания.",
                  tags: ["епидемиология"],
                  date: "2025-10-20",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/social-medicine-bg/practical-class-04.pdf", kind: "pdf" }]
                },
                {
                  title: "Занятие 5 · Приложна епидемиология — II част",
                  description: "Аналитични дизайни, мерки за асоциация и причинно-следствена интерпретация.",
                  tags: ["епидемиология", "причинност"],
                  date: "2025-10-27",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/social-medicine-bg/practical-class-05.pdf", kind: "pdf" }]
                },
                {
                  title: "Занятие 6 · Здравно законодателство. Първична медицинска помощ",
                  description: "Нормативна рамка на здравеопазването и организация на първичната извънболнична помощ.",
                  tags: ["законодателство", "първична помощ"],
                  date: "2025-11-03",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/social-medicine-bg/practical-class-06.pdf", kind: "pdf" }]
                },
                {
                  title: "Занятие 7 · Болнична медицинска помощ",
                  description: "Видове лечебни заведения, показатели за използване на леглата и качество на болничната помощ.",
                  tags: ["болнична помощ", "качество"],
                  date: "2025-11-10",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/social-medicine-bg/practical-class-07.pdf", kind: "pdf" }]
                },
                {
                  title: "Занятие 8 · Превантивна медицина. Диспансерен метод",
                  description: "Нива на профилактика и диспансерно наблюдение на хронично болни.",
                  tags: ["профилактика"],
                  date: "2025-11-17",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/social-medicine-bg/practical-class-08.pdf", kind: "pdf" }]
                },
                {
                  title: "Занятие 9 · Експертиза на неработоспособността. Трудова медицина",
                  description: "Временна и трайна неработоспособност, ТЕЛК/НЕЛК и професионални болести.",
                  tags: ["експертиза", "трудова медицина"],
                  date: "2025-11-24",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/social-medicine-bg/practical-class-09.pdf", kind: "pdf" }]
                },
                {
                  title: "Занятие 10 · Правна отговорност на лекаря",
                  description: "Видове юридическа отговорност и медико-правни казуси.",
                  tags: ["отговорност", "право"],
                  date: "2025-12-01",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/social-medicine-bg/practical-class-10.pdf", kind: "pdf" }]
                },
                {
                  title: "Занятие 12 · Семейство и здраве",
                  description: "Семейството като социална детерминанта на здравето.",
                  tags: ["семейство", "детерминанти"],
                  date: "2025-12-15",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/social-medicine-bg/practical-class-12.pdf", kind: "pdf" }]
                },
                {
                  title: "Занятие 13 · Здравно поведение, възпитание и просвета",
                  description: "Модели на здравно поведение и методи на здравна промоция.",
                  tags: ["здравна промоция", "поведение"],
                  date: "2026-01-12",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/social-medicine-bg/practical-class-13.pdf", kind: "pdf" }]
                },
                {
                  title: "Занятие 14 · Здравен мениджмънт, маркетинг и икономика",
                  description: "Планиране, финансиране и маркетинг на здравните услуги.",
                  tags: ["мениджмънт", "икономика"],
                  date: "2026-01-19",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/social-medicine-bg/practical-class-14.pdf", kind: "pdf" }]
                },
                {
                  title: "Занятие 15 · Майчино и детско здравеопазване",
                  description: "Майчина и детска смъртност, антенатални грижи и семейно планиране.",
                  tags: ["майчино здраве", "детско здраве"],
                  date: "2026-01-26",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/social-medicine-bg/practical-class-15.pdf", kind: "pdf" }]
                }
              ],
              handouts: [
                {
                  title: "Социална анамнеза · Указания за снемане",
                  description: "Структуриран формуляр и указания за снемане на социална анамнеза.",
                  tags: ["социална анамнеза", "практикум"],
                  date: "2025-12-01",
                  version: "1.0",
                  files: [{ label: "Материал (PDF)", href: "slides/social-medicine-bg/social-anamnesis.pdf", kind: "pdf" }]
                },
                {
                  title: "Колоквиум · Въпроси и формат",
                  description: "Конспект, формат на колоквиума и критерии за оценяване.",
                  tags: ["колоквиум", "оценяване"],
                  date: "2025-12-08",
                  version: "1.0",
                  files: [{ label: "Материал (PDF)", href: "slides/social-medicine-bg/colloquium.pdf", kind: "pdf" }]
                }
              ]
            }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      id: "medical-ethics",
      title: "Medical ethics",
      blurb:
        "Principles, case discussions and seminar tests taught alongside social medicine.",
      languages: [
        {
          code: "en",
          label: "English",
          years: [
            {
              id: "2025-2026",
              label: "2025/2026",
              note: "Practical class handouts and case discussions in medical ethics.",
              lectures: [
                {
                  title: "Practical 1 · Ethics — definition and principles",
                  description: "The four principles, their conflicts, and how they are applied at the bedside.",
                  tags: ["principles", "introduction"],
                  date: "2025-09-29",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "slides/ethics-en/01-principles.pdf", kind: "pdf" }]
                },
                {
                  title: "Practical 2 · Informed consent",
                  description: "Capacity, disclosure, voluntariness, and consent in vulnerable populations.",
                  tags: ["consent", "autonomy"],
                  date: "2025-10-06",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "slides/ethics-en/02-informed-consent.pdf", kind: "pdf" }]
                },
                {
                  title: "Practical 3 · Confidentiality",
                  description: "Medical secrecy, its legal limits, and disclosure in the public interest.",
                  tags: ["confidentiality", "privacy"],
                  date: "2025-10-13",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "slides/ethics-en/03-confidentiality.pdf", kind: "pdf" }]
                },
                {
                  title: "Practical 4 · Patient–physician relationship",
                  description: "Models of the therapeutic relationship, paternalism, and shared decision-making.",
                  tags: ["relationship", "communication"],
                  date: "2025-10-20",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "slides/ethics-en/04-physician-patient.pdf", kind: "pdf" }]
                },
                {
                  title: "Practical 5 · End-of-life issues. Euthanasia and assisted suicide",
                  description: "Withdrawal of treatment, palliative sedation, and the euthanasia debate.",
                  tags: ["end of life", "euthanasia"],
                  date: "2025-10-27",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "slides/ethics-en/05-end-of-life.pdf", kind: "pdf" }]
                },
                {
                  title: "Practicals 6–7 · Organ transplantation. Reproductive ethics",
                  description: "Donation and allocation of organs; assisted reproduction and its ethical limits.",
                  tags: ["transplantation", "reproduction"],
                  date: "2025-11-03",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "slides/ethics-en/06-transplantation-reproduction.pdf", kind: "pdf" }]
                },
                {
                  title: "Lecture · Ethical aspects of human reproduction",
                  description: "Extended lecture on reproductive technologies, surrogacy, and prenatal decisions.",
                  tags: ["reproduction", "lecture"],
                  date: "2025-11-10",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "slides/ethics-en/07-reproduction.pdf", kind: "pdf" }]
                }
              ],
              handouts: [
                {
                  title: "Cases 2 · Informed consent",
                  description: "Case set for the informed-consent seminar.",
                  tags: ["cases", "consent"],
                  date: "2025-10-06",
                  version: "1.0",
                  files: [{ label: "Cases (PDF)", href: "slides/ethics-en/02-cases.pdf", kind: "pdf" }]
                },
                {
                  title: "Cases 3 · Confidentiality",
                  description: "Case set on medical secrecy and its limits.",
                  tags: ["cases", "confidentiality"],
                  date: "2025-10-13",
                  version: "1.0",
                  files: [{ label: "Cases (PDF)", href: "slides/ethics-en/03-cases.pdf", kind: "pdf" }]
                },
                {
                  title: "Cases 4 · Patient–physician relationship",
                  description: "Case set on communication, truth-telling, and shared decisions.",
                  tags: ["cases", "relationship"],
                  date: "2025-10-20",
                  version: "1.0",
                  files: [{ label: "Cases (PDF)", href: "slides/ethics-en/04-cases.pdf", kind: "pdf" }]
                },
                {
                  title: "Cases 5 · End-of-life issues",
                  description: "Case set on withdrawal of treatment and end-of-life decisions.",
                  tags: ["cases", "end of life"],
                  date: "2025-10-27",
                  version: "1.0",
                  files: [{ label: "Cases (PDF)", href: "slides/ethics-en/05-cases.pdf", kind: "pdf" }]
                },
                {
                  title: "Cases 6–7 · Transplantation and reproduction",
                  description: "Case set on organ donation, allocation, and reproductive ethics.",
                  tags: ["cases", "transplantation", "reproduction"],
                  date: "2025-11-03",
                  version: "1.0",
                  files: [{ label: "Cases (PDF)", href: "slides/ethics-en/06-cases.pdf", kind: "pdf" }]
                },
                {
                  title: "Seminar test · Sample test",
                  description: "Sample seminar test with the format used in assessment.",
                  tags: ["assessment", "sample test"],
                  date: "2025-11-17",
                  version: "1.0",
                  files: [{ label: "Test (PDF)", href: "slides/ethics-en/07-seminar-test.pdf", kind: "pdf" }]
                }
              ]
            }
          ]
        },
        {
          code: "bg",
          label: "Български",
          years: [
            {
              id: "2025-2026",
              label: "2025/2026",
              note: "Материали за упражнения и казуси по медицинска етика.",
              lectures: [
                {
                  title: "Лекция · Въведение в медицинската етика",
                  description: "Основни принципи, история и предмет на медицинската етика.",
                  tags: ["въведение", "лекция"],
                  date: "2025-09-29",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/ethics-bg/01-intro.pdf", kind: "pdf" }]
                },
                {
                  title: "Упражнение 1 · Информирано съгласие. Медицинска тайна",
                  description: "Дееспособност, информиране, доброволност и граници на медицинската тайна.",
                  tags: ["съгласие", "тайна"],
                  date: "2025-10-06",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/ethics-bg/01-principles.pdf", kind: "pdf" }]
                },
                {
                  title: "Упражнение 2 · Взаимоотношения лекар–пациент",
                  description: "Модели на терапевтичното взаимоотношение и споделено вземане на решения.",
                  tags: ["комуникация"],
                  date: "2025-10-13",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/ethics-bg/02-patient-physician.pdf", kind: "pdf" }]
                },
                {
                  title: "Упражнения 3–4 · Хронично болни и терминални пациенти",
                  description: "Грижа за хронично болни, палиативни грижи и решения в края на живота.",
                  tags: ["край на живота", "палиативни грижи"],
                  date: "2025-10-27",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/ethics-bg/03-chronic-disease.pdf", kind: "pdf" }]
                },
                {
                  title: "Упражнения 5–6 · Трансплантация. Експериментална медицина",
                  description: "Донорство и разпределение на органи; етика на медицинския експеримент.",
                  tags: ["трансплантация", "изследвания"],
                  date: "2025-11-03",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/ethics-bg/05-transplantation.pdf", kind: "pdf" }]
                },
                {
                  title: "Упражнение 7 · Репродуктивна етика",
                  description: "Асистирана репродукция, сурогатство и пренатални решения.",
                  tags: ["репродукция"],
                  date: "2025-11-10",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/ethics-bg/06-reproduction.pdf", kind: "pdf" }]
                }
              ],
              handouts: [
                {
                  title: "Казуси 1 · Информирано съгласие",
                  description: "Казуси за упражнението по информирано съгласие.",
                  tags: ["казуси", "съгласие"],
                  date: "2025-10-06",
                  version: "1.0",
                  files: [{ label: "Казуси (PDF)", href: "slides/ethics-bg/01-cases.pdf", kind: "pdf" }]
                },
                {
                  title: "Казуси 2 · Взаимоотношения лекар–пациент",
                  description: "Казуси за комуникацията и доверието в лекарската практика.",
                  tags: ["казуси", "комуникация"],
                  date: "2025-10-13",
                  version: "1.0",
                  files: [{ label: "Казуси (PDF)", href: "slides/ethics-bg/02-cases.pdf", kind: "pdf" }]
                },
                {
                  title: "Казуси 3–4 · Клинични казуси",
                  description: "Казуси при хронично болни и терминални пациенти.",
                  tags: ["казуси", "край на живота"],
                  date: "2025-10-27",
                  version: "1.0",
                  files: [{ label: "Казуси (PDF)", href: "slides/ethics-bg/03-cases.pdf", kind: "pdf" }]
                },
                {
                  title: "Казуси 5–6 · Трансплантация и експериментална медицина",
                  description: "Казуси по донорство, разпределение на органи и клинични изпитвания.",
                  tags: ["казуси", "трансплантация"],
                  date: "2025-11-03",
                  version: "1.0",
                  files: [{ label: "Казуси (PDF)", href: "slides/ethics-bg/05-cases.pdf", kind: "pdf" }]
                },
                {
                  title: "Материал · Наука и етика — експериментална медицина",
                  description: "Допълнителен материал за етичната регулация на медицинските изследвания.",
                  tags: ["изследвания", "материал"],
                  date: "2025-11-03",
                  version: "1.0",
                  files: [{ label: "Материал (PDF)", href: "slides/ethics-bg/06-science-ethics.pdf", kind: "pdf" }]
                },
                {
                  title: "Казуси · Експериментална медицина",
                  description: "Казуси по етика на медицинския експеримент.",
                  tags: ["казуси", "изследвания"],
                  date: "2025-11-03",
                  version: "1.0",
                  files: [{ label: "Казуси (PDF)", href: "slides/ethics-bg/06-cases.pdf", kind: "pdf" }]
                },
                {
                  title: "Пробен тест · СММЕ — I част (медицинска етика)",
                  description: "Примерен вариант на теста по медицинска етика.",
                  tags: ["тест", "оценяване"],
                  date: "2025-11-17",
                  version: "1.0",
                  files: [{ label: "Тест (PDF)", href: "slides/ethics-bg/07-seminar-test.pdf", kind: "pdf" }]
                }
              ]
            }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      id: "biostatistics",
      title: "Biostatistics",
      blurb:
        "Medical statistics practicals: descriptive measures, hypothesis testing, association, and regression.",
      languages: [
        {
          code: "bg",
          label: "Български",
          years: [
            {
              id: "2025-2026",
              label: "2025/2026",
              note: "Упражнения, формули и домашни работи по медицинска статистика.",
              lectures: [
                {
                  title: "Упражнение 1 · Основна терминология. Стандартизация",
                  description: "Видове променливи, честотни разпределения и пряка стандартизация.",
                  tags: ["терминология", "стандартизация"],
                  date: "2025-09-29",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/statistics-bg/01-terminology-standardization.pdf", kind: "pdf" }]
                },
                {
                  title: "Упражнение 2 · Дескриптивна и инферентна статистика",
                  description: "Мерки за централна тенденция и разсейване; доверителни интервали.",
                  tags: ["дескриптивна статистика", "доверителни интервали"],
                  date: "2025-10-06",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/statistics-bg/02-descriptive.pdf", kind: "pdf" }]
                },
                {
                  title: "Упражнение 3 · Тест на хипотези. T-тест",
                  description: "Нулева и алтернативна хипотеза, ниво на значимост, приложения на t-теста.",
                  tags: ["хипотези", "t-тест"],
                  date: "2025-10-13",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/statistics-bg/03-t-test.pdf", kind: "pdf" }]
                },
                {
                  title: "Упражнения 4–5 · Изследване на връзки. Корелация. Асоциация",
                  description: "Корелационен анализ, хи-квадрат и мерки за асоциация.",
                  tags: ["корелация", "асоциация"],
                  date: "2025-10-27",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/statistics-bg/04-05-association-correlation.pdf", kind: "pdf" }]
                },
                {
                  title: "Упражнение 6 · Регресионен анализ. Линейна регресия",
                  description: "Прост линеен регресионен модел, интерпретация на коефициентите и допускания.",
                  tags: ["регресия"],
                  date: "2025-11-10",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/statistics-bg/06-regression.pdf", kind: "pdf" }]
                }
              ],
              handouts: [
                {
                  title: "Материал · Правило на трите сигми",
                  description: "Кратък материал за нормалното разпределение и правилото на трите сигми.",
                  tags: ["нормално разпределение", "материал"],
                  date: "2025-10-27",
                  version: "1.0",
                  files: [{ label: "Материал (PDF)", href: "slides/statistics-bg/05-rule-of-3-sigma.pdf", kind: "pdf" }]
                },
                {
                  title: "Формули · Основни формули по медицинска статистика",
                  description: "Справочник с формулите, използвани в упражненията и на колоквиума.",
                  tags: ["формули", "справочник"],
                  date: "2025-09-29",
                  version: "2025",
                  files: [{ label: "Формули (PDF)", href: "slides/statistics-bg/formulas-2025.pdf", kind: "pdf" }]
                },
                {
                  title: "Сборник · Упражнения по статистика",
                  description: "Пълен комплект задачи към всички упражнения.",
                  tags: ["сборник", "задачи"],
                  date: "2025-09-29",
                  version: "1.0",
                  files: [{ label: "Сборник (PDF)", href: "slides/statistics-bg/exercises-workbook.pdf", kind: "pdf" }]
                },
                {
                  title: "Колоквиум · Решен примерен вариант",
                  description: "Примерен вариант на колоквиума с подробни решения.",
                  tags: ["колоквиум", "решения"],
                  date: "2025-11-24",
                  version: "1.0",
                  files: [{ label: "Вариант (PDF)", href: "slides/statistics-bg/colloquium-solved.pdf", kind: "pdf" }]
                },
                {
                  title: "Домашна 1 · Стандартизация",
                  description: "Домашна работа по пряка стандартизация на показатели.",
                  tags: ["домашна работа", "стандартизация"],
                  date: "2025-09-29",
                  version: "1.0",
                  files: [{ label: "Задание (PDF)", href: "slides/statistics-bg/homework-01.pdf", kind: "pdf" }]
                },
                {
                  title: "Домашна 2 · Дескриптивна статистика",
                  description: "Домашна работа с изчисляване на описателни характеристики.",
                  tags: ["домашна работа", "дескриптивна статистика"],
                  date: "2025-10-06",
                  version: "1.0",
                  files: [{ label: "Задание (PDF)", href: "slides/statistics-bg/homework-02.pdf", kind: "pdf" }]
                },
                {
                  title: "Домашна 3 · Тест на хипотези",
                  description: "Домашна работа по тестване на хипотези.",
                  tags: ["домашна работа", "хипотези"],
                  date: "2025-10-13",
                  version: "1.0",
                  files: [{ label: "Задание (PDF)", href: "slides/statistics-bg/homework-03.pdf", kind: "pdf" }]
                },
                {
                  title: "Домашна 4–5 · Корелация и асоциация",
                  description: "Домашна работа по корелационен анализ и мерки за асоциация.",
                  tags: ["домашна работа", "корелация"],
                  date: "2025-10-27",
                  version: "1.0",
                  files: [{ label: "Задание (PDF)", href: "slides/statistics-bg/homework-04-05.pdf", kind: "pdf" }]
                },
                {
                  title: "Домашна 6 · Регресионен анализ",
                  description: "Домашна работа по линейна регресия.",
                  tags: ["домашна работа", "регресия"],
                  date: "2025-11-10",
                  version: "1.0",
                  files: [{ label: "Задание (PDF)", href: "slides/statistics-bg/homework-06.pdf", kind: "pdf" }]
                },
                {
                  title: "Решения · Решения на домашните работи",
                  description: "Подробни решения на всички домашни работи.",
                  tags: ["решения", "домашна работа"],
                  date: "2025-11-24",
                  version: "1.0",
                  files: [{ label: "Решения (PDF)", href: "slides/statistics-bg/homework-solutions.pdf", kind: "pdf" }]
                }
              ]
            }
          ]
        },
        {
          code: "en",
          label: "English",
          years: [
            {
              id: "2025-2026",
              label: "2025/2026",
              note: "English-language practicals accompanying the medical statistics course.",
              lectures: [
                {
                  title: "Practical · The chi-square test of independence and Cramér's V",
                  description: "Contingency tables, the chi-square statistic, and effect size for categorical association.",
                  tags: ["chi-square", "association"],
                  date: "2025-10-20",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "slides/statistics-bg/chi-square-cramers-v.pdf", kind: "pdf" }]
                },
                {
                  title: "Practicals 6–7 · Correlation and regression analysis",
                  description: "Pearson and Spearman correlation, simple linear regression, and model interpretation.",
                  tags: ["correlation", "regression"],
                  date: "2025-11-10",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "slides/statistics-bg/correlation-regression.pdf", kind: "pdf" }]
                }
              ],
              handouts: []
            }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      id: "epidemiology",
      title: "Applied epidemiology",
      blurb:
        "A growing course on measuring disease in populations, study design, and the interpretation of epidemiological evidence.",
      languages: [
        {
          code: "en",
          label: "English",
          years: [
            {
              id: "2025-2026",
              label: "2025/2026",
              note: "This section is growing — more slides and seminars are added as the course develops.",
              lectures: [
                {
                  title: "Lecture · Applied epidemiology — full course lecture",
                  description:
                    "The complete lecture deck for the applied epidemiology course: measures of frequency and association, study designs, bias and confounding, and screening.",
                  tags: ["lecture", "study design", "measures"],
                  date: "2025-09-29",
                  version: "1.0",
                  files: [{ label: "Slides (PDF)", href: "slides/epidemiology-en/applied-epidemiology-lecture.pdf", kind: "pdf" }]
                }
              ],
              handouts: []
            }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      id: "clinical-trials",
      title: "Clinical trials",
      blurb:
        "Seminars on the design of clinical trials and non-interventional studies, from randomisation to registry-based real-world evidence.",
      languages: [
        {
          code: "bg",
          label: "Български",
          years: [
            {
              id: "2025-2026",
              label: "2025/2026",
              note: "Семинари по дизайн на клиничните изпитвания и неинтервенционалните проучвания.",
              lectures: [
                {
                  title: "Семинар 1 · Описателна епидемиология. Метаанализи",
                  description: "Описателни дизайни, систематични прегледи и метаанализ.",
                  tags: ["метаанализ", "описателна епидемиология"],
                  date: "2025-10-06",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/trials-bg/seminar-01.pdf", kind: "pdf" }]
                },
                {
                  title: "Семинар 2 · Дизайн на клиничните изпитвания и неинтервенционалните проучвания",
                  description: "Фази на клиничните изпитвания, рандомизация и заслепяване.",
                  tags: ["клинични изпитвания", "дизайн"],
                  date: "2025-10-20",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/trials-bg/seminar-02.pdf", kind: "pdf" }]
                },
                {
                  title: "Семинар 3 · Дизайн на клиничните изпитвания и неинтервенционалните проучвания",
                  description: "Неинтервенционални проучвания, регистри и анализ на реални данни.",
                  tags: ["неинтервенционални проучвания", "реални данни"],
                  date: "2025-11-03",
                  version: "1.0",
                  files: [{ label: "Слайдове (PDF)", href: "slides/trials-bg/seminar-03.pdf", kind: "pdf" }]
                }
              ],
              handouts: []
            }
          ]
        }
      ]
    }
  ],

  /* Interactive study notebooks — shown as a separate strip below the browser. */
  notebooks: [
    { title: "Social medicine", href: "https://notebooklm.google.com/notebook/8239ce6e-f545-4cca-b3b3-a808487a6ce2" },
    { title: "Biostatistics", href: "https://notebooklm.google.com/notebook/4a653e2e-14e0-4ffe-8ac7-942fa7b0c100" },
    { title: "Bioethics", href: "https://notebooklm.google.com/notebook/5344e475-f3d5-407f-b276-e349afcadb89" },
    { title: "Epidemiology", href: "https://notebooklm.google.com/notebook/6306fd66-2009-4131-84be-79b7201eb536" },
    { title: "Hygiene", href: "https://notebooklm.google.com/notebook/00a56955-d080-48d3-bdd9-899ea473a7fd" }
  ]
};
