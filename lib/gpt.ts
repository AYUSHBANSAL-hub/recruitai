export async function analyzeResumeWithGPT(resumeText: string, jobDescription: string) {
  try {
    console.log("🔄 Sending resume to GPT-3 for analysis...");

    // const prompt = `
    // Compare this resume with the job description provided. Analyze the match and return:
    // 1. A match score from 0 to 100.
    // 2. Key strengths of the candidate.
    // 3. Weaknesses or missing skills.
    // 4. A brief reasoning for the score.

    // Job Description:
    // ${jobDescription}

    // Resume:
    // ${resumeText}
    // `;

    const payload = JSON.stringify([
      { role: "system", content: "You are an advanced AI-powered hiring assistant specializing in resume screening. Your task is to evaluate a candidate’s resume against a given Job Description (JD) and provide a structured JSON response with:\n\n1. *Match Score (Out of 10): How well the resume aligns with the JD.\n2. **Strengths: Key strong points relevant to the role.\n3. **Weaknesses: Gaps in experience, skills, or qualifications.\n4. **What to Improve?: Specific, actionable improvements to enhance the resume’s match with the JD.\n\n---\n\nEvaluation Criteria:\n- **Technical Skills & Requirements:* Does the resume clearly list required technologies, programming languages, and tools mentioned in the JD?\n- *Work Experience & Project Alignment:* Are past roles and projects relevant? Are contributions quantifiable?\n- *Soft Skills & Culture Fit:* Is teamwork, leadership, or problem-solving demonstrated?\n- *Resume Presentation & Completeness:* Is the resume structured well, avoiding unnecessary details while highlighting key strengths?\n\n---\n\n*Response Format (JSON):\n⁠  json\n{\n  \"match_score\": X,  // Score out of 10\n  \"strengths\": [\"Strength 1\", \"Strength 2\", \"Strength 3\"],\n  \"weaknesses\": [\"Weakness 1\", \"Weakness 2\", \"Weakness 3\"],\n  \"improvements\": [\"Improvement 1\", \"Improvement 2\", \"Improvement 3\"]\n}\n  ⁠\n---\n\nProvide a precise evaluation ensuring **role-based relevance*." },
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

    // Parsing text-based response into structured format
    const responseText: string = jsonResponse.data;

    // Extracting Match Score
    const matchScoreMatch = responseText.match(/Match Score: (\d+)\/100/);
    const matchScore = matchScoreMatch ? parseInt(matchScoreMatch[1]) : 0;

    // Extracting Key Strengths
    const strengthsMatch = responseText.match(/Key Strengths:\n([\s\S]*?)\n\n/);
    const strengths = strengthsMatch ? strengthsMatch[1].split("\n").map(s => s.trim().replace(/^-/, "").trim()) : [];

    // Extracting Weaknesses
    const weaknessesMatch = responseText.match(/Weaknesses or Missing Skills:\n([\s\S]*?)\n\n/);
    const weaknesses = weaknessesMatch ? weaknessesMatch[1].split("\n").map(w => w.trim().replace(/^-/, "").trim()) : [];

    // Extracting Reasoning
    const reasoningMatch = responseText.match(/Brief Reasoning for the Score:\n([\s\S]*)/);
    const reasoning = reasoningMatch ? reasoningMatch[1].trim() : "No reasoning provided.";

    return {
      matchScore,
      strengths,
      weaknesses,
      reasoning,
    };
  } catch (error) {
    console.error("❌ GPT-3 API Error:", error);
    return { matchScore: 0, strengths: [], weaknesses: [], reasoning: "Analysis failed" };
  }
}
