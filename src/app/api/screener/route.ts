import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { jobDescription, resumeText } = await req.json();

    if (!jobDescription || !resumeText) {
      return NextResponse.json({ error: 'Missing Job Description or Resume Text' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API key not found.' }, { status: 500 });
    }

    const prompt = `
You are a Senior Technical Recruiter and Human Resources Business Partner (HRBP).

Evaluate the following candidate's resume against the target Job Description (JD).

Return your evaluation structured strictly under the following sections. Use Markdown formatting.

## Candidate Profile Snapshot
(Brief overview of total experience, primary domain, and core competencies)

## Match Score
(Overall fit percentage: X/100, with a one-sentence justification)

## Key Strengths & Qualifications Match
(Bullet points detailing exact matches with required tools, frameworks, and responsibilities)

## Identified Skill Gaps & Concerns
(Missing skills, short tenures, or areas requiring further validation)

## Recommended Technical & Behavioral Interview Questions
(5 tailored questions to probe identified gaps and verify core competencies)

## Hiring Recommendation
(Choose one: Strong Hire / Hire / Potential Match with Upskilling / Do Not Proceed, followed by rationale)

## Onboarding & Training Focus
(Key areas to accelerate the candidate's ramp-up if hired)

---
Job Description:
${jobDescription}

---
Candidate Resume:
${resumeText}
`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          {
            role: "system",
            content: "You are an unbiased, objective, and expert HR recruitment analytics system.",
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Fallback
      if (data.error && data.error.message.includes("model")) {
        const fallbackResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192', 
            messages: [
              {
                role: "system",
                content: "You are an unbiased, objective, and expert HR recruitment analytics system.",
              },
              { role: 'user', content: prompt }
            ],
            temperature: 0.2
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
