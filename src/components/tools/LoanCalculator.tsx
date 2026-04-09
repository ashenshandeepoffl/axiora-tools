import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, Percent, CalendarDays, RotateCcw, Wallet, Plus, Minus } from 'lucide-react';

export default function LoanCalculator() {
  const [isMounted, setIsMounted] = useState(false);
  const [principal, setPrincipal] = useState<string>('');
  const [rate, setRate] = useState<number>(5); // Annual Interest Rate
  const [years, setYears] = useState<number>(5); // Loan Term in Years

  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Complex Financial Math (Amortization Formula)
  useEffect(() => {
    const p = parseFloat(principal) || 0;
    const r = rate / 100 / 12; // Monthly interest rate
    const n = years * 12; // Total number of months

    if (p > 0 && n > 0) {
      let emi = 0;
      if (r === 0) {
        emi = p / n; // 0% interest edge case
      } else {
        emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }

      const total = emi * n;
      const interest = total - p;

      setMonthlyPayment(emi);
      setTotalPayment(total);
      setTotalInterest(interest);
    } else {
      setMonthlyPayment(0);
      setTotalPayment(0);
      setTotalInterest(0);
    }
  }, [principal, rate, years]);

  // Format as pure universal numbers (Tabular Nums handle the visual alignment)
  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const handleClear = () => {
    setPrincipal('');
    setRate(5);
    setYears(5);
  };

  if (!isMounted) return null;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 mt-6 md:mt-0">
      
      {/* Main Fintech Workspace Panel */}
      <div className="glass-card rounded-[2.5rem] p-6 sm:p-8 lg:p-10 saas-shadow relative overflow-hidden flex flex-col gap-8 bg-white">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 border-b border-border/50 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 bg-primary/5 border border-primary/10 rounded-2xl flex items-center justify-center saas-shadow">
              <Landmark className="w-6 h-6 md:w-7 md:h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Loan Calculator</h2>
              <p className="text-sm text-foreground/50 font-medium mt-0.5">Estimate monthly payments and total interest.</p>
            </div>
          </div>
          
          <button 
            onClick={handleClear}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-background border border-border/50 hover:bg-destructive/5 text-foreground/60 hover:text-destructive hover:border-destructive/30 rounded-xl font-bold text-sm transition-all outline-none w-fit saas-shadow-hover"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>

        {/* Workspace Split - Bento Box Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 relative z-10">
          
          {/* Controls Side (Bento Boxes) */}
          <div className="flex flex-col gap-5">
            
            {/* Box 1: Principal Amount */}
            <div className="bg-background/50 border border-border/50 rounded-[1.75rem] p-6 saas-shadow-hover transition-all focus-within:border-primary/30 focus-within:bg-white flex flex-col gap-3">
              <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest flex items-center gap-2">
                <Wallet className="w-4 h-4" /> Loan Amount (Principal)
              </label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                placeholder="0.00"
                min="0"
                step="1000"
                className="w-full bg-transparent text-4xl md:text-5xl font-black text-foreground focus:outline-none placeholder:text-foreground/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none tracking-tight"
              />
            </div>

            {/* Box 2: Interest Rate */}
            <div className="bg-background/50 border border-border/50 rounded-[1.75rem] p-6 transition-all flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest flex items-center gap-2">
                  <Percent className="w-4 h-4" /> Annual Interest Rate
                </label>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-bold">{rate.toFixed(1)}%</span>
              </div>
              
              <input 
                type="range" 
                min="0" 
                max="30" 
                step="0.1"
                value={rate} 
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary hover:accent-secondary transition-all mt-2"
              />
              <div className="flex justify-between text-[10px] font-bold text-foreground/30 px-1">
                <span>0%</span>
                <span>15%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Box 3: Loan Term */}
            <div className="bg-background/50 border border-border/50 rounded-[1.75rem] p-6 transition-all flex items-center justify-between">
              <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest flex items-center gap-2">
                <CalendarDays className="w-4 h-4" /> Term (Years)
              </label>
              
              <div className="flex items-center bg-white border border-border/50 rounded-2xl p-1.5 saas-shadow">
                <button 
                  onClick={() => setYears(Math.max(1, years - 1))}
                  className="w-10 h-10 rounded-xl bg-foreground/5 hover:bg-destructive/10 text-foreground/60 hover:text-destructive flex items-center justify-center transition-all outline-none shrink-0"
                >
                  <Minus className="w-5 h-5" />
                </button>
                
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center bg-transparent text-xl font-extrabold text-foreground focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0"
                />
                
                <button 
                  onClick={() => setYears(Math.max(1, years + 1))}
                  className="w-10 h-10 rounded-xl bg-foreground/5 hover:bg-primary/10 text-foreground/60 hover:text-primary flex items-center justify-center transition-all outline-none shrink-0"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>

          {/* Results Widget Side (Right Column) */}
          <div className="h-full">
            <div className="bg-gradient-saas rounded-[2rem] p-8 lg:p-10 h-full min-h-[400px] flex flex-col justify-between saas-glow relative overflow-hidden transform-gpu text-white border border-primary">
              
              {/* Internal lighting effects */}
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/20 blur-3xl rounded-full pointer-events-none transform-gpu"></div>
              <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-secondary/40 blur-3xl rounded-full pointer-events-none transform-gpu"></div>
              
              {/* Massive Hero Metric */}
              <div className="relative z-10 flex flex-col gap-2 mb-10">
                <span className="text-white/80 font-bold uppercase tracking-widest text-base md:text-lg">Monthly Payment (EMI)</span>
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={monthlyPayment}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col mt-2"
                  >
                    {/* Added tabular-nums for perfect math alignment */}
                    <span className="text-[4rem] sm:text-[5rem] lg:text-[5.5rem] font-black tracking-tighter drop-shadow-lg leading-[1.1] tabular-nums break-all">
                      {formatNumber(monthlyPayment)}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Accounting Ledger Breakdown */}
              <div className="relative z-10 flex flex-col w-full bg-white/10 backdrop-blur-md rounded-[1.5rem] p-6 lg:p-8 border border-white/20 mt-auto">
                
                <div className="flex justify-between items-end gap-4 border-b border-white/10 pb-5 mb-5">
                  <span className="text-white/80 font-semibold text-base sm:text-lg">Principal Amount</span>
                  <span className="font-bold text-2xl sm:text-3xl tabular-nums text-right">{formatNumber(parseFloat(principal) || 0)}</span>
                </div>
                
                <div className="flex justify-between items-end gap-4 border-b border-white/10 pb-5 mb-5">
                  <span className="text-white/80 font-semibold text-base sm:text-lg">Total Interest</span>
                  <span className="font-bold text-2xl sm:text-3xl tabular-nums text-right">{formatNumber(totalInterest)}</span>
                </div>
                
                <div className="flex justify-between items-end gap-4 pt-1">
                  <span className="text-white font-bold uppercase tracking-widest text-sm sm:text-base">Total Repayment</span>
                  <span className="font-black text-3xl sm:text-4xl tabular-nums text-right text-secondary-foreground drop-shadow-sm">{formatNumber(totalPayment)}</span>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}