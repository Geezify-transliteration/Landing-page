import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Globe,
  Keyboard,
  Layers3,
  MessageSquareText,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { Link } from "react-router-dom";
import SectionShell from "@/components/layout/SectionShell";
import {
  FAQ_ITEMS,
  FEATURE_CARDS,
  HIGHLIGHT_METRICS,
  HOW_IT_WORKS_STEPS,
  PRODUCT_CARDS,
} from "@/lib/constants";

export const AnnouncementBar = () => {
  return (
    <div className="border-b border-white/10 bg-plum-950/[0.45] px-4 py-3 text-center text-sm text-plum-100">
      New in the suite: a dedicated paragraph transliteration workspace for longer drafts and study notes.
      <Link to="/paragraph-transliterator" className="ml-2 inline-flex items-center gap-1 font-semibold text-white">
        Try it now <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

export const HeroSection = () => {
  return (
    <section className="overflow-hidden bg-hero px-4 pb-20 pt-16 text-white sm:px-6 lg:px-8 lg:pb-28 lg:pt-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.15] bg-white/10 px-4 py-2 text-sm font-medium text-plum-100">
            <Sparkles className="h-4 w-4" />
            Amharic transliteration for every writing surface
          </span>

          <h1 className="mt-8 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
            Type Latin-script Amharic. Publish polished Fidel output anywhere.
          </h1>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link to="/paragraph-transliterator" className="btn-primary">
              Launch paragraph tool
            </Link>
            <a href="#products" className="btn-secondary">
              Explore the full suite
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-plum-100">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-plum-300" /> Ranked candidate outputs
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-plum-300" /> Real backend integration
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-plum-300" /> Shared design across devices
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-[2rem] bg-plum-400/25 blur-3xl" />
          <div className="glass-dark relative overflow-hidden rounded-[2rem] border border-white/[0.12] p-5 shadow-glow">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-plum-100">
                    Input
                  </span>
                  <Keyboard className="h-4 w-4 text-plum-200" />
                </div>
                <p className="text-sm leading-7 text-plum-100">
                  selam new endet neh? zare conference lay presentation alen.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white p-5 text-ink">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-plum-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-plum-700">
                    Best output
                  </span>
                  <Wand2 className="h-4 w-4 text-plum-700" />
                </div>
                <p className="text-sm font-medium leading-7">ሰላም ነው እንዴት ነህ? ዛሬ ኮንፈረንስ ላይ ፕሬዘንቴሽን አለን።</p>
                <div className="mt-4 grid gap-2">
                  <div className="rounded-2xl bg-plum-50 px-3 py-2 text-xs text-slate-600">Alternative 1: higher confidence spelling</div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-500">Alternative 2: contextual variant</div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-plum-200">Product 01</p>
                <p className="mt-2 font-medium">Paragraph transliteration</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-plum-200">Product 02</p>
                <p className="mt-2 font-medium">Browser field assistant</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-plum-200">Product 03</p>
                <p className="mt-2 font-medium">Mobile keyboard suggestions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ProductSuiteSection = () => {
  const iconMap = [Keyboard, Globe, MonitorSmartphone];

  return (
    <SectionShell
      id="products"
      eyebrow="Product Suite"
      title="Three connected experiences, one transliteration brand."
      description="The homepage makes each surface feel like part of the same system so users understand the broader product story immediately."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {PRODUCT_CARDS.map((product, index) => {
          const Icon = iconMap[index];

          return (
            <article key={product.title} className="card-surface flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-plum-100 text-plum-700">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-plum-50 px-3 py-1 text-xs font-semibold text-plum-700">{product.badge}</span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-ink">{product.title}</h3>
              <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">{product.description}</p>
              <Link to={product.href} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-plum-700">
                Explore product <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
};

export const FeatureGridSection = () => {
  const iconMap = [Layers3, ShieldCheck, MessageSquareText, Sparkles];

  return (
    <SectionShell
      id="features"
      eyebrow="Why It Feels Premium"
      title="A writing-tool interface tailored for Amharic transliteration."
      description="The UI uses familiar SaaS conversion patterns while remaining tightly connected to the actual backend capabilities you already have."
      align="center"
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {FEATURE_CARDS.map((feature, index) => {
          const Icon = iconMap[index];

          return (
            <div key={feature.title} className="card-surface">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-plum-100 text-plum-700">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-ink">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
};

export const HowItWorksSection = () => {
  return (
    <SectionShell
      id="how-it-works"
      eyebrow="How It Works"
      title="Simple enough for first-time visitors, strong enough for real use."
      description="The interaction flow mirrors the best parts of modern editor products: clear input, fast result visibility, and obvious next steps."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {HOW_IT_WORKS_STEPS.map((step, index) => (
          <div key={step.title} className="card-surface">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-plum-600 text-sm font-semibold text-white">
              0{index + 1}
            </span>
            <h3 className="mt-6 text-xl font-semibold text-ink">{step.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
};

export const TrustSection = () => {
  return (
    <SectionShell
      eyebrow="Capability Snapshot"
      title="Built around the real backend limits and strengths."
      description="Instead of generic marketing filler, the page surfaces meaningful product constraints and capabilities that align with your FastAPI service."
      className="pb-10"
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card-surface bg-cta text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-plum-100">What visitors learn instantly</p>
          <h3 className="mt-4 text-3xl font-semibold">One focused brand for Amharic typing and transliteration.</h3>
          <p className="mt-4 text-sm leading-7 text-plum-50">
            The page explains where the product works today and gives users a clear path into the most compelling experience: the paragraph workspace.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {HIGHLIGHT_METRICS.map((metric) => (
            <div key={metric.label} className="card-surface">
              <p className="text-4xl font-semibold text-plum-700">{metric.value}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
};

export const FaqSection = () => {
  return (
    <SectionShell
      id="faq"
      eyebrow="FAQ"
      title="Common questions, answered clearly."
      description="This section keeps the landing experience conversion-focused while also setting the right technical expectations for demos and reviewers."
    >
      <div className="grid gap-4">
        {FAQ_ITEMS.map((item) => (
          <article key={item.question} className="card-surface">
            <h3 className="text-lg font-semibold text-ink">{item.question}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
};

export const FinalCtaSection = () => {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] bg-cta px-8 py-12 text-white shadow-glow sm:px-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-plum-100">
                Ready to demo
              </span>
              <h2 className="mt-5 text-3xl font-semibold sm:text-4xl">
                Launch the purple transliteration experience and show the backend working live.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-plum-50">
                The dedicated tool page is designed to feel familiar to users of polished writing apps while staying grounded in the transliteration models your backend already ships with.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
              <Link to="/paragraph-transliterator" className="btn-light">
                Open paragraph tool
              </Link>
              <a href="#products" className="btn-secondary border-white/25 text-white hover:bg-white/10">
                Review product suite
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
