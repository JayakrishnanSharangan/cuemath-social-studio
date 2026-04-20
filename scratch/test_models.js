const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // Note: listModels is not on the genAI instance directly in some versions, 
    // it's usually on the client. But genAI.getGenerativeModel({model: "..."}) is common.
    // In @google/generative-ai, listing models is often done via the API directly or not exposed the same way.
    // Let's try the direct fetch or check documentation.
    console.log("Checking models for key:", process.env.GEMINI_API_KEY ? "Present" : "Missing");
    
    // Actually, let's just try to hit gemini-1.5-flash and gemini-2.0-flash and gemini-pro
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp", "gemini-2.0-flash", "gemini-2.0-pro"];
    
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent("test");
        console.log(`Model ${m} version check:`, result.response.text().substring(0, 10));
        break; 
      } catch (e) {
        console.log(`Model ${m} failed with:`, e.status || e.message);
      }
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

listModels();
