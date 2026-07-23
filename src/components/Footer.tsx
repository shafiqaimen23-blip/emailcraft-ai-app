import { Mail, Github, Twitter, Heart } from 'lucide-react';
import { type Route } from '@/hooks/useRouter';

interface FooterProps {
  navigate: (to: Route) => void;
}

export function Footer({ navigate }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-slate-200/70 bg-white/60 dark:border-white/10 dark:bg-slate-950/40">
      <div className="container-app py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-sky-400 text-white shadow-lg shadow-brand-500/30">
                <Mail className="h-5 w-5" />
              </span>
              <span className="font-sans text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                EmailCraft<span className="text-gradient"> AI</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Write professional emails in seconds. Pick a tone, describe your goal, and get a polished message ready to send.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[
                { icon: Twitter, label: 'Twitter' },
                { icon: Github, label: 'GitHub' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/10 dark:hover:text-brand-300"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Pages
            </h3>
            <ul className="mt-4 space-y-3">
              {([
                { label: 'Home', route: 'home' as Route },
                { label: 'About', route: 'about' as Route },
                { label: 'Contact', route: 'contact' as Route },
              ]).map((link) => (
                <li key={link.route}>
                  <button
                    onClick={() => navigate(link.route)}
                    className="text-sm text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tones */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Tones
            </h3>
            <ul className="mt-4 space-y-3">
              {['Professional', 'Friendly', 'Formal', 'Apology', 'Request'].map((tone) => (
                <li key={tone}>
                  <button
                    onClick={() => navigate('home')}
                    className="text-sm text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                  >
                    {tone}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200/70 pt-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400 sm:flex-row">
          <p>&copy; {year} EmailCraft AI. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Crafted with <Heart className="h-4 w-4 fill-brand-500 text-brand-500" /> for better communication
          </p>
        </div>
      </div>
    </footer>
  );
}
