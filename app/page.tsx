'use client';

import { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';

type Slide = {
  slideNumber: number;
  copy: string;
  imagePrompt: string;
};

export default function Home() {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [error, setError] = useState('');
  
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Edit mode tracking
  const [editingSlide, setEditingSlide] = useState<number | null>(null);
  const [editCopy, setEditCopy] = useState('');

  // Copy to Clipboard state
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState<number | null>(null);

  const generateCarousel = async () => {
    if (!idea.trim()) {
      setError('Please enter a rough idea first.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate carousel');
      }
      
      setSlides(data.slides);
      slideRefs.current = new Array(data.slides.length).fill(null);
    } catch (err: any) {
      setError('The AI servers are currently catching their breath. Please try again in a few seconds.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = () => {
    setSlides(slides.map(s => 
      s.slideNumber === editingSlide ? { ...s, copy: editCopy } : s
    ));
    setEditingSlide(null);
  };

  const downloadSlide = async (slideNumber: number) => {
    const node = slideRefs.current[slideNumber - 1];
    if (!node) return;

    setIsDownloading(slideNumber);
    try {
      const dataUrl = await htmlToImage.toPng(node, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#000',
      });
      
      const link = document.createElement('a');
      link.download = `slide-${slideNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setIsDownloading(null);
    }
  };

  const handleCopy = (slide: Slide) => {
    navigator.clipboard.writeText(slide.copy);
    setCopiedId(slide.slideNumber);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans antialiased overflow-x-hidden relative">
      {/* Decorative blurred blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto space-y-16 relative z-10 py-12">
        <header className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-600 pb-2 drop-shadow-sm">
            Social Media Studio
          </h1>
          <p className="text-xl text-gray-400 md:max-w-2xl mx-auto font-light leading-relaxed">
            Convert abstract ideas into high-converting story carousels with AI visuals.
          </p>
        </header>

        <section className="bg-gray-950/80 backdrop-blur-xl border border-gray-800 rounded-[2rem] p-1 shadow-2xl overflow-hidden relative">
          <div className="p-8 space-y-6">
            {error && (
              <div className="bg-red-950/40 border border-red-900/50 text-amber-200 px-6 py-4 rounded-2xl text-sm font-medium animate-pulse flex items-center gap-3">
                {error}
              </div>
            )}
            <div className="space-y-3">
              <label className="block text-sm font-semibold tracking-wider uppercase text-amber-500">Your Idea</label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="E.g., Why deep work is the ultimate competitive advantage..."
                className="w-full h-40 p-5 text-lg bg-black border border-gray-800 rounded-3xl focus:ring-2 focus:ring-amber-500/50 outline-none transition-all resize-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={generateCarousel}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-extrabold rounded-2xl hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-all disabled:opacity-50"
              >
                {loading ? 'Generating Story...' : 'Generate Journey'}
              </button>
            </div>
          </div>
        </section>

        {slides.length > 0 && (
          <section className="space-y-16">
            <div className="flex flex-col gap-20">
              {slides.map((slide, i) => (
                <div key={slide.slideNumber} className="flex flex-col md:flex-row gap-8 items-start">
                  
                  {/* The Slide Preview for Export */}
                  <div 
                    ref={el => slideRefs.current[slide.slideNumber-1] = el}
                    className="w-full md:w-[450px] aspect-square bg-gray-950 border border-gray-800 rounded-[3rem] p-10 flex flex-col justify-between relative overflow-hidden flex-shrink-0 shadow-2xl"
                  >
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                      <img 
                        src={`https://pollinations.ai/p/${encodeURIComponent(slide.imagePrompt)}?width=1024&height=1024&seed=${slide.slideNumber}`} 
                        alt="Background concept" 
                        className="w-full h-full object-cover grayscale brightness-50"
                      />
                    </div>
                    
                    <div className="relative z-10">
                      <span className="text-amber-500 text-[10px] font-black tracking-[0.4em] uppercase mb-8 block">Phase {slide.slideNumber}</span>
                      <p className="text-2xl md:text-3xl font-bold leading-tight text-white tracking-tight">
                        {slide.copy}
                      </p>
                    </div>

                    <div className="relative z-10 flex items-center justify-between mt-auto">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-600" />
                      <span className="text-[10px] font-mono text-gray-500 tracking-widest">STUDIO_GEN_V1</span>
                    </div>
                  </div>

                  {/* Controls and Prompt Idea */}
                  <div className="flex-1 space-y-6 pt-4">
                    <div className="space-y-2">
                       <h3 className="text-amber-500 text-xs font-bold uppercase tracking-widest">Visual Concept</h3>
                       <p className="text-sm text-gray-500 italic leading-relaxed">"{slide.imagePrompt}"</p>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={() => downloadSlide(slide.slideNumber)}
                        disabled={isDownloading === slide.slideNumber}
                        className="px-6 py-2.5 bg-white text-black text-[10px] font-black tracking-[0.2em] rounded-xl hover:bg-amber-400 transition-all uppercase"
                      >
                        {isDownloading === slide.slideNumber ? 'Exporting...' : 'Download Slide'}
                      </button>
                      <button 
                        onClick={() => handleCopy(slide)}
                        className="px-6 py-2.5 bg-gray-900 border border-gray-800 text-gray-400 text-[10px] font-black tracking-[0.2em] rounded-xl hover:text-white transition-all uppercase"
                      >
                         {copiedId === slide.slideNumber ? 'Copied!' : 'Copy Text'}
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
