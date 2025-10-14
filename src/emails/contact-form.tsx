import { Text, Section } from '@react-email/components';
import { EmailLayout } from './components/layout';

interface ContactFormEmailProps {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export function ContactFormEmail({
  name,
  email,
  phone,
  subject,
  message,
}: ContactFormEmailProps) {
  return (
    <EmailLayout preview={`Contact Form: ${subject}`}>
      {/* Alert Box */}
      <Section style={alertBox}>
        <Text style={alertIcon}>📧</Text>
        <Text style={alertTitle}>New Contact Form Submission</Text>
      </Section>

      {/* Contact Details */}
      <Section style={section}>
        <Text style={label}>From:</Text>
        <Text style={value}>{name}</Text>
        <Text style={valueSecondary}>{email}</Text>
        {phone && <Text style={valueSecondary}>{phone}</Text>}
      </Section>

      {/* Subject */}
      <Section style={section}>
        <Text style={label}>Subject:</Text>
        <Text style={value}>{subject}</Text>
      </Section>

      {/* Message */}
      <Section style={messageSection}>
        <Text style={label}>Message:</Text>
        <Text style={messageText}>{message}</Text>
      </Section>
    </EmailLayout>
  );
}

// Styles
const section = {
  padding: '16px 0',
  borderBottom: '1px solid #e6ebf1',
};

const alertBox = {
  backgroundColor: '#dbeafe',
  borderRadius: '8px',
  padding: '24px',
  textAlign: 'center' as const,
  margin: '24px 0',
  border: '2px solid #3b82f6',
};

const alertIcon = {
  fontSize: '40px',
  margin: '0 0 12px 0',
};

const alertTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0',
};

const label = {
  fontSize: '12px',
  color: '#666666',
  textTransform: 'uppercase' as const,
  fontWeight: '600',
  margin: '0 0 8px 0',
  letterSpacing: '0.5px',
};

const value = {
  fontSize: '16px',
  color: '#000000',
  fontWeight: '600',
  margin: '0 0 4px 0',
};

const valueSecondary = {
  fontSize: '14px',
  color: '#666666',
  margin: '0 0 4px 0',
};

const messageSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const messageText = {
  fontSize: '14px',
  color: '#000000',
  lineHeight: '24px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};
