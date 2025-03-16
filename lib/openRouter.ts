import OpenAI from "openai";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY
});

/**
 * Analyze a resume using OpenRouter API (Gemini Flash 2.0)
 */
export async function analyzeResumeWithGemini(resumeText: string, jobDescription: string) {
  try {
    console.log("📤 Sending Payload to Gemini Flash 2.0...");

    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: `You are an advanced AI-powered hiring assistant specializing in resume screening. Your task is to evaluate a candidate’s resume against a given Job Description (JD) and provide a structured JSON response with:

1. Match Score (Out of 100): How well the resume aligns with the JD.
2. Strengths: A list of key strong points relevant to the role.
3. Weaknesses: A list of gaps in experience, skills, or qualifications.
4. Reasoning: A concise explanation of why the match score was given.

Evaluation Criteria:
- Technical Skills & Requirements: Does the resume clearly list required technologies, programming languages, and tools mentioned in the JD?
- Work Experience & Project Alignment: Are past roles and projects relevant? Are contributions quantifiable?
- Soft Skills & Culture Fit: Is teamwork, leadership, or problem-solving demonstrated?
- Resume Presentation & Completeness: Is the resume structured well, avoiding unnecessary details while highlighting key strengths?

Response Format (JSON):
{
  "match_score": X,
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
  "reasoning": "Brief explanation of the match score."
}

Example Input:
Job Description: {jobDescription}
Candidate's Resume: {resumeText}

Provide a precise evaluation ensuring role-based relevance. Respond only in the structured JSON format provided above.`
        },
        {
          role: "user",
          content: `### Job Description:\n\n${jobDescription}\n\n### Candidate's Resume:\n\n${resumeText}\n\nEvaluate how well this candidate's resume matches the given JD and return the response in the structured JSON format specified.`
        }
      ]
    });

    console.log("📥 Response Received from Gemini Flash 2.0:", response);

    // Fix: Strip Markdown code block before parsing JSON
    const rawResponse = response.choices?.[0]?.message?.content || "{}";
    const cleanedResponse = rawResponse.replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(cleanedResponse);

    return {
      matchScore: parsedData.match_score || 0,
      strengths: parsedData.strengths || [],
      weaknesses: parsedData.weaknesses || [],
      reasoning: parsedData.reasoning || ""
    };
  } catch (error) {
    console.error("❌ Gemini Flash 2.0 API Error:", error);
    return { matchScore: 0, strengths: [], weaknesses: [], reasoning: "Analysis failed" };
  }
}
