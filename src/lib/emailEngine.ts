export type EmailTone = 'professional' | 'friendly' | 'formal' | 'apology' | 'request';

export interface EmailInput {
  purpose: string;
  recipient: string;
  tone: EmailTone;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
  greeting: string;
  signoff: string;
}

export interface ToneMeta {
  id: EmailTone;
  label: string;
  blurb: string;
}

export const TONES: ToneMeta[] = [
  { id: 'professional', label: 'Professional', blurb: 'Clear, polished, and on point for the workplace.' },
  { id: 'friendly', label: 'Friendly', blurb: 'Warm and approachable while staying respectful.' },
  { id: 'formal', label: 'Formal', blurb: 'Structured and courteous for official correspondence.' },
  { id: 'apology', label: 'Apology', blurb: 'Sincere, accountable, and focused on making it right.' },
  { id: 'request', label: 'Request', blurb: 'Direct and persuasive without being pushy.' },
];

/**
 * Deterministic pseudo-random generator seeded from the input + a salt.
 * Lets "Regenerate" produce fresh, varied output while staying reproducible
 * for a given seed (useful if we ever want to recall a previous version).
 */
function makeRng(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

const GREETINGS: Record<EmailTone, string[]> = {
  professional: ['Hi {name},', 'Hello {name},', 'Dear {name},'],
  friendly: ['Hi {name}!', 'Hey {name},', 'Hello {name},'],
  formal: ['Dear {name},', 'Greetings {name},', 'To {name},'],
  apology: ['Dear {name},', 'Hi {name},', 'Hello {name},'],
  request: ['Hi {name},', 'Hello {name},', 'Dear {name},'],
};

const SIGNOFFS: Record<EmailTone, string[]> = {
  professional: ['Best regards,', 'Kind regards,', 'Best,'],
  friendly: ['Warmly,', 'Cheers,', 'Best,'],
  formal: ['Respectfully,', 'Sincerely,', 'Yours faithfully,'],
  apology: ['With sincere apologies,', 'Sincerely,', 'Best regards,'],
  request: ['Thank you for your time,', 'Best regards,', 'I appreciate your help,'],
};

const SENDER_NAME = 'Alex Morgan';

function resolveName(recipient: string): string {
  const trimmed = recipient.trim();
  if (!trimmed) return 'there';
  // If the recipient looks like a name (no @ or a single word), use it directly.
  if (!trimmed.includes('@')) {
    return trimmed.split(/\s+/)[0];
  }
  // It's an email address: try to derive a friendly name from the local part.
  const local = trimmed.split('@')[0];
  const cleaned = local.replace(/[._-]+/g, ' ').trim();
  if (!cleaned) return 'there';
  const first = cleaned.split(/\s+/)[0];
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

function deriveRecipientContext(recipient: string): { name: string; display: string } {
  const trimmed = recipient.trim();
  if (!trimmed) return { name: 'there', display: 'the recipient' };
  const name = resolveName(trimmed);
  const display = trimmed.includes('@') ? name : trimmed;
  return { name, display };
}

/** Turn the free-form purpose text into a clean, lowercase action phrase. */
function cleanPurpose(purpose: string): string {
  const trimmed = purpose.trim().replace(/\s+/g, ' ');
  if (!trimmed) return 'follow up on a recent conversation';
  return trimmed;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Templates per tone. Each returns a subject + body given the context.
 * Bodies are varied by the rng so regeneration yields different phrasing.
 */
const TEMPLATES: Record<
  EmailTone,
  (ctx: EmailContext, rng: () => number) => { subject: string; body: string }
> = {
  professional: (ctx, rng) => {
    const purpose = ctx.purpose;
    const subject = pick(rng, [
      `${capitalize(purpose)}`,
      `Regarding: ${purpose}`,
      `Next steps on ${purpose}`,
      `${capitalize(purpose)} — following up`,
      `Quick note on ${purpose}`,
    ]);
    const opener = pick(rng, [
      `I hope this message finds you well.`,
      `I hope you're having a good week.`,
      `Thanks for taking the time to read this.`,
      `I'm reaching out regarding ${purpose}.`,
    ]);
    const core = pick(rng, [
      `I wanted to follow up on ${purpose} and share a few thoughts on how we can move forward effectively.`,
      `I'm writing to provide an update on ${purpose} and outline the next steps I'd recommend.`,
      `Following our recent context around ${purpose}, I've put together a short summary and a proposed plan of action.`,
    ]);
    const detail = pick(rng, [
      `Here's a quick rundown of the key points:\n\n• The objective is clear and the timing works well on our end.\n• I've reviewed the relevant details and we're well positioned to proceed.\n• I'm happy to adjust the approach based on your priorities.`,
      `To keep things on track, I'd suggest we align on the following:\n\n• Confirm the scope and any dependencies up front.\n• Agree on a realistic timeline that fits both our schedules.\n• Identify a single point of contact for day-to-day questions.`,
      `A few items worth noting:\n\n• All the background context has been gathered and reviewed.\n• There are no blockers on our side at this stage.\n• We can begin as soon as we have your go-ahead.`,
    ]);
    const cta = pick(rng, [
      `Could we schedule a short call this week to confirm the direction? I'm happy to work around your calendar.`,
      `Let me know if the plan above works for you, or if you'd like to adjust anything before we kick off.`,
      `I'd welcome your feedback on the outline above. Once we're aligned, I can get started right away.`,
    ]);
    const body = `${opener}\n\n${core}\n\n${detail}\n\n${cta}\n\nI appreciate your time and look forward to your thoughts.`;
    return { subject, body };
  },

  friendly: (ctx, rng) => {
    const purpose = ctx.purpose;
    const subject = pick(rng, [
      `Quick note about ${purpose}`,
      `${capitalize(purpose)} — thought you'd want to know`,
      `Hey! A quick update on ${purpose}`,
      `Checking in about ${purpose}`,
      `So, about ${purpose}...`,
    ]);
    const opener = pick(rng, [
      `Hope you're doing great!`,
      `Hope you've been having a good one.`,
      `Hope everything's been going well on your end.`,
      `Just wanted to drop you a quick note.`,
    ]);
    const core = pick(rng, [
      `I was just thinking about ${purpose} and wanted to share a couple of quick thoughts.`,
      `I wanted to give you a friendly heads-up about ${purpose} and see where you land on it.`,
      `Following up on ${purpose} — nothing urgent, just wanted to keep you in the loop.`,
    ]);
    const detail = pick(rng, [
      `Here's the gist:\n\n• It's all positive and there's nothing to worry about.\n• I think we're in a really good spot to move things along.\n• No rush on your end — just flagging it so you're in the know.`,
      `A few quick things:\n\n• The basics are all sorted, so we're good to go whenever you are.\n• I'm excited about where this is heading.\n• Let me know what you think when you get a chance.`,
      `Quick rundown:\n\n• Everything's lined up nicely on my side.\n• I'd love your take when you have a moment.\n• Totally fine if you need a little time to get back to me.`,
    ]);
    const cta = pick(rng, [
      `No pressure at all — just reply whenever you get a chance and we'll go from there.`,
      `Let me know what you think! Always happy to chat it through.`,
      `Would love to hear your thoughts when you have a sec.`,
    ]);
    const body = `${opener}\n\n${core}\n\n${detail}\n\n${cta}\n\nTalk soon!`;
    return { subject, body };
  },

  formal: (ctx, rng) => {
    const purpose = ctx.purpose;
    const subject = pick(rng, [
      `Subject: ${capitalize(purpose)}`,
      `Formal Notice — ${purpose}`,
      `In Reference to ${purpose}`,
      `Correspondence Regarding ${purpose}`,
      `${capitalize(purpose)}: Official Communication`,
    ]);
    const opener = pick(rng, [
      `I trust this communication finds you in good health and high spirits.`,
      `I am writing to formally address the matter of ${purpose}.`,
      `Please accept this correspondence as an official follow-up regarding ${purpose}.`,
      `It is with due consideration that I write to you concerning ${purpose}.`,
    ]);
    const core = pick(rng, [
      `The purpose of this letter is to provide a comprehensive account of the current situation regarding ${purpose} and to outline the appropriate course of action in accordance with established protocol.`,
      `I am prompted to write in order to clarify the position relating to ${purpose} and to ensure that all parties share a common understanding of the matters at hand.`,
      `This communication serves to document the relevant particulars of ${purpose} so that the subsequent steps may be undertaken with clarity and due diligence.`,
    ]);
    const detail = pick(rng, [
      `The key points are presented below for your perusal:\n\n1. The matter has been reviewed in full and all pertinent details have been verified.\n2. The proposed course of action aligns with applicable standards and expectations.\n3. Your acknowledgement of this correspondence would be appreciated at your earliest convenience.`,
      `For the avoidance of doubt, the following should be noted:\n\n1. All necessary background information has been collated and assessed.\n2. No outstanding obligations remain on the part of the undersigned at this time.\n3. Further action will be taken upon receipt of your written response.`,
      `The particulars are summarised as follows:\n\n1. The circumstances surrounding ${purpose} have been examined and documented.\n2. The recommended next steps are both reasonable and proportionate.\n3. A formal response is requested to facilitate the continuation of proceedings.`,
    ]);
    const cta = pick(rng, [
      `I should be most grateful if you would confirm receipt of this letter and indicate your position on the matters outlined above.`,
      `Kindly provide a formal response at your earliest convenience so that the necessary arrangements may proceed accordingly.`,
      `I respectfully request your attention to this matter and look forward to your considered reply.`,
    ]);
    const body = `${opener}\n\n${core}\n\n${detail}\n\n${cta}\n\nI thank you for your attention to this correspondence and remain at your disposal for any further clarification you may require.`;
    return { subject, body };
  },

  apology: (ctx, rng) => {
    const purpose = ctx.purpose;
    const subject = pick(rng, [
      `My apologies regarding ${purpose}`,
      `Sincere apologies — ${purpose}`,
      `Following up with an apology about ${purpose}`,
      `I owe you an apology regarding ${purpose}`,
      `Regarding ${purpose}: my apologies`,
    ]);
    const opener = pick(rng, [
      `I'm writing to sincerely apologise for ${purpose}.`,
      `I want to start by saying I'm truly sorry about ${purpose}.`,
      `Please accept my heartfelt apologies regarding ${purpose}.`,
      `I'm reaching out because I owe you a genuine apology for ${purpose}.`,
    ]);
    const core = pick(rng, [
      `I take full responsibility for what happened. There's no excuse, and I want to be straightforward about that rather than offering explanations that sound like deflections.`,
      `What occurred was on me, and I don't want to minimise it. I understand why this was frustrating, and your reaction is completely fair.`,
      `I know that my actions caused you an inconvenience that I should have prevented, and I'm not going to pretend otherwise.`,
    ]);
    const detail = pick(rng, [
      `Here's what I've done since to put it right:\n\n• I've reviewed what went wrong so it doesn't happen again.\n• I've put a simple safeguard in place for the future.\n• I'm ready to do whatever else is needed to make this up to you.`,
      `To make amends, I've already taken the following steps:\n\n• Identified exactly where things broke down on my side.\n• Set up a process to catch this kind of issue earlier going forward.\n• Cleared my schedule so I can prioritise whatever you need from me now.`,
      `What I'm doing to fix it:\n\n• Gone back through the situation to understand the root cause.\n• Made a change on my end to prevent a repeat.\n• Committed to following through until you're fully satisfied.`,
    ]);
    const cta = pick(rng, [
      `I'd appreciate the chance to make this right. Please let me know what would work best for you — I'm happy to do whatever it takes.`,
      `If you're open to it, I'd welcome a quick conversation so I can apologise properly in person and hear how you'd like to move forward.`,
      `You have every right to be upset, and I won't pressure you for a quick response. Whenever you're ready, I'm here to put things right.`,
    ]);
    const body = `${opener}\n\n${core}\n\n${detail}\n\n${cta}\n\nThank you for taking the time to read this, and again, I'm truly sorry.`;
    return { subject, body };
  },

  request: (ctx, rng) => {
    const purpose = ctx.purpose;
    const subject = pick(rng, [
      `Request: ${capitalize(purpose)}`,
      `A quick request regarding ${purpose}`,
      `Could you help with ${purpose}?`,
      `Following up with a request about ${purpose}`,
      `Request for your support: ${purpose}`,
    ]);
    const opener = pick(rng, [
      `I hope you're doing well.`,
      `Thanks in advance for taking a look at this.`,
      `I hope this reaches you at a good moment.`,
      `I'm reaching out with a straightforward request regarding ${purpose}.`,
    ]);
    const core = pick(rng, [
      `I'm writing to ask for your help with ${purpose}. I know your time is valuable, so I'll keep this as focused as I can.`,
      `I'd like to request your assistance with ${purpose}. You're well placed to help, and it would make a real difference.`,
      `I have a request relating to ${purpose}, and you were the first person I thought of given your experience in this area.`,
    ]);
    const detail = pick(rng, [
      `Here's what I'm hoping you could do:\n\n• Share your perspective on ${purpose} when you have a moment.\n• Point me toward anything I should be aware of before I proceed.\n• Let me know if there's a better person I should be speaking with instead.`,
      `Specifically, it would be hugely helpful if you could:\n\n• Review the ${purpose} item I've outlined and share your honest take.\n• Advise on any next steps you'd recommend from your side.\n• Indicate a realistic timeframe so I can plan around your availability.`,
      `What would help most:\n\n• A short steer on ${purpose} based on your judgement.\n• Any concerns or considerations I might be overlooking.\n• A yes or no so I know where I stand and can plan accordingly.`,
    ]);
    const cta = pick(rng, [
      `I completely understand if now isn't a good time — just let me know either way and I'll work around it.`,
      `If you're able to help, I'd be grateful; if not, no worries at all, and I appreciate you even considering it.`,
      `Even a quick pointer in the right direction would be enormously appreciated. Thank you for considering it.`,
    ]);
    const body = `${opener}\n\n${core}\n\n${detail}\n\n${cta}\n\nI genuinely appreciate any support you can offer.`;
    return { subject, body };
  },
};

interface EmailContext {
  purpose: string;
  recipientName: string;
  recipientDisplay: string;
}

export function generateEmail(input: EmailInput, seed: string = ''): GeneratedEmail {
  const purpose = cleanPurpose(input.purpose);
  const { name, display } = deriveRecipientContext(input.recipient);
  const ctx: EmailContext = {
    purpose,
    recipientName: name,
    recipientDisplay: display,
  };
  const rng = makeRng(`${input.tone}|${purpose}|${display}|${seed}`);

  const { subject, body } = TEMPLATES[input.tone](ctx, rng);
  const greeting = pick(rng, GREETINGS[input.tone]).replace('{name}', name);
  const signoff = pick(rng, SIGNOFFS[input.tone]);

  return {
    subject,
    body: `${greeting}\n\n${body}\n\n${signoff}\n${SENDER_NAME}`,
    greeting,
    signoff,
  };
}

/** Full email text for the copy button — subject + body joined cleanly. */
export function emailToPlainText(email: GeneratedEmail): string {
  return `Subject: ${email.subject}\n\n${email.body}`;
}
