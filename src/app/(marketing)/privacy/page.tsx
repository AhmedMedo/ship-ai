import type { Metadata } from 'next';
import { MarketingDocLayout } from '@/components/marketing/marketing-doc-layout';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Ignitra collects, uses, and protects your data when you visit ignitra.dev or purchase the product.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy | Ignitra',
    description: 'Privacy practices for Ignitra and ignitra.dev.',
    url: '/privacy',
  },
};

const section =
  'mt-12 scroll-mt-28 border-b border-white/10 pb-2 text-xl font-semibold text-[#F1F5F9] first:mt-0';

export default function PrivacyPage() {
  return (
    <MarketingDocLayout title="Privacy Policy" lastUpdated="April 4, 2026">
      <h2 className={section}>1. Introduction</h2>
      <p>
        This Privacy Policy describes how Ignitra (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects, uses,
        and protects your personal information when you visit ignitra.dev (&quot;Website&quot;) or purchase our
        Product. We are committed to protecting your privacy and handling your data transparently.
      </p>

      <h2 className={section}>2. Information We Collect</h2>
      <h3 className="mt-8 text-lg font-semibold text-[#E2E8F0]">Information you provide directly:</h3>
      <ul className="my-4 list-disc space-y-2 pl-5">
        <li>Name and email address (when you submit the contact/lead form)</li>
        <li>GitHub username (when you request repository access)</li>
        <li>
          Payment information (processed by Lemon Squeezy — we do not store payment card details)
        </li>
      </ul>
      <h3 className="mt-8 text-lg font-semibold text-[#E2E8F0]">Information collected automatically:</h3>
      <ul className="my-4 list-disc space-y-2 pl-5">
        <li>Browser type and version</li>
        <li>Pages visited and time spent on our Website</li>
        <li>Referring website</li>
        <li>IP address (anonymized)</li>
        <li>Device type and screen resolution</li>
      </ul>
      <p>We use privacy-respecting analytics to understand how visitors use our Website.</p>

      <h2 className={section}>3. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul className="my-4 list-disc space-y-2 pl-5">
        <li>Process your purchase and grant repository access</li>
        <li>Send purchase confirmation and access instructions via email</li>
        <li>Respond to your inquiries and support requests</li>
        <li>Send product update notifications (you can unsubscribe at any time)</li>
        <li>Improve our Website and Product based on usage patterns</li>
        <li>Prevent fraud and abuse</li>
      </ul>

      <h2 className={section}>4. Information Sharing</h2>
      <p>We do NOT sell, trade, or rent your personal information to third parties.</p>
      <p>We share your information only with:</p>
      <ul className="my-4 list-disc space-y-2 pl-5">
        <li>Lemon Squeezy (payment processing)</li>
        <li>Supabase (database hosting — for lead form submissions)</li>
        <li>Resend (transactional email delivery)</li>
        <li>GitHub (repository access management)</li>
        <li>Vercel (website hosting — server logs)</li>
      </ul>
      <p>
        Each of these providers has their own privacy policies and processes data in accordance with their terms.
      </p>

      <h2 className={section}>5. Data Security</h2>
      <p>
        We implement reasonable security measures to protect your personal information, including encrypted
        connections (HTTPS), secure database access, and limited access controls. However, no method of
        transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
      </p>

      <h2 className={section}>6. Cookies</h2>
      <p>Our Website uses minimal cookies:</p>
      <ul className="my-4 list-disc space-y-2 pl-5">
        <li>Essential cookies required for the Website to function</li>
        <li>Analytics cookies to understand Website usage (anonymized)</li>
      </ul>
      <p>
        You can control cookie preferences through your browser settings. Disabling cookies may affect Website
        functionality.
      </p>

      <h2 className={section}>7. Your Rights</h2>
      <p>You have the right to:</p>
      <ul className="my-4 list-disc space-y-2 pl-5">
        <li>Access the personal information we hold about you</li>
        <li>Request correction of inaccurate information</li>
        <li>Request deletion of your personal information</li>
        <li>Opt out of marketing communications</li>
        <li>Request a copy of your data in a portable format</li>
      </ul>
      <p>
        To exercise any of these rights, contact us at{' '}
        <a href="mailto:info@ignitra.dev">info@ignitra.dev</a>.
      </p>

      <h2 className={section}>8. Data Retention</h2>
      <p>
        We retain your personal information for as long as necessary to fulfill the purposes described in this
        policy, comply with legal obligations, resolve disputes, and enforce our agreements. Purchase records are
        retained for accounting and legal purposes.
      </p>

      <h2 className={section}>9. Children&apos;s Privacy</h2>
      <p>
        Our Website and Product are not directed at individuals under the age of 16. We do not knowingly collect
        personal information from children. If we become aware that we have collected data from a child, we will
        take steps to delete it promptly.
      </p>

      <h2 className={section}>10. International Data Transfers</h2>
      <p>
        Your information may be transferred to and processed in countries other than your own. We ensure
        appropriate safeguards are in place for such transfers.
      </p>

      <h2 className={section}>11. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated
        &quot;Last Updated&quot; date. We encourage you to review this policy periodically.
      </p>

      <h2 className={section}>12. Contact</h2>
      <p>
        For questions or concerns about this Privacy Policy, contact us at:{' '}
        <a href="mailto:info@ignitra.dev">info@ignitra.dev</a>
      </p>
    </MarketingDocLayout>
  );
}
