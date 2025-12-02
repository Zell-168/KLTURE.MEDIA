
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
    <div className="bg-zinc-950 min-h-screen text-white">
        <Section>
        <h1 className="text-3xl font-bold text-center mb-12">{t.faq.title}</h1>

        {/* Policy Box */}
        <div className="max-w-3xl mx-auto bg-red-900/10 border border-red-900/30 p-8 rounded-2xl mb-12">
            <div className="flex items-start gap-4">
                <AlertTriangle className="text-red-500 shrink-0 mt-1" />
                <div>
                    <h2 className="text-xl font-bold text-red-500 mb-4">{t.faq.refundTitle}</h2>
                    <ul className="space-y-2 list-disc pl-5 text-red-400 mb-4">
                        {t.faq.refundPolicy.map((line, i) => (
                            <li key={i}>{line}</li>
                        ))}
                    </ul>
                    <p className="text-sm font-bold text-red-500">{t.faq.refundNote}</p>
                </div>
            </div>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((faq, idx) => (
                <div key={idx} className="border border-zinc-800 rounded-lg overflow-hidden">
                    <button 
                        onClick={() => toggle(idx)}
                        className="w-full flex justify-between items-center p-6 bg-zinc-900 hover:bg-zinc-800 transition-colors text-left"
                    >
                        <span className="font-bold text-zinc-200">{faq.question}</span>
                        <ChevronDown className={`transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
                    </button>
                    <div 
                        className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-48' : 'max-h-0'}`}
                    >
                        <div className="p-6 pt-0 text-zinc-400 bg-zinc-900">
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
