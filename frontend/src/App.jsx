import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import SearchPage from './components/SearchPage';
import SavedPage from './components/SavedPage';
import DashboardPage from './components/DashboardPage';
import HistoryPage from './components/HistoryPage';
import CameraPage from './components/CameraPageNew';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import { getToken, clearToken, API } from './lib/api';

function App() {
  const [page, setPage] = useState('home');
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [imageSearch, setImageSearch] = useState({ results: [], detected: null });

  useEffect(() => {
    if (!user) { setSavedRecipes([]); return; }
    let mounted = true;
    (async () => {
      try {
        const res = await API('/favorites');
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setSavedRecipes(data.map(f => f.recipe.id));
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  const toggleSave = async (id) => {
    if (!user) { setPage('login'); return; }
    const isSaved = savedRecipes.includes(id);
    try {
      if (isSaved) {
        const res = await API(`/favorites/${id}`, { method: 'DELETE' });
        if (res.ok) setSavedRecipes(prev => prev.filter(i => i !== id));
      } else {
        const res = await API(`/favorites/${id}`, { method: 'POST' });
        if (res.ok) setSavedRecipes(prev => [...prev, id]);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleLogin = (userData) => { setUser(userData); setPage('home'); };
  const handleRegister = (userData) => { setUser(userData); setPage('home'); };
  const handleLogout = () => {
    clearToken();
    setUser(null);
    setSavedRecipes([]);
    setPage('home');
  };

  const handleImageCapture = async (fileOrBlob) => {
    const formData = new FormData();
    formData.append('image', fileOrBlob, 'capture.jpg');
    const res = await API('/match/from-image?top_n=12', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.detail || 'Image search failed');
    }
    setImageSearch({ results: data.matches || [], detected: data.detected_ingredients || [] });
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!getToken()) return;
      try {
        const res = await API('/auth/me');
        if (!res.ok) {
          clearToken();
          return;
        }
        const data = await res.json();
        if (mounted) setUser({ name: data.full_name, email: data.email, id: data.id });
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  const bg = darkMode ? '#1A1612' : '#FDFAF6';

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Inter', system-ui, sans-serif", transition: 'background 0.3s' }}>
      <Navbar
        page={page}
        onNavigate={setPage}
        savedCount={savedRecipes.length}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
        isLoggedIn={!!user}
        user={user}
        onLogin={() => setPage('login')}
        onRegister={() => setPage('register')}
        onLogout={handleLogout}
      />
      <main key={page}>
        {page === 'home'      && <LandingPage onNavigate={setPage} savedRecipes={savedRecipes} onToggleSave={toggleSave} />}
        {page === 'search'    && <SearchPage onToggleSave={toggleSave} savedRecipes={savedRecipes} darkMode={darkMode} onNavigate={setPage} initialResults={imageSearch.results} initialDetected={imageSearch.detected} />}
        {page === 'saved'     && <SavedPage onToggleSave={toggleSave} isLoggedIn={!!user} onNavigate={setPage} />}
        {page === 'dashboard' && <DashboardPage savedRecipes={savedRecipes} onNavigate={setPage} />}
        {page === 'history'   && <HistoryPage onNavigate={setPage} darkMode={darkMode} isLoggedIn={!!user} />}
        {page === 'camera'    && <CameraPage onNavigate={setPage} darkMode={darkMode} onCapture={handleImageCapture} />}
        {page === 'profile'   && <ProfilePage user={user} onLogout={handleLogout} onNavigate={setPage} />}
        {page === 'login'     && <LoginPage onLogin={handleLogin} onNavigate={setPage} darkMode={darkMode} />}
        {page === 'register'  && <RegisterPage onRegister={handleRegister} onNavigate={setPage} darkMode={darkMode} />}
      </main>
    </div>
  );
}

export default App;