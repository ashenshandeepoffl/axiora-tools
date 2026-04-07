import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, RefreshCw, ShieldCheck, ArrowRight, Lock, Check, Zap } from 'lucide-react';

export default function PasswordGenerator() {
  const [isMounted, setIsMounted] = useState(false);
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState({ score: 0, label: 'Weak', color: 'bg-destructive/50' });

  // Cryptographically secure password generation
  const generatePassword = useCallback(() => {
    const charSets = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
    };

    let availableChars = '';
    if (options.uppercase) availableChars += charSets.uppercase;
    if (options.lowercase) availableChars += charSets.lowercase;
    if (options.numbers) availableChars += charSets.numbers;
    if (options.symbols) availableChars += charSets.symbols;

    if (availableChars.length === 0) {
      setPassword('');
      return;
    }

    // Use Web Crypto API for true randomness
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    let generated = '';
    for (let i = 0; i < length; i++) {
      generated += availableChars[array[i] % availableChars.length];
    }
    
    setPassword(generated);
  }, [length, options]);

  // Calculate Strength
  useEffect(() => {
    let score = 0;
    if (length > 8) score += 1;
    if (length > 12) score += 1;
    if (length >= 16) score += 1;
    if (options.uppercase && options.lowercase) score += 1;
    if (options.numbers) score += 1;
    if (options.symbols) score += 1;

    let label = 'Weak';
    let color = 'bg-destructive';
    let glow = 'shadow-destructive/20';

    if (score >= 5) {
      label = 'Strong';
      color = 'bg-secondary'; // Axiora Teal
      glow = 'shadow-secondary/30';
    } else if (score >= 3) {
      label = 'Fair';
      color = 'bg-primary'; // Axiora Blue
      glow = 'shadow-primary/30';
    }

    setStrength({ score, label, color: `${color} ${glow}` });
  }, [length, options, password]);

  useEffect(() => {
    setIsMounted(true);
    generatePassword();
  }, [generatePassword]);

  const handleCopy = async () => {
    if (!isMounted || typeof navigator === 'undefined' || !password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const toggleOption = (key: keyof typeof options) => {
    setOptions(prev => {
      const next = { ...prev, [key]: !prev[key] };
      // Prevent turning off all options
      if (!Object.values(next).some(Boolean)) return prev;
      return next;
    });
  };

  if (!isMounted) return null;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-10 mt-6 md:mt-0">
      
      {/* Main SaaS Workspace Panel */}
      <div className="glass-card rounded-[2.5rem] p-6 sm:p-8 md:p-12 saas-shadow relative overflow-hidden flex flex-col gap-8 md:gap-10 bg-white">
        
        {/* Holographic Background Watermark */}
        <div className="absolute -bottom-20 -right-20 text-primary opacity-[0.03] pointer-events-none z-0 hidden sm:block">
          <ShieldCheck size={400} strokeWidth={0.5} />
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 relative z-10">
          <div className="flex items-center gap-4 md:gap-5">
            <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 bg-primary/5 border border-primary/10 rounded-[1.25rem] flex items-center justify-center saas-shadow relative overflow-hidden group">
              <ShieldCheck className="w-7 h-7 md:w-8 md:h-8 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Password Generator</h2>
              <p className="text-sm md:text-base text-foreground/50 font-medium">Cryptographically secure, zero-knowledge.</p>
            </div>
          </div>
        </div>

        {/* The Output Vault */}
        <div className="relative z-10 w-full">
          <div className="absolute -inset-1 bg-gradient-saas rounded-[2rem] opacity-10 blur-lg"></div>
          <div className="relative bg-white border border-border/50 rounded-[1.75rem] p-5 sm:p-6 md:p-8 flex flex-col gap-6 saas-shadow">
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 md:w-5 md:h-5 text-foreground/30" />
                <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-foreground/40">Generated Key</span>
              </div>
              
              {/* Strength Badge */}
              <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-lg border border-border/50">
                <div className={`w-2 h-2 rounded-full shadow-lg ${strength.color}`}></div>
                <span className="text-[10px] md:text-xs font-bold text-foreground/60 uppercase tracking-wider">{strength.label}</span>
              </div>
            </div>

            <div className="w-full overflow-x-auto no-scrollbar py-2">
              <span className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-foreground tracking-wider select-all break-all leading-tight">
                {password}
              </span>
            </div>

            {/* Light, Simple Action Bar (Mobile Responsive Stack) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2">
              <button 
                onClick={generatePassword}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-background border border-border text-foreground/70 hover:bg-white hover:text-primary hover:border-primary/20 rounded-[1.25rem] font-bold text-sm md:text-base transition-all saas-shadow-hover active:scale-95 group w-full sm:w-auto"
              >
                <RefreshCw className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-180 transition-transform duration-500" />
                Regenerate
              </button>
              
              <button 
                onClick={handleCopy}
                className={`flex items-center justify-center gap-2 flex-1 px-6 py-4 rounded-[1.25rem] font-bold text-sm md:text-base transition-all active:scale-95 saas-shadow border ${
                  copied 
                    ? 'bg-secondary/10 border-secondary/20 text-secondary' 
                    : 'bg-primary/5 border-primary/10 text-primary hover:bg-primary/10 hover:border-primary/20'
                }`}
              >
                {copied ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : <Copy className="w-4 h-4 md:w-5 md:h-5" />}
                {copied ? 'Copied Securely' : 'Copy Password'}
              </button>
            </div>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 relative z-10 mt-2 bg-background/30 p-5 sm:p-8 rounded-[2rem] border border-border/50">
          
          {/* Length Slider */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <label className="text-xs md:text-sm font-bold text-foreground/60 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4" /> Length
              </label>
              <div className="bg-white px-4 py-1.5 rounded-xl border border-border/50 saas-shadow font-mono font-bold text-primary text-base md:text-lg">
                {length}
              </div>
            </div>
            
            <input 
              type="range" 
              min="8" 
              max="64" 
              value={length} 
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary hover:accent-secondary transition-all"
            />
            <div className="flex justify-between text-[10px] md:text-xs font-bold text-foreground/30">
              <span>8</span>
              <span>32</span>
              <span>64</span>
            </div>
          </div>

          {/* SaaS Segmented Toggles (Fixed flex-shrink for mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {(Object.keys(options) as Array<keyof typeof options>).map((key) => (
              <button
                key={key}
                onClick={() => toggleOption(key)}
                className={`flex items-center justify-between p-3.5 sm:p-4 rounded-[1.25rem] border transition-all hover:saas-shadow-hover outline-none ${
                  options[key] 
                    ? 'bg-white border-primary/20 saas-shadow' 
                    : 'bg-background/50 border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <span className={`text-xs sm:text-sm font-bold capitalize truncate mr-2 ${options[key] ? 'text-foreground' : 'text-foreground/50'}`}>
                  {key}
                </span>
                
                {/* Fixed Framer Motion Switch */}
                <div className={`w-10 h-6 rounded-full p-1 flex items-center transition-colors flex-shrink-0 ${options[key] ? 'bg-primary' : 'bg-foreground/20'}`}>
                  <motion.div 
                    layout
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                    animate={{ x: options[key] ? 16 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}