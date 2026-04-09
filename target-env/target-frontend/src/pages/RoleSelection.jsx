import { useNavigate } from 'react-router-dom';

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleCustomerClick = () => {
    alert("The Customer portal is currently undergoing scheduled maintenance. Please check back later.");
  };

  return (
    <div className="page-shell">
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <p className="eyebrow">Authentication</p>
        <h1 className="font-luxury" style={{ fontSize: '3rem' }}>Select Portal Access</h1>
      </div>

      <div className="role-container">
        <div className="role-card" onClick={handleCustomerClick}>
          <h2>Private Client</h2>
          <p>Access your bespoke commissions, view vehicle provenance, and schedule white-glove concierge services.</p>
          <span style={{ display: 'inline-block', marginTop: '24px', color: '#c5a059', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
            Client Login &rarr;
          </span>
        </div>

        <div className="role-card" onClick={() => navigate('/login')}>
          <h2>Authorized Dealer</h2>
          <p>Access the Apex Management Cockpit to oversee showroom indents, manage regional inventory, and access internal analytics.</p>
          <span style={{ display: 'inline-block', marginTop: '24px', color: '#c5a059', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
            Dealer Login &rarr;
          </span>
        </div>
      </div>
    </div>
  );
}