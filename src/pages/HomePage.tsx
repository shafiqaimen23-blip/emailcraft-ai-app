import { Sparkles, Zap, ShieldCheck, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { EmailGenerator } from '@/components/EmailGenerator';
import { type Route } from '@/hooks/useRouter';

interface HomeProps {
  navigate: (to: Route) => void;
}

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant generation',
    description: 'Get a subject line and full message in seconds — no blank-page anxiety, no rewrites.',
  },
  {
    icon: Sparkles,
    title: 'Five tailored tones',
    description: 'Professional, friendly, formal, apology, or request — each crafted with the right phrasing.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by design',
    description: 'Your drafts are generated in your browser. Nothing is sent anywhere without your say-so.',
  },
  {
    icon: Clock,
    title: 'Save real time',
    description: 'Skip the deliberation over every word. Focus on what you want to say, not how to phrase it.',
  },
];

const STEPS = [
  { step: '01', title: 'Describe the purpose', description: 'Tell EmailCraft what the email is for, in plain words.' },
  { step: '02', title: 'Name the recipient', description: 'Add a name or email so the greeting feels personal.' },
  { step: '03', title: 'Pick a tone', description: 'Choose from five tones calibrated for the situation.' },
  { step: '04', title: 'Copy and send', description: 'Regenerate until it feels right, then copy it to your inbox.' },
];

export function HomePage({ navigate }: HomeProps) {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid dark:bg-grid-dark [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[680px] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-400/30 to-sky-300/20 blur-3xl dark:from-brand-600/20 dark:to-sky-500/10" />

        <div className="container-app relative pt-20 pb-10 text-center sm:pt-28">
          <span className="section-eyebrow animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered email writing
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl font-sans text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
            Write professional emails
            <span className="block text-gradient">in seconds, not hours</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            EmailCraft AI turns a one-line goal into a polished, ready-to-send message. Choose your tone,
            describe your intent, and let the words fall into place.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#generator"
              className="btn-primary text-base"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              Start writing
              <ArrowRight className="h-5 w-5" />
            </a>
            <button onClick={() => navigate('about')} className="btn-ghost text-base">
              How it works
            </button>
          </div>

          {/* Trust row */}
          <div className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            {['No sign-up needed', 'Five tone presets', 'Copy with one click'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-brand-500" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Generator */}
      <section id="generator" className="container-app scroll-mt-20 py-12">
        <EmailGenerator />
      </section>

      {/* Features */}
      <section className="container-app py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">
            <Zap className="h-3.5 w-3.5" />
            Why EmailCraft
          </span>
          <h2 className="mt-5 font-sans text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Everything you need to sound like your best self
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Thoughtful defaults, real variation on every regenerate, and a tone for every situation.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="card animate-fade-up p-6 transition-transform hover:-translate-y-1"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-sky-400 text-white shadow-lg shadow-brand-500/25">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-sans text-base font-bold text-slate-900 dark:text-white">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white/60 py-16 dark:bg-white/[0.02]">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">
              <Clock className="h-3.5 w-3.5" />
              Four simple steps
            </span>
            <h2 className="mt-5 font-sans text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              From blank page to send in under a minute
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div
                key={s.step}
                className="relative animate-fade-up rounded-3xl border border-slate-200/80 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className="font-sans text-3xl font-extrabold text-brand-200 dark:text-brand-500/40">
                  {s.step}
                </span>
                <h3 className="mt-3 font-sans text-base font-bold text-slate-900 dark:text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-app py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-sky-500 p-10 text-center shadow-glow sm:p-14">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
          <div className="relative">
            <h2 className="font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Stop staring at the blinking cursor
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-50">
              Craft your next email the smart way. It takes one sentence and a click.
            </p>
            <a
              href="#generator"
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-base font-semibold text-brand-700 shadow-lg transition-all hover:bg-brand-50 active:scale-[0.98]"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              Generate an email now
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
