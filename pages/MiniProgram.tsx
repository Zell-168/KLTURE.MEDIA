
import React, { useEffect, useState } from 'react';
import { useLang } from '../App';
import Section from '../components/ui/Section';
import { TRAINERS } from '../constants';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Loader2, Wallet } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DbMiniProgram, DbTrainer } from '../types';
import VideoPlayer from '../components/ui/VideoPlayer';
import BannerCarousel from '../components/ui/BannerCarousel';

const MiniProgram: React.FC = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<DbMiniProgram[]>([]);
  const [allTrainers, setAllTrainers] = useState<DbTrainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Programs with Assigned Trainers joined
        const { data: progData, error: progError } = await supabase
          .from('programs_mini')
          .select(`
            *,
            mini_program_trainers (
              trainers ( * )
            )
          `)
          .order('id', { ascending: true });
        
        if (progError) throw progError;
        if (progData) setPrograms(progData);

        // Fetch All Trainers (as fallback or for general use)
        const { data: trainerData } = await supabase
          .from('trainers')
          .select('*');
        
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
        const { data: simpleProgData } = await supabase.from('programs_mini').select('*');
        if (simpleProgData) setPrograms(simpleProgData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRegister = (program: string) => {
    navigate('/contact', { state: { selectedProgram: program } });
  };

  return (
    <div>
      <Section className="text-center pb-8">
        <h1 className="text-3xl md:text-5xl font-black mb-6 text-white drop-shadow-md">{t.mini.pageTitle}</h1>
        <p className="text-lg text-zinc-300 max-w-2xl mx-auto mb-8">{t.mini.intro}</p>
        
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
        <Section>
            <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-zinc-400" size={32} />
            </div>
        </Section>
      ) : (
        programs.map((prog, idx) => {
            // Updated to Glass Style for all cards
            const containerClass = "glass-panel rounded-3xl overflow-hidden shadow-2xl relative";
            const subTextColor = "text-red-500";
            const priceTagClass = "mt-4 md:mt-0 bg-white/10 border border-white/10 text-white px-6 py-2 rounded-full font-bold backdrop-blur-md";
            const checkColor = "text-green-400";
            const listItemColor = "text-zinc-300";
            const btnClass = "w-full bg-red-600/90 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 backdrop-blur-sm";
            
            // Determine Trainers to Show
            let currentTrainers: DbTrainer[] = [];
            
            if (prog.mini_program_trainers && prog.mini_program_trainers.length > 0) {
              currentTrainers = prog.mini_program_trainers.map((item: any) => item.trainers).filter(Boolean);
            } else {
              if (allTrainers.length > 0) {
                 if (idx === 0) currentTrainers = allTrainers.slice(0, 3);
                 else currentTrainers = allTrainers.slice(1, 4);
              }
            }

            return (
                <Section key={prog.id} id={`program-${prog.id}`} className={idx !== 0 ? "pt-0" : ""}>
                    <div className={containerClass}>
                        {/* Decorative Gradient */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="p-8 md:p-12 relative z-10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                                <div>
                                    <span className={`${subTextColor} font-bold tracking-wider text-sm uppercase drop-shadow-sm`}>{prog.subtitle}</span>
                                    <h2 className="text-3xl font-bold mt-2 text-white">{prog.title}</h2>
                                </div>
                                <div className={priceTagClass}>
                                    {prog.price}
                                </div>
                            </div>

                            {/* Video Preview */}
                            {prog.video_url && (
                                <div className="mb-8 rounded-xl overflow-hidden shadow-lg border border-white/5">
                                    <VideoPlayer url={prog.video_url} />
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-12">
                                <div>
                                    <h3 className="font-bold text-lg mb-4 border-b border-white/10 pb-2 text-white">{t.mini.learnTitle}</h3>
                                    <ul className="space-y-3">
                                        {prog.learn_list?.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <Check className={`${checkColor} shrink-0 mt-1`} size={18} />
                                                <span className={listItemColor}>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    {/* Meet The Trainers Section */}
                                    <h3 className="font-bold text-lg mb-4 border-b border-white/10 pb-2 text-white">{t.mini.trainerSectionTitle}</h3>
                                    {currentTrainers.length > 0 ? (
                                        <div className="flex flex-wrap gap-4 mb-8">
                                            {currentTrainers.map((tr, i) => (
                                                <div key={i} className="text-center group">
                                                    <div className="w-16 h-16 rounded-full mx-auto mb-2 overflow-hidden border-2 border-white/10 group-hover:border-red-500 transition-all shadow-lg">
                                                        <img 
                                                            src={tr.image_url} 
                                                            alt={tr.name} 
                                                            className="w-full h-full object-cover" 
                                                        />
                                                    </div>
                                                    <p className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">{tr.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className={`text-sm mb-8 italic ${listItemColor}`}>Trainers to be announced.</p>
                                    )}
                                    
                                    {prog.receive_list && prog.receive_list.length > 0 && (
                                        <>
                                            <h3 className="font-bold text-lg mb-4 border-b border-white/10 pb-2 text-white">{t.mini.receiveTitle}</h3>
                                            <ul className="space-y-3 mb-8">
                                                {prog.receive_list.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <Check className="text-blue-400 shrink-0 mt-1" size={18} />
                                                        <span className={listItemColor}>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}

                                    <button 
                                        onClick={() => handleRegister(prog.title)}
                                        className={btnClass}
                                    >
                                        <Wallet size={20} />
                                        {t.nav.register}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>
            );
        })
      )}

      <Section className="py-8">
        <div className="glass-panel border-l-4 border-yellow-500 p-6 rounded-r-lg bg-yellow-900/10">
            <p className="text-yellow-400 font-medium text-sm md:text-base">
                {t.mini.zellNote}
            </p>
        </div>
      </Section>
    </div>
  );
};

export default MiniProgram;
