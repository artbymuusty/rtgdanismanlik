import type { Dictionary } from "./types";
import { siteConfig } from "@/lib/site-config";
import { errorMessages } from "./error-messages";

/**
 * English version of tr.ts. Structure is enforced by the `Dictionary` type.
 * Keys that double as data — service `slug`s, tier `id`s, stage/assessment
 * option `value`s — are intentionally identical to the Turkish file: they
 * are what gets stored in the CRM sheet, so they must not depend on the
 * visitor's language.
 */
export const en: Dictionary = {
  meta: {
    siteName: siteConfig.name,
    defaultTitle: `${siteConfig.name} — your companion on the way to studying in Germany`,
    titleTemplate: `%s — ${siteConfig.name}`,
    defaultDescription:
      "For anyone who wants to move forward with their education in Germany: whether or not you know where to start, we look at your situation together and talk through the next step that fits you.",
    tagline: "Your companion on the way to studying in Germany",
    ogEyebrow: "Studying in Germany",
  },
  common: {
    skipToContent: "Skip to content",
    mainNavLabel: "Main menu",
    moreNavLabel: "More pages",
    mobileNavLabel: "Mobile menu",
    menuOpenLabel: "Open menu",
    menuCloseLabel: "Close menu",
    menuButtonOpen: "Menu",
    menuButtonClose: "Close",
    back: "Back",
    next: "Next",
    backHome: "Back to Home",
    whatsappWrite: "Message us on WhatsApp",
    sample: "Sample",
    socialLinksLabel: "Social media links",
    sampleAccount: "sample account",
    honeypotLabel: "Company",
    languageLabel: "Language",
    languageNames: { tr: "Türkçe", en: "English" },
    notFound: {
      eyebrow: "404",
      title: "We couldn't find the page you're looking for.",
      description: "The link may be outdated or the address mistyped. You can continue from the home page.",
      home: "Back to Home",
      contact: "Contact Us",
    },
    error: errorMessages.en,
  },
  stories: {
    homeTitle: "They weren't alone on this journey.",
    homeSubtitle: "From people who have really been through it.",
    viewAll: "See All Stories",
    pageTitle: "Student Stories",
    pageIntro: "No two paths start the same way. But sometimes the right conversation makes the next step easier to see.",
    pageDescription:
      "Stories from people who have really been through this journey: where they started, which steps they took, and where they are now.",
    empty: "We don't have a story to share here yet. This page will be updated when the first stories arrive.",
    featuredLabel: "Featured Story",
    startedFrom: "Where did they start?",
    stepsTaken: "Which steps did we take together?",
    nowWhere: "Where are they now?",
    carouselLabel: "More student stories",
    previous: "Previous student story",
    nextStory: "Next student story",
  },
  mentors: {
    ourMentors: "Our Mentors",
    germanyExperience: "Experience in Germany",
    education: "Education",
    specialty: "Area of expertise",
  },
  joinUsCta: {
    eyebrow: "Join Us",
    title: "Did you study in Germany? You can be a mentor too.",
    description:
      "Having been through this process makes a big difference to the person who comes after you. If you'd like to share your experience, we'd love to hear from you.",
    cta: "Apply as a Mentor",
  },
  legal: {
    updatedLabel: "Last updated",
    privacy: {
      title: "Privacy Policy",
      description: `Privacy policy of ${siteConfig.name}.`,
      controller: { heading: "Data controller" },
      collected: {
        heading: "What information do we collect?",
        body: "When you fill in the “Let's Talk About Your Journey” form, we collect your first name, last name, phone/WhatsApp number, e-mail address and the education and goal details you choose to share. If you reach us through the contact page by WhatsApp or e-mail, the privacy rules of that platform apply.",
      },
      purpose: {
        heading: "What do we use it for?",
        body: "We use it only to contact you and to prepare for our conversation. We do not sell your information to third parties or share it for marketing purposes.",
      },
      retention: {
        heading: "How your data is stored",
        bodyPrefix: "Your information is kept in a secure environment that only authorised team members can access.",
        withEmail: "If you would like your information deleted, you can write to {email}.",
        beforeLink: "If you would like your information deleted, you can reach us through the channels on the ",
        linkText: "contact page",
        afterLink: ".",
      },
    },
    kvkk: {
      title: "Personal Data Protection Notice (KVKK)",
      description: `Personal data protection notice (KVKK) of ${siteConfig.name}.`,
      subtitle: "Under Türkiye's Personal Data Protection Law No. 6698 (KVKK)",
      controller: { heading: "Data controller", mersis: "MERSIS", taxOffice: "Tax office" },
      data: {
        heading: "Personal data we process",
        body: "Your first name, last name, phone number, e-mail address, and the information you share about your education and goals.",
      },
      purpose: {
        heading: "Purpose of processing",
        body: "To contact you, prepare a mentoring conversation and provide the information you asked for.",
      },
      rights: {
        heading: "Your rights",
        withEmail: "To exercise your rights under Article 11 of the KVKK, you can write to {email}.",
        beforeLink: "To exercise your rights under Article 11 of the KVKK, you can reach us through the channels on the ",
        linkText: "contact page",
        afterLink: ".",
      },
    },
    terms: {
      title: "Terms of Use",
      description: `Terms of use of ${siteConfig.name}.`,
      scope: {
        heading: "Scope of the service",
        body: `${siteConfig.name} offers guidance and mentoring on the process of studying in Germany. It does not guarantee university admission, a visa approval or any other official decision; those decisions rest with the relevant universities, consulates and official authorities.`,
      },
      liability: {
        heading: "Responsibility",
        body: "The information and guidance we share are based on what we know at the time of the conversation; it is the user's responsibility to confirm the current requirements with the official authorities.",
      },
      contact: {
        heading: "Contact",
        withEmail: "If you have questions, you can reach us at {email}.",
        beforeLink: "If you have questions, you can reach us through the channels on the ",
        linkText: "contact page",
        afterLink: ".",
      },
    },
  },
  nav: {
    home: "Home",
    services: "How We Help",
    mentorship: "Mentorship",
    studentStories: "Student Stories",
    about: "About Us",
    pricing: "Pricing",
    joinUs: "Join Us",
    faq: "FAQ",
    contact: "Contact",
    more: "More",
    ctaPrimary: "Let's Talk About Your Journey",
  },
  home: {
    hero: {
      eyebrow: "Studying in Germany",
      title: "You don't have to go through studying in Germany alone.",
      subtitle:
        "You may know exactly where to start, or you may not know anything yet. We look at your situation together and plan the route that fits you.",
      ctaPrimary: "Let's Talk About Your Journey",
      ctaSecondary: "See How We Help",
      imageAlt: "Berlin Hauptbahnhof, the first stop on the way to Germany",
    },
    journey: {
      eyebrow: "The Journey",
      title: "Wherever you are, let's map the way to Germany together.",
      description:
        "Wherever you're starting from — a city in Türkiye or anywhere else — and whichever city you're aiming for, Berlin, Munich, Hamburg or Frankfurt, we can begin from where you are. This route isn't a single flight, it's the sum of many small decisions.",
      mapOrigin: "Türkiye",
      mapDestination: "Germany",
    },
    stageSelector: {
      title: "Wherever you are right now.",
      subtitle: "Pick the option closest to you and we'll show you the answer that fits.",
      stages: [
        {
          id: "researching",
          label: "I'm still researching",
          description:
            "It's fine if nothing is clear yet. We can start by talking through how education in Germany works and which paths are possible.",
          cta: "Help Me Research",
        },
        {
          id: "choosing",
          label: "I'm looking at programmes / universities",
          description:
            "Narrowing down options on your own can be exhausting. We can talk through your interests and goals and narrow them down together.",
          cta: "Let's Talk About My Options",
        },
        {
          id: "preparing",
          label: "I'm preparing to apply",
          description:
            "We can make clear which document is needed when, and follow the process step by step together.",
          cta: "Let's Plan My Preparation",
        },
        {
          id: "applied",
          label: "I've applied and don't know the next step",
          description:
            "The waiting period after applying can feel uncertain. Let's work out together what you should be doing right now.",
          cta: "Find the Next Step",
        },
        {
          id: "visa",
          label: "I'm in the visa process",
          description:
            "Visa documents and appointments need close tracking. Let's check together what might be missing.",
          cta: "Let's Talk About My Visa",
        },
        {
          id: "pre-departure",
          label: "I'm getting ready to move to Germany",
          description:
            "Organising daily life matters as much as your studies. Let's plan everything together, from housing to your first weeks.",
          cta: "Let's Talk About My Move",
        },
        {
          id: "in-germany",
          label: "I'm already in Germany",
          description:
            "If you'd like support while organising your life here or moving forward with your studies, we're here.",
          cta: "Let's Talk About My Ongoing Process",
        },
      ],
      fallback: {
        id: "unsure",
        label: "I'm not sure",
        description:
          "That's completely fine. Not knowing where to start is no obstacle to talking with us — let's work out your situation together.",
        cta: "Let's Figure It Out Together",
      },
    },
    services: {
      title: "How do we help?",
      subtitle: "In five areas, we're by your side wherever you are in the process.",
      cta: "See All Services",
    },
    howWeWork: {
      title: "How do we work?",
      subtitle: "The process isn't complicated — we move forward together in four steps.",
      steps: [
        {
          title: "We get to know you",
          description: "A few short questions help us understand your situation and your goal.",
        },
        {
          title: "We talk",
          description: "In a conversation tailored to your situation, you talk through your options with a mentor.",
        },
        {
          title: "We clarify the path together",
          description: "We plan the steps and the timeline that could work for you, together.",
        },
        {
          title: "We're with you throughout",
          description: "From application to visa, and if needed the first days in Germany, we stay in touch.",
        },
      ],
    },
    mentorship: {
      title: "You don't have to move forward alone.",
      description:
        "Our mentors don't just describe this process — they also know its academic, bureaucratic and day-to-day sides. Their job isn't to apply for you, it's to make it easier for you to make the right decision.",
      cta: "Discover Mentorship",
      approachEyebrow: "Our approach",
      approachQuote: "Their job isn't to apply for you, it's to make it easier for you to make the right decision.",
    },
    visualStory: {
      eyebrow: "Everyday Life",
      title: "Life in Germany is more than an application.",
      description:
        "Being accepted to a university is an important part of the journey; the real story begins when you step onto campus and build your own routine in a new city.",
      captions: ["Humboldt University", "Munich", "Bibliotheca Albertina"],
    },
    humanConnection: {
      eyebrow: "Let's Start Together",
      metadata: "First Step",
      title: "First, let's understand where you are.",
      description:
        "We're not trying to sell you anything; we listen to your situation first, and we honestly guide you without presenting a path that doesn't suit you as if it did.",
      cta: "Let's Talk About Your Journey",
      imageSrc: "/images/cities/frankfurt.jpg",
      imageAlt: "Frankfurt, Germany",
    },
    faqPreview: {
      title: "Frequently asked questions",
      cta: "See All Questions",
    },
    finalCta: {
      eyebrow: "Wherever You Are · Germany",
      title: "If you're ready, let's talk.",
      description:
        "Let's start from where you are. We'll understand your situation together, then map out the path that fits you.",
      ctaPrimary: "Let's Talk About Your Journey",
      ctaSecondary: "Message Us on WhatsApp",
    },
  },
  services: {
    title: "How do we help?",
    intro:
      "Each service corresponds to a different stage of the process. If you're not sure which one you need right now, we can work that out together in a conversation.",
    items: [
      {
        slug: "egitim-yonlendirme",
        title: "Education & Programme Guidance",
        shortDescription: "We look at your options together, based on your goals and your current situation.",
        problem:
          "Deciding which programme, which city or which level of study suits you can be hard to do alone.",
        help:
          "By talking through your interests, academic background and goals, we identify realistic options together.",
        process: [
          "A short introductory conversation",
          "Assessment of your interests and academic situation",
          "Discussing possible programme / university directions",
          "Clarifying the next step",
        ],
        scope: "Guidance on programme and city/university direction; not a guarantee of admission.",
        forWhom: "For anyone who is still researching or wants to narrow down their options.",
        nextStep: "Tell us about your situation and we can schedule a conversation.",
      },
      {
        slug: "basvuru-sureci",
        title: "University Application Process",
        shortDescription: "We follow together what to do at each step of the application process.",
        problem:
          "Application requirements differ from university to university; it isn't easy to keep track of which document is needed when.",
        help:
          "We clarify the requirements of the programmes you'll apply to and organise your document preparation and timeline together.",
        process: [
          "Working out the requirements of the target programme(s)",
          "Clarifying the document list",
          "Building a preparation calendar",
          "A final check before applying",
        ],
        scope: "Process organisation and guidance; how the university evaluates your application is outside our control.",
        forWhom: "For students who have a clear target and are preparing to apply or are in the application process.",
        nextStep: "We can start by you sharing which programme(s) you're considering.",
      },
      {
        slug: "vize-hazirlik",
        title: "Visa Preparation",
        shortDescription: "We help you prepare systematically when it comes to documents and the process.",
        problem:
          "The visa process requires a lot of documents and appointment tracking; a small omission can delay everything.",
        help:
          "We follow the required documents, financial proof requirements and the appointment process step by step together.",
        process: [
          "Building the document list for your visa type",
          "Discussing financial proof / the blocked account process",
          "Tracking the appointment and application",
          "A final check",
        ],
        scope: "Preparation and organisation support; the visa decision rests with the relevant consulate and cannot be guaranteed.",
        forWhom: "For students who have been accepted and are about to start, or are already in, the visa process.",
        nextStep: "Tell us which stage you're at and let's clarify the process together.",
      },
      {
        slug: "almanyaya-hazirlik",
        title: "Preparing for Germany",
        shortDescription: "We're with you as you prepare for your new life, which matters as much as your studies.",
        problem:
          "When practical matters like housing, registration, a bank account and insurance aren't sorted before you go, the first weeks can be hard.",
        help:
          "We plan together the practical matters you'll face before you leave and in your first weeks.",
        process: [
          "Guidance on searching for housing",
          "Information on registration (Anmeldung) and opening a bank account",
          "Guidance on health insurance",
          "A first-week checklist",
        ],
        scope: "Information and organisation support; matters such as housing and contracts are handled by the student.",
        forWhom: "For students whose visa process is moving forward or who are getting ready to leave.",
        nextStep: "Share your departure date and let's plan the preparation together.",
      },
      {
        slug: "mentorluk",
        title: "Mentorship",
        shortDescription: "We offer experience and guidance not just until you apply, but throughout your journey.",
        problem:
          "The process is long and sometimes uncertain; a one-off consultation may not answer every question.",
        help:
          "By staying in regular contact with a mentor, you find timely answers to the questions that come up as the process moves on.",
        process: [
          "Mentor matching",
          "Regular contact and progress tracking",
          "Guidance whenever questions come up",
          "Updating the process as your goal evolves",
        ],
        scope: "Guidance and shared experience; legal and official decisions are the responsibility of the student and the relevant institutions.",
        forWhom: "For anyone who wants regular support at any stage of the process.",
        nextStep: "Let's talk about how mentorship could work for you.",
      },
    ],
    labels: {
      problem: "The problem",
      help: "How we help",
      forWhom: "Who it's for",
      process: "Process",
      scope: "Scope",
    },
  },
  mentorship: {
    title: "A mentor here is more than someone who applies for you.",
    intro:
      "You work with people who know the academic, bureaucratic and everyday sides of this process. Your mentor's job is to guide you, make it easier for you to make the right decisions, and be by your side throughout.",
    sections: [
      {
        heading: "Why is there a mentor?",
        body: "Studying in Germany isn't a single decision. From choosing a programme to applying, from the visa to the first weeks, many small decisions follow one another; a mentor means you don't have to make them all alone.",
      },
      {
        heading: "When do you need a mentor?",
        body: "Usually whenever you can't find a clear answer to “what should I be doing right now?”. That can be right at the start, in the middle of an application, or at the visa stage.",
      },
      {
        heading: "What does a mentor do?",
        body: "They listen to your situation, look at your options with you, keep track of which step comes when, and answer your questions on time. You make the decision; the mentor helps you make it more consciously.",
      },
      {
        heading: "How does it work?",
        body: "It starts with an introductory conversation. After that you stay in touch at intervals that suit your needs; sometimes a weekly check-in, sometimes just a single conversation at a critical stage.",
      },
    ],
    processTitle: "How mentorship unfolds",
    process: [
      { title: "Introductory conversation", description: "We talk through your situation and your goal together." },
      { title: "Roadmap", description: "We clarify the steps and timing that could work for you." },
      { title: "Regular follow-up", description: "We work through the questions that come up as the process moves on." },
      { title: "Support at critical stages", description: "We're with you at critical moments like the application, the visa and the move." },
    ],
    cta: {
      title: "Let's talk about how mentorship could work for you.",
      description: "We can start with a short conversation, even if nothing is clear yet.",
      label: "Let's Talk About Your Journey",
    },
  },
  about: {
    title: "About Us",
    imageSrc: "/images/cities/cologne.jpg",
    imageAlt: "Cologne, Germany",
    intro: "We're a system built by people who know how this process feels.",
    sections: [
      {
        heading: "Why do we exist?",
        body: "Studying in Germany is an achievable goal when you move forward with the right information. But scattered information, unclear steps and the feeling of going it alone make the process look harder than it is. We're here to fill that gap.",
      },
      {
        heading: "How do we approach it?",
        body: "Without judgement. You may have started late, have low grades, not yet have enough language skills, or have an unclear goal; none of that is an obstacle to starting a conversation. From where you are now, we look together at the options you can move forward with.",
      },
      {
        heading: "What changes for the student?",
        body: "Most resources are either too general or too technical; you meet a pile of information without knowing where you stand. We prioritise understanding your situation first, then giving the right information at the right time — a path talked through for your situation instead of a pile to sort through alone.",
      },
      {
        heading: "How does the journey to Germany unfold?",
        body: "We listen first, then guide. Throughout the process we keep track of which step comes when and answer your questions on time. We stay realistic when we make promises; we don't present a path that doesn't suit you as if it did.",
      },
      {
        heading: "What comes next?",
        body: "As this platform grows, it will be enriched with real student stories and real mentor profiles. Our priority for now stays the same: to be by your side with the same care and honesty in every conversation — our approach won't change as the numbers grow.",
      },
    ],
  },
  pricing: {
    title: "Pricing",
    intro:
      "We don't publish a fixed price list, because what you need depends on your situation. Instead, we first understand your situation, then clarify the scope and the fee that suit you together.",
    intake: {
      eyebrow: "First Step",
      title: "The first conversation",
      description:
        "Everything starts with a short introductory conversation. In it we listen to you and your goal and talk about which of the three scopes below could suit you. You don't need to have decided anything.",
      cta: "Start the First Conversation",
    },
    tiersTitle: "The scope that suits you",
    tiersSubtitle:
      "We offer three different scopes; we decide together which one suits you. The exact fee is clarified according to the scope we talk through.",
    tiers: [
      {
        id: "yol-haritasi",
        name: "Roadmap",
        tagline: "A one-off, clear direction",
        description:
          "If you want to clarify where to start or how to organise your application, this scope may be enough for you.",
        priceLabel: "We clarify it together in the conversation",
        includes: ["egitim-yonlendirme", "basvuru-sureci"],
        idealFor: "For those who are still at the research or application-preparation stage.",
        cta: "Let's Talk Details",
      },
      {
        id: "birebir-mentorluk",
        name: "One-to-One Mentorship",
        tagline: "Regular support throughout the process",
        description:
          "If a single conversation isn't enough, by staying in regular contact with a mentor you find timely answers to the questions that come up as the process moves on.",
        priceLabel: "We set it together according to the process",
        includes: ["egitim-yonlendirme", "basvuru-sureci", "mentorluk"],
        idealFor: "For those who want someone by their side throughout the process, not just once.",
        cta: "Let's Talk Details",
      },
      {
        id: "kapsamli-destek",
        name: "Comprehensive Support",
        tagline: "From your application to your first weeks in Germany",
        description:
          "If you'd like us with you for the whole process — from application to visa, from visa to your first weeks in Germany — we can talk through this scope.",
        priceLabel: "We plan it together according to your needs",
        includes: ["egitim-yonlendirme", "basvuru-sureci", "mentorluk", "vize-hazirlik", "almanyaya-hazirlik"],
        idealFor: "For those who want comprehensive support from the very start until they settle in Germany.",
        cta: "Let's Talk Details",
      },
    ],
    comparisonTitle: "Compare the scopes",
    comparisonNote: "Below you can see which services each scope includes. See the relevant service for details.",
    honestyNote:
      "The reason you don't see a clear number here isn't secrecy, it's honesty: giving a figure before your needs are clear wouldn't be realistic. You won't run into a surprise fee outside the scope we talked through in the conversation.",
    included: "In this scope",
    tableService: "Service",
    tableFee: "Fee",
    includedAria: "Included",
    cta: {
      title: "Let's talk about which scope suits you.",
      description: "You don't need to have decided. Tell us your situation and let's find the right scope together.",
      label: "Let's Talk About Your Journey",
    },
  },
  faq: {
    title: "Frequently asked questions",
    intro: "The answers to some of your questions may be right here. If you can't find them, you can ask us directly.",
    items: [
      {
        question: "I don't know where to start. Can I still get in touch?",
        answer: "Yes. Not knowing where to start is no obstacle to talking with us.",
        category: "General",
      },
      {
        question: "Is university free in Germany?",
        answer:
          "Most public universities don't charge tuition fees, but there is usually a semester contribution (Semesterbeitrag). The exact amount varies by university and federal state, and we can clarify it together based on your situation.",
        category: "Costs",
      },
      {
        question: "What level of German do I need?",
        answer:
          "Programmes taught in German usually ask for B2–C1; for programmes taught in English the language requirement can be different. If you share your level, we can look together at which paths are open to you.",
        category: "Studying in Germany",
      },
      {
        question: "Which programmes can I study?",
        answer:
          "Depending on your academic background and interests, many programmes may be possible. Rather than giving a definitive list, we prefer to look at your situation together and talk through realistic options.",
        category: "Studying in Germany",
      },
      {
        question: "Do I need the YKS (Türkiye's university entrance exam)?",
        answer:
          "It depends on which programme you apply to and by which route. Some routes don't require it, while in others your academic background is assessed differently. Let's clarify it by talking through your situation.",
        category: "Application & Visa Process",
      },
      {
        question: "How long does an application take?",
        answer:
          "It varies by university and programme; some processes take a few weeks, others a few months. As your target programme becomes clear, we can put together a timeline specific to you.",
        category: "Application & Visa Process",
      },
      {
        question: "Do you help with the visa?",
        answer:
          "Yes. We're with you on document preparation, appointment tracking and the questions that come up along the way; since the visa decision itself rests with the relevant consulate, we can't guarantee it.",
        category: "Application & Visa Process",
      },
      {
        question: "Does support continue after I go to Germany?",
        answer:
          "Yes. We can stay in touch on whatever you need during registration, your first weeks and your studies.",
        category: "Mentorship & Support",
      },
    ],
  },
  contact: {
    title: "Contact",
    intro: "You can reach us through whichever channel suits you best; they all lead to the same place: talking to a person.",
    whatsapp: {
      title: "WhatsApp",
      description: "Have a quick question? You can write to us directly.",
      cta: "Message Us on WhatsApp",
    },
    email: {
      title: "E-mail",
      description: "If you'd rather write in detail.",
      cta: "Send an E-mail",
    },
    formCta: {
      title: "Start by telling us your situation",
      description: "A few short questions help us get to know you and prepare a conversation that suits you.",
      cta: "Let's Talk About Your Journey",
    },
    photoCaption: "A conversation is starting",
    photoAlt: "Frankfurt, Germany",
  },
  bizeKatilin: {
    eyebrow: "Join Us",
    applyEyebrow: "Application",
    title: "You once didn't know where to start either.",
    intro: "If you have experience studying in Germany and would like to be a companion to someone on this path, we'd love to hear from you.",
    imageCaption: "Share your experience",
    sections: [
      {
        heading: "Why could you be a mentor?",
        body: "You studied in Germany, or you still do. You know how things like applying, the visa and settling into a new city feel. That experience makes a big difference to the person who comes after you.",
      },
      {
        heading: "Who are we looking for?",
        body: "We're not looking for a particular title. What we look for is having really been through the process and being willing to make time for a student's questions.",
      },
      {
        heading: "What would you do as a mentor?",
        body: "You listen to a student's situation and answer their questions; sometimes that's a single conversation, sometimes regular contact throughout the process. We'll talk together about how much time you can give.",
      },
      {
        heading: "How do we work?",
        body: "After your application we have a short introductory conversation. If it feels right, we match you with a student or a process that suits you.",
      },
    ],
    formTitle: "Application form",
    formDescription: "Let's start with a few details; we'll talk about the rest in our conversation.",
    fields: {
      firstName: "First name",
      lastName: "Last name",
      phone: "Phone / WhatsApp",
      email: "E-mail",
      germanyExperience: "What is your experience in Germany?",
      germanyExperiencePlaceholder: "Which city, which university/programme, when?",
      motivation: "Why do you want to be a mentor?",
      motivationPlaceholder: "A few sentences are enough.",
      message: "Anything you'd like to add?",
      messagePlaceholder: "You can write here if you like (optional).",
    },
    submit: { label: "Submit Application", loading: "Sending..." },
    success: {
      title: "Thank you.",
      description: "We've received your application. We'll get in touch with you after reviewing it.",
      backHome: "Back to Home",
    },
    error: { description: "There was a problem sending the form. Please try again." },
  },
  assessment: {
    contactValidation: "Please fill in your first name, last name, phone, e-mail and preferred contact method.",
    metaTitle: "Let's Get to Know You",
    metaDescription: "A few short questions help us understand your situation so we can prepare a conversation that suits you.",
    intro: {
      eyebrow: "Your Personal Roadmap",
      title: "Let's get to know you a little.",
      description:
        "To help you more accurately, we'll ask a few short questions. Filling in the form takes less than a few minutes.",
      startCta: "Let's Begin",
    },
    steps: [
      {
        id: "stage",
        question: "Which stage are you at right now?",
        type: "single",
        options: [
          { value: "researching", label: "I'm still researching" },
          { value: "choosing", label: "I'm looking at programmes / universities" },
          { value: "preparing", label: "I'm preparing to apply" },
          { value: "applied", label: "I've applied" },
          { value: "visa", label: "I'm in the visa process" },
          { value: "pre-departure", label: "I'm getting ready to move to Germany" },
          { value: "in-germany", label: "I'm already in Germany" },
          { value: "unsure", label: "I'm not sure" },
        ],
      },
      {
        id: "educationStatus",
        question: "What is your education status?",
        type: "single",
        options: [
          { value: "high-school-student", label: "I'm a high school student" },
          { value: "high-school-graduate", label: "I'm a high school graduate" },
          { value: "university-student", label: "I'm a university student" },
          { value: "university-graduate", label: "I'm a university graduate" },
          { value: "considering-masters", label: "I'm considering a master's degree" },
          { value: "other", label: "Other" },
        ],
      },
      {
        id: "interestArea",
        question: "Which field are you interested in?",
        type: "single",
        helper: "If it isn't clear yet, you can choose “I don't know yet”.",
        options: [
          { value: "engineering", label: "Engineering" },
          { value: "computer-it", label: "Computer science / IT" },
          { value: "business-economics", label: "Business / Economics" },
          { value: "health", label: "Health" },
          { value: "social-sciences", label: "Social sciences" },
          { value: "design-arts", label: "Design / Arts" },
          { value: "unknown", label: "I don't know yet" },
          { value: "other", label: "Other" },
        ],
      },
      {
        id: "germanLevel",
        question: "What is your German level?",
        type: "single",
        options: [
          { value: "undisclosed", label: "I'd rather not say" },
          { value: "none", label: "I haven't started yet" },
          { value: "a1", label: "A1" },
          { value: "a2", label: "A2" },
          { value: "b1", label: "B1" },
          { value: "b2", label: "B2" },
          { value: "c1", label: "C1" },
          { value: "c2", label: "C2" },
          { value: "native", label: "Native / fluent" },
        ],
      },
      {
        id: "englishLevel",
        question: "What is your English level?",
        type: "single",
        options: [
          { value: "undisclosed", label: "I'd rather not say" },
          { value: "none", label: "I haven't started yet" },
          { value: "a1", label: "A1" },
          { value: "a2", label: "A2" },
          { value: "b1", label: "B1" },
          { value: "b2", label: "B2" },
          { value: "c1", label: "C1" },
          { value: "c2", label: "C2" },
          { value: "native", label: "Native / fluent" },
        ],
      },
      {
        id: "target",
        question: "What would you like to do in Germany?",
        type: "single",
        options: [
          { value: "bachelor", label: "Bachelor's degree" },
          { value: "masters", label: "Master's degree" },
          { value: "language-course", label: "Language course" },
          { value: "studienkolleg", label: "Studienkolleg" },
          { value: "vocational", label: "Vocational training" },
          { value: "undecided", label: "I haven't decided yet" },
          { value: "other", label: "Other" },
        ],
      },
      {
        id: "timeline",
        question: "When are you thinking of starting?",
        type: "single",
        options: [
          { value: "next-term", label: "The nearest term" },
          { value: "6-months", label: "Within 6 months" },
          { value: "1-year", label: "Within 1 year" },
          { value: "1-year-plus", label: "After 1 year" },
          { value: "unsure", label: "I don't know yet" },
        ],
      },
      {
        id: "background",
        question: "Tell us a little about yourself, your education or your experience.",
        helper:
          "A few sentences about your academic background, standout experiences or what you expect from the consultation help your advisor get to know you before the conversation.",
        type: "text",
        placeholder: "A few sentences are enough.",
      },
      {
        id: "message",
        question: "Is there any other question or topic you'd like to share with us?",
        type: "text",
        placeholder: "You can write here if you like (optional).",
        optional: true,
      },
      {
        id: "referralSource",
        question: "How did you hear about us?",
        type: "single",
        options: [
          { value: "instagram", label: "Instagram" },
          { value: "linkedin", label: "LinkedIn" },
          { value: "google_search", label: "Google / web search" },
          { value: "university_campus", label: "University / campus" },
          { value: "friend_referral", label: "A friend / someone I know" },
          { value: "event_booth", label: "Event / booth" },
          { value: "whatsapp", label: "WhatsApp" },
          { value: "youtube", label: "YouTube" },
          { value: "other", label: "Other" },
        ],
      },
    ],
    referralOtherLabel: "Other (please specify briefly)",
    contactStep: {
      title: "How can we reach you?",
      description: "The last step. With these details we'll come to our conversation prepared.",
      fields: {
        firstName: "First name",
        lastName: "Last name",
        phone: "Phone / WhatsApp",
        email: "E-mail",
        preferredContact: "Your preferred contact method",
        preferredContactOptions: [
          { value: "whatsapp", label: "WhatsApp" },
          { value: "phone", label: "Phone" },
        ],
      },
    },
    submit: { label: "Submit", loading: "Sending..." },
    success: {
      title: "Thank you.",
      description:
        "We've received your details. Our team will review what you've shared and get in touch with you as soon as possible.",
      whatsappCta: "If you like, you can also message us on WhatsApp right now.",
      backHome: "Back to Home",
    },
    error: {
      title: "Something went wrong.",
      description: "There was a problem sending the form. You can try again or message us directly on WhatsApp.",
      retry: "Try Again",
    },
  },
  footer: {
    description:
      "For anyone who wants to move forward with their education in Germany: wherever you start, we find the next step together.",
    navTitle: "Pages",
    legalTitle: "Legal",
    legalLinks: [
      { label: "Privacy Policy", route: "privacy" },
      { label: "Personal Data Protection Notice (KVKK)", route: "kvkk" },
      { label: "Terms of Use", route: "terms" },
    ],
    rights: `© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.`,
  },
};
