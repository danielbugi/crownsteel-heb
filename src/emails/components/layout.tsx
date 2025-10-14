import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Img,
} from '@react-email/components';

interface EmailLayoutProps {
  children: React.ReactNode;
  preview?: string;
}

export function EmailLayout({ children, preview }: EmailLayoutProps) {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
      </Head>
      <Body style={main}>
        {preview && <Text style={previewText}>{preview}</Text>}
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Img
              src={`${process.env.NEXT_PUBLIC_URL}/logo.png`}
              width="120"
              height="40"
              alt="Forge & Steel"
              style={logo}
            />
          </Section>

          {/* Main Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              <strong>Forge & Steel</strong>
              <br />
              Premium Men's Jewelry
              <br />
              123 Main Street, Tel Aviv, Israel
              <br />
              <Link href="tel:+972-50-123-4567" style={link}>
                +972-50-123-4567
              </Link>
              {' | '}
              <Link href={`${process.env.NEXT_PUBLIC_URL}`} style={link}>
                forgesteel.com
              </Link>
            </Text>
            <Text style={footerText}>
              <Link
                href={`${process.env.NEXT_PUBLIC_URL}/contact`}
                style={link}
              >
                Contact Us
              </Link>
              {' | '}
              <Link href={`${process.env.NEXT_PUBLIC_URL}/faq`} style={link}>
                FAQ
              </Link>
              {' | '}
              <Link
                href={`${process.env.NEXT_PUBLIC_URL}/returns`}
                style={link}
              >
                Returns
              </Link>
            </Text>
            <Text style={footerTextSmall}>
              © 2024 Forge & Steel. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const previewText = {
  display: 'none',
  overflow: 'hidden',
  lineHeight: '1px',
  opacity: 0,
  maxHeight: 0,
  maxWidth: 0,
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 20px',
  textAlign: 'center' as const,
  backgroundColor: '#000000',
};

const logo = {
  margin: '0 auto',
};

const content = {
  padding: '0 48px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  padding: '0 48px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '8px 0',
};

const footerTextSmall = {
  color: '#8898aa',
  fontSize: '10px',
  lineHeight: '14px',
  marginTop: '16px',
};

const link = {
  color: '#000000',
  textDecoration: 'underline',
};
