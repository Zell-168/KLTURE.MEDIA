
import React, { useState } from 'react';
import { useAuth } from '../../App';
import Section from '../../components/ui/Section';
import { useNavigate } from 'react-router-dom';
import { Loader2, Zap, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { GoogleGenAI } from "@google/genai";

const AiMarketing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    businessName: '',
    productService: '',
    type: 'Product',
    budget: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  React.useEffect(() => {
    if (!user) navigate('/signin');
  }, [user, navigate]);

  const handleGenerate = async () => {
    if (!formData.businessName || !formData.productService || !formData.budget) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Generate a comprehensive marketing campaign strategy for:
        Business Name: ${formData.businessName}
        Product/Service: ${formData.productService}
        Type: ${formData.type}
        Monthly Budget: $${formData.budget}
        
        Include:
        1. Campaign Objective
        2. Target Audience
        3. Key Messages
        4. Online Strategy
        5. Offline Strategy (if applicable)
        6. Budget Allocation
        7. Expected Results
        
        Keep the tone professional yet actionable. Output in clear Markdown format.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const generatedText = response.text || "No content generated.";
        setResult(generatedText);

        // Save to History
        if (user?.email) {
            await supabase.from('km_ai_histories').insert([{
                user_email: user.email,
                tool_name: 'MARKETING',
                input_data: formData,
                result_data: { text: generatedText }
            }]);
        }
    } catch (err) {
        console.error("Gemini Error", err);
        setResult("Error generating campaign. Please try again later.");
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

        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-red-900/30 shadow-[0_0_40px_rgba(220,38,38,0.1)]">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-3">
                    <Zap className="text-red-600" size={32} />
                    AI Marketing Generator
                </h1>
                <p className="text-zinc-400">Fill in the details below to generate a comprehensive campaign strategy.</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-2">1. Business Name</label>
                    <input 
                        type="text" 
                        value={formData.businessName}
                        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                        placeholder="e.g., Khmer Coffee Co."
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-2">2. What do you sell?</label>
                    <input 
                        type="text" 
                        value={formData.productService}
                        onChange={(e) => setFormData({...formData, productService: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                        placeholder="Describe your product or service"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-2">3. Type</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer bg-black/20 px-4 py-2 rounded-lg border border-white/5 hover:bg-white/5 transition-colors">
                            <input 
                                type="radio" 
                                name="type" 
                                value="Product"
                                checked={formData.type === 'Product'}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="accent-red-600"
                            />
                            <span className="text-zinc-200">Product</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-black/20 px-4 py-2 rounded-lg border border-white/5 hover:bg-white/5 transition-colors">
                            <input 
                                type="radio" 
                                name="type" 
                                value="Service"
                                checked={formData.type === 'Service'}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="accent-red-600"
                            />
                            <span className="text-zinc-200">Service</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-zinc-300 mb-2">4. Monthly Budget ($)</label>
                    <input 
                        type="number" 
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                        placeholder="e.g., 500"
                    />
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={handleGenerate}
                        disabled={loading}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
                        {loading ? 'Generating Strategy...' : 'Generate Campaign'}
                    </button>
                    <a 
                        href="https://www.overread.asia/categories/1216w8p83d895i1" 
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-white/5 hover:bg-white/10 text-zinc-300 font-bold py-4 rounded-xl transition-all border border-white/10 flex items-center justify-center text-center"
                    >
                        Buy ChatGPT Guide ($3)
                    </a>
                </div>
            </div>

            {result && (
                <div className="mt-12 animate-fade-in">
                    <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-4">Your Campaign Strategy</h2>
                    <div className="bg-black/40 rounded-xl p-6 border border-white/10 text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans">
                        {result}
                    </div>
                </div>
            )}
        </div>
      </Section>
    </div>
  );
};

export default AiMarketing;
