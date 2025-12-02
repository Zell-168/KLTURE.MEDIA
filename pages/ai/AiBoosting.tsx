
import React, { useState } from 'react';
import { useAuth } from '../../App';
import Section from '../../components/ui/Section';
import { useNavigate } from 'react-router-dom';
import { Loader2, Rocket, ArrowLeft, CheckCircle2, LayoutTemplate } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AiBoosting: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    business: '',
    postType: 'image',
    caption: '',
    budget: '',
    days: '',
    abTesting: false,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  React.useEffect(() => {
     if (!user) navigate('/signin');
  }, [user, navigate]);

  const handleGenerate = () => {
     if (!formData.business || !formData.budget || !formData.days) {
         alert('Please fill in required fields (Business, Budget, Days)');
         return;
     }
     
     setLoading(true);
     
     // Simulation
     setTimeout(async () => {
        const dailyBudget = (parseFloat(formData.budget) / parseInt(formData.days)).toFixed(2);
        const generatedResult = {
            dailyBudget,
            objective: formData.postType === 'video' ? 'Video Views / Engagement' : 'Engagement / Messages',
            audience: `Location: Cambodia (Phnom Penh priority)\nAge: 18-40\nInterests: ${formData.business}, Shopping, Lifestyle`,
            placements: 'Facebook Feed, Instagram Feed, Reels (Automatic Placements)',
            captionAnalysis: formData.caption.length > 50 
                ? 'Your caption length is good. Ensure you have a clear Call To Action (CTA).' 
                : 'Your caption is short. Consider adding more value proposition and a strong CTA.',
            variants: formData.abTesting ? [
                { name: 'Variant A', desc: 'Focus on "Benefit" (Save time/money)' },
                { name: 'Variant B', desc: 'Focus on "Fear of Missing Out" (Limited Offer)' }
            ] : []
        };

        setResult(generatedResult);
        setLoading(false);

        // Save History
        if (user?.email) {
            await supabase.from('km_ai_histories').insert([{
                user_email: user.email,
                tool_name: 'BOOSTING',
                input_data: formData,
                result_data: generatedResult
            }]);
        }
     }, 2000);
  };

  return (
    <div className="min-h-screen">
      <Section className="max-w-4xl mx-auto">
        <button 
           onClick={() => navigate('/ai')}
           className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
        >
            <ArrowLeft size={20} /> Back to Tools
        </button>

        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-blue-900/30 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
             <div className="text-center mb-10">
                <h1 className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-3">
                    <Rocket className="text-blue-500" size={32} />
                    Facebook Ads Planner
                </h1>
                <p className="text-zinc-400">Optimize your boosting strategy with AI-driven recommendations.</p>
                <a href="https://www.overread.asia/categories/1216w8p83d895i1" target="_blank" rel="noreferrer" className="inline-block mt-4 text-xs bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full border border-blue-500/20 hover:bg-blue-900/50 transition-colors">
                    Ad: Buy ChatGPT Money-Making Guide ($3)
                </a>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-2">Business Type</label>
                        <input 
                            type="text" 
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="e.g. Coffee Shop, Skincare..."
                            value={formData.business}
                            onChange={(e) => setFormData({...formData, business: e.target.value})}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-2">Post Type</label>
                        <select 
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            value={formData.postType}
                            onChange={(e) => setFormData({...formData, postType: e.target.value})}
                        >
                            <option value="image">Image Post</option>
                            <option value="video">Video Post</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-2">Total Budget ($)</label>
                        <input 
                            type="number" 
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            value={formData.budget}
                            onChange={(e) => setFormData({...formData, budget: e.target.value})}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-2">Duration (Days)</label>
                        <input 
                            type="number" 
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            value={formData.days}
                            onChange={(e) => setFormData({...formData, days: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-2">Draft Caption</label>
                        <textarea 
                            rows={4}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Paste your caption here..."
                            value={formData.caption}
                            onChange={(e) => setFormData({...formData, caption: e.target.value})}
                        />
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                        <input 
                            type="checkbox" 
                            id="abCheck"
                            className="w-5 h-5 accent-blue-500 rounded"
                            checked={formData.abTesting}
                            onChange={(e) => setFormData({...formData, abTesting: e.target.checked})}
                        />
                        <label htmlFor="abCheck" className="text-zinc-300 font-medium cursor-pointer">Generate A/B Testing Ideas</label>
                    </div>
                    
                    <button 
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <LayoutTemplate size={20} />}
                        {loading ? 'Planning...' : 'Generate Plan'}
                    </button>
                </div>
            </div>

            {result && (
                <div className="mt-12 space-y-6 animate-fade-in border-t border-white/10 pt-8">
                    {/* Summary Card */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/5">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <CheckCircle2 className="text-green-400" size={24} /> Strategy Summary
                        </h3>
                        <div className="grid sm:grid-cols-3 gap-4 text-sm">
                            <div className="bg-black/40 p-3 rounded-lg">
                                <span className="block text-zinc-500 text-xs uppercase mb-1">Recommended Daily</span>
                                <span className="text-white font-bold text-lg">${result.dailyBudget} / day</span>
                            </div>
                             <div className="bg-black/40 p-3 rounded-lg">
                                <span className="block text-zinc-500 text-xs uppercase mb-1">Objective</span>
                                <span className="text-white font-bold">{result.objective}</span>
                            </div>
                             <div className="bg-black/40 p-3 rounded-lg">
                                <span className="block text-zinc-500 text-xs uppercase mb-1">Placements</span>
                                <span className="text-white font-bold">{result.placements}</span>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Cards */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="glass-panel p-6 rounded-2xl border border-white/5">
                            <h4 className="font-bold text-blue-400 mb-3">Targeting & Audience</h4>
                            <p className="text-zinc-300 whitespace-pre-line">{result.audience}</p>
                        </div>
                         <div className="glass-panel p-6 rounded-2xl border border-white/5">
                            <h4 className="font-bold text-blue-400 mb-3">Content Analysis</h4>
                            <p className="text-zinc-300">{result.captionAnalysis}</p>
                        </div>
                    </div>

                    {result.variants.length > 0 && (
                        <div className="glass-panel p-6 rounded-2xl border border-white/5">
                             <h4 className="font-bold text-yellow-400 mb-4">A/B Testing Variants</h4>
                             <div className="space-y-4">
                                {result.variants.map((v: any, i: number) => (
                                    <div key={i} className="bg-black/40 p-4 rounded-xl">
                                        <span className="font-bold text-white block mb-1">{v.name}</span>
                                        <span className="text-zinc-400 text-sm">{v.desc}</span>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}
                </div>
            )}
        </div>
      </Section>
    </div>
  );
};

export default AiBoosting;
