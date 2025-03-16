// src/lib/openrouter.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1', // Adjust based on actual OpenRouter API endpoint
});

export async function analyzeResume(resumeText: string, jobDescription: string) {
  try {
    const prompt = `
    Compare the following job description and resume. Provide a structured analysis including:
    1. Match score (0-100)
    2. Key matching qualifications
    3. Missing qualifications
    4. Detailed reasoning
    
    Job Description:
    ${jobDescription}

    Resume:
    ${resumeText}
    `;

    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001', // OpenRouter model
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    // Extract structured data from the response
    const analysis = response.choices[0].message.content;
    // Implement parsing logic here

    return {
      matchScore: 85, // Replace with actual parsed score
      matching_qualifications: [], // Replace with parsed qualifications
      missing_qualifications: [], // Replace with parsed missing qualifications
      reasoning: analysis,
    };
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error;
  }
}
