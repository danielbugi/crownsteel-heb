// src/lib/agent/tools.ts
/**
 * Tool definitions for the AI agent
 * These tell OpenAI what actions the agent can perform
 */

import { ChatCompletionTool } from 'openai/resources/chat';

export const AGENT_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'get_order_by_id',
      description:
        'Retrieve order details by order ID. Returns order status, items, total price, and shipping information.',
      parameters: {
        type: 'object',
        properties: {
          orderId: {
            type: 'string',
            description: 'The unique order ID (e.g., "ORD-2024-001")',
          },
        },
        required: ['orderId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_user_orders',
      description:
        'Retrieve all orders for the current user. Returns order history with statuses and totals.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_order_status',
      description:
        'Get the current status of an order (processing, shipped, delivered, etc.)',
      parameters: {
        type: 'object',
        properties: {
          orderId: {
            type: 'string',
            description: 'The order ID to check status for',
          },
        },
        required: ['orderId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_shipping_info',
      description:
        'Get shipping details for an order including tracking number and estimated delivery date',
      parameters: {
        type: 'object',
        properties: {
          orderId: {
            type: 'string',
            description: 'The order ID to get shipping information for',
          },
        },
        required: ['orderId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_faq',
      description:
        'Get frequently asked questions and answers about shipping, returns, payments, and products',
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['shipping', 'returns', 'payments', 'products', 'general'],
            description: 'Category of FAQ to retrieve',
          },
        },
        required: ['category'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_support_ticket',
      description:
        'Create a customer support ticket for complex issues that need admin follow-up',
      parameters: {
        type: 'object',
        properties: {
          subject: {
            type: 'string',
            description: 'Subject of the support ticket',
          },
          description: {
            type: 'string',
            description: 'Detailed description of the issue',
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
            description: 'Priority level of the ticket',
          },
        },
        required: ['subject', 'description', 'priority'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'browse_products_by_category',
      description:
        'Browse products by category. Call without category parameter to see all available categories. Call with specific category to see products in that category.',
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['rings', 'bracelets', 'necklaces', 'cufflinks'],
            description:
              'Product category to browse (optional - omit to see all categories)',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_featured_products',
      description: 'Get featured and best-selling products from Crown Steel',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_products_by_style',
      description:
        'Search for products based on style preference (minimalist, classic, statement, vintage)',
      parameters: {
        type: 'object',
        properties: {
          style: {
            type: 'string',
            enum: ['minimalist', 'classic', 'statement', 'vintage'],
            description: 'Style preference for products',
          },
        },
        required: ['style'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_products_by_price',
      description: 'Search for products within a specific price range',
      parameters: {
        type: 'object',
        properties: {
          minPrice: {
            type: 'number',
            description: 'Minimum price in ILS',
          },
          maxPrice: {
            type: 'number',
            description: 'Maximum price in ILS',
          },
        },
        required: ['minPrice', 'maxPrice'],
      },
    },
  },
] as const satisfies ChatCompletionTool[];

export type ToolName =
  | 'get_order_by_id'
  | 'get_user_orders'
  | 'get_order_status'
  | 'get_shipping_info'
  | 'get_faq'
  | 'create_support_ticket'
  | 'browse_products_by_category'
  | 'get_featured_products'
  | 'search_products_by_style'
  | 'search_products_by_price';
