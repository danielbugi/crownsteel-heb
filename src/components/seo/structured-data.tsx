// src/components/seo/StructuredData.tsx
// Component for rendering JSON-LD structured data in the page head

interface StructuredDataProps {
  data: object | object[];
}

/**
 * StructuredData Component
 * Renders JSON-LD structured data for search engines
 *
 * Usage:
 * <StructuredData data={productSchema} />
 */
export function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 2),
          }}
        />
      ))}
    </>
  );
}

/**
 * Alternative component that can be used in the app directory
 * Returns the script element directly for use in generateMetadata
 */
export function generateStructuredDataScript(data: object | object[]) {
  const jsonLd = Array.isArray(data) ? data : [data];

  return jsonLd.map((schema) => ({
    type: 'application/ld+json',
    children: JSON.stringify(schema, null, 2),
  }));
}
