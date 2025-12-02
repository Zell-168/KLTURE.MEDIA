import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import Section from '../components/ui/Section';
import VideoPlayer from '../components/ui/VideoPlayer';
import { supabase } from '../lib/supabase';
import { Loader2, ArrowLeft, AlertCircle, BookOpen, CheckCircle } from 'lucide-react';

interface ClassroomData {
  title: string;
  description: string;
  video_url: string;
  type_label: string;
}

const LearningClassroom: React.FC = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [data, setData] = useState<ClassroomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchCourseContent = async () => {
      setLoading(true);
      setError(null);

      if (!courseId) {
          setError("Course ID missing");
          setLoading(false);
          return;
      }

      try {
        const [type, idStr] = courseId.split('-');
        const id = parseInt(idStr);
        
        if (!type || isNaN(id)) {
            throw new Error("Invalid course link.");
        }

        let tableName = '';
        let typeLabel = '';

        // Determine which table to query based on ID prefix
        switch (type) {
            case 'mini':
                tableName = 'programs_mini';
                typeLabel = 'Mini Program';
                break;
            case 'other':
                tableName = 'programs_other';
                typeLabel = 'Advanced Program';
                break;
            case 'online':
                tableName = 'courses_online';
                typeLabel = 'Online Course';
                break;
            case 'free':
                tableName = 'courses_free';
                typeLabel = 'Free Course';
                break;
            default:
                throw new Error("Unknown course type.");
        }

        const { data: courseData, error: dbError } = await supabase
            .from(tableName)
            .select('title, description, video_url')
            .eq('id', id)
            .single();

        if (dbError || !courseData) {
            throw new Error("Could not find course details.");
        }

        if (!courseData.video_url) {
            throw new Error("This course does not have video content uploaded yet.");
        }

        setData({
            title: courseData.title,
            description: courseData.description,
            video_url: courseData.video_url,
            type_label: typeLabel
        });

      } catch (err: any) {
        console.error("Error loading classroom:", err);
        setError(err.message || "Failed to load course content.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContent();
  }, [courseId, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-4 text-red-600" size={48} />
            <p className="text-zinc-500 font-medium">Loading classroom...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Section className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
             <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
             </div>
             <h2 className="text-2xl font-bold mb-2">Unable to Load Course</h2>
             <p className="text-zinc-500 mb-8">{error}</p>
             <button 
                onClick={() => navigate('/profile')}
                className="bg-black text-white px-6 py-3 rounded-xl font-bold"
             >
                Back to Dashboard
             </button>
        </div>
      </Section>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
       {/* Simple Header */}
       <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
           <div className="flex items-center gap-4">
               <button 
                  onClick={() => navigate('/profile')}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-600 hover:text-black"
                  title="Back to Dashboard"
               >
                  <ArrowLeft size={24} />
               </button>
               <div>
                   <h1 className="font-bold text-lg leading-none text-zinc-900">{data.title}</h1>
                   <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{data.type_label}</span>
               </div>
           </div>
           
           <div className="hidden md:flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
               <CheckCircle size={16} /> Enrolled Student
           </div>
       </header>

       {/* Main Content */}
       <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Video Column */}
                <div className="lg:col-span-2">
                    <VideoPlayer url={data.video_url} className="shadow-2xl" />
                </div>

                {/* Info Column */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm h-full">
                        <div className="flex items-center gap-3 mb-6">
                             <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                                 <BookOpen size={20} />
                             </div>
                             <h2 className="font-bold text-lg">Course Details</h2>
                        </div>
                        
                        <div className="prose prose-sm prose-zinc text-zinc-600">
                            <h3 className="text-black font-bold text-base mb-2">{data.title}</h3>
                            <p className="whitespace-pre-wrap">{data.description || "No description provided."}</p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-zinc-100">
                            <p className="text-xs text-zinc-400 font-medium text-center">
                                Need help? Contact support via Telegram.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
       </div>
    </div>
  );
};

export default LearningClassroom;