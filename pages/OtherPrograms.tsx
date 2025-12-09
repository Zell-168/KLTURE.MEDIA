
import React, { useEffect, useState } from 'react';
import { useLang, useAuth } from '../App';
import Section from '../components/ui/Section';
import { useNavigate } from 'react-router-dom';
import { Star, Zap, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DbOtherProgram, DbTrainer } from '../types';
import { TRAINERS } from '../constants';
import VideoPlayer from '../components/ui/VideoPlayer';
import BannerCarousel from '../components/ui/BannerCarousel';

const OtherPrograms: React.FC = () => {
  const { t } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<DbOtherProgram[]>([]);
  const [allTrainers, setAllTrainers] = useState<DbTrainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Programs with joined trainers
        const { data, error } = await supabase
          .from('programs_other')
          .select(`
            *,
            other_program_trainers (
              trainers ( * )
            )
          `)
          .order('id', { ascending: true });
        
        if (error) throw error;
        if (data) setPrograms(data);

        // Fetch All Trainers for fallback
        const { data: trainerData } = await supabase.from('trainers').select('*');
        if (trainerData && trainerData.length > 0) {
            setAllTrainers(trainerData);
        } else {
            const staticFallback: DbTrainer[] = TRAINERS.map((t, i) => ({
                id: i,
                name: t.name,
                role: t.role,
                image_url: t.image,
                description: "Expert Trainer",
                created_at: new Date().toISOString()
            }));
            setAllTrainers(staticFallback);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        // Fallback fetch if JOIN fails
        const { data: simpleData } = await supabase.from('programs_other').select('*');
        if (simpleData) setPrograms(simpleData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInterest = (prog: string) => {
    if (user) {
        navigate('/contact', { state: { selectedProgram: prog } });
    } else {
        navigate('/signup', { state: { returnTo: '/contact', selectedProgram: prog } });
    }
  };

  return (
    <div>
      <Section className="pb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-md">{t.other.title}</h1>
        <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">{t.other.note}</p>

        {/* Banner Carousel */}
        {!loading && programs.some(p => p.image_url) && (
          <div className="glass-panel p-2 rounded-2xl">
            <div className="rounded-xl overflow-hidden">
                <BannerCarousel items={programs.filter(p => p.image_url).map(p => ({
                    id: p.id,
                    image_url: p.image_url!,
                    title: p.title
                }))} />
            </div>
          </div>
        )}
      </Section>

      {loading ? (
        <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-zinc-400" size={32} />
        </div>
      ) : (
        <Section className="pt-0">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {programs.map((prog, idx) => {
               // Determine which trainers to show
               let displayTrainers: DbTrainer[] = [];
               
               if (prog.other_program_trainers && prog.other_program_trainers.length > 0) {
                 displayTrainers = prog.other_program_trainers.map((item: any) => item.trainers).filter(Boolean);
               } else {
                 displayTrainers = allTrainers.slice(0, 5);
               }

               const trainerCountDisplay = displayTrainers.length > 0 
                    ? `${displayTrainers.length} Trainers` 
                    : (prog.trainers_count || 'Trainers TBA');

               return (
                  <div key={prog.id} className="glass-panel glass-panel-hover rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1">
                    <div className="mb-6">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 border border-white/10 ${idx % 2 === 0 ? 'bg-white/10 text-white' : 'bg-red-600/20 text-red-500'}`}>
                          {idx % 2 === 0 ? <Zap size={28} /> : <Star size={28} />}
                      </div>
                      <h2 className="text-2xl font-bold mb-2 text-white">{prog.title}</h2>
                      <div className="text-sm font-bold text-zinc-400 mb-4">{trainerCountDisplay} • {prog.price}</div>
                      
                      {prog.video_url && (
                          <div className="mb-6 rounded-lg overflow-hidden border border-white/10 shadow-lg">
                            <VideoPlayer url={prog.video_url} />
                          </div>
                      )}
                      
                      <p className="text-zinc-300 leading-relaxed mt-4 mb-6">{prog.description}</p>
                      
                      {/* Meet The Trainers Section */}
                      <div className="mb-6">
                         <h4 className="font-bold text-sm text-zinc-200 mb-3 border-b border-white/10 pb-2">Meet The Trainers</h4>
                         {displayTrainers.length > 0 ? (
                           <div className="flex flex-wrap gap-3">
                               {displayTrainers.map((tr, i) => (
                                  <div key={i} className="text-center group">
                                      <div className="w-12 h-12 rounded-full mx-auto mb-1 overflow-hidden border border-white/10 group-hover:border-red-500 transition-all">
                                          <img 
                                              src={tr.image_url} 
                                              alt={tr.name} 
                                              className="w-full h-full object-cover" 
                                          />
                                      </div>
                                      <p className="text-[10px] font-bold text-zinc-400 group-hover:text-white">{tr.name}</p>
                                  </div>
                               ))}
                           </div>
                         ) : (
                           <p className="text-sm text-zinc-500 italic">Trainers to be announced.</p>
                         )}
                      </div>

                    </div>
                    <div className="mt-auto">
                      <button 
                          onClick={() => handleInterest(prog.title)}
                          className="w-full py-3 rounded-xl font-bold transition-all bg-white text-black hover:bg-zinc-200 shadow-lg"
                      >
                          {t.other.interest}
                      </button>
                    </div>
                  </div>
               );
            })}
          </div>
        </Section>
      )}
    </div>
  );
};

export default OtherPrograms;
