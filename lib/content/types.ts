export type Locale = "tr" | "en" | "de";

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
    };
    journey: {
      eyebrow: string;
      title: string;
      description: string;
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
    };
    visualStory: {
      eyebrow: string;
      title: string;
      description: string;
      captions: [string, string, string];
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
  };
  bizeKatilin: {
    eyebrow: string;
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
        note: string;
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
    legalLinks: { label: string; href: string }[];
    rights: string;
  };
}
