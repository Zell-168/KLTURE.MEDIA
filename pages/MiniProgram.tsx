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
        // Note: This relies on the table `mini_program_trainers` existing and FKs set up.
        // If query fails (table missing), we catch and use fallback.
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
           // Fallback to static if DB is empty
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
        // Fallback fetch if the JOIN query failed (e.g. table doesn't exist yet)
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
      <Section className="bg-zinc-50 text-center pb-8">
        <h1 className="text-3xl md:text-5xl font-black mb-6">{t.mini.pageTitle}</h1>
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto mb-8">{t.mini.intro}</p>
        
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
        <Section>
            <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-zinc-400" size={32} />
            </div>
        </Section>
      ) : (
        programs.map((prog, idx) => {
            // Style logic for alternating cards (White vs Black)
            const isDark = idx % 2 !== 0; 
            const containerClass = isDark 
                ? "bg-zinc-900 text-white rounded-3xl overflow-hidden shadow-xl" 
                : "bg-white rounded-3xl overflow-hidden border border-zinc-200 shadow-xl";
            
            const subTextColor = isDark ? "text-zinc-400" : "text-red-600";
            const priceTagClass = isDark 
                ? "mt-4 md:mt-0 bg-white text-black px-6 py-2 rounded-full font-bold" 
                : "mt-4 md:mt-0 bg-zinc-900 text-white px-6 py-2 rounded-full font-bold";
            
            const checkColor = isDark ? "text-green-400" : "text-green-500";
            const listItemColor = isDark ? "text-zinc-300" : "text-zinc-700";
            const btnClass = isDark
                ? "w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                : "w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 flex items-center justify-center gap-2";
            
            // Determine Trainers to Show
            let currentTrainers: DbTrainer[] = [];
            
            if (prog.mini_program_trainers && prog.mini_program_trainers.length > 0) {
              // 1. Use assigned trainers from DB
              currentTrainers = prog.mini_program_trainers.map((item: any) => item.trainers).filter(Boolean);
            } else {
              // 2. Fallback logic if no assignment in DB
              // Assign based on index for variety if allTrainers exists
              if (allTrainers.length > 0) {
                 if (idx === 0) currentTrainers = allTrainers.slice(0, 3); // First 3
                 else currentTrainers = allTrainers.slice(1, 4); // Offset
              }
            }

            return (
                <Section key={prog.id} id={`program-${prog.id}`} className={idx !== 0 ? "pt-0" : ""}>
                    <div className={containerClass}>
                    <div className="p-8 md:p-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <span className={`${subTextColor} font-bold tracking-wider text-sm uppercase`}>{prog.subtitle}</span>
                            <h2 className="text-3xl font-bold mt-2">{prog.title}</h2>
                        </div>
                        <div className={priceTagClass}>
                            {prog.price}
                        </div>
                        </div>

                        {/* Video Preview */}
                        {prog.video_url && (
                             <div className="mb-8">
                                <VideoPlayer url={prog.video_url} />
                             </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className={`font-bold text-lg mb-4 border-b ${isDark ? 'border-zinc-800' : 'pb-2'}`}>{t.mini.learnTitle}</h3>
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
                            <h3 className={`font-bold text-lg mb-4 border-b ${isDark ? 'border-zinc-800' : 'pb-2'}`}>{t.mini.trainerSectionTitle}</h3>
                            {currentTrainers.length > 0 ? (
                                <div className="flex flex-wrap gap-4 mb-8">
                                    {currentTrainers.map((tr, i) => (
                                        <div key={i} className="text-center group">
                                            <div className="w-16 h-16 rounded-full mx-auto mb-2 overflow-hidden border-2 border-transparent group-hover:border-red-500 transition-all">
                                                <img 
                                                    src={tr.image_url} 
                                                    alt={tr.name} 
                                                    className={`w-full h-full object-cover ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`} 
                                                />
                                            </div>
                                            <p className={`text-xs font-bold ${isDark ? 'text-zinc-300' : ''}`}>{tr.name}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className={`text-sm mb-8 italic ${listItemColor}`}>Trainers to be announced.</p>
                            )}
                            
                            {prog.receive_list && prog.receive_list.length > 0 && (
                                <>
                                    <h3 className={`font-bold text-lg mb-4 border-b ${isDark ? 'border-zinc-800' : 'pb-2'}`}>{t.mini.receiveTitle}</h3>
                                    <ul className="space-y-3 mb-8">
                                        {prog.receive_list.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <Check className="text-blue-500 shrink-0 mt-1" size={18} />
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
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
            <p className="text-yellow-800 font-medium text-sm md:text-base">
                {t.mini.zellNote}
            </p>
        </div>
      </Section>
    </div>
  );
};

export default MiniProgram;