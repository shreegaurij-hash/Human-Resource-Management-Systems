import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not defined in environment variables");
    }

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
    console.error("CHAT API ERROR:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
