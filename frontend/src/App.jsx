import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';

// Pages (Placeholders for now)
import Home from './pages/Home';
import Login from './pages/Login';
import Plans from './pages/Plans';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/plans" element={<Plans />} />
        </Route>

        {/* App Routes (Protected in real app) */}
        <Route element={<AppLayout />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/library" element={<Library />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
