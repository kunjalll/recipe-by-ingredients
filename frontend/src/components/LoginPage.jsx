import React, { useState } from 'react';
import { API, setToken } from '../lib/api';

export default function LoginPage({ onLogin, onNavigate, darkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const body = new URLSearchParams();
      body.set('username', email); // FastAPI's OAuth2 form expects "username" even though it's an email
      body.set('password', password);

      const res = await API('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        setError(data?.detail || 'Login failed');
        return;
      }
      setToken(data.access_token);

      const meRes = await API('/auth/me');
      const meData = await meRes.json();
      setLoading(false);
      if (!meRes.ok) {
        setError('Could not load user info');
        return;
      }
      onLogin({ name: meData.full_name, email: meData.email, id: meData.id });
    } catch (e) {
      setLoading(false);
      setError('Network error');
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: darkMode ? '#211D19' : '#fff',
        border: `1px solid ${darkMode ? '#3A342C' : '#F0EAE0'}`,
        borderRadius: 20, padding: '36px 32px',
        boxShadow: darkMode ? 'none' : '0 12px 40px rgba(26,22,18,0.08)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span style={{ fontSize: 32 }}>🌱</span>
          <h2 style={{ margin: '10px 0 4px', color: darkMode ? '#EDE8DF' : '#211D19', fontSize: 22 }}>
            Welcome back
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: darkMode ? '#A8A098' : '#8A7F70' }}>
            Log in to save recipes and track your history.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Field
            label="Email" type="email" value={email}
            onChange={setEmail} darkMode={darkMode} placeholder="you@example.com"
          />
          <Field
            label="Password" type="password" value={password}
            onChange={setPassword} darkMode={darkMode} placeholder="••••••••"
          />

          {error && (
            <div style={{
              background: '#FDECE6', color: '#B8431A', fontSize: 13,
              padding: '8px 12px', borderRadius: 8, marginBottom: 14,
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px 0', borderRadius: 12, border: 'none',
            background: loading ? '#F0A47D' : '#E8591A', color: '#fff',
            fontWeight: 700, fontSize: 15, cursor: loading ? 'default' : 'pointer',
            transition: 'background 0.15s', marginTop: 4,
          }}>
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 14, textAlign: 'center', color: darkMode ? '#A8A098' : '#8A7F70' }}>
          No account?{' '}
          <span onClick={() => onNavigate('register')} style={{ color: '#E8591A', cursor: 'pointer', fontWeight: 600 }}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, darkMode, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6,
        color: darkMode ? '#C9C2B6' : '#4A3F35',
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required
        style={{
          width: '100%', padding: '11px 14px', borderRadius: 10,
          border: `1.5px solid ${focused ? '#E8591A' : (darkMode ? '#3A342C' : '#E4DDD0')}`,
          background: darkMode ? '#2A2520' : '#FDFAF6',
          color: darkMode ? '#EDE8DF' : '#211D19',
          fontSize: 14, boxSizing: 'border-box', outline: 'none',
          transition: 'border-color 0.15s',
        }}
      />
    </div>
  );
}