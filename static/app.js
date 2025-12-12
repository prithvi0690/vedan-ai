// API Configuration
// API Configuration
const API_BASE_URL = ''; // Use relative path so it works on any IP

// DOM Elements
const questionInput = document.getElementById('question-input');
const sendBtn = document.getElementById('send-btn');
const welcomeView = document.getElementById('welcome-view');
const chatView = document.getElementById('chat-view');
const loading = document.getElementById('loading');
const mainScroll = document.getElementById('main-scroll');
const appTitle = document.getElementById('app-title');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupEventListeners();
    autoResizeTextarea();
    lucide.createIcons();
});

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
}

// Event Listeners
function setupEventListeners() {
    // Theme Toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Tab Switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active', 'text-primary-600', 'dark:text-primary-400', 'border-primary-600', 'dark:border-primary-400', 'font-semibold');
                b.classList.add('text-slate-500', 'dark:text-slate-400', 'border-transparent', 'font-medium');
            });

            // Add active class to clicked tab
            btn.classList.remove('text-slate-500', 'dark:text-slate-400', 'border-transparent', 'font-medium');
            btn.classList.add('active', 'text-primary-600', 'dark:text-primary-400', 'border-primary-600', 'dark:border-primary-400', 'font-semibold');
        });
    });

    // Input handling
    questionInput.addEventListener('input', () => {
        sendBtn.disabled = !questionInput.value.trim();
        autoResizeTextarea();
    });

    questionInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (questionInput.value.trim()) {
                handleSendQuestion();
            }
        }
    });

    sendBtn.addEventListener('click', handleSendQuestion);

    // Example buttons
    document.querySelectorAll('.example-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.querySelector('span').textContent;
            questionInput.value = text;
            sendBtn.disabled = false;
            handleSendQuestion();
        });
    });

    // Home link
    appTitle.addEventListener('click', resetToHome);
}

function resetToHome() {
    welcomeView.classList.remove('hidden');
    chatView.classList.add('hidden');
    chatView.innerHTML = ''; // Clear chat
    questionInput.value = '';
    sendBtn.disabled = true;
    autoResizeTextarea();
}

function autoResizeTextarea() {
    questionInput.style.height = 'auto';
    questionInput.style.height = questionInput.scrollHeight + 'px';
}

async function handleSendQuestion() {
    const question = questionInput.value.trim();
    if (!question) return;

    // UI Transition
    welcomeView.classList.add('hidden');
    chatView.classList.remove('hidden');

    // Add User Message
    addUserMessage(question);

    // Clear Input
    questionInput.value = '';
    questionInput.style.height = 'auto';
    sendBtn.disabled = true;

    // Show Loading
    loading.classList.remove('hidden');
    scrollToBottom();

    try {
        const response = await fetch(`${API_BASE_URL}/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, k: 5 })
        });

        if (!response.ok) throw new Error('Failed to get answer');

        const data = await response.json();

        // Hide Loading & Add AI Response
        loading.classList.add('hidden');
        addAIMessage(data.answer, data.sources);

    } catch (error) {
        console.error(error);
        loading.classList.add('hidden');
        addErrorMessage();
    }
}

function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'flex justify-end animate-fade-in-up mb-8';
    div.innerHTML = `
        <div class="bg-gradient-to-br from-primary-600 to-primary-700 text-white px-6 py-3.5 rounded-2xl rounded-tr-sm shadow-lg shadow-primary-600/20 max-w-[85%] text-[15px] leading-relaxed">
            ${text}
        </div>
    `;
    chatView.appendChild(div);
    scrollToBottom();
}

function addAIMessage(answer, sources) {
    const div = document.createElement('div');
    div.className = 'flex items-start gap-5 animate-fade-in-up mb-10';

    // Format answer (paragraphs)
    const formattedAnswer = answer.split('\n\n').map(p => `<p class="mb-4 last:mb-0 text-slate-700 dark:text-slate-200 leading-7">${p}</p>`).join('');

    // Format sources
    const sourcesHtml = sources.map((s, i) => `
        <div class="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 transition-all hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md cursor-pointer">
            <div class="flex items-center gap-2 mb-2">
                <div class="w-6 h-6 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <span class="text-[10px] font-bold">${i + 1}</span>
                </div>
                <span class="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate flex-1">Source Document</span>
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed group-hover:text-slate-600 dark:group-hover:text-slate-300">
                ${s.content}
            </div>
        </div>
    `).join('');

    div.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
            <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span class="text-white font-bold text-xs">V</span>
            </div>
        </div>
        <div class="flex-1 max-w-full">
            <div class="text-[15px]">
                ${formattedAnswer}
            </div>
            
            ${sources.length > 0 ? `
                <div class="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/50">
                    <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                        <i data-lucide="book-open" class="w-3 h-3"></i>
                        References
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        ${sourcesHtml}
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    chatView.appendChild(div);
    lucide.createIcons(); // Re-render icons for new content
    scrollToBottom();
}

function addErrorMessage() {
    const div = document.createElement('div');
    div.className = 'flex items-start gap-4 animate-fade-in-up';
    div.innerHTML = `
        <div class="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span class="text-white font-bold text-xs">!</span>
        </div>
        <div class="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm border border-red-100 text-red-600 text-sm">
            Something went wrong. Please try again.
        </div>
    `;
    chatView.appendChild(div);
    scrollToBottom();
}

function scrollToBottom() {
    mainScroll.scrollTop = mainScroll.scrollHeight;
}
