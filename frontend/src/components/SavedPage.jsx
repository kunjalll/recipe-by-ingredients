import { useState } from 'react';

const ALL_RECIPES = [
  { id:1, title:'Creamy Garlic Parmesan Chicken', time:25, difficulty:'Easy', isVeg:false, rating:4.9, ratingCount:2341, cuisine:'Italian', emoji:'🍗', calories:520, description:'Tender chicken in a rich parmesan cream sauce.' },
  { id:2, title:'One-Pot Spicy Tomato Penne',    time:20, difficulty:'Easy', isVeg:true,  rating:4.7, ratingCount:1893, cuisine:'Italian', emoji:'🍝', calories:380, description:'Bold tomato sauce with a kick, one pan.' },
  { id:3, title:'Classic Paneer Butter Masala',  time:30, difficulty:'Medium',isVeg:true,  rating:4.8, ratingCount:3102, cuisine:'Indian',  emoji:'🍛', calories:460, description:'Silky tomato-cream curry with golden paneer.' },
  { id:4, title:'Fluffy Avocado Toast with Egg', time:12, difficulty:'Easy', isVeg:false, rating:4.6, ratingCount:978,  cuisine:'American',emoji:'🥑', calories:290, description:'Creamy avocado on sourdough with a poached egg.' },
  { id:5, title:'Lemon Honey Glazed Salmon',     time:18, difficulty:'Easy', isVeg:false, rating:4.8, ratingCount:1456, cuisine:'Mediterranean',emoji:'🐟',calories:410, description:'Flaky salmon with a bright citrus-honey glaze.' },
];

export default function SavedPage({ savedRecipes, onToggleSave }) {
  const saved = ALL_RECIPES.filter(r => savedRecipes.includes(r.id));

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 20px' }}>
      <h1 style={{ fontSize:28, fontWeight:800, color:'#1A1612', margin:'0 0 4px' }}>Saved Recipes</h1>
      <p style={{ color:'#8A7E74', margin:'0 0 24px', fontSize:15 }}>{saved.length} recipe{saved.length!==1?'s':''} bookmarked</p>

      {saved.length === 0 ? (
        <div style={{ textAlign:'center', padding:'80px 20px', background:'#FDFAF6', borderRadius:16 }}>
          <div style={{ fontSize:64, marginBottom:12 }}>🤍</div>
          <h3 style={{ color:'#1A1612', margin:'0 0 8px' }}>No saved recipes yet</h3>
          <p style={{ color:'#8A7E74', fontSize:14 }}>Tap ❤️ on any recipe card to save it here.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
          {saved.map(r => (
            <div key={r.id} style={{ background:'#fff', borderRadius:16, border:'1px solid #F4F0E8', overflow:'hidden', display:'flex', flexDirection:'column' }}>
              <div style={{ height:140, background:'#F4F0E8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:56, position:'relative' }}>
                {r.emoji}
                <button onClick={()=>onToggleSave(r.id)} style={{ position:'absolute', top:10, right:10, width:32, height:32, borderRadius:'50%', background:'#E8591A', border:'none', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>❤️</button>
              </div>
              <div style={{ padding:16 }}>
                <span style={{ fontSize:11, background:'#F4F0E8', color:'#4A3F35', padding:'2px 8px', borderRadius:20, fontWeight:500 }}>{r.cuisine}</span>
                <h3 style={{ margin:'8px 0 4px', fontSize:15, fontWeight:600, color:'#1A1612' }}>{r.title}</h3>
                <p style={{ margin:'0 0 12px', fontSize:12, color:'#8A7E74' }}>{r.description}</p>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#8A7E74', borderTop:'1px solid #F4F0E8', paddingTop:10 }}>
                  <span>⏱ {r.time} min · {r.calories} cal</span>
                  <span style={{ color:'#E8591A', fontWeight:600 }}>★ {r.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}