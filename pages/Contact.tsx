
import React, { useState, useEffect } from 'react';
import { useLang } from '../App';
import Section from '../components/ui/Section';
import { useLocation, Link } from 'react-router-dom';
import { Send, CheckCircle, Wallet, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../App';
import { useCreditBalance } from '../lib/hooks';

const Contact: React.FC = () => {
  const { t } = useLang();
  const { user } = useAuth();
  const location = useLocation();
  const { balance: creditBalance } = useCreditBalance();
  
  // Dynamic Options
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});
  
  // Form State (kept minimal for price calculation)
  const [selectedProgram, setSelectedProgram] = useState('');

  // Calculate Price and Sufficiency
  const currentPrice = priceMap[selectedProgram] || 0; 
  const hasSufficientCredits = user ? creditBalance >= currentPrice : false;
  const missingAmount = currentPrice - creditBalance;

  // Fetch available programs (Only needed for price mapping now)
  useEffect(() => {
    const fetchPrograms = async () => {
        try {
            const [mini, other, online] = await Promise.all([
                supabase.from('programs_mini').select('title, price'),
                supabase.from('programs_other').select('title, price'),
                supabase.from('courses_online').select('title, price')
            ]);

            const prices: Record<string, number> = {};

            const parsePrice = (p: any) => {
              if (!p) return 0;
              const str = String(p);
              const num = parseFloat(str.replace(/[^0-9.]/g, ''));
              return isNaN(num) ? 0 : num;
            }
            
            mini.data?.forEach(p => { prices[p.title] = parsePrice(p.price); });
            other.data?.forEach(p => { prices[p.title] = parsePrice(p.price); });
            online.data?.forEach(p => { 
                const title = `Online: ${p.title}`;
                prices[title] = parsePrice(p.price); 
            });
            
            // Bundle
            const bundleTitle = 'Online: All 3 Courses Bundle';
            prices[bundleTitle] = 35;

            setPriceMap(prices);
            
        } catch (err) {
            console.error("Failed to load program options", err);
        }
    };
    fetchPrograms();
  }, []);

  // Update selection from navigation state
  useEffect(() => {
    if (location.state && location.state.selectedProgram) {
        setSelectedProgram(location.state.selectedProgram);
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <Section>
        <div className="max-w-3xl mx-auto">
          {/* Info Column (Payment Terminal) */}
          <div>
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
                          
                          {selectedProgram && (
                              <div className="text-sm text-zinc-400 mb-4 text-right">
                                  For: <span className="text-white font-medium">{selectedProgram}</span>
                              </div>
                          )}
                          
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
        </div>
      </Section>
    </div>
  );
};

export default Contact;
