import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase
const supabaseUrl = 'https://qniwjfsudzmoqyprqofr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuaXdqZnN1ZHptb3F5cHJxb2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MzE5ODgsImV4cCI6MjA5MTMwNzk4OH0.VuMEoxTuDuxNapLMcHGjV2vOJScyfo_g5DqC-CRw-gg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// COMPONENT 1: THE ATTACK TREE (Pure UI Component)
// ============================================================================
const AttackTree = ({ nodes }) => {
  // Parse the raw URLs into a structured tree object
  const treeData = nodes.reduce((acc, node) => {
    try {
      const lastSlashIdx = node.url.lastIndexOf('/');
      if (lastSlashIdx === -1) throw new Error("Invalid format");
      
      const basePath = node.url.substring(0, lastSlashIdx);
      const injectedId = node.url.substring(lastSlashIdx + 1);

      if (!acc[basePath]) acc[basePath] = [];
      acc[basePath].push({ id: injectedId, status: node.status });
    } catch (e) {
      if (!acc['Other Endpoints']) acc['Other Endpoints'] = [];
      acc['Other Endpoints'].push({ id: node.url, status: node.status });
    }
    return acc;
  }, {});

  if (Object.keys(treeData).length === 0) {
    return <p className="font-mono" style={{ color: '#888' }}>Waiting for endpoint discovery...</p>;
  }

  return (
    <div style={{ overflowY: 'auto', overflowX: 'hidden', flexGrow: 1, paddingRight: '10px' }}>
      {Object.entries(treeData).map(([basePath, targets], index) => (
        <div key={index} style={{ marginBottom: '25px', fontFamily: 'monospace' }}>
          
          {/* PARENT FOLDER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" style={{ flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span style={{ fontWeight: 'bold', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {basePath}/
            </span>
          </div>

          {/* CHILDREN BRANCHES (The actual 'Tree' visual) */}
          <div style={{ marginLeft: '8px', borderLeft: '2px solid #cbd5e1', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {targets.map((target, idx) => {
              
              // Colors based on status
              let dotColor = '#eab308'; // Yellow
              let shadow = 'none';
              if (target.status === 'compromised') {
                dotColor = '#ef4444'; // Red
                shadow = '0 0 8px #ef4444';
              } else if (target.status === 'safe') {
                dotColor = '#22c55e'; // Green
              } else if (target.status === 'not_found') {
                dotColor = '#94a3b8'; // Grey
              }

              return (
                <div key={idx} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* THE HORIZONTAL CONNECTING BRANCH LINE */}
                  <div style={{ position: 'absolute', left: '-20px', top: '50%', width: '12px', height: '2px', backgroundColor: '#cbd5e1' }}></div>
                  
                  {/* STATUS DOT */}
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: dotColor, boxShadow: shadow, flexShrink: 0 }}></div>
                  
                  {/* TARGET UUID */}
                  <span style={{ fontSize: '0.9rem', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {target.id}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      ))}
    </div>
  );
};


// ============================================================================
// COMPONENT 2: THE TERMINAL (Pure UI Component)
// ============================================================================
const Terminal = ({ logs, terminalRef }) => {
  return (
    <div className="terminal-box font-mono" style={{ flex: 1, minWidth: 0, height: '700px', margin: 0, overflowY: 'auto', backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px' }}>
      {logs.length === 0 && <p className="log-line" style={{ color: '#569cd6' }}>[*] Waiting for Python Engine payload execution...</p>}
      
      {logs.map((l, i) => {
        let textColor = '#d4d4d4'; 
        if (l.type === 'red') textColor = '#f44336';
        if (l.type === 'green') textColor = '#4caf50';
        if (l.type === 'blue') textColor = '#569cd6';

        return (
          <p key={i} className="log-line" style={{ color: textColor, margin: '4px 0', wordBreak: 'break-all', lineHeight: '1.5' }}>
            {l.text}
          </p>
        );
      })}
      {/* Auto-scroll anchor */}
      <div ref={terminalRef} /> 
    </div>
  );
};


// ============================================================================
// COMPONENT 3: THE DASHBOARD WRAPPER (The Brain)
// ============================================================================
export default function ScannerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const scanId = location.state?.scanId;

  const [isScanning, setIsScanning] = useState(true);
  const [logs, setLogs] = useState([]);
  const [attackedNodes, setAttackedNodes] = useState([]); 
  const terminalEndRef = useRef(null);

  // Auto-scroll the terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Supabase WebSocket Listener
  useEffect(() => {
    if (!scanId) return;

    const channel = supabase
      .channel('realtime_terminal')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'scan_logs', filter: `scan_id=eq.${scanId}` },
        (payload) => {
          const logData = payload.new.response_body_snippet;
          const msg = logData.message;
          
          // 1. Update Logs
          setLogs((prev) => [...prev, { text: msg, type: logData.type }]);
          
          // 2. Update Node Tree State
          if (msg.includes('-> [REQ] GET')) {
            const url = msg.split('GET ')[1].trim();
            setAttackedNodes(prev => [...prev, { url, status: 'testing' }]);
          }
          else if (msg.includes('[!!!] CRITICAL: BOLA Bypass Successful!')) {
            updateLastNodeStatus('compromised');
          }
          else if (msg.includes('[-] Secure:')) {
            updateLastNodeStatus('safe');
          }
          else if (msg.includes('[-] Not Found:')) {
            updateLastNodeStatus('not_found');
          }
          else if (msg.includes('=== SCAN COMPLETE ===')) {
            setIsScanning(false);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [scanId]);

  // Helper function to update the status of the currently tested UUID
  const updateLastNodeStatus = (status) => {
    setAttackedNodes(prev => {
        if (prev.length === 0) return prev;
        const newNodes = [...prev];
        newNodes[newNodes.length - 1].status = status;
        return newNodes;
    });
  };

  return (
    <div style={{ padding: '80px 5%', maxWidth: '1600px', margin: '0 auto' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div className="loader-container" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {isScanning ? (
              <div className="circular-loader"></div>
            ) : (
              <div style={{width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--danger)'}}></div>
            )}
            <h2 className="font-luxury" style={{ margin: 0 }}>
              {isScanning ? 'Attack in Progress...' : 'Audit Complete'}
            </h2>
        </div>
        
        {!isScanning && (
          <button 
            className="btn-primary" 
            style={{ padding: '12px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} 
            onClick={() => navigate('/report', { state: { scanId } })}
          >
            Generate Executive Report &rarr;
          </button>
        )}
      </div>

      {/* DASHBOARD GRID */}
      <div style={{ display: 'flex', gap: '40px', width: '100%' }}>
        
        {/* LEFT PANEL (Passes state to the decoupled AttackTree) */}
        <div style={{ flex: 1, minWidth: 0, backgroundColor: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', maxHeight: '700px' }}>
          <h3 className="font-mono" style={{ margin: '0 0 20px 0', borderBottom: '1px solid #eaeaea', paddingBottom: '15px' }}>Live Attack Surface Mapping</h3>
          <AttackTree nodes={attackedNodes} />
        </div>

        {/* RIGHT PANEL (Passes state to the decoupled Terminal) */}
        <Terminal logs={logs} terminalRef={terminalEndRef} />

      </div>
    </div>
  );
}