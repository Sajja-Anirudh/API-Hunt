import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Packages() {
  const navigate = useNavigate();
  const [targetUrl, setTargetUrl] = useState(''); 
  const [selectedTiers, setSelectedTiers] = useState(['enterprise']); 

  const pricingTiers = [
    { 
      id: 'basic', 
      name: 'Standard Recon', 
      price: 499,
      description: 'Automated endpoint mapping, JWT extraction, and basic vulnerability surface scanning.' 
    },
    { 
      id: 'advanced', 
      name: 'Deep Fuzzing', 
      price: 1299,
      description: 'Active horizontal BOLA testing, continuous payload injection, and deep endpoint spidering.' 
    },
    { 
      id: 'enterprise', 
      name: 'Full Red Team', 
      price: 3499,
      isPremium: true,
      description: 'Persistent threat emulation, logic abuse, rate-limit bypassing, and manual exploitation.' 
    }
  ];

  const handleToggleTier = (tierId) => {
    setSelectedTiers((prevSelected) => {
      if (prevSelected.includes(tierId)) {
        return prevSelected.filter(id => id !== tierId);
      } else {
        return [...prevSelected, tierId];
      }
    });
  };

  const totalCost = pricingTiers
    .filter(tier => selectedTiers.includes(tier.id))
    .reduce((sum, tier) => sum + tier.price, 0);

  const handleStartAttack = async () => {
    if (selectedTiers.length === 0) {
      alert("Please select at least one protection tier.");
      return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/scan/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                targetUrl: targetUrl,
                tiers: selectedTiers,
                totalBilled: totalCost
            }) 
        });
        
        const data = await response.json();
        navigate('/scanner', { state: { scanId: data.scanId } });
    } catch (error) {
        console.error("Failed to start scan:", error);
    }
  };

  return (
    <div style={{ padding: '120px 5% 80px', maxWidth: '1000px', margin: '0 auto', minHeight: '100vh' }}>
      <h1 className="font-luxury" style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '40px' }}>Select Audit Parameters</h1>
      
      <div className="luxury-card" style={{ maxWidth: '100%', marginBottom: '40px', padding: '30px', borderRadius: '12px', border: '1px solid #eaeaea', backgroundColor: '#fff' }}>
        <div className="input-group">
          <label style={{ fontSize: '1rem', color: 'var(--dark-slate)', fontWeight: 600 }}>Target Application URL</label>
          <input 
            type="url" 
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            style={{ fontSize: '1.1rem', padding: '16px', width: '100%', marginTop: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
            placeholder='Enter website URL...'
          />
        </div>
      </div>

      <h2 className="font-luxury" style={{ fontSize: '2rem', marginBottom: '20px' }}>Protection Tiers</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {pricingTiers.map((tier) => {
          const isSelected = selectedTiers.includes(tier.id);
          
          return (
            <div 
              key={tier.id}
              onClick={() => handleToggleTier(tier.id)}
              style={{ 
                position: 'relative',
                border: isSelected ? '2px solid #000' : '1px solid #eaeaea',
                padding: '30px 24px', 
                cursor: 'pointer', 
                borderRadius: '12px',
                backgroundColor: isSelected ? '#fafafa' : '#ffffff',
                boxShadow: tier.isPremium && !isSelected ? '0 10px 30px rgba(0,0,0,0.05)' : 'none',
                transform: tier.isPremium ? 'scale(1.02)' : 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {tier.isPremium && (
                <div style={{
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                  background: '#000', color: '#fff', padding: '4px 16px', fontSize: '0.8rem',
                  fontWeight: 'bold', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase'
                }}>
                  Best Value
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>{tier.name}</h3>
                  <p style={{ margin: '8px 0 0', fontSize: '1.2rem', color: '#555' }}>${tier.price} <span style={{fontSize: '0.9rem', color: '#888'}}>/ scan</span></p>
                </div>
                <input 
                  type="checkbox" 
                  checked={isSelected} 
                  readOnly 
                  style={{ width: '24px', height: '24px', accentColor: '#000', cursor: 'pointer', marginTop: '4px' }} 
                />
              </div>
              
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6', margin: 'auto 0 0' }}>
                {tier.description}
              </p>
            </div>
          );
        })}
      </div>

      <div style={{ 
        borderTop: '2px solid #eaeaea', paddingTop: '30px', display: 'flex', 
        justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px'
      }}>
        <div>
          <p style={{ margin: 0, color: '#666', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Investment</p>
          <h2 style={{ margin: '8px 0 0', fontSize: '2.5rem', fontWeight: 'bold' }}>
            ${totalCost.toLocaleString()}
          </h2>
        </div>

        <button 
          className="btn-primary" 
          style={{ width: 'auto', padding: '18px 48px', fontSize: '1.2rem', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} 
          onClick={handleStartAttack}
          disabled={selectedTiers.length === 0}
        >
          {selectedTiers.length === 0 ? 'Select a Tier' : 'Initialize Attack Sequence →'}
        </button>
      </div>

    </div>
  );
}