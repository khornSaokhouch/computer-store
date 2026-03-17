"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, MoveRight, Database, ShieldCheck, Globe } from "lucide-react";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section className="relative min-h-[40vh] flex items-center overflow-hidden bg-slate-950 py-12 md:py-16">
      {/* Background Visual Stack */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src="/hero.png" 
          alt="Workstation" 
          className="w-full h-full object-cover mix-blend-luminosity"
        />
        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.15]" 
          style={{ backgroundImage: `linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)`, size: '40px 40px', backgroundSize: '40px 40px' }} 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Heading: User Friendly Scale */}
          <motion.h1 variants={itemVariants} className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-4 leading-[0.9] uppercase">
            Level Up Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-500">
              Digital Setup.
            </span>
          </motion.h1>
          
          {/* Paragraph */}
          <motion.p variants={itemVariants} className="max-w-xl text-slate-400 text-xs md:text-sm font-medium mb-6 leading-relaxed opacity-80">
            Find the best hardware for your professional and creative needs. We curate premium components and accessories to help you work faster and smarter every day.
          </motion.p>

          {/* Action Row */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <Link
              href="/products"
              className="group relative px-8 py-4 bg-indigo-600 text-white rounded-full font-black uppercase tracking-widest text-[11px] overflow-hidden transition-all hover:bg-indigo-500 hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-3">
                Shop Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <Link 
              href="/about" 
              className="group flex items-center gap-3 text-white/50 hover:text-white transition-all"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Our Story</span>
              <div className="w-8 h-[1px] bg-white/20 group-hover:w-12 group-hover:bg-indigo-400 transition-all" />
            </Link>
          </motion.div>

          {/* Precision Stats */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 py-6 border-t border-white/10"
          >
            <StatBlock icon={Database} value="1.2k+" label="Products Sold" />
            <StatBlock icon={ShieldCheck} value="99.9%" label="Happy Clients" />
            <StatBlock icon={Globe} value="24h" label="Support Sync" />
            <div className="hidden md:block">
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                  Fast Shipping <br /> Globally
               </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Ambient Glow */}
      <div className="absolute -right-20 top-1/4 w-[500px] h-[500px] bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none animate-pulse" />
    </section>
  );
}

function StatBlock({ icon: Icon, value, label }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-indigo-500">
        <Icon size={14} />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
      </div>
      <p className="text-xl font-bold text-white tracking-tighter tabular-nums leading-none">
        {value}
      </p>
    </div>
  );
}