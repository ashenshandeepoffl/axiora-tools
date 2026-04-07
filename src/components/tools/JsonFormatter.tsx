import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Trash2, Code, Braces, Minimize2, Check, ArrowRight, AlertTriangle, FileJson } from 'lucide-react';

export default function JsonFormatter() {
  const [isMounted, setIsMounted] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFormat = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON format');
    }
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON format');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const handleCopy = async () => {
    if (!isMounted || typeof navigator === 'undefined' || !output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-10">
      
      {/* Main SaaS Workspace Panel */}
      <div className="glass-card rounded-[2.5rem] p-8 md:p-12 saas-shadow relative overflow-hidden flex flex-col gap-10 bg-white">
        
        {/* Holographic Background Watermark */}
        <div className="absolute -bottom-24 -right-24 text-primary opacity-[0.02] pointer-events-none z-0">
          <Code size={450} strokeWidth={0.5} />
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-primary/5 border border-primary/10 rounded-[1.25rem] flex items-center justify-center saas-shadow">
              <FileJson className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">JSON Formatter</h2>
              <p className="text-base text-foreground/50 font-medium">Validate, beautify, and minify payloads securely.</p>
            </div>
          </div>
        </div>

        {/* Workspace Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          
          {/* Input Area */}
          <div className="flex flex-col gap-4">
            <label className="text-sm font-bold text-foreground/40 uppercase tracking-widest flex items-center gap-2 px-2">
              <Code className="w-4 h-4" /> Raw Input
            </label>
            <div className="relative group h-[500px]">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError(null);
                }}
                placeholder='{"status": "waiting_for_payload"}'
                className="w-full h-full p-8 bg-background/50 border-2 border-transparent rounded-[2rem] text-sm font-mono text-foreground focus:outline-none focus:border-primary/30 focus:bg-white saas-shadow-hover transition-all resize-none shadow-inner"
                spellCheck="false"
              ></textarea>
            </div>
          </div>

          {/* Output Area */}
          <div className="flex flex-col gap-4">
            <label className="text-sm font-bold text-foreground/40 uppercase tracking-widest flex items-center gap-2 px-2">
              <Braces className="w-4 h-4" /> Formatted Output
            </label>
            <div className={`relative w-full h-[500px] p-8 rounded-[2rem] text-sm font-mono overflow-auto transition-all border-2 saas-shadow-hover shadow-inner ${
              error ? 'bg-destructive/5 border-destructive/30 text-destructive' : 'bg-background/50 border-transparent focus-within:border-secondary/30 focus-within:bg-white text-primary'
            }`}>
              <AnimatePresence mode="wait">
                {error ? (
                  <motion.div 
                    key="error"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center h-full gap-5 text-center relative z-10"
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-destructive/20 blur-3xl rounded-full pointer-events-none"></div>
                    <div className="w-16 h-16 bg-white rounded-[1.25rem] saas-shadow flex items-center justify-center text-destructive relative z-10">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div className="relative z-10">
                      <p className="font-bold text-xl tracking-tight mb-1">Parsing Error</p>
                      <p className="text-sm font-medium opacity-80 max-w-xs">{error}</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.pre 
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="whitespace-pre-wrap break-words"
                  >
                    {output || '// Awaiting valid JSON payload...'}
                  </motion.pre>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Floating Action Dock (Mac OS Style) */}
        <div className="relative z-20 flex justify-center mt-[-2rem] md:mt-[-3rem] pointer-events-none">
          <div className="flex items-center gap-2 p-2 bg-white/80 backdrop-blur-2xl border border-white rounded-full saas-shadow pointer-events-auto">
            
            <button 
              onClick={handleClear}
              disabled={!input}
              className="flex items-center gap-2 px-5 py-3 text-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-full font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed outline-none"
            >
              <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Clear</span>
            </button>
            
            <div className="w-[1px] h-8 bg-border mx-1"></div>

            <button 
              onClick={handleMinify}
              disabled={!input}
              className="flex items-center gap-2 px-6 py-3 text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-full font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed outline-none"
            >
              <Minimize2 className="w-4 h-4" /> Minify
            </button>

            <button 
              onClick={handleFormat}
              disabled={!input}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-saas text-white rounded-full font-bold text-sm saas-shadow hover:saas-shadow-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 outline-none relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Braces className="w-4 h-4 relative z-10" /> <span className="relative z-10">Format</span>
            </button>

            <div className="w-[1px] h-8 bg-border mx-1"></div>

            <button 
              onClick={handleCopy}
              disabled={!output || !!error}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 outline-none ${
                copied ? 'bg-secondary/10 text-secondary' : 'text-foreground/70 hover:text-secondary hover:bg-secondary/5'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

          </div>
        </div>

      </div>

      {/* Cross pollination hook */}
      <AnimatePresence>
        {copied && !error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="glass-card border border-primary/20 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:saas-shadow transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full"></div>
              
              <div className="relative z-10 text-center md:text-left">
                <h3 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Payload Copied Successfully.</h3>
                <p className="text-foreground/60 font-medium">Need to convert this JSON array into a tabular format?</p>
              </div>
              <a href="#" className="relative z-10 w-full md:w-auto flex items-center justify-center gap-2 bg-white border border-primary/10 text-primary px-8 py-4 rounded-full font-bold hover:bg-primary hover:text-white transition-colors active:scale-95 saas-shadow">
                JSON to CSV Converter <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}