import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';

// Pages
import Home from './pages/Home';
import Chat from './pages/Chat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
        </Route>

        {/* Chat Interface */}
        <Route element={<AppLayout />}>
          <Route path="/chat" element={<Chat />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
