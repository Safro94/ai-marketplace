import {
  HomeSection,
  HomeSectionDescription,
  HomeSectionTitle,
  HomeSectionTitleContainer,
} from '@/components/page-container'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/lib/constants'
import affiliate from '@/public/affiliate.svg'
import { Star, Users, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { AffiliateHero } from './_components/affiliate-hero'
import { BenefitTiers } from './_components/benefit-tiers'
import { AffiliateCTASection } from './_components/cta-section'

export default function AffiliatePage() {
  return (
    <div>
      <AffiliateHero />

      <HomeSection id='how-it-works' className='max-w-7xl mx-auto'>
        <HomeSectionTitleContainer>
          <HomeSectionTitle>How Our Affiliate Program Works</HomeSectionTitle>

          <HomeSectionDescription>
            Everyone gets rewarded. Whether you&apos;re a regular user or a
            creator, our affiliate program offers increasing benefits as you
            grow.
          </HomeSectionDescription>
        </HomeSectionTitleContainer>

        <div className='grid md:grid-cols-2 gap-12 items-center'>
          <div>
            <Image
              src={affiliate}
              alt='Affiliate program illustration'
              width={600}
              height={400}
            />
          </div>

          <div className='space-y-6'>
            <div className='flex gap-3'>
              <div className='bg-primary p-3 rounded-full h-12 w-12 flex items-center justify-center text-white'>
                <Users className='h-6 w-6' />
              </div>

              <div>
                <h3 className='text-xl font-bold mb-2'>
                  Two Types of Affiliates
                </h3>

                <p className='text-muted-foreground'>
                  Our program supports both regular users and creators, each
                  with their own unique benefits and reward structures.
                </p>
              </div>
            </div>

            <div className='flex gap-3'>
              <div className='bg-primary p-3 rounded-full h-12 w-12 flex items-center justify-center text-white'>
                <Zap className='h-6 w-6' />
              </div>

              <div>
                <h3 className='text-xl font-bold mb-2'>
                  Automatic Code Assignment
                </h3>

                <p className='text-muted-foreground'>
                  When you sign up, you&apos;ll automatically receive your
                  unique referral code. Creators receive an additional code when
                  they achieve creator status.
                </p>
              </div>
            </div>

            <div className='flex gap-3'>
              <div className='bg-primary p-3 rounded-full h-12 w-12 flex items-center justify-center text-white'>
                <Star className='h-6 w-6' />
              </div>

              <div>
                <h3 className='text-xl font-bold mb-2'>Tiered Rewards</h3>
                <p className='text-muted-foreground'>
                  The more successful your referrals are, the better your
                  rewards become. Our tiered system ensures that your benefits
                  grow with your impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </HomeSection>

      <HomeSection className='bg-muted'>
        <div className='max-w-7xl mx-auto'>
          <HomeSectionTitleContainer className='text-center mb-12'>
            <HomeSectionTitle>Affiliate Benefits</HomeSectionTitle>

            <HomeSectionDescription>
              Our program rewards you more as your referrals grow. See how your
              benefits increase over time.
            </HomeSectionDescription>
          </HomeSectionTitleContainer>

          <div className='grid md:grid-cols-[500px_500px] justify-center gap-12'>
            <BenefitTiers
              title='Regular User Benefits'
              description='Get personal discount codes as more people use your referral code at checkout'
              thresholdLabel='Code Uses'
              benefitLabel='Discount'
              thresholds={[20, 100, 500, 1000]}
              benefits={['5%', '7.5%', '10%', '15%']}
            />

            <BenefitTiers
              title='Creator Benefits'
              description='Enjoy lower commission rates as your referrals generate more sales'
              thresholdLabel='Sales Generated'
              benefitLabel='Commission Rate'
              thresholds={[250, 1000, 2500, 5000]}
              benefits={['12.5%', '10%', '7.5%', '5%']}
              prefix='$'
            />
          </div>
        </div>
      </HomeSection>

      <HomeSection className='max-w-7xl mx-auto'>
        <HomeSectionTitleContainer>
          <HomeSectionTitle>Frequently Asked Questions</HomeSectionTitle>

          <HomeSectionDescription>
            Get answers to common questions about our affiliate program.
          </HomeSectionDescription>
        </HomeSectionTitleContainer>

        <div className='grid md:grid-cols-2 gap-6'>
          <Card>
            <CardContent className='pt-6'>
              <h3 className='text-xl font-bold mb-2'>
                How do I become a creator?
              </h3>

              <p className='text-muted-foreground'>
                To become a creator, you need to apply through the{' '}
                <Link href={ROUTES.creators()}>creators page</Link>. Our team
                will review your application and notify you of your status as
                soon as possible.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <h3 className='text-xl font-bold mb-2'>
                How are referrals tracked?
              </h3>

              <p className='text-muted-foreground'>
                Referrals are tracked through your unique code. When someone
                uses your code at checkout and buys a product, it&apos;s
                automatically attributed to your account.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <h3 className='text-xl font-bold mb-2'>
                When do I receive my rewards?
              </h3>

              <p className='text-muted-foreground'>
                Discount codes are issued at the beginning of the next month.
                Only one discount code per milestone. For creators, commission
                rate changes take effect at the beginning of the next month.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <h3 className='text-xl font-bold mb-2'>
                Can I have both user and creator benefits?
              </h3>

              <p className='text-muted-foreground'>
                Yes! If you&apos;re a creator, you&apos;ll have access to both
                your user referral code and your creator code, allowing you to
                benefit from both reward structures.
              </p>
            </CardContent>
          </Card>
        </div>
      </HomeSection>

      <AffiliateCTASection />
    </div>
  )
}
