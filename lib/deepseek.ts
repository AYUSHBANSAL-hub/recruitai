// src/lib/deepseek.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1', // Adjust based on actual DeepSeek API endpoint
});

export async function analyzeResume(resumeText: string, jobDescription: string) {
  try {
    const prompt = `
    Compare this job description and resume. Provide:
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
      model: 'deepseek-chat', // Replace with actual DeepSeek model name
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    // Parse the response to extract structured data
    const analysis = response.choices[0].message.content;
    // Add your parsing logic here

    return {
      score: 85, // Replace with actual parsed score
      matching_qualifications: [], // Replace with parsed qualifications
      missing_qualifications: [], // Replace with parsed missing qualifications
      reasoning: analysis,
    };
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error;
  }
}

