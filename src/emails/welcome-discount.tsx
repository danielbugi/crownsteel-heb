// src/emails/welcome-discount.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { EmailLayout } from './components/layout';

interface WelcomeDiscountEmailProps {
  email: string;
  couponCode: string;
  discountPercentage: number;
  validUntil?: Date;
}

export function WelcomeDiscountEmail({
  email,
  couponCode,
  discountPercentage,
  validUntil,
}: WelcomeDiscountEmailProps) {
  const previewText = `Welcome! Here's your ${discountPercentage}% discount code`;

  return (
    <EmailLayout previewText={previewText}>
      {/* Welcome Header */}
      <Section style={welcomeSection}>
        <Text style={welcomeIcon}>🎉</Text>
        <Heading style={welcomeTitle}>Welcome to CrownSteel!</Heading>
        <Text style={welcomeText}>
          Thank you for subscribing to our newsletter. As a welcome gift, we're
          giving you an exclusive discount!
        </Text>
      </Section>

      {/* Discount Code Box */}
      <Section style={couponSection}>
        <Text style={couponLabel}>YOUR EXCLUSIVE CODE</Text>
        <div style={couponBox}>
          <Text style={couponCode}>{couponCode}</Text>
        </div>
        <Text style={discountText}>
          {discountPercentage}% OFF YOUR FIRST ORDER
        </Text>
        {validUntil && (
          <Text style={validityText}>
            Valid until {new Date(validUntil).toLocaleDateString()}
          </Text>
        )}
      </Section>

      {/* How to Use */}
      <Section style={section}>
        <Heading style={subheading}>How to Use Your Code</Heading>
        <div style={stepContainer}>
          <Text style={step}>
            <strong>1.</strong> Browse our collection
          </Text>
          <Text style={step}>
            <strong>2.</strong> Add items to your cart
          </Text>
          <Text style={step}>
            <strong>3.</strong> Enter code <strong>{couponCode}</strong> at
            checkout
          </Text>
          <Text style={step}>
            <strong>4.</strong> Enjoy your discount!
          </Text>
        </div>
      </Section>

      {/* CTA Button */}
      <Section style={buttonSection}>
        <Button href={`${process.env.NEXT_PUBLIC_URL}/shop`} style={button}>
          Start Shopping Now
        </Button>
      </Section>

      {/* What to Expect */}
      <Section style={section}>
        <Heading style={subheading}>What to Expect</Heading>
        <Text style={paragraph}>
          As a newsletter subscriber, you'll receive:
        </Text>
        <Text style={benefitText}>✨ Exclusive discounts and offers</Text>
        <Text style={benefitText}>🎁 Early access to new collections</Text>
        <Text style={benefitText}>📰 Style tips and jewelry care guides</Text>
        <Text style={benefitText}>🎉 Special birthday surprises</Text>
      </Section>

      {/* Footer Note */}
      <Section style={footerNote}>
        <Text style={paragraph}>
          Questions? Just reply to this email or{' '}
          <Link href={`${process.env.NEXT_PUBLIC_URL}/contact`} style={link}>
            contact our support team
          </Link>
          .
        </Text>
      </Section>
    </EmailLayout>
  );
}

// Styles
const welcomeSection = {
  backgroundColor: '#f0fdf4',
  borderRadius: '8px',
  padding: '40px 32px',
  textAlign: 'center' as const,
  margin: '0 0 32px 0',
};

const welcomeIcon = {
  fontSize: '48px',
  margin: '0 0 16px 0',
};

const welcomeTitle = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0 0 12px 0',
};

const welcomeText = {
  fontSize: '16px',
  color: '#666666',
  lineHeight: '24px',
  margin: '0',
};

const couponSection = {
  backgroundColor: '#ffffff',
  border: '2px dashed #d4af37',
  borderRadius: '12px',
  padding: '32px',
  textAlign: 'center' as const,
  margin: '0 0 32px 0',
};

const couponLabel = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#666666',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  margin: '0 0 16px 0',
};

const couponBox = {
  backgroundColor: '#f9fafb',
  border: '2px solid #d4af37',
  borderRadius: '8px',
  padding: '20px',
  margin: '0 0 16px 0',
};

const couponCode = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#d4af37',
  letterSpacing: '4px',
  fontFamily: 'monospace',
  margin: '0',
};

const discountText = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#22c55e',
  margin: '0 0 8px 0',
};

const validityText = {
  fontSize: '14px',
  color: '#666666',
  margin: '0',
};

const section = {
  padding: '24px 0',
};

const subheading = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0 0 16px 0',
};

const paragraph = {
  fontSize: '16px',
  color: '#666666',
  lineHeight: '24px',
  margin: '0 0 16px 0',
};

const stepContainer = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '24px',
};

const step = {
  fontSize: '16px',
  color: '#000000',
  lineHeight: '32px',
  margin: '0',
};

const benefitText = {
  fontSize: '16px',
  color: '#000000',
  lineHeight: '32px',
  margin: '0',
};

const buttonSection = {
  padding: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#d4af37',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 48px',
};

const footerNote = {
  borderTop: '1px solid #e6ebf1',
  padding: '24px 0 0 0',
  margin: '24px 0 0 0',
};

const link = {
  color: '#d4af37',
  textDecoration: 'underline',
};

export default WelcomeDiscountEmail;
