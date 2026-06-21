import { Calendar, ArrowUpRight } from 'lucide-react';
import LegalPageShell from './LegalPageShell';

export default function BlogPage() {
  const posts = [
    {
      title: 'Designing the Chaos Spawner: procedural layouts done right',
      date: 'June 12, 2026',
      excerpt:
        'A behind-the-scenes look at how we built the randomized procedural generation engine that populates floor plans in seconds.',
    },
    {
      title: 'From 2D grid to 3D render: how ArshVault keeps both views in sync',
      date: 'May 28, 2026',
      excerpt:
        'A walkthrough of the architecture connecting the canvas-based 2D editor with the live Three.js viewport.',
    },
    {
      title: 'Why we chose Firestore for blueprint persistence',
      date: 'May 9, 2026',
      excerpt:
        'The tradeoffs behind our data layer decisions, and what it means for saving and loading your layouts reliably.',
    },
  ];

  return (
    <LegalPageShell title="Blog" subtitle="Notes, updates, and behind-the-scenes posts from the ArshVault team.">
      <div className="space-y-5">
        {posts.map((post) => (
          <article
            key={post.title}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl p-5 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="!pt-0 !text-base group-hover:text-cyan-400 transition-colors">
                {post.title}
              </h2>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0 mt-1" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono mt-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.date}</span>
            </div>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">{post.excerpt}</p>
          </article>
        ))}
      </div>

      <p className="text-sm text-slate-500 pt-2">
        More posts coming soon. Got a topic you'd like us to cover?{' '}
        <a href="/contact">Let us know</a>.
      </p>
    </LegalPageShell>
  );
}
