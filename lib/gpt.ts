export async function analyzeResumeWithGPT(resumeText: string, jobDescription: string) {
  try {
    const payload = JSON.stringify([
      {
        "role": "system",
        "content": "You are an advanced AI-powered hiring assistant specializing in resume screening. Your task is to evaluate a candidate’s resume against a given Job Description (JD) and provide a structured JSON response with: 1. Match Score (Out of 10): How well the resume aligns with the JD. 2. Strengths: A list of key strong points relevant to the role. 3. Weaknesses: A list of gaps in experience, skills, or qualifications. 4. Reasoning: A concise explanation of why the match score was given. Evaluation Criteria: - Technical Skills & Requirements: Does the resume clearly list required technologies, programming languages, and tools mentioned in the JD? - Work Experience & Project Alignment: Are past roles and projects relevant? Are contributions quantifiable? - Soft Skills & Culture Fit: Is teamwork, leadership, or problem-solving demonstrated? - Resume Presentation & Completeness: Is the resume structured well, avoiding unnecessary details while highlighting key strengths? Response Format (JSON): {\"match_score\": X, \"strengths\": [\"Strength 1\", \"Strength 2\", \"Strength 3\"], \"weaknesses\": [\"Weakness 1\", \"Weakness 2\", \"Weakness 3\"], \"reasoning\": \"Brief explanation of the match score.\"} Example Input: Job Description: {jobDescription} Candidate's Resume: {resumeText} Provide a precise evaluation ensuring role-based relevance. Respond only in the structured JSON format provided above."
      },      
      {
        "role": "user",
        "content": "### Job Description:\n\n" + jobDescription +
          "\n\n### Candidate's Resume:\n\n" + resumeText +
          "\n\nEvaluate how well this candidate's resume matches the given JD and return the response in the structured JSON format specified."
      }

    ]);

    console.log("📤 Sending Payload to GPT-3...");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout

    let response;
    try {
      response = await fetch('https://acciojob-doubt-support-eobnd7jx2q-el.a.run.app/doubt-support/test-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    console.log("📥 Response Received from GPT-3:", response.status);

    if (!response.ok) {
      throw new Error(`GPT API failed with status ${response.status}`);
    }

    const jsonResponse = await response.json();
    console.log("✅ GPT-3 Analysis Response:", JSON.stringify(jsonResponse, null, 2));

    if (!jsonResponse.data) {
      throw new Error("Invalid AI response format");
    }
    const parsedData = JSON.parse(jsonResponse.data);

    return {
      matchScore: parsedData.match_score || 0,
      strengths: parsedData.strengths || [],
      weaknesses: parsedData.weaknesses || [],
      reasoning: parsedData.reasoning || []
    };
  } catch (error) {
    console.error("❌ GPT-3 API Error:", error);
    return { matchScore: 0, strengths: [], weaknesses: [], reasoning: "Analysis failed" };
  }
}
