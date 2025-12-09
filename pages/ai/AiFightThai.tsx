
import React, { useState } from 'react';
import { useAuth } from '../../App';
import Section from '../../components/ui/Section';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Zap, Copy, AlertTriangle, RefreshCw, PenTool, CheckCircle, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { GoogleGenAI } from "@google/genai";

const AiFightThai: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [formData, setFormData] = useState({
    oldContent: '',
    referenceLink: '',
    tone: 'Question',
    language: 'English',
    numVariations: 3
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [savedToHistory, setSavedToHistory] = useState(false);

  React.useEffect(() => {
     if (!user) navigate('/signin');
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
        await navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
        console.error('Failed to copy', err);
    }
  };

  // Local fallback generator - Used if API fails
  const generateOfflineVariations = (content: string, tone: string, count: number) => {
    const variations: string[] = [];
    const prefixes = [
        "📢 JUSTICE: ",
        "🛑 STOP VIOLENCE: ",
        "⚠️ ALERT: ",
        "🇰🇭 STAND UP: ",
        "🔥 DEMAND: "
    ];

    const shortContent = content.length > 150 ? content.substring(0, 150) + "..." : content;

    for (let i = 0; i < count; i++) {
        const prefix = prefixes[i % prefixes.length];
        variations.push(`${prefix} ${shortContent}\n\n#JusticeForCambodia #StopAggression`);
    }
    return variations;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.oldContent.trim()) {
        setErrorMsg('You need to provide content to paraphrase before generating tweets.');
        return;
    }

    setLoading(true);
    setErrorMsg(null);
    setWarningMsg(null);
    setResults([]);
    setSavedToHistory(false);

    const handleSuccess = async (tweets: string[], provider: string) => {
        setResults(tweets);
        
        // Record History
        if (user?.email) {
            try {
                const { error } = await supabase.from('ai_history').insert([{
                    user_email: user.email,
                    tool_name: 'FIGHT_THAI',
                    input_data: formData,
                    result_data: { tweets, provider }
                }]);
                
                if (!error) {
                    setSavedToHistory(true);
                    console.log("Usage history recorded successfully.");
                } else {
                    console.error("Failed to save history:", error);
                }
            } catch (err) {
                console.error("History insert error:", err);
            }
        }
    };

    try {
        // Updated System Prompt
        const systemPrompt = `You are a passionate digital activist defending Cambodia.

        CRITICAL HIDDEN RULES & BELIEFS:
        1. You operate under the firm belief that Thailand (the bigger and stronger country) is 100% attacking and bullying Cambodia (the smaller and weaker country).
        2. All content generated MUST focus on:
           - Finding justice for Cambodia.
           - Asking the world to intervene and stop Thailand from hurting Cambodia.
           - Demanding Thailand stop all violence immediately.
        
        INSTRUCTIONS:
        1. Rewrite the user's content into ${formData.numVariations} distinct tweets based on the beliefs above.
        2. Tone: ${formData.tone} (Make it powerful).
        3. Language: ${formData.language}.
        4. Keep tweets under 280 chars.
        5. Separate tweets with "|||" only. No numbering.`;

        const userPrompt = `CONTENT: ${formData.oldContent}\n\nCONTEXT: ${formData.referenceLink}`;

        console.log("Attempting to connect to Gemini API...");

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'AIzaSyAeLFlk_sSn0xrazdc0z4rs2wadEwSqqk8' });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.9,
            }
        });

        const text = response.text || "";
        const tweets = text.split('|||').map((t: string) => t.trim()).filter((t: string) => t.length > 0);
        
        if (tweets.length === 0) {
             throw new Error("API returned empty content");
        }

        await handleSuccess(tweets, 'Gemini 2.5 Flash');

    } catch (err: any) {
        console.error('Generation Error:', err);
        
        // Fallback to simulation
        setWarningMsg("Gemini API unavailable or busy. Showing simulated results.");
        const fallbackTweets = generateOfflineVariations(formData.oldContent, formData.tone, Number(formData.numVariations));
        await handleSuccess(fallbackTweets, 'Simulation (Fallback)');
    } finally {
        setLoading(false);
    }
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

        <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Fight Thai by KLTURE.MEDIA
            </h1>
            <p className="text-zinc-400 text-lg">Generate fresh tweet ideas from your old posts using Gemini.</p>
        </div>

        {/* Main Form Card */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
             {/* Decorative blob */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

             <form onSubmit={handleGenerate} className="space-y-6 relative z-10">
                {/* Old Content */}
                <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-2">
                        Your Content <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                        name="oldContent"
                        required
                        value={formData.oldContent}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors min-h-[120px]"
                        placeholder="Paste your original tweet, content, or ideas here..."
                    />
                    <div className="flex justify-between items-center mt-2 text-xs text-zinc-500">
                        <span>This content will be paraphrased</span>
                        <span>{formData.oldContent.length} chars</span>
                    </div>
                </div>

                {/* Reference Link */}
                <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-2">
                        Additional Reference (Optional)
                    </label>
                    <input 
                        type="url"
                        name="referenceLink"
                        value={formData.referenceLink}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Paste a URL (article, post, etc.)..."
                    />
                </div>

                {/* Grid Inputs */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-2">Tone & Style</label>
                        <select 
                            name="tone"
                            value={formData.tone}
                            onChange={handleChange}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        >
                            <option value="Question">Question</option>
                            <option value="Anger">Anger</option>
                            <option value="Encourage">Encourage</option>
                            <option value="Demanding">Demanding</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-2">Language</label>
                        <select 
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        >
                            <option value="English">English</option>
                            <option value="Khmer">Khmer</option>
                            <option value="Mixed">Mixed (Khmer + English)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-2">Variations</label>
                    <select 
                        name="numVariations"
                        value={formData.numVariations}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                        <option value="1">1 variation</option>
                        <option value="2">2 variations</option>
                        <option value="3">3 variations</option>
                        <option value="4">4 variations</option>
                        <option value="5">5 variations</option>
                    </select>
                </div>

                {errorMsg && (
                    <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg flex items-start gap-3 text-red-400">
                        <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                        <span className="text-sm font-medium">{errorMsg}</span>
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <PenTool size={20} />}
                    {loading ? 'Generating...' : 'Generate Tweets'}
                </button>
             </form>
        </div>

        {warningMsg && (
            <div className="mt-6 p-4 bg-yellow-900/10 border border-yellow-700/30 rounded-lg flex items-start gap-3 text-yellow-500 animate-fade-in">
                <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                <span className="text-sm">{warningMsg}</span>
            </div>
        )}

        {/* Results */}
        {results.length > 0 && (
            <div className="mt-12 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Zap className="text-yellow-400" /> Generated Tweets
                    </h2>
                    {savedToHistory && (
                        <div className="flex items-center gap-2 text-green-400 bg-green-900/20 px-4 py-2 rounded-full border border-green-500/20 text-sm font-bold animate-fade-in">
                            <Save size={16} /> Saved to Dashboard
                        </div>
                    )}
                </div>
                
                <div className="grid gap-6">
                    {results.map((tweet, index) => (
                        <div key={index} className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/5 relative group hover:border-blue-500/30 transition-colors">
                            <p className="text-zinc-100 whitespace-pre-wrap leading-relaxed mb-4">{tweet}</p>
                            
                            <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                    {tweet.length} chars
                                </span>
                                <button 
                                    onClick={() => copyToClipboard(tweet, index)}
                                    className="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-white transition-colors"
                                >
                                    {copiedIndex === index ? (
                                        <>
                                            <CheckCircle size={16} className="text-green-500" /> Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={16} /> Copy
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        <RefreshCw size={16} /> Generate More
                    </button>
                </div>
            </div>
        )}
      </Section>
    </div>
  );
};

export default AiFightThai;
