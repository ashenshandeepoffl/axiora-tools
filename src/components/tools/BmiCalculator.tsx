import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Activity, ArrowRight, RefreshCcw, Scale, Ruler } from 'lucide-react';

export default function BmiCalculator() {
  const [isMounted, setIsMounted] = useState(false);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  
  // Metric States
  const [heightCm, setHeightCm] = useState<string>('');
  const [weightKg, setWeightKg] = useState<string>('');
  
  // Imperial States
  const [heightFt, setHeightFt] = useState<string>('');
  const [heightIn, setHeightIn] = useState<string>('');
  const [weightLbs, setWeightLbs] = useState<string>('');

  const [bmi, setBmi] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const calculateBmi = () => {
    let calculatedBmi = 0;

    if (unit === 'metric') {
      const h = parseFloat(heightCm) / 100;
      const w = parseFloat(weightKg);
      if (h > 0 && w > 0) calculatedBmi = w / (h * h);
    } else {
      const hTotalInches = (parseFloat(heightFt || '0') * 12) + parseFloat(heightIn || '0');
      const w = parseFloat(weightLbs);
      if (hTotalInches > 0 && w > 0) calculatedBmi = 703 * (w / (hTotalInches * hTotalInches));
    }

    if (calculatedBmi > 0) {
      setBmi(parseFloat(calculatedBmi.toFixed(1)));
    }
  };

  const resetForm = () => {
    setHeightCm('');
    setWeightKg('');
    setHeightFt('');
    setHeightIn('');
    setWeightLbs('');
    setBmi(null);
  };

  // Premium Dashboard Status Colors
  const getBmiDetails = (bmiValue: number) => {
    if (bmiValue < 18.5) return { label: 'Underweight', color: 'text-[#66CCFF]', bg: 'bg-[#66CCFF]/10', border: 'border-[#66CCFF]/30', glow: 'bg-[#66CCFF]/20' };
    if (bmiValue >= 18.5 && bmiValue < 25) return { label: 'Optimal Weight', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/30', glow: 'bg-secondary/20' };
    if (bmiValue >= 25 && bmiValue < 30) return { label: 'Overweight', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', glow: 'bg-orange-500/20' };
    return { label: 'Obese', color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30', glow: 'bg-destructive/20' };
  };

  if (!isMounted) return null;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-10">
      
      {/* Main SaaS Dashboard Panel */}
      <div className="glass-card rounded-[2.5rem] p-8 md:p-12 saas-shadow relative overflow-hidden flex flex-col gap-12 bg-white">
        
        {/* Holographic Background Watermark */}
        <div className="absolute -bottom-20 -right-20 text-primary opacity-[0.03] pointer-events-none z-0">
          <Calculator size={350} strokeWidth={0.5} />
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-primary/5 border border-primary/10 rounded-[1.25rem] flex items-center justify-center saas-shadow">
              <Calculator className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">BMI Calculator</h2>
              <p className="text-base text-foreground/50 font-medium">Analyze your body mass index securely.</p>
            </div>
          </div>

          {/* Premium Segmented Control for Units */}
          <div className="inline-flex items-center p-1.5 bg-foreground/5 backdrop-blur-xl border border-black/[0.03] rounded-full">
            <button
              onClick={() => { setUnit('metric'); setBmi(null); }}
              className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all outline-none ${
                unit === 'metric' ? 'text-primary saas-shadow' : 'text-foreground/50 hover:text-foreground'
              }`}
            >
              {unit === 'metric' && (
                <motion.div layoutId="unitToggle" className="absolute inset-0 bg-white rounded-full" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
              )}
              <span className="relative z-10">Metric</span>
            </button>
            <button
              onClick={() => { setUnit('imperial'); setBmi(null); }}
              className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all outline-none ${
                unit === 'imperial' ? 'text-primary saas-shadow' : 'text-foreground/50 hover:text-foreground'
              }`}
            >
              {unit === 'imperial' && (
                <motion.div layoutId="unitToggle" className="absolute inset-0 bg-white rounded-full" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
              )}
              <span className="relative z-10">Imperial</span>
            </button>
          </div>
        </div>

        {/* Workspace Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
          
          {/* Inputs Column */}
          <div className="flex flex-col gap-8">
            
            {/* Height Input */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-foreground/40 uppercase tracking-widest flex items-center gap-2">
                <Ruler className="w-4 h-4" /> Height
              </label>
              {unit === 'metric' ? (
                <div className="relative group">
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="175"
                    className="w-full px-6 py-5 bg-background border-2 border-transparent rounded-[1.5rem] text-2xl font-bold text-foreground focus:outline-none focus:border-primary/20 focus:bg-white saas-shadow-hover transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground/30 font-bold">cm</span>
                </div>
              ) : (
                <div className="flex gap-4">
                  <div className="relative flex-1 group">
                    <input
                      type="number"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      placeholder="5"
                      className="w-full px-6 py-5 bg-background border-2 border-transparent rounded-[1.5rem] text-2xl font-bold text-foreground focus:outline-none focus:border-primary/20 focus:bg-white saas-shadow-hover transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground/30 font-bold">ft</span>
                  </div>
                  <div className="relative flex-1 group">
                    <input
                      type="number"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      placeholder="10"
                      className="w-full px-6 py-5 bg-background border-2 border-transparent rounded-[1.5rem] text-2xl font-bold text-foreground focus:outline-none focus:border-primary/20 focus:bg-white saas-shadow-hover transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground/30 font-bold">in</span>
                  </div>
                </div>
              )}
            </div>

            {/* Weight Input */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-foreground/40 uppercase tracking-widest flex items-center gap-2">
                <Scale className="w-4 h-4" /> Weight
              </label>
              <div className="relative group">
                <input
                  type="number"
                  value={unit === 'metric' ? weightKg : weightLbs}
                  onChange={(e) => unit === 'metric' ? setWeightKg(e.target.value) : setWeightLbs(e.target.value)}
                  placeholder={unit === 'metric' ? "70" : "150"}
                  className="w-full px-6 py-5 bg-background border-2 border-transparent rounded-[1.5rem] text-2xl font-bold text-foreground focus:outline-none focus:border-primary/20 focus:bg-white saas-shadow-hover transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground/30 font-bold">
                  {unit === 'metric' ? 'kg' : 'lbs'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-2">
              <button 
                onClick={calculateBmi}
                className="flex-1 px-8 py-5 bg-gradient-saas text-white font-bold text-lg rounded-[1.5rem] saas-shadow hover:saas-shadow-hover transition-all active:scale-95 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                Calculate BMI
              </button>
              <button 
                onClick={resetForm}
                className="p-5 bg-foreground/5 text-foreground/50 hover:bg-destructive/10 hover:text-destructive rounded-[1.5rem] transition-all active:scale-95 border border-transparent"
                title="Reset"
              >
                <RefreshCcw className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Result Column (The Dashboard Widget) */}
          <div className="relative h-full min-h-[350px] rounded-[2rem] border border-border/50 bg-background/50 flex flex-col items-center justify-center p-8 overflow-hidden transition-all duration-700">
            <AnimatePresence mode="wait">
              {bmi ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="flex flex-col items-center gap-6 relative z-10 w-full"
                >
                  {/* Dynamic Ambient Glow inside the result box */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] pointer-events-none transition-colors duration-1000 ${getBmiDetails(bmi).glow}`}></div>

                  <span className="text-foreground/40 font-bold uppercase tracking-widest text-sm">Your Result</span>
                  
                  <div className="relative">
                    <span className={`text-8xl md:text-9xl font-black tracking-tighter ${getBmiDetails(bmi).color} drop-shadow-sm`}>
                      {bmi}
                    </span>
                  </div>
                  
                  <div className={`px-8 py-3 rounded-full border bg-white/80 backdrop-blur-md font-bold text-lg saas-shadow ${getBmiDetails(bmi).color} ${getBmiDetails(bmi).border}`}>
                    {getBmiDetails(bmi).label}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 text-foreground/30 relative z-10"
                >
                  <Activity className="w-20 h-20 mb-2 opacity-50" strokeWidth={1} />
                  <p className="text-xl font-semibold tracking-tight text-center">Awaiting your metrics...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Completion hook - Cross pollination to a related tool */}
      <AnimatePresence>
        {bmi && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-card border border-secondary/20 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:saas-shadow transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-3xl rounded-full"></div>
              
              <div className="relative z-10 text-center md:text-left">
                <h3 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Calculation Complete.</h3>
                <p className="text-foreground/60 font-medium">Want to know exactly how many calories you burn in a day?</p>
              </div>
              <a href="#" className="relative z-10 w-full md:w-auto flex items-center justify-center gap-2 bg-secondary text-white px-8 py-4 rounded-full font-bold hover:bg-primary transition-colors active:scale-95 saas-shadow">
                Open BMR Calculator <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}