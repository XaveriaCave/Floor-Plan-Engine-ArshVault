import { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';
import LegalPageShell from './LegalPageShell';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No backend wired up yet — this is a presentational confirmation only.
    setSubmitted(true);
  };

  return (
    <LegalPageShell title="Contact Us" subtitle="Questions, feedback, or partnership ideas — we'd love to hear from you.">
      <div className="grid sm:grid-cols-2 gap-8">
        {/* Direct contact info */}
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <Mail className="w-4.5 h-4.5 text-cyan-400 mt-0.5" />
            <div>
              <h2 className="!pt-0 !text-sm">Email</h2>
              <a href="mailto:hello@arshvault.app" className="text-sm">hello@arshvault.app</a>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <MessageSquare className="w-4.5 h-4.5 text-cyan-400 mt-0.5" />
            <div>
              <h2 className="!pt-0 !text-sm">Response time</h2>
              <p className="text-sm text-slate-400">We typically reply within 1–2 business days.</p>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div>
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <CheckCircle className="w-7 h-7 text-emerald-400" />
              <p className="text-sm text-emerald-300 font-medium">
                Thanks, {name || 'friend'}! Your message has been noted.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 transition-colors"
              />
              <input
                type="email"
                required
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 transition-colors"
              />
              <textarea
                required
                placeholder="Your message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 transition-colors resize-none"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-cyan-500/20"
              >
                <Send className="w-4 h-4" />
                Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </LegalPageShell>
  );
}
