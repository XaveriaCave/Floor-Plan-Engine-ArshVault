import { Link } from 'react-router-dom';
import { LayoutGrid, ArrowRight, Layers, Box, Cpu, Sparkles, ChevronRight, Activity, Globe, Eye } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      {/* Tech Interface Grid Backdrop Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 pointer-events-none -z-10"></div>

      <nav className="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-400 transition-all">ArshVault</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/login" className="px-4 py-2 text-sm font-medium bg-white text-slate-950 rounded-full hover:bg-cyan-400 hover:text-slate-950 transition-all duration-300 shadow-lg shadow-white/10 hover:shadow-cyan-500/20">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 relative z-10">

        {/* HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto mb-24 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">

          {/* Aesthetic Badge Component */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 backdrop-blur-xl text-cyan-400 text-xs font-medium tracking-wide shadow-inner shadow-white/5 hover:border-cyan-500/30 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
            </span>
            <span className="flex items-center gap-1 text-slate-300">Floor Plan Playground<Sparkles className="w-3 h-3 text-cyan-400" /></span>
          </div>

          <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400">
            Design spaces with <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 drop-shadow-[0_2px_20px_rgba(34,211,238,0.2)]">
              unprecedented freedom.
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The next-generation 3D floor planning tool. Build environments dynamically, preview in real-time, and iterate endlessly.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link to="/login" className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white rounded-full font-semibold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 group relative overflow-hidden">
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              Launch Workspace
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* INTERACTIVE 3D PREVIEW SIMULATOR MOCK (New Glass Component) */}
        <div className="max-w-5xl mx-auto mb-28 rounded-2xl border border-slate-800/80 bg-slate-950/40 backdrop-blur-xl p-4 shadow-2xl shadow-cyan-950/20 relative group animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150 fill-mode-both">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-500/20 via-transparent to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          {/* Mock Window Top Bar */}
          <div className="flex items-center justify-between px-3 pb-4 border-b border-slate-900/80">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-800"></span>
              <span className="w-3 h-3 rounded-full bg-slate-800"></span>
              <span className="w-3 h-3 rounded-full bg-slate-800"></span>
              <span className="text-xs text-slate-500 font-mono ml-2">workspace_main_view.blend</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800/60">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>FPS: 60.0 — WebGL2</span>
            </div>
          </div>

          {/* Interactive Simulated Designer Frame */}
          <div className="h-80 w-full bg-slate-900/20 rounded-xl mt-4 relative overflow-hidden flex items-center justify-center border border-slate-900">
            {/* Hologram Matrix Grid effect inside editor */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-20 [transform:rotateX(60deg)_translateY(-50px)]"></div>

            {/* Floating Blueprint Elements */}
            <div className="absolute bottom-6 left-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md max-w-xs space-y-2 shadow-xl">
              <div className="text-[10px] font-bold tracking-wider uppercase text-slate-500">Active Node Matrix</div>
              <div className="text-sm font-semibold text-white flex items-center justify-between gap-4">
                <span>Procedural Layout #402</span>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Compiled</span>
              </div>
            </div>

            <div className="absolute top-6 right-6 flex flex-col gap-2">
              <button className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 backdrop-blur-md text-slate-400 hover:text-white hover:border-cyan-500/50 transition-all flex items-center gap-2 text-xs">
                <Eye className="w-3.5 h-3.5 text-cyan-400" /> Orbit Camera
              </button>
              <button className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 backdrop-blur-md text-slate-400 hover:text-white hover:border-cyan-500/50 transition-all flex items-center gap-2 text-xs">
                <Globe className="w-3.5 h-3.5 text-indigo-400" /> Environment Env
              </button>
            </div>

            {/* Glowing Central Element Concept */}
            <div className="relative w-28 h-28 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 rounded-xl border border-cyan-400/30 flex items-center justify-center backdrop-blur-sm [transform:rotateX(60deg)_rotateZ(45deg)] animate-[spin_20s_linear_infinite] shadow-[0_0_50px_rgba(34,211,238,0.15)]">
              <Box className="w-8 h-8 text-cyan-400 -rotate-45" />
            </div>
          </div>
        </div>

        {/* METRICS / STATS SECTION (New Strip layout) */}
        <div className="max-w-5xl mx-auto mb-24 grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-slate-900 py-10 px-4">
          {[
            { metric: "Under 2ms", label: "Render Latency" },
            { metric: "140K+", label: "Layouts Generated" },
            { metric: "99.9%", label: "WebGL Uptime" },
            { metric: "Zero", label: "Server-side Lag" }
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-1">
              <div className="text-3xl font-extrabold text-white bg-clip-text bg-gradient-to-b from-white to-slate-300 tracking-tight">{stat.metric}</div>
              <div className="text-xs font-medium tracking-wide uppercase text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* FEATURES GRID SECTION */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
          {[
            {
              icon: Layers,
              title: "Multi-level Stacking",
              desc: "Seamlessly transition between floors with our intuitive layer compensator.",
              gradient: "hover:border-cyan-500/40"
            },
            {
              icon: Box,
              title: "Real-time 3D Render",
              desc: "Instantly visualize your blueprints in high-fidelity WebGL environments.",
              gradient: "hover:border-blue-500/40"
            },
            {
              icon: Cpu,
              title: "Procedural Generation",
              desc: "Populate layouts dynamically with our Chaos Randomizer module.",
              gradient: "hover:border-indigo-500/40"
            }
          ].map((feat, i) => (
            <div key={i} className={`p-8 rounded-2xl bg-slate-950/40 border border-slate-900 backdrop-blur-xl hover:bg-slate-900/30 transition-all duration-300 group ${feat.gradient} hover:-translate-y-1 shadow-lg`}>
              <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 group-hover:text-white transition-all duration-300 shadow-inner">
                <feat.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-1.5 group-hover:text-cyan-400 transition-colors">
                {feat.title}
                <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-cyan-400" />
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">{feat.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}