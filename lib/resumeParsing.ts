// lib/fetchAndParseResume.ts
export async function fetchAndParseResume(resumeUrl: string): Promise<string> {
    try {
      const apiUrl = "https://b6mnwcf7fi.execute-api.ap-south-1.amazonaws.com/default/resume-text-extraction";
  
      // Extract filename from resume URL
      const fileKey = resumeUrl.split("/").pop();
  
      if (!fileKey) throw new Error("Invalid resume URL");
  
      const requestBody = {
        bucket_name: "ayushresumeai",
        file_key: fileKey,
      };
  
      console.log("📢 Sending request to Resume Parsing API:", apiUrl);
  
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`Resume Parsing API failed with status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("✅ Resume Parsed Successfully:", data.extracted_text.substring(0, 500));
  
      // Return extracted text
      return data.extracted_text;
    } catch (error) {
      console.error("❌ Error fetching resume text:", error);
      throw error;
    }
  }
  