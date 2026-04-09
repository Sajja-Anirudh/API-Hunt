export default function Footer() {
  return (
    <footer className="luxury-footer">
      <h2 className="font-luxury" style={{ fontSize: '2.5rem', color: 'var(--gold)', marginBottom: '24px' }}>About Us</h2>
      <p style={{ maxWidth: '800px', margin: '0 auto', color: '#94a3b8', lineHeight: 1.8 }}>
        API-Hunter is an elite cybersecurity collective specializing in offensive security and dynamic 
        application testing. We proactively hunt logic flaws and authorization bypasses before malicious 
        actors can exploit them, ensuring uncompromising data integrity for our enterprise partners.
      </p>
    </footer>
  );
}