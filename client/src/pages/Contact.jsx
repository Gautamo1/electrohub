import { useState } from 'react';
import { Mail, MapPin, Phone, Send, Loader2 } from 'lucide-react';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const INFO = [
  { icon: Mail, label: 'Email', value: 'hello@electrohub.example' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 010-2030' },
  { icon: MapPin, label: 'Office', value: '1 Innovation Way, Tech City' },
];

export default function Contact() {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your name (min 2 characters).';
    if (!EMAIL_RE.test(form.email.trim())) next.email = 'Please enter a valid email address.';
    if (form.subject.trim().length < 3) next.subject = 'Subject must be at least 3 characters.';
    if (form.message.trim().length < 10) next.message = 'Message must be at least 10 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await api.submitContact(form);
      toast.success(res.message || 'Message sent!');
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      if (err.details && typeof err.details === 'object') {
        setErrors(err.details);
        toast.error('Please fix the highlighted fields.');
      } else {
        toast.error(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="section-title">Contact us</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Questions, feedback or partnership ideas? Drop us a line — messages are stored
          in our PostgreSQL database via the REST API.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        <form onSubmit={onSubmit} noValidate className="card p-6 sm:p-8">
          {sent && (
            <div role="status" className="mb-6 rounded-xl border border-emerald-400/50 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
              ✓ Message received! We usually reply within one business day.
            </div>
          )}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="c-name" className="label">Name *</label>
              <input id="c-name" type="text" value={form.name} onChange={set('name')}
                aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'err-name' : undefined}
                className={`input ${errors.name ? '!border-rose-400 !ring-rose-400/30' : ''}`} placeholder="Ada Lovelace" />
              {errors.name && <p id="err-name" className="mt-1.5 text-xs text-rose-500">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="c-email" className="label">Email *</label>
              <input id="c-email" type="email" value={form.email} onChange={set('email')}
                aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'err-email' : undefined}
                className={`input ${errors.email ? '!border-rose-400 !ring-rose-400/30' : ''}`} placeholder="ada@example.com" />
              {errors.email && <p id="err-email" className="mt-1.5 text-xs text-rose-500">{errors.email}</p>}
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="c-subject" className="label">Subject *</label>
            <input id="c-subject" type="text" value={form.subject} onChange={set('subject')}
              aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? 'err-subject' : undefined}
              className={`input ${errors.subject ? '!border-rose-400 !ring-rose-400/30' : ''}`} placeholder="How can we help?" />
            {errors.subject && <p id="err-subject" className="mt-1.5 text-xs text-rose-500">{errors.subject}</p>}
          </div>

          <div className="mt-5">
            <label htmlFor="c-message" className="label">Message *</label>
            <textarea id="c-message" rows={6} value={form.message} onChange={set('message')}
              aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'err-message' : undefined}
              className={`input resize-y ${errors.message ? '!border-rose-400 !ring-rose-400/30' : ''}`}
              placeholder="Tell us what's on your mind (min 10 characters)…" />
            {errors.message && <p id="err-message" className="mt-1.5 text-xs text-rose-500">{errors.message}</p>}
          </div>

          <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full sm:w-auto">
            {submitting
              ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…</>
              : <><Send className="h-4 w-4" aria-hidden="true" /> Send message</>}
          </button>
        </form>

        {/* Info sidebar */}
        <aside className="space-y-4">
          {INFO.map((item) => (
            <div key={item.label} className="card flex items-center gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-neon-500 text-white shadow-glow">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{item.label}</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{item.value}</p>
              </div>
            </div>
          ))}
          <div className="card bg-gradient-to-br from-brand-600 to-brand-500 p-6 text-white dark:from-brand-700 dark:to-brand-600">
            <h2 className="text-base font-bold">Portfolio demo</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/85">
              This contact form is wired to <code className="rounded bg-white/20 px-1">POST /api/contact</code>.
              Submissions persist in PostgreSQL — check the database after sending.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
