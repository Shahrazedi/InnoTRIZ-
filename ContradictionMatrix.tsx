
import React, { useState, useMemo } from 'react';
import { TRIZ_PARAMETERS, getPrinciplesForContradiction, INVENTIVE_PRINCIPLES } from './constants';
import PrincipleCard from './PrincipleCard';
import { Language, translations } from './translations';

interface Props {
  lang: Language;
}

const ContradictionMatrix: React.FC<Props> = ({ lang }) => {
  const t = translations[lang];
  const [improvingId, setImprovingId] = useState<number | null>(null);
  const [worseningId, setWorseningId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const suggestedPrinciples = useMemo(() => {
    if (improvingId && worseningId) {
      return getPrinciplesForContradiction(improvingId, worseningId);
    }
    return [];
  }, [improvingId, worseningId]);

  const filteredParams = useMemo(() => {
    return TRIZ_PARAMETERS.filter(p => 
      (lang === 'ar' ? p.name : p.nameEn).toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.id.toString().includes(searchTerm)
    );
  }, [searchTerm, lang]);

  return (
    <div className="space-y-8 py-8 px-4 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="max-w-4xl mx-auto text-center space-y-4 px-4">
        <h2 
          className="text-3xl md:text-5xl font-black text-slate-900 leading-tight"
          dangerouslySetInnerHTML={{ __html: t.matrixTitle }}
        />
        <p className="text-lg text-slate-500 font-light">
          {t.matrixDesc}
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Selection Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder={t.matrixSearch}
                className={`w-full p-3 ${lang === 'ar' ? 'pr-10' : 'pl-10'} bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className={`w-5 h-5 absolute ${lang === 'ar' ? 'left-3' : 'right-3'} top-3 text-slate-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-indigo-600 uppercase mb-2 block tracking-widest">
                  1. {t.improvingParam}
                </label>
                <div className="h-48 overflow-y-auto border border-slate-100 rounded-xl p-2 space-y-1 scrollbar-hide bg-slate-50/50">
                  {filteredParams.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setImprovingId(p.id)}
                      className={`w-full text-start p-2 rounded-lg text-sm font-medium transition-all ${
                        improvingId === p.id 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                        : 'hover:bg-white text-slate-600 hover:shadow-sm'
                      }`}
                    >
                      {p.id}. {lang === 'ar' ? p.name : p.nameEn}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-rose-600 uppercase mb-2 block tracking-widest">
                  2. {t.worseningParam}
                </label>
                <div className="h-48 overflow-y-auto border border-slate-100 rounded-xl p-2 space-y-1 scrollbar-hide bg-slate-50/50">
                  {filteredParams.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setWorseningId(p.id)}
                      className={`w-full text-start p-2 rounded-lg text-sm font-medium transition-all ${
                        worseningId === p.id 
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' 
                        : 'hover:bg-white text-slate-600 hover:shadow-sm'
                      }`}
                    >
                      {p.id}. {lang === 'ar' ? p.name : p.nameEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {(improvingId || worseningId) && (
              <button 
                onClick={() => { setImprovingId(null); setWorseningId(null); }}
                className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
              >
                {t.matrixReset}
              </button>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {!improvingId || !worseningId ? (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center space-y-4">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-300 shadow-sm">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-400 text-xl">{t.matrixWaiting}</h4>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">{t.matrixWaitingDesc}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in zoom-in-95 duration-500">
              <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">{t.matrixSelectedContradiction}</h4>
                    <p className="text-slate-600 font-bold text-sm">
                      {t.matrixImproving} <span className="text-indigo-600">[{lang === 'ar' ? TRIZ_PARAMETERS.find(p => p.id === improvingId)?.name : TRIZ_PARAMETERS.find(p => p.id === improvingId)?.nameEn}]</span> 
                      &nbsp;{t.matrixWorsening}&nbsp;
                      <span className="text-rose-600">[{lang === 'ar' ? TRIZ_PARAMETERS.find(p => p.id === worseningId)?.name : TRIZ_PARAMETERS.find(p => p.id === worseningId)?.nameEn}]</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestedPrinciples.map(id => {
                  const principle = INVENTIVE_PRINCIPLES.find(p => p.id === id);
                  return principle ? <PrincipleCard key={id} principle={principle} lang={lang} /> : null;
                })}
              </div>

              {suggestedPrinciples.length === 0 && (
                <div className="p-8 bg-amber-50 border border-amber-100 rounded-2xl text-center">
                  <p className="text-amber-700 font-medium">{t.matrixNoResult}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContradictionMatrix;
