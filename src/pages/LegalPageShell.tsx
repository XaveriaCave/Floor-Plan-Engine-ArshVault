import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LayoutGrid } from 'lucide-react';
import Footer from '../components/Footer';

interface LegalPageShellProps {
  title: string;
  subtitle?: string;
  updatedAt?: string;
  children: ReactNode;
}

export default function LegalPageShell({ title, subtitle, updatedAt, children }: LegalPageShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative flex flex-col">
      {/* Background ambience consistent with landing page */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10" />
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50 pointer-events-none -z-10" />

      {/* Nav */}
      <nav className="border-b border-white/10 bg-slate-950/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">ArshVault</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>
        </div>
      </nav>

      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 relative z-10 w-full">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] p-8 sm:p-12 space-y-8">
          <header className="space-y-2 border-b border-white/10 pb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">{title}</h1>
            {subtitle && <p className="text-slate-400 text-sm leading-relaxed">{subtitle}</p>}
            {updatedAt && (
              <p className="text-xs font-mono text-cyan-400/80 pt-1">Last updated: {updatedAt}</p>
            )}
          </header>

          <div className="space-y-6 text-slate-300 text-sm sm:text-[15px] leading-relaxed [&_h2]:text-white [&_h2]:font-semibold [&_h2]:text-lg [&_h2]:pt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-cyan-400 [&_a]:hover:underline">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
