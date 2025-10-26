// src/lib/email.ts
import { Resend } from 'resend';
import { emailMonitor } from './email-monitor';
import { WelcomeEmail } from '@/emails/welcome';
import { PasswordResetEmail } from '@/emails/password-reset';
import { OrderConfirmationEmail } from '@/emails/order-confirmation';
import { OrderNotificationAdminEmail } from '@/emails/order-notification-admin';
import { OrderShippedEmail } from '@/emails/order-shipped';
import { ContactFormEmail } from '@/emails/contact-form';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables');
}

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  from?: string;
  replyTo?: string;
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

export interface EmailResult {
  success: boolean;
  data?: unknown;
  error?: unknown;
}

// Rate limiting
const emailRateLimits = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_EMAILS_PER_WINDOW = 5;

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const timestamps = emailRateLimits.get(email) || [];

  const recentTimestamps = timestamps.filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW
  );

  if (recentTimestamps.length >= MAX_EMAILS_PER_WINDOW) {
    return false;
  }

  recentTimestamps.push(now);
  emailRateLimits.set(email, recentTimestamps);
  return true;
}

/**
 * Send an email using Resend with monitoring
 */
export async function sendEmail({
  to,
  subject,
  react,
  from = FROM_EMAIL,
  replyTo,
}: EmailOptions): Promise<EmailResult> {
  const recipient = Array.isArray(to) ? to[0] : to;

  try {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const recipients = Array.isArray(to) ? to : [to];

    for (const email of recipients) {
      if (!emailRegex.test(email)) {
        const error = `Invalid email address: ${email}`;

        // Log validation failure
        emailMonitor.log({
          to: email,
          subject,
          status: 'failed',
          error,
        });

        throw new Error(error);
      }

      // Rate limiting check
      if (!checkRateLimit(email)) {
        console.warn(`Rate limit exceeded for ${email}`);

        // Log rate limit
        emailMonitor.log({
          to: email,
          subject,
          status: 'rate_limited',
        });

        return { success: false, error: 'Rate limit exceeded' };
      }
    }

    // Send email
    const data = await resend.emails.send({
      from,
      to,
      subject,
      react,
      ...(replyTo && { replyTo }),
    });

    console.log('Email sent successfully:', {
      to,
      subject,
      id: data.data?.id,
      timestamp: new Date().toISOString(),
    });

    // Log success
    emailMonitor.log({
      to: recipient,
      subject,
      status: 'sent',
      emailId: data.data?.id,
    });

    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error('Failed to send email:', {
      error,
      to,
      subject,
      timestamp: new Date().toISOString(),
    });

    // Log failure
    emailMonitor.log({
      to: recipient,
      subject,
      status: 'failed',
      error: errorMessage,
    });

    return { success: false, error };
  }
}

/**
 * Send batch emails with retry logic
 */
export async function sendBatchEmails(
  emails: EmailOptions[],
  retries = 3
): Promise<EmailResult[]> {
  const results: EmailResult[] = [];

  for (const emailOptions of emails) {
    let attempt = 0;
    let result: EmailResult | null = null;

    while (attempt < retries) {
      result = await sendEmail(emailOptions);

      if (result.success) {
        break;
      }

      attempt++;
      if (attempt < retries) {
        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    results.push(result!);
  }

  return results;
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(orderData: OrderEmailData) {
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
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `Contact Form: ${data.subject}`,
    react: ContactFormEmail(data),
  });
}

// Export monitor for stats endpoint
export { emailMonitor };
export { resend };
