import { useState, useEffect } from 'react';
import { API } from '../lib/api';

export default function SavedPage({ onToggleSave, isLoggedIn, onNavigate }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) { setLoading(false); return; }
    let mounted = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await API('/favorites');
        const data = await res.json();
        if (!res.ok) {
          setError('Could not load saved recipes.');
        } else if (mounted) {
          setFavorites(data);
        }
      } catch (e) {
        setError('Network error loading saved recipes.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [isLoggedIn]);

  const handleRemove = async (recipeId) => {
    // optimistic removal from this page's list
    setFavorites(prev => prev.filter(f => f.recipe.id !== recipeId));
    await onToggleSave(recipeId); // actually deletes via the backend
  };

  if (!isLoggedIn) {
    return (
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 20px', textAlign:'center' }}>
        <h1 style={{ fontSize:28, fontWeight:800, color:'#1A1612', margin:'0 0 4px' }}>Saved Recipes</h1>
        <p style={{ color:'#8A7E74', margin:'0 0 24px', fontSize:15 }}>Log in to view and sync your saved recipes across devices.</p>
        <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
          <button onClick={() => onNavigate('login')} style={{ padding:'10px 18px', borderRadius:12, border:'none', background:'#E8591A', color:'#fff', fontWeight:700, cursor:'pointer' }}>Log in</button>
          <button onClick={() => onNavigate('register')} style={{ padding:'10px 18px', borderRadius:12, border:'1px solid #E8591A', background:'transparent', color:'#E8591A', fontWeight:700, cursor:'pointer' }}>Sign up</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 20px' }}>
      <h1 style={{ fontSize:28, fontWeight:800, color:'#1A1612', margin:'0 0 4px' }}>Saved Recipes</h1>
      <p style={{ color:'#8A7E74', margin:'0 0 24px', fontSize:15 }}>
        {loading ? 'Loading…' : `${favorites.length} recipe${favorites.length!==1?'s':''} bookmarked`}
      </p>

      {error && (
        <div style={{ background:'#FDECE6', color:'#B8431A', fontSize:13, padding:'10px 14px', borderRadius:10, marginBottom:16 }}>
          {error}
        </div>
      )}

      {!loading && favorites.length === 0 && !error ? (
        <div style={{ textAlign:'center', padding:'80px 20px', background:'#FDFAF6', borderRadius:16 }}>
          <div style={{ fontSize:64, marginBottom:12 }}>🤍</div>
          <h3 style={{ color:'#1A1612', margin:'0 0 8px' }}>No saved recipes yet</h3>
          <p style={{ color:'#8A7E74', fontSize:14 }}>Tap ❤️ on any recipe card to save it here.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
          {favorites.map(f => (
            <div key={f.id} style={{ background:'#fff', borderRadius:16, border:'1px solid #F4F0E8', overflow:'hidden', display:'flex', flexDirection:'column' }}>
              <div style={{ height:140, background:'#F4F0E8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:56, position:'relative' }}>
                🍽️
                <button
                  onClick={() => handleRemove(f.recipe.id)}
                  title="Remove from saved"
                  style={{ position:'absolute', top:10, right:10, width:32, height:32, borderRadius:'50%', background:'#E8591A', border:'none', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}
                >
                  🗑️
                </button>
              </div>
              <div style={{ padding:16 }}>
                <h3 style={{ margin:'0 0 4px', fontSize:15, fontWeight:600, color:'#1A1612' }}>{f.recipe.title}</h3>
                <p style={{ margin:'0 0 12px', fontSize:12, color:'#8A7E74' }}>{f.recipe.description || 'No description available.'}</p>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#8A7E74', borderTop:'1px solid #F4F0E8', paddingTop:10 }}>
                  {f.recipe.prep_time_minutes != null && <span>⏱️ {f.recipe.prep_time_minutes} min prep</span>}
                  {f.recipe.servings != null && <span>👥 Serves {f.recipe.servings}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}