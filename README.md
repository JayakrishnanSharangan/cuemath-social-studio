# 🚀 Social Media Studio

**Status: ✅ MVP REACHED**

A high-performance AI studio that transforms abstract ideas into ready-to-post Instagram carousels with visual concepts and high-fidelity exports.

## ✨ MVP Features
- **AI-Driven Visual Concepts**: Beyond just text, the studio generates visual prompts and conceptual sample images for every slide using the Pollinations.ai API.
- **High-Resolution Export**: Convert your story directly into social-ready `.png` files with one click.
- **Dynamic Storyboarding**: A structured 4-phase journey (Hook, Build, Climax, CTA) optimized for social media engagement.
- **Premium Dark-Mode UI**: A focused, ergonomic environment designed for high-end content creation.
- **Real-time Editing**: Refine AI-generated copy on the fly before exporting.

## 🧰 Tech Stack
- **Framework**: Next.js 15+, React 19
- **AI Engine**: Google Gemini (Direct API integration)
- **Image Intelligence**: Pollinations.ai
- **Export Engine**: `html-to-image`
- **Styling**: Tailwind CSS 4.0

## 🚀 Setup & Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env.local`:
   ```env
   GEMINI_API_KEY=your_key_here
   ```
4. Launch the studio:
   ```bash
   npm run dev
   ```

## 🛤 Future Roadmap
- **Custom Brand Kits**: Save and apply your own fonts and color palettes.
- **Video Backgrounds**: Integrate motion-based concepts for more dynamic carousels.
- **Direct Instagram API Posting**: Schedule posts directly from the studio.
