import { useState, useEffect } from 'react';

const INGREDIENT_SUGGESTIONS = [
  'Chicken','Garlic','Tomato','Onion','Paneer','Spinach','Potato','Egg',
  'Butter','Cream','Rice','Pasta','Lemon','Ginger','Mushroom','Bell Pepper',
  'Carrot','Coconut Milk','Olive Oil','Basil','Coriander','Cumin','Turmeric',
  'Chickpeas','Lentils','Beef','Salmon','Shrimp','Tofu','Broccoli',
];

const CATEGORY_IMAGES = [
  { label:'DINNER',      url:'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80' },
  { label:'SALADS',      url:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80' },
  { label:'HEALTHY',     url:'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80' },
  { label:'QUICK & EASY',url:'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80' },
  { label:'INDIAN',      url:'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80' },
  { label:'BREAKFAST',   url:'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80' },
];

const RECIPE_IMAGES = {
  1: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80',
  2: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80',
  3: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80',
  4: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
  5: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80',
  6: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  7: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80',
  8: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80',
  9: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
  10:'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&q=80',
  11:'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',
};

const masterRecipes = {
  popular: {
    Dinner: [
      { id:1, title:'Creamy Garlic Parmesan Chicken', time:25, isVeg:false, match:'95%', rating:'4.9', tags:['Non-Veg','Easy']  },
      { id:2, title:'One-Pot Spicy Tomato Penne',     time:20, isVeg:true,  match:'88%', rating:'4.7', tags:['Veg','Quick']     },
      { id:3, title:'Classic Paneer Butter Masala',   time:30, isVeg:true,  match:'80%', rating:'4.8', tags:['Veg','Rich']      },
      { id:4, title:'Juicy Grilled Beef Steak',       time:35, isVeg:false, match:'75%', rating:'4.9', tags:['Non-Veg']         },
    ],
    Breakfast: [
      { id:5, title:'Fluffy Avocado Toast with Egg',   time:15, isVeg:false, match:'95%', rating:'4.9', tags:['Healthy','Quick'] },
      { id:6, title:'Blueberry Banana Oats Bowl',      time:10, isVeg:true,  match:'90%', rating:'4.6', tags:['Veg','Vegan']    },
      { id:7, title:'Loaded Mushroom & Cheese Omelet', time:12, isVeg:false, match:'82%', rating:'4.7', tags:['Non-Veg']        },
    ],
  },
  recent: [
    { id:8,  title:'Slow-Cooked Rosemary Beef Stew',  time:105, isVeg:false, date:'Added today',     rating:'5.0', author:'Chef Milan'   },
    { id:9,  title:'Lemon Honey Glazed Salmon',        time:18,  isVeg:false, date:'Added yesterday', rating:'4.8', author:'Soniya K.'    },
    { id:10, title:'Zesty Mediterranean Quinoa Salad', time:15,  isVeg:true,  date:'2 days ago',      rating:'4.7', author:'Aashutosh S.' },
    { id:11, title:'Garlic Butter Sautéed Mushrooms',  time:14,  isVeg:true,  date:'3 days ago',      rating:'4.9', author:'Diya B.'      },
  ],
};

const footerCuisines = [
  { name:'Italian', icon:'🍝' },
  { name:'Asian',   icon:'🍜' },
  { name:'Mexican', icon:'🌮' },
  { name:'Indian',  icon:'🍛' },
];

export default function LandingPage({ onNavigate }) {
  const [searchQuery,      setSearchQuery]      = useState('');
  const [ingredients,      setIngredients]      = useState([]);
  const [suggestions,      setSuggestions]      = useState([]);
  const [activeTab,        setActiveTab]        = useState('Dinner');
  const [isRefreshing,     setIsRefreshing]     = useState(false);
  const [displayedPopular, setDisplayedPopular] = useState(masterRecipes.popular.Dinner);
  const [displayedRecent,  setDisplayedRecent]  = useState(masterRecipes.recent);
  const [filters, setFilters] = useState([
    { label:'All',          icon:'✨', active:true  },
    { label:'Veg',          icon:'🌱', active:false },
    { label:'Non-veg',      icon:'🍖', active:false },
    { label:'Under 30 min', icon:'⏱️', active:false },
  ]);

  // ── Filtering ─────────────────────────────────────────────────────────────
  useEffect(() => {
    setIsRefreshing(true);
    const t = setTimeout(() => {
      const isVeg     = filters.find(f => f.label === 'Veg')?.active;
      const isNonVeg  = filters.find(f => f.label === 'Non-veg')?.active;
      const isUnder30 = filters.find(f => f.label === 'Under 30 min')?.active;

      const applyFilters = (list) => list.filter(r => {
        if (isVeg     && !r.isVeg)     return false;
        if (isNonVeg  &&  r.isVeg)     return false;
        if (isUnder30 && r.time >= 30) return false;
        if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      });

      setDisplayedPopular(applyFilters(masterRecipes.popular[activeTab] || []));
      setDisplayedRecent(applyFilters(masterRecipes.recent));
      setIsRefreshing(false);
    }, 250);
    return () => clearTimeout(t);
  }, [filters, activeTab, searchQuery]);

  const handleFilterClick = (label) => {
    setFilters(prev => prev.map(f => {
      if (label === 'All')   return { ...f, active: f.label === 'All' };
      if (f.label === 'All') return { ...f, active: false };
      if (f.label === label) return { ...f, active: !f.active };
      return f;
    }));
  };

  const addIngredient = (ing) => {
    const cleaned = ing.trim();
    if (cleaned && !ingredients.includes(cleaned))
      setIngredients(prev => [...prev, cleaned]);
    setSearchQuery('');
    setSuggestions([]);
  };

  const handleInputChange = (val) => {
    setSearchQuery(val);
    setSuggestions(
      val.length > 0
        ? INGREDIENT_SUGGESTIONS.filter(s =>
            s.toLowerCase().includes(val.toLowerCase()) && !ingredients.includes(s)
          ).slice(0, 6)
        : []
    );
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && searchQuery.trim()) {
      e.preventDefault();
      addIngredient(searchQuery.replace(',', ''));
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display:'flex', flexDirection:'column' }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div style={{
        background:'linear-gradient(135deg, #1A1612 0%, #2D261E 100%)',
        padding:'64px 24px 52px', textAlign:'center',
      }}>
        <div style={{
          display:'inline-block', background:'#E8591A22',
          border:'1px solid #E8591A44', color:'#E8591A',
          borderRadius:20, padding:'4px 14px', fontSize:12,
          fontWeight:600, marginBottom:16, letterSpacing:0.5,
        }}>
          🌱 AI-Powered Recipe Discovery
        </div>

        <h1 style={{
          fontSize:'clamp(30px, 5vw, 50px)', fontWeight:800,
          color:'#fff', margin:'0 0 12px', lineHeight:1.15, letterSpacing:-1,
        }}>
          What's in your<br />
          <span style={{ color:'#E8591A' }}>kitchen today?</span>
        </h1>

        <p style={{ color:'#A8A098', fontSize:16, maxWidth:440, margin:'0 auto 32px', lineHeight:1.6 }}>
          Tell us your ingredients. We'll find the perfect recipe — instantly, intelligently.
        </p>

        {/* Ingredient input card */}
        <div style={{
          width:'100%', maxWidth:540, margin:'0 auto',
          background:'#211D19', borderRadius:20, padding:24,
          border:'1px solid #2A2520', boxShadow:'0 8px 32px rgba(0,0,0,0.3)',
          textAlign:'left',
        }}>
          <label style={{
            display:'block', textAlign:'center', color:'#8A7E74',
            fontSize:11, fontWeight:600, letterSpacing:0.8,
            textTransform:'uppercase', marginBottom:10,
          }}>
            Your Ingredients
          </label>

          {/* Chips */}
          {ingredients.length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:12 }}>
              {ingredients.map(ing => (
                <span key={ing} style={{
                  display:'inline-flex', alignItems:'center', gap:6,
                  background:'#FFF0E8', color:'#E8591A',
                  border:'1px solid #E8591A33', borderRadius:20,
                  padding:'4px 12px 4px 14px', fontSize:13, fontWeight:500,
                }}>
                  {ing}
                  <button
                    onClick={() => setIngredients(p => p.filter(i => i !== ing))}
                    style={{ background:'none', border:'none', cursor:'pointer', color:'#E8591A', fontSize:16, padding:0, lineHeight:1 }}
                  >×</button>
                </span>
              ))}
            </div>
          )}

          {/* Input + autocomplete */}
          <div style={{ position:'relative', marginBottom:14 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type an ingredient and press Enter…"
              style={{
                width:'100%', padding:'12px 16px', borderRadius:12,
                border:'1.5px solid #2A2520', background:'#2A2520',
                color:'#F4F0E8', fontSize:14, outline:'none',
                boxSizing:'border-box', transition:'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#E8591A'}
              onBlur={e  => { e.target.style.borderColor = '#2A2520'; setTimeout(() => setSuggestions([]), 150); }}
            />
            {suggestions.length > 0 && (
              <div style={{
                position:'absolute', top:'100%', left:0, right:0,
                background:'#211D19', border:'1px solid #2A2520',
                borderRadius:12, marginTop:4, zIndex:50, overflow:'hidden',
                boxShadow:'0 8px 24px rgba(0,0,0,0.3)',
              }}>
                {suggestions.map(s => (
                  <div
                    key={s}
                    onMouseDown={() => addIngredient(s)}
                    style={{ padding:'10px 16px', cursor:'pointer', fontSize:13, color:'#C4BCB4', transition:'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#2A2520'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    + {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick-add */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
            <span style={{ fontSize:11, color:'#8A7E74', alignSelf:'center' }}>Quick add:</span>
            {['Tomato','Garlic','Chicken','Paneer','Onion']
              .filter(i => !ingredients.includes(i))
              .map(s => (
                <button
                  key={s}
                  onMouseDown={() => addIngredient(s)}
                  style={{
                    background:'#2A2520', color:'#C4BCB4', border:'none',
                    borderRadius:20, padding:'4px 12px', fontSize:12,
                    cursor:'pointer', fontWeight:500,
                  }}
                >
                  + {s}
                </button>
              ))}
          </div>

          {/* Filter pills */}
          <label style={{
            display:'block', textAlign:'center', color:'#8A7E74',
            fontSize:11, fontWeight:600, letterSpacing:0.8,
            textTransform:'uppercase', marginBottom:10,
          }}>
            Filters
          </label>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, justifyContent:'center', marginBottom:20 }}>
            {filters.map((item, i) => (
              <button
                key={i}
                onClick={() => handleFilterClick(item.label)}
                style={{
                  display:'flex', alignItems:'center', gap:4,
                  padding:'6px 14px', borderRadius:20,
                  fontSize:12, fontWeight:500, cursor:'pointer',
                  transition:'all 0.15s',
                  background: item.active ? '#FFF0E8' : '#2A2520',
                  color:      item.active ? '#E8591A' : '#C4BCB4',
                  border:     item.active ? '1px solid #E8591A44' : '1px solid #3A3530',
                }}
              >
                <span>{item.icon}</span><span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* CTA button */}
          <button
            onClick={() => onNavigate && onNavigate('search')}
            style={{
              width:'100%', padding:'13px', borderRadius:13,
              background:'#E8591A', color:'#fff', border:'none',
              fontSize:15, fontWeight:700, cursor:'pointer',
              transition:'background 0.2s', letterSpacing:0.3,
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#D14A12'}
            onMouseLeave={e => e.currentTarget.style.background = '#E8591A'}
          >
            🍳 Find Recipes{ingredients.length > 0 ? ` using ${ingredients.length} ingredient${ingredients.length > 1 ? 's' : ''}` : ''}
          </button>
        </div>

        {/* Stats strip */}
        <div style={{ display:'flex', gap:36, justifyContent:'center', marginTop:36, flexWrap:'wrap' }}>
          {[['1,200+','Recipes'],['50k+','Cooks'],['4.9★','Avg Rating']].map(([n,l]) => (
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontSize:22, fontWeight:800, color:'#fff' }}>{n}</div>
              <div style={{ fontSize:12, color:'#A8A098' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORY PHOTO STRIP ──────────────────────────────────────────── */}
      <div style={{ background:'#fff', padding:'48px 0 0' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px' }}>
          <h2 style={{ fontSize:22, fontWeight:700, color:'#1A1612', margin:'0 0 4px' }}>
            Browse by Category
          </h2>
          <p style={{ color:'#8A7E74', fontSize:14, margin:'0 0 20px' }}>
            Pick a style and find your next favourite meal.
          </p>
        </div>

        {/* Full-bleed horizontal photo strip — matches your reference image */}
        <div style={{
          display:'flex',
          overflowX:'auto',
          scrollbarWidth:'none',
          msOverflowStyle:'none',
          gap:0,
        }}>
          {CATEGORY_IMAGES.map((cat, i) => (
            <div
              key={cat.label}
              onClick={() => onNavigate && onNavigate('search')}
              style={{
                position:'relative',
                flexShrink:0,
                width:'clamp(180px, 18vw, 260px)',
                height:340,
                cursor:'pointer',
                overflow:'hidden',
                borderRight: i < CATEGORY_IMAGES.length - 1 ? '3px solid #fff' : 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.querySelector('img').style.transform = 'scale(1.07)';
                e.currentTarget.querySelector('.badge').style.background = '#E8591A';
              }}
              onMouseLeave={e => {
                e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                e.currentTarget.querySelector('.badge').style.background = '#C68A35';
              }}
            >
              {/* Photo */}
              <img
                src={cat.url}
                alt={cat.label}
                style={{
                  width:'100%', height:'100%',
                  objectFit:'cover', display:'block',
                  transition:'transform 0.45s ease',
                }}
              />

              {/* Subtle dark gradient at bottom */}
              <div style={{
                position:'absolute', inset:0,
                background:'linear-gradient(to top, rgba(26,22,18,0.50) 0%, transparent 55%)',
                pointerEvents:'none',
              }} />

              {/* Label badge — exact style from your reference */}
              <div
                className="badge"
                style={{
                  position:'absolute',
                  bottom:22,
                  left:'50%',
                  transform:'translateX(-50%)',
                  background:'#C68A35',
                  color:'#fff',
                  fontSize:11,
                  fontWeight:800,
                  letterSpacing:2,
                  textTransform:'uppercase',
                  padding:'7px 20px',
                  borderRadius:3,
                  whiteSpace:'nowrap',
                  transition:'background 0.2s',
                  boxShadow:'0 2px 14px rgba(0,0,0,0.25)',
                }}
              >
                {cat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── POPULAR THIS WEEK ─────────────────────────────────────────────── */}
      <div style={{ maxWidth:1100, margin:'0 auto', width:'100%', padding:'48px 24px 0' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
          <div>
            <h2 style={{ fontSize:22, fontWeight:700, color:'#1A1612', margin:'0 0 2px', display:'flex', alignItems:'center', gap:8 }}>
              Popular This Week
              {isRefreshing && <span style={{ fontSize:12, color:'#E8591A', fontWeight:400 }}>(updating…)</span>}
            </h2>
            <p style={{ color:'#8A7E74', fontSize:13, margin:0 }}>Custom-tailored matching suggestions.</p>
          </div>

          {/* Tab switcher */}
          <div style={{ display:'flex', gap:4, background:'#F4F0E8', padding:4, borderRadius:12 }}>
            {['Dinner','Breakfast'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding:'6px 16px', borderRadius:9, border:'none',
                  background: activeTab === tab ? '#fff' : 'transparent',
                  color:      activeTab === tab ? '#1A1612' : '#8A7E74',
                  fontWeight: activeTab === tab ? 700 : 500,
                  fontSize:13, cursor:'pointer', transition:'all 0.15s',
                  boxShadow:  activeTab === tab ? '0 1px 4px rgba(26,22,18,0.10)' : 'none',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {displayedPopular.length === 0 ? (
          <div style={{ textAlign:'center', padding:'48px 20px', background:'#FDFAF6', borderRadius:16, color:'#8A7E74', fontSize:14 }}>
            No recipes match these filters — try resetting them!
          </div>
        ) : (
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))',
            gap:16,
            opacity: isRefreshing ? 0.4 : 1,
            transition:'opacity 0.2s',
          }}>
            {displayedPopular.map(recipe => (
              <div
                key={recipe.id}
                style={{
                  background:'#fff', borderRadius:16,
                  border:'1px solid #F4F0E8', overflow:'hidden',
                  cursor:'pointer', transition:'all 0.25s',
                  display:'flex', flexDirection:'column',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(26,22,18,0.13)';
                  e.currentTarget.querySelector('img').style.transform = 'scale(1.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                }}
              >
                {/* Real photo */}
                <div style={{ position:'relative', height:200, overflow:'hidden', background:'#F4F0E8' }}>
                  <img
                    src={RECIPE_IMAGES[recipe.id]}
                    alt={recipe.title}
                    style={{
                      width:'100%', height:'100%',
                      objectFit:'cover', display:'block',
                      transition:'transform 0.4s ease',
                    }}
                  />
                  {/* Veg / Non-veg dot */}
                  <span style={{
                    position:'absolute', top:12, left:12,
                    width:11, height:11, borderRadius:'50%',
                    background: recipe.isVeg ? '#1D9E75' : '#E8591A',
                    border:'2px solid #fff', display:'block',
                    boxShadow:'0 1px 4px rgba(0,0,0,0.25)',
                  }} />
                  {/* Match badge */}
                  <span style={{
                    position:'absolute', bottom:10, right:10,
                    background:'rgba(26,22,18,0.72)', color:'#fff',
                    fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:20,
                  }}>
                    🎯 {recipe.match}
                  </span>
                </div>

                {/* Card body */}
                <div style={{ padding:'14px 16px', flex:1, display:'flex', flexDirection:'column', gap:8 }}>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {recipe.tags.map(tag => (
                      <span key={tag} style={{
                        background:'#F4F0E8', color:'#4A3F35',
                        fontSize:11, padding:'2px 8px', borderRadius:20, fontWeight:500,
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 style={{ margin:0, fontSize:15, fontWeight:600, color:'#1A1612', lineHeight:1.4 }}>
                    {recipe.title}
                  </h3>
                  <div style={{
                    marginTop:'auto', paddingTop:10,
                    borderTop:'1px solid #F4F0E8',
                    display:'flex', justifyContent:'space-between',
                    fontSize:12, color:'#8A7E74',
                  }}>
                    <span>⏱ {recipe.time} min</span>
                    <span style={{ color:'#E8591A', fontWeight:600 }}>★ {recipe.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MOST RECENT ───────────────────────────────────────────────────── */}
      <div style={{ background:'#FDFAF6', marginTop:48, padding:'40px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <h2 style={{ fontSize:22, fontWeight:700, color:'#1A1612', margin:'0 0 4px' }}>Most Recent Recipes</h2>
          <p style={{ color:'#8A7E74', fontSize:13, margin:'0 0 20px' }}>Fresh additions aligned with your preferences.</p>

          {displayedRecent.length === 0 ? (
            <div style={{ textAlign:'center', padding:'40px 20px', color:'#8A7E74', fontSize:14, fontStyle:'italic' }}>
              No recent recipes match your current filters.
            </div>
          ) : (
            <div style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fill, minmax(240px,1fr))',
              gap:12,
              opacity: isRefreshing ? 0.4 : 1,
              transition:'opacity 0.2s',
            }}>
              {displayedRecent.map(recipe => (
                <div
                  key={recipe.id}
                  style={{
                    background:'#fff', borderRadius:14,
                    border:'1px solid #F4F0E8', overflow:'hidden',
                    cursor:'pointer', display:'flex',
                    transition:'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(26,22,18,0.09)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Square photo on the left */}
                  <div style={{ width:88, height:88, flexShrink:0, overflow:'hidden', background:'#F4F0E8' }}>
                    <img
                      src={RECIPE_IMAGES[recipe.id]}
                      alt={recipe.title}
                      style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                    />
                  </div>

                  {/* Text on the right */}
                  <div style={{ flex:1, padding:'10px 14px', minWidth:0, display:'flex', flexDirection:'column', justifyContent:'center' }}>
                    <p style={{ margin:'0 0 2px', fontSize:10, color:'#E8591A', fontWeight:600, textTransform:'uppercase', letterSpacing:0.4 }}>
                      {recipe.date}
                    </p>
                    <h4 style={{
                      margin:'0 0 3px', fontSize:13, fontWeight:600, color:'#1A1612',
                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                    }}>
                      {recipe.title}
                    </h4>
                    <p style={{ margin:'0 0 6px', fontSize:11, color:'#8A7E74' }}>By {recipe.author}</p>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#8A7E74' }}>
                      <span>⏱ {recipe.time} min</span>
                      <span style={{ color:'#E8591A', fontWeight:600 }}>★ {recipe.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── FOOTER CUISINE STRIP ──────────────────────────────────────────── */}
      <div style={{ background:'#1A1612', borderTop:'1px solid #2A2520', padding:'32px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <h2 style={{ fontSize:16, fontWeight:600, color:'#fff', margin:'0 0 4px' }}>Browse by cuisine</h2>
            <p style={{ color:'#6A6058', fontSize:12, margin:0 }}>Pick a style to explore</p>
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {footerCuisines.map(c => (
              <div
                key={c.name}
                onClick={() => onNavigate && onNavigate('search')}
                style={{
                  background:'#211D19', border:'1px solid #2A2520',
                  borderRadius:12, width:88, height:76,
                  display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center',
                  cursor:'pointer', gap:4, transition:'border-color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#E8591A'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2A2520'}
              >
                <span style={{ fontSize:24 }}>{c.icon}</span>
                <span style={{ fontSize:11, color:'#8A7E74' }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}