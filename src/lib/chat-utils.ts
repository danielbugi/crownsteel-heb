// src/lib/chat-utils.ts

import type { ChatProduct } from '@/components/chat/chat-product-card';
import type { ChatCategory } from '@/components/chat/chat-category-card';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  products?: ChatProduct[];
  categories?: ChatCategory[];
}

interface ParsedResponse {
  text: string;
  products?: ChatProduct[];
  categories?: ChatCategory[];
}

/**
 * Parse AI response to extract text and JSON data
 */
export function parseAIResponse(message: string): ParsedResponse {
  let text = message;
  let products: ChatProduct[] | undefined;
  let categories: ChatCategory[] | undefined;

  // Parse PRODUCTS_JSON
  if (message.includes('PRODUCTS_JSON:')) {
    const parsed = extractJSON(message, 'PRODUCTS_JSON:');
    text = parsed.text;
    if (parsed.json) {
      try {
        products = JSON.parse(parsed.json);
      } catch {
        console.error('Failed to parse products JSON');
      }
    }
  }

  // Parse CATEGORIES_JSON
  if (message.includes('CATEGORIES_JSON:')) {
    const parsed = extractJSON(message, 'CATEGORIES_JSON:');
    text = parsed.text;
    if (parsed.json) {
      try {
        categories = JSON.parse(parsed.json);
      } catch {
        console.error('Failed to parse categories JSON');
      }
    }
  }

  return { text: text.trim(), products, categories };
}

/**
 * Extract JSON from message after a marker
 */
function extractJSON(
  message: string,
  marker: string
): { text: string; json: string | null } {
  const lines = message.split('\n');
  let markerIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(marker)) {
      markerIdx = i;
      break;
    }
  }

  if (markerIdx === -1) {
    return { text: message, json: null };
  }

  const textPart = lines.slice(0, markerIdx).join('\n');
  const jsonPart = lines.slice(markerIdx + 1).join('\n');
  const jsonMatch = jsonPart.match(/\[[\s\S]*\]/);

  return {
    text: textPart,
    json: jsonMatch ? jsonMatch[0] : null,
  };
}

// Storage key for chat messages
const CHAT_STORAGE_KEY = 'crown-steel-chat-messages';
const CHAT_EXPIRY_HOURS = 24;

interface StoredChat {
  messages: ChatMessage[];
  timestamp: number;
}

/**
 * Save messages to localStorage
 */
export function saveChatMessages(messages: ChatMessage[]): void {
  if (typeof window === 'undefined') return;

  try {
    const data: StoredChat = {
      messages: messages.map((m) => ({
        ...m,
        timestamp: m.timestamp instanceof Date ? m.timestamp : new Date(m.timestamp),
      })),
      timestamp: Date.now(),
    };
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Load messages from localStorage
 */
export function loadChatMessages(): ChatMessage[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!stored) return [];

    const data: StoredChat = JSON.parse(stored);

    // Check if expired
    const hoursAgo = (Date.now() - data.timestamp) / (1000 * 60 * 60);
    if (hoursAgo > CHAT_EXPIRY_HOURS) {
      localStorage.removeItem(CHAT_STORAGE_KEY);
      return [];
    }

    // Restore Date objects
    return data.messages.map((m) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));
  } catch {
    return [];
  }
}

/**
 * Clear chat messages from localStorage
 */
export function clearChatMessages(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CHAT_STORAGE_KEY);
}

/**
 * Generate unique message ID
 */
export function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
