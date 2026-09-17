/**
 * Off by default — real visitors never see placeholder people. Set
 * NEXT_PUBLIC_SHOW_DEMO_CONTENT=true locally/in a preview deploy only, to
 * preview how student-stories/mentor sections look before real content
 * exists. Every place that reads this also renders a visible "Örnek"
 * label whenever it's on, so an accidentally-enabled flag in production
 * still can't be mistaken for real people.
 */
export const demoContentEnabled = process.env.NEXT_PUBLIC_SHOW_DEMO_CONTENT === "true";
