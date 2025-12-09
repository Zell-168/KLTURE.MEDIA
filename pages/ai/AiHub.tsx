
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
          Powerful AI tools designed to supercharge your content strategy.
        </p>
      </Section>

      <Section>
        <div className="max-w-3xl mx-auto animate-fade-in">
             {/* Fight Thai Tool */}
             <Link 
                to="/ai/fight-thai"
                className="glass-panel p-8 rounded-2xl group hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(37,99,235,0.2)] border border-white/5 hover:border-blue-500/30 block"
            >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                        <PenTool size={32} />
                    </div>
                    <div className="flex-grow">
                        <h3 className="text-2xl font-bold text-white mb-2">Fight Thai by KLTURE.MEDIA</h3>
                        <p className="text-zinc-400 text-sm mb-4">
                            Smart Tweet Generator. Generate fresh tweet ideas from your old posts or reference links using AI.
                        </p>
                        <div className="flex items-center text-blue-400 font-bold text-sm group-hover:text-blue-300">
                            Try Generator <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
      </Section>
    </div>
  );
};

export default AiHub;
