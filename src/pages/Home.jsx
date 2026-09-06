import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Languages, ListTree, ShieldCheck, Lock, AlertTriangle, Wrench, Compass, Info, ExternalLink } from 'lucide-react';

const SECTIONS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'tools', label: 'The Tools' },
  { id: 'setup', label: 'Gemini API Setup' },
  { id: 'guide', label: 'How To Translate a Book' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'safety', label: 'Safety' },
  { id: 'privacy', label: 'Privacy' },
];

const TOOLS = [
  {
    to: '/bangla-translator-1',
    icon: BookOpen,
    name: 'Bangla Translator 1.0',
    details: {
      'Model Strength': 'Rotates automatically between Flash and Flash-Lite models for higher request throughput.',
      'Default Model': 'Gemini Flash-Lite, upgrading to Flash automatically when needed.',
      'Buttons Introduction': 'Sync Text re-translates a single page. Reset restores the original extraction. Re-extract runs layout extraction again from scratch.',
      'Supported Language': 'Arabic, Urdu and English.',
      'Translated Language': 'Bangla.',
    },
  },
  {
    to: '/bangla-translator-2',
    icon: BookOpen,
    name: 'Bangla Translator 2.0',
    details: {
      'Model Strength': 'Uses a single consistent model for the most reliable layout fidelity.',
      'Default Model': 'Gemini Flash.',
      'Buttons Introduction': 'Sync Text re-translates a single page. Reset restores the original extraction. Re-extract runs layout extraction again from scratch.',
      'Supported Language': 'Arabic, Urdu and English.',
      'Translated Language': 'Bangla.',
    },
  },
  {
    to: '/english-translator-1',
    icon: Languages,
    name: 'English Translator 1.0',
    details: {
      'Model Strength': 'Rotates automatically between Flash and Flash-Lite models for higher request throughput.',
      'Default Model': 'Gemini Flash-Lite, upgrading to Flash automatically when needed.',
      'Buttons Introduction': 'Sync Text re-translates a single page. Reset restores the original extraction. Re-extract runs layout extraction again from scratch.',
      'Supported Language': 'Arabic and Urdu.',
      'Translated Language': 'English.',
    },
  },
  {
    to: '/english-translator-2',
    icon: Languages,
    name: 'English Translator 2.0',
    details: {
      'Model Strength': 'Uses a single consistent model for the most reliable layout fidelity.',
      'Default Model': 'Gemini Flash.',
      'Buttons Introduction': 'Sync Text re-translates a single page. Reset restores the original extraction. Re-extract runs layout extraction again from scratch.',
      'Supported Language': 'Arabic and Urdu.',
      'Translated Language': 'English.',
    },
  },
];

const TOC_STUDIO_DETAILS = {
  'What It Does': 'Builds a nested, collapsible table of contents for an already translated HTML document.',
  'Import': 'Reads sections and headings directly from an uploaded HTML file, with no upload to any server.',
  'Editing': 'Reorder, rename, group into folders or exclude entries from the table of contents, with a live preview of the rendered page.',
  'Export': 'Downloads a clean, ready to publish HTML file with the finished table of contents built in.',
};

// A small click-to-toggle "Details" indicator. Only one instance is open at a
// time across the whole page; clicking elsewhere closes it. This keeps the
// tool list compact while still surfacing the specifics on demand, and works
// the same way on touch devices as it does with a mouse.
function DetailsToggle({ id, openId, setOpenId, registerRef, fields, align = 'left' }) {
  const isOpen = openId === id;

  return (
    <div
      ref={(el) => registerRef(id, el)}
      className="relative shrink-0"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => setOpenId(isOpen ? null : id)}
        title="Details"
        aria-label="Show details"
        className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
          isOpen
            ? 'bg-[#14213D] border-[#14213D] text-white'
            : 'bg-white border-[#D8D2C2] text-[#8A8372] hover:border-[#B08D57] hover:text-[#B08D57]'
        }`}
      >
        <Info size={14} />
      </button>

      {isOpen && (
        <div
          className={`absolute z-20 mt-2 w-80 max-w-[85vw] rounded-xl border border-[#E7E3D8] bg-white shadow-xl p-4 space-y-3 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {Object.entries(fields).map(([label, value]) => (
            <div key={label}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#B08D57]">{label}</p>
              <p className="text-sm text-[#374151] leading-relaxed text-justify mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [active, setActive] = useState('introduction');
  const [openId, setOpenId] = useState(null);
  const popoverRefs = useRef({});

  const registerRef = (id, el) => {
    popoverRefs.current[id] = el;
  };

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

  useEffect(() => {
    if (!openId) return;
    const handleClick = (e) => {
      const node = popoverRefs.current[openId];
      if (node && !node.contains(e.target)) setOpenId(null);
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpenId(null);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [openId]);

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
        <p className="mt-6 text-lg text-[#4B5563] max-w-xl leading-relaxed text-justify">
          These tools read Arabic, Urdu, or English pages, keep the original layout intact and
          translate them into Bangla or English using Google's Gemini models. Everything runs
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
            <div className="prose-sm text-[#374151] leading-relaxed space-y-4 max-w-2xl text-justify">
              <p>
                Translating a scanned or typed book usually breaks its structure. Headings turn
                into plain paragraphs, footnotes drift out of place and page boundaries get lost.
                This suite is built around one idea: extract the page's layout first, translate the
                text second and never let the second step disturb the first.
              </p>
              <p>
                Each tool runs entirely client-side. Nothing you upload is sent to any server.
                Text only ever travels between your browser and Google's Gemini API.
              </p>
            </div>
          </section>

          <section id="tools" className="scroll-mt-20">
            <h2 className="serif text-3xl font-semibold text-[#14213D] mb-6">The Tools</h2>
            <div className="divide-y divide-[#E7E3D8] border-y border-[#E7E3D8]">
              {TOOLS.map((t) => (
                <div key={t.to} className="flex items-center gap-4 py-5 group -mx-3 px-3 rounded-lg hover:bg-white/60 transition-colors">
                  <Link to={t.to} className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#14213D]/5 flex items-center justify-center text-[#14213D] shrink-0">
                      <t.icon size={17} />
                    </div>
                    <p className="font-semibold text-[#14213D] group-hover:text-[#B08D57] transition-colors truncate">{t.name}</p>
                  </Link>
                  <DetailsToggle
                    id={t.to}
                    openId={openId}
                    setOpenId={setOpenId}
                    registerRef={registerRef}
                    fields={t.details}
                    align="right"
                  />
                </div>
              ))}

              <div className="flex items-center gap-4 py-5 group -mx-3 px-3 rounded-lg hover:bg-white/60 transition-colors">
                <Link to="/html-toc-studio" className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#14213D]/5 flex items-center justify-center text-[#14213D] shrink-0">
                    <ListTree size={17} />
                  </div>
                  <p className="font-semibold text-[#14213D] group-hover:text-[#B08D57] transition-colors truncate">HTML ToC Studio</p>
                </Link>
                <DetailsToggle
                  id="/html-toc-studio"
                  openId={openId}
                  setOpenId={setOpenId}
                  registerRef={registerRef}
                  fields={TOC_STUDIO_DETAILS}
                  align="right"
                />
              </div>
            </div>
          </section>

          <section id="setup" className="scroll-mt-20">
            <h2 className="serif text-3xl font-semibold text-[#14213D] mb-4 flex items-center gap-2">
              <Wrench size={24} className="text-[#B08D57]" /> Gemini API Setup
            </h2>
            <div className="max-w-2xl">
              <p className="text-[#374151] leading-relaxed text-justify mb-6">
                Our translator tools are based on Gemini models. You need a Gemini API key to run
                the translator tools.
              </p>

              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="serif text-lg font-semibold text-[#B08D57] w-6 shrink-0">1</span>
                  <p className="text-sm text-[#374151] leading-relaxed text-justify mt-0.5">
                    Go to{' '}
                    <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="font-bold text-[#14213D] underline decoration-[#B08D57] underline-offset-2 inline-flex items-center gap-1">
                      Google AI Studio <ExternalLink size={12} />
                    </a>.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="serif text-lg font-semibold text-[#B08D57] w-6 shrink-0">2</span>
                  <p className="text-sm text-[#374151] leading-relaxed text-justify mt-0.5">
                    <strong>Login</strong> into your Google Account.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="serif text-lg font-semibold text-[#B08D57] w-6 shrink-0">3</span>
                  <p className="text-sm text-[#374151] leading-relaxed text-justify mt-0.5">
                    Go to the <strong>Dashboard</strong>.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="serif text-lg font-semibold text-[#B08D57] w-6 shrink-0">4</span>
                  <p className="text-sm text-[#374151] leading-relaxed text-justify mt-0.5">
                    Click <strong>Projects</strong>.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="serif text-lg font-semibold text-[#B08D57] w-6 shrink-0">5</span>
                  <div className="flex-1">
                    <p className="text-sm text-[#374151] leading-relaxed text-justify mt-0.5">
                      Click <strong>Create a New Project</strong> and name your project.
                    </p>
                    <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                      <p className="text-xs text-amber-900 leading-relaxed text-justify">
                        <strong>Caution:</strong> use a random project name, such as "Vibe Coding" or
                        "Python Programming", that doesn't look like it will be used for translator
                        tools.
                      </p>
                    </div>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="serif text-lg font-semibold text-[#B08D57] w-6 shrink-0">6</span>
                  <div className="flex-1">
                    <p className="text-sm text-[#374151] leading-relaxed text-justify mt-0.5">
                      While creating the project, an interface to create a <strong>Gemini API Key</strong>{' '}
                      will appear. Name your API key.
                    </p>
                    <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                      <p className="text-xs text-amber-900 leading-relaxed text-justify">
                        <strong>Caution:</strong> use a random name for the API key too.
                      </p>
                    </div>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="serif text-lg font-semibold text-[#B08D57] w-6 shrink-0">7</span>
                  <p className="text-sm text-[#374151] leading-relaxed text-justify mt-0.5">
                    You can now see <strong>1 Project</strong> with <strong>1 Key</strong>.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="serif text-lg font-semibold text-[#B08D57] w-6 shrink-0">8</span>
                  <p className="text-sm text-[#374151] leading-relaxed text-justify mt-0.5">
                    You can create up to <strong>10 free projects</strong> and each project should
                    contain at least <strong>1 API Key</strong>.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="serif text-lg font-semibold text-[#B08D57] w-6 shrink-0">9</span>
                  <div className="flex-1">
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                      <p className="text-xs text-amber-900 leading-relaxed text-justify">
                        <strong>Caution:</strong> don't create more than <strong>10 projects</strong>{' '}
                        and don't create more than <strong>1 API Key</strong> inside a single project.
                        The Gemini model usage limit of 1 API key under 1 project is the same as the
                        usage limit of 2, 3 or 10 API keys under that same project, so creating more
                        than one key per project is unnecessary.
                      </p>
                    </div>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="serif text-lg font-semibold text-[#B08D57] w-6 shrink-0">10</span>
                  <p className="text-sm text-[#374151] leading-relaxed text-justify mt-0.5">
                    When a project with its API key has been created, click the key. It will look
                    something like <strong>........aADQ</strong>. Click it to open the details.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="serif text-lg font-semibold text-[#B08D57] w-6 shrink-0">11</span>
                  <p className="text-sm text-[#374151] leading-relaxed text-justify mt-0.5">
                    The API key details will be shown. Copy the <strong>API key</strong>, which you
                    need to run the translator apps.
                  </p>
                </li>
              </ol>
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
                ['Extract layout', 'Each page is analyzed once so headings, paragraphs and footnotes are identified before translation.'],
                ['Translate and review', 'Pages are translated in order, respecting a fixed gap between API requests. Review, fix split sentences with Sync Text, or re-extract a page if needed.'],
                ['Export', 'Download the finished, formatted result when every page is ready.'],
              ].map(([title, body], i) => (
                <li key={title} className="flex gap-4">
                  <span className="serif text-lg font-semibold text-[#B08D57] w-6 shrink-0">{i + 1}</span>
                  <div>
                    <p className="font-semibold text-[#14213D]">{title}</p>
                    <p className="text-sm text-[#6B7280] mt-0.5 text-justify">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="limitations" className="scroll-mt-20">
            <h2 className="serif text-3xl font-semibold text-[#14213D] mb-4 flex items-center gap-2">
              <AlertTriangle size={24} className="text-[#B08D57]" /> AI Translator Limitations
            </h2>
            <div className="text-[#374151] leading-relaxed space-y-4 max-w-2xl text-justify">
              <p>
                Machine translation of Arabic, Urdu and classical or religious texts can misread
                diacritics, idioms and ambiguous grammar. Layout extraction can occasionally merge or
                split a paragraph incorrectly, especially across a page boundary. That's what the
                Sync Text and re-extract tools are for.
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
            <div className="text-[#374151] leading-relaxed space-y-4 max-w-2xl text-justify">
              <p>
                Requests are automatically spaced to respect Gemini's rate limits, so normal use won't
                exhaust or lock your API key. If a key does run out of quota, the tool simply reports
                it and waits. It never silently drops your work.
              </p>
            </div>
          </section>

          <section id="privacy" className="scroll-mt-20 pb-8">
            <h2 className="serif text-3xl font-semibold text-[#14213D] mb-4 flex items-center gap-2">
              <Lock size={24} className="text-[#B08D57]" /> Privacy
            </h2>
            <div className="text-[#374151] leading-relaxed space-y-4 max-w-2xl text-justify">
              <p>
                This site has no backend and no analytics. Your uploaded file, extracted pages and
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
