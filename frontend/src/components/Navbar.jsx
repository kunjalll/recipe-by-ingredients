import React, { useState, useRef, useEffect } from 'react';

export default function Navbar({
  page,
  onNavigate,
  savedCount,
  darkMode,
  onToggleDark,
  isLoggedIn,
  user,
  onLogin,
  onRegister,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const navItems = [
    { id: 'home',      label: 'Home',        icon: '🏠' },
    { id: 'search',    label: 'Search',      icon: '🔍' },
    { id: 'history',   label: 'History',     icon: '🕘' },
    { id: 'saved',     label: 'Saved',       icon: '❤️', badge: savedCount },
    { id: 'dashboard', label: 'Dashboard',   icon: '📊' },
  ].filter(item => {
    // hide history and saved when not logged in
    if (!isLoggedIn && (item.id === 'history' || item.id === 'saved')) return false;
    return true;
  });

  return (
    <nav style={{
      background: darkMode ? '#211D19' : '#FFFFFF',
      borderBottom: `1px solid ${darkMode ? '#2A2520' : '#F4F0E8'}`,
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 1px 12px rgba(26,22,18,0.06)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', gap: 4 }}>

        {/* Logo */}
        <div onClick={() => onNavigate('home')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginRight: 16 }}>
          <span style={{ fontSize: 22 }}>🌱</span>
          <span style={{ fontWeight: 800, fontSize: 16, color: '#E8591A', letterSpacing: -0.5 }}>
            CookByIngredients
          </span>
        </div>

        {/* Hamburger for small screens */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Open menu"
          className="hamburger"
          style={{
            display: 'none', // visible via CSS on small screens
            width: 40, height: 40, borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer', marginRight: 8, fontSize: 20
          }}
        >
          ☰
        </button>

        {/* Nav links */}
        <div className="nav-links" style={{ display: 'flex', gap: 2, flex: 1, overflowX: 'auto' }}>
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
                whiteSpace: 'nowrap',
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
            marginRight: 12,
          }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {/* Auth area */}
        {isLoggedIn ? (
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: '#E8591A', color: '#fff', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}
            >
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </button>

            {menuOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 46, width: 220,
                background: darkMode ? '#2A2520' : '#fff',
                border: `1px solid ${darkMode ? '#3A342C' : '#F0EAE0'}`,
                borderRadius: 14, boxShadow: '0 8px 28px rgba(26,22,18,0.16)',
                padding: 8, zIndex: 200,
              }}>
                <div style={{ padding: '10px 12px', borderBottom: `1px solid ${darkMode ? '#3A342C' : '#F4F0E8'}`, marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: darkMode ? '#EDE8DF' : '#211D19' }}>
                    {user?.name || 'User'}
                  </div>
                  <div style={{ fontSize: 12, color: darkMode ? '#A8A098' : '#8A7F70' }}>
                    {user?.email}
                  </div>
                </div>
                <button
                  onClick={() => { onNavigate('profile'); setMenuOpen(false); }}
                  style={menuItemStyle(darkMode)}
                >
                  👤 My profile
                </button>
                <button
                  onClick={() => { onNavigate('dashboard'); setMenuOpen(false); }}
                  style={menuItemStyle(darkMode)}
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={() => { onLogout(); setMenuOpen(false); }}
                  style={{ ...menuItemStyle(darkMode), color: '#E8591A' }}
                >
                  ↪ Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onLogin}
              style={{
                padding: '7px 16px', borderRadius: 10,
                border: `1px solid ${darkMode ? '#3A342C' : '#E4DDD0'}`,
                background: 'transparent',
                color: darkMode ? '#EDE8DF' : '#4A3F35',
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Log in
            </button>
            <button
              onClick={onRegister}
              style={{
                padding: '7px 16px', borderRadius: 10, border: 'none',
                background: '#E8591A', color: '#fff',
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Sign up
            </button>
          </div>
        )}
      <div className={`mobile-drawer ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} aria-hidden={!mobileOpen}>
        <div className="backdrop" onClick={() => setMobileOpen(false)} />
        <div className="drawer-content" onClick={e => e.stopPropagation()} style={{ background: darkMode ? '#211D19' : '#fff', color: darkMode ? '#EDE8DF' : '#211D19' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>🌱</span>
                <span style={{ fontWeight: 800, fontSize: 16, color: '#E8591A' }}>CookByIngredients</span>
              </div>
              <button onClick={() => setMobileOpen(false)} style={{ border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {navItems.map(item => (
                <button key={item.id} onClick={() => { onNavigate(item.id); setMobileOpen(false); }} style={{ textAlign: 'left', padding: '12px 10px', borderRadius: 10, border: 'none', background: 'transparent', fontSize: 16, cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}

              <hr style={{ border: 'none', height: 1, background: '#F4F0E8', margin: '12px 0' }} />

              {isLoggedIn ? (
                <>
                  <div style={{ padding: '10px 6px', borderRadius: 8, background: darkMode ? '#2A2520' : '#FDFAF6' }}>
                    <div style={{ fontWeight: 700 }}>{user?.name || 'User'}</div>
                    <div style={{ fontSize: 13, color: darkMode ? '#A8A098' : '#8A7F70' }}>{user?.email}</div>
                  </div>
                  <button onClick={() => { onNavigate('dashboard'); setMobileOpen(false); }} className="btn-ghost" style={{ marginTop:8 }}>Dashboard</button>
                  <button onClick={() => { onLogout(); setMobileOpen(false); }} className="btn-ghost" style={{ marginTop:6, color: '#E8591A' }}>Log out</button>
                </>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { onLogin(); setMobileOpen(false); }} className="btn-primary">Log in</button>
                  <button onClick={() => { onRegister(); setMobileOpen(false); }} className="btn-ghost">Sign up</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function menuItemStyle(darkMode) {
  return {
    width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 8,
    border: 'none', background: 'transparent', cursor: 'pointer',
    fontSize: 14, fontWeight: 500, color: darkMode ? '#EDE8DF' : '#4A3F35',
    display: 'block', marginBottom: 2,
  };
}