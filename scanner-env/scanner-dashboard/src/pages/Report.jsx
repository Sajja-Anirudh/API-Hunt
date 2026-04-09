export default function Report() {
  return (
    <div style={{ padding: '120px 5% 80px', maxWidth: '800px', margin: '0 auto', minHeight: '100vh' }}>
      <div className="luxury-card" style={{ maxWidth: '100%' }}>
        <div style={{ borderBottom: '2px solid var(--border)', paddingBottom: '20px', marginBottom: '30px' }}>
          <p className="font-mono" style={{ color: '#64748b', fontSize: '0.85rem' }}>ID: APIH-2026-X89 | CONFIDENTIAL</p>
          <h1 className="font-luxury" style={{ fontSize: '2.5rem', margin: '10px 0' }}>Executive Risk Summary</h1>
        </div>
        
        <h3 className="font-luxury" style={{ color: 'var(--danger)' }}>CRITICAL FINDING: Broken Object Level Authorization (BOLA)</h3>
        <p style={{ lineHeight: 1.8, color: 'var(--dark-slate)' }}>
          During the automated fuzzing sequence, the API-Hunter engine successfully manipulated endpoint resource identifiers. 
          By altering the request from ID <code>101</code> to <code>102</code>, the target API returned a <code>200 OK</code> status, 
          leaking private records belonging to another tenant. This allows horizontal privilege escalation and massive data exfiltration.
        </p>

        <h3 className="font-luxury" style={{ marginTop: '30px', color: 'var(--danger)' }}>HIGH FINDING: Weak JWT Implementation</h3>
        <p style={{ lineHeight: 1.8, color: 'var(--dark-slate)' }}>
          The authentication token is utilizing a symmetrical signing algorithm (HS256) which is susceptible to offline brute-force attacks if the secret key is weak.
        </p>

        <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center' }}>
          <button className="btn-hire" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Report as PDF
          </button>
        </div>
      </div>
    </div>
  );
}