import type {
  ExamplePrompt,
  FaqItem,
  FeatureCard,
  HighlightMetric,
  ProductCard,
  StepCard,
} from "@/lib/types";

export const NAV_LINKS = [
  { label: "Products", href: "/#products" },
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
];

export const PRODUCT_CARDS: ProductCard[] = [
  {
    title: "Mobile Keyboard",
    description:
      "Type Latin-script Amharic on your phone and get ranked Fidel suggestions without leaving your conversation flow.",
    href: "/#products",
    badge: "Android-first typing",
  },
  {
    title: "Browser Extension",
    description:
      "Detect text fields on the web and bring in-line transliteration where you already write: forms, chat boxes, and editors.",
    href: "/#products",
    badge: "Works inside inputs",
  },
  {
    title: "Paragraph Transliterator",
    description:
      "Move longer drafts, notes, captions, and classwork into Amharic script with a focused editor inspired by premium writing tools.",
    href: "/paragraph-transliterator",
    badge: "Live web workspace",
  },
];

export const FEATURE_CARDS: FeatureCard[] = [
  {
    title: "Ranked candidate output",
    description:
      "Surface multiple Amharic-script options for each request so users can choose the closest wording instead of settling for a single guess.",
  },
  {
    title: "Model-aware workflow",
    description:
      "Expose the backend model catalog directly in the UI so users can switch between bundled transliteration models when needed.",
  },
  {
    title: "Built for mixed writing",
    description:
      "Handle punctuation and surrounding non-Latin text gracefully, which makes the product useful in real chat, school, and work writing.",
  },
  {
    title: "Designed for fast iteration",
    description:
      "Keep the layout familiar for users who already like productivity tools such as QuillBot, while tailoring the experience to Amharic transliteration.",
  },
];

export const HOW_IT_WORKS_STEPS: StepCard[] = [
  {
    title: "Write in Latin script",
    description:
      "Start with the spelling users already know. The interface supports quick examples so new visitors understand the workflow instantly.",
  },
  {
    title: "Select the best suggestion",
    description:
      "The backend returns ranked candidate outputs, and the UI highlights the best result while keeping alternatives visible.",
  },
  {
    title: "Use it anywhere",
    description:
      "Continue in the browser tool, or move to the keyboard and extension experiences for the same transliteration journey in other contexts.",
  },
];

export const HIGHLIGHT_METRICS: HighlightMetric[] = [
  { value: "3", label: "product surfaces in one suite" },
  { value: "10", label: "maximum ranked candidates per request" },
  { value: "2000", label: "characters supported per paragraph request" },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What does the paragraph transliterator do?",
    answer:
      "It lets users type Amharic words with Latin letters, send the text to the backend transliteration API, and review the returned Amharic-script output plus ranked alternatives.",
  },
  {
    question: "Does the landing page use the real backend?",
    answer:
      "Yes. The tool page is designed to fetch available models from `/v1/models` and send transliteration requests to `/v1/transliterate`.",
  },
  {
    question: "Why is the design inspired by QuillBot?",
    answer:
      "The goal is to borrow the clarity, conversion flow, and polished editor feel that users recognize from premium writing tools, while keeping the branding and copy specific to your product.",
  },
  {
    question: "Can this support the keyboard app and extension too?",
    answer:
      "Yes. The homepage is structured as a product suite so future deep links, install CTAs, and release messaging for those tools can be added without redesigning the entire site.",
  },
];

export const EXAMPLE_PROMPTS: ExamplePrompt[] = [
  {
    title: "Greeting",
    text: "selam new endet neh",
  },
  {
    title: "Class note",
    text: "ye project gize kalew conference lay presentation yihonal",
  },
  {
    title: "Message draft",
    text: "betam des yiblal zare mels endemenhon ewedalew",
  },
];

export const MAX_INPUT_CHARS = 2000;
export const DEFAULT_TOP_K = 3;
