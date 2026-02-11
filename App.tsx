
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import PrincipleCard from './components/PrincipleCard';
import ContradictionMatrix from './components/ContradictionMatrix';
import InnovationReport from './components/InnovationReport';
import HistoryList from './components/HistoryList';
import { INVENTIVE_PRINCIPLES, TRIZ_PARAMETERS, getPrinciplesForContradiction, TRIZ_EXAMPLES, TrizExample } from './constants';
import { analyzeProblemWithAI, generateInnovationDraft } from './services/geminiService';
import { SavedSession } from './types';
import { Language, translations } from './translations';

const STORAGE_KEY = 'triz_master_history';
const LANG_STORAGE_KEY = 'triz_master_lang';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem(LANG_STORAGE_KEY) as Language) || 'ar';
  });
  const t = translations[lang];

  const [problem, setProblem] = useState('');
  const [improvingId, setImprovingId] = useState<number | null>(null);
  const [worseningId, setWorseningId] = useState<number | null>(null);
  const [results, setResults] = useState<number[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [aiDraft, setAiDraft] = useState<any>(null);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedSession[]>([]);

  const mainRef = useRef<HTMLElement>(null);

  // Smooth scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [route]);

  // Handle language switch
  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNewChallenge = useCallback(() => {
    setProblem('');
    setImprovingId(null);
    setWorseningId(null);
    setResults([]);
    setAiExplanation('');
    setAiDraft(null);
    setDraftError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const saveSession = useCallback((draftData: any = null) => {
    if (!problem.trim()) return;

    const newSession: SavedSession = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      problemDescription: problem,
      improvingParamId: improvingId,
      worseningParamId: worseningId,
      aiExplanation: aiExplanation,
      suggestedPrinciples: results,
      aiDraft: draftData || aiDraft,
    };

    setHistory(prev => {
      const filtered = prev.filter(s => s.problemDescription !== problem);
      return [newSession, ...filtered].slice(0, 15);
    });
  }, [problem, improvingId, worseningId, aiExplanation, results, aiDraft]);

  const handleManualLookup = useCallback(() => {
    if (improvingId && worseningId) {
      const suggested = getPrinciplesForContradiction(improvingId, worseningId);
      setResults(suggested);
      setAiExplanation(lang === 'ar' ? 'تم تحديد المبادئ بناءً على مصفوفة التناقضات المدمجة.' : 'Principles identified based on the built-in contradiction matrix.');
    }
  }, [improvingId, worseningId, lang]);

  const handleAiAnalysis = useCallback(async () => {
    if (!problem.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    setAiExplanation('');
    setResults([]);
    setAiDraft(null);
    setDraftError(null);
    const aiResult = await analyzeProblemWithAI(problem, lang);
    if (aiResult) {
      setImprovingId(aiResult.improvingParamId);
      setWorseningId(aiResult.worseningParamId);
      setAiExplanation(aiResult.explanation);
      const suggested = getPrinciplesForContradiction(aiResult.improvingParamId, aiResult.worseningParamId);
      setResults(suggested);
    }
    setIsAnalyzing(false);
  }, [problem, isAnalyzing, lang]);

  const handleGenerateDraft = useCallback(async () => {
    if (results.length === 0 || isGeneratingDraft) return;
    setIsGeneratingDraft(true);
    setDraftError(null);
    setAiDraft(null);
    
    const names = results.map(id => {
      const p = INVENTIVE_PRINCIPLES.find(item => item.id === id);
      return lang === 'ar' ? (p?.name || '') : (p?.nameEn || '');
    });
    const draft = await generateInnovationDraft(problem, names, lang);
    
    if (draft) {
      setAiDraft(draft);
      saveSession(draft);
    } else {
      setDraftError(lang === 'ar' ? 'تعذر صياغة التقرير حالياً. يرجى مراجعة المدخلات والمحاولة مرة أخرى.' : 'Failed to draft the report. Please review your inputs and try again.');
    }
    
    setIsGeneratingDraft(false);
  }, [problem, results, isGeneratingDraft, saveSession, lang]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      
      // Ctrl + Enter to Analyze
      if (isCmdOrCtrl && e.key === 'Enter' && !e.shiftKey) {
        if (route === '#/' && problem.trim() && !isAnalyzing) {
          e.preventDefault();
          handleAiAnalysis();
        }
      }
      
      // Ctrl + Shift + Enter to Generate Draft
      if (isCmdOrCtrl && e.shiftKey && e.key === 'Enter') {
        if (route === '#/' && results.length > 0 && !isGeneratingDraft) {
          e.preventDefault();
          handleGenerateDraft();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [problem, isAnalyzing, results, isGeneratingDraft, handleAiAnalysis, handleGenerateDraft, route]);

  const handleLoadSession = (session: SavedSession) => {
    setProblem(session.problemDescription);
    setImprovingId(session.improvingParamId);
    setWorseningId(session.worseningParamId);
    setAiExplanation(session.aiExplanation);
    setResults(session.suggestedPrinciples);
    setAiDraft(session.aiDraft);
    setDraftError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSession = (id: string) => {
    setHistory(prev => prev.filter(s => s.id !== id));
  };

  const handleClearHistory = () => {
    const confirmMsg = lang === 'ar' ? 'سيتم حذف السجل بالكامل، هل أنت متأكد؟' : 'History will be cleared. Are you sure?';
    if (window.confirm(confirmMsg)) {
      setHistory([]);
    }
  };

  const handleTryExample = (ex: TrizExample) => {
    setProblem(lang === 'ar' ? ex.description.ar : ex.description.en);
    setResults([]);
    setAiDraft(null);
    setDraftError(null);
    setAiExplanation('');
    setImprovingId(null);
    setWorseningId(null);
  };

  const renderHome = () => (
    <div key="home" className="space-y-6 md:space-y-12 py-6 md:py-12 animate-in fade-in slide-in-from-bottom-8 duration-700 px-2 md:px-0">
      {/* Hero Section */}
      <section className="text-center space-y-3 md:space-y-4 px-4 max-w-4xl mx-auto print:hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-indigo-400 text-[8px] md:text-xs font-black uppercase tracking-widest mb-1 shadow-2xl">
          <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-indigo-500"></span>
          </span>
          {t.heroBadge}
        </div>
        <h2 
          className="text-3xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-tight break-words"
          dangerouslySetInnerHTML={{ __html: t.heroTitle }}
        />
        <p className="text-sm md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium opacity-80 px-2">
          {t.heroDesc}
        </p>
      </section>

      {/* Problem Input Area */}
      <section className="max-w-6xl mx-auto px-2 md:px-4 print:hidden">
        <div className="bg-white rounded-[1.25rem] md:rounded-[4rem] border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="p-4 md:p-14 space-y-5 md:space-y-10">
            <div className="space-y-3 md:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-[8px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-4 md:w-6 h-px bg-slate-200"></span>
                  {t.inputLabel}
                </label>
                <div className="flex flex-wrap gap-1 md:gap-2">
                   {TRIZ_EXAMPLES.map((ex, i) => (
                     <button 
                       key={i} 
                       onClick={() => handleTryExample(ex)}
                       className="text-[8px] md:text-[10px] font-black text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-full border border-slate-100 hover:border-indigo-100 transition-all uppercase"
                     >
                       {lang === 'ar' ? ex.title.ar : ex.title.en}
                     </button>
                   ))}
                </div>
              </div>
              <div className="relative group">
                <textarea
                  className="w-full h-32 md:h-56 p-4 md:p-10 rounded-xl md:rounded-[3rem] bg-slate-50 border border-slate-100 focus:ring-4 md:focus:ring-[12px] focus:ring-indigo-50 focus:bg-white focus:border-indigo-200 transition-all resize-none text-slate-800 text-sm md:text-2xl leading-relaxed outline-none shadow-inner font-bold placeholder:text-slate-300"
                  placeholder={t.inputPlaceholder}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 items-center">
              <div className="lg:col-span-5 order-last lg:order-first">
                <div className="space-y-2 md:space-y-3">
                  <button
                    onClick={handleAiAnalysis}
                    disabled={isAnalyzing || !problem}
                    className={`w-full py-3.5 md:py-8 px-6 md:px-12 rounded-xl md:rounded-[2.5rem] font-black text-white transition-all transform active:scale-95 flex items-center justify-center gap-3 md:gap-4 text-sm md:text-2xl shadow-xl shadow-indigo-100 ${
                      isAnalyzing ? 'bg-slate-800 cursor-not-allowed' : 'bg-slate-900 hover:bg-indigo-600'
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 md:w-6 md:h-6 border-2 md:border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                        {t.aiAnalyzing}
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {t.aiAnalyzeBtn}
                      </>
                    )}
                  </button>
                  <p className="text-center text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest hidden md:block">
                    {t.shortcutHint}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-1 flex justify-center">
                <div className="w-7 h-7 md:w-10 md:h-10 bg-slate-50 rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-black text-slate-400 border border-slate-100 uppercase">{t.or}</div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                 <div className="space-y-1 md:space-y-2">
                    <span className="text-[8px] md:text-[10px] font-black text-indigo-500 block px-2 uppercase tracking-widest">{t.improvingParam}</span>
                    <select
                      className="w-full p-2.5 md:p-5 bg-white border border-slate-200 rounded-lg md:rounded-2xl text-[10px] md:text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                      value={improvingId || ''}
                      onChange={(e) => setImprovingId(Number(e.target.value))}
                    >
                      <option value="">{t.selectParam}</option>
                      {TRIZ_PARAMETERS.map(p => <option key={p.id} value={p.id}>{p.id}. {lang === 'ar' ? p.name : p.nameEn}</option>)}
                    </select>
                 </div>
                 <div className="space-y-1 md:space-y-2">
                    <span className="text-[8px] md:text-[10px] font-black text-rose-500 block px-2 uppercase tracking-widest">{t.worseningParam}</span>
                    <select
                      className="w-full p-2.5 md:p-5 bg-white border border-slate-200 rounded-lg md:rounded-2xl text-[10px] md:text-sm font-bold focus:ring-4 focus:ring-rose-50 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                      value={worseningId || ''}
                      onChange={(e) => setWorseningId(Number(e.target.value))}
                    >
                      <option value="">{t.selectParam}</option>
                      {TRIZ_PARAMETERS.map(p => <option key={p.id} value={p.id}>{p.id}. {lang === 'ar' ? p.name : p.nameEn}</option>)}
                    </select>
                 </div>
                 <button
                    onClick={handleManualLookup}
                    disabled={!improvingId || !worseningId}
                    className="sm:col-span-2 py-2.5 bg-slate-100 text-slate-600 rounded-lg md:rounded-2xl font-black hover:bg-slate-200 disabled:opacity-20 transition-all text-[8px] md:text-[10px] uppercase tracking-[0.2em]"
                  >
                    {t.applyMatrix}
                  </button>
              </div>
            </div>
          </div>

          {/* Solution Workbench Section */}
          {results.length > 0 && (
            <div className="bg-slate-50 border-t border-slate-100 p-4 md:p-14 space-y-6 md:space-y-16 animate-in slide-in-from-bottom-8 duration-700 print:bg-white print:border-none print:p-0">
              <div className="flex flex-col lg:flex-row gap-6 md:gap-10 print:hidden">
                {/* AI Insight Card */}
                <div className="lg:w-2/5">
                  <div className="bg-white p-5 md:p-10 rounded-2xl md:rounded-[3.5rem] border border-slate-200 shadow-2xl h-full relative overflow-hidden group">
                    <div className="relative z-10 space-y-3 md:space-y-6">
                      <div className="w-8 h-8 md:w-14 md:h-14 bg-slate-900 rounded-lg md:rounded-2xl flex items-center justify-center text-white shadow-xl">
                        <svg className="w-4 h-4 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg md:text-3xl font-black text-slate-900 mb-1 md:mb-4">{t.diagnosticTitle}</h4>
                        <p className="text-[10px] md:text-lg text-slate-600 font-bold leading-relaxed">{aiExplanation}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-1.5 md:gap-3 pt-2">
                        <div className="flex items-center justify-between p-2.5 md:p-4 bg-indigo-50 border border-indigo-100 rounded-lg md:rounded-2xl">
                          <span className="text-[7px] md:text-[9px] font-black text-indigo-500 uppercase tracking-widest">{t.diagnosticImproving}</span>
                          <span className="text-slate-900 font-black text-[9px] md:text-sm">{lang === 'ar' ? TRIZ_PARAMETERS.find(p => p.id === improvingId)?.name : TRIZ_PARAMETERS.find(p => p.id === improvingId)?.nameEn}</span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 md:p-4 bg-rose-50 border border-rose-100 rounded-lg md:rounded-2xl">
                          <span className="text-[7px] md:text-[9px] font-black text-rose-500 uppercase tracking-widest">{t.diagnosticWorsening}</span>
                          <span className="text-slate-900 font-black text-[9px] md:text-sm">{lang === 'ar' ? TRIZ_PARAMETERS.find(p => p.id === worseningId)?.name : TRIZ_PARAMETERS.find(p => p.id === worseningId)?.nameEn}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Principles Grid */}
                <div className="lg:w-3/5 space-y-4 md:space-y-6">
                   <div className="flex items-center gap-3">
                     <h5 className="text-slate-400 font-black uppercase text-[8px] md:text-[10px] tracking-[0.4em]">{t.solutionKeys}</h5>
                     <div className="h-px bg-slate-200 flex-1"></div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.map(id => {
                      const p = INVENTIVE_PRINCIPLES.find(item => item.id === id);
                      return p ? <PrincipleCard key={p.id} principle={p} lang={lang} /> : null;
                    })}
                  </div>
                </div>
              </div>

              {/* Action & Report Section */}
              <div className="space-y-6 md:space-y-14">
                <div className="text-center space-y-4 print:hidden">
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={handleGenerateDraft}
                      disabled={isGeneratingDraft}
                      className="group relative inline-flex items-center gap-3 md:gap-6 bg-slate-900 text-white px-6 md:px-16 py-3.5 md:py-7 rounded-xl md:rounded-[3rem] font-black hover:bg-indigo-600 transition-all shadow-xl transform hover:-translate-y-1"
                    >
                      <span className="text-sm md:text-3xl">
                        {isGeneratingDraft ? t.generatingReport : t.generateReportBtn}
                      </span>
                      <svg className={`w-4 h-4 md:w-8 md:h-8 group-hover:${lang === 'ar' ? 'translate-x-2' : '-translate-x-2'} transition-transform`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={lang === 'ar' ? "M14 5l7 7m0 0l-7 7m7-7H3" : "M10 19l-7-7m0 0l7-7m-7 7h18"} />
                      </svg>
                    </button>
                    <p className="text-[7px] md:text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] hidden md:block">
                      {t.generateShortcut}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[7px] md:text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
                    <span className="w-4 h-px bg-slate-200"></span>
                    {t.aiPowered}
                    <span className="w-4 h-px bg-slate-200"></span>
                  </div>
                </div>

                {(aiDraft || isGeneratingDraft || draftError) && (
                  <InnovationReport 
                    data={aiDraft} 
                    isLoading={isGeneratingDraft} 
                    error={draftError}
                    lang={lang}
                  />
                )}

                {/* Post-Report Contextual Action: New Challenge - Ultra Prominent Design */}
                {(aiDraft && !isGeneratingDraft) && (
                   <div className="flex justify-center pt-12 md:pt-20 pb-8 print:hidden animate-in fade-in zoom-in duration-1000">
                     <button
                       onClick={handleNewChallenge}
                       className="group relative flex items-center gap-4 md:gap-8 px-10 py-5 md:px-20 md:py-10 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right text-white rounded-2xl md:rounded-[3rem] font-black text-lg md:text-4xl transition-all shadow-[0_20px_50px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_30px_60px_-10px_rgba(79,70,229,0.7)] hover:-translate-y-2 active:scale-95 active:translate-y-0"
                     >
                        <div className="absolute -top-4 -right-4 w-8 h-8 md:w-12 md:h-12 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                           <svg className="w-4 h-4 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                           </svg>
                        </div>
                        <svg className="w-6 h-6 md:w-12 md:h-12 group-hover:rotate-180 transition-transform duration-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="tracking-tighter">{t.newChallenge}</span>
                     </button>
                   </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* History Section */}
      <HistoryList 
        sessions={history} 
        onLoad={handleLoadSession} 
        onDelete={handleDeleteSession} 
        onClearAll={handleClearHistory} 
        lang={lang}
      />

      {/* Methodology Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-7xl mx-auto px-4 py-6 md:py-24 print:hidden">
          {[
            { step: '01', title: t.methodologyStep1, desc: t.methodologyStep1Desc, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { step: '02', title: t.methodologyStep2, desc: t.methodologyStep2Desc, icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { step: '03', title: t.methodologyStep3, desc: t.methodologyStep3Desc, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 md:p-14 rounded-2xl md:rounded-[3rem] border border-slate-100 shadow-xl text-center space-y-3 md:space-y-6 hover:shadow-2xl transition-all group">
               <div className="w-12 h-12 md:w-20 md:h-20 bg-slate-50 rounded-xl md:rounded-[2rem] flex items-center justify-center mx-auto text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                 <svg className="w-6 h-6 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                 </svg>
               </div>
               <div className="space-y-1">
                 <span className="text-[7px] md:text-[10px] font-black text-indigo-500 uppercase tracking-widest block">{t.phase} {item.step}</span>
                 <h4 className="font-black text-lg md:text-3xl text-slate-900">{item.title}</h4>
               </div>
               <p className="text-xs md:text-lg text-slate-500 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
      </section>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );

  const renderPrinciples = () => (
    <div key="principles" className="py-6 md:py-16 space-y-8 md:space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-6 print:hidden">
        <h2 className="text-2xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">{t.principlesTitle}</h2>
        <p className="text-sm md:text-2xl text-slate-500 font-medium opacity-80">{t.principlesSubtitle}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 max-w-7xl mx-auto pb-12 md:pb-32">
        {INVENTIVE_PRINCIPLES.map(p => (
          <PrincipleCard key={p.id} principle={p} lang={lang} />
        ))}
      </div>
    </div>
  );

  const renderMatrix = () => (
    <div key="matrix" className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <ContradictionMatrix lang={lang} />
    </div>
  );

  const renderContent = () => {
    switch (route) {
      case '#/principles':
        return renderPrinciples();
      case '#/matrix':
        return renderMatrix(); 
      default:
        return renderHome();
    }
  };

  return (
    <div className={`min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900 bg-[#fbfcfe] ${lang === 'en' ? 'font-sans' : "font-['Tajawal']"}`}>
      <Header lang={lang} onToggleLang={() => setLang(prev => prev === 'ar' ? 'en' : 'ar')} />
      <main ref={mainRef} className="flex-1 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
      <footer className="bg-white border-t border-slate-100 py-10 md:py-24 print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6 md:space-y-10">
          <div className="flex items-center justify-center gap-3 md:gap-4">
             <div className="w-10 h-10 md:w-16 md:h-16 bg-slate-900 rounded-xl md:rounded-[1.5rem] flex items-center justify-center text-white font-black text-xl md:text-3xl shadow-2xl">T</div>
             <span className="font-black text-xl md:text-4xl text-slate-900 tracking-tighter">{t.title}</span>
          </div>
          <p className="text-slate-400 max-w-2xl mx-auto text-[10px] md:text-lg font-medium leading-relaxed px-4 md:px-6">{t.footerDesc}</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[7px] md:text-xs font-black text-slate-300 uppercase tracking-[0.4em]">
            {t.footerTags.map(tag => <span key={tag}>{tag}</span>)}
          </div>
          <p className="text-slate-300 text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] pt-4">{t.rights}</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
