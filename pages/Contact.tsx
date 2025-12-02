
import React, { useState, useEffect } from 'react';
import { useLang } from '../App';
import Section from '../components/ui/Section';
import { useLocation, Link } from 'react-router-dom';
import { Send, Phone, CheckCircle, Loader2, AlertCircle, Wallet, ArrowRight, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../App';
import { useCreditBalance } from '../lib/hooks';

const Contact: React.FC = () => {
  const { t } = useLang();
  const { user } = useAuth();
  const location = useLocation();
  const { balance: creditBalance, refreshBalance } = useCreditBalance();
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingPrograms, setFetchingPrograms] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dynamic Options
  const [programOptions, setProgramOptions] = useState<string[]>([]);
  const [scheduleMap, setScheduleMap] = useState<Record<string, string[]>>({});
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({}); // Maps Program Title -> Category (MINI, OTHER, ONLINE)
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  
  // Form State
  const [formData, setFormData] = useState({
    name: user?.full_name || '',
    phone: user?.phone_number || '',
    telegram: user?.telegram_username || '',
    email: user?.email || '',
    password: '', 
    program: '', 
    date: '',
    message: ''
  });

  // Calculate Price and Sufficiency
  const currentPrice = priceMap[formData.program] || 0; 
  const hasSufficientCredits = user ? creditBalance >= currentPrice : false;
  const missingAmount = currentPrice - creditBalance;

  // Fetch available programs and schedules
  useEffect(() => {
    const fetchPrograms = async () => {
        try {
            const [mini, other, online] = await Promise.all([
                supabase.from('programs_mini').select('title, available_dates, price'),
                supabase.from('programs_other').select('title, available_dates, price'),
                supabase.from('courses_online').select('title, price')
            ]);

            const options: string[] = [];
            const schedules: Record<string, string[]> = {};
            const prices: Record<string, number> = {};
            const categories: Record<string, string> = {};

            const parsePrice = (p: string) => {
              if (!p) return 0;
              const num = parseFloat(p.replace(/[^0-9.]/g, ''));
              return isNaN(num) ? 0 : num;
            }
            
            // Process MINI Programs
            mini.data?.forEach(p => {
                options.push(p.title);
                prices[p.title] = parsePrice(p.price);
                categories[p.title] = 'MINI';
                if (p.available_dates && p.available_dates.length > 0) {
                    schedules[p.title] = p.available_dates;
                }
            });

            // Process OTHER Programs
            other.data?.forEach(p => {
                options.push(p.title);
                prices[p.title] = parsePrice(p.price);
                categories[p.title] = 'OTHER';
                if (p.available_dates && p.available_dates.length > 0) {
                    schedules[p.title] = p.available_dates;
                }
            });

            // Process ONLINE Courses
            online.data?.forEach(p => {
                const title = `Online: ${p.title}`;
                options.push(title);
                prices[title] = parsePrice(p.price);
                categories[title] = 'ONLINE';
                schedules[title] = ['Immediate Access / Self-Paced'];
            });
            
            // Bundle
            const bundleTitle = 'Online: All 3 Courses Bundle';
            options.push(bundleTitle);
            prices[bundleTitle] = 35;
            categories[bundleTitle] = 'BUNDLE';
            schedules[bundleTitle] = ['Immediate Access / Self-Paced'];

            setProgramOptions(options);
            setScheduleMap(schedules);
            setPriceMap(prices);
            setCategoryMap(categories);
            
            // Set default program if none selected
            if (!formData.program && options.length > 0) {
                 const defaultProgram = options[0];
                 setFormData(prev => ({ 
                     ...prev, 
                     program: defaultProgram,
                     date: schedules[defaultProgram]?.[0] || ''
                 }));
            }

        } catch (err) {
            console.error("Failed to load program options", err);
        } finally {
            setFetchingPrograms(false);
        }
    };
    fetchPrograms();
  }, [formData.program]);

  // Update selection from navigation state (e.g. clicking "Register" on a specific course)
  useEffect(() => {
    if (location.state && location.state.selectedProgram) {
        const prog = location.state.selectedProgram;
        setFormData(prev => ({ 
            ...prev, 
            program: prog
        }));
    }
  }, [location]);

  // Update available dates when program changes
  useEffect(() => {
    if (formData.program && scheduleMap[formData.program]) {
        const dates = scheduleMap[formData.program];
        setAvailableDates(dates);
        // Default to first option
        if (dates.length > 0) {
            setFormData(prev => ({ ...prev, date: dates[0] }));
        } else {
            setFormData(prev => ({ ...prev, date: '' }));
        }
    } else {
        setAvailableDates([]);
        setFormData(prev => ({ ...prev, date: '' }));
    }
  }, [formData.program, scheduleMap]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // Sanitize data
    const payload = {
        full_name: formData.name.trim(),
        phone_number: formData.phone.trim(),
        telegram_username: formData.telegram.trim() || null,
        email: formData.email.trim(),
        // Only send password if user is not logged in (new registration)
        ...( !user ? { password: formData.password.trim() } : {}),
        program: formData.program,
        preferred_date: formData.date.trim(),
        message: formData.message.trim()
    };

    try {
      if (user) {
        // Enforce Credit Payment
        if (creditBalance < currentPrice) {
            throw new Error(`Insufficient credits. You need ${currentPrice} but have ${creditBalance}. Please top up.`);
        }
      }

      // 1. Insert Registration
      const { error: regError } = await supabase
        .from('registrations')
        .insert([payload]);

      if (regError) throw regError;

      // 2. Handle Payment Logic (If logged in & Paid)
      if (user && currentPrice > 0) {
        
        // A. Deduct Credits
        const { error: txError } = await supabase
            .from('credit_transactions')
            .insert([{
                user_email: user.email,
                type: 'spend',
                amount: -currentPrice,
                note: `Payment for ${formData.program}`
            }]);
        
        if (txError) console.error("Failed to record transaction", txError);

        // B. Record Sales Ledger (New)
        const category = categoryMap[formData.program] || 'OTHER';
        const { error: salesError } = await supabase
            .from('sales_ledger')
            .insert([{
                user_email: user.email,
                program_title: formData.program,
                category: category,
                amount: currentPrice,
                note: 'Paid via Credit Wallet'
            }]);

        if (salesError) console.error("Failed to record sale ledger", salesError);
        
        await refreshBalance();
      }

      console.log("Form Data Submitted to Supabase:", payload);
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setErrorMsg(err.message || 'Something went wrong. Please check your connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
        <Section className="min-h-[60vh] flex items-center justify-center text-center text-white">
            <div className="max-w-md mx-auto p-8 glass-panel rounded-3xl">
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                    <CheckCircle size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
                <p className="text-zinc-300 mb-8">{t.contact.success}</p>
                {user && currentPrice > 0 && (
                    <div className="bg-black/30 p-4 rounded-xl border border-white/10 mb-8">
                        <p className="text-zinc-400 text-sm mb-2">Payment Summary</p>
                        <div className="flex justify-between items-center text-sm font-medium mb-1 text-zinc-200">
                            <span>Program Cost:</span>
                            <span>{currentPrice} Credits</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold text-green-400">
                            <span>Remaining Balance:</span>
                            <span>{creditBalance} Credits</span>
                        </div>
                    </div>
                )}
                <button 
                    onClick={() => {
                      setSubmitted(false);
                      window.location.reload(); 
                    }}
                    className="text-red-500 font-bold hover:underline"
                >
                    Back to Home
                </button>
            </div>
        </Section>
    )
  }

  return (
    <div className="min-h-screen">
      <Section>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Info Column (Payment Terminal) */}
          <div className="order-2 md:order-1">
              <h1 className="text-4xl font-bold mb-8 text-white drop-shadow-md">Checkout & Payment</h1>
              
              {/* 1. If User Not Logged In */}
              {!user && (
                  <div className="glass-panel p-8 rounded-2xl mb-8">
                      <h3 className="font-bold text-xl mb-2 text-white">Have an account?</h3>
                      <p className="text-zinc-300 mb-6">Log in to use your Credit Wallet for payment.</p>
                      <Link to="/signin" className="inline-block bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors shadow-lg">
                          Sign In to Pay
                      </Link>
                  </div>
              )}

              {/* 2. Wallet Status (Logged In) */}
              {user && (
                  <div className="glass-panel p-6 mb-8 rounded-2xl relative overflow-hidden">
                      <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 border border-green-500/30">
                              <Wallet size={20} />
                          </div>
                          <div>
                              <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Your Credit Balance</p>
                              <p className="text-2xl font-black text-white drop-shadow-sm">${creditBalance.toFixed(2)}</p>
                          </div>
                      </div>

                      <div className="border-t border-white/10 pt-6">
                          <div className="flex justify-between items-center mb-2">
                              <span className="text-zinc-300">Program Cost:</span>
                              <span className="font-bold text-lg text-white">${currentPrice.toFixed(2)}</span>
                          </div>
                          
                          {hasSufficientCredits ? (
                               <div className="bg-green-500/10 text-green-400 px-4 py-3 rounded-lg flex items-center gap-2 mt-4 font-medium border border-green-500/20 backdrop-blur-sm">
                                  <CheckCircle size={18} />
                                  <span>Balance sufficient for payment.</span>
                               </div>
                          ) : (
                               <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-lg mt-4 border border-red-500/20 backdrop-blur-sm">
                                  <div className="flex items-center gap-2 font-bold mb-1">
                                      <XCircle size={18} />
                                      <span>Insufficient Funds</span>
                                  </div>
                                  <p className="text-sm mb-3 text-red-300/80">You need ${missingAmount.toFixed(2)} more to register. Contact Sales to Top Up:</p>
                                  <div className="flex flex-col gap-2">
                                    <a href="https://t.me/Who_1s_meng" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm bg-black/40 border border-red-900/50 text-red-400 px-3 py-1.5 rounded-md hover:bg-black/60 transition-colors font-medium">
                                        <Send size={14} /> Contact Meng
                                    </a>
                                    <a href="https://t.me/Kimly_yy" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm bg-black/40 border border-red-900/50 text-red-400 px-3 py-1.5 rounded-md hover:bg-black/60 transition-colors font-medium">
                                        <Send size={14} /> Contact Kimly
                                    </a>
                                    <a href="https://t.me/chan_sopheng" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm bg-black/40 border border-red-900/50 text-red-400 px-3 py-1.5 rounded-md hover:bg-black/60 transition-colors font-medium">
                                        <Send size={14} /> Contact Sopheng
                                    </a>
                                  </div>
                               </div>
                          )}
                      </div>
                  </div>
              )}

              {/* Contact Info */}
              <div className="space-y-4">
                  <p className="font-bold text-zinc-400 mb-2">Need help?</p>
                  {/* Meng */}
                  <a href="https://t.me/Who_1s_meng" target="_blank" rel="noreferrer" className="glass-panel glass-panel-hover flex items-center gap-4 p-4 rounded-xl group transition-all">
                      <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors border border-blue-500/30">
                          <Send size={20} />
                      </div>
                      <div>
                          <p className="font-bold text-white">Contact Meng</p>
                          <p className="text-zinc-400 text-sm">@Who_1s_meng | 088 990 2595</p>
                      </div>
                  </a>
                  {/* Kimly */}
                  <a href="https://t.me/Kimly_yy" target="_blank" rel="noreferrer" className="glass-panel glass-panel-hover flex items-center gap-4 p-4 rounded-xl group transition-all">
                      <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors border border-blue-500/30">
                          <Send size={20} />
                      </div>
                      <div>
                          <p className="font-bold text-white">Contact Kimly</p>
                          <p className="text-zinc-400 text-sm">@Kimly_yy | 016 859 826</p>
                      </div>
                  </a>
                  {/* Sopheng */}
                  <a href="https://t.me/chan_sopheng" target="_blank" rel="noreferrer" className="glass-panel glass-panel-hover flex items-center gap-4 p-4 rounded-xl group transition-all">
                      <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors border border-blue-500/30">
                          <Send size={20} />
                      </div>
                      <div>
                          <p className="font-bold text-white">Contact Sopheng</p>
                          <p className="text-zinc-400 text-sm">@chan_sopheng | 070 397 080</p>
                      </div>
                  </a>
              </div>
          </div>

          {/* Form Column */}
          <div className="glass-panel p-8 rounded-2xl shadow-2xl h-fit order-1 md:order-2">
              <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-sm">Registration Details</h2>
              
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-start gap-3 text-red-400 backdrop-blur-sm">
                  <AlertCircle className="shrink-0 mt-0.5" size={20} />
                  <p className="text-sm font-medium">{errorMsg}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Program Selection - Prominent */}
                  <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                      <label className="block text-sm font-bold text-zinc-400 mb-2">{t.contact.formProgram} *</label>
                      <div className="relative">
                          <select 
                              name="program"
                              value={formData.program}
                              onChange={handleChange}
                              disabled={fetchingPrograms}
                              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all appearance-none font-medium"
                          >
                              {fetchingPrograms ? (
                                  <option>Loading available programs...</option>
                              ) : (
                                  programOptions.map((opt, i) => (
                                      <option key={i} value={opt} className="bg-zinc-900">{opt}</option>
                                  ))
                              )}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                               {fetchingPrograms ? <Loader2 className="animate-spin" size={16}/> : '▼'}
                          </div>
                      </div>
                  </div>

                  {/* Personal Details */}
                  <div>
                      <label className="block text-sm font-bold text-zinc-400 mb-1">{t.contact.formName} *</label>
                      <input 
                          required
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all focus:bg-black/60"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-zinc-400 mb-1">{t.contact.formPhone} *</label>
                      <input 
                          required
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all focus:bg-black/60"
                      />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-bold text-zinc-400 mb-1">{t.contact.formTelegram}</label>
                          <input 
                              type="text" 
                              name="telegram"
                              value={formData.telegram}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all focus:bg-black/60"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-zinc-400 mb-1">{t.contact.formEmail} *</label>
                          <input 
                              required
                              type="email" 
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              readOnly={!!user} // Locked for logged in users
                              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-600 transition-all ${user ? 'bg-zinc-900/50 border-zinc-700 text-zinc-500 cursor-not-allowed' : 'bg-black/40 border-white/10 text-white focus:bg-black/60'}`}
                          />
                      </div>
                  </div>

                  {!user && (
                      <div>
                          <label className="block text-sm font-bold text-zinc-400 mb-1">{t.contact.formPassword} *</label>
                          <input 
                              required
                              type="password" 
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all focus:bg-black/60"
                          />
                      </div>
                  )}

                  <div>
                      <label className="block text-sm font-bold text-zinc-400 mb-1">{t.contact.formDate}</label>
                      {availableDates.length > 0 ? (
                          <div className="relative">
                              <select 
                                  name="date"
                                  value={formData.date}
                                  onChange={handleChange}
                                  className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all appearance-none focus:bg-black/60"
                              >
                                  {availableDates.map((d, i) => (
                                      <option key={i} value={d} className="bg-zinc-900">{d}</option>
                                  ))}
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                  ▼
                              </div>
                          </div>
                      ) : (
                           <input 
                              type="text" 
                              name="date"
                              value={formData.date}
                              onChange={handleChange}
                              placeholder="Immediate Access"
                              readOnly
                              className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border border-zinc-700 text-zinc-500 cursor-not-allowed"
                          />
                      )}
                  </div>

                  {/* Submit Button Area */}
                  <div className="pt-4">
                      {user ? (
                          <button 
                              type="submit"
                              disabled={loading || fetchingPrograms || !hasSufficientCredits}
                              className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 
                                  ${!hasSufficientCredits 
                                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5' 
                                      : 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                                  }`}
                          >
                              {loading ? (
                                  <>
                                      <Loader2 className="animate-spin" size={20} /> Processing...
                                  </>
                              ) : !hasSufficientCredits ? (
                                  "Insufficient Credits"
                              ) : (
                                  `Pay ${currentPrice} Credits & Register`
                              )}
                          </button>
                      ) : (
                          <button 
                              type="submit"
                              disabled={loading || fetchingPrograms}
                              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-red-600/20 backdrop-blur-md"
                          >
                              {loading ? "Processing..." : "Create Account & Register"}
                          </button>
                      )}
                      
                      {!user && (
                           <p className="text-xs text-center text-zinc-500 mt-4">
                              Note: For new accounts, please pay via Sales Team after submitting, or log in if you already have credits.
                           </p>
                      )}
                  </div>
              </form>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Contact;
