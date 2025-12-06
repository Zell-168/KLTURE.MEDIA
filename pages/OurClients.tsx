
import React, { useEffect, useState } from 'react';
import { useLang } from '../App';
import Section from '../components/ui/Section';
import { supabase } from '../lib/supabase';
import { DbClient } from '../types';
import { Loader2, Briefcase, Play, Filter, Image as ImageIcon } from 'lucide-react';

const OurClients: React.FC = () => {
  const { t } = useLang();
  const [clients, setClients] = useState<DbClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('km_clients')
          .select('*, project_manager:trainers(*)')
          .eq('is_active', true)
          .order('category', { ascending: true })
          .order('display_order', { ascending: true });

        if (error) throw error;
        setClients(data || []);
      } catch (err) {
        console.error('Error fetching clients:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  // Handle TikTok Embed Script Reloading
  useEffect(() => {
    if (!loading && clients.length > 0) {
      // Small timeout to allow DOM to populate with blockquotes
      const timer = setTimeout(() => {
         // Clean up old scripts to force reload
         const existingScripts = document.querySelectorAll('script[src*="tiktok.com/embed.js"]');
         existingScripts.forEach(s => s.remove());

         // Inject new script to parse the embeds
         const script = document.createElement('script');
         script.src = 'https://www.tiktok.com/embed.js';
         script.async = true;
         document.body.appendChild(script);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [loading, clients, activeCategory]);

  // Extract Categories
  const categories = ['All', ...Array.from(new Set(clients.map(c => c.category).filter(Boolean)))];

  // Filter Clients
  const filteredClients = activeCategory === 'All' 
    ? clients 
    : clients.filter(c => c.category === activeCategory);

  return (
    <div className="min-h-screen">
      <Section className="pb-8 text-center">
        <h1 className="text-3xl md:text-5xl font-black mb-4 flex items-center justify-center gap-3 text-white drop-shadow-md">
           <Briefcase size={40} className="text-red-600" />
           {t.nav.clients}
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg mb-8">
           Showcasing the personal brands we've helped build and grow on TikTok.
        </p>

        {/* Category Filter */}
        {!loading && categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-3 animate-fade-in">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-300 ${
                            activeCategory === cat 
                            ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105' 
                            : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/30'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        )}
      </Section>

      <Section className="pt-0">
        {loading ? (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-zinc-500" size={40} />
            </div>
        ) : filteredClients.length === 0 ? (
            <div className="text-center py-20 text-zinc-500 bg-white/5 rounded-3xl border border-white/5">
                <div className="flex justify-center mb-4 opacity-50"><Filter size={40} /></div>
                <p className="text-lg">No clients found in this category.</p>
                <button 
                    onClick={() => setActiveCategory('All')}
                    className="mt-4 text-red-500 font-bold hover:underline"
                >
                    Clear Filter
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {filteredClients.map(client => (
                    <div key={client.id} className="glass-panel rounded-2xl overflow-hidden flex flex-col group hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(220,38,38,0.2)]">
                        
                        {/* 1. MEDIA SECTION: Embed or Image */}
                        <div className="relative w-full bg-black min-h-[300px] flex items-center justify-center">
                            {client.tiktok_embed_html ? (
                                <div className="w-full flex justify-center bg-black p-1">
                                    {/* Wrapper for embed */}
                                    <div 
                                        className="w-full [&_blockquote]:m-0 [&_blockquote]:w-full [&_blockquote]:min-w-[unset] flex justify-center"
                                        dangerouslySetInnerHTML={{ __html: client.tiktok_embed_html }} 
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full min-h-[400px] relative">
                                    {client.image_url ? (
                                         <img 
                                            src={client.image_url} 
                                            alt={client.client_name}
                                            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                                            <ImageIcon className="text-zinc-700" size={48} />
                                        </div>
                                    )}
                                    {/* Overlay Gradient for non-embeds */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80 pointer-events-none"></div>
                                </div>
                            )}
                            
                             {/* Category Tag (Absolute positioning might interfere with embed interaction, so mostly keep it out of way or for image fallback) */}
                            {client.category && !client.tiktok_embed_html && (
                                <div className="absolute top-4 right-4 pointer-events-none">
                                     <span className="inline-block px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                                        {client.category}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* 2. CLIENT INFO SECTION */}
                        <div className="p-6 flex flex-col flex-grow bg-zinc-950 relative border-t border-white/5">
                            {/* Category Tag for Embed View (Since we can't easily overlay on iframe) */}
                            {client.category && client.tiktok_embed_html && (
                                <div className="mb-3">
                                     <span className="inline-block px-2 py-1 bg-white/10 border border-white/10 rounded text-[10px] font-bold text-zinc-300 uppercase tracking-wider">
                                        {client.category}
                                    </span>
                                </div>
                            )}

                            {/* Client Name */}
                            <h3 className="text-2xl font-black text-white mb-6 drop-shadow-md leading-tight">{client.client_name}</h3>
                            
                            {/* Project Manager Profile */}
                            {client.project_manager && (
                                <div className="mt-auto pt-4 border-t border-white/10 flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shrink-0">
                                        <img 
                                            src={client.project_manager.image_url} 
                                            alt={client.project_manager.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">Managed By</p>
                                        <p className="text-sm font-bold text-zinc-200">{client.project_manager.name}</p>
                                    </div>
                                </div>
                            )}

                            {/* Visit Button */}
                            <a 
                                href={client.tiktok_url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="mt-auto flex items-center justify-center gap-2 w-full py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/30 hover:border-red-600 font-bold rounded-xl transition-all shadow-lg text-sm group-hover:shadow-red-900/20"
                            >
                                <Play size={16} fill="currentColor" /> Visit TikTok Profile
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </Section>
    </div>
  );
};

export default OurClients;
