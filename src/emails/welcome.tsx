import { Text, Section, Button, Link } from '@react-email/components';
import { EmailLayout } from './components/layout';

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <EmailLayout preview="Welcome to Forge & Steel">
      {/* Welcome Message */}
      <Section style={welcomeBox}>
        <Text style={welcomeIcon}>👋</Text>
        <Text style={welcomeTitle}>Welcome to Forge & Steel!</Text>
        <Text style={welcomeSubtitle}>
          Hi {name}, we&apos;re excited to have you
        </Text>
      </Section>

      {/* Main Content */}
      <Section style={section}>
        <Text style={paragraph}>
          Thank you for joining Forge & Steel, your destination for premium
          men&apos;s jewelry. We craft every piece with precision and passion to
          help you express your unique style.
        </Text>
      </Section>

      {/* Benefits */}
      <Section style={benefitsSection}>
        <Text style={benefitsTitle}>Your Member Benefits</Text>
        <Text style={benefitItem}>✓ Free shipping on all orders</Text>
        <Text style={benefitItem}>✓ Early access to new collections</Text>
        <Text style={benefitItem}>✓ Exclusive member-only promotions</Text>
        <Text style={benefitItem}>✓ Priority customer support</Text>
        <Text style={benefitItem}>✓ Easy order tracking</Text>
      </Section>

      {/* CTA */}
      <Section style={ctaSection}>
        <Text style={ctaText}>Ready to explore our collection?</Text>
        <Button href={`${process.env.NEXT_PUBLIC_URL}/shop`} style={button}>
          Start Shopping
        </Button>
      </Section>

      {/* Featured Categories */}
      <Section style={categoriesSection}>
        <Text style={categoriesTitle}>Popular Categories</Text>
        <Text style={categoryLinks}>
          <Link
            href={`${process.env.NEXT_PUBLIC_URL}/shop?category=rings`}
            style={categoryLink}
          >
            Rings
          </Link>
          {' • '}
          <Link
            href={`${process.env.NEXT_PUBLIC_URL}/shop?category=bracelets`}
            style={categoryLink}
          >
            Bracelets
          </Link>
          {' • '}
          <Link
            href={`${process.env.NEXT_PUBLIC_URL}/shop?category=necklaces`}
            style={categoryLink}
          >
            Necklaces
          </Link>
        </Text>
      </Section>

      {/* Contact */}
      <Section style={section}>
        <Text style={contactText}>
          Have questions? We&apos;re here to help!{' '}
          <Link
            href={`${process.env.NEXT_PUBLIC_URL}/contact`}
            style={linkStyle}
          >
            Contact us
          </Link>
        </Text>
      </Section>
    </EmailLayout>
  );
}

// Styles
const section = {
  padding: '24px 0',
};

const welcomeBox = {
  backgroundColor: '#f0fdf4',
  borderRadius: '8px',
  padding: '40px 32px',
  textAlign: 'center' as const,
  margin: '24px 0',
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

const welcomeSubtitle = {
  fontSize: '16px',
  color: '#666666',
  margin: '0',
};

const paragraph = {
  fontSize: '16px',
  color: '#000000',
  lineHeight: '24px',
  margin: '0',
};

const benefitsSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const benefitsTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
};

const benefitItem = {
  fontSize: '14px',
  color: '#000000',
  lineHeight: '28px',
  margin: '0',
};

const ctaSection = {
  textAlign: 'center' as const,
  padding: '32px 0',
};

const ctaText = {
  fontSize: '18px',
  color: '#000000',
  margin: '0 0 24px 0',
  fontWeight: '600',
};

const button = {
  backgroundColor: '#000000',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 48px',
};

const categoriesSection = {
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const categoriesTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0 0 16px 0',
};

const categoryLinks = {
  fontSize: '14px',
  margin: '0',
};

const categoryLink = {
  color: '#000000',
  textDecoration: 'underline',
  fontWeight: '600',
};

const contactText = {
  fontSize: '14px',
  color: '#666666',
  textAlign: 'center' as const,
  margin: '0',
};

const linkStyle = {
  color: '#000000',
  textDecoration: 'underline',
};
