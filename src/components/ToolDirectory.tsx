import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ChevronDown } from 'lucide-react';
import * as Icons from 'lucide-react';

const easeOutQuint = [0.23, 1, 0.32, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: easeOutQuint } }
};

export default function ToolDirectory({ tools = [] }: { tools: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMobileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dynamically calculate categories and tool counts
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = { All: tools.length };
    tools.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    
    return Object.keys(counts).map(key => ({
      name: key,
      count: counts[key]
    }));
  }, [tools]);

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-16 md:gap-24">
      
      {/* SaaS Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: easeOutQuint }}
        className="text-center flex flex-col gap-6 items-center mt-12 md:mt-24 max-w-4xl mx-auto relative z-10"
      >
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15]">
          Premium utilities for <br className="hidden md:block" />
          <span className="text-gradient">modern workflows.</span>
        </h1>
        <p className="text-lg md:text-xl text-foreground/60 font-medium leading-relaxed max-w-2xl">
          Instantly accessible, deeply secure, and beautifully designed. Experience everyday tools built without compromise.
        </p>
      </motion.div>

      {/* SaaS Control Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.15, ease: easeOutQuint }}
        className="flex flex-col gap-8 items-center max-w-4xl mx-auto w-full relative z-30"
      >
        {/* Spotlight Search Bar */}
        <div className="relative w-full group max-w-3xl">
          <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-foreground/40 w-6 h-6 transition-colors duration-500 group-focus-within:text-primary z-10" />
          <input 
            type="text" 
            placeholder="Search for a tool..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-20 py-6 text-xl font-semibold glass-card rounded-[2rem] focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 saas-shadow transition-all duration-500 placeholder:text-foreground/30 relative z-0"
          />
          {/* Keyboard shortcut hint */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-1 text-foreground/30 pointer-events-none hidden md:flex z-10">
            <Command className="w-5 h-5" />
            <span className="text-sm font-bold tracking-widest">K</span>
          </div>
        </div>

        {/* =========================================
            DESKTOP CATEGORIES (Sleek Segmented Dock)
            ========================================= */}
        <div className="hidden md:flex justify-center w-full relative">
          <div className="inline-flex items-center p-1.5 bg-white/80 backdrop-blur-2xl border border-white saas-shadow rounded-full max-w-full overflow-x-auto no-scrollbar touch-pan-x">
            {categoryData.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className="relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all outline-none flex-shrink-0 group"
              >
                {/* Active Sliding Background Pill */}
                {activeCategory === cat.name && (
                  <motion.div 
                    layoutId="activeCategoryDesktop"
                    className="absolute inset-0 bg-primary rounded-full saas-shadow"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                
                <span className={`relative z-10 transition-colors duration-300 ${
                  activeCategory === cat.name ? 'text-white' : 'text-foreground/60 hover:text-foreground'
                }`}>
                  {cat.name}
                </span>

                <span className={`relative z-10 text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md transition-colors duration-300 ${
                  activeCategory === cat.name 
                    ? 'bg-white/20 text-white' 
                    : 'bg-black/[0.04] text-foreground/40 group-hover:bg-primary/10 group-hover:text-primary'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* =========================================
            MOBILE CATEGORIES (Premium Dropdown)
            ========================================= */}
        <div className="w-full md:hidden relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
            className="w-full flex items-center justify-between glass-card saas-shadow px-6 py-5 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all border border-white"
          >
            <div className="flex items-center gap-3">
              <span className="text-foreground/50 font-semibold uppercase tracking-wider text-xs">Category:</span>
              <span className="text-foreground font-bold text-lg">{activeCategory}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-lg">
                {categoryData.find(c => c.name === activeCategory)?.count}
              </span>
              <motion.div animate={{ rotate: isMobileDropdownOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown className="w-6 h-6 text-foreground/50" />
              </motion.div>
            </div>
          </button>

          <AnimatePresence>
            {isMobileDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full left-0 right-0 mt-3 bg-white/90 backdrop-blur-2xl rounded-[1.5rem] saas-shadow p-2 flex flex-col gap-1 z-50 border border-white"
              >
                {categoryData.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setActiveCategory(cat.name);
                      setIsMobileDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-5 py-4 rounded-xl transition-all ${
                      activeCategory === cat.name 
                        ? 'bg-primary/5 text-primary font-bold' 
                        : 'text-foreground/70 font-semibold hover:bg-black/[0.03] hover:text-foreground'
                    }`}
                  >
                    <span className="text-lg">{cat.name}</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      activeCategory === cat.name ? 'bg-primary/10' : 'bg-black/[0.04] text-foreground/50'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>

      {/* =========================================
          THE GRID (Holographic SVG Cards)
          ========================================= */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-10"
      >
        <AnimatePresence mode="popLayout">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => {
              const IconComponent = (Icons[tool.icon as keyof typeof Icons] as React.ElementType) || Icons.Wrench;

              return (
                <motion.a 
                  layout
                  variants={itemVariants}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                  href={tool.path} 
                  key={tool.id} 
                  className="group glass-card rounded-[2rem] p-8 md:p-10 saas-shadow hover:saas-shadow-hover transition-all duration-500 hover:-translate-y-2 relative overflow-hidden h-full flex flex-col outline-none focus-visible:ring-4 focus-visible:ring-primary/40 bg-white"
                >
                  {/* Premium Interaction 1: Axiora Gradient Top Bar Reveal */}
                  <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-saas origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out z-20"></div>

                  {/* Premium Interaction 2: Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-saas opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500 z-0"></div>

                  {/* Premium Interaction 3: Massive Holographic SVG Watermark */}
                  <div className="absolute -bottom-12 -right-12 text-primary opacity-[0.02] group-hover:opacity-[0.08] group-hover:scale-[1.35] group-hover:-rotate-12 transition-all duration-700 ease-out pointer-events-none z-0">
                    <IconComponent size={240} strokeWidth={1} />
                  </div>
                  
                  {/* Actual Card Content (Elevated to sit above the watermark) */}
                  <div className="flex flex-col gap-6 h-full relative z-10">
                    
                    {/* Floating Icon Box */}
                    <div className="w-16 h-16 rounded-[1.25rem] bg-white border border-border flex items-center justify-center saas-shadow group-hover:border-primary/20 transition-all duration-500 relative overflow-hidden">
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <IconComponent className="w-7 h-7 text-primary transition-all duration-500 group-hover:scale-110" strokeWidth={2} />
                    </div>
                    
                    <div className="flex flex-col gap-3 flex-grow mt-2">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 tracking-tight">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-foreground/60 leading-relaxed font-medium">
                        {tool.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-4 text-sm font-bold uppercase tracking-widest text-foreground/30 group-hover:text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out">
                      Launch Workspace <Icons.ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.a>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center gap-6 py-32"
            >
              <div className="w-24 h-24 rounded-[2rem] glass-card flex items-center justify-center mb-4 saas-shadow relative overflow-hidden">
                <Search className="w-10 h-10 text-primary/40 relative z-10" />
                <div className="absolute inset-0 bg-primary/5"></div>
              </div>
              <p className="text-2xl text-foreground/50 font-bold tracking-tight">No tools found matching "{searchQuery}"</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-2 px-8 py-3 bg-primary/10 text-primary rounded-full font-bold hover:bg-primary hover:text-white transition-all duration-300 saas-shadow-hover"
              >
                Clear search criteria
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}