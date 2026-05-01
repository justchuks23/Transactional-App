import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios.js'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      })
      const token = response.data.access_token
      onLogin(token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please verify your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 px-8 py-10 shadow-2xl shadow-slate-950/40">
      <div className="mb-6 h-1.5 w-20 rounded-full bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-500"></div>
      <h1 className="text-3xl font-semibold text-amber-100">Welcome back</h1>
      <p className="mt-3 text-amber-200">Sign in to access your wallet, deposit, and transfers.</p>

      {error && <div className="mt-6 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-slate-300">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-amber-400"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-300">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-amber-400"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:opacity-70"
        >
          {loading ? 'Signing in …' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        New to the app?{' '}
        <Link to="/register" className="font-semibold text-amber-200 hover:text-amber-100">
          Create an account
        </Link>
      </p>
    </div>
  )
}
