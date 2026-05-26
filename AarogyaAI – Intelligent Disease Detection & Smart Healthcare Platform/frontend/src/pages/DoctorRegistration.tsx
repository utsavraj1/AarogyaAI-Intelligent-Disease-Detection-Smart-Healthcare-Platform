import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { BrandLogo } from '../components/BrandLogo'

/* ── shadcn ── */
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/* ── icons ── */
import { 
  ChevronRight, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle,
  Stethoscope,
  Building2,
  Medal,
  Fingerprint,
  ArrowLeft,
  FileText,
  ShieldCheck,
  Timer
} from 'lucide-react'

const specialties = [
  'General Physician', 'Cardiologist', 'Neurologist', 'Dermatologist', 'Orthopedic',
  'Pediatrician', 'Gynecologist', 'Psychiatrist', 'Oncologist', 'ENT Specialist',
  'Ophthalmologist', 'Urologist', 'Dentist', 'Radiologist', 'Pathologist'
]

export function DoctorRegistration() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [doctorId, setDoctorId] = useState<number | null>(null)
  
  // Step 1: Personal
  const [personal, setPersonal] = useState({
    full_name: '', email: '', mobile: '', password: '', confirm_password: ''
  })
  
  // Step 2: Professional
  const [prof, setProf] = useState({
    registration_number: '', medical_council: '', qualification: '',
    specialty: specialties[0], experience_yrs: '', hospital: ''
  })
  
  // Step 3: Documents
  const [files, setFiles] = useState<{
    degree: File | null, license: File | null, id: File | null, photo: File | null
  }>({ degree: null, license: null, id: null, photo: null })

  // Step 4: OTP
  const [otp, setOtp] = useState('')

  const handleNext = async () => {
    setError('')
    if (step === 1) {
      if (!personal.full_name || !personal.email || !personal.mobile || !personal.password) {
        return setError('All fields are required')
      }
      if (personal.password !== personal.confirm_password) {
        return setError('Passwords do not match')
      }
      setStep(2)
    } else if (step === 2) {
      if (!prof.registration_number || !prof.qualification || !prof.hospital) {
        return setError('Professional details are mandatory')
      }
      setStatus('loading')
      try {
        const res = await fetch('http://localhost:8000/doctor/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...personal,
            ...prof,
            experience_yrs: parseInt(prof.experience_yrs || '0')
          })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.detail || 'Registration failed')
        
        setDoctorId(data.id)
        setStep(3)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setStatus('idle')
      }
    } else if (step === 3) {
      if (!files.degree || !files.license) {
        return setError('Please upload at least your Degree and Medical License')
      }
      setStatus('loading')
      try {
        const formData = new FormData()
        formData.append('doctor_id', doctorId?.toString() || '')
        if (files.degree) formData.append('degree_certificate', files.degree)
        if (files.license) formData.append('medical_license', files.license)
        if (files.id) formData.append('govt_id', files.id)
        if (files.photo) formData.append('profile_photo', files.photo)
        
        const res = await fetch('http://localhost:8000/doctor/upload-documents', {
          method: 'POST',
          body: formData
        })
        if (!res.ok) throw new Error('Upload failed')
        
        await fetch('http://localhost:8000/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: personal.email })
        })
        
        setStep(4)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setStatus('idle')
      }
    }
  }

  const handleVerifyOTP = async () => {
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('http://localhost:8000/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: personal.email, otp_code: otp })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Invalid verification code')
      
      setStep(5)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setStatus('idle')
    }
  }

  const progress = (step / 5) * 100

  return (
    <div className="min-h-screen grid lg:grid-cols-5 bg-[#020807] selection:bg-emerald-500/30 overflow-hidden">
      {/* ── Left Sidebar Info ── */}
      <div className="hidden lg:flex col-span-2 flex-col justify-between p-12 bg-gradient-to-br from-emerald-950 via-[#05110f] to-[#020807] text-white relative overflow-hidden border-r border-emerald-900/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M%2040%200%20L%200%200%200%2040%22%20fill%3D%22none%22%20stroke%3D%22rgba(16%2C%20185%2C%20129%2C%200.03)%22%20stroke-width%3D%221%22%2F%3E%3C%2Fsvg%3E')] pointer-events-none" />
        
        <div className="relative z-10">
          <BrandLogo className="h-10 w-10" />
          <div className="mt-16 space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight">Clinical <br/><span className="text-emerald-500">Registry.</span></h1>
            <p className="text-emerald-100/60 text-sm leading-relaxed max-w-sm font-medium">
              You are applying for a verified medical account. This process ensures the highest standards of professional integrity on the AarogyaAI platform.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-6">
            {[
              { num: 1, title: 'Personal Identity', active: step >= 1, desc: 'Secure contact & authentication' },
              { num: 2, title: 'Medical Credentials', active: step >= 2, desc: 'Qualifications & registration' },
              { num: 3, title: 'Credential Verification', active: step >= 3, desc: 'Document upload for review' },
              { num: 4, title: 'Security Auth', active: step >= 4, desc: 'Terminal email verification' },
              { num: 5, title: 'Clinical Review', active: step === 5, desc: 'Final NMC audit' },
            ].map(s => (
              <div key={s.num} className={`flex items-start gap-4 transition-all duration-500 ${s.active ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-2'}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold border shrink-0 transition-all ${s.active ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20 scale-110' : 'border-emerald-500/30 text-emerald-500'}`}>
                  {s.num}
                </div>
                <div className="space-y-1">
                  <span className={`block text-sm font-bold ${s.active ? 'text-white' : 'text-emerald-100/40'}`}>{s.title}</span>
                  <span className="block text-[10px] font-medium text-emerald-500/40 uppercase tracking-widest">{s.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-emerald-900/30">
             <div className="flex items-center gap-3 text-amber-500/80">
                <ShieldCheck className="size-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Secured by AarogyaAI Compliance</span>
             </div>
          </div>
        </div>
      </div>

      {/* ── Right Form Area ── */}
      <div className="col-span-3 flex flex-col justify-center px-6 py-12 lg:px-20 max-h-screen overflow-y-auto relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-950">
          <div 
            className="h-full bg-emerald-500 transition-all duration-700 ease-in-out shadow-[0_0_15px_rgba(16,185,129,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="w-full max-w-xl mx-auto space-y-10">
          {step < 5 && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="inline-flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                <Fingerprint className="size-3" /> Step {step} of 4
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                {step === 1 && 'Personal Identity'}
                {step === 2 && 'Professional Credentials'}
                {step === 3 && 'Document Repository'}
                {step === 4 && 'Security Checkpoint'}
              </h2>
              <p className="text-emerald-100/40 font-medium">
                {step === 1 && 'Establish your unique clinical identifier.'}
                {step === 2 && 'Provide your official medical registration details.'}
                {step === 3 && 'Upload digitized copies of your certificates.'}
                {step === 4 && 'Authorize your clinical terminal via OTP.'}
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-bold text-rose-400 flex items-center gap-3 animate-in shake-1">
              <AlertCircle className="size-4 shrink-0" /> {error}
            </div>
          )}

          {/* STEP 1: PERSONAL */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80 ml-1">Full Professional Name</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-emerald-500/30 group-focus-within:text-emerald-500 transition-all" />
                    <Input value={personal.full_name} onChange={e => setPersonal({...personal, full_name: e.target.value})} className="bg-emerald-950/40 border-emerald-900/30 pl-11 h-12 rounded-xl text-white placeholder:text-emerald-100/10 focus:ring-emerald-500/10 focus:border-emerald-500/50" placeholder="Dr. Sarah Johnson" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80 ml-1">Terminal Mobile</Label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-emerald-500/30 group-focus-within:text-emerald-500 transition-all" />
                    <Input value={personal.mobile} onChange={e => setPersonal({...personal, mobile: e.target.value})} className="bg-emerald-950/40 border-emerald-900/30 pl-11 h-12 rounded-xl text-white placeholder:text-emerald-100/10 focus:ring-emerald-500/10 focus:border-emerald-500/50" placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80 ml-1">Clinical Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-emerald-500/30 group-focus-within:text-emerald-500 transition-all" />
                  <Input type="email" value={personal.email} onChange={e => setPersonal({...personal, email: e.target.value})} className="bg-emerald-950/40 border-emerald-900/30 pl-11 h-12 rounded-xl text-white placeholder:text-emerald-100/10 focus:ring-emerald-500/10 focus:border-emerald-500/50" placeholder="sarah.j@hospitals.ai" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80 ml-1">Security Key</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-emerald-500/30 group-focus-within:text-emerald-500 transition-all" />
                    <Input type="password" value={personal.password} onChange={e => setPersonal({...personal, password: e.target.value})} className="bg-emerald-950/40 border-emerald-900/30 pl-11 h-12 rounded-xl text-white placeholder:text-emerald-100/10 focus:ring-emerald-500/10 focus:border-emerald-500/50" placeholder="••••••••" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80 ml-1">Confirm Key</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-emerald-500/30 group-focus-within:text-emerald-500 transition-all" />
                    <Input type="password" value={personal.confirm_password} onChange={e => setPersonal({...personal, confirm_password: e.target.value})} className="bg-emerald-950/40 border-emerald-900/30 pl-11 h-12 rounded-xl text-white placeholder:text-emerald-100/10 focus:ring-emerald-500/10 focus:border-emerald-500/50" placeholder="••••••••" />
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button onClick={handleNext} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold h-12 rounded-xl shadow-lg shadow-emerald-500/20 group">
                  Continue Application
                  <ChevronRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Link to="/auth" className="block text-center mt-6 text-xs font-bold text-emerald-500/40 hover:text-emerald-400 uppercase tracking-widest transition-colors">
                  Already registered? Back to login
                </Link>
              </div>
            </div>
          )}

          {/* STEP 2: PROFESSIONAL */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80 ml-1">NMC Reg Number</Label>
                  <div className="relative group">
                    <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-emerald-500/30 group-focus-within:text-emerald-500 transition-all" />
                    <Input value={prof.registration_number} onChange={e => setProf({...prof, registration_number: e.target.value})} className="bg-emerald-950/40 border-emerald-900/30 pl-11 h-12 rounded-xl text-white placeholder:text-emerald-100/10" placeholder="e.g. 123456" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80 ml-1">Medical Council</Label>
                  <div className="relative group">
                    <Medal className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-emerald-500/30 group-focus-within:text-emerald-500 transition-all" />
                    <Input value={prof.medical_council} onChange={e => setProf({...prof, medical_council: e.target.value})} className="bg-emerald-950/40 border-emerald-900/30 pl-11 h-12 rounded-xl text-white placeholder:text-emerald-100/10" placeholder="e.g. DMC Delhi" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80 ml-1">Highest Qualification</Label>
                  <div className="relative group">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-emerald-500/30 group-focus-within:text-emerald-500 transition-all" />
                    <Input value={prof.qualification} onChange={e => setProf({...prof, qualification: e.target.value})} className="bg-emerald-950/40 border-emerald-900/30 pl-11 h-12 rounded-xl text-white placeholder:text-emerald-100/10" placeholder="MBBS, MD" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80 ml-1">Years of Experience</Label>
                  <Input type="number" value={prof.experience_yrs} onChange={e => setProf({...prof, experience_yrs: e.target.value})} className="bg-emerald-950/40 border-emerald-900/30 h-12 rounded-xl text-white" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80 ml-1">Clinical Specialty</Label>
                  <Select value={prof.specialty} onValueChange={(v) => setProf({...prof, specialty: v})}>
                    <SelectTrigger className="bg-emerald-950/40 border-emerald-900/30 h-12 rounded-xl text-white">
                      <SelectValue placeholder="Select Specialty" />
                    </SelectTrigger>
                    <SelectContent className="bg-emerald-950 border-emerald-900/30 text-white">
                      {specialties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80 ml-1">Primary Institution</Label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-emerald-500/30 group-focus-within:text-emerald-500 transition-all" />
                    <Input value={prof.hospital} onChange={e => setProf({...prof, hospital: e.target.value})} className="bg-emerald-950/40 border-emerald-900/30 pl-11 h-12 rounded-xl text-white placeholder:text-emerald-100/10" placeholder="Apollo Hospitals" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button variant="ghost" onClick={() => setStep(1)} className="text-emerald-500/40 hover:text-emerald-400 font-bold">
                  <ArrowLeft className="mr-2 size-4" /> Back
                </Button>
                <Button onClick={handleNext} disabled={status === 'loading'} className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold h-12 rounded-xl shadow-lg shadow-emerald-500/20">
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    'Verify & Continue'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: DOCUMENTS */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              {[
                { key: 'degree', label: 'Degree Certificate', icon: FileText },
                { key: 'license', label: 'Medical License (Active)', icon: ShieldCheck },
                { key: 'id', label: 'Government Identity (Aadhar/PAN)', icon: Fingerprint },
                { key: 'photo', label: 'Professional Profile Photo', icon: User }
              ].map(doc => (
                <div key={doc.key} className="group border border-emerald-900/20 border-dashed rounded-2xl p-5 bg-[#05110f]/40 hover:bg-emerald-950/20 hover:border-emerald-500/30 transition-all flex items-center justify-between ring-1 ring-emerald-950/50">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-emerald-500/5 flex items-center justify-center text-emerald-500/40 group-hover:text-emerald-500 transition-colors">
                        <doc.icon className="size-5" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{doc.label}</p>
                        <p className="text-[10px] text-emerald-500/30 uppercase tracking-widest font-bold">
                          {files[doc.key as keyof typeof files]?.name || 'Required: PDF or High-res JPG'}
                        </p>
                     </div>
                  </div>
                  <label className="cursor-pointer bg-emerald-950/60 border border-emerald-900/40 px-5 py-2.5 rounded-xl text-[10px] font-bold text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-lg active:scale-95">
                    Select File
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => {
                      if (e.target.files?.[0]) setFiles({...files, [doc.key]: e.target.files[0]})
                    }} />
                  </label>
                </div>
              ))}
              <div className="pt-6">
                <Button onClick={handleNext} disabled={status === 'loading'} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold h-12 rounded-xl shadow-lg shadow-emerald-500/20">
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" /> Uploading Repository...
                    </>
                  ) : (
                    'Submit Verification Documents'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: OTP */}
          {step === 4 && (
            <div className="space-y-8 text-center animate-in zoom-in-95 duration-500">
              <div className="mx-auto w-20 h-20 bg-emerald-500/5 rounded-3xl flex items-center justify-center border border-emerald-500/20 shadow-xl shadow-emerald-500/5 group">
                <Mail className="size-10 text-emerald-500 transition-transform group-hover:scale-110" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-emerald-100/50 font-medium">Authentication code dispatched to:</p>
                <p className="text-lg font-bold text-white tracking-tight">{personal.email}</p>
              </div>
              
              <div className="flex justify-center gap-2">
                <Input 
                  value={otp} 
                  onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} 
                  placeholder="000000" 
                  className="w-56 bg-emerald-950/40 border-emerald-500/20 h-16 rounded-2xl text-center text-3xl tracking-[0.4em] font-mono text-white placeholder:text-emerald-100/5 focus:ring-emerald-500/20 focus:border-emerald-500/60" 
                />
              </div>
              
              <div className="space-y-4">
                <Button onClick={handleVerifyOTP} disabled={status === 'loading' || otp.length < 6} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold h-12 rounded-xl shadow-lg shadow-emerald-500/20">
                  {status === 'loading' ? 'Validating Terminal...' : 'Verify Identity'}
                </Button>
                <button className="text-[10px] font-bold text-emerald-500/40 hover:text-emerald-500 uppercase tracking-widest transition-all">Resend Authorization Key</button>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS/PENDING */}
          {step === 5 && (
            <Card className="border-amber-500/20 bg-amber-500/5 backdrop-blur-xl animate-in zoom-in-95 duration-700">
               <CardContent className="pt-12 pb-12 px-10 text-center space-y-8">
                  <div className="mx-auto w-24 h-24 bg-amber-500/10 border-4 border-amber-500/30 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.1)]">
                    <Timer className="size-12 text-amber-500 animate-spin-slow" />
                  </div>
                  <div className="space-y-3">
                    <CardTitle className="text-3xl font-extrabold text-white tracking-tight">Terminal On-Hold</CardTitle>
                    <p className="text-emerald-100/60 max-w-sm mx-auto leading-relaxed font-medium">
                      Your credentials have been successfully submitted to the medical audit queue. We are verifying your identity against the **NMC Registry**.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-black/40 p-6 border border-emerald-900/30 text-left space-y-3">
                     <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-emerald-500/40">Expected TAT</span>
                        <span className="text-amber-500">24-48 Hours</span>
                     </div>
                     <Progress value={20} className="h-1 bg-emerald-950" />
                     <p className="text-[10px] text-emerald-500/30 font-medium leading-relaxed italic">
                        Once verified, you will receive a terminal activation key via email.
                     </p>
                  </div>
                  <div className="pt-4">
                    <Button variant="ghost" className="text-emerald-500 font-bold hover:text-emerald-400" asChild>
                      <Link to="/">Exit to Homepage</Link>
                    </Button>
                  </div>
               </CardContent>
            </Card>
          )}
          
        </div>
      </div>
    </div>
  )
}

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
)
