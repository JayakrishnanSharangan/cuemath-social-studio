# 🚀 The Social Media Studio

A purpose-built internal tool for Cuemath marketers to instantly transform rough ideas into high-converting, 4-slide Instagram carousels.

## 🛠 What I Built
This is a Minimum Viable Product (MVP) of "The Social Media Studio." It utilizes a React/Next.js frontend and a serverless backend to communicate with the Google Gemini API. 

## ⚖️ Smart Trade-offs
The biggest decision in this build was **intentionally skipping AI image generation**. 
Why? Because for Cuemath's brand, narrative control is the highest priority. Generating unpredictable images often distracts from the core message. I traded the "flashiness" of AI image generation for a rock-solid, highly editable text-to-storytelling pipeline in an ergonomic vertical feed.

## 🧠 Process Thinking & Challenges
During testing, I initially wired the backend to use the `gemini-1.5-flash` model but hit a `503 Service Unavailable` API rate limit. This forced me to build a graceful failure state (a custom UI banner explaining the server traffic) and taught me how to hot-swap to different models to maintain uptime. 

## 🚀 Future Improvements (With More Time)
1. **Database Integration:** Allow marketers to save their generated carousels.
2. **Direct Image Export:** Implement `html2canvas` so the editable HTML slides can be directly downloaded as `.png` files.
