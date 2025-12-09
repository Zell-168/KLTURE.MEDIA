
import React, { useState } from 'react';
import { useAuth } from '../../App';
import Section from '../../components/ui/Section';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search, ArrowLeft, Target, Eye, DollarSign, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { GoogleGenAI } from "@google/genai";

const AiSpy: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  React.useEffect(() => {
     if (!user) navigate('/signin');
  }, [user, navigate]);

  const handleAnalyze = async () => {
    if (!content.trim()) {
        alert('Please paste the ad copy or content text to analyze.');
        return;
    }

    setLoading(true);
    setResult(null);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Analyze this Facebook ad content.
        URL Context: ${url || 'N/A'}
        Ad Copy / Content: "${content}"

        Act as a senior media buyer. Reverse engineer the strategy.
        Return a JSON object with this EXACT structure:
        {
          "url": "${url || 'Analyzed Content'}",
          "options": [
            {
              "label": "Option A (Cold Audience)",
              "spend": "Estimated range (e.g. $50-100)",
              "days": "Duration (e.g. 5-7 days)",
              "objective": "Campaign Objective",
              "audience": "Targeting details",
              "placements": "Recommended placements",
              "funnel_stage": "Top of Funnel",
              "explanation": "Why this works for cold traffic..."
            },
            {
              "label": "Option B (Warm Audience)",
              "spend": "...",
              "days": "...",
              "objective": "...",
              "audience": "...",
              "placements": "...",
              "funnel_stage": "Middle of Funnel",
              "explanation": "..."
            },
            {
              "label": "Option C (Retargeting)",
              "spend": "...",
              "days": "...",
              "objective": "...",
              "audience": "...",
              "placements": "...",
              "funnel_stage": "Bottom of Funnel",
              "explanation": "..."
            }
          ]
        }`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });

        const generatedData = JSON.parse(response.text || "{}");
        setResult(generatedData);

        // Save History
        if (user?.email) {
            await supabase.from('km_ai_histories').insert([{
                user_email: user.email,
                tool_name: 'SPY',
                input_data: { url, content },
                result_data: generatedData
            }]);
        }

    } catch (err) {
        console.error("Gemini Error:", err);
        alert("Analysis failed. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Section className="max-w-5xl mx-auto">
        <button 
           onClick={() => navigate('/ai')}
           className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
        >
            <ArrowLeft size={20} /> Back to Tools
        </button>

        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-red-500/30 shadow-[0_0_40px_rgba(220,38,38,0.1)]">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-3">
                    <Search className="text-red-500" size={32} />
                    AI Facebook Detective
                </h1>
                <p className="text-zinc-400">Reverse-engineer any ad strategy using Gemini AI.</p>
            </div>

            <div className="flex flex-col gap-4 mb-8">
                {/* Inputs */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-zinc-400 mb-2">1. Ad URL (Optional)</label>
                        <input 
                            type="url" 
                            placeholder="Paste Facebook Post URL..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-red-500 transition-colors"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-zinc-400 mb-2">2. Ad Copy / Content (Required)</label>
                        <textarea 
                            rows={4}
                            placeholder="Paste the caption or describe the video/image content here so the AI can analyze it..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-red-500 transition-colors"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                </div>

                <button 
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 mt-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Eye size={20} />}
                    {loading ? 'Analyzing Strategy...' : 'Analyze Post'}
                </button>
            </div>

            {loading && (
                <div className="text-center py-12">
                    <Loader2 className="animate-spin text-red-500 mx-auto mb-4" size={40} />
                    <p className="text-zinc-400 animate-pulse">Gemini is deconstructing the ad strategy...</p>
                </div>
            )}

            {result && result.options && (
                <div className="mt-8 animate-fade-in">
                    <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10 text-zinc-400 text-sm break-all">
                        Analysis for: <span className="text-white">{result.url}</span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {result.options.map((opt: any, idx: number) => (
                            <div key={idx} className="bg-black/40 border border-white/10 rounded-2xl p-6 hover:border-red-500/50 transition-colors flex flex-col">
                                <h3 className="text-lg font-bold text-white mb-2 pb-2 border-b border-white/10">{opt.label}</h3>
                                
                                <div className="space-y-4 flex-grow">
                                    <div>
                                        <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Objective</p>
                                        <p className="text-red-400 font-medium">{opt.objective}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Target Audience</p>
                                        <p className="text-zinc-300 text-sm">{opt.audience}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Est. Spend</p>
                                            <p className="text-white font-bold">{opt.spend}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Duration</p>
                                            <p className="text-white font-bold">{opt.days}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-lg mt-2">
                                        <p className="text-xs text-zinc-400 italic">"{opt.explanation}"</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </Section>
    </div>
  );
};

export default AiSpy;
