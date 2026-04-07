import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Trash2, FileText, Clock, Type, Hash, Wand2, Check, ArrowRight, TextQuote } from 'lucide-react';

export default function WordCounter() {
  const [isMounted, setIsMounted] = useState(false);
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Instant calculations
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const charCount = text.length;
  const charNoSpacesCount = text.replace(/\s/g, '').length;
  // Average reading speed is ~225 words per minute
  const readingTime = Math.ceil(wordCount / 225); 

  const handleCopy = async () => {
    if (!isMounted || typeof navigator === 'undefined' || !text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClear = () => setText('');

  const handleFixSpacing = () => {
    // Replaces multiple spaces with a single space, and trims edges
    setText(text.replace(/\s+/g, ' ').trim());
  };

  if (!isMounted) return null;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-10">
      
      {/* Main SaaS Dashboard Panel */}
      <div className="glass-card rounded-[2.5rem] p-8 md:p-12 saas-shadow relative overflow-hidden flex flex-col gap-10 bg-white">
        
        {/* Holographic Background Watermark */}
        <div className="absolute -bottom-20 -right-20 text-secondary opacity-[0.03] pointer-events-none z-0">
          <TextQuote size={400} strokeWidth={0.5} />
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-primary/5 border border-primary/10 rounded-[1.25rem] flex items-center justify-center saas-shadow relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-saas opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <FileText className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Word & Text Analyzer</h2>
              <p className="text-base text-foreground/50 font-medium">Real-time character metrics and reading estimations.</p>
            </div>
          </div>
        </div>

        {/* Telemetry Dashboard (Stats Grid) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
          {/* Words */}
          <div className="bg-background/80 rounded-[1.5rem] p-6 border border-border/50 flex flex-col items-center justify-center gap-2 hover:border-primary/30 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full group-hover:bg-primary/10 transition-colors"></div>
            <Type className="w-5 h-5 text-primary/50 group-hover:text-primary transition-colors" />
            <span className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">{wordCount}</span>
            <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest mt-1">Words</span>
          </div>
          
          {/* Characters */}
          <div className="bg-background/80 rounded-[1.5rem] p-6 border border-border/50 flex flex-col items-center justify-center gap-2 hover:border-secondary/30 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-secondary/5 blur-2xl rounded-full group-hover:bg-secondary/10 transition-colors"></div>
            <Hash className="w-5 h-5 text-secondary/50 group-hover:text-secondary transition-colors" />
            <span className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">{charCount}</span>
            <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest mt-1">Characters</span>
          </div>
          
          {/* No Spaces */}
          <div className="bg-background/80 rounded-[1.5rem] p-6 border border-border/50 flex flex-col items-center justify-center gap-2 hover:border-accent/30 transition-colors group relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent/5 blur-2xl rounded-full group-hover:bg-accent/10 transition-colors"></div>
            <Hash className="w-5 h-5 text-accent/50 group-hover:text-accent transition-colors" />
            <span className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">{charNoSpacesCount}</span>
            <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest mt-1 text-center">Without Spaces</span>
          </div>
          
          {/* Reading Time */}
          <div className="bg-background/80 rounded-[1.5rem] p-6 border border-border/50 flex flex-col items-center justify-center gap-2 hover:border-primary/30 transition-colors group relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full group-hover:bg-primary/10 transition-colors"></div>
            <Clock className="w-5 h-5 text-primary/50 group-hover:text-primary transition-colors" />
            <div className="flex items-baseline gap-1">
              <span className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">{readingTime}</span>
              <span className="text-lg font-bold text-foreground/40">m</span>
            </div>
            <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest mt-1 text-center">Read Time</span>
          </div>
        </div>

        {/* Workspace Input */}
        <div className="flex flex-col gap-4 relative z-10">
          <div className="relative group">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or start typing your text here..."
              className="w-full min-h-[300px] p-8 bg-background/50 border-2 border-transparent rounded-[2rem] text-lg font-medium text-foreground focus:outline-none focus:border-primary/20 focus:bg-white saas-shadow-hover transition-all resize-y shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]"
            ></textarea>
          </div>

          {/* Action Bar (Dock Style) */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <button 
              onClick={handleClear}
              disabled={!text}
              className="flex items-center gap-2 px-6 py-4 bg-background/80 text-foreground/60 font-bold rounded-[1.25rem] hover:bg-destructive/10 hover:text-destructive disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-border/50 hover:border-transparent outline-none"
            >
              <Trash2 className="w-5 h-5" /> Clear
            </button>
            <button 
              onClick={handleFixSpacing}
              disabled={!text}
              className="flex items-center gap-2 px-6 py-4 bg-background/80 text-foreground/60 font-bold rounded-[1.25rem] hover:bg-secondary/10 hover:text-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-border/50 hover:border-transparent outline-none"
            >
              <Wand2 className="w-5 h-5" /> Fix Spacing
            </button>
            
            <div className="flex-grow"></div>
            
            <button 
              onClick={handleCopy}
              disabled={!text}
              className={`flex items-center gap-2 px-8 py-4 font-bold rounded-[1.25rem] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 outline-none saas-shadow relative overflow-hidden group ${
                copied ? 'bg-secondary text-white' : 'bg-gradient-saas text-white hover:saas-shadow-hover'
              }`}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10 flex items-center gap-2">
                {copied ? <><Check className="w-5 h-5" /> Copied!</> : <><Copy className="w-5 h-5" /> Copy Text</>}
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* Cross pollination hook */}
      <AnimatePresence>
        {copied && text.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="glass-card border border-primary/20 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:saas-shadow transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full"></div>
              
              <div className="relative z-10 text-center md:text-left">
                <h3 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Text Copied!</h3>
                <p className="text-foreground/60 font-medium">Need to standardise the casing (UPPERCASE, lowercase, Title Case)?</p>
              </div>
              <a href="#" className="relative z-10 w-full md:w-auto flex items-center justify-center gap-2 bg-white border border-primary/10 text-primary px-8 py-4 rounded-full font-bold hover:bg-primary hover:text-white transition-colors active:scale-95 saas-shadow">
                Case Converter <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}