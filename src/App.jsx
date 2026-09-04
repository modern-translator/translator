import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import SiteNav from './components/SiteNav.jsx';
import Home from './pages/Home.jsx';
import BanglaTranslator1 from './pages/BanglaTranslator1.jsx';
import BanglaTranslator2 from './pages/BanglaTranslator2.jsx';
import EnglishTranslator1 from './pages/EnglishTranslator1.jsx';
import EnglishTranslator2 from './pages/EnglishTranslator2.jsx';
import HtmlTocStudio from './pages/HtmlTocStudio.jsx';

// HashRouter is used (URLs look like /#/bangla-translator-1) instead of
// BrowserRouter because GitHub Pages serves static files with no server-side
// rewrite rules. HashRouter works out of the box with zero extra config and
// never produces a 404 on refresh or direct-link, on any repo name.
export default function App() {
  return (
    <HashRouter>
      <SiteNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bangla-translator-1" element={<BanglaTranslator1 />} />
        <Route path="/bangla-translator-2" element={<BanglaTranslator2 />} />
        <Route path="/english-translator-1" element={<EnglishTranslator1 />} />
        <Route path="/english-translator-2" element={<EnglishTranslator2 />} />
        <Route path="/html-toc-studio" element={<HtmlTocStudio />} />
      </Routes>
    </HashRouter>
  );
}
