'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { APP_DATA, SERVICE_CHARGE } from '@/lib/constants'
import { generateFaqJsonLd } from '@/lib/seo-config'
import { useEffect } from 'react'

const FAQs = [
  {
    question: 'What types of AI assets can I sell?',
    answer:
      'You can sell a variety of AI assets including prompt engineering systems, custom GPTs, AI workflow automations, industry-specific solutions, content templates, and data analysis tools. All assets must be original and provide clear value to users.',
  },
  {
    question: 'How much does it cost to become a creator?',
    answer: `There is no upfront cost to become a creator on ${APP_DATA.name}. We operate on a commission model, taking ${SERVICE_CHARGE * 100}% of each sale. This means you only pay when you earn, and you keep ${100 - SERVICE_CHARGE * 100}% of your revenue.`,
  },
  {
    question: 'How do I get paid?',
    answer:
      'Payments are processed through Stripe. You can set up your payout method in your creator dashboard. We process payments on a monthly basis for all sales, with a minimum payout threshold of $50.',
  },
  {
    question: 'How long does the review process take?',
    answer:
      'The initial creator application review typically takes 2-3 business days. Once approved as a creator, each asset submission is reviewed within 1-2 business days before being published on the marketplace.',
  },
  {
    question: 'Can I set my own prices?',
    answer:
      'Yes, you have full control over pricing your assets. We provide pricing guidance based on market data, but the final decision is yours. You can also offer different license tiers for your assets.',
  },
  {
    question: 'How do I provide updates to my assets?',
    answer:
      'You can update your assets at any time through your creator dashboard. Updates are subject to a quick review process and will be automatically provided to all customers who purchased your asset.',
  },
]

export const CreatorFAQs = () => {
  useEffect(() => {
    // Add FAQ structured data to the page
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(generateFaqJsonLd(FAQs))
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return (
    <Accordion type='single' collapsible className='w-full'>
      {FAQs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className='text-left'>
            {faq.question}
          </AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
