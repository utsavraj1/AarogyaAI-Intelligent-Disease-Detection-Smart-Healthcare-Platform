import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'

/* ── Standard Icons ── */
import { 
  Mail, 
  Lock, 
  User, 
  ChevronRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Sparkles,
  Activity,
  Globe,
  Heart,
  Phone
} from 'lucide-react'

const genders = ['Prefer not to say', 'Male', 'Female', 'Other']
const bloodGroups = ['Unknown', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

export default function AuthPage() {
  const auth = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  
  const [showOTP, setShowOTP] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    full_name: '', 
    email: '', 
    password: '', 
    role: 'patient',
    age: '', 
    gender: genders[0], 
    blood_group: bloodGroups[0],
    phone: ''
  })

  const upd = (k: keyof typeof form, val: any) => setForm(p => ({ ...p, [k]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await auth.login(form.email, form.password)
        navigate('/dashboard')
      } else {
        if (!showOTP) {
          if (!form.full_name || !form.email || !form.password) {
            setLoading(false)
            return setError('Full name, email and password are required to initialize identity.')
          }
          const otpRes = await api.sendOTP(form.email)
          if (otpRes && otpRes.otp && otpRes.otp !== 'SENT_TO_EMAIL') {
            console.log("Dev Mode: Your AarogyaAI OTP is", otpRes.otp)
          }
          setShowOTP(true)
        } else {
          await api.verifyOTP(form.email, otpCode)
          
          await auth.register({
            full_name: form.full_name, email: form.email, password: form.password, 
            role: form.role, age: form.age ? Number(form.age) : null,
            gender: form.gender === 'Prefer not to say' ? null : form.gender,
            blood_group: form.blood_group === 'Unknown' ? null : form.blood_group,
            phone: form.phone || null
          })
          navigate('/dashboard')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Auth failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    setError('')
    try {
      await auth.googleLogin({
        token: "MOCK_GOOGLE_TOKEN",
        email: "verified.user@gmail.com",
        full_name: "Verified Google User"
      })
      navigate('/dashboard')
    } catch (err) {
      setError('Google verification failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-[#F7F1E3] text-[#0F5132] selection:bg-[#D4A44D]/30 overflow-hidden flex flex-col lg:flex-row font-sans">
      
      {/* ── Background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#F7F1E3]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#D4A44D]/10 blur-[150px] rounded-full" />
      </div>

      {/* ── Left Hero (60%) ── */}
      <div className="hidden lg:flex lg:w-[60%] relative flex-col justify-between p-20 z-10">
         <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/40 border border-[#D4A44D]/30 shadow-sm">
               <Heart className="size-8 text-[#D4A44D]" />
            </div>
            <div className="flex flex-col">
               <span className="text-2xl font-bold font-cinzel tracking-tight text-[#0F5132]">Aarogya<span className="text-[#D4A44D]">AI</span></span>
               <span className="text-[10px] font-bold text-[#B8860B] uppercase tracking-[0.4em] mt-0.5">Clinical Wisdom</span>
            </div>
         </div>

         <div className="space-y-12 animate-in fade-in slide-in-from-left-12 duration-1000">
            <div className="space-y-6">
               <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#D4A44D]/10 border border-[#D4A44D]/20">
                  <Sparkles className="size-4 text-[#D4A44D]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#B8860B]">Ancient Wisdom • Modern AI</span>
               </div>
               
               <h1 className="text-7xl lg:text-[100px] font-bold font-cinzel tracking-tight leading-[0.85] text-[#0F5132]">
                  Precision <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#0F5132] to-[#D4A44D]">Inference.</span>
               </h1>
               
               <p className="text-2xl text-[#0F5132]/60 font-medium max-w-xl leading-relaxed">
                  Merging Ayurvedic principles with neural diagnostics for global clinical excellence.
               </p>
            </div>

            <div className="space-y-4 pt-8 border-l-4 border-[#D4A44D]/30 pl-10">
               <p className="text-4xl font-bold font-devanagari text-[#B8860B]">“सर्वे सन्तु निरामयाः”</p>
               <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-[#0F5132]/30">May all beings be free from disease.</p>
            </div>
         </div>

         <div className="flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.4em] text-[#0F5132]/20">
            <div className="flex items-center gap-3">
               <ShieldCheck className="size-4" />
               AES-256 Secure
            </div>
            <div className="flex items-center gap-3">
               <Globe className="size-4" />
               Global Faculty
            </div>
         </div>
      </div>

      {/* ── Right Auth (40%) ── */}
      <div className="flex-1 relative flex flex-col justify-center items-center p-8 lg:p-12 z-20">
         <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-12 duration-1000">
            
            <div className="text-center space-y-4">
               <h2 className="text-4xl font-bold font-cinzel tracking-tight text-[#0F5132]">
                  {showOTP ? 'OTP Verification' : (mode === 'login' ? 'Faculty Entry' : 'Create Node')}
               </h2>
               <p className="text-[#B8860B] text-[10px] font-bold uppercase tracking-wide">
                  {showOTP ? 'Enter the 6-digit code sent to your email' : (mode === 'login' ? 'Clinical gateway active' : 'Initialize faculty registration')}
               </p>
            </div>

            <div className="border border-[#D4A44D]/30 bg-white/40 backdrop-blur-xl shadow-2xl rounded-[3rem] overflow-hidden p-8 lg:p-10">
               <form onSubmit={handleSubmit} className="space-y-6">
                  {showOTP ? (
                     <div className="space-y-8 animate-in zoom-in-95 duration-500">
                        <input 
                           value={otpCode} 
                           onChange={e => setOtpCode(e.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '').slice(0, 6))} 
                           placeholder="· · · · · ·" 
                           className={`w-full bg-white/60 border h-16 rounded-2xl text-center text-4xl tracking-[0.5em] font-mono text-[#0F5132] outline-none transition-all ${otpCode.length === 6 ? 'border-emerald-500 bg-emerald-50/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-[#D4A44D]/20 focus:border-[#D4A44D]'}`} 
                        />
                        <button 
                           type="submit" 
                           disabled={loading || otpCode.length < 6} 
                           className={`w-full font-bold h-14 rounded-2xl shadow-xl uppercase tracking-widest text-xs transition-all active:scale-95 flex items-center justify-center gap-2 ${
                              otpCode.length === 6 
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 animate-pulse-subtle' 
                              : 'bg-[#0F5132] text-white opacity-50 cursor-not-allowed'
                           }`}
                        >
                           {loading ? (
                              <>
                                 <Loader2 className="animate-spin size-4" />
                                 Validating...
                              </>
                           ) : (
                              <>
                                 <ShieldCheck className="size-4" />
                                 Activate Connection
                              </>
                           )}
                        </button>
                        <button type="button" onClick={() => setShowOTP(false)} className="w-full text-[10px] font-bold text-[#B8860B] hover:text-[#0F5132] uppercase tracking-widest flex items-center justify-center gap-2">
                           <ArrowLeft className="size-3" /> Back
                        </button>
                     </div>
                  ) : (
                     <div className="space-y-6">
                        <div className="flex p-1 bg-[#0F5132]/5 rounded-2xl border border-[#D4A44D]/10">
                           <button type="button" onClick={() => setMode('login')} className={`flex-1 h-11 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-[#0F5132] text-white shadow-lg' : 'text-[#0F5132]/40'}`}>Access</button>
                           <button type="button" onClick={() => setMode('register')} className={`flex-1 h-11 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'register' ? 'bg-[#0F5132] text-white shadow-lg' : 'text-[#0F5132]/40'}`}>Register</button>
                        </div>

                        {/* Google Verification (Login/Register with Google) */}
                        <button 
                           type="button" 
                           onClick={handleGoogleAuth}
                           disabled={loading}
                           className="w-full flex items-center justify-center gap-3 h-12 bg-white border border-[#D4A44D]/20 rounded-xl hover:bg-[#F0E4C7] transition-all group disabled:opacity-50"
                        >
                           <svg className="size-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                           </svg>
                           <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F5132]/60 group-hover:text-[#0F5132]">Verify with Google</span>
                        </button>

                        <div className="flex items-center gap-3">
                           <div className="h-[1px] flex-1 bg-[#D4A44D]/10" />
                           <span className="text-[8px] font-bold text-[#0F5132]/20 uppercase tracking-widest">Or use Clinical ID</span>
                           <div className="h-[1px] flex-1 bg-[#D4A44D]/10" />
                        </div>

                        {mode === 'register' && (
                           <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                              <div className="flex items-center gap-6 px-1">
                                 <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" checked={form.role === 'patient'} onChange={() => upd('role', 'patient')} className="size-4 accent-[#0F5132]" />
                                    <span className="text-xs font-bold text-[#0F5132]/60">Patient</span>
                                 </label>
                                 <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" checked={form.role === 'doctor'} onChange={() => upd('role', 'doctor')} className="size-4 accent-[#0F5132]" />
                                    <span className="text-xs font-bold text-[#0F5132]/60">Physician</span>
                                 </label>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                 <div className="col-span-2">
                                    <label className="text-[9px] font-bold text-[#0F5132]/40 uppercase tracking-widest ml-1">Full Identity</label>
                                    <div className="relative">
                                       <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#D4A44D]/40" />
                                       <input 
                                          value={form.full_name} 
                                          onChange={e => upd('full_name', e.target.value)} 
                                          className="w-full bg-white/50 border border-[#D4A44D]/10 h-12 rounded-xl pl-11 pr-4 text-[#0F5132] outline-none focus:border-[#D4A44D] transition-all" 
                                          placeholder="Legal Name"
                                       />
                                    </div>
                                 </div>
                                 <div className="col-span-2">
                                    <label className="text-[9px] font-bold text-[#0F5132]/40 uppercase tracking-widest ml-1">Contact Number</label>
                                    <div className="relative">
                                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#D4A44D]/40" />
                                       <input 
                                          value={form.phone} 
                                          onChange={e => upd('phone', e.target.value)} 
                                          className="w-full bg-white/50 border border-[#D4A44D]/10 h-12 rounded-xl pl-11 pr-4 text-[#0F5132] outline-none focus:border-[#D4A44D] transition-all" 
                                          placeholder="+91 00000 00000"
                                       />
                                    </div>
                                 </div>
                                 <div>
                                    <label className="text-[9px] font-bold text-[#0F5132]/40 uppercase tracking-widest ml-1">Age</label>
                                    <input 
                                       type="number" 
                                       value={form.age} 
                                       onChange={e => upd('age', e.target.value)} 
                                       className="w-full bg-white/50 border border-[#D4A44D]/10 h-12 rounded-xl px-4 text-[#0F5132] outline-none focus:border-[#D4A44D] transition-all" 
                                    />
                                 </div>
                                 <div>
                                    <label className="text-[9px] font-bold text-[#0F5132]/40 uppercase tracking-widest ml-1">Blood</label>
                                    <select 
                                       value={form.blood_group} 
                                       onChange={e => upd('blood_group', e.target.value)} 
                                       className="w-full bg-white/50 border border-[#D4A44D]/10 h-12 rounded-xl px-3 text-[#0F5132] outline-none text-xs"
                                    >
                                       {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                    </select>
                                 </div>
                              </div>
                           </div>
                        )}

                        <div className="space-y-4">
                           <div className="space-y-1">
                              <label className="text-[9px] font-bold text-[#0F5132]/40 uppercase tracking-widest ml-1">Clinical Email</label>
                              <div className="relative">
                                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#D4A44D]/40" />
                                 <input 
                                    type="email" 
                                    value={form.email} 
                                    onChange={e => upd('email', e.target.value)} 
                                    className="w-full bg-white/50 border border-[#D4A44D]/10 h-12 rounded-xl pl-11 pr-4 text-[#0F5132] outline-none focus:border-[#D4A44D] transition-all" 
                                    placeholder="access@aarogya.ai"
                                 />
                              </div>
                           </div>
                           <div className="space-y-1">
                              <label className="text-[9px] font-bold text-[#0F5132]/40 uppercase tracking-widest ml-1">Security Key</label>
                              <div className="relative">
                                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#D4A44D]/40" />
                                 <input 
                                    type="password" 
                                    value={form.password} 
                                    onChange={e => upd('password', e.target.value)} 
                                    className="w-full bg-white/50 border border-[#D4A44D]/10 h-12 rounded-xl pl-11 pr-4 text-[#0F5132] outline-none focus:border-[#D4A44D] transition-all" 
                                    placeholder="••••••••"
                                 />
                              </div>
                           </div>

                           {error && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[10px] font-bold text-rose-600 text-center uppercase tracking-widest">{error}</div>}

                           <button 
                              type="submit" 
                              disabled={loading} 
                              className="w-full bg-[#0F5132] hover:bg-[#1B4332] text-white font-bold h-14 rounded-2xl shadow-xl shadow-[#0F5132]/20 uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                           >
                              {loading ? <Loader2 className="animate-spin size-5" /> : (
                                 <>
                                    {mode === 'login' ? 'Authenticate' : 'Initialize Identity'}
                                    <ChevronRight className="size-4" />
                                 </>
                              )}
                           </button>
                        </div>
                     </div>
                  )}
               </form>
            </div>

            <div className="text-center">
               <Link to="/admin-login" className="text-[10px] font-bold text-[#D4A44D]/40 hover:text-[#0F5132] uppercase tracking-[0.4em] transition-all">Secure Terminal →</Link>
            </div>
         </div>
      </div>
    </div>
  )
}
