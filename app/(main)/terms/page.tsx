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

          <h2>8. Affiliate Program</h2>
          <p>
            The Platform offers an affiliate program that allows users to earn
            rewards by referring others to the Platform. By participating in the
            affiliate program, you agree to the following terms:
          </p>

          <h3>8.1 Referral Codes</h3>
          <p>
            Upon registration, all users are automatically assigned a unique
            referral code. This code can be shared with others to track
            referrals. You are responsible for maintaining the confidentiality
            of your referral code and for all activities that occur under it.
          </p>

          <h3>8.2 Regular User Rewards</h3>
          <p>
            Regular users earn 1 discount codes based on the number of times
            their referral code is used by others. Each milestone reached
            corresponds to one discount code earned. The reward tiers are as
            follows:
          </p>
          <ul>
            <li>20 code uses: 5% discount code</li>
            <li>100 code uses: 7.5% discount code</li>
            <li>500 code uses: 10% discount code</li>
            <li>1,000 code uses: 15% discount code</li>
          </ul>
          <p>
            Discount codes are issued automatically at the beginning of the next
            month after reaching each threshold and can be used for purchases on
            the Platform. Discount codes cannot be combined with other
            promotional offers unless explicitly stated.
          </p>

          <h3>8.3 Creator Program</h3>
          <p>
            Users who qualify for creator status receive an additional creator
            referral code. Creator status is granted at the Platform&apos;s
            discretion based on application and review. Creators earn through a
            decreasing commission rate structure based on the total sales
            generated by their referrals:
          </p>
          <ul>
            <li>$0 - $250 in generated sales: 25% commission rate (default)</li>
            <li>$250 - $1,000 in generated sales: 22.5% commission rate</li>
            <li>$1,000 - $2,500 in generated sales: 20% commission rate</li>
            <li>$2,500 - $5,000 in generated sales: 17.5% commission rate</li>
            <li>$5,000+ in generated sales: 15% commission rate</li>
          </ul>
          <p>
            Commission rates apply specifically to sales generated through the
            creator&apos;s referral code, not to the creator&apos;s own content
            sales. Commission rate changes take effect at the beginning of the
            next billing cycle after reaching a new threshold.
          </p>

          <h3>8.4 Creator Tiers</h3>
          <p>
            The Platform may implement a creator tier system based on sales
            volume, product quality, and platform tenure. Each tier may unlock
            additional non-financial benefits that enhance the creator&apos;s
            capabilities. The specific requirements and benefits of each tier
            will be communicated separately and may be updated from time to
            time.
          </p>

          <h3>8.5 Prohibited Activities</h3>
          <p>
            The following activities are prohibited in relation to the affiliate
            program:
          </p>
          <ul>
            <li>
              Self-referrals or creating multiple accounts to generate referrals
            </li>
            <li>
              Misrepresenting the Platform or making false claims about its
              services
            </li>
            <li>Spamming or engaging in any form of unsolicited promotion</li>
            <li>
              Using the referral code in any manner that violates applicable
              laws or regulations
            </li>
            <li>
              Placing referral codes on sites containing content that is
              illegal, offensive, or violates the Platform&apos;s policies
            </li>
          </ul>

          <h3>8.6 Program Modifications and Termination</h3>
          <p>
            The Platform reserves the right to modify, suspend, or terminate the
            affiliate program or any user&apos;s participation in it at any
            time, with or without notice. Changes may include, but are not
            limited to, modifications to reward structures, commission rates,
            eligibility requirements, and program rules.
          </p>
          <p>
            The Platform may withhold or forfeit rewards if it determines, in
            its sole discretion, that a user has violated these terms or engaged
            in fraudulent or abusive behavior in connection with the affiliate
            program.
          </p>

          <h2>9. Refunds</h2>
          <p>
            Refunds are handled according to the Platform&apos;s refund policy,
            which may be updated from time to time. Digital assets that have
            been downloaded may not be eligible for refunds.
          </p>

          <h2>10. Fraudulent Activities and Chargebacks</h2>
          <p>
            The Platform is not responsible for any fraudulent activities
            carried out by users, including but not limited to purchases made
            using stolen payment methods. All transactions are the
            responsibility of the parties involved, and the Platform acts only
            as a facilitator.
          </p>
          <p>
            Users acknowledge that digital assets sold on the Platform are
            typically non-refundable, especially once they have been downloaded
            or accessed. Chargebacks or refund requests made in contradiction to
            this policy may result in account suspension or other actions.
          </p>
          <p>
            If you suspect any fraudulent behavior, please contact us
            immediately at {SUPPORT_EMAIL}.
          </p>

          <h2>11. Intellectual Property</h2>
          <p>
            The Platform and its content, features, and functionality are owned
            by the Platform and are protected by copyright, trademark, and other
            intellectual property laws.
          </p>

          <h2>12. Termination</h2>
          <p>
            The Platform reserves the right to terminate or suspend your account
            and access to the Platform at any time, without notice, for conduct
            that the Platform believes violates these Terms of Service or is
            harmful to other users, the Platform, or third parties.
          </p>

          <h2>13. Disclaimer of Warranties</h2>
          <p>
            The Platform is provided &quot;as is&quot; and &quot;as
            available&quot; without warranties of any kind, either express or
            implied.
          </p>

          <h2>14. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, the Platform shall not be
            liable for any indirect, incidental, special, consequential, or
            punitive damages resulting from your use of or inability to use the
            Platform.
          </p>

          <h2>15. Changes to Terms</h2>
          <p>
            The Platform reserves the right to modify these Terms of Service at
            any time. We will provide notice of significant changes by posting
            the new Terms of Service on the Platform and updating the &quot;Last
            updated&quot; date.
          </p>

          <h2>16. Governing Law</h2>
          <p>
            These Terms of Service shall be governed by and construed in
            accordance with the laws of [Jurisdiction], without regard to its
            conflict of law provisions.
          </p>

          <h2>17. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us at{' '}
            {SUPPORT_EMAIL}
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
