import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from './api.js'
import { useAuth } from './AuthContext.jsx'

const statusClass = (status) => {
  if (!status) return 'pending'
  const normalized = status.toLowerCase()
  if (normalized.includes('approved')) return 'approved'
  if (normalized.includes('declined') || normalized.includes('rejected')) return 'declined'
  return 'pending'
}

export default function IndentHistory() {
  const [history, setHistory] = useState([])
  const [dealer, setDealer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
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

        const historyResponse = await api.get(
          `/indent-history/indent-history-vulnerable/${dealerData?.dealer_id}`,
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
        <div className="chip">Secure sync</div>
      </div>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Indent ID</th>
              <th>Dealer ID</th>
              <th>Model</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((item) => (
                <tr key={item.indent_id}>
                  <td>{item.indent_id}</td>
                  <td>{item.dealer_id}</td>
                  <td>{item.model}</td>
                  <td>
                    <span className={`status-pill ${statusClass(item.status)}`}>
                      {item.status || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No indent history records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
