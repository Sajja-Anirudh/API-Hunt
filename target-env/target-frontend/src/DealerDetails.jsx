import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from './api.js'
import { useAuth } from './AuthContext.jsx'

export default function DealerDetails() {
  const [dealer, setDealer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let active = true

    const loadDealer = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await api.get('/dealer/dealer-details-secure/me')
        if (!active) return
        setDealer(response.data?.data ?? null)
      } catch (err) {
        if (err.response?.status === 401) {
          signOut()
          navigate('/login')
          return
        }
        setError('Unable to load dealer details. Please refresh the page.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadDealer()
    return () => {
      active = false
    }
  }, [navigate, signOut])

  if (loading) {
    return <div className="status-shell">Loading dealer profile…</div>
  }

  if (error) {
    return <div className="status-shell toast-error">{error}</div>
  }

  if (!dealer) {
    return <div className="status-shell">No dealer profile was found.</div>
  }

  return (
    <div className="profile-card">
      <div className="profile-banner">
        <div className="profile-meta">
          <p className="eyebrow">Dealer profile</p>
          <h2>{dealer.name}</h2>
          <p>{dealer.location}</p>
        </div>
        <div className="chip">ID {dealer.dealer_id}</div>
      </div>

      <div className="profile-details">
        <div className="info-row">
          <div className="info-card">
            <span>Location</span>
            <strong>{dealer.location}</strong>
          </div>
          <div className="info-card">
            <span>Reputation</span>
            <strong>{dealer.rating ?? 'N/A'} / 5.0</strong>
          </div>
        </div>

        <div className="info-row">
          <div className="info-card">
            <span>Dealer ID</span>
            <strong>{dealer.dealer_id}</strong>
          </div>
          <div className="info-card">
            <span>Current status</span>
            <strong>Connected securely</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
