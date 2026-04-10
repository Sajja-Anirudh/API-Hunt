import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../apis/api.js'
import { useAuth } from '../contexts/AuthContext.jsx'

const statusClass = (status) => {
  if (!status) return 'pending'
  const normalized = status.toLowerCase()
  if (normalized.includes('approved') || normalized.includes('delivered')) return 'approved'
  if (normalized.includes('declined') || normalized.includes('rejected')) return 'declined'
  return 'pending'
}

export default function IndentHistory() {
  const [history, setHistory] = useState([])
  const [dealer, setDealer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // State for adding a new record
  const [newModel, setNewModel] = useState('')
  const [newStatus, setNewStatus] = useState('Pending')
  const [isAdding, setIsAdding] = useState(false)

  const { signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let active = true

    const loadHistory = async () => {
      setLoading(true)
      setError('')

      try {
        const dealerResponse = await api.get('/dealer/dealer-details-secure/me')
        if (!active) return
        const dealerData = dealerResponse.data?.data
        setDealer(dealerData)

        // We fetch using the vulnerable route so the scanner can attack it later
        const historyResponse = await api.get(
          `/indent-history/indent-history-secure/${dealerData?.dealer_id}`
        )
        if (!active) return
        setHistory(historyResponse.data?.data ?? [])
      } catch (err) {
        if (err.response?.status === 401) {
          signOut()
          navigate('/login')
          return
        }
        setError('Unable to load indent history. Please try again later.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadHistory()
    return () => {
      active = false
    }
  }, [navigate, signOut])

  const handleAddIndent = async (e) => {
    e.preventDefault()
    if (!newModel) return
    setIsAdding(true)

    try {
      const response = await api.post('/indent-history/add', {
        model: newModel,
        status: newStatus
      })
      // Instantly update the UI with the new record
      setHistory([...history, response.data.data])
      setNewModel('') // Clear input
    } catch (err) {
      alert('Failed to add record.')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteIndent = async (indentId) => {
    try {
      await api.delete(`/indent-history/delete/${indentId}`)
      // Instantly remove the record from the UI
      setHistory(history.filter(item => item.indent_id !== indentId))
    } catch (err) {
      alert('Failed to delete record.')
    }
  }

  if (loading) {
    return <div className="status-shell">Loading indent history…</div>
  }

  if (error) {
    return <div className="status-shell toast-error">{error}</div>
  }

  return (
    <div className="table-shell">
      <div className="table-header">
        <div>
          <p className="eyebrow">Indent history</p>
          <h2>{dealer?.name || 'Dealer'} indent queue</h2>
          <p className="subtext">
            {history.length} records loaded for dealer ID {dealer?.dealer_id}.
          </p>
        </div>
        
        {/* ADD NEW RECORD FORM */}
        <form onSubmit={handleAddIndent} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="input-group" style={{ width: '200px' }}>
            <input
              type="text"
              placeholder="Enter Car Model..."
              value={newModel}
              onChange={(e) => setNewModel(e.target.value)}
              required
              style={{ padding: '10px 14px' }}
            />
          </div>
          <div className="input-group" style={{ width: '140px' }}>
            <select 
              value={newStatus} 
              onChange={(e) => setNewStatus(e.target.value)}
              style={{ 
                padding: '10px 14px', 
                borderRadius: '8px', 
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: 'var(--text)',
                fontFamily: 'inherit'
              }}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          <button className="button primary" type="submit" disabled={isAdding} style={{ padding: '10px 18px' }}>
            {isAdding ? '...' : '+ Add'}
          </button>
        </form>

      </div>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Indent ID</th>
              <th>Dealer ID</th>
              <th>Model</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((item) => (
                <tr key={item.indent_id}>
                  <td>{item.indent_id}</td>
                  <td>{item.dealer_id}</td>
                  <td style={{ fontWeight: 500 }}>{item.model}</td>
                  <td>
                    <span className={`status-pill ${statusClass(item.status)}`}>
                      {item.status || 'Pending'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDeleteIndent(item.indent_id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '6px 12px',
                        borderRadius: '6px'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#fee2e2'}
                      onMouseOut={(e) => e.target.style.background = 'transparent'}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>
                  No indent history records found. Add one above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}