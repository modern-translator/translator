import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Folder,
  FolderPlus,
  FileText,
  ChevronRight,
  ChevronDown,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Eye,
  Code,
  Download,
  Upload,
  Check,
  CheckSquare,
  Square,
  ShieldCheck,
  BookOpen,
  RefreshCw,
  Layers,
  FileCode,
  PlusCircle
} from 'lucide-react';

export default function App() {
  const [htmlRaw, setHtmlRaw] = useState('');
  const [docTitle, setDocTitle] = useState(''); 
  const [sections, setSections] = useState([]); 
  const [tocTree, setTocTree] = useState([]); 
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [activeTab, setActiveTab] = useState('preview'); 
  const [notification, setNotification] = useState(null);

  // Settings State
  const [sidebarWidth] = useState(320);
  const [sidebarPosition] = useState('left'); 
  const [themeColor] = useState('#2563eb');

  const fileInputRef = useRef(null);

  const showToast = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const parseHtmlContent = (rawText) => {
    if (!rawText.trim()) return;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawText, 'text/html');

      let parsedSections = [];
      const sectionElements = doc.querySelectorAll('section, article, .section-card, [id^="section-"]');

      if (sectionElements.length > 0) {
        sectionElements.forEach((el, index) => {
          const id = el.getAttribute('id') || `sec-${index + 1}`;
          const headerEl = el.querySelector('h1, h2, h3, h4, .section-title');
          const title = headerEl ? headerEl.textContent.trim() : `Section ${index + 1}`;
          const isRtl = el.getAttribute('dir') === 'rtl' || el.classList.contains('rtl');

          parsedSections.push({
            id,
            originalTitle: title,
            htmlContent: el.innerHTML,
            rtl: isRtl
          });
        });
      } else {
        const headers = doc.querySelectorAll('h1, h2, h3');
        if (headers.length > 0) {
          headers.forEach((h, idx) => {
            const id = h.getAttribute('id') || `sec-${idx + 1}`;
            let content = h.outerHTML;
            let next = h.nextElementSibling;
            while (next && !['H1', 'H2', 'H3'].includes(next.tagName)) {
              content += next.outerHTML;
              next = next.nextElementSibling;
            }
            parsedSections.push({
              id,
              originalTitle: h.textContent.trim() || `Section ${idx + 1}`,
              htmlContent: content,
              rtl: false
            });
          });
        } else {
          parsedSections.push({
            id: 'sec-1',
            originalTitle: 'Main Content',
            htmlContent: doc.body ? doc.body.innerHTML : rawText,
            rtl: false
          });
        }
      }

      setSections(parsedSections);

      // Requirement: Keep ToC tree EMPTY on import
      setTocTree([]);
      setDocTitle(''); // Keep title empty on import

      if (parsedSections.length > 0) {
        setSelectedSectionId(parsedSections[0].id);
      }

      showToast(`Successfully parsed ${parsedSections.length} sections!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Error parsing HTML file.', 'error');
    }
  };

  useEffect(() => {
    // Full Document View starts blank by default (no demo/sample content).
    // Inject Kalpurush Font stylesheet dynamically, still needed for both the
    // editor UI and the exported HTML's Bangla text rendering.
    if (!document.querySelector('#kalpurush-font')) {
      const link = document.createElement('link');
      link.id = 'kalpurush-font';
      link.href = 'https://fonts.maateen.me/kalpurush/font.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setHtmlRaw(content);
      parseHtmlContent(content);
    };
    reader.readAsText(file);
  };

  const updateTreeRecursively = (nodes, targetId, updateFn) => {
    return nodes.map((node) => {
      if (node.id === targetId) {
        return updateFn(node);
      }
      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: updateTreeRecursively(node.children, targetId, updateFn)
        };
      }
      return node;
    });
  };

  const removeNodeFromTree = (nodes, targetId) => {
    return nodes
      .filter((node) => node.id !== targetId)
      .map((node) => ({
        ...node,
        children: node.children ? removeNodeFromTree(node.children, targetId) : []
      }));
  };

  const addFolder = (parentId = null) => {
    const newFolder = {
      id: `folder-${Date.now()}`,
      type: 'folder',
      title: 'New Category',
      included: true,
      open: true,
      children: []
    };

    if (!parentId) {
      setTocTree([...tocTree, newFolder]);
    } else {
      setTocTree((prev) =>
        updateTreeRecursively(prev, parentId, (parent) => ({
          ...parent,
          open: true,
          children: [...parent.children, newFolder]
        }))
      );
    }
    setSelectedNodeId(newFolder.id);
  };

  const addSectionToToc = (sec) => {
    const newItem = {
      id: `node-${Date.now()}-${sec.id}`,
      type: 'item',
      title: sec.originalTitle,
      sectionId: sec.id,
      included: true,
      children: []
    };
    setTocTree((prev) => [...prev, newItem]);
    showToast(`Added "${sec.originalTitle}" to Table of Contents`, 'success');
  };

  const renameNode = (nodeId, newTitle) => {
    setTocTree((prev) =>
      updateTreeRecursively(prev, nodeId, (node) => ({
        ...node,
        title: newTitle
      }))
    );
  };

  const toggleIncludeNode = (nodeId) => {
    setTocTree((prev) =>
      updateTreeRecursively(prev, nodeId, (node) => {
        const nextIncluded = !node.included;
        const toggleChildren = (childs) =>
          childs.map((c) => ({
            ...c,
            included: nextIncluded,
            children: c.children ? toggleChildren(c.children) : []
          }));

        return {
          ...node,
          included: nextIncluded,
          children: node.children ? toggleChildren(node.children) : []
        };
      })
    );
  };

  const toggleFolderOpen = (folderId) => {
    setTocTree((prev) =>
      updateTreeRecursively(prev, folderId, (node) => ({
        ...node,
        open: !node.open
      }))
    );
  };

  const moveNodeOrder = (nodeId, direction) => {
    const swapInArray = (arr) => {
      const idx = arr.findIndex((n) => n.id === nodeId);
      if (idx === -1) {
        return arr.map((n) =>
          n.children ? { ...n, children: swapInArray(n.children) } : n
        );
      }

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= arr.length) return arr;

      const newArr = [...arr];
      const temp = newArr[idx];
      newArr[idx] = newArr[targetIdx];
      newArr[targetIdx] = temp;
      return newArr;
    };

    setTocTree((prev) => swapInArray(prev));
  };

  const deleteNode = (nodeId) => {
    setTocTree((prev) => removeNodeFromTree(prev, nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  };

  const updateSectionContent = (secId, newHtml) => {
    setSections((prev) =>
      prev.map((s) => (s.id === secId ? { ...s, htmlContent: newHtml } : s))
    );
  };

  const scrollToSection = (secId) => {
    setSelectedSectionId(secId);
    const element = document.getElementById(`editor-sec-${secId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const generateExportableHtml = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlRaw, 'text/html');

    // 1. Inject Kalpurush Font to export if not present
    if (!doc.querySelector('link[href*="kalpurush"]')) {
      const fontLink = doc.createElement('link');
      fontLink.href = 'https://fonts.maateen.me/kalpurush/font.css';
      fontLink.rel = 'stylesheet';
      doc.head.appendChild(fontLink);
    }

    // 2. Add structural CSS for the layout and fonts WITHOUT modifying original layout wrappers
    const styleTag = doc.createElement('style');
    styleTag.innerHTML = `
      body {
        /* Add margin to prevent ToC from overlapping content, without altering original flex/grid */
        margin-${sidebarPosition === 'left' ? 'left' : 'right'}: ${sidebarWidth}px !important;
      }
      #injected-toc-sidebar {
        position: fixed;
        top: 0;
        ${sidebarPosition === 'left' ? 'left: 0;' : 'right: 0;'}
        width: ${sidebarWidth}px;
        height: 100vh;
        background: #f8fafc;
        border-${sidebarPosition === 'left' ? 'right' : 'left'}: 1px solid #e2e8f0;
        padding: 1.5rem;
        box-sizing: border-box;
        overflow-y: auto;
        z-index: 999999;
        /* Strictly apply Times New Roman and Kalpurush fonts for ToC */
        font-family: 'Times New Roman', 'Kalpurush', serif;
        color: #0f172a;
        direction: ltr;
        text-align: left;
      }
      #injected-toc-sidebar h2 { font-family: inherit; font-size: 1.25rem; font-weight: 700; margin-top: 0; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 2px solid ${themeColor}; }
      #injected-toc-sidebar details { margin-bottom: 0.5rem; }
      #injected-toc-sidebar summary { font-weight: 600; cursor: pointer; padding: 0.25rem 0; margin-bottom: 0.25rem; }
      #injected-toc-sidebar ul { list-style: none; padding-left: 1rem; margin: 0; }
      #injected-toc-sidebar li { margin: 0.35rem 0; }
      #injected-toc-sidebar a { color: #475569; text-decoration: none; font-size: 0.95rem; display: block; transition: color 0.15s; }
      #injected-toc-sidebar a:hover { color: ${themeColor}; }
    `;
    doc.head.appendChild(styleTag);

    // 3. Ensure target elements have correct IDs based on parsed sections
    // CRITICAL: We DO NOT overwrite innerHTML here to keep the original file completely untouched
    const sectionElements = doc.querySelectorAll('section, article, .section-card, [id^="section-"]');
    if (sectionElements.length > 0) {
      sectionElements.forEach((el, index) => {
        const id = el.getAttribute('id') || `sec-${index + 1}`;
        el.setAttribute('id', id);
      });
    } else {
      const headers = doc.querySelectorAll('h1, h2, h3');
      if (headers.length > 0) {
        headers.forEach((h, idx) => {
          const id = h.getAttribute('id') || `sec-${idx + 1}`;
          h.setAttribute('id', id);
        });
      }
    }

    // 4. Generate ToC HTML
    const renderTocHtml = (nodes) => {
      const activeItems = nodes.filter((n) => n.included);
      if (activeItems.length === 0) return '';
      return `<ul>
        ${activeItems.map((node) => {
          if (node.type === 'folder') {
            return `<li>
              <details open>
                <summary>${node.title}</summary>
                ${renderTocHtml(node.children)}
              </details>
            </li>`;
          } else {
            return `<li>
              <a href="#${node.sectionId}">${node.title}</a>
            </li>`;
          }
        }).join('')}
      </ul>`;
    };
    const tocHtml = renderTocHtml(tocTree);

    // 5. Inject Sidebar cleanly into the DOM without wrapping the existing content
    const sidebar = doc.createElement('aside');
    sidebar.id = 'injected-toc-sidebar';
    
    if (docTitle) {
      const header = doc.createElement('h2');
      header.textContent = docTitle;
      sidebar.appendChild(header);
    }
    
    const nav = doc.createElement('nav');
    nav.innerHTML = tocHtml;
    sidebar.appendChild(nav);

    // Insert sidebar at the top of the body, letting position: fixed and margin-left handle layout
    doc.body.insertBefore(sidebar, doc.body.firstChild);

    return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
  };

  const handleDownload = () => {
    const fullHtml = generateExportableHtml();
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(docTitle || 'document').toLowerCase().replace(/\s+/g, '-')}-toc.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported clean HTML with Table of Contents!', 'success');
  };

  const renderTreeNode = (node, depth = 0) => {
    const isSelected = selectedNodeId === node.id;
    const isFolder = node.type === 'folder';

    return (
      <div key={node.id} className="select-none mb-1">
        <div
          className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${
            isSelected
              ? 'bg-blue-50 text-blue-700 font-medium'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
          style={{ paddingLeft: `${Math.max(8, depth * 16)}px` }}
          onClick={() => {
            setSelectedNodeId(node.id);
            if (node.sectionId) scrollToSection(node.sectionId);
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleIncludeNode(node.id);
            }}
            className="text-slate-400 hover:text-blue-600 transition-colors"
            title={node.included ? 'Included in ToC' : 'Excluded from ToC'}
          >
            {node.included ? (
              <CheckSquare size={16} className="text-blue-600" />
            ) : (
              <Square size={16} />
            )}
          </button>

          {isFolder ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFolderOpen(node.id);
              }}
              className="p-0.5 text-slate-400 hover:text-slate-600"
            >
              {node.open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </button>
          ) : (
            <span className="w-4" />
          )}

          {isFolder ? (
            <Folder
              size={16}
              className={`${
                isSelected ? 'text-blue-600' : 'text-amber-500'
              } shrink-0`}
            />
          ) : (
            <FileText
              size={16}
              className={`${
                isSelected ? 'text-blue-600' : 'text-slate-400'
              } shrink-0`}
            />
          )}

          <input
            type="text"
            value={node.title}
            onChange={(e) => renameNode(node.id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            style={{ fontFamily: "'Times New Roman', 'Kalpurush', serif" }}
            className={`bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white px-1 py-0.5 text-[13px] flex-1 outline-none rounded ${
              !node.included ? 'line-through text-slate-400' : ''
            }`}
          />

          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
            {isFolder && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  addFolder(node.id);
                }}
                title="Add Sub-category"
                className="p-1 hover:bg-slate-200 rounded text-slate-600"
              >
                <Plus size={13} />
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                moveNodeOrder(node.id, 'up');
              }}
              title="Move Up"
              className="p-1 hover:bg-slate-200 rounded text-slate-600"
            >
              <ArrowUp size={13} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                moveNodeOrder(node.id, 'down');
              }}
              title="Move Down"
              className="p-1 hover:bg-slate-200 rounded text-slate-600"
            >
              <ArrowDown size={13} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                deleteNode(node.id);
              }}
              title="Delete"
              className="p-1 hover:bg-red-100 rounded text-red-500"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {isFolder && node.open && node.children && node.children.length > 0 && (
          <div className="mt-0.5">
            {node.children.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const selectedSection = useMemo(
    () => sections.find((s) => s.id === selectedSectionId),
    [sections, selectedSectionId]
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-slate-200 px-5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
              HTML ToC Editor & Builder
              <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                <ShieldCheck size={12} /> 100% In-Browser Local
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Create nested Table of Contents for translated HTML files
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".html,.htm,.txt"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium transition-colors shadow-xs"
          >
            <Upload size={14} /> Import HTML
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors"
          >
            <Download size={14} /> Export File
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className="bg-white border-r border-slate-200 flex flex-col shrink-0"
          style={{ width: `${sidebarWidth}px` }}
        >
          <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-amber-500" />
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Table of Contents
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => addFolder(null)}
                className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded text-xs flex items-center gap-1 border border-slate-300"
                title="Add Root Category/Folder"
              >
                <FolderPlus size={14} />
              </button>
            </div>
          </div>

          <div className="p-3 border-b border-slate-200 bg-white">
            <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
              Document Title
            </label>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 text-slate-800 text-xs px-2.5 py-1.5 rounded outline-none"
              placeholder="Document Title"
              style={{ fontFamily: "'Times New Roman', 'Kalpurush', serif" }}
            />
          </div>

          <div className="flex-1 overflow-y-auto p-2 bg-white text-slate-800">
            {tocTree.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs px-4 leading-relaxed">
                Table of Contents is empty. Click <span className="text-blue-600 font-semibold">"Add to ToC"</span> on any section to build your structure.
              </div>
            ) : (
              tocTree.map((node) => renderTreeNode(node, 0))
            )}
          </div>

          <div className="p-2 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex justify-between items-center">
            <span>{sections.length} Sections</span>
            <span>{tocTree.length} Root Nodes</span>
          </div>
        </aside>

        {/* Right Content Panel */}
        <main className="flex-1 flex flex-col bg-slate-100 overflow-hidden">
          <div className="h-11 bg-white border-b border-slate-200 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {sections.length} Sections
              </span>
              <span className="text-xs text-slate-600 font-medium truncate max-w-md">
                Full Document View
              </span>
            </div>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Eye size={13} /> Visual Editor
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                  activeTab === 'code'
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Code size={13} /> HTML Source
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex justify-center">
            {sections.length > 0 ? (
              <div className="w-full max-w-4xl space-y-6">
                {activeTab === 'preview' &&
                  sections.map((sec) => (
                    <div
                      key={sec.id}
                      id={`editor-sec-${sec.id}`}
                      className="bg-white text-slate-900 rounded-xl shadow-md p-8 border border-slate-200"
                    >
                      <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-100">
                        <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider font-mono">
                          {sec.id} - Live Rendered Section
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => addSectionToToc(sec)}
                            className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 rounded-md flex items-center gap-1 transition-colors font-medium"
                          >
                            <PlusCircle size={13} /> Add to ToC
                          </button>
                          <button
                            onClick={() =>
                              updateSectionContent(sec.id, sec.htmlContent)
                            }
                            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                          >
                            <RefreshCw size={12} /> Sync Content
                          </button>
                        </div>
                      </div>

                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          updateSectionContent(sec.id, e.currentTarget.innerHTML)
                        }
                        dir={sec.rtl ? 'rtl' : 'ltr'}
                        className={`prose max-w-none focus:outline-none ${
                          sec.rtl ? 'text-right' : 'text-left'
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: sec.htmlContent
                        }}
                      />
                    </div>
                  ))}

                {activeTab === 'code' && selectedSection && (
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 font-mono text-xs">
                    <textarea
                      value={selectedSection.htmlContent}
                      onChange={(e) =>
                        updateSectionContent(
                          selectedSection.id,
                          e.target.value
                        )
                      }
                      className="w-full h-[500px] bg-slate-950 text-emerald-400 p-4 rounded-lg border border-slate-800 focus:border-blue-500 outline-none leading-relaxed resize-none"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-4">
                  <FileCode size={26} className="text-slate-300" />
                </div>
                <p className="text-sm font-semibold text-slate-700">No Content Loaded</p>
                <p className="text-xs text-slate-500 mt-1">
                  Click "Import HTML" above to upload a file.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {notification && (
        <div className="fixed bottom-4 right-4 bg-white text-slate-800 border border-slate-200 px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 z-50">
          <Check size={14} className="text-emerald-500" />
          <span>{notification.msg}</span>
        </div>
      )}
    </div>
  );
}