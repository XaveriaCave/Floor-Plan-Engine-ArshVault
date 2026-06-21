import LegalPageShell from './LegalPageShell';

export default function AboutPage() {
  return (
    <LegalPageShell
      title="About Us"
      subtitle="The story and mission behind ArshVault."
    >
      <p>
        ArshVault started as a simple idea: floor planning should feel as fluid and intuitive
        as sketching on paper, but with the precision and depth of real-time 3D rendering. We
        built a tool that lets anyone — architects, hobbyists, or curious tinkerers — design
        spaces visually and instantly see them come to life.
      </p>

      <h2>Our Mission</h2>
      <p>
        We believe spatial design tools shouldn't require years of CAD training. ArshVault
        combines an approachable 2D grid editor with a high-fidelity WebGL 3D viewport, so
        ideas move from concept to visualization in seconds.
      </p>

      <h2>What We're Building</h2>
      <ul>
        <li>A fast, browser-based floor planning sandbox</li>
        <li>Real-time 3D previews powered by Three.js</li>
        <li>Procedural generation tools for rapid layout exploration</li>
        <li>A growing library of furniture, fixtures, and structural elements</li>
      </ul>

      <p>
        We're a small, independent team continuously shipping improvements based on community
        feedback. Have ideas or feedback? <a href="/contact">We'd love to hear from you.</a>
      </p>
    </LegalPageShell>
  );
}
