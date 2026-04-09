import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Verification from './pages/Verification';
import Packages from './pages/Packages';
import ScannerDashboard from './pages/ScannerDashboard';
import Report from './pages/Report';
import './index.css';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify" element={<Verification />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/scanner" element={<ScannerDashboard />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;