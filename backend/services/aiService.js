const axios = require("axios");

function extractJson(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  }
}

async function analyzeTask({
  taskEmail = "",
  previousEmails = "",
  attachments = "",
}) {
  try {
    console.log("API KEY FOUND:", !!process.env.OPENROUTER_API_KEY);
    console.log("MODEL:", process.env.OPENROUTER_MODEL);

    const prompt = `
You are a senior project manager at TaskVirtual.

Analyze the client request.

Return ONLY valid JSON.

{
  "executiveSummary": "",
  "deliverables": [],
  "missingInformation": [],
  "risks": [],
  "actionPlan": [],
  "estimatedEffort": "",
  "clientReply": ""
}

CLIENT EMAIL:
${taskEmail}

PREVIOUS EMAILS:
${previousEmails}

ATTACHMENTS:
${attachments}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: process.env.OPENROUTER_MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 1500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "AI Task Execution Assistant",
        },
      }
    );

    const content =
      response.data.choices[0].message.content;

    return extractJson(content);
  } catch (error) {
    console.error(
      "OPENROUTER ERROR:",
      error?.response?.data || error.message
    );

    throw new Error(
      JSON.stringify(
        error?.response?.data || error.message
      )
    );
  }
}

module.exports = {
  analyzeTask,
};