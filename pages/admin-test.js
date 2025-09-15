// Simple admin panel test
export default function AdminTest() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #1f2937, #000000, #1f2937)',
      color: 'white',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        ARPOZAN Admin Panel
      </h1>
      
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        padding: '2rem', 
        borderRadius: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>✅ Status Check</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '0.5rem' }}>🟢 Next.js App: Running</li>
          <li style={{ marginBottom: '0.5rem' }}>🟢 Admin Route: Accessible</li>
          <li style={{ marginBottom: '0.5rem' }}>🟡 Supabase: Mock Mode (Environment vars needed)</li>
          <li style={{ marginBottom: '0.5rem' }}>🟢 CSS Styles: Loaded</li>
        </ul>
      </div>

      <div style={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        padding: '2rem', 
        borderRadius: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🚀 Next Steps</h2>
        <ol style={{ paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            Get your Supabase credentials from: 
            <a 
              href="https://supabase.com/dashboard" 
              target="_blank" 
              style={{ color: '#60a5fa', textDecoration: 'underline', marginLeft: '0.5rem' }}
            >
              Supabase Dashboard
            </a>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Update your <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.25rem' }}>.env.local</code> file
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Access the full admin panel at: 
            <a 
              href="/admin" 
              style={{ color: '#60a5fa', textDecoration: 'underline', marginLeft: '0.5rem' }}
            >
              /admin
            </a>
          </li>
        </ol>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center', opacity: 0.7 }}>
        <p>Demo Login: admin@arpozan.com / admin123</p>
      </div>
    </div>
  )
}