import { Text, Section, Button, Link } from '@react-email/components';
import { EmailLayout } from './components/layout';
import { ShippingEmailData } from '@/lib/email';

export function OrderShippedEmail({
  orderId,
  customerName,
  trackingNumber,
  estimatedDelivery,
  shippingAddress,
}: ShippingEmailData) {
  const estimatedDate = estimatedDelivery
    ? new Date(estimatedDelivery).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'within 3-5 business days';

  return (
    <EmailLayout preview={`Your order #${orderId} has been shipped`}>
      {/* Success Message */}
      <Section style={successBox}>
        <Text style={successIcon}>📦</Text>
        <Text style={successTitle}>Your Order is on the Way!</Text>
        <Text style={successSubtitle}>
          Hi {customerName}, your package has been shipped
        </Text>
      </Section>

      {/* Order Details */}
      <Section style={section}>
        <Text style={heading}>Order #{orderId}</Text>
        {trackingNumber && (
          <Section style={trackingBox}>
            <Text style={trackingLabel}>Tracking Number</Text>
            <Text style={trackingNumber}>{trackingNumber}</Text>
            <Text style={trackingHint}>
              Click the button below to track your package
            </Text>
          </Section>
        )}
      </Section>

      {/* Delivery Estimate */}
      <Section style={estimateSection}>
        <Text style={estimateIcon}>🚚</Text>
        <Text style={estimateLabel}>Estimated Delivery</Text>
        <Text style={estimateDate}>{estimatedDate}</Text>
        <Text style={estimateNote}>
          Delivery times may vary based on your location
        </Text>
      </Section>

      {/* Shipping Address */}
      <Section style={addressSection}>
        <Text style={subheading}>Shipping To</Text>
        <Text style={address}>
          {shippingAddress.firstName} {shippingAddress.lastName}
          <br />
          {shippingAddress.address}
          <br />
          {shippingAddress.city}, {shippingAddress.postalCode}
          <br />
          Phone: {shippingAddress.phone}
        </Text>
      </Section>

      {/* CTA Button */}
      {trackingNumber && (
        <Section style={buttonSection}>
          <Button
            href={`${process.env.NEXT_PUBLIC_URL}/orders/${orderId}`}
            style={button}
          >
            Track Your Package
          </Button>
        </Section>
      )}

      {/* What's Next */}
      <Section style={infoBox}>
        <Text style={infoTitle}>What to expect</Text>
        <Text style={infoText}>
          ✓ Your package is on its way
          <br />
          ✓ We'll send you updates on delivery progress
          <br />
          ✓ Make sure someone is available to receive the package
          <br />✓ Contact us if you have any questions
        </Text>
      </Section>

      {/* Contact Support */}
      <Section style={section}>
        <Text style={paragraph}>
          Questions about your delivery?{' '}
          <Link
            href={`${process.env.NEXT_PUBLIC_URL}/contact`}
            style={linkStyle}
          >
            Contact our support team
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

const successBox = {
  backgroundColor: '#f0fdf4',
  borderRadius: '8px',
  padding: '32px',
  textAlign: 'center' as const,
  margin: '24px 0',
};

const successIcon = {
  fontSize: '48px',
  margin: '0 0 16px 0',
};

const successTitle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0 0 8px 0',
};

const successSubtitle = {
  fontSize: '16px',
  color: '#666666',
  margin: '0',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
};

const trackingBox = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  padding: '24px',
  textAlign: 'center' as const,
  border: '2px solid #f59e0b',
};

const trackingLabel = {
  fontSize: '12px',
  color: '#666666',
  textTransform: 'uppercase' as const,
  fontWeight: '600',
  margin: '0 0 8px 0',
  letterSpacing: '1px',
};

const trackingNumber = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#000000',
  fontFamily: 'monospace',
  margin: '0 0 8px 0',
  letterSpacing: '2px',
};

const trackingHint = {
  fontSize: '14px',
  color: '#666666',
  margin: '0',
};

const estimateSection = {
  backgroundColor: '#dbeafe',
  borderRadius: '8px',
  padding: '32px',
  textAlign: 'center' as const,
  margin: '24px 0',
};

const estimateIcon = {
  fontSize: '40px',
  margin: '0 0 12px 0',
};

const estimateLabel = {
  fontSize: '14px',
  color: '#666666',
  textTransform: 'uppercase' as const,
  fontWeight: '600',
  margin: '0 0 8px 0',
  letterSpacing: '1px',
};

const estimateDate = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0 0 8px 0',
};

const estimateNote = {
  fontSize: '12px',
  color: '#666666',
  margin: '0',
  fontStyle: 'italic',
};

const subheading = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0 0 16px 0',
};

const addressSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const address = {
  fontSize: '14px',
  color: '#000000',
  lineHeight: '24px',
  margin: '0',
  whiteSpace: 'pre-line' as const,
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
  padding: '16px 32px',
};

const infoBox = {
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const infoTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0 0 12px 0',
};

const infoText = {
  fontSize: '14px',
  color: '#000000',
  lineHeight: '24px',
  margin: '0',
};

const paragraph = {
  fontSize: '14px',
  color: '#666666',
  lineHeight: '24px',
  margin: '0',
  textAlign: 'center' as const,
};

const linkStyle = {
  color: '#000000',
  textDecoration: 'underline',
};
