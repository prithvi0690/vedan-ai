import { useState } from 'react';

const Dashboard = () => {
    // Mock Data - Replace with API call
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'GST',
            number: 'Notification No. 52/2024',
            date: 'Oct 27, 2024',
            title: 'Advisory on IMS (Invoice Management System) on GST Portal',
            summary: 'The GSTN has released a new advisory regarding the Invoice Management System (IMS). This new functionality allows taxpayers to accept, reject, or keep invoices pending for ITC claims, directly impacting GSTR-2B generation.',
            colorClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
        },
        {
            id: 2,
            type: 'Income Tax',
            number: 'Circular No. 19/2024',
            date: 'Oct 25, 2024',
            title: 'Condonation of delay in filing Form No. 10-IC for AY 2022-23',
            summary: 'The CBDT has condoned the delay in filing Form 10-IC for Assessment Year 2022-23. Companies opting for the concessional tax regime under section 115BAA can now file the form provided the return was filed within the due date.',
            colorClass: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        }
    ]);

    const [trendingTopics, setTrendingTopics] = useState([
        { id: 1, title: 'Section 43B(h)', subtitle: 'MSME Payment Rules', trend: '12%' },
        { id: 2, title: 'GSTR-9 Annual Return', subtitle: 'Due date approaching', trend: '8%' }
    ]);

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark overflow-y-auto w-full">
            {/* Dashboard Header (Search & Profile) */}
            <header className="sticky top-0 z-30 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex items-center justify-between">
                <div className="flex-1 max-w-lg hidden md:block">
                    <div className="relative w-full group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-icons text-gray-400 group-focus-within:text-primary transition-colors text-xl">search</span>
                        </div>
                        <input className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-all" placeholder="Search official citations, circulars, or keywords..." type="text" />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <span className="text-xs text-gray-400 border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5">Ctrl+K</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 ml-auto">
                    <button className="p-1 rounded-full text-gray-500 hover:text-primary dark:hover:text-primary transition-colors relative">
                        <span className="material-icons">notifications_none</span>
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
                    </button>
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Adv. Priya Sharma</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Tax Consultant</span>
                        </div>
                        {/* Avatar Placeholder */}
                        <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/20">
                            PS
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Feed */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Notifications</h1>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Real-time updates analyzed by Vedan-AI.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                                        <span className="material-icons text-sm mr-2">calendar_today</span>
                                        Last 30 Days
                                    </button>
                                    <button className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                                        <span className="material-icons text-sm mr-2">filter_list</span>
                                        Filter
                                    </button>
                                </div>
                            </div>
                            <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                                <nav aria-label="Tabs" className="-mb-px flex space-x-8">
                                    <a className="border-primary text-primary whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" href="#">All Updates</a>
                                    <a className="border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" href="#">GST</a>
                                    <a className="border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" href="#">Income Tax</a>
                                    <a className="border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" href="#">Schemes</a>
                                    <a className="border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" href="#">Customs</a>
                                </nav>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {notifications.map((item) => (
                                <article key={item.id} className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 transition-all hover:shadow-md hover:border-primary/30 group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.colorClass}`}>{item.type}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{item.number}</span>
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                            <span className="material-icons text-base">event</span> {item.date}
                                        </span>
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h2>
                                    <div className="bg-primary-light/50 dark:bg-primary/10 rounded-lg p-3 mb-4 border-l-4 border-primary">
                                        <div className="flex gap-2">
                                            <span className="material-icons text-primary text-sm mt-0.5">auto_awesome</span>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                                <span className="font-semibold text-primary">Vedan-AI Summary:</span> {item.summary}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <button className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all active:scale-95">
                                            <span className="material-icons text-sm mr-2">chat</span>
                                            Ask Vedan-AI about this Notification
                                        </button>
                                        <button className="text-gray-400 hover:text-primary transition-colors">
                                            <span className="material-icons">bookmark_border</span>
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* Right Sidebar (Trending) */}
                    <div className="w-full lg:w-80 shrink-0 space-y-8 hidden xl:block">
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <span className="material-icons text-primary text-xl">trending_up</span>
                                    Trending Topics
                                </h3>
                                <span className="text-xs text-gray-500">Live</span>
                            </div>
                            <ul className="space-y-4">
                                {trendingTopics.map((topic) => (
                                    <li key={topic.id} className="group cursor-pointer">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">{topic.title}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{topic.subtitle}</p>
                                            </div>
                                            <span className="flex items-center text-green-500 text-xs font-semibold bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">
                                                <span className="material-icons text-[14px]">arrow_upward</span> {topic.trend}
                                            </span>
                                        </div>
                                        {topic.id !== trendingTopics.length && <hr className="border-gray-100 dark:border-gray-800 mt-4" />}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
