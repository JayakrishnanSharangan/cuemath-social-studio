'use client';

import { useState } from 'react';

type Slide = {
  slideNumber: number;
  copy: string;
};

export default function Home() {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [error, setError] = useState('');
  
  // Edit mode tracking
  const [editingSlide, setEditingSlide] = useState<number | null>(null);
  const [editCopy, setEditCopy] = useState('');

  // Copy to Clipboard state
  const [copiedId, setCopiedId] = useState<number | null>(null);

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
    } catch (err: any) {
      // Graceful Error UI message
      setError('The AI servers are currently catching their breath. Please try again in a few seconds.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (slide: Slide) => {
    setEditingSlide(slide.slideNumber);
    setEditCopy(slide.copy);
  };

  const handleSaveEdit = () => {
    setSlides(slides.map(s => 
      s.slideNumber === editingSlide ? { ...s, copy: editCopy } : s
    ));
    setEditingSlide(null);
  };

  const handleCopy = (slide: Slide) => {
    navigator.clipboard.writeText(slide.copy);
    setCopiedId(slide.slideNumber);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans antialiased overflow-x-hidden relative">
      {/* Decorative blurred blobs for luxury feel */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto space-y-16 relative z-10 py-12">
        {/* Header */}
        <header className="text-center space-y-6">
          <div className="inline-block relative">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-600 pb-2 drop-shadow-sm">
              The Social Media Studio
            </h1>
          </div>
          <p className="text-xl text-gray-400 md:max-w-2xl mx-auto font-light leading-relaxed">
            Turn your raw, unstructured ideas into high-converting story carousels in seconds.
          </p>
        </header>

        {/* Input Area */}
        <section className="bg-gray-950/80 backdrop-blur-xl border border-gray-800 rounded-[2rem] p-1 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
          
          <div className="p-8 space-y-6">
            {error && (
              <div className="bg-red-950/40 border border-red-900/50 text-amber-200 px-6 py-4 rounded-2xl text-sm font-medium animate-[fadeIn_0.3s_ease-out] flex items-center gap-3 backdrop-blur-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-3">
              <label htmlFor="idea" className="block text-sm font-semibold tracking-wider uppercase text-amber-500">
                Your Rough Idea
              </label>
              <textarea
                id="idea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="E.g., I want to talk about how a simple morning walk changed my deep work focus..."
                className="w-full h-40 p-5 text-lg bg-black border border-gray-800 rounded-3xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all resize-none text-white placeholder:text-gray-600 shadow-inner"
              />
            </div>
            
            <div className="flex justify-end pt-2">
              <button
                onClick={generateCarousel}
                disabled={loading}
                className={`group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-bold rounded-2xl transition-all disabled:opacity-70 flex items-center gap-3 overflow-hidden transform hover:-translate-y-1 active:translate-y-0
                  ${loading ? 'shadow-[0_0_30px_rgba(245,158,11,0.4)] scale-[0.98]' : 'shadow-[0_0_40px_rgba(245,158,11,0.2)] hover:shadow-[0_0_60px_rgba(245,158,11,0.4)]'}
                  ${loading ? 'animate-pulse' : ''}
                `}
              >
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 -skew-x-12 -translate-x-full" />
                
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Processing Idea...
                  </>
                ) : (
                  <>
                    Generate Journey
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Output Area - Timeline View */}
        {slides.length > 0 && (
          <section className="space-y-12 relative pb-20 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center justify-between border-b border-gray-800 pb-6 mb-12">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                The Storyline
              </h2>
              <span className="text-sm font-medium text-amber-500 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 uppercase tracking-widest">
                Timeline Ready
              </span>
            </div>
            
            {/* The Magic Timeline Line */}
            <div className="absolute left-8 top-32 bottom-20 w-px bg-gradient-to-b from-amber-500/0 via-amber-500/40 to-amber-500/0 hidden md:block" />
            
            <div className="flex flex-col gap-12 md:pl-16">
              {slides.map((slide, i) => (
                <div 
                  key={slide.slideNumber}
                  style={{ animationDelay: `${i * 150}ms` }}
                  className="relative group flex flex-col items-start transition-all duration-500 animate-[slideUp_0.6s_ease-out_both]"
                >
                  {/* Magic Timeline Marker (Dot) */}
                  <div className="absolute -left-[41px] top-10 w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)] z-20 group-hover:scale-150 transition-transform duration-300 hidden md:block" />
                  
                  <div className="w-full bg-gray-950/50 backdrop-blur-md rounded-[2.5rem] border border-gray-800 p-8 md:p-10 transition-all duration-500 hover:bg-gray-900 hover:border-amber-500/30 hover:shadow-[0_0_50px_rgba(245,158,11,0.15)] relative overflow-hidden group/card transform hover:-translate-y-1">
                    
                    {/* Subtle Internal Detail */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/0 group-hover/card:via-amber-500/20 to-transparent transition-all duration-700" />
                    
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-amber-500 text-xs font-black tracking-[0.2em] uppercase bg-amber-500/5 border border-amber-500/20 px-3 py-1.5 rounded-lg">
                        Phase {slide.slideNumber}
                      </span>
                    </div>
                    
                    {editingSlide === slide.slideNumber ? (
                      <div className="w-full flex flex-col z-30">
                        <textarea
                          value={editCopy}
                          onChange={(e) => setEditCopy(e.target.value)}
                          className="w-full p-6 text-xl leading-relaxed bg-black border border-amber-500/40 rounded-2xl focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white min-h-[150px] resize-none overflow-hidden"
                          autoFocus
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                          }}
                        />
                        <div className="flex gap-4 mt-4">
                          <button 
                            onClick={handleSaveEdit}
                            className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black text-sm font-black tracking-widest rounded-xl transition-all shadow-[0_5px_15px_rgba(245,158,11,0.3)]"
                          >
                            SAVE
                          </button>
                          <button 
                            onClick={() => setEditingSlide(null)}
                            className="px-8 py-3 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-400 text-sm font-black tracking-widest rounded-xl transition-all"
                          >
                            CANCEL
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-full">
                          <p className="text-white font-medium text-xl md:text-2xl leading-[1.8] tracking-tight">
                            {slide.copy}
                          </p>
                        </div>
                        
                        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-800/50 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                          <button
                            onClick={() => handleCopy(slide)}
                            className={`flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase px-5 py-2.5 rounded-xl transition-all duration-300 border ${
                              copiedId === slide.slideNumber 
                                ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {copiedId === slide.slideNumber ? 'Copied! ✓' : 'Copy Text'}
                          </button>

                          <button
                            onClick={() => handleEditClick(slide)}
                            className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-amber-500 bg-amber-500/5 hover:bg-amber-500 hover:text-black border border-amber-500/10 hover:border-transparent px-5 py-2.5 rounded-xl transition-all duration-300"
                          >
                            Edit Phase
                          </button>
                        </div>
                      </>
                    )}
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
