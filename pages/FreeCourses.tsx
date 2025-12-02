
import React, { useEffect, useState } from 'react';
import { useLang, useAuth } from '../App';
import Section from '../components/ui/Section';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Loader2, CheckCircle, Video } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DbFreeCourse } from '../types';

const FreeCourses: React.FC = () => {
  const { t } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<DbFreeCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('courses_free')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCourses(data || []);
      } catch (err) {
        console.error('Error fetching free courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = async (course: DbFreeCourse) => {
    if (!user) {
      navigate('/signin');
      return;
    }

    setEnrollingId(course.id);

    try {
      // 1. Check if already enrolled
      const { data: existing } = await supabase
        .from('registrations')
        .select('id')
        .eq('email', user.email)
        .eq('program', course.title) // Use title as program identifier
        .maybeSingle();

      if (existing) {
        // Already enrolled, go to profile
        navigate('/profile');
        return;
      }

      // 2. Enroll
      const { error } = await supabase.from('registrations').insert([
        {
          full_name: user.full_name,
          email: user.email,
          phone_number: user.phone_number,
          program: course.title, // Tracking by title
          preferred_date: 'Free Course - Immediate Access',
          message: 'Enrolled via Free Courses page',
        },
      ]);

      if (error) throw error;

      // Success
      navigate('/profile');
    } catch (err) {
      console.error('Enrollment error:', err);
      alert('Failed to enroll. Please try again.');
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Section className="pb-8 text-center">
        <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
          <Video size={32} />
        </div>
        <h1 className="text-3xl md:text-5xl font-black mb-4 text-white drop-shadow-md">{t.free.title}</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg mb-8">{t.free.subtitle}</p>
      </Section>

      <Section>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-zinc-500" size={32} />
          </div>
        ) : courses.length === 0 ? (
           <div className="text-center text-zinc-500 py-12">No free courses available at the moment.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="glass-panel glass-panel-hover rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group hover:-translate-y-2"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-black/40 relative overflow-hidden">
                  {course.image_url ? (
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                      <PlayCircle size={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                         <PlayCircle size={32} />
                      </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-2">
                     <span className="bg-blue-900/30 text-blue-400 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide border border-blue-500/30 backdrop-blur-sm">Free</span>
                     {course.trainer_name && <span className="text-xs text-zinc-500 font-medium">By {course.trainer_name}</span>}
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2 line-clamp-2 text-white">{course.title}</h3>
                  <p className="text-zinc-400 text-sm mb-6 flex-grow line-clamp-3">
                    {course.description || 'No description available.'}
                  </p>

                  {user ? (
                    <button
                      onClick={() => handleEnroll(course)}
                      disabled={enrollingId === course.id}
                      className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 backdrop-blur-md"
                    >
                      {enrollingId === course.id ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <>
                          <CheckCircle size={18} /> {t.free.enrollBtn}
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/signin')}
                      className="w-full py-3 bg-white/5 border border-white/10 text-zinc-400 rounded-xl font-bold hover:bg-white/10 transition-colors"
                    >
                      {t.free.loginToEnroll}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
};

export default FreeCourses;
