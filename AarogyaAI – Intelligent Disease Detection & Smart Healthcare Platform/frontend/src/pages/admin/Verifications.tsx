import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import type { Doctor } from '../../lib/types'
import { 
  ShieldCheck, 
  Stethoscope, 
  Building2, 
  Fingerprint, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  User as UserIcon, 
  RefreshCcw,
  Search
} from 'lucide-react'

export function VerificationsPage() {
  const { token: authContextToken } = useAuth()
  const token = authContextToken || (() => {
    const stored = localStorage.getItem('aarogyaai_auth')
    return stored ? JSON.parse(stored).token : null
  })()

  const [pendingDoctors, setPendingDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectReason, setRejectReason] = useState('')
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null)

  const fetchData = async () => {
    if (!token) return
    setLoading(true)
    try {
      const pending = await api.getPendingDoctors(token)
      setPendingDoctors(pending)
    } catch (err) {
      console.error("Admin data fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    if (!token) return
    try {
      if (action === 'approve') await api.approveDoctor(token, id)
      else if (action === 'reject') await api.rejectDoctor(token, id, rejectReason || 'Rejected by admin')
      fetchData()
      setSelectedDocId(null)
      setRejectReason('')
    } catch (e: any) {
      alert(e.message)
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-emerald-950/20 p-8 rounded-3xl border border-emerald-900/30 backdrop-blur-xl">
         <div>
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
               <span className="text-[10px] font-bold text-amber-500/60 uppercase tracking-[0.2em]">Security Protocol</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight heading-font mt-1 text-white">Pending Verifications</h2>
            <p className="text-emerald-100/40 text-xs mt-1 italic">Professional credential audit queue.</p>
         </div>
         <button onClick={fetchData} className="h-12 w-12 flex items-center justify-center bg-emerald-950/20 border border-emerald-900/30 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all">
            <RefreshCcw className="size-4" />
         </button>
      </div>

      <div className="grid gap-6">
        {pendingDoctors.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[40vh] text-center space-y-6">
             <div className="h-24 w-24 rounded-full bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
                <ShieldCheck className="size-10 text-emerald-500/20" />
             </div>
             <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Registry Synchronized</h3>
                <p className="text-emerald-500/40 text-sm">No pending verification requests.</p>
             </div>
          </div>
        ) : (
          pendingDoctors.map(doc => (
            <div key={doc.id} className="bg-[#05110f]/40 border border-emerald-900/30 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl group hover:border-emerald-500/40 transition-all duration-500">
              <div className="flex flex-col lg:flex-row">
                <div className="p-8 flex-1 space-y-8">
                  <div className="flex items-center gap-6">
                     <div className="h-20 w-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                       <UserIcon className="size-10" />
                     </div>
                     <div className="space-y-1">
                       <h4 className="text-3xl font-extrabold text-white heading-font tracking-tight">{doc.full_name}</h4>
                       <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                          <Stethoscope className="size-3" /> {doc.specialty} • {doc.experience_yrs}Y EXPERIENCE
                       </p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {[
                       { label: 'Registration', val: doc.registration_number, icon: Fingerprint },
                       { label: 'Medical Council', val: doc.medical_council, icon: ShieldCheck },
                       { label: 'Hospital', val: doc.hospital, icon: Building2 },
                     ].map(stat => (
                       <div key={stat.label} className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/10 space-y-1 group/item hover:border-emerald-500/30 transition-all">
                          <p className="text-[9px] font-bold text-emerald-500/40 uppercase tracking-widest flex items-center gap-1.5">
                            <stat.icon className="size-3" /> {stat.label}
                          </p>
                          <p className="text-sm font-bold text-white group-hover/item:text-emerald-400 transition-colors">{stat.val}</p>
                       </div>
                     ))}
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4 border-t border-emerald-900/20">
                    <button onClick={() => handleAction(doc.id, 'approve')} className="bg-emerald-500 hover:bg-emerald-400 text-[#020807] font-extrabold h-12 px-8 rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95">
                      <CheckCircle2 className="size-4" /> Authorize Professional
                    </button>
                    <button onClick={() => setSelectedDocId(doc.id === selectedDocId ? null : doc.id)} className="bg-transparent border border-rose-500/20 text-rose-400 hover:bg-rose-500/5 font-bold h-12 px-8 rounded-xl transition-all">
                      Reject Protocol
                    </button>
                  </div>
                </div>

                <div className="w-full lg:w-72 bg-emerald-950/20 border-l border-emerald-900/20 p-8 space-y-6">
                  <p className="text-[10px] font-bold text-emerald-500/40 uppercase tracking-[0.2em] text-center">Validation Dossier</p>
                  <div className="space-y-3">
                     {['degree_certificate_url', 'medical_license_url', 'govt_id_url'].map(key => {
                       const url = doc[key as keyof Doctor]
                       return url && (
                         <a key={key} href={`http://localhost:8000${url}`} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 rounded-xl bg-[#0b1311] border border-emerald-900/30 text-xs font-bold text-emerald-100/60 hover:text-emerald-400 hover:border-emerald-500/50 transition-all">
                           <span className="capitalize">{key.split('_')[0]}</span>
                           <ExternalLink className="size-3.5" />
                         </a>
                       )
                     })}
                  </div>
                </div>
              </div>

              {selectedDocId === doc.id && (
                <div className="p-8 bg-rose-500/5 border-t border-rose-500/10 animate-in slide-in-from-top-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <input 
                      value={rejectReason} 
                      onChange={e => setRejectReason(e.target.value)} 
                      placeholder="Specify failure reason..." 
                      className="flex-1 bg-[#0b1311] border border-rose-500/20 text-white rounded-xl h-12 px-4 focus:outline-none focus:border-rose-500 transition-all text-sm"
                    />
                    <button className="bg-rose-600 hover:bg-rose-500 text-white h-12 px-8 font-bold rounded-xl" onClick={() => handleAction(doc.id, 'reject')}>
                      Finalize Rejection
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
