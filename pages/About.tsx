
import React from 'react';
import { useLang } from '../App';
import Section from '../components/ui/Section';
import { Target, TrendingUp } from 'lucide-react';

const About: React.FC = () => {
  const { t } = useLang();

  return (
    <div className="min-h-screen text-white">
        <Section>
            <div className="max-w-3xl mx-auto animate-fade-in">
                <h1 className="text-4xl font-black mb-8 text-center drop-shadow-md">{t.about.title}</h1>
                <div className="glass-panel p-8 rounded-3xl mb-12 space-y-4">
                    <div className="prose prose-lg text-zinc-300">
                        {t.about.content.map((para, i) => (
                            <p key={i} className="leading-relaxed">{para}</p>
                        ))}
                    </div>
                </div>
                
                <div className="glass-panel text-white p-8 rounded-3xl shadow-xl mb-12 border-l-4 border-red-600 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <Target className="text-red-500 mb-4 relative z-10" size={32} />
                    <p className="text-xl font-medium leading-relaxed font-serif italic relative z-10 text-zinc-100">"{t.about.mission}"</p>
                </div>

                <div className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center text-red-500">
                             <TrendingUp size={20} />
                        </div>
                        <h2 className="text-2xl font-bold">{t.about.visionTitle}</h2>
                    </div>
                    
                    <div className="space-y-4 relative pl-4">
                         {/* Vertical line */}
                         <div className="absolute left-[27px] top-2 bottom-4 w-0.5 bg-white/10"></div>
                         
                         {t.about.visionList.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 relative z-10">
                                <div className="w-6 h-6 rounded-full bg-black border-2 border-red-600 shrink-0"></div>
                                <p className="text-zinc-300 font-medium text-lg">{item}</p>
                            </div>
                         ))}
                    </div>
                </div>
            </div>
        </Section>
    </div>
  );
};

export default About;
