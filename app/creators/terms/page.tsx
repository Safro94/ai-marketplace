import { PageContainer } from '@/components/page-container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { APP_DATA, CREATORS_EMAIL } from '@/lib/constants'

export const metadata = {
  title: `Creator Terms | ${APP_DATA.name}`,
  description: `Terms and conditions for creators on the ${APP_DATA.name} platform.`,
}

export default function CreatorTermsPage() {
  return (
    <PageContainer>
      <Card>
        <CardHeader>
          <CardTitle className='text-3xl'>Creator Terms</CardTitle>
          <p className='text-muted-foreground'>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </CardHeader>

        <CardContent className='prose dark:prose-invert max-w-none [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&>h3]:font-bold [&>p]:mb-4 [&>ul]:mb-4'>
          <h2>1. Introduction</h2>
          <p>
            These Creator Terms (&quot;Terms&quot;) govern your participation as
            a creator (&quot;Creator&quot;, &quot;you&quot;, or
            &quot;your&quot;) on the {APP_DATA.name} platform
            (&quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;, or
            &quot;our&quot;). By registering as a Creator and uploading assets
            to the Platform, you agree to be bound by these Terms.
          </p>

          <h2>2. Becoming a Creator</h2>
          <h3>2.1 Eligibility</h3>
          <p>To become a Creator, you must:</p>
          <ul>
            <li>
              Be at least 18 years old or the age of majority in your
              jurisdiction
            </li>
            <li>Have a valid account on the Platform</li>
            <li>
              Provide accurate and complete information during the application
              process
            </li>
            <li>Have the legal right to enter into these Terms</li>
            <li>
              Not have had a previous Creator account terminated for violations
            </li>
          </ul>

          <h3>2.2 Application Process</h3>
          <p>
            Your application to become a Creator may be subject to review. We
            reserve the right to approve or reject any application at our sole
            discretion. Upon approval, you will gain access to the Creator
            Dashboard and the ability to upload assets.
          </p>

          <h2>3. Asset Guidelines</h2>
          <h3>3.1 Acceptable Content</h3>
          <p>All assets uploaded to the Platform must:</p>
          <ul>
            <li>
              Be original works created by you or content you have the rights to
              distribute
            </li>
            <li>Be of high quality and function as described</li>
            <li>Include clear documentation and usage instructions</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>
              Not infringe on any third-party intellectual property rights
            </li>
            <li>
              Not contain malicious code, viruses, or other harmful components
            </li>
          </ul>

          <h3>3.2 Prohibited Content</h3>
          <p>The following types of assets are prohibited:</p>
          <ul>
            <li>Assets that promote illegal activities</li>
            <li>
              Assets designed primarily to generate harmful, abusive, or
              deceptive content
            </li>
            <li>
              Assets that contain or generate hate speech, harassment, or
              discriminatory content
            </li>
            <li>
              Assets that violate privacy rights or contain personally
              identifiable information
            </li>
            <li>
              Assets that have been scraped or collected without proper
              authorization
            </li>
            <li>
              Assets that primarily reproduce content from other sources without
              significant modification or improvement
            </li>
          </ul>

          <h2>4. Intellectual Property</h2>
          <h3>4.1 Your Rights</h3>
          <p>
            You retain ownership of all intellectual property rights in your
            assets. By uploading assets to the Platform, you grant us a
            non-exclusive, worldwide, royalty-free license to display, promote,
            and distribute your assets through the Platform.
          </p>

          <h3>4.2 Licensing to Buyers</h3>
          <p>
            You are responsible for selecting appropriate license terms for your
            assets. The Platform provides standard license templates, but you
            may customize these terms. You authorize us to issue licenses to
            buyers on your behalf according to the terms you specify.
          </p>

          <h3>4.3 Representations and Warranties</h3>
          <p>You represent and warrant that:</p>
          <ul>
            <li>
              You own or have properly licensed all rights to the assets you
              upload
            </li>
            <li>
              Your assets do not infringe on any third-party intellectual
              property rights
            </li>
            <li>
              You have the right to grant the licenses specified in these Terms
            </li>
            <li>Your assets comply with all applicable laws and regulations</li>
          </ul>

          <h2>5. Moderation and Review</h2>
          <h3>5.1 Review Process</h3>
          <p>
            All assets are subject to review before being published on the
            Platform. We may reject assets that do not meet our quality
            standards or that violate these Terms. The review process may
            include both automated and manual review.
          </p>

          <h3>5.2 Ongoing Compliance</h3>
          <p>
            Even after approval, assets remain subject to ongoing review. We may
            remove assets at any time if they are found to violate these Terms
            or if we receive valid complaints about the assets.
          </p>

          <h2>6. Fees and Payments</h2>
          <h3>6.1 Commission Structure</h3>
          <p>
            The Platform charges a commission on each sale of your assets. The
            current commission rate is 20% of the sale price. We reserve the
            right to change the commission rate with 30 days notice.
          </p>

          <h3>6.2 Payment Processing</h3>
          <p>
            Payments are processed instantly after each sale. You will receive
            80% of the sale price directly to your connected payment account
            immediately after a successful transaction. The Platform retains the
            20% commission at the time of sale. There is no minimum payout
            threshold or waiting period.
          </p>

          <h3>6.3 Taxes</h3>
          <p>
            You are responsible for all taxes associated with your earnings on
            the Platform. We may collect and remit taxes as required by law,
            which may affect the amount you receive.
          </p>

          <h2>7. Creator Responsibilities</h2>
          <h3>7.1 Support</h3>
          <p>
            You are responsible for providing reasonable support to buyers of
            your assets. This includes responding to questions, addressing
            issues, and providing updates as necessary.
          </p>

          <h3>7.2 Updates and Maintenance</h3>
          <p>
            You should maintain your assets and provide updates as needed to
            ensure they continue to function as described. Significant changes
            to functionality should be clearly communicated to existing buyers.
          </p>

          <h3>7.3 Accurate Descriptions</h3>
          <p>
            You must provide accurate and complete descriptions of your assets,
            including features, requirements, and limitations. Misleading
            descriptions may result in refunds and account penalties.
          </p>

          <h2>8. Term and Termination</h2>
          <h3>8.1 Term</h3>
          <p>
            These Terms remain in effect as long as you maintain a Creator
            account on the Platform.
          </p>

          <h3>8.2 Termination by You</h3>
          <p>
            You may terminate your Creator account at any time by following the
            account closure process in your settings. Termination does not
            affect existing licenses granted to buyers.
          </p>

          <h3>8.3 Termination by Us</h3>
          <p>
            We may terminate or suspend your Creator account at any time for
            violations of these Terms or for any other reason at our discretion.
            Upon termination, you will lose access to the Creator Dashboard and
            the ability to upload new assets.
          </p>

          <h3>8.4 Effect of Termination</h3>
          <p>
            Upon termination, we may remove your assets from the Platform, but
            existing licenses to buyers will remain valid. Any pending payments
            will be processed according to our regular payment schedule, subject
            to any offsets for refunds or chargebacks.
          </p>

          <h2>9. Dispute Resolution</h2>
          <p>
            Any disputes between you and the Platform will be resolved according
            to the dispute resolution provisions in our general Terms of
            Service.
          </p>

          <h2>10. Changes to Terms</h2>
          <p>
            We may update these Creator Terms from time to time. We will notify
            you of significant changes by email or through the Platform. Your
            continued use of the Creator features after such changes constitutes
            acceptance of the updated Terms.
          </p>

          <h2>11. Contact Information</h2>
          <p>
            If you have questions about these Creator Terms, please contact us
            at {CREATORS_EMAIL}.
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
