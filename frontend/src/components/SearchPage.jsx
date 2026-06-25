import { useState, useRef, useCallback } from 'react';

const INGREDIENT_SUGGESTIONS = [
  'Chicken','Garlic','Tomato','Onion','Paneer','Spinach','Potato','Egg',
  'Butter','Cream','Rice','Pasta','Lemon','Ginger','Mushroom','Bell Pepper',
  'Carrot','Coconut Milk','Olive Oil','Basil','Coriander','Cumin','Turmeric',
  'Chickpeas','Lentils','Beef','Salmon','Shrimp','Tofu','Broccoli',
];

const ALL_RECIPES = [
  { id:1, title:'Creamy Garlic Parmesan Chicken', time:25, difficulty:'Easy', isVeg:false, rating:4.9, ratingCount:2341, cuisine:'Italian', emoji:'🍗', calories:520, ingredients:['Chicken','Garlic','Cream','Butter'], category:'Dinner', description:'Tender chicken in a rich parmesan cream sauce.' },
  { id:2, title:'One-Pot Spicy Tomato Penne',    time:20, difficulty:'Easy', isVeg:true,  rating:4.7, ratingCount:1893, cuisine:'Italian', emoji:'🍝', calories:380, ingredients:['Pasta','Tomato','Garlic','Onion','Basil'], category:'Dinner', description:'Bold tomato sauce with a kick, one pan.' },
  { id:3, title:'Classic Paneer Butter Masala',  time:30, difficulty:'Medium',isVeg:true,  rating:4.8, ratingCount:3102, cuisine:'Indian',  emoji:'🍛', calories:460, ingredients:['Paneer','Tomato','Butter','Cream','Garlic','Ginger','Cumin'], category:'Dinner', description:'Silky tomato-cream curry with golden paneer.' },
  { id:4, title:'Fluffy Avocado Toast with Egg', time:12, difficulty:'Easy', isVeg:false, rating:4.6, ratingCount:978,  cuisine:'American',emoji:'🥑', calories:290, ingredients:['Egg','Butter','Lemon'], category:'Breakfast', description:'Creamy avocado on sourdough with a poached egg.' },
  { id:5, title:'Lemon Honey Glazed Salmon',      time:18, difficulty:'Easy', isVeg:false, rating:4.8, ratingCount:1456, cuisine:'Mediterranean',emoji:'🐟', calories:410, ingredients:['Salmon','Lemon','Garlic','Olive Oil'], category:'Dinner', description:'Flaky salmon with a bright citrus-honey glaze.' },
  { id:6, title:'Zesty Mediterranean Quinoa',    time:15, difficulty:'Easy', isVeg:true,  rating:4.7, ratingCount:721,  cuisine:'Mediterranean',emoji:'🥗', calories:310, ingredients:['Lemon','Olive Oil','Bell Pepper','Carrot'], category:'Lunch', description:'Protein-packed quinoa with roasted veggies.' },
  { id:7, title:'Garlic Butter Mushroom Sauté',  time:14, difficulty:'Easy', isVeg:true,  rating:4.9, ratingCount:1203, cuisine:'Italian',  emoji:'🍄', calories:210, ingredients:['Mushroom','Garlic','Butter','Basil'], category:'Dinner', description:'Golden mushrooms in herb-infused garlic butter.' },
  { id:8, title:'Spicy Thai Basil Chicken',       time:20, difficulty:'Medium',isVeg:false, rating:4.8, ratingCount:2089, cuisine:'Asian',    emoji:'🌶️',calories:390, ingredients:['Chicken','Garlic','Basil','Bell Pepper','Onion'], category:'Dinner', description:'Fragrant stir-fry with holy basil and chilli.' },
  { id:9, title:'Blueberry Banana Oat Bowl',      time:10, difficulty:'Easy', isVeg:true,  rating:4.5, ratingCount:643,  cuisine:'American', emoji:'🥣', calories:340, ingredients:['Coconut Milk'], category:'Breakfast', description:'Creamy overnight oats with fresh fruit.' },
  { id:10,title:'Slow-Cooked Rosemary Beef Stew',time:105,difficulty:'Hard',  isVeg:false, rating:5.0, ratingCount:889,  cuisine:'American', emoji:'🍲', calories:580, ingredients:['Beef','Garlic','Onion','Carrot','Potato','Tomato'], category:'Dinner', description:'Fall-apart beef in a deep herb-scented broth.' },
  { id:11,title:'Dal Tadka',                      time:35, difficulty:'Medium',isVeg:true,  rating:4.7, ratingCount:1654, cuisine:'Indian',   emoji:'🫕', calories:295, ingredients:['Lentils','Garlic','Onion','Tomato','Cumin','Turmeric','Ginger'], category:'Dinner', description:'Smoky spiced lentils with a ghee tempering.' },
  { id:12,title:'Prawn Tacos with Mango Salsa',   time:22, difficulty:'Medium',isVeg:false, rating:4.8, ratingCount:1177, cuisine:'Mexican',  emoji:'🌮', calories:420, ingredients:['Shrimp','Lemon','Garlic','Coriander','Onion'], category:'Lunch', description:'Smoky prawns and sweet mango salsa in tortillas.' },
];

function DifficultyBadge({ level }) {
  const map = { Easy:{bg:'#E1F5EE',text:'#0F6E56'}, Medium:{bg:'#FAEEDA',text:'#854F0B'}, Hard:{bg:'#FCEBEB',text:'#A32D2D'} };
  const s = map[level] || map.Easy;
  return <span style={{ background:s.bg, color:s.text, fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:20 }}>{level}</span>;
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
  return (
    <div
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={() => onView(recipe)}
      style={{ background:'#fff', borderRadius:16, border:`1px solid ${hovered?'#C4BCB4':'#F4F0E8'}`, overflow:'hidden', cursor:'pointer', transition:'all 0.2s', transform:hovered?'translateY(-3px)':'none', boxShadow:hovered?'0 8px 24px rgba(26,22,18,0.10)':'none', display:'flex', flexDirection:'column' }}
    >
      <div style={{ position:'relative', height:160, background:'#F4F0E8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:60 }}>
        {recipe.emoji}
        <button onClick={e=>{e.stopPropagation();onSave(recipe.id);}} style={{ position:'absolute', top:10, right:10, width:32, height:32, borderRadius:'50%', background:saved?'#E8591A':'rgba(255,255,255,0.9)', border:'none', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.10)' }}>
          {saved ? '❤️' : '🤍'}
        </button>
        {recipe.match && (
          <span style={{ position:'absolute', bottom:10, right:10, background:'rgba(26,22,18,0.75)', color:'#fff', fontSize:11, fontWeight:700, padding:'3px 8px', borderRadius:20 }}>
            {recipe.match}% match
          </span>
        )}
      </div>
      <div style={{ padding:16, flex:1, display:'flex', flexDirection:'column', gap:8 }}>
        <div style={{ display:'flex', gap:6 }}><DifficultyBadge level={recipe.difficulty} /><span style={{ fontSize:11, background:'#F4F0E8', color:'#4A3F35', padding:'2px 8px', borderRadius:20, fontWeight:500 }}>{recipe.cuisine}</span></div>
        <h3 style={{ margin:0, fontSize:15, fontWeight:600, color:'#1A1612', lineHeight:1.4 }}>{recipe.title}</h3>
        <p style={{ margin:0, fontSize:12, color:'#8A7E74', lineHeight:1.5 }}>{recipe.description}</p>
        <div style={{ marginTop:'auto', paddingTop:8, borderTop:'1px solid #F4F0E8', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:12, color:'#8A7E74' }}>⏱ {recipe.time} min · {recipe.calories} cal</span>
          <span style={{ fontSize:12, display:'flex', alignItems:'center', gap:4 }}><span style={{color:'#E8591A'}}>★</span><span style={{fontWeight:600}}>{recipe.rating}</span></span>
        </div>
      </div>
    </div>
  );
}

function RecipeModal({ recipe, onClose, onSave, saved }) {
  const [tab, setTab] = useState('overview');
  const [timer, setTimer] = useState(recipe.time * 60);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  useCallback(() => {
    if (running) { ref.current = setInterval(() => setTimer(t => t > 0 ? t - 1 : (setRunning(false), 0)), 1000); }
    else clearInterval(ref.current);
    return () => clearInterval(ref.current);
  }, [running])();

  const mins = String(Math.floor(timer/60)).padStart(2,'0');
  const secs = String(timer%60).padStart(2,'0');

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(26,22,18,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:16 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:20, width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 24px 80px rgba(26,22,18,0.25)' }}>
        <div style={{ height:160, background:'#F4F0E8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:72, position:'relative', borderRadius:'20px 20px 0 0' }}>
          {recipe.emoji}
          <button onClick={onClose} style={{ position:'absolute', top:12, right:12, width:34, height:34, borderRadius:'50%', background:'rgba(255,255,255,0.9)', border:'none', cursor:'pointer', fontSize:20 }}>×</button>
        </div>
        <div style={{ padding:'16px 20px 0' }}>
          <h2 style={{ margin:'0 0 6px', fontSize:20, fontWeight:700, color:'#1A1612' }}>{recipe.title}</h2>
          <p style={{ margin:'0 0 12px', fontSize:13, color:'#8A7E74' }}>{recipe.description}</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:12 }}>
            {[['⏱',recipe.time+'m','Time'],['🔥',recipe.calories,'Cal'],['👥',recipe.servings||4,'Serves'],['📊',(recipe.match||80)+'%','Match']].map(([icon,val,lbl])=>(
              <div key={lbl} style={{ background:'#FDFAF6', borderRadius:10, padding:'10px 8px', textAlign:'center' }}>
                <div style={{fontSize:18}}>{icon}</div><div style={{fontWeight:700,fontSize:14}}>{val}</div><div style={{fontSize:11,color:'#8A7E74'}}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', borderBottom:'1px solid #F4F0E8', margin:'0 20px' }}>
          {['overview','ingredients','nutrition','timer'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{ flex:1, padding:'10px 4px', background:'none', border:'none', borderBottom:tab===t?'2px solid #E8591A':'2px solid transparent', color:tab===t?'#E8591A':'#8A7E74', fontWeight:tab===t?700:400, cursor:'pointer', fontSize:13, textTransform:'capitalize' }}>{t}</button>
          ))}
        </div>
        <div style={{ padding:20 }}>
          {tab==='overview' && ['Prep all ingredients.','Heat oil over medium-high heat.','Sauté aromatics for 2–3 minutes.','Add main ingredients, cook through.','Finish with herbs and lemon.','Plate and serve immediately.'].map((s,i)=>(
            <div key={i} style={{ display:'flex', gap:12, marginBottom:12 }}>
              <span style={{ width:24, height:24, borderRadius:'50%', background:'#FFF0E8', color:'#E8591A', fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{i+1}</span>
              <p style={{ margin:0, fontSize:13, color:'#4A3F35', lineHeight:1.6 }}>{s}</p>
            </div>
          ))}
          {tab==='ingredients' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {recipe.ingredients.map(ing=>(
                <div key={ing} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', background:'#FDFAF6', borderRadius:10, fontSize:13 }}>
                  <span>✓</span><span style={{ color:'#4A3F35', fontWeight:500 }}>{ing}</span>
                </div>
              ))}
            </div>
          )}
          {tab==='nutrition' && [['Calories',recipe.calories,'kcal',100],['Protein',Math.round(recipe.calories*0.08),'g',60],['Carbs',Math.round(recipe.calories*0.14),'g',75],['Fat',Math.round(recipe.calories*0.04),'g',45]].map(([lbl,val,unit,pct])=>(
            <div key={lbl} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:13 }}><span style={{color:'#4A3F35',fontWeight:500}}>{lbl}</span><span style={{fontWeight:600}}>{val} {unit}</span></div>
              <div style={{ height:6, background:'#F4F0E8', borderRadius:4 }}><div style={{ width:`${pct}%`, height:'100%', background:'#E8591A', borderRadius:4 }} /></div>
            </div>
          ))}
          {tab==='timer' && (
            <div style={{ textAlign:'center', padding:'20px 0' }}>
              <div style={{ fontSize:64, fontWeight:700, color:'#1A1612', letterSpacing:-2 }}>{mins}:{secs}</div>
              <p style={{ color:'#8A7E74', fontSize:13, marginBottom:20 }}>Cooking timer · {recipe.title}</p>
              <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
                <button onClick={()=>setRunning(r=>!r)} style={{ padding:'12px 28px', borderRadius:12, background:running?'#FCEBEB':'#E8591A', color:running?'#A32D2D':'#fff', border:'none', fontWeight:600, fontSize:15, cursor:'pointer' }}>{running?'⏸ Pause':'▶ Start'}</button>
                <button onClick={()=>{setTimer(recipe.time*60);setRunning(false);}} style={{ padding:'12px 20px', borderRadius:12, background:'#F4F0E8', color:'#4A3F35', border:'none', fontWeight:500, fontSize:15, cursor:'pointer' }}>↺ Reset</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage({ onToggleSave, savedRecipes }) {
  const [inputValue, setInputValue]   = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [filters, setFilters]         = useState({ veg:false, nonveg:false, under30:false, cuisine:'' });
  const [sortBy, setSortBy]           = useState('match');
  const [loading, setLoading]         = useState(false);
  const [results, setResults]         = useState([]);
  const [searched, setSearched]       = useState(false);
  const [viewing, setViewing]         = useState(null);

  const addIngredient = (ing) => {
    if (!ingredients.includes(ing) && ing.trim()) {
      setIngredients(p => [...p, ing.trim()]);
      setInputValue(''); setSuggestions([]);
    }
  };

 const runSearch = async () => {
    if (ingredients.length === 0) return;
    setLoading(true); setSearched(true);

    try {
      const params = ingredients.map(ing => `ingredients=${encodeURIComponent(ing)}`).join('&');
      const response = await fetch(`http://127.0.0.1:8000/match?${params}&top_n=20`);

      if (!response.ok) throw new Error('Backend error');

      let pool = await response.json();

      pool = pool.map(r => ({
        id: r.id,
        title: r.title,
        description: r.description || 'A delicious recipe.',
        time: r.cook_time_minutes || r.prep_time_minutes || 30,
        difficulty: r.total_ingredients > 10 ? 'Hard' : r.total_ingredients > 6 ? 'Medium' : 'Easy',
        isVeg: true,
        rating: 4.5,
        ratingCount: 100,
        cuisine: 'International',
        emoji: '🍳',
        calories: 400,
        ingredients: r.matched_ingredients,
        category: 'Dinner',
        match: Math.round(r.score * 100),
      }));

      if (filters.veg)     pool = pool.filter(r => r.isVeg);
      if (filters.nonveg)  pool = pool.filter(r => !r.isVeg);
      if (filters.under30) pool = pool.filter(r => r.time < 30);
      if (sortBy === 'match')  pool.sort((a, b) => b.match - a.match);
      if (sortBy === 'rating') pool.sort((a, b) => b.rating - a.rating);
      if (sortBy === 'time')   pool.sort((a, b) => a.time - b.time);

      setResults(pool);
    } catch (err) {
      console.error('Search failed:', err);
      alert('Could not connect to backend. Make sure it is running at http://127.0.0.1:8000');
    } finally {
      setLoading(false);
    }
  };

  const CUISINES = ['Italian','Asian','Mexican','Indian','Mediterranean','American'];

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 20px' }}>
      {viewing && <RecipeModal recipe={viewing} onClose={()=>setViewing(null)} onSave={onToggleSave} saved={savedRecipes.includes(viewing.id)} />}

      <h1 style={{ fontSize:28, fontWeight:800, color:'#1A1612', margin:'0 0 4px' }}>Find a recipe</h1>
      <p style={{ color:'#8A7E74', margin:'0 0 20px', fontSize:15 }}>Add your available ingredients and we'll match the best recipes.</p>

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
        <div style={{ position:'relative' }}>
          <input
            type="text" value={inputValue}
            onChange={e => { setInputValue(e.target.value); setSuggestions(INGREDIENT_SUGGESTIONS.filter(s => s.toLowerCase().includes(e.target.value.toLowerCase()) && !ingredients.includes(s)).slice(0,6)); }}
            onKeyDown={e => { if ((e.key==='Enter'||e.key===',') && inputValue.trim()) { e.preventDefault(); addIngredient(inputValue.trim().replace(',','')); } }}
            placeholder="Type an ingredient and press Enter…"
            style={{ width:'100%', padding:'12px 16px', borderRadius:12, border:'1.5px solid #F4F0E8', background:'#FDFAF6', fontSize:14, color:'#1A1612', outline:'none', boxSizing:'border-box' }}
            onFocus={e=>e.target.style.borderColor='#E8591A'}
            onBlur={e=>{ e.target.style.borderColor='#F4F0E8'; setTimeout(()=>setSuggestions([]),150); }}
          />
          {suggestions.length > 0 && (
            <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#fff', border:'1px solid #F4F0E8', borderRadius:12, marginTop:4, zIndex:50, boxShadow:'0 8px 24px rgba(26,22,18,0.10)', overflow:'hidden' }}>
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

      {/* Filters */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:16, alignItems:'center' }}>
        {[['🌱 Veg only','veg'],['🍖 Non-veg','nonveg'],['⏱ Under 30 min','under30']].map(([label,key])=>(
          <button key={key} onClick={()=>setFilters(f=>({...f,[key]:!f[key]}))} style={{ padding:'7px 14px', borderRadius:20, border:`1.5px solid ${filters[key]?'#E8591A':'#F4F0E8'}`, background:filters[key]?'#FFF0E8':'#fff', color:filters[key]?'#E8591A':'#4A3F35', fontSize:13, fontWeight:500, cursor:'pointer' }}>
            {label}
          </button>
        ))}
        <select value={filters.cuisine} onChange={e=>setFilters(f=>({...f,cuisine:e.target.value}))} style={{ padding:'7px 14px', borderRadius:20, border:'1.5px solid #F4F0E8', background:'#fff', color:'#4A3F35', fontSize:13, cursor:'pointer', outline:'none' }}>
          <option value="">All cuisines</option>
          {CUISINES.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <div style={{ marginLeft:'auto', display:'flex', gap:6, alignItems:'center' }}>
          <span style={{ fontSize:12, color:'#8A7E74' }}>Sort:</span>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ padding:'7px 12px', borderRadius:20, border:'1.5px solid #F4F0E8', background:'#fff', color:'#4A3F35', fontSize:13, cursor:'pointer', outline:'none' }}>
            <option value="match">Best match</option>
            <option value="rating">Highest rated</option>
            <option value="time">Quickest</option>
            <option value="calories">Lowest calories</option>
          </select>
        </div>
      </div>

      {/* Search button */}
      <button onClick={runSearch} disabled={loading} style={{ width:'100%', padding:14, borderRadius:14, background:loading?'#C4BCB4':'#E8591A', color:'#fff', border:'none', fontSize:16, fontWeight:700, cursor:loading?'not-allowed':'pointer', marginBottom:24 }}>
        {loading ? '🔍 Finding recipes…' : `🍳 Find Recipes${ingredients.length>0?` using ${ingredients.length} ingredient${ingredients.length>1?'s':''}`:''}` }
      </button>

      {/* Results */}
      {loading && <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>{[1,2,3,4,5,6].map(i=><SkeletonCard key={i}/>)}</div>}

      {!loading && searched && results.length === 0 && (
        <div style={{ textAlign:'center', padding:'60px 20px', background:'#FDFAF6', borderRadius:16 }}>
          <div style={{ fontSize:56, marginBottom:12 }}>🥲</div>
          <h3 style={{ color:'#1A1612', margin:'0 0 8px' }}>No recipes found</h3>
          <p style={{ color:'#8A7E74', fontSize:14 }}>Try different ingredients or remove some filters.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div>
          <p style={{ color:'#8A7E74', fontSize:14, marginBottom:14 }}>{results.length} recipe{results.length>1?'s':''} found</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
            {results.map(r => (
              <div key={r.id}>
                <RecipeCard recipe={r} onSave={onToggleSave} saved={savedRecipes.includes(r.id)} onView={setViewing} />
                {ingredients.length>0 && <div style={{ marginTop:8, padding:'0 4px' }}><MatchBar pct={r.match}/></div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {!searched && (
        <div style={{ textAlign:'center', padding:'60px 20px' }}>
          <div style={{ fontSize:64, marginBottom:12 }}>🧑‍🍳</div>
          <h3 style={{ color:'#1A1612', margin:'0 0 8px', fontSize:20 }}>Add ingredients to get started</h3>
          <p style={{ color:'#8A7E74', fontSize:14 }}>The more you add, the better the match!</p>
        </div>
      )}
    </div>
  );
}