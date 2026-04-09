import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Verification() {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
      setTimeout(() => navigate('/packages'), 1500);
    }, 2000);
  };

  return (
    <section className="hero-verify">
      <div className="overlay"></div>
      <div className="luxury-card">
        {verified ? (
          <div style={{ textAlign: 'center', color: 'var(--success)' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: '20px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="font-luxury">Identity Verified</h2>
            <p>Redirecting to secure portal...</p>
          </div>
        ) : (
          <>
            <h2 className="font-luxury" style={{ marginBottom: '30px', fontSize: '2rem' }}>Client Authentication</h2>
            <form onSubmit={handleVerify}>
              <div className="input-group">
                <label>Enterprise ID / Company Name</label>
                <input type="text" required placeholder="e.g. Apex Exotics" />
              </div>
              <div className="input-group">
                <label>Secure Authorization Key</label>
                <input type="password" required placeholder="••••••••••••" />
              </div>
              <button className="btn-primary" type="submit" disabled={isVerifying}>
                {isVerifying ? 'Authenticating...' : 'Verify Identity'}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}