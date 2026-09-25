import type { Locale } from "@/lib/i18n/config";
import type { RouteKey } from "@/lib/i18n/routes";

export type { Locale };

export interface StageOption {
  id: string;
  label: string;
  description: string;
  cta: string;
}

export interface ServiceItem {
  slug: string;
  title: string;
  shortDescription: string;
  problem: string;
  help: string;
  process: string[];
  scope: string;
  forWhom: string;
  nextStep: string;
}

/**
 * A real mentor's public profile. `photoSrc` is optional — when absent,
 * MentorProfile renders a lettered avatar in brand colors instead of a
 * stock/fake photo. Never seed this array with an invented person; leave
 * it empty until real data arrives.
 */
export interface Mentor {
  id: string;
  name: string;
  role: string;
  photoSrc?: string;
  bio: string;
  germanyExperience: string;
  education: string;
  specialty: string;
  quote?: string;
}

/**
 * A real student's journey. Never seed this array with an invented
 * student; leave it empty until real data, shared with the student's
 * consent, arrives.
 */
export interface StudentStory {
  id: string;
  name: string;
  photoSrc?: string;
  city: string;
  university: string;
  field: string;
  year: string;
  quote: string;
  startingPoint: string;
  problem: string;
  stepsTaken: string;
  now: string;
  /** Marks the story shown in the large editorial slot; first item wins if none is marked. */
  isFeatured?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  description: string;
  priceLabel: string;
  /** ServiceItem.slug values this tier draws on — never invented feature copy. */
  includes: string[];
  idealFor: string;
  cta: string;
}

export type AssessmentQuestionType = "single" | "text";

export interface AssessmentOption {
  value: string;
  label: string;
}

export interface AssessmentStep {
  id: string;
  question: string;
  helper?: string;
  type: AssessmentQuestionType;
  options?: AssessmentOption[];
  placeholder?: string;
  optional?: boolean;
}

export interface Dictionary {
  meta: {
    siteName: string;
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    /** One-line brand tagline (JSON-LD, share image alt). */
    tagline: string;
    /** Small uppercase line on the social-share image. */
    ogEyebrow: string;
  };
  /** Small strings shared by many components (aria labels, generic buttons, 404/error pages). */
  common: {
    skipToContent: string;
    mainNavLabel: string;
    moreNavLabel: string;
    mobileNavLabel: string;
    menuOpenLabel: string;
    menuCloseLabel: string;
    menuButtonOpen: string;
    menuButtonClose: string;
    back: string;
    next: string;
    backHome: string;
    whatsappWrite: string;
    sample: string;
    socialLinksLabel: string;
    sampleAccount: string;
    honeypotLabel: string;
    languageLabel: string;
    languageNames: Record<Locale, string>;
    notFound: { eyebrow: string; title: string; description: string; home: string; contact: string };
    error: { eyebrow: string; title: string; description: string; retry: string; home: string };
  };
  stories: {
    homeTitle: string;
    homeSubtitle: string;
    viewAll: string;
    pageTitle: string;
    pageIntro: string;
    pageDescription: string;
    empty: string;
    featuredLabel: string;
    startedFrom: string;
    stepsTaken: string;
    nowWhere: string;
    carouselLabel: string;
    previous: string;
    nextStory: string;
  };
  mentors: {
    ourMentors: string;
    germanyExperience: string;
    education: string;
    specialty: string;
  };
  joinUsCta: { eyebrow: string; title: string; description: string; cta: string };
  legal: {
    updatedLabel: string;
    privacy: {
      title: string;
      description: string;
      controller: { heading: string };
      collected: { heading: string; body: string };
      purpose: { heading: string; body: string };
      retention: {
        heading: string;
        bodyPrefix: string;
        withEmail: string;
        beforeLink: string;
        linkText: string;
        afterLink: string;
      };
    };
    kvkk: {
      title: string;
      description: string;
      subtitle: string;
      controller: { heading: string; mersis: string; taxOffice: string };
      data: { heading: string; body: string };
      purpose: { heading: string; body: string };
      rights: { heading: string; withEmail: string; beforeLink: string; linkText: string; afterLink: string };
    };
    terms: {
      title: string;
      description: string;
      scope: { heading: string; body: string };
      liability: { heading: string; body: string };
      contact: { heading: string; withEmail: string; beforeLink: string; linkText: string; afterLink: string };
    };
  };
  nav: {
    home: string;
    services: string;
    mentorship: string;
    studentStories: string;
    about: string;
    pricing: string;
    joinUs: string;
    faq: string;
    contact: string;
    more: string;
    ctaPrimary: string;
  };
  home: {
    hero: {
      eyebrow: string;
      title: string;
      subtitle: string;
      ctaPrimary: string;
      ctaSecondary: string;
      imageAlt: string;
    };
    journey: {
      eyebrow: string;
      title: string;
      description: string;
      mapOrigin: string;
      mapDestination: string;
    };
    stageSelector: {
      title: string;
      subtitle: string;
      stages: StageOption[];
      fallback: StageOption;
    };
    services: {
      title: string;
      subtitle: string;
      cta: string;
    };
    howWeWork: {
      title: string;
      subtitle: string;
      steps: { title: string; description: string }[];
    };
    mentorship: {
      title: string;
      description: string;
      cta: string;
      approachEyebrow: string;
      approachQuote: string;
    };
    universityExplorer: {
      eyebrow: string;
      title: string;
      description: string;
      rankingSourceLabel: string;
      rankLabel: string;
      prevAriaLabel: string;
      nextAriaLabel: string;
      exploreCta: string;
      indexButtonLabel: string;
      indexTitle: string;
      indexSearchPlaceholder: string;
      indexSearchAriaLabel: string;
      indexEmptyState: string;
      indexClose: string;
      photoPending: string;
    };
    humanConnection: {
      eyebrow: string;
      metadata: string;
      title: string;
      description: string;
      cta: string;
      imageSrc: string;
      imageAlt: string;
    };
    faqPreview: {
      title: string;
      cta: string;
    };
    finalCta: {
      eyebrow: string;
      title: string;
      description: string;
      ctaPrimary: string;
      ctaSecondary: string;
    };
  };
  services: {
    title: string;
    intro: string;
    items: ServiceItem[];
    labels: { problem: string; help: string; forWhom: string; process: string; scope: string };
  };
  mentorship: {
    title: string;
    intro: string;
    sections: { heading: string; body: string }[];
    processTitle: string;
    process: { title: string; description: string }[];
    cta: { title: string; description: string; label: string };
  };
  about: {
    title: string;
    intro: string;
    sections: { heading: string; body: string }[];
    /** Optional real photo (team/office) — omitted, not stock art, until one exists. */
    imageSrc?: string;
    imageAlt?: string;
  };
  pricing: {
    title: string;
    intro: string;
    intake: { eyebrow: string; title: string; description: string; cta: string };
    tiersTitle: string;
    tiersSubtitle: string;
    tiers: PricingTier[];
    comparisonTitle: string;
    comparisonNote: string;
    honestyNote: string;
    included: string;
    tableService: string;
    tableFee: string;
    includedAria: string;
    cta: { title: string; description: string; label: string };
  };
  faq: {
    title: string;
    intro: string;
    items: FaqItem[];
  };
  contact: {
    title: string;
    intro: string;
    whatsapp: { title: string; description: string; cta: string };
    email: { title: string; description: string; cta: string };
    formCta: { title: string; description: string; cta: string };
    photoCaption: string;
    photoAlt: string;
    /** The in-page "write to us" composer — sends via Server Action +
     * Apps Script's MailApp, never a mailto: link. Category KEYS
     * (general/consulting/...) are fixed and locale-independent (see
     * lib/validation/contact.ts); only their labels here are localized. */
    composer: {
      title: string;
      description: string;
      emailLabel: string;
      emailPlaceholder: string;
      categoryLabel: string;
      categories: { general: string; consulting: string; billing: string; complaint: string; technical: string; website: string; other: string };
      subjectLabel: string;
      subjectPlaceholder: string;
      messageLabel: string;
      /** One placeholder per category — complaint/technical/website get a
       * more specific prompt; the rest share the generic one. */
      messagePlaceholders: { general: string; consulting: string; billing: string; complaint: string; technical: string; website: string; other: string };
      honeypotLabel: string;
      submit: string;
      submitting: string;
      successTitle: string;
      successBody: string;
      errorTitle: string;
      errorBody: string;
      retry: string;
    };
  };
  bizeKatilin: {
    eyebrow: string;
    applyEyebrow: string;
    title: string;
    intro: string;
    imageCaption: string;
    sections: { heading: string; body: string }[];
    formTitle: string;
    formDescription: string;
    fields: {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
      germanyExperience: string;
      germanyExperiencePlaceholder: string;
      motivation: string;
      motivationPlaceholder: string;
      message: string;
      messagePlaceholder: string;
    };
    submit: { label: string; loading: string };
    success: { title: string; description: string; backHome: string };
    error: { description: string };
  };
  assessment: {
    intro: { eyebrow: string; title: string; description: string; startCta: string };
    steps: AssessmentStep[];
    /** Shown when the visitor tries to submit with a required contact field empty. */
    contactValidation: string;
    metaTitle: string;
    metaDescription: string;
    /** Label for the free-text input shown only when the "referralSource"
     * step is answered "other" — not part of the generic AssessmentStep
     * shape since no other step needs a conditional follow-up field. */
    referralOtherLabel: string;
    contactStep: {
      title: string;
      description: string;
      fields: {
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        preferredContact: string;
        preferredContactOptions: AssessmentOption[];
      };
    };
    submit: { label: string; loading: string };
    success: {
      title: string;
      description: string;
      whatsappCta: string;
      backHome: string;
    };
    error: { title: string; description: string; retry: string };
  };
  footer: {
    description: string;
    navTitle: string;
    legalTitle: string;
    legalLinks: { label: string; route: RouteKey }[];
    rights: string;
  };
}
