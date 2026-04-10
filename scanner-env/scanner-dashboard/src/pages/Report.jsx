import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Report() {
  const location = useLocation();
  const scanId = location.state?.scanId;
  const reportRef = useRef(null); 
  
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!scanId) return;

    fetch(`http://localhost:5000/api/scan/report/${scanId}`)
      .then(res => res.json())
      .then(data => {
        setReportData(data);
        setLoading(false);
      })
      .catch(err => console.error("Failed to fetch report:", err));
  }, [scanId]);

  const handleDownloadPDF = async () => {
    const element = reportRef.current;
    const canvas = await html2canvas(element, { scale: 2 }); 
    const data = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    
    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`API-Hunter-Report-${scanId.slice(0, 8)}.pdf`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2 className="font-luxury">Compiling Data...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '80px 5% 80px', maxWidth: '800px', margin: '0 auto', minHeight: '100vh' }}>
      
      {/* THE PRINTABLE PDF CONTAINER */}
      <div ref={reportRef} className="luxury-card" style={{ maxWidth: '100%', padding: '40px', backgroundColor: '#fff', border: '1px solid #eaeaea' }}>
        <div style={{ borderBottom: '2px solid var(--border)', paddingBottom: '20px', marginBottom: '30px' }}>
          <p className="font-mono" style={{ color: '#64748b', fontSize: '0.85rem' }}>ID: {scanId} | CONFIDENTIAL</p>
          <h1 className="font-luxury" style={{ fontSize: '2.5rem', margin: '10px 0' }}>Executive Risk Summary</h1>
        </div>
        
        <h3 className="font-luxury" style={{ color: 'var(--danger)' }}>CRITICAL FINDING: BOLA Vulnerability Detected</h3>
        <p style={{ lineHeight: 1.8, color: 'var(--dark-slate)' }}>
          During the automated fuzzing sequence, the API-Hunter engine successfully manipulated endpoint resource identifiers. 
          The engine tested <strong>{reportData.totalEndpoints} endpoints</strong> and discovered <strong>{reportData.vulnerabilitiesCount} critical vulnerabilities</strong>.
        </p>

        {reportData.vulnerabilities.map((vuln, idx) => (
          <div key={idx} style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fdf2f2', borderLeft: '4px solid var(--danger)', borderRadius: '4px' }}>
            <p className="font-mono" style={{ margin: 0, fontSize: '0.9rem', color: '#b91c1c' }}><strong>Target Compromised:</strong> Horizontal Privilege Escalation</p>
            <p className="font-mono" style={{ margin: '10px 0 0', fontSize: '0.8rem', color: '#475569', wordBreak: 'break-all' }}>
              <strong>Leaked Payload:</strong> {vuln.leaked_data}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center' }}>
        <button className="btn-primary" onClick={handleDownloadPDF} style={{ padding: '16px 32px', fontSize: '1.1rem', background: '#000', color: '#fff', cursor: 'pointer', border: 'none', borderRadius: '6px' }}>
          Download Report as PDF
        </button>
      </div>
    </div>
  );
}