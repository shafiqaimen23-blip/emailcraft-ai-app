import { useState, type FormEvent } from 'react';
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Loader2,
} from 'lucide-react';
import { supabase, type ContactMessage } from '@/lib/supabaseClient';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const CONTACT_DETAILS = [
  { icon: Mail, label: 'Email us', value: 'hello@emailcraft.ai' },
  { icon: Clock, label: 'Response time', value: 'Usually within 24 hours' },
  { icon: MapPin, label: 'Based in', value: 'Everywhere there\'s an inbox' },
];

export function ContactPage() {
  const [form, setForm] = useState<ContactMessage>({ name: '', email: '', subject: '', message: '' });
  const [state, setState] = useState<SubmitState>('idle');
  const [error, setError] = useState('');

  const handleChange = (field: keyof ContactMessage) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setState('submitting');
    setError('');

    const { error: insertError } = await supabase.from('contact_messages').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    });

    if (insertError) {
      setState('error');
      setError('Something went wrong while sending your message. Please try again in a moment.');
      return;
    }

    setState('success');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const canSubmit =
    form.name.trim() &&
    form.email.trim() &&
    form.subject.trim() &&
    form.message.trim() &&
    state !== 'submitting';

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200/70 dark:border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-grid dark:bg-grid-dark [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-brand-300/20 blur-3xl dark:bg-brand-500/10" />

        <div className="container-app relative py-20">
          <span className="section-eyebrow animate-fade-in">
            <MessageSquare className="h-3.5 w-3.5" />
            Get in touch
          </span>
          <h1 className="mt-6 max-w-3xl font-sans text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            We'd love to
            <span className="text-gradient"> hear from you</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Have a question, a feature idea, or just want to share how EmailCraft AI worked for you?
            Drop us a line below.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container-app py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          {/* Info column */}
          <div className="space-y-5">
            <div className="card animate-fade-up p-7">
              <h2 className="font-sans text-lg font-bold text-slate-900 dark:text-white">
                Reach out directly
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                We read every message and do our best to reply promptly.
              </p>
              <div className="mt-6 space-y-5">
                {CONTACT_DETAILS.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {label}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-slate-700 dark:text-slate-200">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card animate-fade-up overflow-hidden p-0" style={{ animationDelay: '80ms' }}>
              <div className="bg-gradient-to-br from-brand-600 via-brand-500 to-sky-500 p-7 text-white">
                <h3 className="font-sans text-base font-bold">Tip for better emails</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-50">
                  When describing what you need help with, include the context and the outcome you want.
                  The more specific you are, the better the result.
                </p>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="card animate-fade-up p-7 sm:p-8" style={{ animationDelay: '60ms' }}>
            {state === 'success' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </span>
                <h2 className="mt-5 font-sans text-xl font-bold text-slate-900 dark:text-white">
                  Message sent!
                </h2>
                <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                  Thanks for reaching out. We'll get back to you at the email address you provided.
                </p>
                <button
                  onClick={() => setState('idle')}
                  className="btn-ghost mt-6"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="label-text">
                      Your name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange('name')}
                      placeholder="Alex Morgan"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="label-text">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange('email')}
                      placeholder="alex@example.com"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="label-text">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={form.subject}
                    onChange={handleChange('subject')}
                    placeholder="What's this about?"
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="label-text">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={handleChange('message')}
                    placeholder="Tell us what's on your mind..."
                    className="input-field resize-none"
                  />
                </div>

                {state === 'error' && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="btn-primary w-full text-base"
                >
                  {state === 'submitting' ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
