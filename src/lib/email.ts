import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables');
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender configuration
// For local development without domain: use 'onboarding@resend.dev'
// For production with verified domain: use 'orders@yourdomain.com'
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  from?: string;
}

export interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  orderDate: Date;
}

export interface ShippingEmailData extends OrderEmailData {
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

/**
 * Send an email using Resend
 */
export async function sendEmail({
  to,
  subject,
  react,
  from = FROM_EMAIL,
}: EmailOptions) {
  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      react,
    });

    console.log('Email sent successfully:', { to, subject, id: data.id });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(orderData: OrderEmailData) {
  const { OrderConfirmationEmail } = await import(
    '@/emails/order-confirmation'
  );

  return sendEmail({
    to: orderData.customerEmail,
    subject: `Order Confirmation #${orderData.orderId}`,
    react: OrderConfirmationEmail(orderData),
  });
}

/**
 * Send order notification to admin
 */
export async function sendOrderNotificationToAdmin(orderData: OrderEmailData) {
  const { OrderNotificationAdminEmail } = await import(
    '@/emails/order-notification-admin'
  );

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Order Received #${orderData.orderId}`,
    react: OrderNotificationAdminEmail(orderData),
  });
}

/**
 * Send shipping notification to customer
 */
export async function sendShippingNotificationEmail(
  shippingData: ShippingEmailData
) {
  const { OrderShippedEmail } = await import('@/emails/order-shipped');

  return sendEmail({
    to: shippingData.customerEmail,
    subject: `Your Order Has Been Shipped #${shippingData.orderId}`,
    react: OrderShippedEmail(shippingData),
  });
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(email: string, name: string) {
  const { WelcomeEmail } = await import('@/emails/welcome');

  return sendEmail({
    to: email,
    subject: 'Welcome to Forge & Steel',
    react: WelcomeEmail({ name }),
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
) {
  const { PasswordResetEmail } = await import('@/emails/password-reset');
  const resetUrl = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${resetToken}`;

  return sendEmail({
    to: email,
    subject: 'Reset Your Password',
    react: PasswordResetEmail({ resetUrl }),
  });
}

/**
 * Send contact form notification to admin
 */
export async function sendContactFormNotification(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const { ContactFormEmail } = await import('@/emails/contact-form');

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `Contact Form: ${data.subject}`,
    react: ContactFormEmail(data),
  });
}

export { resend };
