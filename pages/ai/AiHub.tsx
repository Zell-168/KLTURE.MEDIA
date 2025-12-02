
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useLang } from '../../App';
import Section from '../../components/ui/Section';
import { Bot, Zap, Rocket, Search, Lock } from 'lucide-react';

const AiHub: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLang();

  const tools = [
    {
      id: 'marketing',
      title: 'AI Marketing Ideas',
      description: 'Generate comprehensive marketing campaigns including objectives, strategies, and budget allocation tailored to your business.',
      icon: <Zap size={32} className="text-yellow-500" />,
      path: '/ai/marketing',
      color: 'from-yellow-500/20 to-orange-500/20',
      border: 'group-hover:border-yellow-500/50'
    },
    {
      id: 'boosting',
      title: 'AI Boosting Ideas',
      description: 'Create optimized Facebook Ad plans with audience targeting, captions, budget recommendations, and A/B testing strategies.',
      icon: <Rocket size={32} className="text-blue-500" />,
      path: '/ai/boosting',
      color: 'from-blue-500/20 to-cyan-500/20',
      border: 'group-hover:border-blue-500/50'
    },
    {
      id: 'spy',
      title: "AI Facebook's Spy",
      description: 'Reverse-engineer any Facebook post to uncover potential ad spend, targeting, and strategy using advanced AI analysis.',
      icon: <Search size={32} className="text-red-500" />,
      path: '/ai/spy',
      color: 'from-red-500/20 to-pink-500/20',
      border: 'group-hover:border-red-500/50'
    }
  ];

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
        <div className="grid md:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <div 
              key={tool.id}
              onClick={() => navigate(tool.path)}
              className={`glass-panel p-8 rounded-3xl relative overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-2 border border-white/5 ${tool.border}`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
              
              <div className="relative z-10">
                <div className="mb-6 bg-black/40 w-fit p-4 rounded-2xl border border-white/10 shadow-lg">
                  {tool.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{tool.title}</h3>
                <p className="text-zinc-400 leading-relaxed mb-6 min-h-[80px]">
                  {tool.description}
                </p>
                
                <div className="flex items-center gap-2 font-bold text-sm">
                   {user ? (
                     <span className="text-white flex items-center gap-2 group-hover:gap-3 transition-all">
                       Launch Tool <span className="text-lg">→</span>
                     </span>
                   ) : (
                     <span className="text-zinc-500 flex items-center gap-2">
                       <Lock size={14} /> Login Required
                     </span>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {!user && (
           <div className="mt-12 text-center">
              <button 
                onClick={() => navigate('/signin')}
                className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors shadow-lg"
              >
                Sign In to Access Tools
              </button>
           </div>
        )}
      </Section>
    </div>
  );
};

export default AiHub;
