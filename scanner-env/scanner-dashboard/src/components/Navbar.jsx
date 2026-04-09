import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="luxury-navbar">
      <Link to="/" className="nav-brand font-luxury">API-HUNTER ENTERPRISE</Link>
      <div className="nav-links">
        <Link to="/">Solutions</Link>
        <Link to="/">Methodology</Link>
        <Link to="/">Case Studies</Link>
        <button className="btn-hire font-luxury" onClick={() => navigate('/verify')}>Hire Us</button>
      </div>
    </nav>
  );
}