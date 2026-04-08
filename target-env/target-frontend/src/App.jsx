import { BrowserRouter, Routes, Route, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import DealerDetails from './pages/DealerDetails.jsx'
import IndentHistory from './pages/IndentHistory.jsx'
import './App.css'

function RequireAuth({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

function DashboardLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="brand">
          <span className="brand-mark">A</span>
          <div>
            <div className="brand-title">Apex Dealer</div>
            <div className="brand-subtitle">Management cockpit</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard/history" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Indent history
          </NavLink>
          <NavLink to="/dashboard/profile" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Dealer profile
          </NavLink>
        </nav>

        <button className="logout-button" type="button" onClick={handleLogout}>
          Sign out
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Dealership dashboard</p>
            <h1>Dealer workspace</h1>
          </div>
          <div className="header-chip">Premium monitoring</div>
        </header>

        <section className="dashboard-panel">
          <Outlet />
        </section>
      </main>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard/history" replace />} />
        <Route path="history" element={<IndentHistory />} />
        <Route path="profile" element={<DealerDetails />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}