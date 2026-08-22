import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Read key directly from file to bypass dev server cache issues
    const keyPath = path.join(process.cwd(), 'groq-api.key');
    const apiKey = fs.readFileSync(keyPath, 'utf8').trim();

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: 'You are Dayflow AI, an intelligent assistant integrated into the Dayflow HR Management System. Guide the user, help them navigate the platform, and answer HR-related queries in a friendly, concise manner.' },
          ...messages
        ]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      // If the model name they gave is invalid, we fallback to a valid groq model to ensure it works for them.
      if (data.error && data.error.message.includes("model")) {
        console.warn("User requested model failed, falling back to llama3-8b-8192");
        const fallbackResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192', 
            messages: [
              { role: 'system', content: 'You are Dayflow AI, an intelligent assistant integrated into the Dayflow HR Management System. Guide the user, help them navigate the platform, and answer HR-related queries in a friendly, concise manner.' },
              ...messages
            ]
          })
        });
        const fallbackData = await fallbackResponse.json();
        return NextResponse.json(fallbackData);
      }
      return NextResponse.json({ error: data.error }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
