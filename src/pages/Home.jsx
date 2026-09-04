import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Languages, ListTree, ShieldCheck, Lock, AlertTriangle, Wrench, Compass } from 'lucide-react';

const SECTIONS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'tools', label: 'The Tools' },
  { id: 'guide', label: 'How To Translate a Book' },
  { id: 'setup', label: 'Setup' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'safety', label: 'Safety' },
  { id: 'privacy', label: 'Privacy' },
];

const TOOLS = [
  {
    to: '/bangla-translator-1',
    icon: BookOpen,
    name: 'Bangla Translator 1.0',
    desc: 'Arabic / Urdu / English \u2192 Bangla. Mixed Flash + Flash-Lite model rotation for higher throughput.',
  },
  {
    to: '/bangla-translator-2',
    icon: BookOpen,
    name: 'Bangla Translator 2.0',
    desc: 'Arabic / Urdu / English \u2192 Bangla. Single Flash model, tuned for the most consistent layout fidelity.',
  },
  {
    to: '/english-translator-1',
    icon: Languages,
    name: 'English Translator 1.0',
    desc: 'Arabic / Urdu \u2192 English. Mixed Flash + Flash-Lite model rotation for higher throughput.',
  },
  {
    to: '/english-translator-2',
    icon: Languages,
    name: 'English Translator 2.0',
    desc: 'Arabic / Urdu \u2192 English. Single Flash model, tuned for the most consistent layout fidelity.',
  },
  {
    to: '/html-toc-studio',
    icon: ListTree,
    name: 'HTML ToC Studio',
    desc: 'Build and edit a nested table of contents for an HTML manuscript, then export it.',
  },
];

export default function Home() {
  const [active, setActive] = useState('introduction');

  useEffect(() => {
    const onScroll = () => {
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 120) current = s.id;
      }
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1D2333]" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <style>{`
        .serif { font-family: 'Source Serif 4', Georgia, serif; }
      `}</style>

      {/* Hero */}
      <header className="border-b border-[#E7E3D8] px-6 md:px-12 pt-16 pb-14 max-w-5xl mx-auto">
        <p className="text-sm font-semibold text-[#B08D57] mb-3">A small suite of five tools</p>
        <h1 className="serif text-[2.75rem] md:text-6xl leading-[1.05] font-semibold text-[#14213D] max-w-3xl">
          Move a book from one script to another, page by page, without losing its shape.
        </h1>
        <p className="mt-6 text-lg text-[#4B5563] max-w-xl leading-relaxed">
          These tools read Arabic, Urdu, or English pages, keep the original layout intact,
          and translate them into Bangla or English using Google's Gemini models &mdash;
          entirely inside your browser.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/bangla-translator-1" className="px-5 py-2.5 rounded-lg bg-[#14213D] text-white text-sm font-semibold hover:bg-[#1D2E52] transition-colors">
            Start translating to Bangla
          </Link>
          <Link to="/english-translator-1" className="px-5 py-2.5 rounded-lg border border-[#14213D] text-[#14213D] text-sm font-semibold hover:bg-[#14213D] hover:text-white transition-colors">
            Start translating to English
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 md:px-12 flex gap-12">
        {/* Table of contents */}
        <nav className="hidden md:block w-48 shrink-0 py-14">
          <div className="sticky top-14">
            <p className="text-xs font-semibold text-[#9CA3AF] mb-3">On this page</p>
            <ul className="space-y-1 border-l border-[#E7E3D8]">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`block pl-4 -ml-px py-1.5 text-sm border-l-2 transition-colors ${
                      active === s.id
                        ? 'border-[#B08D57] text-[#14213D] font-semibold'
                        : 'border-transparent text-[#6B7280] hover:text-[#14213D]'
                    }`}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 min-w-0 py-14 space-y-20">
          <section id="introduction" className="scroll-mt-20">
            <h2 className="serif text-3xl font-semibold text-[#14213D] mb-4">Introduction</h2>
            <div className="prose-sm text-[#374151] leading-relaxed space-y-4 max-w-2xl">
              <p>
                Translating a scanned or typed book usually breaks its structure &mdash; headings turn
                into plain paragraphs, footnotes drift out of place, and page boundaries get lost.
                This suite is built around one idea: extract the page's layout first, translate the
                text second, and never let the second step disturb the first.
              </p>
              <p>
                Each tool runs entirely client-side. Nothing you upload is sent to any server owned by
                this project &mdash; text only ever travels between your browser and Google's Gemini
                API, using an API key you provide yourself.
              </p>
            </div>
          </section>

          <section id="tools" className="scroll-mt-20">
            <h2 className="serif text-3xl font-semibold text-[#14213D] mb-2">The Tools</h2>
            <p className="text-[#4B5563] mb-6 max-w-2xl">Five focused tools, each doing one job well.</p>
            <div className="divide-y divide-[#E7E3D8] border-y border-[#E7E3D8]">
              {TOOLS.map((t) => (
                <Link
                  key={t.to}
                  to={t.to}
                  className="flex items-start gap-4 py-5 group hover:bg-white/60 transition-colors -mx-3 px-3 rounded-lg"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#14213D]/5 flex items-center justify-center text-[#14213D] shrink-0 mt-0.5">
                    <t.icon size={17} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#14213D] group-hover:text-[#B08D57] transition-colors">{t.name}</p>
                    <p className="text-sm text-[#6B7280] mt-0.5">{t.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section id="guide" className="scroll-mt-20">
            <h2 className="serif text-3xl font-semibold text-[#14213D] mb-4 flex items-center gap-2">
              <Compass size={24} className="text-[#B08D57]" /> How To Translate a Book
            </h2>
            <ol className="space-y-4 max-w-2xl">
              {[
                ['Pick a tool', 'Choose the Bangla or English translator that matches your source language and open it.'],
                ['Add your API key', 'Paste a free Gemini API key into Settings. It stays in your browser only.'],
                ['Upload your file', 'Upload a PDF or text file. The tool splits it into pages automatically.'],
                ['Extract layout', 'Each page is analyzed once so headings, paragraphs, and footnotes are identified before translation.'],
                ['Translate & review', 'Pages are translated in order, respecting a fixed gap between API requests. Review, fix split sentences with Sync Text, or re-extract a page if needed.'],
                ['Export', 'Download the finished, formatted result when every page is ready.'],
              ].map(([title, body], i) => (
                <li key={title} className="flex gap-4">
                  <span className="serif text-lg font-semibold text-[#B08D57] w-6 shrink-0">{i + 1}</span>
                  <div>
                    <p className="font-semibold text-[#14213D]">{title}</p>
                    <p className="text-sm text-[#6B7280] mt-0.5">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="setup" className="scroll-mt-20">
            <h2 className="serif text-3xl font-semibold text-[#14213D] mb-4 flex items-center gap-2">
              <Wrench size={24} className="text-[#B08D57]" /> Setup
            </h2>
            <div className="text-[#374151] leading-relaxed space-y-4 max-w-2xl">
              <p>
                You need a Gemini API key, free to create at{' '}
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-[#14213D] underline decoration-[#B08D57] underline-offset-2">
                  Google AI Studio
                </a>. Open any translator tool, click Settings, and paste it in. You can add more than
                one key &mdash; the tools rotate between them automatically when one runs low.
              </p>
              <p>
                Each of the five tools keeps its own saved API key and session in your browser, so
                switching tools never overwrites work in progress elsewhere on this site.
              </p>
            </div>
          </section>

          <section id="limitations" className="scroll-mt-20">
            <h2 className="serif text-3xl font-semibold text-[#14213D] mb-4 flex items-center gap-2">
              <AlertTriangle size={24} className="text-[#B08D57]" /> AI Translator Limitations
            </h2>
            <div className="text-[#374151] leading-relaxed space-y-4 max-w-2xl">
              <p>
                Machine translation of Arabic, Urdu, and classical or religious texts can misread
                diacritics, idioms, and ambiguous grammar. Layout extraction can occasionally merge or
                split a paragraph incorrectly, especially across a page boundary &mdash; that's what
                the Sync Text and re-extract tools are for.
              </p>
              <p>
                Treat the output as a strong first draft. For publication-quality or scholarly work,
                have a fluent reader review the translation against the original.
              </p>
            </div>
          </section>

          <section id="safety" className="scroll-mt-20">
            <h2 className="serif text-3xl font-semibold text-[#14213D] mb-4 flex items-center gap-2">
              <ShieldCheck size={24} className="text-[#B08D57]" /> Safety
            </h2>
            <div className="text-[#374151] leading-relaxed space-y-4 max-w-2xl">
              <p>
                Requests are automatically spaced to respect Gemini's rate limits, so normal use won't
                exhaust or lock your API key. If a key does run out of quota, the tool simply reports
                it and waits &mdash; it never silently drops your work.
              </p>
            </div>
          </section>

          <section id="privacy" className="scroll-mt-20 pb-8">
            <h2 className="serif text-3xl font-semibold text-[#14213D] mb-4 flex items-center gap-2">
              <Lock size={24} className="text-[#B08D57]" /> Privacy
            </h2>
            <div className="text-[#374151] leading-relaxed space-y-4 max-w-2xl">
              <p>
                This site has no backend and no analytics. Your uploaded file, extracted pages, and
                translations exist only in your browser's memory and local storage, on your device.
                Closing the tab clears anything not explicitly saved.
              </p>
              <p>
                The only outside connection each tool makes is directly to Google's Gemini API, using
                the key you supply, to translate the text you send it.
              </p>
            </div>
          </section>
        </main>
      </div>

      <footer className="border-t border-[#E7E3D8] py-8 text-center text-sm text-[#9CA3AF]">
        Built for readers who don't want to choose between accuracy and page layout.
      </footer>
    </div>
  );
}
