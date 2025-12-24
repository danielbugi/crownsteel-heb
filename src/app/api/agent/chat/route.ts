// src/app/api/agent/chat/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
// Chat API - Correct OpenAI tool handling with proper tool role
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
// import types are noisy across OpenAI SDK versions; we'll use `any` for tool call shapes
import { AGENT_TOOLS, ToolName } from '@/lib/agent/tools';
import { executeTool } from '@/lib/agent/tool-handlers';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `אתה סוכן שירות לקוחות עוזר עבור Crown Steel, חנות תכשיטים גברים פרימיום.

אחריותך העיקרית:
כאשר משתמש שואל על מוצרים, קטגוריות, או סגנונות - תמיד השתמש בכלים לחיפוש בטרם עונה!

כלים זמינים:
- browse_products_by_category() → קטגוריות מוצרים (טבעות, צמידים, שרשרות, תיקיות)
- get_featured_products() → מוצרים מובילים/בחירות מומלצות
- search_products_by_style() → חיפוש לפי סגנון (מינימליסטי, קלאסי, הצהרה, וינטג')
- search_products_by_price() → חיפוש לפי טווח מחירים

מתי להשתמש בכלים:
✓ "הראה לי קטגוריות" → השתמש ב- browse_products_by_category()
✓ "אני רוצה טבעות" → השתמש ב- browse_products_by_category("rings")
✓ "מוצרים מובילים" → השתמש ב- get_featured_products()
✓ "אני אוהב סגנון מינימליסטי" → השתמש ב- search_products_by_style("minimalist")
✓ "יש לי תקציב של 500 שקל" → השתמש ב- search_products_by_price(0, 500)
✓ כל שאלה על מוצרים, קטגוריות או סגנונות → השתמש בכלים

מה לא לעשות:
✗ אל תכתוב מחדש פרטי מוצר בטקסט
✗ אל תתן טבלה או רשימה של קטגוריות בטקסט
✗ אל תהיות "לא יודע" - תמיד תחפש בכלים

פורמט התגובה:
כאשר מקבל תוצאות מהכלים:
1. כתוב הודעה קצרה בעברית (מה שמצא)
2. הוסף שורה חדשה
3. הוסף את ה-JSON בפורמט זה:
   PRODUCTS_JSON: [...]  (למוצרים)
   או
   CATEGORIES_JSON: [...] (לקטגוריות)

הנחיות נוספות:
- היה ידידותי ומקצועי
- תמיד בעברית בלבד
- תן עדיפות לעזרה בחיפוש מוצרים
- אם אתה לא יודע משהו שאינו קשור לחיפוש מוצרים, הנח כרטיס תמיכה

זכור: הכלים שלך הם החוזק שלך. תמיד השתמש בהם!`;

type MessageParam = {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content?: string;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string;
    };
  }>;
  tool_call_id?: string;
};

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Build messages array for OpenAI
    const openaiMessages: MessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    // Add user messages from chat history
    for (const msg of messages) {
      openaiMessages.push({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      });
    }

    // Initial API call (cast to any to be resilient across OpenAI SDK versions)
    let response: any = await (openai as any).chat.completions.create({
      model: 'gpt-4o-mini',
      messages: openaiMessages,
      tools: AGENT_TOOLS as any,
      temperature: 0.7,
    });

    let lastToolResults: Array<{
      tool_call_id: string;
      result: any;
    }> = [];

    // Handle tool calls in a loop
    while (response?.choices?.[0]?.finish_reason === 'tool_calls') {
      const toolCalls: any[] =
        response?.choices?.[0]?.message?.tool_calls || [];

      if (toolCalls.length === 0) break;

      // Add assistant message with tool_calls to messages
      openaiMessages.push({
        role: 'assistant',
        content: response.choices[0].message.content || '',
        tool_calls: toolCalls.map((tc) => ({
          id: tc.id,
          type: tc.type as 'function',
          function: {
            name: tc.function.name,
            arguments: tc.function.arguments,
          },
        })),
      });

      // Execute all tools
      const toolResults = await Promise.all(
        toolCalls.map(async (toolCall: any) => {
          // toolCall shape may vary; use `any` and defensive parsing
          const call: any = toolCall;
          const toolName = call?.function?.name as ToolName;
          let toolInput: any = {};
          try {
            toolInput = call?.function?.arguments
              ? JSON.parse(call.function.arguments)
              : {};
          } catch {
            toolInput = {};
          }

          const result = await executeTool(toolName, toolInput);
          return {
            tool_call_id: call?.id ?? String(Math.random()),
            result: result,
          };
        })
      );

      lastToolResults = toolResults;

      // Add tool result messages (using 'tool' role)
      for (const toolResult of toolResults) {
        openaiMessages.push({
          role: 'tool',
          tool_call_id: toolResult.tool_call_id,
          content: JSON.stringify(toolResult.result),
        });
      }

      // Make the next API call with updated messages
      response = await (openai as any).chat.completions.create({
        model: 'gpt-4o-mini',
        messages: openaiMessages as any,
        tools: AGENT_TOOLS as any,
        temperature: 0.7,
      });
    }

    // Extract final response text
    let assistantMessage =
      response.choices[0].message.content || 'מצטער, לא הצלחתי לעבד את בקשתך.';

    // Check if any tool results contained products or categories JSON
    for (const toolResult of lastToolResults) {
      const result = toolResult.result;

      if (result.productsJson && result.message) {
        // Append products JSON to the assistant message
        assistantMessage = `${result.message}\n\nPRODUCTS_JSON:\n${result.productsJson}`;
        break;
      }

      if (result.categoriesJson && result.message) {
        // Append categories JSON to the assistant message
        assistantMessage = `${result.message}\n\nCATEGORIES_JSON:\n${result.categoriesJson}`;
        break;
      }
    }

    return NextResponse.json({
      success: true,
      message: assistantMessage,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
