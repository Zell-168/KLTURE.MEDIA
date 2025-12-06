
import React, { useEffect, useState } from 'react';
import { useLang } from '../App';
import Section from '../components/ui/Section';
import { supabase } from '../lib/supabase';
import { DbClient } from '../types';
import { Loader2, Briefcase, ExternalLink, Play, Filter } from 'lucide-react';
import VideoPlayer from '../components/ui/VideoPlayer';

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
          .select('*')
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                {filteredClients.map(client => (
                    <div key={client.id} className="glass-panel rounded-2xl overflow-hidden flex flex-col group hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(220,38,38,0.2)]">
                        {/* Vertical Video Container (9:16 Aspect Ratio) */}
                        <div className="relative w-full pt-[177.77%] bg-black">
                            <div className="absolute inset-0">
                                {client.video_url ? (
                                   // Using VideoPlayer but forcing height to fill container
                                   <div className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_div]:h-full">
                                       <VideoPlayer url={client.video_url} className="w-full h-full !pt-0 !rounded-none" />
                                   </div>
                                ) : (
                                    // Fallback Image
                                    <img 
                                        src={client.image_url || 'https://via.placeholder.com/450x800?text=No+Preview'} 
                                        alt={client.client_name}
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                                    />
                                )}
                            </div>
                            
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 pointer-events-none"></div>

                            {/* Client Info Overlay */}
                            <div className="absolute bottom-0 left-0 w-full p-6 z-10 pointer-events-none">
                                {client.category && (
                                    <span className="inline-block px-2 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded text-xs font-bold text-zinc-300 mb-2">
                                        {client.category}
                                    </span>
                                )}
                                <h3 className="text-xl font-bold text-white mb-3 drop-shadow-md">{client.client_name}</h3>
                                
                                <a 
                                    href={client.tiktok_url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-red-600/90 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg backdrop-blur-sm pointer-events-auto"
                                >
                                    <Play size={16} fill="currentColor" /> Visit TikTok
                                </a>
                            </div>
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
