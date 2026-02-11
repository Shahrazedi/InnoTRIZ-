
import React from 'react';
import { SavedSession } from '../types';
import { Language, translations } from '../translations';

interface Props {
  sessions: SavedSession[];
  onLoad: (session: SavedSession) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  lang: Language;
}

const HistoryList: React.FC<Props> = ({ sessions, onLoad, onDelete, onClearAll, lang }) => {
  const t = translations[lang];
  if (sessions.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 print:hidden">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t.recentProjects}</h3>
        </div>
        <button 
          onClick={onClearAll}
          className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-700 transition-colors"
        >
          {t.clearHistory}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <div 
            key={session.id} 
            className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50 transition-all cursor-pointer relative"
            onClick={() => onLoad(session)}
          >
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(session.id);
              }}
              className={`absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-rose-50`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                  {new Date(session.timestamp).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                {session.aiDraft && (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded-full uppercase">{t.readyReport}</span>
                )}
              </div>
              <h4 className={`text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                {session.problemDescription}
              </h4>
              <div className={`flex items-center gap-3 pt-2 ${lang === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`flex ${lang === 'ar' ? '-space-x-1 space-x-reverse' : '-space-x-1'}`}>
                  {session.suggestedPrinciples.slice(0, 3).map((id) => (
                    <div key={id} className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-500">
                      {id}
                    </div>
                  ))}
                  {session.suggestedPrinciples.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-[8px] font-black text-indigo-600">
                      +{session.suggestedPrinciples.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">{t.clickToContinue}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HistoryList;
