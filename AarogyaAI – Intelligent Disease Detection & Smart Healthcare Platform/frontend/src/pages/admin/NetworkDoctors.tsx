import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import type { Doctor } from '../../lib/types'
import { 
  Stethoscope, 
  Search, 
  RefreshCcw, 
  MoreVertical,
  Building2,
  Star
} from 'lucide-react'

export function NetworkDoctorsPage() {
  const { token: authContextToken } = useAuth()
  const token = authContextToken || (() => {
    const stored = localStorage.getItem('aarogyaai_auth')
    return stored ? JSON.parse(stored).token : null
  })()

  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchData = async () => {
    if (!token) return
    setLoading(true)
    try {
      const docs = await api.listDoctors(token, new URLSearchParams())
      setDoctors(docs)
    } catch (err) {
      console.error("Admin data fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  const filteredDocs = doctors.filter(d => 
    (d.name || d.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-emerald-950/20 p-8 rounded-3xl border border-emerald-900/30 backdrop-blur-xl">
         <div>
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-[0.2em]">Medical Faculty</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight heading-font mt-1 text-white">Professional Faculty</h2>
            <p className="text-emerald-100/40 text-xs mt-1 italic">Verified specialists and partner institutions.</p>
         </div>
         
         <div className="flex items-center gap-4">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-emerald-500/30 group-focus-within:text-emerald-400 transition-colors" />
               <input 
                 placeholder="Search Specialists..." 
                 className="pl-11 bg-emerald-950/40 border border-emerald-900/30 text-white placeholder:text-emerald-900 rounded-xl h-12 w-64 focus:outline-none focus:border-emerald-500/50 transition-all text-sm"
                 value={search}
                 onChange={e => setSearch(e.target.value)}
               />
            </div>
            <button onClick={fetchData} className="h-12 w-12 flex items-center justify-center bg-emerald-950/20 border border-emerald-900/30 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all">
               <RefreshCcw className="size-4" />
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDocs.map(d => (
          <div key={d.id} className="bg-[#05110f]/40 border border-emerald-900/30 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl group hover:border-emerald-500/40 transition-all duration-500 p-6 space-y-6">
            <div className="flex items-center gap-4">
               <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner group-hover:scale-110 transition-transform">
                 <Stethoscope className="size-7" />
               </div>
               <div className="flex-1 min-w-0">
                 <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight truncate">{d.name || d.full_name}</h4>
                 <p className="text-[10px] font-bold text-emerald-500/40 uppercase tracking-widest truncate">{d.specialty}</p>
               </div>
               <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                  <Star className="size-3 fill-amber-500" />
                  <span className="text-xs font-bold">{d.rating}</span>
               </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-emerald-100/60 font-medium">
                 <Building2 className="size-3.5 text-emerald-500/40" />
                 <span className="truncate">{d.hospital}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-emerald-900/10">
                 <div className="space-y-0.5">
                    <p className="text-[9px] font-bold text-emerald-500/30 uppercase tracking-widest">Experience</p>
                    <p className="text-sm font-bold text-white">{d.experience_yrs} Years</p>
                 </div>
                 <button className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] hover:text-emerald-400 transition-colors">
                    Clinical Dossier →
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
