# Vedan AI - Web UI Quick Start Guide

## 🚀 Launch the Web Interface

### Step 1: Start the API Server

Make sure you're in your virtual environment, then run:

```bash
python src/api/main.py
```

You should see:
```
Initializing RAG engine...
RAG engine initialized successfully!
API ready to serve requests!
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 2: Open the Web Interface

Open your browser and go to:
```
http://localhost:8000
```

## ✨ Features

### Theme Toggle
- Click the 🌙/☀️ button in the header to switch between dark and light themes
- Your preference is saved automatically

### Ask Questions
1. Type your question in the input box at the bottom
2. Press Enter or click the send button
3. Watch as the interface transforms:
   - Sidebar appears with conversation history
   - Your question moves to the main area
   - Answer appears with citations

### View Sources
- Each answer includes source citations
- Click on source cards to see the exact text used
- Page numbers are shown for easy reference

### Conversation History
- All questions appear in the left sidebar
- Click any previous question to view its answer again
- Use "Clear" button to start fresh

### Example Questions
Click any of the example questions on the welcome screen to get started quickly

## 🎨 Design Features

- **Split-screen layout** - Questions move to sidebar, answers take center stage (like Gemini Canvas)
- **Smooth transitions** - Professional animations throughout
- **Responsive design** - Works on desktop, tablet, and mobile
- **Keyboard shortcuts** - Press Enter to send, Shift+Enter for new line
- **Auto-resize input** - Text area grows as you type

## 🎯 Perfect for Showcasing

This interface is designed to impress:
- Clean, modern design
- Professional appearance
- Easy to use
- Shows your RAG system's capabilities clearly
- Citations prove accuracy

## 📱 Mobile Support

The interface is fully responsive and works great on mobile devices!

## 🔧 Troubleshooting

**If the page doesn't load:**
- Make sure the API server is running
- Check that you're accessing `http://localhost:8000` (not 127.0.0.1)

**If queries don't work:**
- Check the browser console for errors (F12)
- Verify the API server is running and shows "API ready to serve requests!"

**If sources don't appear:**
- This is normal if the answer doesn't cite specific documents
- Try asking more specific questions about CGST

Enjoy showcasing your RAG system! 🎉
