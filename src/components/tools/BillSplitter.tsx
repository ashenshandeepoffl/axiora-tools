import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Receipt, Users, CreditCard, Percent, Minus, Plus, RotateCcw } from 'lucide-react';

export default function BillSplitter() {
  const [isMounted, setIsMounted] = useState(false);
  const [bill, setBill] = useState<string>('');
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [people, setPeople] = useState<number>(1);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Safe Calculations
  const billValue = parseFloat(bill) || 0;
  const tipAmount = (billValue * tipPercentage) / 100;
  const totalBill = billValue + tipAmount;
  const perPerson = people > 0 ? totalBill / people : 0;

  // Format as pure numbers (universal, no currency)
  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const handleClear = () => {
    setBill('');
    setTipPercentage(15);
    setPeople(1);
  };

  if (!isMounted) return null;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 mt-6 md:mt-0">
      
      {/* Main Fintech Workspace Panel - Tightened to max-w-5xl for perfect proportions */}
      <div className="glass-card rounded-[2.5rem] p-6 sm:p-8 lg:p-10 saas-shadow relative overflow-hidden flex flex-col gap-8 bg-white">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 border-b border-border/50 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 bg-primary/5 border border-primary/10 rounded-2xl flex items-center justify-center saas-shadow">
              <Receipt className="w-6 h-6 md:w-7 md:h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Bill Splitter</h2>
              <p className="text-sm text-foreground/50 font-medium mt-0.5">Global expense and tip calculator.</p>
            </div>
          </div>
          
          <button 
            onClick={handleClear}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-background border border-border/50 hover:bg-destructive/5 text-foreground/60 hover:text-destructive hover:border-destructive/30 rounded-xl font-bold text-sm transition-all outline-none w-fit saas-shadow-hover"
          >
            <RotateCcw className="w-4 h-4" /> Reset 
          </button>
        </div>

        {/* Workspace Split - Strict 50/50 Grid to eliminate abnormal whitespace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 relative z-10">
          
          {/* Controls Side (Bento Boxes) */}
          <div className="flex flex-col gap-5">
            
            {/* Box 1: Bill Amount */}
            <div className="bg-background/50 border border-border/50 rounded-[1.75rem] p-6 saas-shadow-hover transition-all focus-within:border-primary/30 focus-within:bg-white flex flex-col gap-3">
              <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Total Bill Amount
              </label>
              <input
                type="number"
                value={bill}
                onChange={(e) => setBill(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full bg-transparent text-4xl md:text-5xl font-black text-foreground focus:outline-none placeholder:text-foreground/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none tracking-tight"
              />
            </div>

            {/* Box 2: Tip Percentage */}
            <div className="bg-background/50 border border-border/50 rounded-[1.75rem] p-6 transition-all flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest flex items-center gap-2">
                  <Percent className="w-4 h-4" /> Tip Percentage
                </label>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-bold">{tipPercentage}%</span>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {[10, 15, 18, 20, 25].map((percent) => (
                  <button
                    key={percent}
                    onClick={() => setTipPercentage(percent)}
                    className={`py-3 rounded-xl font-bold text-sm transition-all outline-none border ${
                      tipPercentage === percent 
                        ? 'bg-primary text-white border-primary saas-shadow' 
                        : 'bg-white border-border/50 text-foreground/60 hover:text-primary hover:border-primary/30'
                    }`}
                  >
                    {percent}%
                  </button>
                ))}
              </div>
              
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={tipPercentage} 
                onChange={(e) => setTipPercentage(parseInt(e.target.value))}
                className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary hover:accent-secondary transition-all mt-2"
              />
            </div>

            {/* Box 3: Split Stepper */}
            <div className="bg-background/50 border border-border/50 rounded-[1.75rem] p-6 transition-all flex items-center justify-between">
              <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4" /> Split Between
              </label>
              
              <div className="flex items-center bg-white border border-border/50 rounded-2xl p-1.5 saas-shadow">
                <button 
                  onClick={() => setPeople(Math.max(1, people - 1))}
                  className="w-10 h-10 rounded-xl bg-foreground/5 hover:bg-destructive/10 text-foreground/60 hover:text-destructive flex items-center justify-center transition-all outline-none shrink-0"
                >
                  <Minus className="w-5 h-5" />
                </button>
                
                <input
                  type="number"
                  value={people}
                  onChange={(e) => setPeople(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center bg-transparent text-xl font-extrabold text-foreground focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0"
                />
                
                <button 
                  onClick={() => setPeople(people + 1)}
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
              <div className="relative z-10 flex flex-col gap-4 mb-10">
                <span className="text-white/80 font-bold uppercase tracking-widest text-sm">Amount Per Person</span>
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={perPerson}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col"
                  >
                    {/* The number is locked into a massive, scalable font size */}
                    <span className="text-[4rem] sm:text-[5rem] lg:text-[5.5rem] font-black tracking-tighter drop-shadow-lg leading-[1.1] break-all">
                      {formatNumber(perPerson)}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Receipt Breakdown */}
              <div className="relative z-10 flex flex-col gap-5 w-full bg-white/10 backdrop-blur-md rounded-[1.5rem] p-6 lg:p-8 border border-white/20 mt-auto">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 font-semibold text-sm sm:text-base">Initial Value</span>
                  <span className="font-bold text-lg sm:text-xl">{formatNumber(billValue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80 font-semibold text-sm sm:text-base">Tip Added ({tipPercentage}%)</span>
                  <span className="font-bold text-lg sm:text-xl">{formatNumber(tipAmount)}</span>
                </div>
                <div className="w-full h-[2px] bg-white/20 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold uppercase tracking-widest text-xs sm:text-sm">Total Amount</span>
                  <span className="font-black text-2xl sm:text-3xl text-secondary-foreground drop-shadow-sm">{formatNumber(totalBill)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}