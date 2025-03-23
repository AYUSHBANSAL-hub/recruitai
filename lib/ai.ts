import OpenAI from "openai";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
});

/**
 * Generate application form fields based on a Job Description using Gemini Flash 2.0
 */
export async function generateFieldsFromJD(jobDescription: string) {
  try {
    console.log("🧠 Generating Form Fields from JD using Gemini Flash 2.0...");

    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: `You are an AI form generator. Given a job description, extract the most relevant fields that a candidate should fill in a job application form.

Instructions:
- Keep fields practical and concise.
- Only return fields that are not already fixed (like name, email, phone, resume).
- Choose from these field types: text, textarea, select, file, email, phone.
- For select fields, always include options.
- Return a JSON array of field objects.

Field object format:
{
  "type": "text" | "textarea" | "select" | "file" | "email" | "phone",
  "label": "Field label",
  "required": true or false,
  "options": ["opt1", "opt2"] // only for select fields
}

Only respond with pure JSON. Do not include code blocks or explanations.`
        },
        {
          role: "user",
          content: `Here is the job description:\n\n${jobDescription}\n\nBased on this, generate a JSON array of recommended application form fields.`
        }
      ]
    });

    const rawContent = response.choices?.[0]?.message?.content || "[]";
    const cleaned = rawContent.replace(/```json|```/g, "").trim();
    const fields = JSON.parse(cleaned);

    console.log("✅ Fields generated:", fields);
    return fields;
  } catch (error) {
    console.error("❌ Error generating fields from JD:", error);
    return [];
  }
}
