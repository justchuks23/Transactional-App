import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { setAuthToken } from './api/axios.js'

function ProtectedRoute({ token, children }) {
  const location = useLocation()
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'))

  useEffect(() => {
    setAuthToken(token)
  }, [token])

  const handleLogin = (newToken) => {
    localStorage.setItem('authToken', newToken)
    setToken(newToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    setToken(null)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-semibold tracking-tight text-white">
            FinTech Dashboard
          </Link>
          <div className="flex items-center gap-3 text-slate-300">
            {token ? (
              <button
                onClick={handleLogout}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm transition hover:bg-slate-700"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link to="/login" className="rounded-xl px-4 py-2 text-sm text-slate-200 hover:text-white">
                  Login
                </Link>
                <Link to="/register" className="rounded-xl bg-sky-500 px-4 py-2 text-sm text-slate-950 transition hover:bg-sky-400">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <Routes>
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute token={token}>
                <Dashboard onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}
