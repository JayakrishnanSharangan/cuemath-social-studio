import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini client
// Assuming GEMINI_API_KEY is available in process.env
const globalGenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured in the environment.' },
        { status: 500 }
      );
    }

    const { idea } = await req.json();

    if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
      return NextResponse.json(
        { error: 'A valid rough idea is required.' },
        { status: 400 }
      );
    }

    const model = globalGenAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `
      You are an expert social media copywriter and growth marketer.
      Your task is to take a user's rough idea and transform it into a highly engaging, structured 4-slide social media carousel.
      
      User's Rough Idea:
      "${idea}"
      
      Instructions:
      1. Slide 1 must be a compelling "Hook" that grabs attention immediately.
      2. Slide 2 must be the "Build" that expands on the hook and provides context.
      3. Slide 3 must be the "Climax" or core value proposition delivering the main insight.
      4. Slide 4 must be the "Takeaway" or Call to Action (CTA).
      
      Output ONLY a valid JSON array of exactly 4 objects matching this format exactly:
      [
        { 
          "slideNumber": 1, 
          "copy": "<your strictly curated hook text here>",
          "imagePrompt": "<a descriptive visual prompt for an AI image generator representing the hook, e.g., 'A striking minimalist clock dripping like liquid, neon orange accents, dark background'>"
        },
        ...
      ]
      
      Requirements for imagePrompt:
      - Be descriptive and visual.
      - Focus on metaphors or abstract concepts related to the copy.
      - Maintain a consistent aesthetic (minimalist, high-end, modern).
      
      DO NOT wrap the response in markdown code blocks like \`\`\`json. DO NOT add any conversational text. Return plain JSON only.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Safety processing of JSON response
    let parsedJson;
    try {
      // Clean up common AI markdown wrappings just in case
      let cleanedText = text.trim();
      if (cleanedText.startsWith('\`\`\`json')) {
        cleanedText = cleanedText.substring(7);
      }
      if (cleanedText.startsWith('\`\`\`')) {
        cleanedText = cleanedText.substring(3);
      }
      if (cleanedText.endsWith('\`\`\`')) {
        cleanedText = cleanedText.substring(0, cleanedText.length - 3);
      }
      cleanedText = cleanedText.trim();
      
      parsedJson = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini output as JSON', text);
      return NextResponse.json(
        { error: 'The AI returned an invalid format. Please try again.' },
        { status: 500 }
      );
    }

    // Basic validation of standard array structure
    if (!Array.isArray(parsedJson) || parsedJson.length !== 4) {
      return NextResponse.json(
        { error: 'The AI did not return exactly 4 slides. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ slides: parsedJson });
  } catch (err: any) {
    console.error('Error handling generation:', {
      message: err.message,
      stack: err.stack,
      status: err.status,
      statusText: err.statusText
    });
    return NextResponse.json(
      { error: `Generation failed: ${err.message || 'An unexpected error occurred'}` },
      { status: err.status || 500 }
    );
  }
}
