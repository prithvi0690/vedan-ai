import { useState } from 'react';

const Library = () => {
    // Mock Data - Replace with API call
    const [documents, setDocuments] = useState([
        {
            id: 1,
            type: 'GST',
            date: '04 Aug 2023',
            title: 'Notification No. 38/2023 – Central Tax',
            summary: 'Seeks to waive the requirement of mandatory filing of the annual return for registered persons with aggregate turnover...',
            cited: true,
            colorClass: 'bg-primary text-white',
            borderColor: 'border-primary'
        },
        {
            id: 2,
            type: 'Income Tax',
            date: '12 Jul 2023',
            title: 'Circular No. 15/2023 – Income Tax',
            summary: 'Clarification regarding taxability of income earned by a non-resident investor from off-shore investments...',
            cited: false,
            colorClass: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
            borderColor: 'border-transparent'
        },
        // Add more mock items as needed
    ]);

    const [selectedDoc, setSelectedDoc] = useState(documents[0]);

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden w-full">
            {/* Top Navigation Bar (Library specific) */}
            <header className="bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-gray-700 h-16 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
                <div className="flex items-center gap-8">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Citation Library</h1>
                    {/* Global Nav (Tabs) */}
                    <nav className="hidden md:flex bg-background-light dark:bg-gray-800 rounded-lg p-1">
                        <button className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors rounded-md">Chat Interface</button>
                        <button className="px-4 py-1.5 text-sm font-medium bg-white dark:bg-gray-700 text-primary dark:text-white shadow-sm rounded-md ring-1 ring-black/5 dark:ring-white/10">Source Library</button>
                        <button className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors rounded-md">Saved Reports</button>
                    </nav>
                </div>
                {/* Search & Profile */}
                <div className="flex items-center gap-4">
                    <div className="relative w-64 hidden lg:block">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <span className="material-icons-outlined text-[18px]">search</span>
                        </span>
                        <input className="w-full pl-9 pr-4 py-2 text-sm bg-background-light dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-lg outline-none transition-all placeholder-gray-400 dark:text-white" placeholder="Search citations, acts..." type="text" />
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex overflow-hidden">
                {/* LEFT PANEL: Filter & Document List */}
                <aside className="w-[420px] flex flex-col border-r border-border-light dark:border-gray-700 bg-surface-light dark:bg-surface-dark z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] shrink-0 hidden lg:flex">
                    {/* Filters Header */}
                    <div className="p-4 border-b border-border-light dark:border-gray-700 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Legal Documents</h2>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium">1,240 Found</span>
                        </div>
                        {/* Category Pills */}
                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                            <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary text-white shadow-md shadow-primary/20 whitespace-nowrap border border-transparent">All</button>
                            <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-primary/50 hover:text-primary transition-colors whitespace-nowrap">GST</button>
                            <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-primary/50 hover:text-primary transition-colors whitespace-nowrap">Income Tax</button>
                            <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-primary/50 hover:text-primary transition-colors whitespace-nowrap">Customs</button>
                        </div>
                        {/* Date Filter */}
                        <div className="relative">
                            <button className="w-full flex items-center justify-between px-3 py-2 bg-background-light dark:bg-gray-800 rounded-lg border border-transparent hover:border-border-light dark:hover:border-gray-600 text-xs text-gray-500 dark:text-gray-400">
                                <span>Filter by Fiscal Year: 2023-24</span>
                                <span className="material-icons-outlined text-[16px]">calendar_today</span>
                            </button>
                        </div>
                    </div>
                    {/* Document List */}
                    <div className="flex-1 overflow-y-auto bg-background-light/30 dark:bg-black/20">
                        <div className="divide-y divide-border-light dark:divide-gray-800">
                            {documents.map((doc) => (
                                <div key={doc.id} onClick={() => setSelectedDoc(doc)} className={`p-4 cursor-pointer transition-colors group relative border-l-4 ${selectedDoc.id === doc.id ? 'bg-primary/5 border-primary hover:bg-primary/10' : 'bg-white dark:bg-surface-dark hover:bg-background-light dark:hover:bg-gray-800 border-transparent hover:border-gray-300 dark:hover:border-gray-600'}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${doc.colorClass}`}>{doc.type}</span>
                                        <span className="text-[10px] text-gray-500 font-mono bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">{doc.date}</span>
                                    </div>
                                    <h3 className={`text-sm font-semibold leading-snug mb-2 group-hover:text-primary-dark ${selectedDoc.id === doc.id ? 'text-primary' : 'text-gray-800 dark:text-white'}`}>{doc.title}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{doc.summary}</p>
                                    {doc.cited && (
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/30">
                                                <span className="material-icons-round text-[10px]">check_circle</span> Cited in Chat
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* RIGHT PANEL: PDF Viewer */}
                <section className="flex-1 flex flex-col bg-background-light dark:bg-black/40 relative w-full h-full">
                    {/* Viewer Toolbar */}
                    <div className="h-14 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-gray-700 flex items-center justify-between px-4 shadow-sm shrink-0 z-10">
                        <div className="flex items-center gap-4 overflow-hidden">
                            <h1 className="text-sm font-semibold text-gray-800 dark:text-white truncate" title={selectedDoc.title}>
                                {selectedDoc.title}
                            </h1>
                            <span className="px-2 py-0.5 rounded bg-background-light dark:bg-gray-800 text-[10px] text-gray-500 font-mono border border-gray-200 dark:border-gray-700 whitespace-nowrap">Page 1 of 2</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-8 flex bg-background-light dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-0.5">
                                <button className="px-2 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded transition-all" title="Zoom Out"><span className="material-icons-outlined text-[18px] text-gray-600 dark:text-gray-400">remove</span></button>
                                <span className="px-2 flex items-center text-xs font-medium text-gray-600 dark:text-gray-400">100%</span>
                                <button className="px-2 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded transition-all" title="Zoom In"><span className="material-icons-outlined text-[18px] text-gray-600 dark:text-gray-400">add</span></button>
                            </div>
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors">
                                <span className="material-icons-outlined text-[18px]">content_copy</span>
                                <span className="hidden xl:inline">Copy Citation</span>
                            </button>
                            <button className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg shadow-sm shadow-primary/20 transition-colors flex items-center gap-2">
                                <span className="material-icons-outlined text-[18px]">download</span>
                                <span>Download</span>
                            </button>
                        </div>
                    </div>

                    {/* PDF Canvas Area */}
                    <div className="flex-1 overflow-y-auto bg-gray-200/50 dark:bg-black/50 p-6 md:p-8 flex justify-center relative">
                        {/* PDF Page Render (Visual Approximation - Placeholder) */}
                        <div className="bg-white w-full max-w-3xl min-h-[1100px] p-12 md:p-16 text-gray-900 relative shadow-lg">
                            {/* Watermark / Official Header */}
                            <div className="text-center mb-10 border-b-2 border-double border-gray-300 pb-6">
                                <div className="flex justify-center mb-4 opacity-80">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-t from-gray-200 to-gray-100 flex items-center justify-center border border-gray-300">
                                        <span className="material-icons-outlined text-4xl text-gray-400">account_balance</span>
                                    </div>
                                </div>
                                <h2 className="uppercase font-bold text-xl tracking-widest text-gray-800 mb-2">The Gazette of India</h2>
                                <h3 className="uppercase font-semibold text-sm text-gray-600 tracking-wide">Extraordinary</h3>
                                <div className="flex justify-between mt-4 text-xs font-serif text-gray-500 border-t border-gray-200 pt-2 w-3/4 mx-auto">
                                    <span>PART II — Section 3 — Sub-section (i)</span>
                                    <span>PUBLISHED BY AUTHORITY</span>
                                </div>
                            </div>
                            {/* Document Body */}
                            <div className="font-serif leading-relaxed text-justify space-y-6 text-sm md:text-base text-gray-800">
                                <div className="text-center font-bold mb-8">
                                    <p>GOVERNMENT OF INDIA</p>
                                    <p>MINISTRY OF FINANCE</p>
                                    <p>(Department of Revenue)</p>
                                    <p>(CENTRAL BOARD OF INDIRECT TAXES AND CUSTOMS)</p>
                                </div>
                                <div className="text-center mb-6">
                                    <p className="font-bold underline">{selectedDoc.title}</p>
                                    <p className="text-xs italic mt-1">New Delhi, the {selectedDoc.date}</p>
                                </div>
                                <p><span className="font-bold">G.S.R. 590(E).</span>— In exercise of the powers conferred by section 148 of the Central Goods and Services Tax Act, 2017 (12 of 2017)...</p>
                                <p className="text-center text-gray-400 italic mt-10">[PDF Content Placeholder for {selectedDoc.title}]</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Library;
