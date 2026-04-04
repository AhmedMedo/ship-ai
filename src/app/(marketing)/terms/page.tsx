import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingDocLayout } from '@/components/marketing/marketing-doc-layout';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description:
    'Terms and Conditions for Ignitra — the AI-native Next.js SaaS boilerplate. Purchase, license, refunds, and use of the product.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms and Conditions | Ignitra',
    description: 'Terms and Conditions for purchasing and using the Ignitra boilerplate.',
    url: '/terms',
  },
};

const section =
  'mt-12 scroll-mt-28 border-b border-white/10 pb-2 text-xl font-semibold text-[#F1F5F9] first:mt-0';

export default function TermsPage() {
  return (
    <MarketingDocLayout title="Terms and Conditions" lastUpdated="April 4, 2026">
      <h2 className={section}>1. Introduction</h2>
      <p>
        Welcome to Ignitra (&quot;Website&quot;, &quot;Service&quot;, &quot;Product&quot;). Ignitra is an AI-native
        Next.js SaaS boilerplate sold as source code, created and maintained by Ahmed Alaa (&quot;we&quot;,
        &quot;us&quot;, &quot;our&quot;). By accessing or purchasing Ignitra, you (&quot;you&quot;, &quot;Licensee&quot;,
        &quot;Customer&quot;) agree to be bound by these Terms and Conditions.
      </p>
      <p>If you do not agree to these Terms, do not purchase or use the Product.</p>

      <h2 className={section}>2. Product Description</h2>
      <p>
        Ignitra is a production-ready Next.js boilerplate provided as source code. Upon purchase, you receive
        access to a private GitHub repository containing the complete source code. Ignitra is a development tool
        — we do not provide hosting, managed services, or ongoing SaaS access.
      </p>

      <h2 className={section}>3. Purchase and Payment</h2>
      <p>
        All purchases are processed through our payment provider (Lemon Squeezy). By completing a purchase, you
        agree to pay the listed price for your selected tier. All prices are in USD. Taxes may apply depending on
        your jurisdiction and are handled by the payment provider.
      </p>

      <h2 className={section}>4. License Grant</h2>
      <p>
        Upon purchase, we grant you a non-exclusive, non-transferable, non-sublicensable license to use the
        Ignitra source code. Full license terms are available at{' '}
        <Link href="/license" className="underline">
          ignitra.dev/license
        </Link>
        . Key points:
      </p>
      <ul className="my-4 list-disc space-y-2 pl-5">
        <li>You MAY use the code to build unlimited commercial and personal projects</li>
        <li>You MAY modify the code for your own use</li>
        <li>
          You MAY NOT resell, redistribute, or share the source code as a standalone product, boilerplate,
          template, or starter kit
        </li>
        <li>You MAY NOT sublicense, rent, or transfer the code to third parties</li>
        <li>You MAY NOT publish the source code in any public repository</li>
      </ul>

      <h2 className={section}>5. Refund Policy</h2>
      <p>
        All purchases are final. Due to the digital nature of the Product (source code access), no refunds are
        provided after purchase and repository access has been granted. We encourage you to review the demo,
        documentation, and feature list before purchasing.
      </p>

      <h2 className={section}>6. Updates and Support</h2>
      <p>
        Your purchase includes lifetime access to updates pushed to the repository. Support is provided on a
        best-effort basis through our community channels. We do not guarantee response times or resolution of
        specific issues. We reserve the right to discontinue updates at any time.
      </p>

      <h2 className={section}>7. Disclaimer of Warranties</h2>
      <p className="font-medium uppercase tracking-wide text-[#CBD5E1]">
        THE PRODUCT IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED,
        INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
        PURPOSE, OR NONINFRINGEMENT. WE DO NOT WARRANT THAT THE PRODUCT WILL BE ERROR-FREE OR UNINTERRUPTED.
      </p>

      <h2 className={section}>8. Limitation of Liability</h2>
      <p className="font-medium uppercase tracking-wide text-[#CBD5E1]">
        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WE SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT,
        INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO YOUR USE OR
        INABILITY TO USE THE PRODUCT, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
      </p>

      <h2 className={section}>9. Intellectual Property</h2>
      <p>
        We retain all ownership and intellectual property rights in and to the Ignitra source code, branding,
        documentation, and website content. Your purchase grants a license to use the code, not ownership of the
        intellectual property.
      </p>

      <h2 className={section}>10. User Responsibilities</h2>
      <p>You are responsible for:</p>
      <ul className="my-4 list-disc space-y-2 pl-5">
        <li>Maintaining the security of your account and repository access</li>
        <li>Ensuring your use of the Product complies with applicable laws</li>
        <li>Any applications you build using the Product</li>
        <li>Your own hosting, deployment, and infrastructure costs</li>
      </ul>

      <h2 className={section}>11. Termination</h2>
      <p>
        We reserve the right to terminate your license if you violate these Terms, particularly the restrictions
        in Section 4. Upon termination, you must cease all use of the Product and destroy all copies in your
        possession.
      </p>

      <h2 className={section}>12. Modifications to Terms</h2>
      <p>
        We may update these Terms from time to time. Changes will be posted on this page with an updated
        &quot;Last Updated&quot; date. Continued use of the Product after changes constitutes acceptance of the new
        Terms.
      </p>

      <h2 className={section}>13. Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with applicable international laws. Any
        disputes shall be resolved through good-faith negotiation first.
      </p>

      <h2 className={section}>14. Contact</h2>
      <p>
        For questions about these Terms, contact us at:{' '}
        <a href="mailto:info@ignitra.dev">info@ignitra.dev</a>
      </p>
    </MarketingDocLayout>
  );
}
