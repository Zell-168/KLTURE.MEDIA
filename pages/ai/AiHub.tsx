
import React from 'react';
import Section from '../../components/ui/Section';
import { Bot, PenTool, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AiHub: React.FC = () => {

  return (
    <div className="min-h-screen">
      <Section className="text-center pb-8">
        <div className="w-16 h-16 bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
          <Bot size={36} />
        </div>
        <h1 className="text-3xl md:text-5xl font-black mb-4 text-white drop-shadow-md">KLTURE AI Suite</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg mb-8">
          Powerful AI tools designed to supercharge your marketing, content strategy, and competitive analysis.
        </p>
      </Section>

      <Section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
             {/* Fight Thai Tool */}
             <Link 
                to="/ai/fight-thai"
                className="glass-panel p-8 rounded-2xl group hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(220,38,38,0.2)] border border-white/5 hover:border-red-500/30"
            >
                <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <PenTool size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Fight Thai</h3>
                <p className="text-zinc-400 text-sm mb-6 h-12">
                    Smart Tweet Generator. Generate fresh tweet ideas from your old posts or reference links using AI.
                </p>
                <div className="flex items-center text-blue-400 font-bold text-sm group-hover:text-blue-300">
                    Try Generator <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>

            {/* Placeholder for other tools */}
            <div className="glass-panel p-8 rounded-2xl border border-white/5 opacity-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-bold border border-white/10">Coming Soon</span>
                </div>
                <div className="w-12 h-12 bg-zinc-800 rounded-xl mb-6"></div>
                <h3 className="text-xl font-bold text-zinc-600 mb-2">Marketing Planner</h3>
                <p className="text-zinc-700 text-sm mb-6">AI-driven marketing campaign strategies.</p>
            </div>
             <div className="glass-panel p-8 rounded-2xl border border-white/5 opacity-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-bold border border-white/10">Coming Soon</span>
                </div>
                <div className="w-12 h-12 bg-zinc-800 rounded-xl mb-6"></div>
                <h3 className="text-xl font-bold text-zinc-600 mb-2">Ad Spy</h3>
                <p className="text-zinc-700 text-sm mb-6">Reverse engineer Facebook ads.</p>
            </div>
        </div>
      </Section>
    </div>
  );
};

export default AiHub;
