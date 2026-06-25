import { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import SearchPage from './components/SearchPage';
import SavedPage from './components/SavedPage';
import DashboardPage from './components/DashboardPage';

function App() {
  const [page, setPage] = useState('home');
  const [savedRecipes, setSavedRecipes] = useState([1, 3]);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSave = (id) =>
    setSavedRecipes(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );

  const bg = darkMode ? '#1A1612' : '#FDFAF6';

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Inter', system-ui, sans-serif", transition: 'background 0.3s' }}>
      <Navbar page={page} onNavigate={setPage} savedCount={savedRecipes.length} darkMode={darkMode} onToggleDark={() => setDarkMode(d => !d)} />
      <main key={page}>
        {page === 'home'      && <LandingPage onNavigate={setPage} savedRecipes={savedRecipes} onToggleSave={toggleSave} />}
        {page === 'search'    && <SearchPage onToggleSave={toggleSave} savedRecipes={savedRecipes} />}
        {page === 'saved'     && <SavedPage savedRecipes={savedRecipes} onToggleSave={toggleSave} />}
      
        {page === 'dashboard' && <DashboardPage savedRecipes={savedRecipes} onNavigate={setPage} />}
      </main>
    </div>
  );
}

export default App;