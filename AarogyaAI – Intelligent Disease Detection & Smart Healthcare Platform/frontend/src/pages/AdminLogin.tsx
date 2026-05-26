import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { BrandLogo } from '../components/BrandLogo'

/* ── icons ── */
import { ShieldAlert, Lock, Mail, ChevronRight, Loader2, ArrowLeft, Activity, AlertTriangle } from 'lucide-react'

const ADMIN_KEY = 'aarogyaai_admin_auth'

export function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const res = await fetch('http://localhost:8000/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const detail = await res.json().catch(() => ({}))
        throw new Error(detail?.detail || 'Invalid admin credentials')
      }

      const data = await res.json()
      localStorage.setItem(ADMIN_KEY, JSON.stringify({ 
        email: data.email, 
        token: data.access_token,
        ts: Date.now() 
      }))
      
      localStorage.setItem('aarogyaai_auth', JSON.stringify({
        token: data.access_token,
        user: { id: data.user_id, full_name: data.full_name, email: data.email }
      }))

      navigate('/admin')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020807] selection:bg-emerald-500/30 overflow-hidden relative px-4 py-12">
      {/* ── High-Tech Background ── */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M%2060%200%20L%200%200%200%2060%22%20fill%3D%22none%22%20stroke%3D%22rgba(16%2C%20185%2C%20129%2C%200.03)%22%20stroke-width%3D%221%22%2F%3E%3C%2Fsvg%3E')] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-emerald-500/[0.02] rounded-full blur-[120px] pointer-events-none animate-pulse" />
      
      {/* ── Central Terminal ── */}
      <div className="relative z-10 w-full max-w-[480px]">
        <div className="absolute -inset-1.5 bg-gradient-to-br from-emerald-500/20 to-amber-500/20 rounded-[2.5rem] blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        
        <div className="border-emerald-900/40 bg-[#05110f]/80 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2rem] overflow-hidden border-2 relative">
          {/* Scanning Animation Effect */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30 animate-scan z-50" />
          
          <div className="text-center pb-8 pt-12 relative px-10">
            <div className="mx-auto mb-6 relative group w-24 h-24">
               <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-500/30 transition-all duration-500" />
               <div className="relative h-24 w-24 flex items-center justify-center rounded-3xl bg-[#0b1311] border-2 border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
                  <ShieldAlert className="size-12 text-emerald-500 animate-pulse" />
               </div>
               <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-amber-500 border-4 border-[#05110f] flex items-center justify-center">
                  <Lock className="size-3.5 text-black" />
               </div>
            </div>
            
            <h1 className="text-4xl font-extrabold text-white heading-font tracking-tight">Admin Gateway</h1>
            <p className="text-emerald-500/50 font-bold uppercase tracking-[0.3em] text-[10px] mt-3">
              Clinical Infrastructure Terminal
            </p>
          </div>

          <div className="px-10 pb-12 space-y-8">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Activity className="size-5" />
              </div>
              <p className="text-[11px] text-emerald-100/60 font-medium leading-tight">
                Secure biometric handshake required. Unauthorized access attempts are monitored by <span className="text-emerald-400 font-bold">Protocol-AI</span>.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500/60">Terminal Identity</label>
                  <span className="text-[9px] font-mono text-emerald-900 font-bold uppercase">Field: EMAIL_STR</span>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Mail className="size-5 text-emerald-500/40 group-focus-within:text-emerald-400 transition-colors" />
                  </div>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    placeholder="admin@aarogya.ai"
                    className="w-full bg-[#0b1311]/60 border border-emerald-900/50 pl-12 h-14 rounded-2xl text-white placeholder:text-emerald-500/10 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 focus:outline-none transition-all font-medium text-base"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500/60">Security Keyphrase</label>
                  <span className="text-[9px] font-mono text-emerald-900 font-bold uppercase">Field: SECURE_PASS</span>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Lock className="size-5 text-emerald-500/40 group-focus-within:text-emerald-400 transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                    placeholder="••••••••"
                    className="w-full bg-[#0b1311]/60 border border-emerald-900/50 pl-12 h-14 rounded-2xl text-white placeholder:text-emerald-500/10 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 focus:outline-none transition-all font-medium text-base"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-xs font-bold text-rose-400 flex items-center gap-3 animate-in shake-1">
                  <AlertTriangle className="size-4 shrink-0" />
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#020807] font-extrabold h-14 rounded-2xl transition-all shadow-2xl shadow-emerald-500/20 active:scale-[0.98] group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="size-5 animate-spin" />
                    <span className="tracking-wide">Establishing Uplink...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span className="tracking-wide">Initiate Secure Login</span>
                    <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </form>

            <div className="flex flex-col gap-6">
               <div className="flex items-center gap-4">
                  <div className="h-[1px] flex-1 bg-emerald-900/20" />
                  <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest">Administrative Context</span>
                  <div className="h-[1px] flex-1 bg-emerald-900/20" />
               </div>
               
               <div className="flex items-center justify-between">
                  <Link to="/auth" className="flex items-center gap-2 text-emerald-500/60 hover:text-emerald-400 transition-colors text-xs font-bold group">
                    <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Patient Portal
                  </Link>
                  <div className="text-right">
                     <p className="text-[10px] font-bold text-emerald-900 uppercase">Gateway Version</p>
                     <p className="text-[10px] font-mono text-emerald-500/40">v2.4.1-STABLE</p>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="bg-emerald-950/40 px-10 py-6 border-t border-emerald-900/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
               <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-[0.2em]">Node Online</span>
            </div>
            <p className="text-[9px] text-emerald-900 font-bold uppercase tracking-widest">
              Demo: admin / admin123
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[10px] font-bold text-emerald-900/40 uppercase tracking-[0.4em]">
          Restricted access terminal • AarogyaAI Integrated Systems
        </p>
      </div>
    </div>
  )
}

