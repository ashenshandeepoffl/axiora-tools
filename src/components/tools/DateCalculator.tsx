import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, ArrowRight, Clock, Calendar, CalendarCheck, CalendarRange, Plus } from 'lucide-react';

export default function DateCalculator() {
  const [isMounted, setIsMounted] = useState(false);
  
  // Smart Defaults
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [results, setResults] = useState<{
    days: number;
    weeks: string;
    months: string;
    years: string;
  } | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const today = new Date();
    const future = new Date(today);
    future.setDate(today.getDate() + 30);
    
    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(future.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      calculateDifference();
    }
  }, [startDate, endDate]);

  const calculateDifference = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setResults(null);
      return;
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = (diffDays / 7).toFixed(1);
    const diffMonths = (diffDays / 30.436875).toFixed(1);
    const diffYears = (diffDays / 365.25).toFixed(1);

    setResults({
      days: diffDays,
      weeks: diffWeeks.endsWith('.0') ? diffWeeks.slice(0, -2) : diffWeeks,
      months: diffMonths.endsWith('.0') ? diffMonths.slice(0, -2) : diffMonths,
      years: diffYears.endsWith('.0') ? diffYears.slice(0, -2) : diffYears,
    });
  };

  const setToday = (setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(new Date().toISOString().split('T')[0]);
  };

  const addDaysToEnd = (days: number) => {
    if (!startDate) return;
    const start = new Date(startDate);
    const future = new Date(start);
    future.setDate(start.getDate() + days);
    setEndDate(future.toISOString().split('T')[0]);
  };

  if (!isMounted) return null;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-10">
      
      {/* Main SaaS Dashboard Panel */}
      <div className="glass-card rounded-[2.5rem] p-8 md:p-12 saas-shadow relative overflow-hidden flex flex-col gap-12 bg-white">
        
        {/* Holographic Background Watermark */}
        <div className="absolute -bottom-16 -right-16 text-primary opacity-[0.02] pointer-events-none z-0">
          <CalendarDays size={400} strokeWidth={0.5} />
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-primary/5 border border-primary/10 rounded-[1.25rem] flex items-center justify-center saas-shadow">
              <CalendarRange className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Date Calculator</h2>
              <p className="text-base text-foreground/50 font-medium">Calculate exact intervals between two dates.</p>
            </div>
          </div>
        </div>

        {/* Workspace Area */}
        <div className="flex flex-col gap-10 relative z-10">
          
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Start Date */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <label className="text-sm font-bold text-foreground/40 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Start Date
                </label>
                <button onClick={() => setToday(setStartDate)} className="text-xs font-bold text-primary hover:text-secondary transition-colors px-3 py-1 bg-primary/5 hover:bg-primary/10 rounded-md">
                  Set to Today
                </button>
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-6 py-5 bg-background border-2 border-transparent rounded-[1.5rem] text-xl font-bold text-foreground focus:outline-none focus:border-primary/20 focus:bg-white saas-shadow-hover transition-all cursor-pointer"
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <label className="text-sm font-bold text-foreground/40 uppercase tracking-widest flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4" /> End Date
                </label>
                <button onClick={() => setToday(setEndDate)} className="text-xs font-bold text-primary hover:text-secondary transition-colors px-3 py-1 bg-primary/5 hover:bg-primary/10 rounded-md">
                  Set to Today
                </button>
              </div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-6 py-5 bg-background border-2 border-transparent rounded-[1.5rem] text-xl font-bold text-foreground focus:outline-none focus:border-primary/20 focus:bg-white saas-shadow-hover transition-all cursor-pointer"
              />
              
              {/* Quick Actions (SaaS UX touch) */}
              <div className="flex gap-2 mt-1">
                <button onClick={() => addDaysToEnd(7)} className="flex items-center gap-1 text-xs font-bold text-foreground/50 hover:text-primary transition-colors bg-foreground/5 px-3 py-1.5 rounded-lg hover:bg-primary/10 border border-transparent">
                  <Plus className="w-3 h-3" /> 7 Days
                </button>
                <button onClick={() => addDaysToEnd(30)} className="flex items-center gap-1 text-xs font-bold text-foreground/50 hover:text-primary transition-colors bg-foreground/5 px-3 py-1.5 rounded-lg hover:bg-primary/10 border border-transparent">
                  <Plus className="w-3 h-3" /> 30 Days
                </button>
                <button onClick={() => addDaysToEnd(365)} className="flex items-center gap-1 text-xs font-bold text-foreground/50 hover:text-primary transition-colors bg-foreground/5 px-3 py-1.5 rounded-lg hover:bg-primary/10 border border-transparent">
                  <Plus className="w-3 h-3" /> 1 Year
                </button>
              </div>
            </div>

          </div>

          {/* Results Grid */}
          <AnimatePresence mode="wait">
            {results && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col gap-6 mt-4"
              >
                <h3 className="text-sm font-bold text-foreground/40 uppercase tracking-widest text-center">Calculated Difference</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {/* Days Block */}
                  <div className="bg-primary/5 rounded-[1.5rem] p-6 md:p-8 border border-primary/10 flex flex-col items-center justify-center gap-2 relative overflow-hidden group hover:bg-primary/10 transition-colors">
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/20 blur-2xl rounded-full pointer-events-none group-hover:bg-primary/30 transition-colors"></div>
                    <span className="text-5xl md:text-6xl font-black text-primary tracking-tighter drop-shadow-sm relative z-10">{results.days}</span>
                    <span className="text-xs font-bold text-primary/60 uppercase tracking-widest relative z-10 mt-1">Total Days</span>
                  </div>
                  
                  {/* Weeks Block */}
                  <div className="bg-background/50 rounded-[1.5rem] p-6 md:p-8 border border-border/50 flex flex-col items-center justify-center gap-2 relative overflow-hidden group hover:border-secondary/30 transition-colors">
                    <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-secondary/10 blur-2xl rounded-full pointer-events-none group-hover:bg-secondary/20 transition-colors"></div>
                    <span className="text-5xl md:text-6xl font-black text-foreground tracking-tighter relative z-10">{results.weeks}</span>
                    <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest relative z-10 mt-1">Weeks</span>
                  </div>
                  
                  {/* Months Block */}
                  <div className="bg-background/50 rounded-[1.5rem] p-6 md:p-8 border border-border/50 flex flex-col items-center justify-center gap-2 relative overflow-hidden group hover:border-accent/30 transition-colors">
                    <div className="absolute -top-10 -left-10 w-24 h-24 bg-accent/10 blur-2xl rounded-full pointer-events-none group-hover:bg-accent/20 transition-colors"></div>
                    <span className="text-5xl md:text-6xl font-black text-foreground tracking-tighter relative z-10">{results.months}</span>
                    <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest relative z-10 mt-1">Months</span>
                  </div>
                  
                  {/* Years Block */}
                  <div className="bg-background/50 rounded-[1.5rem] p-6 md:p-8 border border-border/50 flex flex-col items-center justify-center gap-2 relative overflow-hidden group hover:border-primary/30 transition-colors">
                    <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/10 blur-2xl rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors"></div>
                    <span className="text-5xl md:text-6xl font-black text-foreground tracking-tighter relative z-10">{results.years}</span>
                    <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest relative z-10 mt-1">Years</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Cross pollination hook */}
      <AnimatePresence>
        {results && results.days > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-card border border-accent/30 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:saas-shadow transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-3xl rounded-full"></div>
              
              <div className="relative z-10 text-center md:text-left">
                <h3 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Need to shift dates?</h3>
                <p className="text-foreground/60 font-medium">Add or subtract an exact number of business days from any date.</p>
              </div>
              <a href="#" className="relative z-10 w-full md:w-auto flex items-center justify-center gap-2 bg-foreground text-white px-8 py-4 rounded-full font-bold hover:bg-primary transition-colors active:scale-95 saas-shadow">
                Date Shifter Tool <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}