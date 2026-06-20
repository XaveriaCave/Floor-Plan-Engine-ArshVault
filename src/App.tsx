import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Workspace from './pages/Workspace';
import { useEffect, useState } from 'react';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen bg-slate-950 flex items-center justify-center text-cyan-400 font-sans">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/workspace" /> : <LoginPage onGuestLogin={() => setIsGuest(true)} />} />
        <Route path="/workspace" element={user || isGuest ? <Workspace /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
