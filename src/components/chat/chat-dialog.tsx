// src/components/chat/chat-dialog.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, MessageCircle, X, Sparkles, RotateCcw } from 'lucide-react';
import { ChatProductGrid, type ChatProduct } from './chat-product-card';
import { ChatCategoryGrid, type ChatCategory } from './chat-category-card';
import { TypingIndicator } from './typing-indicator';
import {
  parseAIResponse,
  saveChatMessages,
  loadChatMessages,
  clearChatMessages,
  generateMessageId,
  type ChatMessage,
} from '@/lib/chat-utils';
import { cn } from '@/lib/utils';

const QUICK_ACTIONS = [
  { label: 'קטגוריות', message: 'הראה לי את קטגוריות המוצרים שלכם', icon: '📦' },
  { label: 'מובילים', message: 'הראה לי את המוצרים המובילים שלכם', icon: '⭐' },
  { label: 'מידות', message: 'איך אני יודע את גודל הטבעת שלי?', icon: '📏' },
  { label: 'משלוח', message: 'מה מדיניות המשלוח שלכם?', icon: '🚚' },
];

// Compact quick suggestions shown after bot responses
const FOLLOW_UP_SUGGESTIONS = [
  { label: 'מוצרים מובילים', message: 'הראה לי מוצרים מובילים' },
  { label: 'קטגוריות', message: 'הראה לי קטגוריות' },
  { label: 'עזרה נוספת', message: 'אני צריך עזרה נוספת' },
];

export function ChatDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load persisted messages on mount
  useEffect(() => {
    setMounted(true);
    const saved = loadChatMessages();
    if (saved.length > 0) {
      setMessages(saved);
    }
  }, []);

  // Save messages when they change
  useEffect(() => {
    if (mounted && messages.length > 0) {
      saveChatMessages(messages);
    }
  }, [messages, mounted]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleClearChat = useCallback(() => {
    setMessages([]);
    clearChatMessages();
    setError(null);
  }, []);

  const handleSendMessage = useCallback(
    async (messageText: string) => {
      const text = messageText.trim();
      if (!text || isLoading) return;

      // Add user message
      const userMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'user',
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setError(null);
      setIsLoading(true);

      try {
        const response = await fetch('/api/agent/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((msg) => ({
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
        const { text: responseText, products, categories } = parseAIResponse(
          data.message
        );

        const assistantMessage: ChatMessage = {
          id: generateMessageId(),
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
    },
    [messages, isLoading]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const handleQuickAction = (message: string) => {
    handleSendMessage(message);
  };

  // Don't render until mounted (prevents hydration issues)
  if (!mounted) return null;

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'h-14 w-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center',
            'bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
            'text-white active:scale-95 hover:shadow-xl hover:shadow-amber-500/25',
            isOpen && 'scale-0 opacity-0'
          )}
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>

      {/* Chat Window */}
      <div
        className={cn(
          'fixed z-50 transition-all duration-300 ease-out',
          // Mobile: full screen
          'inset-0 md:inset-auto',
          // Desktop: positioned bottom-right
          'md:bottom-6 md:right-6 md:w-[380px] md:h-[600px] md:max-h-[80vh]',
          // Visibility
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none md:translate-y-8'
        )}
      >
        {/* Backdrop (mobile only) */}
        <div
          className={cn(
            'absolute inset-0 bg-black/40 backdrop-blur-sm md:hidden transition-opacity',
            isOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setIsOpen(false)}
        />

        {/* Chat Container */}
        <div
          className={cn(
            'relative h-full md:rounded-2xl overflow-hidden',
            'bg-white shadow-2xl md:shadow-xl flex flex-col',
            'md:border md:border-gray-200'
          )}
          dir="rtl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-4 flex items-center gap-3 flex-shrink-0">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base">Crown Steel</h3>
              <p className="text-xs text-amber-300/80">העוזר האישי שלך</p>
            </div>

            {/* Clear chat button */}
            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Clear chat"
                title="נקה שיחה"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {/* Welcome State */}
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col h-full">
                {/* Welcome Message */}
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-amber-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">
                    !שלום
                  </h4>
                  <p className="text-sm text-gray-500">
                    אני כאן לעזור לך למצוא את התכשיט המושלם
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="mt-auto space-y-2">
                  <p className="text-xs text-gray-400 text-center mb-3">
                    התחל עם אחת מהאפשרויות:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_ACTIONS.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickAction(action.message)}
                        disabled={isLoading}
                        className={cn(
                          'flex items-center gap-2 p-3 rounded-xl text-right',
                          'bg-white border border-gray-200 shadow-sm',
                          'hover:border-amber-300 hover:shadow-md hover:bg-amber-50/50',
                          'transition-all duration-200',
                          'disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                      >
                        <span className="text-lg">{action.icon}</span>
                        <span className="text-sm font-medium text-gray-700">
                          {action.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message) => (
              <div key={message.id}>
                {/* Message Bubble */}
                <div
                  className={cn(
                    'flex',
                    message.role === 'user' ? 'justify-start' : 'justify-end'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-tl-sm'
                        : 'bg-gray-100 text-gray-800 rounded-tr-sm'
                    )}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>

                {/* Products Grid */}
                {message.products && message.products.length > 0 && (
                  <ChatProductGrid products={message.products} />
                )}

                {/* Categories Grid */}
                {message.categories && message.categories.length > 0 && (
                  <ChatCategoryGrid categories={message.categories} />
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-end">
                <TypingIndicator />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Follow-up Suggestions - Show after bot responses */}
            {messages.length > 0 && !isLoading && (
              <div className="pt-2">
                <p className="text-xs text-gray-400 mb-2">המשך שיחה:</p>
                <div className="flex flex-wrap gap-2">
                  {FOLLOW_UP_SUGGESTIONS.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAction(suggestion.message)}
                      disabled={isLoading}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium',
                        'bg-white border border-gray-200 text-gray-700',
                        'hover:border-amber-300 hover:bg-amber-50 hover:text-gray-900',
                        'transition-all duration-200',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={scrollRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-100 p-3 bg-white flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
              {/* Input */}
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="הקלד הודעה..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className={cn(
                    'w-full px-4 py-2.5 rounded-full text-sm text-right text-gray-800',
                    'bg-gray-100 border-0 outline-none',
                    'focus:ring-2 focus:ring-amber-400/50 focus:bg-white',
                    'placeholder:text-gray-400',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-all duration-200'
                  )}
                />
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0',
                  'bg-gradient-to-br from-amber-500 to-amber-600',
                  'hover:from-amber-600 hover:to-amber-700',
                  'text-white shadow-md',
                  'disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none',
                  'transition-all duration-200 active:scale-95'
                )}
                aria-label="Send message"
              >
                <Send className="h-4 w-4 rotate-180" />
              </button>
            </form>

            {/* Powered by text */}
            <p className="text-[10px] text-gray-400 text-center mt-2">
              Powered by Crown Steel AI
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
