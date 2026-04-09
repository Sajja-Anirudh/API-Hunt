import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Packages() {
  const navigate = useNavigate();
  const [targetUrl, setTargetUrl] = useState('');
  
  return (
    <div style={{ padding: '120px 5% 80px', maxWidth: '900px', margin: '0 auto', minHeight: '100vh' }}>
      <h1 className="font-luxury" style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '40px' }}>Select Audit Parameters</h1>
      
      <div className="luxury-card" style={{ maxWidth: '100%', marginBottom: '40px' }}>
        <div className="input-group">
          <label style={{ fontSize: '1rem', color: 'var(--dark-slate)', fontWeight: 600 }}>Target Application URL</label>
          <input 
            type="url" 
            placeholder="https://api.target-company.com/v1/" 
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            style={{ fontSize: '1.1rem', padding: '16px' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gap: '20px', marginBottom: '40px' }}>
        {/* Package 1 */}
        <label style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '24px', border: '1px solid var(--border)', cursor: 'pointer' }}>
          <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', marginRight: '20px' }} />
          <div style={{ flex: 1 }}>
            <h3 className="font-luxury" style={{ margin: '0 0 8px 0', fontSize: '1.5rem' }}>JWT Auth Integrity Check</h3>
            <p style={{ margin: 0, color: '#64748b' }}>Analyzes signature validation and token expiration mechanics.</p>
          </div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 600 }}>$1,500</div>
        </label>

        {/* Package 2 */}
        <label style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '24px', border: '1px solid var(--border)', cursor: 'pointer' }}>
          <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', marginRight: '20px' }} />
          <div style={{ flex: 1 }}>
            <h3 className="font-luxury" style={{ margin: '0 0 8px 0', fontSize: '1.5rem' }}>Unauthenticated Data Exposure Check</h3>
            <p style={{ margin: 0, color: '#64748b' }}>Probes endpoints without headers to detect unauthorized leaks.</p>
          </div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 600 }}>$2,000</div>
        </label>

        {/* Package 3 */}
        <label style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '24px', border: '2px solid var(--gold)', cursor: 'pointer' }}>
          <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', marginRight: '20px' }} />
          <div style={{ flex: 1 }}>
            <h3 className="font-luxury" style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: 'var(--gold)' }}>Full Force BOLA Attack</h3>
            <p style={{ margin: 0, color: '#64748b' }}>Deep ID mutation fuzzing to detect Broken Object Level Authorization.</p>
          </div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 600 }}>$5,000</div>
        </label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          className="btn-primary" 
          style={{ width: 'auto', padding: '16px 40px', fontSize: '1.1rem' }}
          onClick={() => navigate('/scanner')}
        >
          Initialize Attack Sequence &rarr;
        </button>
      </div>
    </div>
  );
}