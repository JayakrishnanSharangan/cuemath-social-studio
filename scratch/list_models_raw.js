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
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.models) {
      console.log("Available Models:");
      data.models.forEach(m => console.log(`- ${m.name}`));
    } else {
      console.log("No models found or error:", data);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

listModels();
