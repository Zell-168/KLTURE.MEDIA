
import React, { useEffect, useState } from 'react';
import { useLang, useAuth } from '../App';
import Section from '../components/ui/Section';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, LogOut, CheckCircle, Calendar, Loader2, BookOpen, Video, Star, Zap, Search, Wallet, TrendingUp, PlayCircle, Send, Bot, FileText, ChevronDown, ChevronUp, Rocket, PenTool } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CreditTransaction, DbAiHistory } from '../types';
import { useCreditBalance } from '../lib/hooks';

// Helper to merge distinct table data into a unified dashboard shape
interface DashboardItem {
  id: string | number;
  title: string;
  type: string;
  price: string;
  icon: React.ReactNode;
  description: string;
  isEnrolled: boolean;
  enrollmentData: any | null;
  videoUrl?: string; // New: For playing course content
}

const Profile: React.FC = () => {
  const { t } = useLang();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { balance: creditBalance } = useCreditBalance();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');
  
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [aiHistory, setAiHistory] = useState<DbAiHistory[]>([]);
  const [expandedHistoryId, setExpandedHistoryId] = useState<number | null>(null);
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch User Enrollments
        const { data: enrollData } = await supabase
          .from('registrations')
          .select('*')
          .eq('email', user.email)
          .order('created_at', { ascending: false });

        const myEnrollments = enrollData || [];
        setEnrollments(myEnrollments);

        // 2. Fetch User Credit Transactions
        const { data: creditData } = await supabase
          .from('credit_transactions')
          .select('*')
          .eq('user_email', user.email)
          .order('created_at', { ascending: false });
        
        setTransactions(creditData as CreditTransaction[] || []);

        // 3. Fetch AI History
        const { data: aiData } = await supabase
          .from('ai_history')
          .select('*')
          .eq('user_email', user.email)
          .order('created_at', { ascending: false });
        
        setAiHistory(aiData as DbAiHistory[] || []);

        // 4. Fetch All Available Programs & Build Dashboard
        const [miniRes, otherRes, onlineRes, freeRes] = await Promise.all([
            supabase.from('programs_mini').select('*'),
            supabase.from('programs_other').select('*'),
            supabase.from('courses_online').select('*'),
            supabase.from('courses_free').select('*')
        ]);

        const miniData = miniRes.data || [];
        const otherData = otherRes.data || [];
        const onlineData = onlineRes.data || [];
        const freeData = freeRes.data || [];

        const allOfferings: DashboardItem[] = [];

        // Process MINI
        miniData.forEach(p => {
            allOfferings.push({
                id: `mini-${p.id}`,
                title: p.title,
                type: 'Live Class',
                price: p.price,
                icon: p.title.includes('Night') ? <Star className="text-blue-500" /> : <Star className="text-yellow-500" />,
                description: p.description || 'Intensive Workshop',
                isEnrolled: false,
                enrollmentData: null,
                videoUrl: p.video_url
            });
        });

        // Process OTHER
        otherData.forEach(p => {
            allOfferings.push({
                id: `other-${p.id}`,
                title: p.title,
                type: 'Live Class',
                price: p.price,
                icon: p.title.includes('VIP') ? <Star className="text-red-500" fill="currentColor" /> : <Zap className="text-purple-500" />,
                description: p.description || 'Advanced Program',
                isEnrolled: false,
                enrollmentData: null,
                videoUrl: p.video_url
            });
        });

        // Process ONLINE
        onlineData.forEach(p => {
            allOfferings.push({
                id: `online-${p.id}`,
                title: `Online: ${p.title}`,
                type: 'Online Course',
                price: p.price,
                icon: <Video className="text-emerald-500" />,
                description: p.description || 'Self-paced course',
                isEnrolled: false,
                enrollmentData: null,
                videoUrl: p.video_url
            });
        });

        // Process FREE
        freeData.forEach(p => {
            allOfferings.push({
                id: `free-${p.id}`,
                title: p.title,
                type: 'Free Course',
                price: 'Free',
                icon: <PlayCircle className="text-blue-500" />,
                description: p.description || 'Free training video',
                isEnrolled: false,
                enrollmentData: null,
                videoUrl: p.video_url
            });
        });

        allOfferings.push({
            id: 'bundle',
            title: 'Online: All 3 Courses Bundle',
            type: 'Online Course',
            price: '$35',
            icon: <Video className="text-emerald-600" />,
            description: 'Get all 3 online courses for a discounted price.',
            isEnrolled: false,
            enrollmentData: null
        });

        const finalDashboard = allOfferings.map(offering => {
            const match = myEnrollments.find(e => 
                e.program === offering.title || 
                (e.program && offering.title && e.program.trim().toLowerCase() === offering.title.trim().toLowerCase())
            );

            return {
                ...offering,
                isEnrolled: !!match,
                enrollmentData: match || null
            };
        });

        const filtered = finalDashboard.filter(i => i.isEnrolled);
        
        filtered.sort((a, b) => {
            const dateA = a.enrollmentData ? new Date(a.enrollmentData.created_at).getTime() : 0;
            const dateB = b.enrollmentData ? new Date(b.enrollmentData.created_at).getTime() : 0;
            return dateB - dateA;
        });

        setDashboardItems(filtered);

      } catch (err) {
        console.error("Error building dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleStartLearning = (item: DashboardItem) => {
    navigate(`/learning/${item.id}`);
  };

  const toggleHistory = (id: number) => {
    if (expandedHistoryId === id) {
        setExpandedHistoryId(null);
    } else {
        setExpandedHistoryId(id);
    }
  };

  const getToolDisplayName = (name: string | undefined | null) => {
    if (!name) return 'Unknown Tool';
    if (name === 'FIGHT_THAI') return 'Fight Thai';
    return String(name).replace(/_/g, ' ');
  };

  if (!user) return null;

  return (
    <Section className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Profile Header */}
        <div className="glass-panel rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-black/40 text-white rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/5 shadow-inner">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="text-center md:text-left flex-grow">
                <h1 className="text-3xl font-bold text-white drop-shadow-md">{user.full_name}</h1>
                <div className="flex flex-col md:flex-row gap-4 mt-2 text-zinc-300 text-sm font-medium justify-center md:justify-start">
                    <span className="flex items-center gap-1.5"><Mail size={16}/> {user.email}</span>
                    <span className="flex items-center gap-1.5"><Phone size={16}/> {user.phone_number}</span>
                </div>
            </div>
            <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="flex items-center gap-2 text-red-400 font-bold bg-red-900/10 hover:bg-red-900/30 px-5 py-3 rounded-xl transition-colors border border-red-900/30 backdrop-blur-md"
              >
                <LogOut size={18} />
                {t.nav.signOut}
            </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: WALLET */}
            <div className="lg:col-span-1 space-y-8">
                {/* Wallet Balance Card */}
                <div className="glass-panel text-white rounded-2xl p-6 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-zinc-300 mb-2">
                            <Wallet size={20} />
                            <span className="font-bold text-sm uppercase tracking-wider">Credit Balance</span>
                        </div>
                        <p className="text-4xl font-black mb-6 drop-shadow-lg">${creditBalance.toFixed(2)}</p>
                        
                        <p className="text-xs text-zinc-400 font-bold mb-2 uppercase">Top Up With</p>
                        <div className="space-y-2">
                             <a 
                                href="https://t.me/Who_1s_meng" 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-red-600/80 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition-colors text-sm backdrop-blur-sm"
                            >
                                <Send size={14} /> Meng
                            </a>
                            <a 
                                href="https://t.me/Kimly_yy" 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-red-600/80 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition-colors text-sm backdrop-blur-sm"
                            >
                                <Send size={14} /> Kimly
                            </a>
                            <a 
                                href="https://t.me/chan_sopheng" 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-red-600/80 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition-colors text-sm backdrop-blur-sm"
                            >
                                <Send size={14} /> Sopheng
                            </a>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="glass-panel rounded-2xl p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
                        <TrendingUp size={18} className="text-zinc-400" />
                        Transaction History
                    </h3>
                    
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                        {transactions.length > 0 ? transactions.map(tx => (
                            <div key={tx.id} className="flex justify-between items-start pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-bold text-sm text-zinc-200">
                                        {tx.type === 'topup' ? 'Top Up' : tx.type === 'spend' ? 'Payment' : 'Adjustment'}
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        {new Date(tx.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`font-bold text-sm ${Number(tx.amount) > 0 ? 'text-green-400' : 'text-zinc-300'}`}>
                                    {Number(tx.amount) > 0 ? '+' : ''}{Number(tx.amount).toFixed(2)}
                                </span>
                            </div>
                        )) : (
                            <p className="text-sm text-zinc-500 italic">No transactions yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: TABS & CONTENT */}
            <div className="lg:col-span-2">
                <div className="flex gap-4 mb-6 border-b border-white/10 pb-1">
                    <button 
                        onClick={() => setActiveTab('dashboard')}
                        className={`pb-3 font-bold text-lg transition-all ${activeTab === 'dashboard' ? 'text-white border-b-2 border-red-600' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Training Dashboard
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`pb-3 font-bold text-lg transition-all ${activeTab === 'history' ? 'text-white border-b-2 border-red-600' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        AI History
                    </button>
                </div>

                {activeTab === 'dashboard' && (
                    <>
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="animate-spin text-zinc-500" size={32} />
                            </div>
                        ) : dashboardItems.length > 0 ? (
                            <div className="grid sm:grid-cols-2 gap-6">
                                {dashboardItems.map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        className="relative flex flex-col p-6 rounded-2xl glass-panel glass-panel-hover transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className="absolute top-4 right-4">
                                            <span className="flex items-center gap-1.5 bg-green-900/30 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                                                <CheckCircle size={12} /> Enrolled
                                            </span>
                                        </div>

                                        <div className="mb-4 mt-2">
                                            <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center mb-4 text-2xl border border-white/10 shadow-inner">
                                                {item.icon}
                                            </div>
                                            <h3 className="text-lg font-bold leading-tight min-h-[3rem] flex items-center text-zinc-100">{item.title}</h3>
                                            <p className="text-xs text-zinc-400 font-bold uppercase mt-1">{item.type}</p>
                                        </div>

                                        <p className="text-zinc-400 text-sm mb-6 flex-grow">{item.description}</p>

                                        <div className="mt-auto pt-4 border-t border-white/5">
                                            <div className="bg-green-900/10 rounded-lg p-3 mb-3 border border-green-900/20">
                                                <p className="text-xs text-green-500 font-semibold mb-1 flex items-center gap-2">
                                                    <Calendar size={12} />
                                                    Enrolled:
                                                </p>
                                                <p className="text-sm font-bold text-zinc-300">
                                                    {new Date(item.enrollmentData?.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            
                                            {item.videoUrl && (
                                            <button 
                                                onClick={() => handleStartLearning(item)}
                                                className="w-full bg-white text-black py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-lg"
                                            >
                                                <PlayCircle size={16} /> Start Learning
                                            </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="glass-panel rounded-3xl p-12 text-center h-[400px] flex flex-col justify-center">
                                <div className="w-20 h-20 bg-white/5 text-zinc-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                                    <Search size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No active enrollments found</h3>
                                <p className="text-zinc-400 max-w-md mx-auto mb-8">
                                    You haven't registered for any programs yet. Explore our courses to get started.
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <button 
                                        onClick={() => navigate('/free')}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20"
                                    >
                                        Free Courses
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'history' && (
                    <div className="glass-panel rounded-2xl p-6 min-h-[400px]">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
                            <Bot size={20} className="text-red-500" />
                            AI Tool Usage History
                        </h3>
                        
                        {aiHistory.length === 0 ? (
                            <div className="text-center py-12 text-zinc-500">
                                <p>No history found. Try using our AI Tools!</p>
                                <button 
                                    onClick={() => navigate('/ai')}
                                    className="mt-4 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-white text-sm"
                                >
                                    Go to AI Tools
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {aiHistory.map((item) => (
                                    <div key={item.id} className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
                                        <div 
                                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                                            onClick={() => toggleHistory(item.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg bg-white/5 ${
                                                    item.tool_name === 'MARKETING' ? 'text-yellow-500' : 
                                                    item.tool_name === 'BOOSTING' ? 'text-blue-500' : 
                                                    item.tool_name === 'SPY' ? 'text-green-500' : 'text-blue-400'
                                                }`}>
                                                    {item.tool_name === 'MARKETING' && <Zap size={16} />}
                                                    {item.tool_name === 'BOOSTING' && <Rocket size={16} />}
                                                    {item.tool_name === 'SPY' && <Search size={16} />}
                                                    {item.tool_name === 'FIGHT_THAI' && <PenTool size={16} />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-sm uppercase tracking-wide">
                                                        {getToolDisplayName(item.tool_name)}
                                                    </p>
                                                    <p className="text-xs text-zinc-500">{new Date(item.created_at).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            {expandedHistoryId === item.id ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
                                        </div>
                                        
                                        {expandedHistoryId === item.id && (
                                            <div className="p-4 border-t border-white/10 bg-white/5 text-sm text-zinc-300">
                                                <div className="mb-4">
                                                    <h4 className="font-bold text-xs uppercase text-zinc-500 mb-2">Input Data</h4>
                                                    <pre className="bg-black/50 p-2 rounded text-xs overflow-x-auto border border-white/5 text-zinc-400">
                                                        {JSON.stringify(item.input_data, null, 2)}
                                                    </pre>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-xs uppercase text-zinc-500 mb-2">Result Data</h4>
                                                    <div className="bg-black/50 p-3 rounded border border-white/5 max-h-80 overflow-y-auto custom-scrollbar">
                                                        {item.tool_name === 'FIGHT_THAI' && item.result_data?.tweets ? (
                                                            <div className="space-y-3">
                                                                <p className="text-xs text-zinc-500 italic mb-2">Provider: {item.result_data.provider}</p>
                                                                {item.result_data.tweets.map((tweet: string, idx: number) => (
                                                                    <div key={idx} className="p-3 bg-white/5 rounded-lg border border-white/5 text-zinc-200 text-sm whitespace-pre-wrap">
                                                                        {tweet}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : item.tool_name === 'MARKETING' ? (
                                                            <div className="whitespace-pre-wrap">{item.result_data?.text || "No text generated"}</div>
                                                        ) : (
                                                            <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(item.result_data, null, 2)}</pre>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
    </Section>
  );
};

export default Profile;
