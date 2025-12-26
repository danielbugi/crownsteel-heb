// src/components/chat/chat-dialog.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2, Send, MessageCircle, X } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  products?: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
    rating: number;
    reviews: number;
  }>;
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
    image?: string;
    productCount: number;
  }>;
}

export function ChatDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const quickActions = [
    { label: 'קטגוריות מובילות', message: 'הראה לי את קטגוריות המוצרים שלכם' },
    { label: 'מוצרים מובילים', message: 'הראה לי את המוצרים המובילים שלכם' },
    { label: 'איך מודדים טבעת?', message: 'איך אני יודע את גודל הטבעת שלי?' },
    { label: 'איפה ההזמנה שלי?', message: 'איך אני עוקב אחר ההזמנה שלי?' },
  ];

  const handleQuickAction = (message: string) => {
    setInput(message);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.dispatchEvent(
          new Event('submit', { bubbles: true, cancelable: true })
        );
      }
    }, 0);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      // Send to agent API
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();

      // Parse products or categories from response if present
      let products: Message['products'] = undefined;
      let categories: Message['categories'] = undefined;
      let responseText = data.message;

      // Check for PRODUCTS_JSON
      if (data.message.includes('PRODUCTS_JSON:')) {
        const lines = data.message.split('\n');
        let jsonStartIdx = -1;

        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('PRODUCTS_JSON:')) {
            jsonStartIdx = i;
            break;
          }
        }

        if (jsonStartIdx !== -1) {
          try {
            const remainingLines = lines.slice(jsonStartIdx + 1);
            const jsonStr = remainingLines.join('\n');
            const jsonMatch = jsonStr.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              products = JSON.parse(jsonMatch[0]);
              responseText = lines.slice(0, jsonStartIdx).join('\n').trim();
            }
          } catch (e) {
            console.error('Failed to parse products:', e);
          }
        }
      }

      // Check for CATEGORIES_JSON
      if (data.message.includes('CATEGORIES_JSON:')) {
        const lines = data.message.split('\n');
        let jsonStartIdx = -1;

        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('CATEGORIES_JSON:')) {
            jsonStartIdx = i;
            break;
          }
        }

        if (jsonStartIdx !== -1) {
          try {
            const remainingLines = lines.slice(jsonStartIdx + 1);
            const jsonStr = remainingLines.join('\n');
            const jsonMatch = jsonStr.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              categories = JSON.parse(jsonMatch[0]);
              responseText = lines.slice(0, jsonStartIdx).join('\n').trim();
            }
          } catch (e) {
            console.error('Failed to parse categories:', e);
          }
        }
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
        products,
        categories,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'אירעה שגיאה';
      setError(errorMessage);
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button - Responsive positioning */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-blue-600 shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center text-white active:scale-95"
            title="פתח צ'אט"
            aria-label="Open chat"
          >
            <MessageCircle className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Floating Chat Box - Mobile full screen, Desktop fixed size */}
      {isOpen && (
        <>
          {/* Mobile Overlay - Close on background click */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Chat Container - Responsive */}
          <div
            className="fixed inset-0 md:inset-auto md:bottom-24 md:right-6 md:w-96 z-50 bg-white rounded-none md:rounded-2xl shadow-2xl flex flex-col border-0 md:border border-gray-200 md:h-[600px] h-screen md:max-h-[600px]"
            dir="rtl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 md:px-6 py-3 md:py-4 rounded-none md:rounded-t-2xl flex justify-between items-center flex-shrink-0">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-blue-100 transition-colors p-1 active:scale-90"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="text-right flex-1 mr-2">
                <h3 className="font-semibold text-base md:text-lg">
                  Crown Steel Support
                </h3>
                <p className="text-xs text-blue-100">כאן כדי לעזור לך</p>
              </div>
            </div>

            {/* Messages Area - Responsive padding and scroll */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-white">
              {messages.length === 0 && (
                <div className="flex flex-col h-full">
                  {/* Welcome Message */}
                  <div className="flex flex-col items-center justify-start py-4 md:py-6 text-center px-2">
                    <MessageCircle className="h-10 md:h-12 w-10 md:w-12 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-700 font-medium">
                      !ברוך הבא ל-Crown Steel
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      אני כאן כדי לעזור לך למצוא תכשיטים מושלמים
                    </p>
                  </div>

                  {/* Quick Action Buttons - Responsive grid */}
                  <div className="mt-auto grid grid-cols-2 gap-2 px-2 pb-4">
                    {quickActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickAction(action.message)}
                        disabled={isLoading}
                        className="bg-gray-50 hover:bg-blue-50 active:bg-blue-100 disabled:bg-gray-100 border border-gray-200 rounded-lg p-2 md:p-3 text-right text-xs md:text-sm text-gray-700 font-medium transition-colors touch-manipulation disabled:text-gray-400"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-sm ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    } rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base break-words`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {/* Product Cards Display */}
              {messages.map((message) =>
                message.products && message.products.length > 0 ? (
                  <div
                    key={`products-${message.id}`}
                    className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3"
                  >
                    {message.products.map((product) => (
                      <a
                        key={product.id}
                        href={`/shop/${product.slug}`}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg active:shadow-md transition-shadow cursor-pointer touch-manipulation"
                      >
                        <div className="relative h-28 md:h-32 w-full bg-gray-100 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 active:scale-100 transition-transform"
                          />
                        </div>
                        <div className="p-2 md:p-3">
                          <h3 className="text-xs md:text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-xs text-blue-600 font-semibold mb-1">
                            ₪{product.price.toLocaleString('he-IL')}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <span>⭐ {product.rating.toFixed(1)}</span>
                            <span>({product.reviews})</span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : null
              )}

              {/* Category Cards Display */}
              {messages.map((message) =>
                message.categories && message.categories.length > 0 ? (
                  <div
                    key={`categories-${message.id}`}
                    className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3"
                  >
                    {message.categories.map((category) => (
                      <a
                        key={category.id}
                        href={`/shop?category=${category.slug}`}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg active:shadow-md transition-shadow cursor-pointer touch-manipulation"
                      >
                        {category.image ? (
                          <div className="relative h-28 md:h-32 w-full bg-gray-100 overflow-hidden">
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover hover:scale-105 active:scale-100 transition-transform"
                            />
                          </div>
                        ) : (
                          <div className="h-28 md:h-32 w-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                            <span className="text-2xl md:text-3xl opacity-50">
                              📦
                            </span>
                          </div>
                        )}
                        <div className="p-2 md:p-3">
                          <h3 className="text-xs md:text-sm font-semibold text-gray-800 mb-1">
                            {category.name}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {category.productCount}{' '}
                            {category.productCount === 1 ? 'מוצר' : 'מוצרים'}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : null
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 rounded-lg px-3 md:px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-100 text-red-700 rounded-lg px-3 md:px-4 py-2 text-xs md:text-sm border border-red-300">
                  {error}
                </div>
              )}

              <div ref={scrollRef} />
            </div>

            {/* Input Area - Responsive and mobile-friendly */}
            <div className="border-t border-gray-200 p-3 md:p-3 bg-white rounded-none md:rounded-b-2xl flex-shrink-0">
              <form
                ref={formRef}
                onSubmit={handleSendMessage}
                className="flex gap-2 items-end flex-row-reverse"
              >
                <div className="flex-1 flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent bg-white">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="הקלד את ההודעה שלך..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 px-3 md:px-4 py-2 outline-none text-gray-800 text-sm md:text-base placeholder-gray-500 disabled:bg-gray-100 disabled:text-gray-500 bg-transparent text-right"
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center flex-shrink-0 h-10 w-10 touch-manipulation"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
