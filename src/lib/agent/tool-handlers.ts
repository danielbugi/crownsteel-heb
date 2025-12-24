// src/lib/agent/tool-handlers.ts
import { prisma } from '@/lib/prisma';
import { ToolName } from './tools';
import {
  searchProductsByCategory,
  getFeaturedProducts,
  getProductsByStyle,
  searchProductsByFilters,
  getAllCategories,
} from './product-tools';

interface ToolInput {
  orderId?: string;
  category?: string;
  subject?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  style?: string;
  minPrice?: number;
  maxPrice?: number;
}

/**
 * Execute a tool and return the result
 */
export async function executeTool(
  toolName: ToolName,
  toolInput: ToolInput,
  userId?: string
): Promise<unknown> {
  switch (toolName) {
    case 'get_order_by_id':
      return await getOrderById(toolInput.orderId);

    case 'get_user_orders':
      if (!userId) throw new Error('User ID required for this operation');
      return await getUserOrders(userId);

    case 'get_order_status':
      return await getOrderStatus(toolInput.orderId);

    case 'get_shipping_info':
      return await getShippingInfo(toolInput.orderId);

    case 'get_faq':
      return await getFAQ(toolInput.category || 'general');

    case 'create_support_ticket':
      if (!userId) throw new Error('User ID required for this operation');
      return await createSupportTicket(
        userId,
        toolInput.subject,
        toolInput.description,
        toolInput.priority
      );

    case 'browse_products_by_category':
      return await browseProductsByCategory(toolInput.category);

    case 'get_featured_products':
      return await browseFeaturedProducts();

    case 'search_products_by_style':
      return await browseProductsByStyle(toolInput.style);

    case 'search_products_by_price':
      return await browseProductsByPrice(
        toolInput.minPrice,
        toolInput.maxPrice
      );

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}

/**
 * Get order details by order ID
 */
async function getOrderById(orderId?: string) {
  if (!orderId) {
    throw new Error('Order ID is required');
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!order) {
    return {
      error: 'Order not found',
      orderId,
    };
  }

  return {
    orderId: order.id,
    status: order.status,
    createdAt: order.createdAt,
    total: order.total.toNumber(),
    subtotal: order.subtotal ? order.subtotal.toNumber() : 0,
    tax: 0,
    shipping: 0,
    items: order.orderItems.map((item) => ({
      productName: item.product.name,
      quantity: item.quantity,
      price: item.price.toNumber(),
      variantId: item.variantId,
    })),
    shippingAddress: order.shippingAddress || {},
  };
}

/**
 * Get all orders for a user
 */
async function getUserOrders(userId: string) {
  // Guest users cannot view their order history
  if (userId === 'guest') {
    return {
      message:
        'To view your order history, please sign in to your account. You can still look up individual orders by their order ID.',
      orders: [],
    };
  }

  const orders = await prisma.order.findMany({
    where: { userId: userId },
    select: {
      id: true,
      status: true,
      total: true,
      createdAt: true,
      orderItems: {
        select: {
          product: {
            select: {
              name: true,
            },
          },
          quantity: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  if (orders.length === 0) {
    return {
      message: 'No orders found',
      orders: [],
    };
  }

  return {
    totalOrders: orders.length,
    orders: orders.map((order) => ({
      orderId: order.id,
      status: order.status,
      total: order.total.toNumber(),
      createdAt: order.createdAt,
      itemCount: order.orderItems.reduce((sum, item) => sum + item.quantity, 0),
    })),
  };
}

/**
 * Get order status
 */
async function getOrderStatus(orderId?: string) {
  if (!orderId) {
    throw new Error('Order ID is required');
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!order) {
    return {
      error: 'Order not found',
      orderId,
    };
  }

  const statusMessages: Record<string, string> = {
    pending: 'Your order is being processed',
    processing: 'We are preparing your order for shipment',
    shipped: 'Your order has been shipped',
    delivered: 'Your order has been delivered',
    cancelled: 'Your order has been cancelled',
  };

  return {
    orderId: order.id,
    status: order.status,
    statusMessage: statusMessages[order.status] || order.status,
    createdAt: order.createdAt,
    lastUpdated: order.updatedAt,
  };
}

/**
 * Get shipping information
 */
async function getShippingInfo(orderId?: string) {
  if (!orderId) {
    throw new Error('Order ID is required');
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      shippingAddress: true,
      createdAt: true,
    },
  });

  if (!order) {
    return {
      error: 'Order not found',
      orderId,
    };
  }

  // Calculate estimated delivery (2-5 business days from order date)
  const estimatedDelivery = new Date(order.createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 4);

  return {
    orderId: order.id,
    status: order.status,
    shippingAddress: order.shippingAddress || {},
    estimatedDelivery: estimatedDelivery.toISOString().split('T')[0],
    note: 'Standard shipping within Israel: 2-5 business days',
  };
}

/**
 * Get FAQ by category - Hebrew version
 */
async function getFAQ(category: string): Promise<Record<string, unknown>> {
  const faqs: Record<string, Array<{ q: string; a: string }>> = {
    shipping: [
      {
        q: 'כמה זמן לוקח המשלוח?',
        a: "משלוח רגיל בתוך ישראל לוקח 2-5 ימי עסקים. אנחנו שולחים ימי ב'-ד' בלבד.",
      },
      {
        q: 'האם יש משלוח חינם?',
        a: 'כן! משלוח חינם על הזמנות של 350 שקל ומעלה. אחרת, משלוח עולה 20 שקל.',
      },
      {
        q: 'האם אני יכול לעקוב אחר ההזמנה שלי?',
        a: 'כן, נשלחים לך מספר עקיבה בדוא"ל כשההזמנה נשולחת.',
      },
    ],
    returns: [
      {
        q: 'מה המדיניות החזרות שלכם?',
        a: 'אנחנו מקבלים החזרות עד 30 ימים מיום הקנייה אם המוצרים לא שומשו ובמצב המקורי שלהם.',
      },
      {
        q: 'איך אני מחזיר מוצר?',
        a: 'פנה לשירות הלקוחות שלנו וניתן לך תווית החזרה.',
      },
      {
        q: 'מתי אקבל את ההחזר שלי?',
        a: 'פיקדונות מעובדים תוך 7-10 ימי עסקים לאחר שקיבלנו את ההחזרה שלך.',
      },
    ],
    payments: [
      {
        q: 'אילו שיטות תשלום אתם מקבלים?',
        a: 'אנחנו מקבלים כרטיסי אשראי (Visa, Mastercard, American Express), Apple Pay ו-Google Pay.',
      },
      {
        q: 'האם פרטי התשלום שלי בטוחים?',
        a: 'כן, אנחנו משתמשים בהצפנה סטנדרטית של תעשייה (SSL) ותאימות PCI כדי להגן על הנתונים שלך.',
      },
      {
        q: 'האם אתה מקבל PayPal?',
        a: 'כרגע אנחנו לא מקבלים PayPal, אבל אנחנו עובדים על הוספתו בקרוב.',
      },
    ],
    products: [
      {
        q: 'איך אני יודע את הגודל של הטבעת שלי?',
        a: 'השתמש במדריך הגדלים החינמי שלנו בדפי המוצרים, או מדוד טבעת קיימת שמתאימה לך.',
      },
      {
        q: 'האם אתה יכול להתאים אישית תכשיטים?',
        a: 'כן! אנחנו מתמחים בהזמנות מותאמות. צור קשר לפרטים.',
      },
      {
        q: 'אילו חומרים אתה משתמש?',
        a: 'אנחנו עובדים עם כסף סטרלינג, זהב 14K, זהב 18K ועוד חומרים פרימיום. בדוק תיאורי מוצרים לפרטים.',
      },
    ],
    general: [
      {
        q: 'איך אני יוצר קשר עם שירות הלקוחות?',
        a: 'שלח אלינו דוא"ל ל- contact@crownsteel.com או התקשר ל- +972-50-123-4567. אנחנו משיבים תוך 24 שעות.',
      },
      {
        q: 'האם לכם חנות פיזית?',
        a: 'כרגע אנחנו פועלים באופן מקוון בלבד, אבל אנחנו מתכננים לפתוח שלוחה בתל אביב.',
      },
      {
        q: 'מי אתה?',
        a: 'Crown Steel היא חברה מקדמת לתכשיטים גברים פרימיום, המתמחה בטבעות, צמידים, שרשראות ותיקיות. כל פיסה מעוצבת בעיתון ממשיכה נעשית עם חומרים משובחים.',
      },
    ],
  };

  const categoryFAQ = faqs[category] || faqs['general'];

  return {
    category,
    faqCount: categoryFAQ.length,
    faqs: categoryFAQ,
  };
}

/**
 * Browse products by category
 */
async function browseProductsByCategory(
  category?: string
): Promise<Record<string, unknown>> {
  if (!category) {
    const categories = await getAllCategories();

    const formattedCategories = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: c.image,
      productCount: c.productCount,
    }));

    return {
      message: 'בחר קטגוריה:',
      categoriesJson: JSON.stringify(formattedCategories),
    };
  }

  const products = await searchProductsByCategory(category, 6);

  if (products.length === 0) {
    return {
      message: `לא נמצאו מוצרים בקטגוריה ${category}`,
    };
  }

  const formattedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    image: p.image,
    rating: p.rating,
    reviews: p.reviews,
  }));

  return {
    message: `הנה המוצרים בקטגוריית ${category}:`,
    productsJson: JSON.stringify(formattedProducts),
  };
}

/**
 * Get featured products
 */
async function browseFeaturedProducts(): Promise<Record<string, unknown>> {
  const products = await getFeaturedProducts(6);

  const formattedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    image: p.image,
    rating: p.rating,
    reviews: p.reviews,
  }));

  return {
    message: 'הנה המוצרים המובילים שלנו:',
    productsJson: JSON.stringify(formattedProducts),
  };
}

/**
 * Browse products by style
 */
async function browseProductsByStyle(
  style?: string
): Promise<Record<string, unknown>> {
  if (!style) {
    return {
      message:
        "בחר סגנון:\n• מינימליסטי - פשוט ומודרני\n• קלאסי - אלגנטי וטימלס\n• הצהרה - בולד וייחודי\n• וינטג' - רטרו וקלאסי",
    };
  }

  const products = await getProductsByStyle(
    style as 'minimalist' | 'classic' | 'statement' | 'vintage',
    6
  );

  const styleLabels: Record<string, string> = {
    minimalist: 'מינימליסטי',
    classic: 'קלאסי',
    statement: 'הצהרה',
    vintage: "וינטג'",
  };

  const formattedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    image: p.image,
    rating: p.rating,
    reviews: p.reviews,
  }));

  return {
    message: `הנה המוצרים בסגנון ${styleLabels[style] || style}:`,
    productsJson: JSON.stringify(formattedProducts),
  };
}

/**
 * Browse products by price range
 */
async function browseProductsByPrice(
  minPrice?: number,
  maxPrice?: number
): Promise<Record<string, unknown>> {
  if (!minPrice || !maxPrice) {
    return {
      message:
        'בחר טווח מחירים:\n• 0 - 300 שקל\n• 300 - 600 שקל\n• 600 - 1000 שקל\n• 1000+ שקל',
    };
  }

  const products = await searchProductsByFilters(
    undefined,
    minPrice,
    maxPrice,
    6
  );

  const formattedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    image: p.image,
    rating: p.rating,
    reviews: p.reviews,
  }));

  return {
    message: `הנה המוצרים בטווח מחירים ${minPrice} - ${maxPrice} שקל:`,
    productsJson: JSON.stringify(formattedProducts),
  };
}

/**
 * Create a support ticket for a user
 */
async function createSupportTicket(
  userId: string,
  subject?: string,
  description?: string,
  priority?: 'low' | 'medium' | 'high'
) {
  if (!subject) subject = 'Support request';
  if (!description) description = '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ticket = await (prisma as any).supportTicket.create({
    data: {
      customerId: userId,
      subject,
      description,
      priority: priority || 'medium',
    },
  });

  return {
    message: 'Support ticket created',
    ticketId: ticket.id,
  };
}
