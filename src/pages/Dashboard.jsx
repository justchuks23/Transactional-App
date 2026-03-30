import { useEffect, useMemo, useState } from 'react'
import api from '../api/axios.js'

const formatMoney = (value) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(value)
}

const buildIdempotencyKey = () => `frontend-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

export default function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null)
  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [feedback, setFeedback] = useState('')

  const balance = useMemo(() => {
    if (!wallet) return 'N/A'
    return formatMoney(wallet.balance_kobo / 100)
  }, [wallet])

  const loadData = async () => {
    setLoading(true)
    setError('')

    try {
      const userRes = await api.get('/users/me')
      setUser(userRes.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to load user information')
      setLoading(false)
      return
    }

    try {
      const walletRes = await api.get('/wallets/me')
      setWallet(walletRes.data)
    } catch (err) {
      if (err.response?.status === 404) {
        setWallet(null)
      } else {
        setError(err.response?.data?.detail || 'Unable to load wallet')
      }
    }

    try {
      const txRes = await api.get('/transactions/my', { params: { limit: 10 } })
      setTransactions(txRes.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to load transactions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateWallet = async () => {
    setFeedback('')
    try {
      const response = await api.post('/wallets')
      setWallet(response.data)
      setFeedback('Your wallet has been created.')
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not create wallet.')
    }
  }

  const handleDeposit = async (event) => {
    event.preventDefault()
    setFeedback('')
    setError('')

    if (!depositAmount || Number(depositAmount) <= 0) {
      setError('Enter a valid deposit amount')
      return
    }

    try {
      const amountKobo = Math.round(Number(depositAmount) * 100)
      const response = await api.post(
        `/wallets/${wallet.id}/deposit`,
        { amount_kobo: amountKobo },
        { headers: { 'idempotency-key': buildIdempotencyKey() } }
      )
      setWallet(response.data)
      setDepositAmount('')
      setFeedback('Deposit completed successfully.')
    } catch (err) {
      setError(err.response?.data?.detail || 'Deposit failed.')
    }
  }

  const handleWithdraw = async (event) => {
    event.preventDefault()
    setFeedback('')
    setError('')

    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      setError('Enter a valid withdrawal amount')
      return
    }

    try {
      const amountKobo = Math.round(Number(withdrawAmount) * 100)
      const response = await api.post(
        `/wallets/${wallet.id}/withdraw`,
        { amount_kobo: amountKobo },
        { headers: { 'idempotency-key': buildIdempotencyKey() } }
      )
      setWallet(response.data)
      setWithdrawAmount('')
      setFeedback('Withdrawal completed successfully.')
    } catch (err) {
      setError(err.response?.data?.detail || 'Withdrawal failed.')
    }
  }

  if (loading) {
    return <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-slate-300">Loading dashboard...</div>
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/30">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-400/80">Account</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">{user?.username || 'User'}</h1>
              <p className="mt-2 text-slate-400">{user?.email}</p>
            </div>
            <div className="rounded-3xl bg-slate-800/80 px-4 py-3 text-right">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Balance</p>
              <p className="mt-2 text-3xl font-semibold text-sky-300">{balance}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Phone</h2>
              <p className="mt-3 text-lg text-slate-100">{user?.phone_number || 'Not set'}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Wallet ID</h2>
              <p className="mt-3 text-lg text-slate-100">{wallet?.id ?? 'No wallet yet'}</p>
            </div>
          </div>

          {error && <div className="mt-6 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
          {feedback && <div className="mt-6 rounded-2xl bg-sky-500/10 px-4 py-3 text-sm text-sky-200">{feedback}</div>}
        </section>

        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/30">
          <h2 className="text-xl font-semibold text-white">Quick actions</h2>
          <p className="mt-2 text-slate-400">Use your wallet to move money and manage funds.</p>

          {!wallet ? (
            <div className="mt-6 space-y-4">
              <p className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 text-slate-300">
                No wallet found for your account yet. Create your wallet to start deposits and withdrawals.
              </p>
              <button
                onClick={handleCreateWallet}
                className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Create Wallet
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              <form onSubmit={handleDeposit} className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                <h3 className="text-lg font-semibold text-white">Deposit funds</h3>
                <label className="block text-sm text-slate-300">
                  Amount (NGN)
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-sky-500"
                  />
                </label>
                <button className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
                  Deposit
                </button>
              </form>

              <form onSubmit={handleWithdraw} className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                <h3 className="text-lg font-semibold text-white">Withdraw funds</h3>
                <label className="block text-sm text-slate-300">
                  Amount (NGN)
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-sky-500"
                  />
                </label>
                <button className="w-full rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-rose-400">
                  Withdraw
                </button>
              </form>
            </div>
          )}
        </section>
      </div>

      <section className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Recent transactions</h2>
            <p className="mt-2 text-slate-400">The latest activity from your wallet.</p>
          </div>
          <button onClick={loadData} className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-700">
            Refresh
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-700 bg-slate-950/80 p-8 text-slate-400">
            No recent transactions yet.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{transaction.type.replace('_', ' ')}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{formatMoney(transaction.amount_kobo / 100)}</p>
                  </div>
                  <p className="text-sm text-slate-500">{new Date(transaction.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
