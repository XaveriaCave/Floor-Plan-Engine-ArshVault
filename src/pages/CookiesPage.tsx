import LegalPageShell from './LegalPageShell';

export default function CookiesPage() {
  return (
    <LegalPageShell
      title="Cookie Policy"
      subtitle="What cookies we use and why."
      updatedAt="June 20, 2026"
    >
      <h2>1. What Are Cookies</h2>
      <p>
        Cookies are small text files stored on your device that help websites remember
        information about your visit, such as preferences and session state.
      </p>

      <h2>2. Cookies We Use</h2>
      <ul>
        <li><strong>Essential cookies</strong> — required for authentication and session management</li>
        <li><strong>Preference cookies</strong> — remember workspace settings like grid size and environment theme</li>
        <li><strong>Analytics cookies</strong> — help us understand feature usage to improve ArshVault</li>
      </ul>

      <h2>3. Managing Cookies</h2>
      <p>
        Most browsers let you control or disable cookies through their settings. Disabling
        essential cookies may prevent core features, like sign-in and saving blueprints, from
        working correctly.
      </p>

      <h2>4. Third-Party Cookies</h2>
      <p>
        Some cookies may be set by trusted third-party services we use for authentication and
        infrastructure, such as Firebase. These providers have their own privacy practices.
      </p>

      <h2>5. Contact</h2>
      <p>
        For questions about our cookie practices, visit our <a href="/contact">contact page</a>.
      </p>
    </LegalPageShell>
  );
}
