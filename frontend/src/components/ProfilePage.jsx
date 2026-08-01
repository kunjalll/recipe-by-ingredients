import React from 'react';

export default function ProfilePage({ user, onLogout, onNavigate }) {
  if (!user) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
        <h2 style={{ color: '#E8591A' }}>Profile</h2>
        <p style={{ color: '#8A7F70' }}>You need to be logged in to view your profile.</p>
        <div style={{ marginTop: 16 }}>
          <button onClick={() => onNavigate('login')} style={{ padding: '10px 16px', borderRadius: 10, border: 'none', background: '#E8591A', color: '#fff', fontWeight: 700 }}>Log in</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '20px' }}>
      <h2 style={{ color: '#E8591A' }}>My profile</h2>
      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #F4F0E8' }}>
          <h3 style={{ marginBottom: 6 }}>{user.name}</h3>
          <div style={{ color: '#8A7E74' }}>{user.email}</div>

          <div style={{ marginTop: 18 }}>
            <button onClick={() => onNavigate('dashboard')} style={{ padding: '8px 14px', borderRadius: 10, border: 'none', background: '#E8591A', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Go to dashboard</button>
            <button onClick={() => onLogout()} style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid #E8591A', background: 'transparent', color: '#E8591A', fontWeight: 700, cursor: 'pointer', marginLeft: 10 }}>Log out</button>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #F4F0E8' }}>
          <h4 style={{ marginTop: 0 }}>Account</h4>
          <div style={{ color: '#8A7E74', fontSize: 13 }}>Currently signed in</div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 13, color: '#4A3F35' }}>Preferences & saved recipes are synced to your account.</div>
            <div style={{ fontSize: 13, color: '#8A7E74', marginTop: 8 }}>To change your name or password, use the backend or contact support (demo app).</div>
          </div>
        </div>
      </div>
    </div>
  );
}
