import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase
const supabaseUrl = 'https://qniwjfsudzmoqyprqofr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuaXdqZnN1ZHptb3F5cHJxb2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MzE5ODgsImV4cCI6MjA5MTMwNzk4OH0.VuMEoxTuDuxNapLMcHGjV2vOJScyfo_g5DqC-CRw-gg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ScannerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const scanId = location.state?.scanId;

  const [isScanning, setIsScanning] = useState(true);
  const [logs, setLogs] = useState([]);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    if (!scanId) return;

    const channel = supabase
      .channel('realtime_terminal')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'scan_logs', filter: `scan_id=eq.${scanId}` },
        (payload) => {
          const logData = payload.new.response_body_snippet;
          setLogs((prev) => [...prev, { text: logData.message, type: logData.type }]);
          
          if (logData.message.includes('=== SCAN COMPLETE ===')) {
              setIsScanning(false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [scanId]);

  return (
    <div className="dashboard-grid">
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
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="terminal-box font-mono">
          {logs.length === 0 && <p className="log-line log-blue">[*] Waiting for Python Engine payload execution...</p>}
          {logs.map((l, i) => (
            <p key={i} className={`log-line ${l.type === 'red' ? 'log-red' : l.type === 'green' ? 'log-green' : 'log-blue'}`}>
              {l.text}
            </p>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {!isScanning && (
          <button className="btn-primary" style={{ padding: '20px', fontSize: '1.2rem', background: 'var(--danger)' }} onClick={() => navigate('/report')}>
            Generate Executive Report
          </button>
        )}
      </div>
    </div>
  );
}