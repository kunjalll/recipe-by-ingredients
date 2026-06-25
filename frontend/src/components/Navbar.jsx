import React from 'react';

export default function Navbar({ page, onNavigate, savedCount, darkMode, onToggleDark }) {
  const navItems = [
    { id: 'home',      label: 'Home',        icon: '🏠' },
    { id: 'search',    label: 'Search',      icon: '🔍' },
    
    { id: 'saved',     label: 'Saved',       icon: '❤️', badge: savedCount },
    { id: 'dashboard', label: 'Dashboard',   icon: '📊' },
  ];

  return (
    <nav style={{
      background: darkMode ? '#211D19' : '#FFFFFF',
      borderBottom: `1px solid ${darkMode ? '#2A2520' : '#F4F0E8'}`,
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 1px 12px rgba(26,22,18,0.06)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', gap: 4 }}>

        {/* Logo */}
        <div onClick={() => onNavigate('home')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginRight: 16 }}>
          <span style={{ fontSize: 22 }}>🌱</span>
          <span style={{ fontWeight: 800, fontSize: 16, color: '#E8591A', letterSpacing: -0.5 }}>
            CookByIngredients
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 2, flex: 1 }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                padding: '7px 14px', borderRadius: 10, border: 'none',
                background: page === item.id ? '#FFF0E8' : 'transparent',
                color: page === item.id ? '#E8591A' : (darkMode ? '#A8A098' : '#4A3F35'),
                fontWeight: page === item.id ? 700 : 500,
                cursor: 'pointer', fontSize: 14, transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: 6, position: 'relative',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge > 0 && (
                <span style={{
                  background: '#E8591A', color: '#fff', borderRadius: '50%',
                  width: 18, height: 18, fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '1px solid #F4F0E8',
            background: darkMode ? '#2A2520' : '#F4F0E8',
            cursor: 'pointer', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}