import LegalPageShell from './LegalPageShell';

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms & Conditions"
      subtitle="The rules that govern your use of ArshVault."
      updatedAt="June 20, 2026"
    >
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using ArshVault, you agree to be bound by these Terms & Conditions. If
        you do not agree, please refrain from using the service.
      </p>

      <h2>2. Use of the Service</h2>
      <ul>
        <li>You must be at least 13 years old to create an account</li>
        <li>You are responsible for maintaining the confidentiality of your login credentials</li>
        <li>You agree not to misuse the workspace, attempt unauthorized access, or disrupt the service</li>
      </ul>

      <h2>3. Your Content</h2>
      <p>
        Blueprints, layouts, and other content you create remain yours. By saving content on
        ArshVault, you grant us a limited license to store and display it back to you as part
        of providing the service.
      </p>

      <h2>4. Service Availability</h2>
      <p>
        We strive for high availability but do not guarantee uninterrupted access. Features may
        change, be added, or be removed at any time.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        ArshVault is provided "as is" without warranties of any kind. We are not liable for any
        indirect, incidental, or consequential damages arising from your use of the service.
      </p>

      <h2>6. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of ArshVault after changes
        take effect constitutes acceptance of the revised Terms.
      </p>

      <h2>7. Contact</h2>
      <p>
        Reach out via our <a href="/contact">contact page</a> with any questions.
      </p>
    </LegalPageShell>
  );
}
