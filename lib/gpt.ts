export async function analyzeResumeWithGPT(resumeText: string, jobDescription: string) {
    try {
      console.log("🔄 Sending resume to GPT-3 for analysis...");
  
      const prompt = `
      Compare this resume with the job description provided. Analyze the match and return:
      1. A match score from 0 to 100.
      2. Key strengths of the candidate.
      3. Weaknesses or missing skills.
      4. A brief reasoning for the score.
  
      Job Description:
      ${jobDescription}
  
      Resume:
      ${resumeText}
      `;
  
      const payload = JSON.stringify([
        { "role": "system", "content": "You are an expert AI analyzing resumes for job fit." },
        { "role": "user", "content": prompt }
      ]);
  
      console.log("📤 Sending Payload to GPT-3:", payload);
  
      const response = await fetch('https://acciojob-doubt-support-eobnd7jx2q-el.a.run.app/doubt-support/test-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
      });
  
      console.log("📥 Response Received from GPT-3:", response.status);
  
      if (!response.ok) {
        throw new Error(`GPT API failed with status ${response.status}`);
      }
  
      const jsonResponse = await response.json();
      console.log("✅ GPT-3 Analysis Response:", JSON.stringify(jsonResponse, null, 2));
  
      return {
        matchScore: jsonResponse.data?.matchScore || 0, // Default to 0 if missing
        strengths: jsonResponse.data?.strengths || [],
        weaknesses: jsonResponse.data?.weaknesses || [],
        reasoning: jsonResponse.data?.reasoning || "No reasoning provided",
      };
    } catch (error) {
      console.error("❌ GPT-3 API Error:", error);
      return { matchScore: 0, strengths: [], weaknesses: [], reasoning: "Analysis failed" };
    }
  }
  