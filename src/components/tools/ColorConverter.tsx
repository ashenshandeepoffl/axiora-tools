import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Palette, Check, ArrowRight, Pipette } from 'lucide-react';

export default function ColorConverter() {
  const [isMounted, setIsMounted] = useState(false);
  const [hex, setHex] = useState('#005F99'); // Axiora Deep Blue
  const [rgb, setRgb] = useState('rgb(0, 95, 153)');
  const [hsl, setHsl] = useState('hsl(203, 100%, 30%)');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Utility functions
  const hexToRgb = (hexStr: string) => {
    let r = 0, g = 0, b = 0;
    if (hexStr.length === 4) {
      r = parseInt(hexStr[1] + hexStr[1], 16);
      g = parseInt(hexStr[2] + hexStr[2], 16);
      b = parseInt(hexStr[3] + hexStr[3], 16);
    } else if (hexStr.length === 7) {
      r = parseInt(hexStr.substring(1, 3), 16);
      g = parseInt(hexStr.substring(3, 5), 16);
      b = parseInt(hexStr.substring(5, 7), 16);
    }
    return `rgb(${r}, ${g}, ${b})`;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newHex = e.target.value;
    if (!newHex.startsWith('#')) newHex = '#' + newHex;
    setHex(newHex);

    if (/^#([0-9A-F]{3}){1,2}$/i.test(newHex)) {
      const newRgb = hexToRgb(newHex);
      setRgb(newRgb);
      const rgbValues = newRgb.match(/\d+/g);
      if (rgbValues && rgbValues.length === 3) {
        setHsl(rgbToHsl(Number(rgbValues[0]), Number(rgbValues[1]), Number(rgbValues[2])));
      }
    }
  };

  const handleCopy = async (text: string, format: string) => {
    if (!isMounted || typeof navigator === 'undefined') return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Determine if text should be light or dark based on the color's brightness
  const isLightColor = () => {
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(hex)) return true;
    const color = hex.replace('#', '');
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128;
  };

  if (!isMounted) return null;

  const dynamicGlassClass = isLightColor() 
    ? 'bg-black/5 hover:bg-black/10 border-black/10 text-[#0F172A]' 
    : 'bg-white/10 hover:bg-white/20 border-white/20 text-white';

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-10">
      
      {/* Main SaaS Dashboard Panel */}
      <div className="glass-card rounded-[2.5rem] p-8 md:p-12 saas-shadow relative overflow-hidden flex flex-col gap-12 bg-white">
        
        {/* Holographic Background Watermark */}
        <div className="absolute -bottom-16 -right-16 text-secondary opacity-[0.03] pointer-events-none z-0">
          <Palette size={350} strokeWidth={0.5} />
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-secondary/5 border border-secondary/10 rounded-[1.25rem] flex items-center justify-center saas-shadow">
              <Palette className="w-8 h-8 text-secondary" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Color Converter</h2>
              <p className="text-base text-foreground/50 font-medium">Translate HEX, RGB, and HSL formats instantly.</p>
            </div>
          </div>
        </div>

        {/* Workspace Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
          
          {/* Controls Side */}
          <div className="flex flex-col gap-8">
            
            {/* Primary Hex Input */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-foreground/40 uppercase tracking-widest flex items-center gap-2">
                <Pipette className="w-4 h-4" /> Hex Code
              </label>
              <div className="flex gap-4 items-center">
                <div className="relative w-16 h-16 rounded-[1.25rem] border-[4px] border-white saas-shadow-hover overflow-hidden flex-shrink-0 cursor-pointer transition-transform hover:scale-105 bg-background">
                  <input 
                    type="color" 
                    value={/^#([0-9A-F]{3}){1,2}$/i.test(hex) ? hex : '#ffffff'} 
                    onChange={handleHexChange}
                    className="absolute -top-4 -left-4 w-24 h-24 cursor-pointer opacity-0"
                  />
                  <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: /^#([0-9A-F]{3}){1,2}$/i.test(hex) ? hex : '#ffffff' }}></div>
                </div>
                <input
                  type="text"
                  value={hex}
                  onChange={handleHexChange}
                  className="w-full px-6 py-5 bg-background border-2 border-transparent rounded-[1.5rem] text-2xl font-bold font-mono text-foreground focus:outline-none focus:border-secondary/30 focus:bg-white saas-shadow-hover transition-all uppercase"
                />
              </div>
            </div>

            {/* Read-only Data Displays */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-foreground/40 uppercase tracking-widest">RGB Value</label>
                <div className="w-full px-6 py-4 bg-foreground/5 border border-transparent rounded-[1.25rem] text-lg font-bold font-mono text-foreground/60 overflow-x-auto no-scrollbar whitespace-nowrap">
                  {rgb}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-foreground/40 uppercase tracking-widest">HSL Value</label>
                <div className="w-full px-6 py-4 bg-foreground/5 border border-transparent rounded-[1.25rem] text-lg font-bold font-mono text-foreground/60 overflow-x-auto no-scrollbar whitespace-nowrap">
                  {hsl}
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Color Output Side (The Magic Canvas) */}
          <motion.div 
            className="w-full min-h-[350px] rounded-[2rem] p-8 flex flex-col justify-end gap-4 saas-shadow border border-black/5 relative overflow-hidden"
            animate={{ backgroundColor: /^#([0-9A-F]{3}){1,2}$/i.test(hex) ? hex : '#F8FAFC' }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Soft inner glow to give the color depth */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-white/10 pointer-events-none"></div>

            <div className="flex flex-col gap-3 w-full max-w-sm relative z-10">
              <button 
                onClick={() => handleCopy(hex.toUpperCase(), 'hex')}
                className={`flex items-center justify-between px-6 py-4 rounded-[1.25rem] border backdrop-blur-xl transition-all active:scale-95 group ${dynamicGlassClass}`}
              >
                <span className="font-mono font-bold tracking-wider">{hex.toUpperCase()}</span>
                {copiedFormat === 'hex' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />}
              </button>
              
              <button 
                onClick={() => handleCopy(rgb, 'rgb')}
                className={`flex items-center justify-between px-6 py-4 rounded-[1.25rem] border backdrop-blur-xl transition-all active:scale-95 group ${dynamicGlassClass}`}
              >
                <span className="font-mono font-bold">{rgb}</span>
                {copiedFormat === 'rgb' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />}
              </button>
              
              <button 
                onClick={() => handleCopy(hsl, 'hsl')}
                className={`flex items-center justify-between px-6 py-4 rounded-[1.25rem] border backdrop-blur-xl transition-all active:scale-95 group ${dynamicGlassClass}`}
              >
                <span className="font-mono font-bold">{hsl}</span>
                {copiedFormat === 'hsl' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />}
              </button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Completion hook - Cross pollination */}
      <AnimatePresence>
        {copiedFormat && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="glass-card border border-primary/20 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:saas-shadow transition-all">
              <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full"></div>
              
              <div className="relative z-10 text-center md:text-left">
                <h3 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Format Copied!</h3>
                <p className="text-foreground/60 font-medium">Make sure your colors have enough contrast for readability.</p>
              </div>
              <a href="#" className="relative z-10 w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-secondary transition-colors active:scale-95 saas-shadow">
                Check Contrast <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}