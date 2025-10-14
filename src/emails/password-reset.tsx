import { Text, Section, Button, Link } from '@react-email/components';
import { EmailLayout } from './components/layout';

interface PasswordResetEmailProps {
  resetUrl: string;
}

export function PasswordResetEmail({ resetUrl }: PasswordResetEmailProps) {
  return (
    <EmailLayout preview="Reset your password">
      {/* Alert Box */}
      <Section style={alertBox}>
        <Text style={alertIcon}>🔐</Text>
        <Text style={alertTitle}>Password Reset Request</Text>
      </Section>

      {/* Main Content */}
      <Section style={section}>
        <Text style={paragraph}>
          We received a request to reset your password for your Forge & Steel
          account. Click the button below to create a new password.
        </Text>
      </Section>

      {/* CTA Button */}
      <Section style={buttonSection}>
        <Button href={resetUrl} style={button}>
          Reset Password
        </Button>
      </Section>

      {/* Link Alternative */}
      <Section style={linkSection}>
        <Text style={linkText}>
          Or copy and paste this URL into your browser:
        </Text>
        <Text style={urlText}>
          <Link href={resetUrl} style={urlLink}>
            {resetUrl}
          </Link>
        </Text>
      </Section>

      {/* Warning Box */}
      <Section style={warningBox}>
        <Text style={warningTitle}>⚠️ Important Security Notice</Text>
        <Text style={warningText}>
          • This link will expire in 1 hour
          <br />
          • If you didn't request this, please ignore this email
          <br />
          • Your password will remain unchanged
          <br />• Never share this link with anyone
        </Text>
      </Section>

      {/* Contact Support */}
      <Section style={section}>
        <Text style={contactText}>
          If you're having trouble or didn't request this password reset, please{' '}
          <Link
            href={`${process.env.NEXT_PUBLIC_URL}/contact`}
            style={linkStyle}
          >
            contact our support team
          </Link>{' '}
          immediately.
        </Text>
      </Section>
    </EmailLayout>
  );
}

// Styles
const section = {
  padding: '24px 0',
};

const alertBox = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  padding: '32px',
  textAlign: 'center' as const,
  margin: '24px 0',
  border: '2px solid #f59e0b',
};

const alertIcon = {
  fontSize: '48px',
  margin: '0 0 16px 0',
};

const alertTitle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0',
};

const paragraph = {
  fontSize: '16px',
  color: '#000000',
  lineHeight: '24px',
  margin: '0',
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
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

const linkSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const linkText = {
  fontSize: '12px',
  color: '#666666',
  margin: '0 0 8px 0',
  textAlign: 'center' as const,
};

const urlText = {
  textAlign: 'center' as const,
  margin: '0',
  wordBreak: 'break-all' as const,
};

const urlLink = {
  fontSize: '12px',
  color: '#000000',
  textDecoration: 'underline',
};

const warningBox = {
  backgroundColor: '#fee2e2',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  border: '2px solid #ef4444',
};

const warningTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0 0 12px 0',
};

const warningText = {
  fontSize: '14px',
  color: '#000000',
  lineHeight: '24px',
  margin: '0',
};

const contactText = {
  fontSize: '14px',
  color: '#666666',
  textAlign: 'center' as const,
  margin: '0',
  lineHeight: '24px',
};

const linkStyle = {
  color: '#000000',
  textDecoration: 'underline',
};
