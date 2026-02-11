
import React, { useMemo, memo } from 'react';
import { InventivePrinciple } from '../types';
import { Language, translations } from './translations';

interface Props {
  principle: InventivePrinciple & { nameEn?: string; descriptionEn?: string; examplesEn?: string[] };
  lang: Language;
}

const PrincipleCard: React.FC<Props> = memo(({ principle, lang }) => {
  const t = translations[lang];
  const renderedExamples = useMemo(() => {
    const examples = lang === 'ar' ? principle.examples : (principle.examplesEn || principle.examples);
    return examples.slice(0, 3).map((ex, i) => (
      <li key={i} className="group/item flex items-start gap-2 md:gap-3 p-1.5 md:p-2 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-slate-100">
        <div className="mt-0.5 w-4 h-4 md:w-5 md:h-5 rounded-md md:rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0 group-hover/item:bg-indigo-500 group-hover/item:text-white transition-all">
          <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-[10px] md:text-xs text-slate-700 font-semibold leading-snug">
          {ex}
        </span>
      </li>
    ));
  }, [principle, lang]);

  return (
    <div className="group relative bg-white p-0.5 rounded-2xl md:rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-500 h-full">
      <div className="bg-slate-50/50 rounded-[1.2rem] md:rounded-[1.8rem] p-4 md:p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4 md:mb-6">
          <div className="flex flex-col">
            <span className="text-[8px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-0.5 md:mb-1">{t.principleLabel}</span>
            <h3 className="text-base md:text-xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
              {lang === 'ar' ? principle.name : (principle.nameEn || principle.name)}
            </h3>
          </div>
          <div className="bg-white w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl shadow-sm flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform flex-shrink-0">
            <span className="text-indigo-600 font-black text-base md:text-lg">
              {principle.id}
            </span>
          </div>
        </div>

        <div className="relative mb-4 md:mb-6">
          <div className={`absolute ${lang === 'ar' ? '-right-1.5' : '-left-1.5'} top-0 bottom-0 w-0.5 bg-indigo-500/20 rounded-full`}></div>
          <p className={`text-slate-600 text-[11px] md:text-sm leading-relaxed ${lang === 'ar' ? 'pr-2.5' : 'pl-2.5'} font-medium italic`}>
            {lang === 'ar' ? principle.description : (principle.descriptionEn || principle.description)}
          </p>
        </div>

        <div className="mt-auto pt-3 border-t border-slate-200/50 space-y-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-wider">{t.examplesLabel}</p>
          </div>
          <ul className="grid grid-cols-1 gap-1">
            {renderedExamples}
          </ul>
        </div>
      </div>
    </div>
  );
});

export default PrincipleCard;
