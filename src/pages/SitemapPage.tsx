import { Link } from 'react-router-dom';
import LegalPageShell from './LegalPageShell';

export default function SitemapPage() {
  const sections = [
    {
      title: 'Main',
      links: [
        { label: 'Home', to: '/' },
        { label: 'Sign In / Get Started', to: '/login' },
        { label: 'Workspace', to: '/workspace' },
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
    <LegalPageShell title="Sitemap" subtitle="A full map of every page on ArshVault.">
      <div className="grid sm:grid-cols-3 gap-8">
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h2 className="!pt-0">{section.title}</h2>
            <ul className="!list-none !pl-0 space-y-2">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-cyan-400 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </LegalPageShell>
  );
}
