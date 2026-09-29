const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = "gemini-2.5-flash";

// Plain-text generation
async function generateText(prompt) {
  const res = await ai.models.generateContent({ model: MODEL, contents: prompt });
  return res.text;
}

// JSON generation: asks Gemini for JSON and parses it safely
async function generateJSON(prompt) {
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });
  const clean = res.text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    const err = new Error("AI returned an invalid response. Please try again.");
    err.status = 502;
    throw err;
  }
}

module.exports = { generateText, generateJSON };
