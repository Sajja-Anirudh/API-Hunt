import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ScannerDashboard() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(true);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0); // 0=Init, 1=JWT, 2=Unauth, 3=BOLA, 4=Done
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    const sequence = [
      { delay: 500, prog: 0, log: "[*] Establishing secure connection to target..." },
      { delay: 1500, prog: 1, log: "[*] Phase 1: Initiating JWT Auth Integrity Check..." },
      { delay: 2500, prog: 1, type: "red", log: "[-] VULNERABILITY DETECTED: Token signature weakly signed (HS256)." },
      { delay: 4000, prog: 2, log: "[*] Phase 2: Probing Unauthenticated Endpoints..." },
      { delay: 5500, prog: 2, type: "green", log: "[+] SECURE: 401 Unauthorized returned correctly. Attack failed." },
      { delay: 7000, prog: 3, log: "[*] Phase 3: Launching Horizontal BOLA Payload Fuzzing..." },
      { delay: 8500, prog: 3, log: "[-] Injecting Payload ID 101 -> 403 Forbidden" },
      { delay: 9500, prog: 3, type: "red", log: "[!!!] CRITICAL: Injecting Payload ID 102 -> 200 OK (Data Leaked)" },
      { delay: 11000, prog: 4, log: "[*] Attack sequence complete. Generating algorithmic report..." }
    ];

    let timerIds = [];
    sequence.forEach(({ delay, prog, log, type }) => {
      const id = setTimeout(() => {
        setLogs(prev => [...prev, { text: log, type }]);
        setProgress(prog);
        if (prog === 4) setIsScanning(false);
      }, delay);
      timerIds.push(id);
    });

    return () => timerIds.forEach(clearTimeout);
  }, []);

  return (
    <div className="dashboard-grid">
      {/* Left Column: Loader & Timeline */}
      <div>
        <div className="loader-container">
          {isScanning ? (
            <>
              <div className="circular-loader"></div>
              <h2 className="font-luxury" style={{ marginTop: '24px' }}>Attack in Progress...</h2>
            </>
          ) : (
            <>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="font-luxury" style={{ marginTop: '24px', color: 'var(--danger)' }}>Audit Complete</h2>
            </>
          )}
        </div>

        <div className="timeline">
          <div className="timeline-item">
            <div className={`timeline-dot ${progress > 1 ? 'dot-red' : progress === 1 ? 'dot-pending' : ''}`}></div>
            <h3 className="font-luxury">1. JWT Auth Integrity</h3>
            <p style={{ color: progress > 1 ? 'var(--danger)' : '#64748b', fontSize: '0.9rem' }}>
              {progress > 1 ? 'Status: Vulnerable' : 'Status: Scanning...'}
            </p>
          </div>
          
          <div className="timeline-item">
            <div className={`timeline-dot ${progress > 2 ? 'dot-green' : progress === 2 ? 'dot-pending' : ''}`}></div>
            <h3 className="font-luxury">2. Unauthenticated Exposure</h3>
            <p style={{ color: progress > 2 ? 'var(--success)' : '#64748b', fontSize: '0.9rem' }}>
              {progress > 2 ? 'Status: Secure' : progress < 2 ? 'Status: Queued' : 'Status: Scanning...'}
            </p>
          </div>

          <div className="timeline-item">
            <div className={`timeline-dot ${progress >= 4 ? 'dot-red' : progress === 3 ? 'dot-pending' : ''}`}></div>
            <h3 className="font-luxury">3. Full Force BOLA Attack</h3>
            <p style={{ color: progress >= 4 ? 'var(--danger)' : '#64748b', fontSize: '0.9rem' }}>
              {progress >= 4 ? 'Status: Critical Vulnerability Found' : progress < 3 ? 'Status: Queued' : 'Status: Injecting Payloads...'}
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Terminal & Report Button */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="terminal-box font-mono">
          {logs.map((l, i) => (
            <p key={i} className={`log-line ${l.type === 'red' ? 'log-red' : l.type === 'green' ? 'log-green' : 'log-blue'}`}>
              {l.text}
            </p>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {!isScanning && (
          <button 
            className="btn-primary" 
            style={{ padding: '20px', fontSize: '1.2rem', background: 'var(--danger)' }}
            onClick={() => navigate('/report')}
          >
            Generate Executive Report
          </button>
        )}
      </div>
    </div>
  );
}