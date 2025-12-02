
import React, { useEffect, useState } from 'react';
import { useLang, useAuth } from '../App';
import Section from '../components/ui/Section';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Wallet, TrendingUp, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import BannerCarousel from '../components/ui/BannerCarousel';
import { DbHomepageSlider } from '../types';

const Home: React.FC = () => {
  const { t } = useLang();
  const { user } = useAuth();
  const [creditBalance, setCreditBalance] = useState<number>(0);
  const [sliderImages, setSliderImages] = useState<DbHomepageSlider[]>([]);

  // Fetch Credits for CTA
  useEffect(() => {
    if (user?.email) {
      const fetchCredits = async () => {
        const { data } = await supabase
          .from('credit_transactions')
          .select('amount')
          .eq('user_email', user.email);
        
        const total = data?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0;
        setCreditBalance(total);
      };
      fetchCredits();
    }
  }, [user]);

  // Fetch Slider Images
  useEffect(() => {
    const fetchSlider = async () => {
        try {
            const { data } = await supabase
                .from('homepage_slider')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });
            
            if (data) setSliderImages(data);
        } catch (error) {
            console.error('Error fetching slider:', error);
        }
    };
    fetchSlider();
  }, []);

  return (
    <div className="relative">
      {/* Hero */}
      <div className="relative pt-10 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight drop-shadow-xl">
            {t.home.heroTitle}
          </h1>

          {/* Past Training Sessions Slider */}
          {sliderImages.length > 0 && (
            <div className="my-8 md:my-12 max-w-5xl mx-auto glass-panel p-2 rounded-2xl transform hover:scale-[1.01] transition-transform duration-500">
                <div className="rounded-xl overflow-hidden">
                  <BannerCarousel 
                      items={sliderImages} 
                      aspectRatio="pb-[56.25%] md:pb-[40%]" // 16:9 Mobile, 2.5:1 Desktop
                      autoPlayInterval={4000}
                  />
                </div>
            </div>
          )}

          <p className="text-lg md:text-xl text-zinc-200 max-w-3xl mx-auto mb-10 leading-relaxed font-light drop-shadow-md">
            {t.home.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/free"
              className="bg-red-600/90 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:-translate-y-1"
            >
              {t.home.ctaPrimary}
            </Link>
            <Link
              to="/contact"
              className="glass-panel text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all hover:-translate-y-1"
            >
              {t.home.ctaSecondary}
            </Link>
          </div>
        </div>
      </div>

      {/* Credit Top Up CTA - Only for Logged In Users */}
      {user && (
        <Section className="py-8">
           <div className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-3 mb-2 text-yellow-400 drop-shadow-sm">
                          <Wallet size={28} />
                          <span className="font-bold text-lg uppercase tracking-wider">Credit Wallet</span>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black mb-2 text-white">Your Balance: ${creditBalance}</h2>
                      <p className="text-zinc-300 max-w-lg">Top up your credits securely to easily enroll in any course or program instantly.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                       <p className="text-yellow-400 font-bold uppercase text-xs tracking-wider mb-1 text-center md:text-left">Contact for Top Up</p>
                       <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                            <a 
                                href="https://t.me/Who_1s_meng" 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 bg-yellow-400/90 text-black px-4 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors backdrop-blur-sm shadow-[0_0_15px_rgba(250,204,21,0.4)]"
                            >
                                <Send size={18} /> Meng
                            </a>
                            <a 
                                href="https://t.me/Kimly_yy" 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 bg-yellow-400/90 text-black px-4 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors backdrop-blur-sm shadow-[0_0_15px_rgba(250,204,21,0.4)]"
                            >
                                <Send size={18} /> Kimly
                            </a>
                            <a 
                                href="https://t.me/chan_sopheng" 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 bg-yellow-400/90 text-black px-4 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors backdrop-blur-sm shadow-[0_0_15px_rgba(250,204,21,0.4)]"
                            >
                                <Send size={18} /> Sopheng
                            </a>
                       </div>
                  </div>
              </div>
           </div>
        </Section>
      )}

      {/* Reasons Grid */}
      <Section>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-white drop-shadow-md">{t.home.reasonsTitle}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {t.home.reasons.map((reason, idx) => (
            <div key={idx} className="glass-panel glass-panel-hover p-6 rounded-2xl transition-all duration-300 group hover:-translate-y-2">
              <div className="mb-4 text-red-500 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">
                <CheckCircle2 size={32} />
              </div>
              <p className="font-medium text-zinc-100">{reason}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
            <Link to="/about" className="text-zinc-400 hover:text-white underline underline-offset-4 decoration-zinc-600 hover:decoration-white transition-all">
                {t.home.seeMore}
            </Link>
        </div>
      </Section>
    </div>
  );
};

export default Home;
