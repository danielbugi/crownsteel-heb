'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { SearchHeroSection } from '@/components/layout/hero-section';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      title: 'Orders & Shipping',
      questions: [
        {
          question: 'How long does shipping take?',
          answer:
            'Standard shipping within Israel takes 3-5 business days. Express shipping is available for next-day delivery in major cities. International shipping times vary by destination, typically 7-14 business days.',
        },
        {
          question: 'Do you offer free shipping?',
          answer:
            'Yes! We offer free standard shipping on all orders over ₪500 within Israel. International orders over $200 also qualify for free shipping.',
        },
        {
          question: 'Can I track my order?',
          answer:
            "Absolutely! Once your order ships, you'll receive a tracking number via email. You can also track your order status by logging into your account and viewing your order history.",
        },
      ],
    },
    {
      title: 'Returns & Exchanges',
      questions: [
        {
          question: 'What is your return policy?',
          answer:
            'We offer a 30-day return policy on all unworn items in their original packaging. Custom and personalized pieces are final sale. Returns are free within Israel, and we provide a prepaid shipping label.',
        },
        {
          question: 'How do I exchange an item?',
          answer:
            "To exchange an item, contact our customer service team within 30 days of delivery. We'll arrange for the return pickup and send your replacement item. Exchanges are subject to availability.",
        },
        {
          question: 'What if my item arrives damaged?',
          answer:
            "If your item arrives damaged, please contact us immediately with photos. We'll arrange for a replacement or full refund at no cost to you. All items are insured during shipping.",
        },
      ],
    },
    {
      title: 'Product Care',
      questions: [
        {
          question: 'How do I care for my jewelry?',
          answer:
            'Each piece comes with specific care instructions. Generally: avoid water and chemicals, store in a dry place, clean gently with a soft cloth. For deep cleaning, bring your piece to our store or a professional jeweler.',
        },
        {
          question: 'Is your jewelry water-resistant?',
          answer:
            'While many of our pieces are made from durable materials like titanium and stainless steel, we recommend removing jewelry before swimming, showering, or exercising to maintain its appearance and longevity.',
        },
        {
          question: 'Do you offer repair services?',
          answer:
            'Yes! We offer complimentary repairs for manufacturing defects covered under warranty. Additional repair services are available for a fee. Contact us for a quote.',
        },
      ],
    },
    {
      title: 'Sizing & Fit',
      questions: [
        {
          question: 'How do I find my ring size?',
          answer:
            'We offer a free ring sizer that you can order online. Alternatively, visit any jewelry store for professional sizing. Our size guide provides detailed measuring instructions.',
        },
        {
          question: 'Can rings be resized?',
          answer:
            'Most of our rings can be resized within 1-2 sizes. However, some materials like tungsten and carbon fiber cannot be resized. Contact us before ordering if you have sizing concerns.',
        },
      ],
    },
    {
      title: 'Payment & Security',
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer:
            'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers. All transactions are secured with SSL encryption.',
        },
        {
          question: 'Is my payment information secure?',
          answer:
            'Absolutely. We use industry-standard encryption and never store your complete credit card information. All payments are processed through secure, PCI-compliant payment gateways.',
        },
      ],
    },
  ];

  const allQuestions = faqCategories.flatMap((category) =>
    category.questions.map((q) => ({ ...q, category }))
  );

  const filteredQuestions = searchQuery
    ? allQuestions.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="min-h-screen bg-background">
      <SearchHeroSection
        title="Frequently Asked Questions"
        description="Find answers to the most common questions"
        searchElement={
          <div className="relative">
            <Search
              className="absolute left-3 top-3 h-5 w-5 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white text-black"
            />
          </div>
        }
      />{' '}
      {/* FAQ Content */}
      <section className="py-16">
        <div className="container px-4 mx-auto max-w-4xl">
          {filteredQuestions ? (
            // Show filtered results
            <div>
              <p className="text-muted-foreground mb-6">
                Found {filteredQuestions.length} results
              </p>
              <Accordion type="single" collapsible className="space-y-4">
                {filteredQuestions.map((item, index) => (
                  <Card key={index}>
                    <AccordionItem value={`item-${index}`} className="border-0">
                      <AccordionTrigger className="px-6 hover:no-underline">
                        <span className="text-left font-semibold">
                          {item.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                ))}
              </Accordion>
              {filteredQuestions.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  No results found
                </p>
              )}
            </div>
          ) : (
            // Show categories
            <div className="space-y-12">
              {faqCategories.map((category, catIndex) => (
                <div key={catIndex}>
                  <h2 className="text-2xl font-bold mb-6">{category.title}</h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((q, qIndex) => (
                      <Card key={qIndex}>
                        <AccordionItem
                          value={`cat-${catIndex}-q-${qIndex}`}
                          className="border-0"
                        >
                          <AccordionTrigger className="px-6 hover:no-underline">
                            <span className="text-left font-semibold">
                              {q.question}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4 text-muted-foreground">
                            {q.answer}
                          </AccordionContent>
                        </AccordionItem>
                      </Card>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* Contact CTA */}
      <section className="py-16 bg-secondary/30">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-muted-foreground mb-6">
            Our customer service team is here to help
          </p>
          <a
            href="/contact"
            className="inline-block bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
