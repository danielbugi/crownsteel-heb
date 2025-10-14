import {
  Text,
  Section,
  Row,
  Column,
  Img,
  Link,
  Button,
} from '@react-email/components';
import { EmailLayout } from './components/layout';
import { OrderEmailData } from '@/lib/email';

export function OrderConfirmationEmail({
  orderId,
  customerName,
  items,
  subtotal,
  tax,
  shipping,
  total,
  shippingAddress,
  orderDate,
}: OrderEmailData) {
  const formattedDate = new Date(orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <EmailLayout preview={`Order confirmation #${orderId}`}>
      {/* Success Message */}
      <Section style={successBox}>
        <Text style={successIcon}>✓</Text>
        <Text style={successTitle}>Order Confirmed!</Text>
        <Text style={successSubtitle}>
          Thank you for your order, {customerName}
        </Text>
      </Section>

      {/* Order Details Header */}
      <Section style={section}>
        <Text style={heading}>Order #{orderId}</Text>
        <Text style={paragraph}>Placed on {formattedDate}</Text>
      </Section>

      {/* Order Items */}
      <Section style={section}>
        <Text style={subheading}>Order Items</Text>
        {items.map((item, index) => (
          <Row key={index} style={itemRow}>
            <Column style={itemImageColumn}>
              {item.image && (
                <Img
                  src={item.image}
                  alt={item.name}
                  width="80"
                  height="80"
                  style={itemImage}
                />
              )}
            </Column>
            <Column style={itemDetailsColumn}>
              <Text style={itemName}>{item.name}</Text>
              <Text style={itemMeta}>
                Quantity: {item.quantity} × {formatPrice(item.price)}
              </Text>
            </Column>
            <Column style={itemPriceColumn}>
              <Text style={itemPrice}>
                {formatPrice(item.price * item.quantity)}
              </Text>
            </Column>
          </Row>
        ))}
      </Section>

      {/* Order Summary */}
      <Section style={summarySection}>
        <Row style={summaryRow}>
          <Column>
            <Text style={summaryLabel}>Subtotal</Text>
          </Column>
          <Column align="right">
            <Text style={summaryValue}>{formatPrice(subtotal)}</Text>
          </Column>
        </Row>
        <Row style={summaryRow}>
          <Column>
            <Text style={summaryLabel}>Shipping</Text>
          </Column>
          <Column align="right">
            <Text style={summaryValue}>
              {shipping === 0 ? 'FREE' : formatPrice(shipping)}
            </Text>
          </Column>
        </Row>
        <Row style={summaryRow}>
          <Column>
            <Text style={summaryLabel}>Tax (VAT)</Text>
          </Column>
          <Column align="right">
            <Text style={summaryValue}>{formatPrice(tax)}</Text>
          </Column>
        </Row>
        <Row style={totalRow}>
          <Column>
            <Text style={totalLabel}>Total</Text>
          </Column>
          <Column align="right">
            <Text style={totalValue}>{formatPrice(total)}</Text>
          </Column>
        </Row>
      </Section>

      {/* Shipping Address */}
      <Section style={section}>
        <Text style={subheading}>Shipping Address</Text>
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

      {/* What's Next */}
      <Section style={infoBox}>
        <Text style={infoTitle}>What happens next?</Text>
        <Text style={infoText}>
          ✓ We'll send you a shipping confirmation email with tracking
          information
          <br />
          ✓ Your order will be carefully packaged and shipped within 2-3
          business days
          <br />
          ✓ Free shipping to all of Israel
          <br />✓ Questions? Contact us anytime
        </Text>
      </Section>

      {/* CTA Button */}
      <Section style={buttonSection}>
        <Button
          href={`${process.env.NEXT_PUBLIC_URL}/orders/${orderId}`}
          style={button}
        >
          Track Your Order
        </Button>
      </Section>

      {/* Contact */}
      <Section style={section}>
        <Text style={paragraph}>
          Have questions about your order?{' '}
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
  color: '#22c55e',
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
  margin: '0 0 8px 0',
};

const subheading = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0 0 16px 0',
};

const paragraph = {
  fontSize: '14px',
  color: '#666666',
  lineHeight: '24px',
  margin: '0',
};

const itemRow = {
  borderBottom: '1px solid #e6ebf1',
  padding: '16px 0',
};

const itemImageColumn = {
  width: '80px',
  paddingRight: '16px',
};

const itemImage = {
  borderRadius: '8px',
  objectFit: 'cover' as const,
};

const itemDetailsColumn = {
  verticalAlign: 'top' as const,
};

const itemPriceColumn = {
  width: '100px',
  textAlign: 'right' as const,
  verticalAlign: 'top' as const,
};

const itemName = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#000000',
  margin: '0 0 4px 0',
};

const itemMeta = {
  fontSize: '14px',
  color: '#666666',
  margin: '0',
};

const itemPrice = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#000000',
  margin: '0',
};

const summarySection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const summaryRow = {
  padding: '8px 0',
};

const summaryLabel = {
  fontSize: '14px',
  color: '#666666',
  margin: '0',
};

const summaryValue = {
  fontSize: '14px',
  color: '#000000',
  margin: '0',
};

const totalRow = {
  borderTop: '2px solid #000000',
  padding: '16px 0 0 0',
  marginTop: '8px',
};

const totalLabel = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0',
};

const totalValue = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0',
};

const address = {
  fontSize: '14px',
  color: '#000000',
  lineHeight: '24px',
  margin: '0',
  whiteSpace: 'pre-line' as const,
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

const linkStyle = {
  color: '#000000',
  textDecoration: 'underline',
};
