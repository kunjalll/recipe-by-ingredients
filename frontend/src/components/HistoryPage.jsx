import { useState, useEffect } from 'react';
import { API } from '../lib/api';

export default function HistoryPage({ onNavigate, darkMode, isLoggedIn }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) { setLoading(false); return; }
    let mounted = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await API('/history');
        const data = await res.json();
        if (!res.ok) {
          setError('Could not load history.');
        } else if (mounted) {
          setEntries(data);
        }
      } catch (e) {
        setError('Network error loading history.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
        <h2 style={{ color: '#E8591A' }}>Your history</h2>
        <p style={{ color: darkMode ? '#A8A098' : '#8A7F70' }}>Log in to view your browsing history and recently viewed recipes.</p>
        <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button onClick={() => onNavigate('login')} style={{ padding: '10px 16px', borderRadius: 10, border: 'none', background: '#E8591A', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Log in</button>
          <button onClick={() => onNavigate('register')} style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #E8591A', background: 'transparent', color: '#E8591A', fontWeight: 700, cursor: 'pointer' }}>Sign up</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: '#E8591A', margin: 0 }}>Your history</h2>
      </div>

      {error && (
        <div style={{ background:'#FDECE6', color:'#B8431A', fontSize:13, padding:'10px 14px', borderRadius:10, marginBottom:16 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: darkMode ? '#A8A098' : '#8A7F70' }}>
          Loading…
        </div>
      ) : entries.length === 0 && !error ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: darkMode ? '#A8A098' : '#8A7F70' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🕘</div>
          <p>Recipes you search for or view will show up here.</p>
          <button onClick={() => onNavigate('search')} style={{
            marginTop: 12, padding: '8px 18px', borderRadius: 10, border: 'none',
            background: '#E8591A', color: '#fff', fontWeight: 600, cursor: 'pointer',
          }}>
            Find something to cook
          </button>
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {entries.map((item) => (
            <li key={item.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 12, marginBottom: 8,
              background: darkMode ? '#211D19' : '#fff',
              border: `1px solid ${darkMode ? '#2A2520' : '#F0EAE0'}`,
              cursor: item.recipe ? 'pointer' : 'default',
            }}
            onClick={() => item.recipe && onNavigate('search')}
            >
              <span style={{ fontSize: 20 }}>{item.action === 'search' ? '🔍' : '🍽️'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: darkMode ? '#EDE8DF' : '#211D19' }}>
                  {item.action === 'search'
                    ? `Searched: ${item.ingredients_used || '—'}`
                    : (item.recipe?.title || 'Recipe')}
                </div>
                <div style={{ fontSize: 12, color: darkMode ? '#A8A098' : '#8A7F70' }}>
                  {formatTimeAgo(item.created_at)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatTimeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}