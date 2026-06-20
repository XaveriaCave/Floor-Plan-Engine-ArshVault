import { Link } from 'react-router-dom';
import { LayoutGrid, ArrowRight, Layers, Box, Cpu } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      <nav className="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">ArshVault</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/login" className="px-4 py-2 text-sm font-medium bg-white text-slate-950 rounded-full hover:bg-slate-200 transition-colors shadow-lg shadow-white/10">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-cyan-400 text-sm font-medium mb-4">
            <span className="relative flex h-2 w-7">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div> */}
          <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
            Design spaces with <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500">
              unprecedented freedom.
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The next-generation 3D floor planning tool. Build environments dynamically, preview in real-time, and iterate endlessly.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link to="/login" className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-cyan-500/25">
              Launch Workspace
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
          {[
            {
              icon: Layers,
              title: "Multi-level Stacking",
              desc: "Seamlessly transition between floors with our intuitive layer compensator."
            },
            {
              icon: Box,
              title: "Real-time 3D Render",
              desc: "Instantly visualize your blueprints in high-fidelity WebGL environments."
            },
            {
              icon: Cpu,
              title: "Procedural Generation",
              desc: "Populate layouts dynamically with our Chaos Randomizer module."
            }
          ].map((feat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:bg-slate-800/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-6 text-cyan-400">
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feat.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
