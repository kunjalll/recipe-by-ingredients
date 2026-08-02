export default function LandingPage({ onNavigate }) {
  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1A1612 0%, #2D261E 100%)',
      padding: '64px 24px',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 560 }}>
        <div style={{
          display: 'inline-block', background: '#E8591A22',
          border: '1px solid #E8591A44', color: '#E8591A',
          borderRadius: 20, padding: '4px 14px', fontSize: 12,
          fontWeight: 600, marginBottom: 16, letterSpacing: 0.5,
        }}>
          🌱 AI-Powered Recipe Discovery
        </div>

        <h1 style={{
          fontSize: 'clamp(30px, 5vw, 50px)', fontWeight: 800,
          color: '#fff', margin: '0 0 12px', lineHeight: 1.15, letterSpacing: -1,
        }}>
          What's in your<br />
          <span style={{ color: '#E8591A' }}>kitchen today?</span>
        </h1>

        <p style={{ color: '#A8A098', fontSize: 16, maxWidth: 440, margin: '0 auto 32px', lineHeight: 1.6 }}>
          Tell us your ingredients. We'll find the perfect recipe — instantly, intelligently.
        </p>

        <button
          onClick={() => onNavigate && onNavigate('search')}
          style={{
            padding: '15px 36px', borderRadius: 14,
            background: '#E8591A', color: '#fff', border: 'none',
            fontSize: 16, fontWeight: 700, cursor: 'pointer',
            transition: 'background 0.2s', letterSpacing: 0.3,
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#D14A12'}
          onMouseLeave={e => e.currentTarget.style.background = '#E8591A'}
        >
          🍳 Find Recipes
        </button>
      </div>
    </div>
  );
}