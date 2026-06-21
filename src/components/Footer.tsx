import { Link } from 'react-router-dom';
import { LayoutGrid, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  const columns = [
    {
      title: 'Product',
      links: [
        { label: 'Workspace', to: '/login' },
        { label: 'Features', to: '/#features' },
        { label: 'Sitemap', to: '/sitemap' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', to: '/about' },
        { label: 'Blog', to: '/blog' },
        { label: 'Contact', to: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Terms & Conditions', to: '/terms' },
        { label: 'Cookie Policy', to: '/cookies' },
      ],
    },
  ];

  return (
    <footer className="relative z-10 px-6 pb-8 pt-4">
      <div className="max-w-7xl mx-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden">
        {/* subtle gradient sheen */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-indigo-500/5" />

        <div className="relative px-8 py-10 grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand block */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <LayoutGrid className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">ArshVault</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              The next-generation 3D floor planning playground. Build, preview,
              and iterate on spatial layouts in real time.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {[
                { Icon: Github, href: 'https://github.com' },
                { Icon: Twitter, href: 'https://twitter.com' },
                { Icon: Linkedin, href: 'https://linkedin.com' },
                { Icon: Mail, href: 'mailto:hello@arshvault.app' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-cyan-400/30 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title} className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider + bottom bar */}
        <div className="relative border-t border-white/10 px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            © {year} ArshVault. All rights reserved.
          </span>
          <div className="flex items-center gap-5 text-xs text-slate-500">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link to="/cookies" className="hover:text-slate-300 transition-colors">Cookies</Link>
            <Link to="/sitemap" className="hover:text-slate-300 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
