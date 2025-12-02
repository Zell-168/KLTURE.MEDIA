
import React, { useState } from 'react';
import { useLang } from '../App';
import Section from '../components/ui/Section';
import { FAQS } from '../constants';
import { ChevronDown, AlertTriangle } from 'lucide-react';

const FAQ: React.FC = () => {
  const { t } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen text-white">
        <Section>
        <h1 className="text-4xl font-black text-center mb-12 drop-shadow-md">{t.faq.title}</h1>

        {/* Policy Box */}
        <div className="max-w-3xl mx-auto glass-panel border border-red-500/30 p-8 rounded-2xl mb-12 bg-red-900/10 shadow-[0_0_20px_rgba(220,38,38,0.1)]">
            <div className="flex items-start gap-4">
                <AlertTriangle className="text-red-500 shrink-0 mt-1" />
                <div>
                    <h2 className="text-xl font-bold text-red-500 mb-4">{t.faq.refundTitle}</h2>
                    <ul className="space-y-2 list-disc pl-5 text-zinc-300 mb-4">
                        {t.faq.refundPolicy.map((line, i) => (
                            <li key={i}>{line}</li>
                        ))}
                    </ul>
                    <p className="text-sm font-bold text-red-400">{t.faq.refundNote}</p>
                </div>
            </div>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((faq, idx) => (
                <div key={idx} className="glass-panel glass-panel-hover rounded-xl overflow-hidden transition-all duration-300">
                    <button 
                        onClick={() => toggle(idx)}
                        className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                    >
                        <span className="font-bold text-zinc-100 text-lg">{faq.question}</span>
                        <ChevronDown className={`text-zinc-400 transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-white' : ''}`} />
                    </button>
                    <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                        <div className="p-6 pt-0 text-zinc-400 border-t border-white/5 leading-relaxed">
                            {faq.answer}
                        </div>
                    </div>
                </div>
            ))}
        </div>
        </Section>
    </div>
  );
};

export default FAQ;
