import {
  Text,
  Section,
  Row,
  Column,
  Button,
  Link,
} from '@react-email/components';
import { EmailLayout } from './components/layout';
import { OrderEmailData } from '@/lib/email';

export function OrderNotificationAdminEmail({
  orderId,
  customerName,
  customerEmail,
  items,
  total,
  shippingAddress,
  orderDate,
}: OrderEmailData) {
  const formattedDate = new Date(orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <EmailLayout preview={`New order #${orderId} from ${customerName}`}>
      {/* Alert Box */}
      <Section style={alertBox}>
        <Text style={alertIcon}>🔔</Text>
        <Text style={alertTitle}>New Order Received!</Text>
        <Text style={alertSubtitle}>Order #{orderId}</Text>
      </Section>

      {/* Order Overview */}
      <Section style={section}>
        <Row style={overviewRow}>
          <Column>
            <Text style={label}>Customer</Text>
            <Text style={value}>{customerName}</Text>
          </Column>
          <Column>
            <Text style={label}>Email</Text>
            <Text style={value}>
              <Link href={`mailto:${customerEmail}`} style={linkStyle}>
                {customerEmail}
              </Link>
            </Text>
          </Column>
        </Row>
        <Row style={overviewRow}>
          <Column>
            <Text style={label}>Order Date</Text>
            <Text style={value}>{formattedDate}</Text>
          </Column>
          <Column>
            <Text style={label}>Total</Text>
            <Text style={totalValue}>{formatPrice(total)}</Text>
          </Column>
        </Row>
      </Section>

      {/* Order Items */}
      <Section style={section}>
        <Text style={subheading}>Items Ordered</Text>
        {items.map((item, index) => (
          <Row key={index} style={itemRow}>
            <Column>
              <Text style={itemName}>{item.name}</Text>
            </Column>
            <Column style={itemQuantityColumn}>
              <Text style={itemQuantity}>Qty: {item.quantity}</Text>
            </Column>
            <Column style={itemPriceColumn}>
              <Text style={itemPrice}>
                {formatPrice(item.price * item.quantity)}
              </Text>
            </Column>
          </Row>
        ))}
      </Section>

      {/* Shipping Address */}
      <Section style={addressSection}>
        <Text style={subheading}>Shipping Address</Text>
        <Text style={address}>
          {shippingAddress.firstName} {shippingAddress.lastName}
          <br />
          {shippingAddress.address}
          <br />
          {shippingAddress.city}, {shippingAddress.postalCode}
          <br />
          Phone:{' '}
          <Link href={`tel:${shippingAddress.phone}`} style={linkStyle}>
            {shippingAddress.phone}
          </Link>
        </Text>
      </Section>

      {/* Action Required */}
      <Section style={actionBox}>
        <Text style={actionTitle}>Action Required</Text>
        <Text style={actionText}>
          1. Verify inventory availability
          <br />
          2. Print packing slip
          <br />
          3. Process order within 24 hours
          <br />
          4. Update order status when shipped
        </Text>
      </Section>

      {/* CTA Buttons */}
      <Section style={buttonSection}>
        <Button
          href={`${process.env.NEXT_PUBLIC_URL}/admin/orders/${orderId}`}
          style={primaryButton}
        >
          View Order Details
        </Button>
      </Section>

      <Section style={buttonSection}>
        <Button
          href={`${process.env.NEXT_PUBLIC_URL}/admin/orders`}
          style={secondaryButton}
        >
          Go to Orders Dashboard
        </Button>
      </Section>

      {/* Quick Stats */}
      <Section style={statsSection}>
        <Text style={statsText}>
          💰 Total Revenue: {formatPrice(total)}
          <br />
          📦 Items: {items.reduce((acc, item) => acc + item.quantity, 0)}
          <br />
          📧 Customer: {customerEmail}
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
  margin: '0 0 8px 0',
};

const alertSubtitle = {
  fontSize: '18px',
  color: '#666666',
  margin: '0',
  fontWeight: '600',
};

const overviewRow = {
  padding: '12px 0',
  borderBottom: '1px solid #e6ebf1',
};

const label = {
  fontSize: '12px',
  color: '#666666',
  textTransform: 'uppercase' as const,
  fontWeight: '600',
  margin: '0 0 4px 0',
  letterSpacing: '0.5px',
};

const value = {
  fontSize: '16px',
  color: '#000000',
  margin: '0',
};

const totalValue = {
  fontSize: '20px',
  color: '#16a34a',
  fontWeight: 'bold',
  margin: '0',
};

const subheading = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0 0 16px 0',
};

const itemRow = {
  borderBottom: '1px solid #e6ebf1',
  padding: '12px 0',
};

const itemName = {
  fontSize: '14px',
  color: '#000000',
  fontWeight: '600',
  margin: '0',
};

const itemQuantityColumn = {
  width: '80px',
  textAlign: 'center' as const,
};

const itemQuantity = {
  fontSize: '14px',
  color: '#666666',
  margin: '0',
};

const itemPriceColumn = {
  width: '100px',
  textAlign: 'right' as const,
};

const itemPrice = {
  fontSize: '14px',
  color: '#000000',
  fontWeight: '600',
  margin: '0',
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

const actionBox = {
  backgroundColor: '#dbeafe',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  border: '2px solid #3b82f6',
};

const actionTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0 0 12px 0',
};

const actionText = {
  fontSize: '14px',
  color: '#000000',
  lineHeight: '24px',
  margin: '0',
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '16px 0',
};

const primaryButton = {
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

const secondaryButton = {
  backgroundColor: '#ffffff',
  border: '2px solid #000000',
  borderRadius: '8px',
  color: '#000000',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
};

const statsSection = {
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
};

const statsText = {
  fontSize: '14px',
  color: '#000000',
  lineHeight: '24px',
  margin: '0',
};

const linkStyle = {
  color: '#000000',
  textDecoration: 'underline',
};
