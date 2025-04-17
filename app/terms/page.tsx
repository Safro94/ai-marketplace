import { PageContainer } from '@/components/page-container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { APP_DATA, SUPPORT_EMAIL } from '@/lib/constants'

export const metadata = {
  title: `Terms of Service | ${APP_DATA.name}`,
  description: `Terms and conditions for using the ${APP_DATA.name} platform.`,
}

export default function TermsPage() {
  return (
    <PageContainer>
      <Card>
        <CardHeader>
          <CardTitle className='text-3xl'>Terms of Service</CardTitle>
          <p className='text-muted-foreground'>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </CardHeader>

        <CardContent className='prose dark:prose-invert max-w-none [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&>h3]:font-bold [&>p]:mb-4 [&>ul]:mb-4'>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the {APP_DATA.name} (the
            &quot;Platform&quot;), you agree to be bound by these Terms of
            Service. If you do not agree to these terms, please do not use the
            Platform.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            The Platform provides a marketplace for users to buy and sell AI
            assets, including but not limited to models, datasets, tools, and
            related resources. The Platform facilitates transactions between
            buyers and sellers but is not a party to any transaction.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            To access certain features of the Platform, you must register for an
            account. You are responsible for maintaining the confidentiality of
            your account information and for all activities that occur under
            your account.
          </p>

          <h2>4. User Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon the rights of others</li>
            <li>Upload or distribute malicious code</li>
            <li>
              Attempt to gain unauthorized access to the Platform or other
              users&apos; accounts
            </li>
            <li>
              Use the Platform to engage in any illegal or fraudulent activities
            </li>
            <li>
              Manipulate the price of any assets or interfere with other
              users&apos; transactions
            </li>
          </ul>

          <h2>5. Content and Licensing</h2>
          <p>
            By uploading content to the Platform, you grant the Platform a
            non-exclusive, worldwide, royalty-free license to use, display, and
            distribute your content solely for the purpose of operating the
            Platform.
          </p>
          <p>
            You retain all ownership rights to your content. You are responsible
            for ensuring that you have all necessary rights to the content you
            upload and that it does not violate any third-party rights.
          </p>

          <h2>6. Asset Licensing</h2>
          <p>
            Assets sold on the Platform are subject to the specific license
            terms set by the seller. Buyers are responsible for reviewing and
            complying with the license terms associated with each asset.
          </p>
          <p>
            The Platform provides standard license templates, but sellers may
            customize their license terms. The Platform is not responsible for
            enforcing license compliance.
          </p>

          <h2>7. Fees and Payments</h2>
          <p>
            The Platform charges fees for transactions conducted through the
            Platform. Fees are clearly displayed before a transaction is
            completed.
          </p>
          <p>
            Sellers receive payment for their assets according to the
            Platform&apos;s payment schedule, minus applicable fees. The
            Platform reserves the right to withhold payment in cases of
            suspected fraud or violation of these terms.
          </p>

          <h2>8. Refunds</h2>
          <p>
            Refunds are handled according to the Platform&apos;s refund policy,
            which may be updated from time to time. Digital assets that have
            been downloaded may not be eligible for refunds.
          </p>

          <h2>9. Intellectual Property</h2>
          <p>
            The Platform and its content, features, and functionality are owned
            by the Platform and are protected by copyright, trademark, and other
            intellectual property laws.
          </p>

          <h2>10. Termination</h2>
          <p>
            The Platform reserves the right to terminate or suspend your account
            and access to the Platform at any time, without notice, for conduct
            that the Platform believes violates these Terms of Service or is
            harmful to other users, the Platform, or third parties.
          </p>

          <h2>11. Disclaimer of Warranties</h2>
          <p>
            The Platform is provided &quot;as is&quot; and &quot;as
            available&quot; without warranties of any kind, either express or
            implied.
          </p>

          <h2>12. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, the Platform shall not be
            liable for any indirect, incidental, special, consequential, or
            punitive damages resulting from your use of or inability to use the
            Platform.
          </p>

          <h2>13. Changes to Terms</h2>
          <p>
            The Platform reserves the right to modify these Terms of Service at
            any time. We will provide notice of significant changes by posting
            the new Terms of Service on the Platform and updating the &quot;Last
            updated&quot; date.
          </p>

          <h2>14. Governing Law</h2>
          <p>
            These Terms of Service shall be governed by and construed in
            accordance with the laws of [Jurisdiction], without regard to its
            conflict of law provisions.
          </p>

          <h2>15. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us at{' '}
            {SUPPORT_EMAIL}
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
