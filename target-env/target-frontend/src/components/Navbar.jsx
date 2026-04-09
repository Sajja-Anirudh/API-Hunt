import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="luxury-navbar">
      <Link to="/" className="nav-logo">APEX EXOTICS</Link>
      <div className="nav-links">
        <Link to="/" className="nav-item">Showroom</Link>
        <Link to="/" className="nav-item">Bespoke Services</Link>
        <Link to="/" className="nav-item">Heritage</Link>
        <button className="nav-button" onClick={() => navigate('/role')}>
          Portal Access
        </button>
      </div>
    </nav>
  );
}