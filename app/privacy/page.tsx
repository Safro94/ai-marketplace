import { PageContainer } from '@/components/page-container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PRIVACY_EMAIL } from '@/lib/constants'

export const metadata = {
  title: 'Privacy Policy | AI Assets Marketplace',
  description: 'Privacy policy for the AI Assets Marketplace platform.',
}

export default function PrivacyPage() {
  return (
    <PageContainer>
      <Card>
        <CardHeader>
          <CardTitle className='text-3xl'>Privacy Policy</CardTitle>
          <p className='text-muted-foreground'>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </CardHeader>

        <CardContent className='prose dark:prose-invert max-w-none [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&>h3]:font-bold [&>p]:mb-4 [&>ul]:mb-4'>
          <h2>1. Introduction</h2>
          <p>
            AI Assets Marketplace (&quot;we&quot;, &quot;our&quot;, or
            &quot;us&quot;) is committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you use our platform.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, information
            we collect automatically when you use the Platform, and information
            from third-party sources.
          </p>

          <h3>2.1 Information You Provide</h3>
          <p>This includes:</p>
          <ul>
            <li>Account information (name, email, password)</li>
            <li>Profile information (bio, profile picture)</li>
            <li>Payment information</li>
            <li>Content you upload (assets, descriptions, reviews)</li>
            <li>Communications with us or other users</li>
          </ul>

          <h3>2.2 Information We Collect Automatically</h3>
          <p>This includes:</p>
          <ul>
            <li>Usage information (pages visited, time spent)</li>
            <li>Device information (IP address, browser type)</li>
            <li>Location information</li>
            <li>Cookies and similar technologies</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use your information for various purposes, including:</p>
          <ul>
            <li>Providing and improving the Platform</li>
            <li>Processing transactions</li>
            <li>Communicating with you</li>
            <li>Personalizing your experience</li>
            <li>Ensuring security and preventing fraud</li>
            <li>Complying with legal obligations</li>
          </ul>

          <h2>4. How We Share Your Information</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>Other users (as part of your public profile)</li>
            <li>Service providers (payment processors, hosting providers)</li>
            <li>Business partners (with your consent)</li>
            <li>Legal authorities (when required by law)</li>
          </ul>

          <h2>5. Your Choices</h2>
          <p>You have certain choices regarding your information:</p>
          <ul>
            <li>
              Account Information: You can update your account information at
              any time
            </li>
            <li>
              Marketing Communications: You can opt out of marketing emails
            </li>
            <li>
              Cookies: You can manage cookie preferences through your browser
            </li>
            <li>Do Not Track: We respond to Do Not Track signals</li>
          </ul>

          <h2>6. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your
            information. However, no method of transmission over the Internet or
            electronic storage is 100% secure.
          </p>

          <h2>7. Data Retention</h2>
          <p>
            We retain your information for as long as necessary to provide our
            services and fulfill the purposes outlined in this Privacy Policy,
            unless a longer retention period is required by law.
          </p>

          <h2>8. Children&apos;s Privacy</h2>
          <p>
            The Platform is not intended for children under 16. We do not
            knowingly collect information from children under 16.
          </p>

          <h2>9. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries
            other than your country of residence, which may have different data
            protection laws.
          </p>

          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the &quot;Last updated&quot; date.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at {PRIVACY_EMAIL}
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
