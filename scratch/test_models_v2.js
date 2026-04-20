const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// Manually parse .env.local
const envFile = fs.readFileSync(".env.local", "utf8");
const env = {};
envFile.split("\n").forEach(line => {
  const [key, value] = line.split("=");
  if (key && value) env[key.trim()] = value.trim();
});

const API_KEY = env.GEMINI_API_KEY;

async function listModels() {
  const genAI = new GoogleGenerativeAI(API_KEY);
  try {
    console.log("Using API Key:", API_KEY.substring(0, 10) + "...");
    
    // In @google/generative-ai, listModels is not easily available on the main class 
    // but we can try common names.
    const testModels = [
      "gemini-1.5-flash", 
      "gemini-1.5-pro", 
      "gemini-pro", 
      "gemini-1.0-pro",
      "gemini-1.5-flash-latest",
      "gemini-2.0-flash-exp"
    ];

    for (const m of testModels) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent("hello");
        console.log(`SUCCESS: ${m}`);
        return;
      } catch (e) {
        console.log(`FAILED: ${m} - Status: ${e.status} - ${e.message}`);
      }
    }
  } catch (err) {
    console.error("List error:", err);
  }
}

listModels();
