import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Home, BookOpen, Languages, ListTree } from 'lucide-react';

const LINKS = [
  { to: '/', label: 'Homepage', icon: Home, end: true },
  { to: '/bangla-translator-1', label: 'Bangla Translator 1.0', icon: BookOpen },
  { to: '/bangla-translator-2', label: 'Bangla Translator 2.0', icon: BookOpen },
  { to: '/english-translator-1', label: 'English Translator 1.0', icon: Languages },
  { to: '/english-translator-2', label: 'English Translator 2.0', icon: Languages },
  { to: '/html-toc-studio', label: 'HTML ToC Studio', icon: ListTree },
];

// A small floating button fixed to the corner of the viewport, present on
// every page. It sits ABOVE the page content (z-[9999]) so it never
// interferes with any tool's own internal `h-screen` layout, header, or
// scrolling — it's simply an overlay for jumping between the 6 pages of
// the site.
export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div
      ref={panelRef}
      className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-2"
      style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
    >
      {open && (
        <div className="mb-1 w-64 rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 overflow-hidden animate-[fadeIn_0.15s_ease-out]">
          <div className="px-4 py-3 bg-slate-900 text-white">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Site Menu</p>
            <p className="text-sm font-bold">Translator Suite</p>
          </div>
          <nav className="p-1.5">
            {LINKS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon size={16} className="shrink-0" />
                <span className="truncate">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center transition-all active:scale-95"
        title="Site menu"
        aria-label="Toggle site menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
    </div>
  );
}
