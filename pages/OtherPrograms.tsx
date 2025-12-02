import React, { useEffect, useState } from 'react';
import { useLang } from '../App';
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
    navigate('/contact', { state: { selectedProgram: prog } });
  };

  return (
    <div>
      <Section className="pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t.other.title}</h1>
          <p className="text-zinc-500 mb-8">{t.other.note}</p>
        </div>

        {/* Banner Carousel */}
        {!loading && programs.some(p => p.image_url) && (
          <div className="px-4">
             <BannerCarousel items={programs.filter(p => p.image_url).map(p => ({
                id: p.id,
                image_url: p.image_url!,
                title: p.title
              }))} />
          </div>
        )}
      </Section>

      {loading ? (
        <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-zinc-400" size={32} />
        </div>
      ) : (
        <Section className="pt-0">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {programs.map((prog, idx) => {
               // Determine which trainers to show
               let displayTrainers: DbTrainer[] = [];
               
               if (prog.other_program_trainers && prog.other_program_trainers.length > 0) {
                 displayTrainers = prog.other_program_trainers.map((item: any) => item.trainers).filter(Boolean);
               } else {
                 // Fallback: show first 5 of all trainers
                 displayTrainers = allTrainers.slice(0, 5);
               }

               const trainerCountDisplay = displayTrainers.length > 0 
                    ? `${displayTrainers.length} Trainers` 
                    : (prog.trainers_count || 'Trainers TBA');

               return (
                  <div key={prog.id} className={`border border-zinc-200 rounded-2xl p-8 hover:shadow-lg transition-all flex flex-col ${idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}`}>
                    <div className="mb-6">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${idx % 2 === 0 ? 'bg-zinc-900 text-white' : 'bg-red-600 text-white'}`}>
                          {idx % 2 === 0 ? <Zap size={24} /> : <Star size={24} />}
                      </div>
                      <h2 className="text-2xl font-bold mb-2">{prog.title}</h2>
                      <div className="text-sm font-bold text-zinc-500 mb-2">{trainerCountDisplay} • {prog.price}</div>
                      
                      {prog.video_url && <VideoPlayer url={prog.video_url} />}
                      
                      <p className="text-zinc-600 leading-relaxed mt-4 mb-6">{prog.description}</p>
                      
                      {/* Meet The Trainers Section */}
                      <div className="mb-6">
                         <h4 className="font-bold text-sm text-zinc-900 mb-3 border-b border-zinc-200 pb-2">Meet The Trainers</h4>
                         {displayTrainers.length > 0 ? (
                           <div className="flex flex-wrap gap-3">
                               {displayTrainers.map((tr, i) => (
                                  <div key={i} className="text-center">
                                      <div className="w-12 h-12 rounded-full mx-auto mb-1 overflow-hidden border border-zinc-200">
                                          <img 
                                              src={tr.image_url} 
                                              alt={tr.name} 
                                              className="w-full h-full object-cover" 
                                          />
                                      </div>
                                      <p className="text-[10px] font-bold text-zinc-600">{tr.name}</p>
                                  </div>
                               ))}
                           </div>
                         ) : (
                           <p className="text-sm text-zinc-400 italic">Trainers to be announced.</p>
                         )}
                      </div>

                    </div>
                    <div className="mt-auto">
                      <button 
                          onClick={() => handleInterest(prog.title)}
                          className={`w-full py-3 rounded-lg font-bold transition-colors ${idx % 2 === 0 ? 'border border-black hover:bg-black hover:text-white' : 'bg-black text-white hover:bg-zinc-800'}`}
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