
import React, { useState, useEffect } from 'react';
import Section from '../components/ui/Section';
import { supabase } from '../lib/supabase';
import { DbClient } from '../types';
import { Loader2, Briefcase, AlertCircle } from 'lucide-react';

const CATEGORIES = ['All', 'Education', 'Comedy', 'Technology', 'Health', 'Other'];

const OurClients: React.FC = () => {
  const [clients, setClients] = useState<DbClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Load TikTok Embed Script
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up script if needed, though mostly harmless to leave
      try { document.body.removeChild(script); } catch (e) {}
    };
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        // 1. Fetch Clients
        const { data: clientsData, error: clientsError } = await supabase
          .from('km_clients')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (clientsError) throw clientsError;
        
        if (!clientsData || clientsData.length === 0) {
            setClients([]);
            setLoading(false);
            return;
        }

        // 2. Fetch Trainers manually to avoid Foreign Key constraint dependency issues if joins fail
        // Filter out null/undefined IDs
        const trainerIds = [...new Set(clientsData.map(c => c.project_manager_id).filter(Boolean))];
        
        let trainersMap: Record<number, any> = {};
        
        if (trainerIds.length > 0) {
            const { data: trainersData } = await supabase
                .from('trainers')
                .select('id, name, image_url, role')
                .in('id', trainerIds);
            
            if (trainersData) {
                trainersData.forEach(t => {
                    trainersMap[t.id] = t;
                });
            }
        }

        // 3. Merge Data
        const joinedClients = clientsData.map(client => ({
            ...client,
            trainers: trainersMap[client.project_manager_id] || null
        }));

        setClients(joinedClients);
      } catch (err: any) {
        console.error('Error fetching clients:', err);
        
        // Robust Error Message Extraction
        let message = 'An unexpected error occurred.';
        if (err?.message) {
            message = err.message;
        } else if (typeof err === 'string') {
            message = err;
        } else {
             // Try to stringify, but safeguard against circular refs or empty objects
             try {
                const str = JSON.stringify(err);
                if (str !== '{}') message = str;
             } catch (e) {
                message = 'Unknown error object.';
             }
        }

        // Translate specific DB errors to user-friendly messages
        if (message.includes('relation "public.km_clients" does not exist')) {
            message = 'Database setup required: The "km_clients" table is missing.';
        }

        setErrorMsg(message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = selectedCategory === 'All' 
    ? clients 
    : clients.filter(c => c.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <Section className="text-center pb-8">
        <div className="w-16 h-16 bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
          <Briefcase size={32} />
        </div>
        <h1 className="text-3xl md:text-5xl font-black mb-4 text-white drop-shadow-md">Our Clients</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg mb-8">
          Showcasing the influential personal brands we've built across various industries.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                selectedCategory === cat 
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-zinc-500" size={40} />
          </div>
        ) : errorMsg ? (
            <div className="max-w-xl mx-auto p-4 bg-red-900/20 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-200 text-left">
                <AlertCircle className="shrink-0" />
                <div>
                    <p className="font-bold">Unable to load clients</p>
                    <p className="text-xs opacity-70 mt-1">{errorMsg}</p>
                </div>
            </div>
        ) : filteredClients.length === 0 ? (
            <div className="text-center py-12">
                <p className="text-zinc-500 italic text-lg">No clients found in this category yet.</p>
                <p className="text-zinc-600 text-sm mt-2">Check back soon for updates!</p>
            </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center">
            {filteredClients.map((client) => {
              // Extract Video ID safely
              const videoId = client.tiktok_url?.split('/video/')[1]?.split('?')[0];

              return (
              <div key={client.id} className="flex flex-col items-center">
                
                {/* iPhone 17 Frame */}
                <div className="relative w-[300px] h-[600px] bg-black rounded-[45px] border-[12px] border-[#1a1a1a] shadow-2xl overflow-hidden mb-6 ring-1 ring-zinc-800">
                  {/* Dynamic Island */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-8 bg-black z-20 rounded-full flex items-center justify-center">
                    <div className="w-16 h-4 bg-[#0a0a0a] rounded-full"></div>
                  </div>
                  
                  {/* TikTok Embed Container */}
                  <div className="w-full h-full overflow-y-auto bg-black scrollbar-hide">
                    {videoId ? (
                        <blockquote 
                            className="tiktok-embed" 
                            cite={client.tiktok_url} 
                            data-video-id={videoId} 
                            style={{maxWidth: '100%', minWidth: '100%', margin: 0}} 
                        > 
                            <section> 
                                <a target="_blank" href={client.tiktok_url} rel="noreferrer">
                                    {client.client_name}
                                </a> 
                            </section> 
                        </blockquote>
                    ) : (
                        <div className="h-full flex items-center justify-center text-zinc-600 px-4 text-center">
                            Invalid TikTok URL
                        </div>
                    )}
                  </div>
                </div>

                {/* Client Info */}
                <div className="text-center w-full max-w-[300px]">
                    <h3 className="text-xl font-bold text-white mb-1">{client.client_name}</h3>
                    <span className="inline-block px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-zinc-400 mb-4 border border-white/5">
                        {client.category}
                    </span>
                    
                    {/* Project Manager */}
                    {client.trainers && (
                        <div className="glass-panel p-3 rounded-xl flex items-center gap-3 text-left">
                            <img 
                                src={client.trainers.image_url} 
                                alt={client.trainers.name} 
                                className="w-10 h-10 rounded-full object-cover border border-white/10"
                            />
                            <div>
                                <p className="text-xs text-zinc-500 font-bold uppercase">Managed By</p>
                                <p className="text-sm font-bold text-white">{client.trainers.name}</p>
                            </div>
                        </div>
                    )}
                </div>
              </div>
            )})}
          </div>
        )}
      </Section>
    </div>
  );
};

export default OurClients;
