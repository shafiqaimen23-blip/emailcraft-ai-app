import { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Mail,
  User,
  Wand2,
  Type,
  AlertCircle,
} from 'lucide-react';
import {
  TONES,
  generateEmail,
  emailToPlainText,
  type EmailTone,
  type GeneratedEmail,
} from '@/lib/emailEngine';

const TONE_ICONS: Record<EmailTone, typeof Sparkles> = {
  professional: Wand2,
  friendly: Sparkles,
  formal: Mail,
  apology: AlertCircle,
  request: User,
};

const TONE_ACCENTS: Record<EmailTone, string> = {
  professional: 'from-brand-500 to-sky-400',
  friendly: 'from-emerald-500 to-teal-400',
  formal: 'from-slate-600 to-slate-400',
  apology: 'from-amber-500 to-orange-400',
  request: 'from-violet-500 to-fuchsia-400',
};

export function EmailGenerator() {
  const [purpose, setPurpose] = useState('');
  const [recipient, setRecipient] = useState('');
  const [tone, setTone] = useState<EmailTone>('professional');
  const [email, setEmail] = useState<GeneratedEmail | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const [regenCount, setRegenCount] = useState(0);
  const [error, setError] = useState('');

  const canGenerate = purpose.trim().length > 0 && recipient.trim().length > 0;

  const handleGenerate = (isRegenerate = false) => {
    if (!canGenerate) {
      setError('Please fill in both the purpose and the recipient.');
      return;
    }
    setError('');
    setIsGenerating(true);
    // Simulate a brief "AI thinking" delay for a polished feel.
    setTimeout(() => {
      const seed = isRegenerate ? `${Date.now()}-${regenCount + 1}` : '';
      const result = generateEmail({ purpose: purpose.trim(), recipient: recipient.trim(), tone }, seed);
      setEmail(result);
      setRegenCount((c) => c + 1);
      setIsGenerating(false);
    }, 650);
  };

  const handleCopy = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(emailToPlainText(email));
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch {
      setError('Could not copy to clipboard. Please select the text manually.');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      {/* Input panel */}
      <div className="card animate-fade-up p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            <Wand2 className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-sans text-lg font-bold text-slate-900 dark:text-white">
              Compose your email
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tell us what you need — we'll handle the rest.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Purpose */}
          <div>
            <label htmlFor="purpose" className="label-text">
              Purpose of the email
            </label>
            <textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={3}
              placeholder="e.g. follow up after a job interview last Tuesday"
              className="input-field resize-none"
            />
          </div>

          {/* Recipient */}
          <div>
            <label htmlFor="recipient" className="label-text">
              Recipient
            </label>
            <input
              id="recipient"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Sarah Chen or sarah@acme.com"
              className="input-field"
            />
          </div>

          {/* Tone selector */}
          <div>
            <span className="label-text">Select a tone</span>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {TONES.map((t) => {
                const Icon = TONE_ICONS[t.id];
                const selected = tone === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id)}
                    className={`group relative flex flex-col items-start gap-2 rounded-2xl border p-3 text-left transition-all ${
                      selected
                        ? 'border-brand-500 bg-brand-50 shadow-glow dark:border-brand-400 dark:bg-brand-500/10'
                        : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/50 dark:border-white/10 dark:bg-white/5 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/5'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${TONE_ACCENTS[t.id]} text-white shadow-sm transition-transform group-hover:scale-110`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        selected
                          ? 'text-brand-700 dark:text-brand-300'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400">
              {TONES.find((t) => t.id === tone)?.blurb}
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Generate */}
          <button
            onClick={() => handleGenerate(false)}
            disabled={!canGenerate || isGenerating}
            className="btn-primary w-full text-base"
          >
            {isGenerating && !email ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Email
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output panel */}
      <div className="card animate-fade-up p-6 sm:p-8" style={{ animationDelay: '80ms' }}>
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-sans text-lg font-bold text-slate-900 dark:text-white">
                Your email
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {email ? 'Ready to copy and send.' : 'Your generated email will appear here.'}
              </p>
            </div>
          </div>
          {email && (
            <button
              onClick={() => handleCopy()}
              className="btn-ghost shrink-0 px-4 py-2.5"
            >
              {copyState === 'copied' ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </button>
          )}
        </div>

        {isGenerating && !email ? (
          <GeneratingSkeleton />
        ) : email ? (
          <div className="space-y-5">
            {/* Subject */}
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <Type className="h-3.5 w-3.5" />
                Subject line
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-100">
                {email.subject}
              </div>
            </div>

            {/* Body */}
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <Mail className="h-3.5 w-3.5" />
                Complete email
              </div>
              <div className="max-h-[420px] overflow-y-auto rounded-2xl border border-slate-200 bg-white px-5 py-4 scrollbar-thin dark:border-white/10 dark:bg-slate-900/60">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  {email.body}
                </pre>
              </div>
            </div>

            {/* Regenerate */}
            <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Not quite right? Try another variation.
              </p>
              <button
                onClick={() => handleGenerate(true)}
                disabled={isGenerating}
                className="btn-ghost w-full px-4 py-2.5 sm:w-auto"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Regenerate
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function GeneratingSkeleton() {
  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 h-3 w-24 rounded bg-slate-200 animate-pulse-soft dark:bg-slate-700" />
        <div className="h-12 w-full rounded-2xl bg-slate-100 animate-pulse-soft dark:bg-slate-800/60" />
      </div>
      <div>
        <div className="mb-2 h-3 w-24 rounded bg-slate-200 animate-pulse-soft dark:bg-slate-700" />
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900/60">
          <div className="h-4 w-3/4 rounded bg-slate-100 animate-pulse-soft dark:bg-slate-800/60" />
          <div className="h-4 w-full rounded bg-slate-100 animate-pulse-soft dark:bg-slate-800/60" />
          <div className="h-4 w-5/6 rounded bg-slate-100 animate-pulse-soft dark:bg-slate-800/60" />
          <div className="h-4 w-full rounded bg-slate-100 animate-pulse-soft dark:bg-slate-800/60" />
          <div className="h-4 w-2/3 rounded bg-slate-100 animate-pulse-soft dark:bg-slate-800/60" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-16 text-center dark:border-white/10 dark:bg-slate-900/40">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-sky-100 text-brand-500 dark:from-brand-500/20 dark:to-sky-500/20 dark:text-brand-300">
        <Mail className="h-8 w-8" />
      </span>
      <h3 className="mt-5 font-sans text-base font-bold text-slate-700 dark:text-slate-200">
        No email yet
      </h3>
      <p className="mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-400">
        Fill in the purpose and recipient, choose a tone, and hit Generate to craft your email.
      </p>
    </div>
  );
}
