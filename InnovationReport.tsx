
import React, { useState, useEffect } from 'react';
import { Language, translations } from './translations';

interface Solution {
  title: string;
  description: string;
  principleApplied: string;
  feasibility: string;
}

interface ReportData {
  introduction: string;
  solutions: Solution[];
  nextSteps: string[];
}

interface Props {
  data?: ReportData | null;
  isLoading?: boolean;
  error?: string | null;
  lang: Language;
}

const InnovationReport: React.FC<Props> = ({ data, isLoading, error, lang }) => {
  const t = translations[lang];
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isCopyingAll, setIsCopyingAll] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(lang === 'ar' ? 'بدء تهيئة محرك التحليل...' : 'Initializing analysis engine...');

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setProgress(0);
      const messages = lang === 'ar' ? [
        'تحليل مصفوفة التناقضات...',
        'فحص المبادئ الابتكارية الـ 40...',
        'توليد حلول هندسية...',
        'اختبار جدوى النماذج التطبيقية...',
        'صياغة الخطوات التنفيذية للحل...'
      ] : [
        'Analyzing contradiction matrix...',
        'Examining 40 inventive principles...',
        'Generating engineering solutions...',
        'Testing application model feasibility...',
        'Drafting actionable steps...'
      ];
      let msgIdx = 0;
      
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 90) return prev + Math.random() * 8;
          return prev;
        });
        msgIdx = (msgIdx + 1) % messages.length;
        setLoadingMessage(messages[msgIdx]);
      }, 1500);
    } else {
      setProgress(100);
    }
    return () => clearInterval(interval);
  }, [isLoading, lang]);

  const getFeasibilityBadge = (level: string) => {
    const l = level.toLowerCase();
    const isHigh = l.includes('high') || l.includes('عالية');
    const isMedium = l.includes('medium') || l.includes('متوسطة');
    
    if (isHigh) return <span className="px-3 py-1 md:px-4 md:py-1.5 bg-emerald-500 text-white rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100">{t.feasibilityHigh}</span>;
    if (isMedium) return <span className="px-3 py-1 md:px-4 md:py-1.5 bg-amber-500 text-white rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-100">{t.feasibilityMedium}</span>;
    return <span className="px-3 py-1 md:px-4 md:py-1.5 bg-slate-400 text-white rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-100">{t.feasibilityLow}</span>;
  };

  const copyToClipboard = async (text: string, index: number | null = null) => {
    try {
      await navigator.clipboard.writeText(text);
      if (index !== null) {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      } else {
        setIsCopyingAll(true);
        setTimeout(() => setIsCopyingAll(false), 2000);
      }
    } catch (err) {
      console.error('Copy failed: ', err);
    }
  };

  const formatFullReport = () => {
    if (!data) return '';
    let report = `${t.reportDocTitle}\n\n`;
    report += `${t.reportAnalysisHeader}:\n${data.introduction}\n\n`;
    report += `${t.reportSolutionsHeader}:\n`;
    data.solutions.forEach((sol, i) => {
      report += `${i + 1}. ${sol.title}\n${lang === 'ar' ? 'الوصف' : 'Description'}: ${sol.description}\n${lang === 'ar' ? 'المبدأ' : 'Principle'}: ${sol.principleApplied}\n${lang === 'ar' ? 'الجدوى' : 'Feasibility'}: ${sol.feasibility}\n\n`;
    });
    report += `${t.reportActionPlan}:\n`;
    data.nextSteps.forEach((step, i) => {
      report += `- ${step}\n`;
    });
    return report;
  };

  const handleExportPDF = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-10 md:p-24 bg-white rounded-2xl md:rounded-[3rem] border border-slate-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] text-center space-y-8 md:space-y-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
           <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        
        <div className="flex flex-col items-center space-y-6 md:space-y-8">
          <div className="relative">
            <div className="w-20 h-20 md:w-32 md:h-32 bg-slate-50 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center text-indigo-600 animate-pulse border border-slate-100 shadow-inner">
              <svg className="w-10 h-10 md:w-16 md:h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.823.362 2.25 2.25 0 00-1.11 1.933c0 .324.032.65.097.967l.118.571a3 3 0 002.93 2.396h11.476a3 3 0 002.93-2.396l.118-.571a2.251 2.251 0 00-1.033-2.6z" />
              </svg>
            </div>
            <div className={`absolute -top-1 ${lang === 'ar' ? '-right-1' : '-left-1'} w-6 h-6 md:w-8 md:h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[8px] md:text-[10px] font-bold animate-bounce shadow-xl`}>
              AI
            </div>
          </div>
          
          <div className="space-y-2 md:space-y-4">
            <h4 className="text-xl md:text-4xl font-black text-slate-900 tracking-tight">{lang === 'ar' ? 'صياغة المستقبل الابتكاري' : 'Drafting Innovative Future'}</h4>
            <p className="text-slate-500 font-bold text-base md:text-xl italic px-4">{loadingMessage}</p>
          </div>

          <div className="w-full max-w-sm mx-auto space-y-3 md:space-y-4 px-4">
             <div className="h-2 md:h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
               <div 
                 className="bg-slate-900 h-full transition-all duration-500 ease-out shadow-[0_0_20px_rgba(0,0,0,0.2)]"
                 style={{ width: `${progress}%` }}
               />
             </div>
             <div className="flex justify-between items-center text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>{lang === 'ar' ? 'تريز انجن v2.5' : 'TRIZ Engine v2.5'}</span>
                <span>{Math.round(progress)}% {lang === 'ar' ? 'مكتمل' : 'Completed'}</span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8 md:p-12 bg-rose-50 border-2 border-dashed border-rose-200 rounded-2xl md:rounded-[3rem] text-center space-y-4 md:space-y-6">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mx-auto shadow-inner">
          <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 className="font-black text-xl md:text-2xl text-rose-900">{lang === 'ar' ? 'فشل في توليد الابتكار' : 'Failed to generate innovation'}</h4>
          <p className="text-rose-700 text-sm md:text-lg mt-2 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 md:px-8 md:py-3 bg-rose-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-rose-800"
          >
            {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000 px-1">
      {/* Success Badge */}
      <div className="max-w-4xl mx-auto flex items-center justify-between bg-slate-900 text-white p-4 md:p-6 rounded-2xl shadow-2xl relative overflow-hidden group print:hidden">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-10 h-10 md:w-14 md:h-14 bg-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <span className="text-[8px] md:text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] block mb-0.5 md:mb-1">{t.reportSuccess}</span>
            <h5 className="text-sm md:text-2xl font-black">{t.reportExtracted}</h5>
          </div>
        </div>
        <div className="hidden lg:block text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-50">Verified AI Output</div>
      </div>

      <div id="innovation-report-document" className="max-w-4xl mx-auto bg-white rounded-3xl md:rounded-[5rem] border border-slate-200 shadow-xl overflow-hidden print:rounded-none print:border-none print:shadow-none print:m-0 print:w-full">
        {/* Modern Engineering Header */}
        <div className="bg-slate-900 p-8 md:p-20 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className={`relative z-10 flex flex-col ${lang === 'ar' ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-6 md:gap-10`}>
            <div className="w-16 h-16 md:w-28 md:h-28 bg-indigo-600 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center shadow-2xl border-4 border-white/5 group">
              <svg className="w-10 h-10 md:w-16 md:h-16 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className={`text-center ${lang === 'ar' ? 'md:text-right' : 'md:text-left'} space-y-1 md:space-y-2`}>
              <span className="text-[8px] md:text-xs font-black uppercase tracking-[0.4em] text-indigo-400 block italic">{t.reportSystematic}</span>
              <h6 className="text-2xl md:text-6xl font-black tracking-tighter leading-none">{t.reportDocTitle}</h6>
              <div className={`flex items-center justify-center ${lang === 'ar' ? 'md:justify-start' : 'md:justify-end'} gap-3 md:gap-4 pt-2 md:pt-4`}>
                 <span className="w-8 md:w-10 h-0.5 bg-indigo-500 rounded-full"></span>
                 <span className="text-[8px] md:text-[9px] font-black uppercase text-slate-500 tracking-widest">TRIZ Certified Logic</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-24 space-y-10 md:space-y-20">
          {/* Analysis Introduction */}
          <section className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-3 md:gap-4">
               <h5 className="text-[8px] md:text-xs font-black text-indigo-600 uppercase tracking-[0.3em] md:tracking-[0.4em]">{t.reportAnalysisHeader}</h5>
               <div className="h-px bg-slate-100 flex-1 print:hidden"></div>
            </div>
            <p className="text-base md:text-3xl text-slate-900 leading-[1.6] md:leading-[1.6] font-bold tracking-tight">
              {data.introduction}
            </p>
          </section>

          {/* Detailed Solutions */}
          <section className="space-y-8 md:space-y-14">
            <div className="flex items-center gap-3 md:gap-4">
               <h5 className="text-[8px] md:text-xs font-black text-indigo-600 uppercase tracking-[0.3em] md:tracking-[0.4em]">{t.reportSolutionsHeader}</h5>
               <div className="h-px bg-slate-100 flex-1 print:hidden"></div>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:gap-16">
              {data.solutions.map((sol, idx) => (
                <div key={idx} className="group relative bg-white border border-slate-100 rounded-2xl md:rounded-[3rem] p-6 md:p-14 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 print:border-slate-200">
                  <div className={`absolute -top-3 md:-top-6 ${lang === 'ar' ? '-right-3 md:-right-6' : '-left-3 md:-left-6'} w-10 h-10 md:w-16 md:h-16 bg-slate-900 text-white rounded-xl md:rounded-3xl flex items-center justify-center font-black text-lg md:text-2xl shadow-2xl group-hover:bg-indigo-600 transition-colors`}>
                    {idx + 1}
                  </div>
                  
                  <div className={`flex flex-col ${lang === 'ar' ? 'md:flex-row' : 'md:flex-row-reverse'} justify-between items-start gap-4 md:gap-8 mb-6 md:mb-10`}>
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest">{t.reportSolutionLabel}</span>
                        <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-indigo-500"></div>
                      </div>
                      <h4 className="text-xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">{sol.title}</h4>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4 shrink-0 print:hidden">
                      {getFeasibilityBadge(sol.feasibility)}
                      <button 
                        onClick={() => copyToClipboard(`${sol.title}\n${sol.description}\nPrinciple: ${sol.principleApplied}`, idx)}
                        className={`w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl transition-all flex items-center justify-center shadow-lg ${copiedIndex === idx ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200'}`}
                      >
                        {copiedIndex === idx ? (
                          <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm md:text-2xl text-slate-600 mb-8 md:mb-12 leading-relaxed font-medium italic opacity-90">
                    {sol.description}
                  </p>
                  
                  <div className="bg-slate-50 border border-slate-100 rounded-xl md:rounded-[2rem] p-4 md:p-8 flex flex-row items-center gap-4 md:gap-8 group/footer print:bg-white print:border-slate-200">
                    <div className="w-10 h-10 md:w-16 md:h-16 bg-white rounded-lg md:rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 shrink-0">
                      <svg className="w-5 h-5 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                      </svg>
                    </div>
                    <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                      <span className="text-[8px] md:text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] block mb-0.5 md:mb-1">{t.principleLabel}</span>
                      <span className="text-slate-900 font-black text-sm md:text-xl block leading-tight">{sol.principleApplied}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Action Plan Checklist */}
          <section className="bg-slate-900 rounded-[2rem] md:rounded-[5rem] p-8 md:p-20 text-white space-y-8 md:space-y-12 relative overflow-hidden print:bg-slate-100 print:text-slate-900 print:rounded-2xl print:p-10">
            <div className="absolute top-0 left-0 w-20 h-20 bg-indigo-500/20 blur-[60px] rounded-full print:hidden"></div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 relative z-10">
              <div className="space-y-1 md:space-y-2">
                <span className="text-[8px] md:text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] print:text-indigo-600">Action Plan</span>
                <h5 className="text-2xl md:text-5xl font-black tracking-tighter">{t.reportActionPlan}</h5>
              </div>
              <div className="px-4 py-1.5 border border-white/10 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 print:border-slate-200">{t.reportRoadmap}</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-10">
              {data.nextSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 md:gap-6 bg-white/5 border border-white/10 p-4 md:p-6 rounded-xl md:rounded-[1.5rem] group hover:bg-white/10 transition-all print:bg-white print:border-slate-200">
                  <div className="mt-1 w-5 h-5 md:w-6 md:h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all shrink-0">
                    <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm md:text-lg font-bold text-slate-200 leading-snug print:text-slate-800">{step}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Document Footer */}
          <div className="pt-8 md:pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-slate-400 print:border-slate-200">
             <div className="flex items-center gap-3 md:gap-4">
               <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-50 rounded-lg flex items-center justify-center text-indigo-600 font-black text-xs print:bg-white print:border print:border-slate-200">TRIZ</div>
               <div className="flex flex-col">
                 <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-900">{lang === 'ar' ? 'محرك TRIZ Master v2.5' : 'TRIZ Master Engine v2.5'}</span>
                 <span className="text-[7px] md:text-[9px] font-bold uppercase text-slate-400">Scientific Protocol</span>
               </div>
             </div>
             
             <div className="flex items-center gap-4 md:gap-6 print:hidden">
               <button 
                 onClick={() => copyToClipboard(formatFullReport())}
                 className={`flex items-center gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-3 rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all ${isCopyingAll ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white shadow-sm'}`}
               >
                 <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                 </svg>
                 {isCopyingAll ? t.reportCopied : t.reportCopy}
               </button>
               <button 
                 onClick={handleExportPDF}
                 className="flex items-center gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-3 bg-indigo-600 text-white rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"
               >
                 <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                 </svg>
                 {t.reportExport}
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnovationReport;
