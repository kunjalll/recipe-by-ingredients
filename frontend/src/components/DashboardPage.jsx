const ALL_RECIPES = [
  { id:1, title:'Creamy Garlic Parmesan Chicken', time:25, difficulty:'Easy', rating:4.9, cuisine:'Italian', emoji:'🍗', calories:520 },
  { id:2, title:'One-Pot Spicy Tomato Penne',    time:20, difficulty:'Easy', rating:4.7, cuisine:'Italian', emoji:'🍝', calories:380 },
  { id:3, title:'Classic Paneer Butter Masala',  time:30, difficulty:'Medium',rating:4.8, cuisine:'Indian',  emoji:'🍛', calories:460 },
  { id:4, title:'Fluffy Avocado Toast with Egg', time:12, difficulty:'Easy', rating:4.6, cuisine:'American',emoji:'🥑', calories:290 },
  { id:5, title:'Lemon Honey Glazed Salmon',     time:18, difficulty:'Easy', rating:4.8, cuisine:'Mediterranean',emoji:'🐟',calories:410 },
];

const CUISINES_COUNT = 6;

function DifficultyBadge({ level }) {
  const map = { Easy:{bg:'#E1F5EE',text:'#0F6E56'}, Medium:{bg:'#FAEEDA',text:'#854F0B'}, Hard:{bg:'#FCEBEB',text:'#A32D2D'} };
  const s = map[level] || map.Easy;
  return <span style={{ background:s.bg, color:s.text, fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:20 }}>{level}</span>;
}

export default function DashboardPage({ savedRecipes, onNavigate }) {
  const savedCount = savedRecipes.length;
  const savedItems = ALL_RECIPES.filter(r => savedRecipes.includes(r.id));
  const avgRating = savedItems.length > 0
    ? (savedItems.reduce((s,r) => s + r.rating, 0) / savedItems.length).toFixed(1)
    : '—';

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 20px' }}>
      <h1 style={{ fontSize:28, fontWeight:800, color:'#1A1612', margin:'0 0 4px' }}>Dashboard</h1>
      <p style={{ color:'#8A7E74', margin:'0 0 24px', fontSize:15 }}>Your personal cooking hub.</p>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:12, marginBottom:32 }}>
        {[['❤️', savedCount, 'Saved recipes'],['⭐', avgRating, 'Avg rating saved'],['🍳', ALL_RECIPES.length + '+', 'Total recipes'],['🌍', CUISINES_COUNT, 'Cuisines']].map(([icon,val,label]) => (
          <div key={label} style={{ background:'#fff', border:'1px solid #F4F0E8', borderRadius:14, padding:'18px 16px', textAlign:'center' }}>
            <div style={{ fontSize:28, marginBottom:6 }}>{icon}</div>
            <div style={{ fontSize:24, fontWeight:800, color:'#1A1612' }}>{val}</div>
            <div style={{ fontSize:12, color:'#8A7E74', marginTop:2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 style={{ fontSize:18, fontWeight:700, color:'#1A1612', margin:'0 0 12px' }}>Quick Actions</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12, marginBottom:32 }}>
        {[
          { icon:'🔍', label:'Search by ingredients', desc:'Find recipes using what you have',   page:'search', bg:'#FFF0E8' },
          { icon:'📅', label:'Plan your week',         desc:'Build a 7-day meal plan',           page:'planner',bg:'#E1F5EE' },
          { icon:'❤️', label:'View saved recipes',     desc:`${savedCount} recipe${savedCount!==1?'s':''} bookmarked`, page:'saved', bg:'#FAEEDA' },
        ].map(a => (
          <div key={a.label} onClick={()=>onNavigate(a.page)}
            style={{ background:a.bg, borderRadius:14, padding:'18px 16px', cursor:'pointer', border:'1px solid #F4F0E8', transition:'transform 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={e=>e.currentTarget.style.transform='none'}
          >
            <div style={{ fontSize:32, marginBottom:8 }}>{a.icon}</div>
            <div style={{ fontWeight:700, color:'#1A1612', fontSize:15 }}>{a.label}</div>
            <div style={{ color:'#8A7E74', fontSize:13, marginTop:4 }}>{a.desc}</div>
          </div>
        ))}
      </div>

      {/* Recent recipes */}
      <h2 style={{ fontSize:18, fontWeight:700, color:'#1A1612', margin:'0 0 12px' }}>Recipe Database</h2>
      <div style={{ display:'grid', gap:10 }}>
        {ALL_RECIPES.map(r => (
          <div key={r.id} style={{ display:'flex', gap:14, alignItems:'center', background:'#fff', border:'1px solid #F4F0E8', borderRadius:12, padding:'12px 16px' }}>
            <span style={{ fontSize:32 }}>{r.emoji}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, color:'#1A1612', fontSize:14 }}>{r.title}</div>
              <div style={{ color:'#8A7E74', fontSize:12, marginTop:2 }}>⏱ {r.time} min · {r.cuisine} · {r.calories} cal</div>
            </div>
            <DifficultyBadge level={r.difficulty} />
            <span style={{ fontSize:12, color:'#E8591A', fontWeight:600 }}>★ {r.rating}</span>
          </div>
        ))}
      </div>
    </div>
  );
}