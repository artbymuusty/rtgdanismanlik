import type { Dictionary } from "./types";
import { siteConfig } from "@/lib/site-config";
import { errorMessages } from "./error-messages";

/**
 * German version of tr.ts / en.ts. Structure is enforced by the `Dictionary`
 * type. Keys that double as data — service `slug`s, tier `id`s, stage and
 * assessment option `value`s — are intentionally identical to the other
 * languages: they are what gets stored in the CRM sheet, so they must not
 * depend on the visitor's language. Tone: informal "du", like the Turkish
 * "sen" and English "you" of the other versions.
 */
export const de: Dictionary = {
  meta: {
    siteName: siteConfig.name,
    defaultTitle: `${siteConfig.name} — dein Begleiter auf dem Weg zum Studium in Deutschland`,
    titleTemplate: `%s — ${siteConfig.name}`,
    defaultDescription:
      "Für alle, die ihre Ausbildung in Deutschland voranbringen möchten: Ob du weißt, wo du anfangen sollst, oder nicht – wir sehen uns deine Situation gemeinsam an und besprechen den nächsten Schritt, der zu dir passt.",
    tagline: "Dein Begleiter auf dem Weg zum Studium in Deutschland",
    ogEyebrow: "Studieren in Deutschland",
  },
  common: {
    skipToContent: "Zum Inhalt springen",
    mainNavLabel: "Hauptmenü",
    moreNavLabel: "Weitere Seiten",
    mobileNavLabel: "Mobiles Menü",
    menuOpenLabel: "Menü öffnen",
    menuCloseLabel: "Menü schließen",
    menuButtonOpen: "Menü",
    menuButtonClose: "Schließen",
    back: "Zurück",
    next: "Weiter",
    backHome: "Zur Startseite",
    whatsappWrite: "Schreib uns auf WhatsApp",
    sample: "Beispiel",
    socialLinksLabel: "Links zu sozialen Medien",
    sampleAccount: "Beispielkonto",
    honeypotLabel: "Firma",
    languageLabel: "Sprache",
    languageNames: { tr: "Türkçe", en: "English", de: "Deutsch" },
    notFound: {
      eyebrow: "404",
      title: "Wir haben die gesuchte Seite nicht gefunden.",
      description: "Der Link ist möglicherweise veraltet oder die Adresse falsch geschrieben. Du kannst auf der Startseite weitermachen.",
      home: "Zur Startseite",
      contact: "Kontakt aufnehmen",
    },
    error: errorMessages.de,
  },
  stories: {
    homeTitle: "Sie waren auf diesem Weg nicht allein.",
    homeSubtitle: "Von Menschen, die diesen Weg wirklich gegangen sind.",
    viewAll: "Alle Geschichten ansehen",
    pageTitle: "Studentenerfolgsgeschichten",
    pageIntro: "Kein Weg beginnt wie der andere. Aber manchmal macht das richtige Gespräch den nächsten Schritt leichter sichtbar.",
    pageDescription:
      "Geschichten von Menschen, die diesen Weg wirklich gegangen sind: Wo sie angefangen haben, welche Schritte sie gegangen sind und wo sie heute stehen.",
    empty: "Wir haben hier noch keine Geschichte zu teilen. Diese Seite wird aktualisiert, sobald die ersten Geschichten vorliegen.",
    featuredLabel: "Ausgewählte Geschichte",
    startedFrom: "Wo hat es angefangen?",
    stepsTaken: "Welche Schritte sind wir gemeinsam gegangen?",
    nowWhere: "Wo steht die Person heute?",
    carouselLabel: "Weitere Studentengeschichten",
    previous: "Vorherige Studentengeschichte",
    nextStory: "Nächste Studentengeschichte",
  },
  mentors: {
    ourMentors: "Unsere Mentorinnen und Mentoren",
    germanyExperience: "Erfahrung in Deutschland",
    education: "Ausbildung",
    specialty: "Fachgebiet",
  },
  joinUsCta: {
    eyebrow: "Mach mit",
    title: "Hast du in Deutschland studiert? Du kannst auch Mentor oder Mentorin werden.",
    description:
      "Diesen Weg selbst gegangen zu sein, macht für den Menschen, der nach dir kommt, einen großen Unterschied. Wenn du deine Erfahrung teilen möchtest, hören wir dir gern zu.",
    cta: "Als Mentor/in bewerben",
  },
  legal: {
    updatedLabel: "Zuletzt aktualisiert",
    privacy: {
      title: "Datenschutzerklärung",
      description: `Datenschutzerklärung von ${siteConfig.name}.`,
      controller: { heading: "Verantwortlicher" },
      collected: {
        heading: "Welche Daten erheben wir?",
        body: "Wenn du das Formular „Lass uns über deinen Weg sprechen“ ausfüllst, erfassen wir deinen Vor- und Nachnamen, deine Telefon-/WhatsApp-Nummer, deine E-Mail-Adresse sowie die Angaben zu Ausbildung und Zielen, die du mit uns teilst. Wenn du uns über die Kontaktseite per WhatsApp oder E-Mail erreichst, gelten die Datenschutzregeln der jeweiligen Plattform.",
      },
      purpose: {
        heading: "Wofür verwenden wir diese Daten?",
        body: "Wir verwenden sie ausschließlich, um dich zu kontaktieren und das Gespräch vorzubereiten. Deine Daten werden weder an Dritte verkauft noch zu Werbezwecken weitergegeben.",
      },
      retention: {
        heading: "Speicherung der Daten",
        bodyPrefix: "Deine Daten werden in einer sicheren Umgebung gespeichert, zu der nur berechtigte Teammitglieder Zugang haben.",
        withEmail: "Wenn du möchtest, dass deine Daten gelöscht werden, schreib an {email}.",
        beforeLink: "Wenn du möchtest, dass deine Daten gelöscht werden, erreichst du uns über die Kanäle auf der ",
        linkText: "Kontaktseite",
        afterLink: ".",
      },
    },
    kvkk: {
      title: "Datenschutzhinweis (KVKK)",
      description: `Datenschutzhinweis (KVKK) von ${siteConfig.name}.`,
      subtitle: "Nach dem türkischen Gesetz Nr. 6698 zum Schutz personenbezogener Daten (KVKK)",
      controller: { heading: "Verantwortlicher", mersis: "MERSIS", taxOffice: "Finanzamt" },
      data: {
        heading: "Verarbeitete personenbezogene Daten",
        body: "Dein Vor- und Nachname, deine Telefonnummer, deine E-Mail-Adresse sowie die Angaben zu deiner Ausbildung und deinen Zielen, die du mit uns teilst.",
      },
      purpose: {
        heading: "Zweck der Verarbeitung",
        body: "Dich zu kontaktieren, ein Mentoring-Gespräch vorzubereiten und dir die gewünschten Informationen zu geben.",
      },
      rights: {
        heading: "Deine Rechte",
        withEmail: "Um deine Rechte nach Artikel 11 des KVKK auszuüben, schreib an {email}.",
        beforeLink: "Um deine Rechte nach Artikel 11 des KVKK auszuüben, erreichst du uns über die Kanäle auf der ",
        linkText: "Kontaktseite",
        afterLink: ".",
      },
    },
    terms: {
      title: "Nutzungsbedingungen",
      description: `Nutzungsbedingungen von ${siteConfig.name}.`,
      scope: {
        heading: "Umfang der Leistung",
        body: `${siteConfig.name} bietet Orientierung und Mentoring rund um das Studium in Deutschland. Wir garantieren weder eine Zulassung zur Universität noch eine Visumserteilung oder eine andere amtliche Entscheidung; diese liegen bei den jeweiligen Universitäten, Konsulaten und Behörden.`,
      },
      liability: {
        heading: "Verantwortung",
        body: "Die Informationen und Hinweise, die wir geben, beruhen auf dem Wissensstand zum Zeitpunkt des Gesprächs; es liegt in der Verantwortung der Nutzerinnen und Nutzer, die aktuellen Anforderungen bei den zuständigen Stellen zu prüfen.",
      },
      contact: {
        heading: "Kontakt",
        withEmail: "Bei Fragen erreichst du uns unter {email}.",
        beforeLink: "Bei Fragen erreichst du uns über die Kanäle auf der ",
        linkText: "Kontaktseite",
        afterLink: ".",
      },
    },
  },
  nav: {
    home: "Startseite",
    services: "So helfen wir",
    mentorship: "Mentoring",
    studentStories: "Erfolgsgeschichten",
    about: "Über uns",
    pricing: "Preise",
    joinUs: "Mach mit",
    faq: "FAQ",
    contact: "Kontakt",
    more: "Mehr",
    ctaPrimary: "Lass uns sprechen",
  },
  home: {
    hero: {
      eyebrow: "Studieren in Deutschland",
      title: "Du musst den Weg zum Studium in Deutschland nicht allein gehen.",
      subtitle:
        "Vielleicht weißt du genau, wo du anfangen sollst – vielleicht auch noch gar nichts. Wir sehen uns deine Situation gemeinsam an und planen den Weg, der zu dir passt.",
      ctaPrimary: "Lass uns über deinen Weg sprechen",
      ctaSecondary: "So helfen wir dir",
      imageAlt: "Berlin Hauptbahnhof, die erste Station auf dem Weg nach Deutschland",
    },
    journey: {
      eyebrow: "Der Weg",
      title: "Wo auch immer du stehst – lass uns den Weg nach Deutschland gemeinsam zeichnen.",
      description:
        "Egal, von wo du startest – aus einer Stadt in der Türkei oder von anderswo – und egal, welche Stadt du anstrebst, Berlin, München, Hamburg oder Frankfurt: Wir können dort beginnen, wo du gerade bist. Dieser Weg ist kein einzelner Flug, sondern die Summe vieler kleiner Entscheidungen.",
      mapOrigin: "Türkei",
      mapDestination: "Deutschland",
    },
    stageSelector: {
      title: "Wo auch immer du gerade stehst.",
      subtitle: "Wähle, was am besten zu dir passt, und wir zeigen dir sofort die passende Antwort.",
      stages: [
        {
          id: "researching",
          label: "Ich informiere mich noch",
          description:
            "Es ist völlig in Ordnung, wenn noch nichts klar ist. Wir können damit anfangen, darüber zu sprechen, wie das Studium in Deutschland funktioniert und welche Wege möglich sind.",
          cta: "Hilf mir bei der Recherche",
        },
        {
          id: "choosing",
          label: "Ich suche Studiengänge / Universitäten",
          description:
            "Optionen allein auszusortieren kann anstrengend sein. Wir können über deine Interessen und Ziele sprechen und die Auswahl gemeinsam eingrenzen.",
          cta: "Lass uns über meine Optionen sprechen",
        },
        {
          id: "preparing",
          label: "Ich bereite meine Bewerbung vor",
          description:
            "Wir klären, welches Dokument wann gebraucht wird, und begleiten den Prozess gemeinsam Schritt für Schritt.",
          cta: "Lass uns meine Vorbereitung planen",
        },
        {
          id: "applied",
          label: "Ich habe mich beworben und kenne den nächsten Schritt nicht",
          description:
            "Die Wartezeit nach der Bewerbung kann sich ungewiss anfühlen. Lass uns gemeinsam klären, was du jetzt tun solltest.",
          cta: "Den nächsten Schritt finden",
        },
        {
          id: "visa",
          label: "Ich bin im Visumsverfahren",
          description:
            "Visumsunterlagen und Termine erfordern genaue Verfolgung. Lass uns gemeinsam prüfen, was noch fehlt.",
          cta: "Lass uns über mein Visum sprechen",
        },
        {
          id: "pre-departure",
          label: "Ich bereite meinen Umzug nach Deutschland vor",
          description:
            "Den Alltag zu organisieren ist ebenso wichtig wie das Studium. Lass uns alles gemeinsam planen – von der Unterkunft bis zu den ersten Wochen.",
          cta: "Lass uns über meinen Umzug sprechen",
        },
        {
          id: "in-germany",
          label: "Ich bin schon in Deutschland",
          description:
            "Wenn du Unterstützung beim Organisieren deines Lebens hier oder bei deinem Studium möchtest, sind wir da.",
          cta: "Lass uns über meinen laufenden Weg sprechen",
        },
      ],
      fallback: {
        id: "unsure",
        label: "Ich bin mir nicht sicher",
        description:
          "Kein Problem. Nicht zu wissen, wo du anfangen sollst, hält dich nicht davon ab, mit uns zu sprechen – lass uns deine Situation gemeinsam klären.",
        cta: "Lass es uns gemeinsam klären",
      },
    },
    services: {
      title: "Wie helfen wir?",
      subtitle: "In fünf Bereichen sind wir an deiner Seite, egal wo du im Prozess stehst.",
      cta: "Alle Leistungen ansehen",
    },
    howWeWork: {
      title: "Wie arbeiten wir?",
      subtitle: "Der Ablauf ist nicht kompliziert – wir gehen ihn gemeinsam in vier Schritten.",
      steps: [
        {
          title: "Wir lernen dich kennen",
          description: "Mit ein paar kurzen Fragen verstehen wir deine Situation und dein Ziel.",
        },
        {
          title: "Wir sprechen miteinander",
          description: "In einem Gespräch, das auf deine Situation zugeschnitten ist, besprichst du deine Optionen mit einer Mentorin oder einem Mentor.",
        },
        {
          title: "Wir klären den Weg gemeinsam",
          description: "Wir planen gemeinsam die Schritte und den Zeitplan, die zu dir passen könnten.",
        },
        {
          title: "Wir begleiten dich durch den ganzen Prozess",
          description: "Von der Bewerbung bis zum Visum und, wenn nötig, bis zu den ersten Tagen in Deutschland bleiben wir in Kontakt.",
        },
      ],
    },
    mentorship: {
      title: "Du musst nicht allein vorankommen.",
      description:
        "Unsere Mentorinnen und Mentoren erklären diesen Prozess nicht nur – sie kennen auch seine akademische, bürokratische und alltägliche Seite. Ihre Aufgabe ist nicht, die Bewerbung für dich zu machen, sondern dir die richtige Entscheidung zu erleichtern.",
      cta: "Mentoring entdecken",
      approachEyebrow: "Unser Ansatz",
      approachQuote: "Ihre Aufgabe ist nicht, die Bewerbung für dich zu machen, sondern dir die richtige Entscheidung zu erleichtern.",
    },
    visualStory: {
      eyebrow: "Alltag",
      title: "Das Leben in Deutschland ist mehr als eine Bewerbung.",
      description:
        "Die Zulassung zu einer Universität ist ein wichtiger Teil des Weges; die eigentliche Geschichte beginnt, wenn du den Campus betrittst und dir in einer neuen Stadt deinen eigenen Alltag aufbaust.",
      captions: ["Humboldt-Universität", "München", "Bibliotheca Albertina"],
    },
    universityExplorer: {
      eyebrow: "Universitäten",
      title: "Entdecke Deutschlands weltweit gerankte Universitäten.",
      description: "Durchstöbere deutsche Universitäten, die im QS World University Rankings 2027 weltweit gelistet sind.",
      rankingSourceLabel: "QS World University Rankings 2027",
      rankLabel: "Weltrangliste",
      prevAriaLabel: "Vorherige Universität",
      nextAriaLabel: "Nächste Universität",
      exploreCta: "Universität entdecken",
      indexButtonLabel: "Alle 28 Universitäten entdecken",
      indexTitle: "Universitäten",
      indexSearchPlaceholder: "Universität suchen...",
      indexSearchAriaLabel: "Universität suchen",
      indexEmptyState: "Keine passende Universität.",
      indexClose: "Schließen",
      photoPending: "Foto folgt in Kürze",
    },
    humanConnection: {
      eyebrow: "Lass uns gemeinsam beginnen",
      metadata: "Erster Schritt",
      title: "Zuerst verstehen wir, wo du stehst.",
      description:
        "Wir wollen dir nichts verkaufen; wir hören zuerst deiner Situation zu und beraten dich ehrlich, ohne einen Weg, der nicht zu dir passt, als passend darzustellen.",
      cta: "Lass uns über deinen Weg sprechen",
      imageSrc: "/images/cities/frankfurt.jpg",
      imageAlt: "Frankfurt, Deutschland",
    },
    faqPreview: {
      title: "Häufig gestellte Fragen",
      cta: "Alle Fragen ansehen",
    },
    finalCta: {
      eyebrow: "Woher du auch kommst · Deutschland",
      title: "Wenn du bereit bist, lass uns sprechen.",
      description:
        "Lass uns dort beginnen, wo du gerade bist. Wir verstehen deine Situation gemeinsam und zeichnen danach den Weg, der zu dir passt.",
      ctaPrimary: "Lass uns über deinen Weg sprechen",
      ctaSecondary: "Schreib uns auf WhatsApp",
    },
  },
  services: {
    title: "Wie helfen wir?",
    intro:
      "Jede Leistung entspricht einer anderen Phase des Prozesses. Wenn du dir nicht sicher bist, welche du gerade brauchst, können wir das auch im Gespräch klären.",
    items: [
      {
        slug: "egitim-yonlendirme",
        title: "Orientierung zu Ausbildung & Studiengang",
        shortDescription: "Wir betrachten deine Optionen gemeinsam, ausgehend von deinen Zielen und deiner aktuellen Situation.",
        problem:
          "Allein zu entscheiden, welcher Studiengang, welche Stadt oder welche Ausbildungsstufe zu dir passt, kann schwierig sein.",
        help:
          "Indem wir über deine Interessen, deinen akademischen Hintergrund und deine Ziele sprechen, finden wir gemeinsam realistische Optionen.",
        process: [
          "Ein kurzes Kennenlerngespräch",
          "Einschätzung deiner Interessen und deiner akademischen Situation",
          "Besprechung möglicher Studiengänge / Universitäten",
          "Klärung des nächsten Schritts",
        ],
        scope: "Orientierung zu Studiengang und Stadt bzw. Universität; keine Zulassungsgarantie.",
        forWhom: "Für alle, die noch recherchieren oder ihre Optionen eingrenzen möchten.",
        nextStep: "Erzähl uns von deiner Situation, dann vereinbaren wir ein Gespräch.",
      },
      {
        slug: "basvuru-sureci",
        title: "Bewerbungsprozess an der Universität",
        shortDescription: "Wir verfolgen gemeinsam, was du in welchem Schritt des Bewerbungsprozesses tun musst.",
        problem:
          "Die Bewerbungsanforderungen unterscheiden sich von Universität zu Universität; es ist nicht leicht, den Überblick zu behalten, welches Dokument wann gebraucht wird.",
        help:
          "Wir klären die Anforderungen der Studiengänge, für die du dich bewirbst, und organisieren gemeinsam Unterlagen und Zeitplan.",
        process: [
          "Anforderungen der Zielstudiengänge zusammenstellen",
          "Dokumentenliste klären",
          "Vorbereitungskalender erstellen",
          "Letzte Kontrolle vor der Bewerbung",
        ],
        scope: "Organisation und Begleitung des Prozesses; wie die Universität die Bewerbung bewertet, liegt nicht in unserer Hand.",
        forWhom: "Für Studierende mit klarem Ziel, die sich auf die Bewerbung vorbereiten oder mittendrin sind.",
        nextStep: "Wir können damit beginnen, dass du uns sagst, welche Studiengänge du in Betracht ziehst.",
      },
      {
        slug: "vize-hazirlik",
        title: "Visumsvorbereitung",
        shortDescription: "Wir helfen dir, dich bei Unterlagen und Ablauf systematisch vorzubereiten.",
        problem:
          "Das Visumsverfahren erfordert viele Unterlagen und die Verfolgung von Terminen; eine kleine Lücke kann alles verzögern.",
        help:
          "Wir verfolgen gemeinsam Schritt für Schritt die nötigen Unterlagen, die Anforderungen an den Finanzierungsnachweis und den Terminablauf.",
        process: [
          "Dokumentenliste passend zur Visumsart erstellen",
          "Finanzierungsnachweis / Sperrkonto besprechen",
          "Termin und Antrag verfolgen",
          "Letzte Kontrolle",
        ],
        scope: "Unterstützung bei Vorbereitung und Organisation; die Visumsentscheidung liegt beim zuständigen Konsulat und kann nicht garantiert werden.",
        forWhom: "Für Studierende, die zugelassen wurden und ins Visumsverfahren gehen oder bereits darin sind.",
        nextStep: "Sag uns, in welcher Phase du bist, und wir klären den Ablauf gemeinsam.",
      },
      {
        slug: "almanyaya-hazirlik",
        title: "Vorbereitung auf Deutschland",
        shortDescription: "Wir begleiten dich bei der Vorbereitung auf dein neues Leben, das genauso wichtig ist wie das Studium.",
        problem:
          "Wenn praktische Dinge wie Unterkunft, Anmeldung, Bankkonto und Versicherung vor der Abreise nicht geklärt sind, können die ersten Wochen schwierig werden.",
        help:
          "Wir planen gemeinsam die praktischen Themen, die vor der Abreise und in den ersten Wochen auf dich zukommen.",
        process: [
          "Orientierung bei der Wohnungssuche",
          "Informationen zur Anmeldung und zur Eröffnung eines Bankkontos",
          "Orientierung zur Krankenversicherung",
          "Checkliste für die erste Woche",
        ],
        scope: "Information und Organisationshilfe; Dinge wie Unterkunft und Verträge erledigen die Studierenden selbst.",
        forWhom: "Für Studierende, deren Visumsverfahren vorankommt oder die sich auf die Abreise vorbereiten.",
        nextStep: "Nenne uns dein Abreisedatum, dann planen wir die Vorbereitung gemeinsam.",
      },
      {
        slug: "mentorluk",
        title: "Mentoring",
        shortDescription: "Wir bieten Erfahrung und Orientierung nicht nur bis zur Bewerbung, sondern auf deinem ganzen Weg.",
        problem:
          "Der Prozess ist lang und manchmal ungewiss; ein einmaliges Beratungsgespräch beantwortet nicht unbedingt jede Frage.",
        help:
          "Wenn du mit einer Mentorin oder einem Mentor in regelmäßigem Austausch bleibst, findest du zeitnah Antworten auf die Fragen, die sich im Lauf des Prozesses ergeben.",
        process: [
          "Zuordnung einer Mentorin oder eines Mentors",
          "Regelmäßiger Austausch und Verfolgung des Fortschritts",
          "Orientierung, wann immer Fragen auftauchen",
          "Anpassung des Prozesses an dein Ziel",
        ],
        scope: "Orientierung und geteilte Erfahrung; rechtliche und amtliche Entscheidungen liegen in der Verantwortung der Studierenden und der zuständigen Stellen.",
        forWhom: "Für alle, die in irgendeiner Phase des Prozesses regelmäßige Unterstützung wünschen.",
        nextStep: "Lass uns besprechen, wie Mentoring für dich passen könnte.",
      },
    ],
    labels: {
      problem: "Das Problem",
      help: "So helfen wir",
      forWhom: "Für wen",
      process: "Ablauf",
      scope: "Umfang",
    },
  },
  mentorship: {
    title: "Ein Mentor oder eine Mentorin ist hier mehr als jemand, der sich für dich bewirbt.",
    intro:
      "Du arbeitest mit Menschen, die die akademische, bürokratische und alltägliche Seite dieses Prozesses kennen. Die Aufgabe deiner Mentorin oder deines Mentors ist es, dich zu orientieren, dir die richtigen Entscheidungen zu erleichtern und dir den ganzen Prozess über zur Seite zu stehen.",
    sections: [
      {
        heading: "Wozu gibt es Mentoring?",
        body: "Das Studium in Deutschland ist keine einzelne Entscheidung. Von der Studienwahl über die Bewerbung und das Visum bis zu den ersten Wochen folgen viele kleine Entscheidungen aufeinander; mit einem Mentor oder einer Mentorin musst du sie nicht alle allein treffen.",
      },
      {
        heading: "Wann brauchst du Mentoring?",
        body: "Meist immer dann, wenn du auf die Frage „Was muss ich jetzt tun?“ keine klare Antwort findest. Das kann ganz am Anfang sein, mitten in der Bewerbung oder in der Visumsphase.",
      },
      {
        heading: "Was macht ein Mentor oder eine Mentorin?",
        body: "Sie hören deiner Situation zu, betrachten deine Optionen mit dir, behalten im Blick, welcher Schritt wann ansteht, und beantworten deine Fragen zeitnah. Die Entscheidung triffst du; dein Mentor oder deine Mentorin hilft dir, sie bewusster zu treffen.",
      },
      {
        heading: "Wie läuft es ab?",
        body: "Es beginnt mit einem Kennenlerngespräch. Danach bleibt ihr in Abständen in Kontakt, die zu deinem Bedarf passen; mal ist das ein wöchentlicher Check-in, mal nur ein einzelnes Gespräch in einer entscheidenden Phase.",
      },
    ],
    processTitle: "So verläuft das Mentoring",
    process: [
      { title: "Kennenlerngespräch", description: "Wir sprechen gemeinsam über deine Situation und dein Ziel." },
      { title: "Fahrplan", description: "Wir klären die Schritte und den Zeitplan, die zu dir passen könnten." },
      { title: "Regelmäßige Begleitung", description: "Wir lösen gemeinsam die Fragen, die im Lauf des Prozesses auftauchen." },
      { title: "Unterstützung in entscheidenden Phasen", description: "Bei Bewerbung, Visum und Abreise sind wir an deiner Seite." },
    ],
    cta: {
      title: "Lass uns besprechen, wie Mentoring für dich passen könnte.",
      description: "Wir können mit einem kurzen Gespräch beginnen, auch wenn noch nichts klar ist.",
      label: "Lass uns über deinen Weg sprechen",
    },
  },
  about: {
    title: "Über uns",
    imageSrc: "/images/cities/cologne.jpg",
    imageAlt: "Köln, Deutschland",
    intro: "Wir sind ein System, das von Menschen aufgebaut wurde, die wissen, wie sich dieser Prozess anfühlt.",
    sections: [
      {
        heading: "Warum gibt es uns?",
        body: "Das Studium in Deutschland ist ein erreichbares Ziel, wenn man mit den richtigen Informationen vorgeht. Aber verstreute Informationen, unklare Schritte und das Gefühl, allein unterwegs zu sein, lassen den Prozess schwerer erscheinen, als er ist. Wir sind da, um diese Lücke zu füllen.",
      },
      {
        heading: "Wie gehen wir vor?",
        body: "Ohne zu urteilen. Vielleicht hast du spät angefangen, hast schlechte Noten, sprichst die Sprache noch nicht gut genug oder hast noch kein klares Ziel; nichts davon hindert dich daran, ein Gespräch zu beginnen. Von deiner aktuellen Situation aus betrachten wir gemeinsam, welche Optionen dir offenstehen.",
      },
      {
        heading: "Was ändert sich für Studierende?",
        body: "Die meisten Quellen sind entweder zu allgemein oder zu technisch; du stehst vor einem Berg an Informationen, ohne zu wissen, wo du stehst. Wir legen Wert darauf, zuerst deine Situation zu verstehen und dir dann die richtigen Informationen zur richtigen Zeit zu geben – statt eines Bergs, den du allein sortieren musst, ein Weg, über den für deine Situation gesprochen wurde.",
      },
      {
        heading: "Wie verläuft der Weg nach Deutschland?",
        body: "Wir hören zuerst zu und geben dann Orientierung. Über den ganzen Prozess behalten wir im Blick, welcher Schritt wann ansteht, und beantworten deine Fragen zeitnah. Bei Versprechen bleiben wir realistisch; wir stellen einen Weg, der nicht zu dir passt, nicht als passend dar.",
      },
      {
        heading: "Wie geht es weiter?",
        body: "Wenn diese Plattform wächst, wird sie mit echten Erfolgsgeschichten und echten Mentorenprofilen bereichert. Unsere Priorität bleibt vorerst dieselbe: in jedem Gespräch mit derselben Aufmerksamkeit und Ehrlichkeit an deiner Seite zu sein – unser Ansatz ändert sich nicht, auch wenn die Zahlen wachsen.",
      },
    ],
  },
  pricing: {
    title: "Preise",
    intro:
      "Wir veröffentlichen keine feste Preisliste, weil dein Bedarf von deiner Situation abhängt. Stattdessen verstehen wir zuerst deine Situation und klären dann gemeinsam den Umfang und die Kosten, die zu dir passen.",
    intake: {
      eyebrow: "Erster Schritt",
      title: "Das Erstgespräch",
      description:
        "Alles beginnt mit einem kurzen Kennenlerngespräch. Darin hören wir dir und deinem Ziel zu und besprechen, welcher der drei folgenden Umfänge zu dir passen könnte. Du musst dich noch für nichts entschieden haben.",
      cta: "Erstgespräch starten",
    },
    tiersTitle: "Der Umfang, der zu dir passt",
    tiersSubtitle:
      "Wir bieten drei verschiedene Umfänge an; gemeinsam entscheiden wir, welcher zu dir passt. Die genauen Kosten ergeben sich aus dem besprochenen Umfang.",
    tiers: [
      {
        id: "yol-haritasi",
        name: "Fahrplan",
        tagline: "Einmalig, mit klarer Richtung",
        description:
          "Wenn du klären möchtest, wo du anfangen sollst oder wie du deine Bewerbung organisierst, kann dieser Umfang für dich ausreichen.",
        priceLabel: "Wir klären es gemeinsam im Gespräch",
        includes: ["egitim-yonlendirme", "basvuru-sureci"],
        idealFor: "Für alle, die noch in der Recherche- oder Bewerbungsvorbereitung sind.",
        cta: "Details besprechen",
      },
      {
        id: "birebir-mentorluk",
        name: "Einzelmentoring",
        tagline: "Regelmäßige Unterstützung durch den ganzen Prozess",
        description:
          "Wenn ein einzelnes Gespräch nicht reicht, findest du im regelmäßigen Austausch mit einer Mentorin oder einem Mentor zeitnah Antworten auf die Fragen, die sich im Lauf des Prozesses ergeben.",
        priceLabel: "Wir legen es gemeinsam nach dem Prozess fest",
        includes: ["egitim-yonlendirme", "basvuru-sureci", "mentorluk"],
        idealFor: "Für alle, die nicht nur einmal, sondern den ganzen Prozess über jemanden an ihrer Seite möchten.",
        cta: "Details besprechen",
      },
      {
        id: "kapsamli-destek",
        name: "Rundum-Begleitung",
        tagline: "Von der Bewerbung bis zu den ersten Wochen in Deutschland",
        description:
          "Wenn du uns im gesamten Prozess an deiner Seite haben möchtest – von der Bewerbung bis zum Visum, vom Visum bis zu den ersten Wochen in Deutschland –, können wir diesen Umfang besprechen.",
        priceLabel: "Wir planen es gemeinsam nach deinem Bedarf",
        includes: ["egitim-yonlendirme", "basvuru-sureci", "mentorluk", "vize-hazirlik", "almanyaya-hazirlik"],
        idealFor: "Für alle, die umfassende Unterstützung vom Anfang bis zur Ankunft in Deutschland wünschen.",
        cta: "Details besprechen",
      },
    ],
    comparisonTitle: "Umfänge im Vergleich",
    comparisonNote: "Unten siehst du, welche Leistungen jeder Umfang enthält. Details findest du bei der jeweiligen Leistung.",
    honestyNote:
      "Dass du hier keine feste Zahl siehst, hat nichts mit Geheimniskrämerei zu tun, sondern mit Ehrlichkeit: Eine Zahl zu nennen, bevor dein Bedarf klar ist, wäre nicht realistisch. Über den im Gespräch besprochenen Umfang hinaus kommen keine Überraschungskosten auf dich zu.",
    included: "In diesem Umfang",
    tableService: "Leistung",
    tableFee: "Kosten",
    includedAria: "Enthalten",
    cta: {
      title: "Lass uns besprechen, welcher Umfang zu dir passt.",
      description: "Du musst dich noch nicht entschieden haben. Erzähl uns von deiner Situation, und wir finden gemeinsam den passenden Umfang.",
      label: "Lass uns über deinen Weg sprechen",
    },
  },
  faq: {
    title: "Häufig gestellte Fragen",
    intro: "Die Antworten auf einige deiner Fragen findest du vielleicht hier. Wenn nicht, kannst du uns direkt fragen.",
    items: [
      {
        question: "Ich weiß nicht, wo ich anfangen soll. Kann ich mich trotzdem melden?",
        answer: "Ja. Nicht zu wissen, wo du anfangen sollst, hält dich nicht davon ab, mit uns zu sprechen.",
        category: "Allgemein",
      },
      {
        question: "Ist ein Studium in Deutschland kostenlos?",
        answer:
          "An den meisten staatlichen Universitäten gibt es keine Studiengebühren, aber in der Regel einen Semesterbeitrag. Der genaue Betrag unterscheidet sich je nach Universität und Bundesland, und wir können ihn gemeinsam anhand deiner Situation klären.",
        category: "Kosten",
      },
      {
        question: "Welches Deutschniveau brauche ich?",
        answer:
          "Für Studiengänge auf Deutsch wird meist B2–C1 verlangt; bei englischsprachigen Studiengängen können die Sprachanforderungen anders sein. Wenn du uns dein Niveau nennst, sehen wir gemeinsam, welche Wege dir offenstehen.",
        category: "Studieren in Deutschland",
      },
      {
        question: "Welche Studiengänge kann ich studieren?",
        answer:
          "Je nach akademischem Hintergrund und Interessen können viele Studiengänge möglich sein. Statt eine feste Liste zu geben, betrachten wir lieber gemeinsam deine Situation und sprechen über realistische Optionen.",
        category: "Studieren in Deutschland",
      },
      {
        question: "Brauche ich die YKS (die zentrale Hochschulaufnahmeprüfung der Türkei)?",
        answer:
          "Das hängt davon ab, für welchen Studiengang und auf welchem Weg du dich bewirbst. Bei manchen Wegen ist sie nicht nötig, bei anderen wird dein akademischer Hintergrund anders bewertet. Lass uns das klären, indem wir über deine Situation sprechen.",
        category: "Bewerbung & Visum",
      },
      {
        question: "Wie lange dauert eine Bewerbung?",
        answer:
          "Das hängt von Universität und Studiengang ab; manche Verfahren dauern einige Wochen, andere einige Monate. Sobald dein Zielstudiengang feststeht, können wir einen Zeitplan speziell für dich erstellen.",
        category: "Bewerbung & Visum",
      },
      {
        question: "Helft ihr auch beim Visum?",
        answer:
          "Ja. Wir stehen dir bei der Vorbereitung der Unterlagen, der Terminverfolgung und den Fragen zur Seite, die im Lauf des Prozesses auftauchen; die Visumsentscheidung selbst liegt beim zuständigen Konsulat, deshalb können wir sie nicht garantieren.",
        category: "Bewerbung & Visum",
      },
      {
        question: "Geht die Unterstützung weiter, wenn ich in Deutschland bin?",
        answer:
          "Ja. Bei der Anmeldung, in den ersten Wochen und im Studium können wir zu allem in Kontakt bleiben, was du brauchst.",
        category: "Mentoring & Unterstützung",
      },
    ],
  },
  contact: {
    title: "Kontakt",
    intro: "Du kannst uns über den Kanal erreichen, der am besten zu dir passt; alle führen zum selben Ziel: einem Gespräch mit einem Menschen.",
    whatsapp: {
      title: "WhatsApp",
      description: "Hast du eine schnelle Frage? Du kannst uns direkt schreiben.",
      cta: "Schreib uns auf WhatsApp",
    },
    email: {
      title: "E-Mail",
      description: "Wenn du lieber ausführlich schreibst.",
      cta: "E-Mail senden",
    },
    formCta: {
      title: "Beginne damit, deine Situation zu schildern",
      description: "Mit ein paar kurzen Fragen lernen wir dich kennen und bereiten ein passendes Gespräch vor.",
      cta: "Lass uns über deinen Weg sprechen",
    },
    photoCaption: "Ein Gespräch beginnt",
    photoAlt: "Frankfurt, Deutschland",
    composer: {
      title: "Schreib uns",
      description: "Sende deine Frage, dein Anliegen oder deine Anfrage direkt an uns. Deine Nachricht erreicht das zuständige Team.",
      emailLabel: "E-Mail-Adresse",
      emailPlaceholder: "du@beispiel.de",
      categoryLabel: "Themenkategorie",
      categories: {
        general: "Allgemeine Frage",
        consulting: "Bewerbung / Beratung",
        billing: "Zahlung / Abrechnung",
        complaint: "Beschwerde",
        technical: "Technisches / Systemproblem",
        website: "Fehler auf der Website",
        other: "Sonstiges",
      },
      subjectLabel: "Betreff",
      subjectPlaceholder: "Der Betreff deiner Nachricht",
      messageLabel: "Nachricht",
      messagePlaceholders: {
        general: "Wie können wir dir helfen?",
        consulting: "Wie können wir dir helfen?",
        billing: "Wie können wir dir helfen?",
        complaint: "Beschreibe, was passiert ist, welchen Service es betrifft und wenn möglich Datum/Uhrzeit.",
        technical: "Beschreibe den Fehler, auf welcher Seite er auftrat und wenn möglich die Fehlermeldung.",
        website: "Beschreibe, auf welcher Seite der Fehler auftritt und was du gemacht hast, als er auftrat.",
        other: "Wie können wir dir helfen?",
      },
      honeypotLabel: "Unternehmen",
      submit: "Nachricht senden",
      submitting: "Wird gesendet...",
      successTitle: "Deine Nachricht wurde gesendet.",
      successBody: "Wir haben deine Nachricht erhalten. Falls nötig, melden wir uns über die angegebene E-Mail-Adresse bei dir.",
      errorTitle: "Die Nachricht konnte nicht gesendet werden.",
      errorBody: "Bitte versuche es erneut oder nutze einen anderen Kontaktweg.",
      retry: "Erneut versuchen",
    },
  },
  bizeKatilin: {
    eyebrow: "Mach mit",
    applyEyebrow: "Bewerbung",
    title: "Auch du wusstest einmal nicht, wo du anfangen sollst.",
    intro: "Wenn du Erfahrung mit dem Studium in Deutschland hast und jemandem auf diesem Weg zur Seite stehen möchtest, hören wir dir gern zu.",
    imageCaption: "Teile deine Erfahrung",
    sections: [
      {
        heading: "Warum könntest du Mentor oder Mentorin sein?",
        body: "Du hast in Deutschland studiert oder studierst noch. Du weißt, wie sich Bewerbung, Visum und das Ankommen in einer neuen Stadt anfühlen. Diese Erfahrung macht für den Menschen, der nach dir kommt, einen großen Unterschied.",
      },
      {
        heading: "Wen suchen wir?",
        body: "Wir suchen keinen bestimmten Titel. Wir suchen Menschen, die diesen Prozess wirklich durchlaufen haben und bereit sind, sich Zeit für die Fragen von Studierenden zu nehmen.",
      },
      {
        heading: "Was machst du als Mentor oder Mentorin?",
        body: "Du hörst der Situation der Studierenden zu und beantwortest ihre Fragen; manchmal ist es ein einzelnes Gespräch, manchmal ein regelmäßiger Austausch über den ganzen Prozess. Wie viel Zeit du geben kannst, besprechen wir gemeinsam.",
      },
      {
        heading: "Wie arbeiten wir?",
        body: "Nach deiner Bewerbung führen wir ein kurzes Kennenlerngespräch. Wenn es passt, ordnen wir dir Studierende oder einen Prozess zu, die zu dir passen.",
      },
    ],
    formTitle: "Bewerbungsformular",
    formDescription: "Beginnen wir mit ein paar Angaben; den Rest besprechen wir im Gespräch.",
    fields: {
      firstName: "Vorname",
      lastName: "Nachname",
      phone: "Telefon / WhatsApp",
      email: "E-Mail",
      germanyExperience: "Was ist deine Erfahrung in Deutschland?",
      germanyExperiencePlaceholder: "Welche Stadt, welche Universität/welcher Studiengang, wann?",
      motivation: "Warum möchtest du Mentor oder Mentorin werden?",
      motivationPlaceholder: "Ein paar Sätze reichen.",
      message: "Möchtest du noch etwas hinzufügen?",
      messagePlaceholder: "Wenn du möchtest, kannst du hier etwas schreiben (optional).",
    },
    submit: { label: "Bewerbung senden", loading: "Wird gesendet ..." },
    success: {
      title: "Vielen Dank.",
      description: "Wir haben deine Bewerbung erhalten. Nach der Prüfung melden wir uns bei dir.",
      backHome: "Zur Startseite",
    },
    error: { description: "Beim Senden des Formulars ist ein Problem aufgetreten. Bitte versuche es erneut." },
  },
  assessment: {
    contactValidation: "Bitte fülle Vorname, Nachname, Telefon, E-Mail und deine bevorzugte Kontaktart aus.",
    metaTitle: "Lass uns dich kennenlernen",
    metaDescription: "Mit ein paar kurzen Fragen verstehen wir deine Situation und bereiten ein passendes Gespräch für dich vor.",
    intro: {
      eyebrow: "Dein persönlicher Fahrplan",
      title: "Lass uns dich ein wenig kennenlernen.",
      description:
        "Damit wir dir genauer helfen können, stellen wir dir ein paar kurze Fragen. Das Ausfüllen dauert nur wenige Minuten.",
      startCta: "Los geht's",
    },
    steps: [
      {
        id: "stage",
        question: "In welcher Phase befindest du dich gerade?",
        type: "single",
        options: [
          { value: "researching", label: "Ich informiere mich noch" },
          { value: "choosing", label: "Ich suche Studiengänge / Universitäten" },
          { value: "preparing", label: "Ich bereite meine Bewerbung vor" },
          { value: "applied", label: "Ich habe mich beworben" },
          { value: "visa", label: "Ich bin im Visumsverfahren" },
          { value: "pre-departure", label: "Ich bereite meinen Umzug nach Deutschland vor" },
          { value: "in-germany", label: "Ich bin schon in Deutschland" },
          { value: "unsure", label: "Ich bin mir nicht sicher" },
        ],
      },
      {
        id: "educationStatus",
        question: "Wie ist dein Bildungsstand?",
        type: "single",
        options: [
          { value: "high-school-student", label: "Ich bin Schüler/in" },
          { value: "high-school-graduate", label: "Ich habe die Schule abgeschlossen" },
          { value: "university-student", label: "Ich bin Student/in" },
          { value: "university-graduate", label: "Ich habe ein Studium abgeschlossen" },
          { value: "considering-masters", label: "Ich überlege, einen Master zu machen" },
          { value: "other", label: "Sonstiges" },
        ],
      },
      {
        id: "interestArea",
        question: "Für welchen Bereich interessierst du dich?",
        type: "single",
        helper: "Wenn es noch nicht klar ist, kannst du „Ich weiß es noch nicht“ wählen.",
        options: [
          { value: "engineering", label: "Ingenieurwesen" },
          { value: "computer-it", label: "Informatik / IT" },
          { value: "business-economics", label: "Wirtschaft / BWL" },
          { value: "health", label: "Gesundheit" },
          { value: "social-sciences", label: "Sozialwissenschaften" },
          { value: "design-arts", label: "Design / Kunst" },
          { value: "unknown", label: "Ich weiß es noch nicht" },
          { value: "other", label: "Sonstiges" },
        ],
      },
      {
        id: "germanLevel",
        question: "Wie ist dein Deutschniveau?",
        type: "single",
        options: [
          { value: "undisclosed", label: "Möchte ich nicht angeben" },
          { value: "none", label: "Noch nicht angefangen" },
          { value: "a1", label: "A1" },
          { value: "a2", label: "A2" },
          { value: "b1", label: "B1" },
          { value: "b2", label: "B2" },
          { value: "c1", label: "C1" },
          { value: "c2", label: "C2" },
          { value: "native", label: "Muttersprache / fließend" },
        ],
      },
      {
        id: "englishLevel",
        question: "Wie ist dein Englischniveau?",
        type: "single",
        options: [
          { value: "undisclosed", label: "Möchte ich nicht angeben" },
          { value: "none", label: "Noch nicht angefangen" },
          { value: "a1", label: "A1" },
          { value: "a2", label: "A2" },
          { value: "b1", label: "B1" },
          { value: "b2", label: "B2" },
          { value: "c1", label: "C1" },
          { value: "c2", label: "C2" },
          { value: "native", label: "Muttersprache / fließend" },
        ],
      },
      {
        id: "target",
        question: "Was möchtest du in Deutschland machen?",
        type: "single",
        options: [
          { value: "bachelor", label: "Bachelorstudium" },
          { value: "masters", label: "Masterstudium" },
          { value: "language-course", label: "Sprachkurs" },
          { value: "studienkolleg", label: "Studienkolleg" },
          { value: "vocational", label: "Berufsausbildung" },
          { value: "undecided", label: "Ich habe mich noch nicht entschieden" },
          { value: "other", label: "Sonstiges" },
        ],
      },
      {
        id: "timeline",
        question: "Wann möchtest du beginnen?",
        type: "single",
        options: [
          { value: "next-term", label: "Zum nächstmöglichen Semester" },
          { value: "6-months", label: "Innerhalb von 6 Monaten" },
          { value: "1-year", label: "Innerhalb von 1 Jahr" },
          { value: "1-year-plus", label: "In mehr als 1 Jahr" },
          { value: "unsure", label: "Ich weiß es noch nicht" },
        ],
      },
      {
        id: "background",
        question: "Erzähl uns ein wenig von dir, deiner Ausbildung oder deinen Erfahrungen.",
        helper:
          "Ein paar Sätze zu deinem akademischen Hintergrund, besonderen Erfahrungen oder deinen Erwartungen an die Beratung helfen deiner Beraterin oder deinem Berater, dich schon vor dem Gespräch kennenzulernen.",
        type: "text",
        placeholder: "Ein paar Sätze reichen.",
      },
      {
        id: "message",
        question: "Gibt es noch eine Frage oder ein Thema, das du uns mitteilen möchtest?",
        type: "text",
        placeholder: "Wenn du möchtest, kannst du hier etwas schreiben (optional).",
        optional: true,
      },
      {
        id: "referralSource",
        question: "Wie hast du von uns erfahren?",
        type: "single",
        options: [
          { value: "instagram", label: "Instagram" },
          { value: "linkedin", label: "LinkedIn" },
          { value: "google_search", label: "Google / Internetsuche" },
          { value: "university_campus", label: "Universität / Campus" },
          { value: "friend_referral", label: "Freund/in / Bekannte/r" },
          { value: "event_booth", label: "Veranstaltung / Messestand" },
          { value: "whatsapp", label: "WhatsApp" },
          { value: "youtube", label: "YouTube" },
          { value: "other", label: "Sonstiges" },
        ],
      },
    ],
    referralOtherLabel: "Sonstiges (bitte kurz angeben)",
    contactStep: {
      title: "Wie können wir dich erreichen?",
      description: "Der letzte Schritt. Mit diesen Angaben kommen wir gut vorbereitet in unser Gespräch.",
      fields: {
        firstName: "Vorname",
        lastName: "Nachname",
        phone: "Telefon / WhatsApp",
        email: "E-Mail",
        preferredContact: "Deine bevorzugte Kontaktart",
        preferredContactOptions: [
          { value: "whatsapp", label: "WhatsApp" },
          { value: "phone", label: "Telefon" },
        ],
      },
    },
    submit: { label: "Absenden", loading: "Wird gesendet ..." },
    success: {
      title: "Vielen Dank.",
      description:
        "Wir haben deine Angaben erhalten. Unser Team sieht sich an, was du mitgeteilt hast, und meldet sich so bald wie möglich bei dir.",
      whatsappCta: "Wenn du möchtest, kannst du uns auch gleich auf WhatsApp schreiben.",
      backHome: "Zur Startseite",
    },
    error: {
      title: "Etwas ist schiefgelaufen.",
      description: "Beim Senden des Formulars ist ein Problem aufgetreten. Du kannst es erneut versuchen oder uns direkt auf WhatsApp schreiben.",
      retry: "Erneut versuchen",
    },
  },
  footer: {
    description:
      "Für alle, die ihre Ausbildung in Deutschland voranbringen möchten: Egal wo du anfängst, den nächsten Schritt finden wir gemeinsam.",
    navTitle: "Seiten",
    legalTitle: "Rechtliches",
    legalLinks: [
      { label: "Datenschutzerklärung", route: "privacy" },
      { label: "Datenschutzhinweis (KVKK)", route: "kvkk" },
      { label: "Nutzungsbedingungen", route: "terms" },
    ],
    rights: `© ${new Date().getFullYear()} ${siteConfig.name}. Alle Rechte vorbehalten.`,
  },
};
