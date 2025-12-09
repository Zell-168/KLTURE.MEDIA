
import React, { useEffect, useState } from 'react';
import { useLang, useAuth } from '../App';
import Section from '../components/ui/Section';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Loader2, Wallet } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DbOnlineCourse, DbTrainer } from '../types';
import { TRAINERS } from '../constants';
import VideoPlayer from '../components/ui/VideoPlayer';
import BannerCarousel from '../components/ui/BannerCarousel';

const OnlineCourses: React.FC = () => {
  const { t } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<DbOnlineCourse[]>([]);
  const [allTrainers, setAllTrainers] = useState<DbTrainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('courses_online')
          .select(`
            *,
            online_course_trainers (
              trainers ( * )
            )
          `)
          .order('id', { ascending: true });
        
        if (error) throw error;
        if (data) setCourses(data);

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
        const { data: simpleData } = await supabase.from('courses_online').select('*');
        if (simpleData) setCourses(simpleData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEnroll = (courseName: string) => {
    if (user) {
        navigate('/contact', { state: { selectedProgram: `Online: ${courseName}` } });
    } else {
        navigate('/signup', { state: { returnTo: '/contact', selectedProgram: `Online: ${courseName}` } });
    }
  };

  return (
    <div>
        <Section className="pb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-md">{t.online.title}</h1>
            <p className="text-zinc-400 max-w-2xl mx-auto mb-8">{t.online.note}</p>

             {/* Banner Carousel */}
            {!loading && courses.some(c => c.image_url) && (
              <div className="glass-panel p-2 rounded-2xl max-w-5xl mx-auto">
                 <div className="rounded-xl overflow-hidden">
                    <BannerCarousel items={courses.filter(c => c.image_url).map(c => ({
                    id: c.id,
                    image_url: c.image_url!,
                    title: c.title
                    }))} />
                 </div>
              </div>
            )}
        </Section>

        {/* Bundle Banner */}
        <Section className="py-0">
            <div className="bg-gradient-to-r from-red-900/80 to-red-600/80 rounded-3xl p-8 md:p-12 text-white text-center shadow-[0_0_30px_rgba(220,38,38,0.3)] transform hover:scale-[1.01] transition-transform cursor-pointer backdrop-blur-md border border-red-500/30" onClick={() => handleEnroll('All 3 Courses Bundle')}>
                <h2 className="text-3xl font-black mb-2 drop-shadow-lg">{t.online.bundleTitle}</h2>
                <p className="text-xl md:text-2xl opacity-90 mb-6 font-light">{t.online.bundleDesc}</p>
                <div className="inline-flex items-center gap-2 bg-white text-red-700 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wide shadow-xl hover:bg-zinc-100 transition-colors">
                    <Wallet size={16} />
                    <span>Buy Bundle</span>
                </div>
            </div>
        </Section>

        <Section>
            {loading ? (
                <div className="flex justify-center py-12">
                   <Loader2 className="animate-spin text-zinc-400" size={32} />
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div key={course.id} className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-2">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 bg-black/40 border border-white/10 rounded-full flex items-center justify-center text-white">
                                    <PlayCircle size={20} />
                                </div>
                                <span className="font-bold text-lg text-green-400">{course.price}</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-white">{course.title}</h3>
                            
                            {course.video_url && (
                                <div className="rounded-lg overflow-hidden border border-white/5 shadow-md">
                                    <VideoPlayer url={course.video_url} />
                                </div>
                            )}

                            <p className="text-zinc-400 text-sm mb-6 flex-grow mt-4">{course.description}</p>
                            
                            {/* Meet The Trainers Section */}
                            <div className="mb-6 border-t border-white/10 pt-4">
                                <p className="text-xs font-bold text-zinc-500 mb-3 uppercase">Meet The Trainers</p>
                                <div className="flex flex-wrap gap-2">
                                    {course.online_course_trainers && course.online_course_trainers.length > 0 ? (
                                        <>
                                            {course.online_course_trainers.map((item: any, i) => (
                                                <div key={i} title={item.trainers?.name} className="relative group">
                                                    <img 
                                                        src={item.trainers?.image_url} 
                                                        alt={item.trainers?.name} 
                                                        className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover:border-red-500 transition-all"
                                                    />
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            {allTrainers.slice(0, 3).map((tr, i) => (
                                                <div key={i} title={tr.name}>
                                                    <img 
                                                        src={tr.image_url} 
                                                        alt={tr.name} 
                                                        className="w-10 h-10 rounded-full object-cover border border-white/10"
                                                    />
                                                </div>
                                            ))}
                                            {allTrainers.length > 3 && (
                                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-zinc-400">
                                                    +{allTrainers.length - 3}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <button 
                                onClick={() => handleEnroll(course.title)}
                                className="w-full py-2.5 bg-white text-black rounded-lg font-bold text-sm hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-lg"
                            >
                                <Wallet size={16} />
                                {t.online.btnEnroll}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </Section>
    </div>
  );
};

export default OnlineCourses;
