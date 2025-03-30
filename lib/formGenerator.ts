import OpenAI from "openai";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
});

export interface FormField {
  id: string;
  type: "text" | "textarea" | "select" | "file" | "email" | "phone";
  label: string;
  required: boolean;
  options?: string[];
  isFixed?: boolean;
  isAIGenerated?: boolean;
}

/**
 * Generate application form fields based on a Job Description using Gemini Flash 2.0
 */
export async function generateFieldsFromJD(
  jobDescription: string,
  hiringDomain: string
) {
  try {
    console.log("🧠 Generating Form Fields from JD using Gemini Flash 2.0...");

    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: `You are an AI form generator. Given a job description and hiring domain, extract the most relevant fields that a candidate should fill in a job application form.

Instructions:
- Keep fields practical and concise.
- Only return fields that are not already fixed (like name, email, phone, resume).
- Choose from these field types: text, textarea, select, file, email, phone.
- For select fields, always include options.
- Return a JSON array of field objects.
- Generate fields specific to the hiring domain (${hiringDomain}).
- For tech positions, focus on technical skills, projects, and experience.
- For sales positions, focus on sales experience, achievements, and communication skills.
- For non-tech positions, focus on relevant experience, soft skills, and domain knowledge.
- Generate 3-5 fields maximum.

Field object format:
{
  "type": "text" | "textarea" | "select" | "file" | "email" | "phone",
  "label": "Field label",
  "required": true or false,
  "options": ["opt1", "opt2"] // only for select fields
}

Only respond with pure JSON. Do not include code blocks or explanations.`,
        },
        {
          role: "user",
          content: `Here is the job description:\n\n${jobDescription}\n\nHiring Domain: ${hiringDomain}\n\nBased on this, generate a JSON array of recommended application form fields.`,
        },
      ],
    });

    const rawContent = response.choices?.[0]?.message?.content || "[]";
    const cleaned = rawContent.replace(/```json|```/g, "").trim();

    // Parse the JSON and add unique IDs and isAIGenerated flag
    const parsedFields = JSON.parse(cleaned);
    const fieldsWithIds = parsedFields.map((field: any) => ({
      ...field,
      id: `ai-${Math.random().toString(36).substr(2, 9)}`,
      isAIGenerated: true,
    }));

    console.log("✅ Fields generated:", fieldsWithIds);
    return fieldsWithIds;
  } catch (error) {
    console.error("❌ Error generating fields from JD:", error);
    // Return fallback fields based on domain if AI fails
    return generateFallbackFields(hiringDomain);
  }
}

/**
 * Generate fallback fields if AI generation fails
 */
function generateFallbackFields(hiringDomain: string): FormField[] {
  const fallbackFields: FormField[] = [];

  if (hiringDomain === "tech") {
    fallbackFields.push(
      {
        id: `ai-${Math.random().toString(36).substr(2, 9)}`,
        type: "textarea",
        label: "Technical Skills",
        required: true,
        isAIGenerated: true,
      },
      {
        id: `ai-${Math.random().toString(36).substr(2, 9)}`,
        type: "textarea",
        label: "Relevant Projects",
        required: false,
        isAIGenerated: true,
      }
    );
  } else if (hiringDomain === "sales") {
    fallbackFields.push(
      {
        id: `ai-${Math.random().toString(36).substr(2, 9)}`,
        type: "textarea",
        label: "Sales Experience",
        required: true,
        isAIGenerated: true,
      },
      {
        id: `ai-${Math.random().toString(36).substr(2, 9)}`,
        type: "textarea",
        label: "Past Sales Achievements",
        required: false,
        isAIGenerated: true,
      }
    );
  } else {
    fallbackFields.push(
      {
        id: `ai-${Math.random().toString(36).substr(2, 9)}`,
        type: "textarea",
        label: "Relevant Experience",
        required: true,
        isAIGenerated: true,
      },
      {
        id: `ai-${Math.random().toString(36).substr(2, 9)}`,
        type: "select",
        label: "Years of Experience",
        required: true,
        options: ["0-1 years", "1-3 years", "3-5 years", "5+ years"],
        isAIGenerated: true,
      }
    );
  }

  return fallbackFields;
}

export async function generateJobDescription(rawJD: string) {
  const response = await openai.chat.completions.create({
    model: "google/gemini-2.0-flash-001",
    messages: [
      {
        role: "system",
        content: `You are an AI assistant that transforms raw or unstructured text into a well-formatted professional job description. Use the following standard format and return the output in HTML:

About the job  
Job Title: [Title]  
Employment Type: [Full Time / Part Time / Contract]  
Experience: [X+ Years]  
Location: [Location Info]  

About [Company Name]:  
[Company Introduction Paragraph]

Requirements  
[List of requirements in bullet points]

Role & Responsibilities  
[List of responsibilities in bullet points]

Ensure the tone is professional and the output is clean, readable, and structured as valid HTML using <div>, <h2>, <p>, and <ul>/<li> tags.`
      },
      {
        role: "user",
        content: `Here is the raw job description. Please convert it into the above format:\n\n${rawJD}`
      }
    ],
  });

  const jobDescriptionAI = response.choices?.[0]?.message?.content || rawJD;
  const cleanJobDescriptionAI = jobDescriptionAI.replace(/```html/g, '').replace(/```/g, '');
  return cleanJobDescriptionAI;
}

