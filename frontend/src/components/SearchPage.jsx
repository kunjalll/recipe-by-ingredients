import { useState } from 'react';
import { API } from '../lib/api';

const INGREDIENT_SUGGESTIONS = [
  'Chicken','Garlic','Tomato','Onion','Paneer','Spinach','Potato','Egg',
  'Butter','Cream','Rice','Pasta','Lemon','Ginger','Mushroom','Bell Pepper',
  'Carrot','Coconut Milk','Olive Oil','Basil','Coriander','Cumin','Turmeric',
  'Chickpeas','Lentils','Beef','Salmon','Shrimp','Tofu','Broccoli',
];

function toPercent(score) {
  if (score == null) return 0;
  const val = score <= 1 ? score * 100 : score;
  return Math.max(0, Math.min(100, Math.round(val)));
}

function MatchBar({ pct }) {
  const color = pct >= 85 ? '#1D9E75' : pct >= 70 ? '#BA7517' : '#C4BCB4';
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ flex:1, height:4, background:'#F4F0E8', borderRadius:4 }}>
        <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:4, transition:'width 0.5s ease' }} />
      </div>
      <span style={{ fontSize:12, fontWeight:700, color, minWidth:36 }}>{pct}%</span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background:'#fff', borderRadius:16, border:'1px solid #F4F0E8', overflow:'hidden', animation:'pulse 1.5s ease-in-out infinite' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      <div style={{ height:160, background:'#F4F0E8' }} />
      <div style={{ padding:16 }}>
        {[80,55,40].map((w,i) => <div key={i} style={{ height:i===0?16:12, width:`${w}%`, background:'#F4F0E8', borderRadius:4, marginBottom:i<2?10:0 }} />)}
      </div>
    </div>
  );
}

function RecipeCard({ recipe, onSave, saved, onView }) {
  const [hovered, setHovered] = useState(false);
  const pct = toPercent(recipe.score);
  return (
    <div
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={() => onView(recipe)}
      style={{ background:'#fff', borderRadius:16, border:`1px solid ${hovered?'#C4BCB4':'#F4F0E8'}`, overflow:'hidden', cursor:'pointer', transition:'all 0.2s', transform:hovered?'translateY(-3px)':'none', boxShadow:hovered?'0 8px 24px rgba(26,22,18,0.10)':'none', display:'flex', flexDirection:'column' }}
    >
      <div style={{ position:'relative', height:160, background:'#F4F0E8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:60 }}>
        🍽️
        <button onClick={e=>{e.stopPropagation();onSave(recipe.id);}} style={{ position:'absolute', top:10, right:10, width:32, height:32, borderRadius:'50%', background:saved?'#E8591A':'rgba(255,255,255,0.9)', border:'none', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.10)' }}>
          {saved ? '❤️' : '🤍'}
        </button>
        {recipe.score != null && (
          <span style={{ position:'absolute', bottom:10, right:10, background:'rgba(26,22,18,0.75)', color:'#fff', fontSize:11, fontWeight:700, padding:'3px 8px', borderRadius:20 }}>
            {pct}% match
          </span>
        )}
      </div>
      <div style={{ padding:16, flex:1, display:'flex', flexDirection:'column', gap:8 }}>
        <h3 style={{ margin:0, fontSize:15, fontWeight:600, color:'#1A1612', lineHeight:1.4 }}>{recipe.title}</h3>
        <p style={{ margin:0, fontSize:12, color:'#8A7E74', lineHeight:1.5 }}>{recipe.description || 'No description available.'}</p>
        {recipe.match_count != null && recipe.total_ingredients != null && (
          <div style={{ marginTop:'auto', paddingTop:8, borderTop:'1px solid #F4F0E8' }}>
            <span style={{ fontSize:12, color:'#8A7E74' }}>
              {recipe.match_count} of {recipe.total_ingredients} ingredients matched
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function RecipeModal({ recipe, onClose, onSave, saved, loading }) {
  const [tab, setTab] = useState('overview');

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(26,22,18,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:16 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:20, width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 24px 80px rgba(26,22,18,0.25)' }}>
        <div style={{ height:160, background:'#F4F0E8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:72, position:'relative', borderRadius:'20px 20px 0 0' }}>
          🍽️
          <button onClick={onClose} style={{ position:'absolute', top:12, right:12, width:34, height:34, borderRadius:'50%', background:'rgba(255,255,255,0.9)', border:'none', cursor:'pointer', fontSize:20 }}>×</button>
        </div>
        <div style={{ padding:'16px 20px 0' }}>
          <h2 style={{ margin:'0 0 6px', fontSize:20, fontWeight:700, color:'#1A1612' }}>{recipe.title}</h2>
          {recipe.description && <p style={{ margin:'0 0 12px', fontSize:13, color:'#8A7E74' }}>{recipe.description}</p>}
          {loading ? (
            <p style={{ fontSize:13, color:'#8A7E74' }}>Loading details…</p>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:12 }}>
              {[['👥',recipe.servings ?? '—','Serves'],['⏱️',recipe.prep_time_minutes ?? '—','Prep min'],['🔥',recipe.cook_time_minutes ?? '—','Cook min']].map(([icon,val,lbl])=>(
                <div key={lbl} style={{ background:'#FDFAF6', borderRadius:10, padding:'10px 8px', textAlign:'center' }}>
                  <div style={{fontSize:18}}>{icon}</div><div style={{fontWeight:700,fontSize:14}}>{val}</div><div style={{fontSize:11,color:'#8A7E74'}}>{lbl}</div>
                </div>
              ))}
            </div>
          )}
          <button onClick={()=>onSave(recipe.id)} style={{ width:'100%', padding:'10px 0', borderRadius:12, border:'none', background:saved?'#F4F0E8':'#FFF0E8', color:'#E8591A', fontWeight:700, fontSize:14, cursor:'pointer', marginBottom:16 }}>
            {saved ? '❤️ Saved' : '🤍 Save recipe'}
          </button>
        </div>
        <div style={{ display:'flex', borderBottom:'1px solid #F4F0E8', margin:'0 20px' }}>
          {['overview','ingredients'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{ flex:1, padding:'10px 4px', background:'none', border:'none', borderBottom:tab===t?'2px solid #E8591A':'2px solid transparent', color:tab===t?'#E8591A':'#8A7E74', fontWeight:tab===t?700:400, cursor:'pointer', fontSize:13, textTransform:'capitalize' }}>{t}</button>
          ))}
        </div>
        <div style={{ padding:20 }}>
          {loading && <p style={{ fontSize:13, color:'#8A7E74' }}>Loading…</p>}
          {!loading && tab==='overview' && (
            <p style={{ margin:0, fontSize:13, color:'#4A3F35', lineHeight:1.7, whiteSpace:'pre-wrap' }}>
              {recipe.instructions || 'No instructions available.'}
            </p>
          )}
          {!loading && tab==='ingredients' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {(recipe.ingredients || []).map(ing=>(
                <div key={ing.id ?? ing.name} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', background:'#FDFAF6', borderRadius:10, fontSize:13 }}>
                  <span>✓</span>
                  <span style={{ color:'#4A3F35', fontWeight:500 }}>
                    {ing.name}{ing.quantity ? ` — ${ing.quantity}${ing.unit ? ' ' + ing.unit : ''}` : ''}
                  </span>
                </div>
              ))}
              {(!recipe.ingredients || recipe.ingredients.length === 0) && (
                <p style={{ fontSize:13, color:'#8A7E74' }}>No ingredient list available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage({ onToggleSave, savedRecipes, onViewRecipe, onNavigate, initialResults, initialDetected }) {
  const [inputValue, setInputValue]   = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [results, setResults]         = useState(initialResults || []);
  const [searched, setSearched]       = useState(!!(initialResults && initialResults.length) || !!(initialDetected && initialDetected.length));
  const [viewing, setViewing]         = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [error, setError]             = useState('');
  const [detected, setDetected]       = useState(initialDetected || null);
  const addIngredient = (ing) => {
    if (!ingredients.includes(ing) && ing.trim()) {
      setIngredients(p => [...p, ing.trim()]);
      setInputValue(''); setSuggestions([]);
    }
  };

  const handleView = async (recipe) => {
    setViewing(recipe);
    setViewLoading(true);
    try {
      const res = await API(`/recipes/${recipe.id}`);
      if (res.ok) {
        const full = await res.json();
        setViewing(full);
        onViewRecipe?.({ id: full.id, name: full.title });
      }
    } catch (e) {
      // keep showing the summary version if the detail fetch fails
    } finally {
      setViewLoading(false);
    }
  };

  const runSearch = async () => {
    if (ingredients.length === 0) return;
    setLoading(true); setSearched(true); setError(''); setDetected(null);
    try {
      const params = new URLSearchParams();
      ingredients.forEach(ing => params.append('ingredients', ing));
      params.append('top_n', '12');
      const res = await API(`/match?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setError('Search failed. Please try again.');
        setResults([]);
      } else {
        setResults(data);
      }
    } catch (e) {
      setError('Network error. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageFile = async (file) => {
    if (!file) return;
    setLoading(true); setSearched(true); setError(''); setDetected(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await API('/match/from-image?top_n=12', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError('Image search failed. Please try again.');
        setResults([]);
      } else {
        setResults(data.matches || []);
        setDetected(data.detected_ingredients || []);
      }
    } catch (e) {
      setError('Network error. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 20px' }}>
      {viewing && (
        <RecipeModal
          recipe={viewing}
          loading={viewLoading}
          onClose={()=>setViewing(null)}
          onSave={onToggleSave}
          saved={savedRecipes.includes(viewing.id)}
        />
      )}

      <h1 style={{ fontSize:28, fontWeight:800, color:'#1A1612', margin:'0 0 4px' }}>Find a recipe</h1>
      <p style={{ color:'#8A7E74', margin:'0 0 20px', fontSize:15 }}>Add your ingredients, snap a photo, or upload one — we'll match the best recipes.</p>

      {/* Ingredient input box */}
      <div style={{ background:'#fff', borderRadius:16, border:'1px solid #F4F0E8', padding:20, marginBottom:14, boxShadow:'0 2px 12px rgba(26,22,18,0.06)' }}>
        <label style={{ fontSize:11, fontWeight:600, color:'#8A7E74', textTransform:'uppercase', letterSpacing:0.8, display:'block', marginBottom:10 }}>Your Ingredients</label>
        {ingredients.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:12 }}>
            {ingredients.map(ing => (
              <span key={ing} style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#FFF0E8', color:'#E8591A', border:'1px solid #E8591A33', borderRadius:20, padding:'4px 12px 4px 14px', fontSize:13, fontWeight:500 }}>
                {ing}
                <button onClick={()=>setIngredients(p=>p.filter(i=>i!==ing))} style={{ background:'none', border:'none', cursor:'pointer', color:'#E8591A', fontSize:16, padding:0 }}>×</button>
              </span>
            ))}
          </div>
        )}

        {/* Search bar row: text input + camera + upload, Google-style */}
        <div style={{ position:'relative', display:'flex', alignItems:'center', gap:8, border:'1.5px solid #F4F0E8', borderRadius:14, background:'#FDFAF6', padding:'4px 6px 4px 16px' }}>
          <input
            type="text" value={inputValue}
            onChange={e => { setInputValue(e.target.value); setSuggestions(INGREDIENT_SUGGESTIONS.filter(s => s.toLowerCase().includes(e.target.value.toLowerCase()) && !ingredients.includes(s)).slice(0,6)); }}
            onKeyDown={e => { if ((e.key==='Enter'||e.key===',') && inputValue.trim()) { e.preventDefault(); addIngredient(inputValue.trim().replace(',','')); } }}
            placeholder="Type an ingredient and press Enter…"
            style={{ flex:1, padding:'11px 0', border:'none', background:'transparent', fontSize:14, color:'#1A1612', outline:'none' }}
            onBlur={()=>setTimeout(()=>setSuggestions([]),150)}
          />

          <button
            type="button"
            title="Take a photo"
            onClick={() => onNavigate?.('camera')}
            style={{ width:36, height:36, borderRadius:'50%', border:'none', background:'#F4F0E8', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}
          >
            📷
          </button>

          <label
            title="Upload a photo"
            style={{ width:36, height:36, borderRadius:'50%', border:'none', background:'#F4F0E8', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}
          >
            📁
            <input
              type="file"
              accept="image/*"
              onChange={e => { handleImageFile(e.target.files?.[0]); e.target.value = ''; }}
              style={{ display:'none' }}
            />
          </label>

          {suggestions.length > 0 && (
            <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#fff', border:'1px solid #F4F0E8', borderRadius:12, marginTop:6, zIndex:50, boxShadow:'0 8px 24px rgba(26,22,18,0.10)', overflow:'hidden' }}>
              {suggestions.map(s => (
                <div key={s} onMouseDown={()=>addIngredient(s)} style={{ padding:'10px 16px', cursor:'pointer', fontSize:14, color:'#4A3F35' }}
                  onMouseEnter={e=>e.target.style.background='#FDFAF6'}
                  onMouseLeave={e=>e.target.style.background='transparent'}
                >+ {s}</div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop:10, display:'flex', flexWrap:'wrap', gap:6 }}>
          <span style={{ fontSize:12, color:'#C4BCB4', alignSelf:'center' }}>Quick add:</span>
          {['Tomato','Garlic','Onion','Chicken','Paneer'].filter(i=>!ingredients.includes(i)).map(s=>(
            <button key={s} onMouseDown={()=>addIngredient(s)} style={{ background:'#F4F0E8', color:'#4A3F35', border:'none', borderRadius:20, padding:'4px 12px', fontSize:12, cursor:'pointer', fontWeight:500 }}>+ {s}</button>
          ))}
        </div>
      </div>

      {/* Search button */}
      <button onClick={runSearch} disabled={loading || ingredients.length===0} style={{ width:'100%', padding:14, borderRadius:14, background:(loading||ingredients.length===0)?'#C4BCB4':'#E8591A', color:'#fff', border:'none', fontSize:16, fontWeight:700, cursor:(loading||ingredients.length===0)?'not-allowed':'pointer', marginBottom:24 }}>
        {loading ? '🔍 Finding recipes…' : `🍳 Find Recipes${ingredients.length>0?` using ${ingredients.length} ingredient${ingredients.length>1?'s':''}`:''}` }
      </button>

      {error && (
        <div style={{ background:'#FDECE6', color:'#B8431A', fontSize:13, padding:'10px 14px', borderRadius:10, marginBottom:16 }}>
          {error}
        </div>
      )}

      {detected && detected.length > 0 && (
        <div style={{ background:'#FFF0E8', color:'#E8591A', fontSize:13, padding:'10px 14px', borderRadius:10, marginBottom:16 }}>
          Detected: {detected.join(', ')}
        </div>
      )}

      {/* Results */}
      {loading && <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>{[1,2,3,4,5,6].map(i=><SkeletonCard key={i}/>)}</div>}

      {!loading && searched && results.length === 0 && !error && (
        <div style={{ textAlign:'center', padding:'60px 20px', background:'#FDFAF6', borderRadius:16 }}>
          <div style={{ fontSize:56, marginBottom:12 }}>🥲</div>
          <h3 style={{ color:'#1A1612', margin:'0 0 8px' }}>No recipes found</h3>
          <p style={{ color:'#8A7E74', fontSize:14 }}>Try different ingredients.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div>
          <p style={{ color:'#8A7E74', fontSize:14, marginBottom:14 }}>{results.length} recipe{results.length>1?'s':''} found</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
            {results.map(r => (
              <div key={r.id}>
                <RecipeCard recipe={r} onSave={onToggleSave} saved={savedRecipes.includes(r.id)} onView={handleView} />
                <div style={{ marginTop:8, padding:'0 4px' }}><MatchBar pct={toPercent(r.score)}/></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!searched && (
        <div style={{ textAlign:'center', padding:'60px 20px' }}>
          <div style={{ fontSize:64, marginBottom:12 }}>🧑‍🍳</div>
          <h3 style={{ color:'#1A1612', margin:'0 0 8px', fontSize:20 }}>Add ingredients to get started</h3>
          <p style={{ color:'#8A7E74', fontSize:14 }}>Type them in, snap a photo, or upload one.</p>
        </div>
      )}
    </div>
  );
}