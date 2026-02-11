
import React, { useState, useEffect } from 'react';
import { Language, translations } from './translations';

interface Props {
  lang: Language;
  onToggleLang: () => void;
}

const Header: React.FC<Props> = ({ lang, onToggleLang }) => {
  const [activeHash, setActiveHash] = useState(window.location.hash || '#/');
  const t = translations[lang];

  useEffect(() => {
    const handleHashChange = () => setActiveHash(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navLinkClass = (hash: string) => `
    relative py-2 text-[9px] md:text-[11px] font-bold uppercase tracking-[0.1em] md:tracking-[0.15em] transition-all duration-300
    ${activeHash === hash 
      ? 'text-indigo-600' 
      : 'text-slate-400 hover:text-slate-600'}
  `;

  const activeIndicator = (hash: string) => activeHash === hash && (
    <span className="absolute -bottom-1 right-0 left-0 h-0.5 bg-indigo-600 rounded-full animate-in fade-in slide-in-from-bottom-1" />
  );

  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 print:hidden">
      <div className="max-w-7xl mx-auto px-4 h-14 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4 group cursor-pointer" onClick={() => window.location.hash = '#/'}>
          <div className="w-8 h-8 md:w-12 md:h-12 bg-indigo-600 rounded-lg md:rounded-[1rem] flex items-center justify-center text-white font-black text-base md:text-2xl shadow-xl shadow-indigo-100 group-hover:scale-105 transition-transform">
            T
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs md:text-xl font-black text-slate-900 tracking-tight leading-none mb-0.5 md:mb-1">
              {t.title}
            </h1>
            <p className="hidden xs:block text-[7px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {t.subtitle}
            </p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          <a href="#/" className={navLinkClass('#/')}>
            {t.navHome}
            {activeIndicator('#/')}
          </a>
          <a href="#/matrix" className={navLinkClass('#/matrix')}>
            {t.navMatrix}
            {activeIndicator('#/matrix')}
          </a>
          <a href="#/principles" className={navLinkClass('#/principles')}>
            {t.navPrinciples}
            {activeIndicator('#/principles')}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <button 
            onClick={onToggleLang}
            className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg md:rounded-xl text-[10px] md:text-[12px] font-black hover:bg-slate-200 transition-all active:scale-95 uppercase"
          >
            {lang === 'ar' ? 'EN' : 'AR'}
          </button>
          
          <button 
            onClick={() => window.location.hash = '#/'}
            className="flex items-center gap-1 bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[11px] font-bold hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
          >
            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">{t.newProject}</span>
            <span className="sm:hidden">{t.projectShort}</span>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Bar */}
      <nav className="md:hidden flex items-center justify-around border-t border-slate-100 py-1.5 bg-white/50">
          <a href="#/" className={navLinkClass('#/')}>
            {t.navHome}
            {activeIndicator('#/')}
          </a>
          <a href="#/matrix" className={navLinkClass('#/matrix')}>
            {t.navMatrix}
            {activeIndicator('#/matrix')}
          </a>
          <a href="#/principles" className={navLinkClass('#/principles')}>
            {t.navPrinciples}
            {activeIndicator('#/principles')}
          </a>
      </nav>
    </header>
  );
};

export default Header;
