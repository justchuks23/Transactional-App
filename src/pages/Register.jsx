import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios.js'

export default function Register({ onLogin }) {
  const [username, setUsername] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
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
      const registerResponse = await api.post('/auth/register', {
        username,
        email,
        password,
        phone_number: phoneNumber,
      })
      console.log('REGISTER RESPONSE:', registerResponse.data)

      const loginResponse = await api.post('/auth/login', {
        email,
        password,
      })
      console.log('LOGIN RESPONSE:', loginResponse.data)
      const token = loginResponse.data.access_token
      onLogin(token)
      navigate('/dashboard')
    } catch (err) {
      console.log(err.response?.data)
    console.log(err.response?.status)

    setError(
      typeof err.response?.data?.detail === 'string'
        ? err.response.data.detail
        : JSON.stringify(err.response?.data)
    )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 px-8 py-10 shadow-2xl shadow-slate-950/40">
      <h1 className="text-3xl font-semibold text-white">Create your account</h1>
      <p className="mt-3 text-slate-400">Register and start managing your wallet instantly.</p>

      {error && <div className="mt-6 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-slate-300">Username</span>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-300">Phone number</span>
          <input
            type="text"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-300">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-300">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-70"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-white hover:text-sky-300">
          Sign in
        </Link>
      </p>
    </div>
  )
}
