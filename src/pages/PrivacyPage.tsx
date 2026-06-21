import LegalPageShell from './LegalPageShell';

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      subtitle="How ArshVault collects, uses, and protects your information."
      updatedAt="June 20, 2026"
    >
      <h2>1. Information We Collect</h2>
      <p>
        We collect information you provide directly, such as your name and email when you
        create an account, along with usage data like blueprint layouts, saved sessions, and
        general interaction analytics that help us improve the product.
      </p>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To provide, maintain, and improve the ArshVault workspace experience</li>
        <li>To save and sync your blueprints and account preferences</li>
        <li>To communicate product updates, security notices, and support replies</li>
        <li>To detect, prevent, and address technical issues or abuse</li>
      </ul>

      <h2>3. Data Storage</h2>
      <p>
        Your account and blueprint data is stored securely using Firebase Authentication and
        Firestore. Reasonable technical and organizational safeguards are in place to protect
        against unauthorized access, alteration, or disclosure.
      </p>

      <h2>4. Sharing of Information</h2>
      <p>
        We do not sell your personal data. Limited information may be shared with trusted
        infrastructure providers (such as our hosting and authentication partners) solely to
        operate the service.
      </p>

      <h2>5. Your Choices</h2>
      <p>
        You may access, update, or delete your account data at any time from your workspace
        settings, or by contacting us directly.
      </p>

      <h2>6. Contact</h2>
      <p>
        Questions about this policy can be sent to our <a href="mailto:privacy@arshvault.app">privacy team</a>{' '}
        or through our <a href="/contact">contact page</a>.
      </p>
    </LegalPageShell>
  );
}
