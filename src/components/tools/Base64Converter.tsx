import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Trash2, ArrowRightLeft, Check, AlertTriangle, FileCode2, ShieldAlert, Binary } from 'lucide-react';

export default function Base64Converter() {
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Real-time conversion logic
  useEffect(() => {
    if (!input) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      if (mode === 'encode') {
        // Safe UTF-8 encoding
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
        setError(null);
      } else {
        // Safe UTF-8 decoding
        const decoded = decodeURIComponent(escape(atob(input)));
        setOutput(decoded);
        setError(null);
      }
    } catch (err) {
      setError(mode === 'decode' ? 'Invalid Base64 string format.' : 'Encoding error occurred.');
      setOutput('');
    }
  }, [input, mode]);

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

  const toggleMode = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    setInput(output); // Flip the output to the input for seamless workflow
  };

  if (!isMounted) return null;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-10 mt-6 md:mt-0">
      
      {/* Main SaaS Workspace Panel */}
      <div className="glass-card rounded-[2.5rem] p-6 sm:p-8 md:p-12 saas-shadow relative overflow-hidden flex flex-col gap-8 bg-white">
        
        {/* Holographic Background Watermark */}
        <div className="absolute -bottom-24 -right-24 text-primary opacity-[0.03] pointer-events-none z-0 hidden sm:block">
          <Binary size={450} strokeWidth={0.5} />
        </div>

        {/* Header & Mode Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 md:gap-5">
            <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 bg-primary/5 border border-primary/10 rounded-[1.25rem] flex items-center justify-center saas-shadow relative overflow-hidden group">
              <FileCode2 className="w-7 h-7 md:w-8 md:h-8 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Base64 Converter</h2>
              <p className="text-sm md:text-base text-foreground/50 font-medium">Instantly encode or decode data safely.</p>
            </div>
          </div>

          {/* Premium Segmented Mode Toggle */}
          <div className="inline-flex items-center p-1.5 bg-foreground/5 backdrop-blur-xl border border-black/[0.03] rounded-full self-start md:self-auto">
            <button
              onClick={() => toggleMode('encode')}
              className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all outline-none flex items-center gap-2 ${
                mode === 'encode' ? 'text-primary saas-shadow' : 'text-foreground/50 hover:text-foreground'
              }`}
            >
              {mode === 'encode' && (
                <motion.div layoutId="base64ModeToggle" className="absolute inset-0 bg-white rounded-full" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
              )}
              <span className="relative z-10">Encode</span>
            </button>
            <button
              onClick={() => toggleMode('decode')}
              className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all outline-none flex items-center gap-2 ${
                mode === 'decode' ? 'text-primary saas-shadow' : 'text-foreground/50 hover:text-foreground'
              }`}
            >
              {mode === 'decode' && (
                <motion.div layoutId="base64ModeToggle" className="absolute inset-0 bg-white rounded-full" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
              )}
              <span className="relative z-10">Decode</span>
            </button>
          </div>
        </div>

        {/* Workspace Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 relative z-10 mt-2">
          
          {/* Input Area */}
          <div className="flex flex-col gap-3">
            <label className="text-xs md:text-sm font-bold text-foreground/40 uppercase tracking-widest flex items-center justify-between px-2">
              <span>{mode === 'encode' ? 'Raw Text Input' : 'Base64 Input'}</span>
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px]">{input.length} chars</span>
            </label>
            <div className="relative group h-[300px] md:h-[400px]">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' ? "Enter plain text to encode..." : "Paste Base64 string to decode..."}
                className="w-full h-full p-6 md:p-8 bg-background/50 border-2 border-transparent rounded-[2rem] text-sm md:text-base font-mono text-foreground focus:outline-none focus:border-primary/30 focus:bg-white saas-shadow-hover transition-all resize-none shadow-inner"
                spellCheck="false"
              ></textarea>
            </div>
          </div>

          {/* Central Exchange Icon (Visible only on desktop between the textareas) */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-4 items-center justify-center z-20 pointer-events-none">
            <div className="w-12 h-12 bg-white rounded-full saas-shadow flex items-center justify-center border border-border/50 text-primary">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
          </div>

          {/* Output Area */}
          <div className="flex flex-col gap-3">
            <label className="text-xs md:text-sm font-bold text-foreground/40 uppercase tracking-widest flex items-center justify-between px-2">
              <span>{mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}</span>
              {output && !error && <span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded text-[10px]">{output.length} chars</span>}
            </label>
            <div className={`relative w-full h-[300px] md:h-[400px] p-6 md:p-8 rounded-[2rem] text-sm md:text-base font-mono overflow-auto transition-all border-2 saas-shadow-hover shadow-inner break-words ${
              error ? 'bg-destructive/5 border-destructive/30 text-destructive' : 'bg-background/50 border-transparent focus-within:border-secondary/30 focus-within:bg-white text-primary'
            }`}>
              <AnimatePresence mode="wait">
                {error ? (
                  <motion.div 
                    key="error"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center h-full gap-4 text-center relative z-10"
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-destructive/20 blur-3xl rounded-full pointer-events-none"></div>
                    <div className="w-14 h-14 bg-white rounded-[1.25rem] saas-shadow flex items-center justify-center text-destructive relative z-10">
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                    <div className="relative z-10">
                      <p className="font-bold text-lg tracking-tight mb-1">Decoding Error</p>
                      <p className="text-xs md:text-sm font-medium opacity-80 max-w-xs">{error}</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full"
                  >
                    {output || <span className="text-foreground/30">Awaiting input...</span>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Action Bar (Upgraded for perfect chunky SaaS dimensions) */}
        <div className="flex flex-col sm:flex-row items-stretch justify-between gap-4 mt-4 relative z-20">
          <button 
            onClick={handleClear}
            disabled={!input}
            className="flex items-center justify-center gap-2 px-8 md:px-10 py-4 text-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-[1.25rem] font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed outline-none bg-background/80 border border-border/50 w-full sm:w-auto saas-shadow-hover"
          >
            <Trash2 className="w-5 h-5" /> Clear Workspace
          </button>

          <button 
            onClick={handleCopy}
            disabled={!output || !!error}
            className={`flex items-center justify-center gap-2 px-8 md:px-12 py-4 rounded-[1.25rem] font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 outline-none saas-shadow relative overflow-hidden group w-full sm:w-auto ${
              copied ? 'bg-secondary text-white border border-secondary' : 'bg-primary text-white border border-primary hover:saas-shadow-hover'
            }`}
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative z-10 flex items-center gap-2">
              {copied ? <><Check className="w-5 h-5" /> Copied Successfully!</> : <><Copy className="w-5 h-5" /> Copy Output</>}
            </span>
          </button>
        </div>

      </div>

      {/* Educational Banner Hook */}
      <AnimatePresence>
        {input && !error && mode === 'encode' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="glass-card border border-orange-500/20 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group hover:saas-shadow transition-all bg-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-3xl rounded-full"></div>
              
              <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 text-orange-600">
                <ShieldAlert className="w-6 h-6" />
              </div>

              <div className="relative z-10 text-center md:text-left flex-grow">
                <h3 className="text-xl font-bold text-foreground mb-1 tracking-tight">Security Reminder</h3>
                <p className="text-sm md:text-base text-foreground/60 font-medium">Base64 is an <strong className="text-orange-600">encoding</strong> format, not an encryption method. Do not use Base64 to hide passwords or sensitive data, as it can be easily decoded by anyone.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}