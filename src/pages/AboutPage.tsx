import { Target, Eye, Heart, Sparkles, Mail, Zap, Users, Globe } from 'lucide-react';
import { type Route } from '@/hooks/useRouter';

interface AboutProps {
  navigate: (to: Route) => void;
}

const VALUES = [
  {
    icon: Target,
    title: 'Clarity first',
    description:
      'Every email should say exactly what it means and mean exactly what it says. We strip away the filler so your message lands.',
  },
  {
    icon: Heart,
    title: 'Respect for the reader',
    description:
      'Good writing respects people\'s time. Our drafts are tight, well-structured, and easy to act on.',
  },
  {
    icon: Zap,
    title: 'Speed without sloppiness',
    description:
      'Fast doesn\'t have to mean rough. EmailCraft balances a quick turnaround with phrasing you can actually send.',
  },
];

const STATS = [
  { icon: Mail, value: '5', label: 'Tone presets' },
  { icon: Zap, value: '<1s', label: 'Generation time' },
  { icon: Users, value: '100%', label: 'Browser-based' },
  { icon: Globe, value: '24/7', label: 'Always available' },
];

export function AboutPage({ navigate }: AboutProps) {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200/70 dark:border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-grid dark:bg-grid-dark [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/10" />

        <div className="container-app relative py-20">
          <span className="section-eyebrow animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" />
            Our story
          </span>
          <h1 className="mt-6 max-w-3xl font-sans text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            We believe everyone deserves to
            <span className="text-gradient"> sound like a pro</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            EmailCraft AI was born from a simple frustration: the gap between knowing what you want to say
            and finding the right words to say it. We close that gap, one email at a time.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="container-app py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="animate-fade-up">
            <span className="section-eyebrow">
              <Target className="h-3.5 w-3.5" />
              The mission
            </span>
            <h2 className="mt-5 font-sans text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Communication shouldn't be a barrier
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600 dark:text-slate-300">
              Whether you're following up on an interview, apologising for a delay, or making a polite
              request, the right tone makes all the difference. But most people aren't professional copywriters —
              and they shouldn't have to be.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
              EmailCraft AI gives you a head start on every message. You bring the intent; we bring the
              structure, phrasing, and polish. The result reads like you on your best day.
            </p>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
            <div className="card overflow-hidden p-0">
              <div className="grid grid-cols-2">
                {STATS.map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col items-center justify-center border-b border-r border-slate-200/80 p-8 text-center last:border-r-0 dark:border-white/10 [&:nth-child(odd)]:border-r [&:nth-last-child(-n+2)]:border-b-0"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                      <s.icon className="h-5 w-5" />
                    </span>
                    <span className="mt-3 font-sans text-3xl font-extrabold text-slate-900 dark:text-white">
                      {s.value}
                    </span>
                    <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white/60 py-16 dark:bg-white/[0.02]">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">
              <Eye className="h-3.5 w-3.5" />
              What we value
            </span>
            <h2 className="mt-5 font-sans text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Principles behind every draft
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <div
                key={v.title}
                className="card animate-fade-up p-7"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-sky-400 text-white shadow-lg shadow-brand-500/25">
                  <v.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-sans text-lg font-bold text-slate-900 dark:text-white">
                  {v.title}
                </h3>
                <p className="mt-3 leading-relaxed text-slate-500 dark:text-slate-400">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-app py-16">
        <div className="card flex flex-col items-center justify-between gap-6 p-10 text-center sm:p-12 md:flex-row md:text-left">
          <div>
            <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Ready to write better emails?
            </h2>
            <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-300">
              Try EmailCraft AI now — no account, no setup, just better drafts in seconds.
            </p>
          </div>
          <button onClick={() => navigate('home')} className="btn-primary shrink-0 text-base">
            <Sparkles className="h-5 w-5" />
            Start writing
          </button>
        </div>
      </section>
    </div>
  );
}
