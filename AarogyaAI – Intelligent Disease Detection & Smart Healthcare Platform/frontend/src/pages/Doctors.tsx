import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import type { Doctor } from '../lib/types'
import { useAuth } from '../context/AuthContext'
import { 
  Stethoscope, 
  MapPin, 
  Search, 
  Building2, 
  Clock, 
  Star, 
  Wallet, 
  Filter, 
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react'

const specialties = ['All', 'Oncologist', 'Cardiologist', 'Pulmonologist', 'Neurologist', 'Endocrinologist', 'General Physician']
const diseaseMap: Record<string, string> = {
  'Blood Cell Cancer': 'blood_cell_cancer',
  'Heart Disease': 'heart_disease',
  'Lung Cancer': 'lung_cancer',
  "Parkinson's Disease": 'parkinsons',
  'Thyroid Disorder': 'thyroid',
  Diabetes: 'diabetes',
}

export function DoctorsPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filters, setFilters] = useState({ specialty: specialties[0], city: '', disease: 'Any' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadDoctors = async () => {
    if (!token) return
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.specialty !== 'All') params.append('specialty', filters.specialty)
    if (filters.city) params.append('city', filters.city)
    if (filters.disease !== 'Any') params.append('disease_module', diseaseMap[filters.disease])

    try {
      const data = await api.listDoctors(token, params)
      setDoctors(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load doctors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadDoctors() }, [token])

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/50 p-8 rounded-3xl border border-border backdrop-blur-xl relative overflow-hidden group shadow-sm">
         <div className="relative z-10">
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Medical Faculty</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight heading-font mt-1 emerald-gradient-text">Specialist Network</h1>
            <p className="text-muted-foreground text-xs mt-1 italic font-mono">Connect with verified clinical experts for targeted diagnostic evaluation.</p>
         </div>
      </div>

      {/* Filters */}
      <div className="bg-card/50 border border-border backdrop-blur-xl rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
           <Filter className="size-4 text-primary" />
           <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Search Filters</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <select
            value={filters.specialty}
            onChange={(e) => setFilters((p) => ({ ...p, specialty: e.target.value }))}
            className="bg-secondary/50 border border-border text-foreground rounded-xl h-12 px-4 focus:outline-none focus:border-primary/50 transition-all text-sm"
          >
            {specialties.map((item) => <option key={item} value={item} className="bg-background">{item}</option>)}
          </select>
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/20 group-focus-within:text-primary transition-colors" />
            <input
              value={filters.city}
              onChange={(e) => setFilters((p) => ({ ...p, city: e.target.value }))}
              className="w-full pl-11 bg-secondary/50 border border-border text-foreground rounded-xl h-12 px-4 focus:outline-none focus:border-primary/50 transition-all text-sm"
              placeholder="City (e.g. Delhi)"
            />
          </div>
          <select
            value={filters.disease}
            onChange={(e) => setFilters((p) => ({ ...p, disease: e.target.value }))}
            className="bg-secondary/50 border border-border text-foreground rounded-xl h-12 px-4 focus:outline-none focus:border-primary/50 transition-all text-sm"
          >
            <option value="Any" className="bg-background">Any Condition</option>
            {Object.keys(diseaseMap).map((item) => <option key={item} value={item} className="bg-background">{item}</option>)}
          </select>
          <button onClick={loadDoctors} className="bg-primary hover:bg-primary/90 text-primary-foreground font-black h-12 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95">
            <Search className="size-4" /> Apply Node Filters
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold">{error}</div>
      )}

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading && doctors.length === 0 ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 bg-secondary/50 rounded-3xl animate-pulse border border-border" />
          ))
        ) : doctors.length === 0 ? (
          <div className="col-span-full py-20 text-center">
             <Stethoscope className="size-16 text-muted-foreground/10 mx-auto mb-4" />
             <p className="text-muted-foreground/40 font-bold uppercase tracking-widest text-sm">No Specialists Found in this Node</p>
          </div>
        ) : (
          doctors.map((doc) => (
            <div 
              key={doc.id} 
              onClick={() => navigate(`/doctors/${doc.id}`)}
              className="bg-card/50 border border-border backdrop-blur-xl rounded-3xl p-8 shadow-sm group hover:border-primary/40 transition-all relative overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                 <ShieldCheck className="size-5 text-emerald-500" />
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                 <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-2xl shadow-inner group-hover:scale-110 transition-transform">
                    {doc.name.replace('Dr. ', '').charAt(0)}
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-foreground heading-font leading-tight">Dr. {doc.name.replace('Dr. ', '')}</h3>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">{doc.specialty}</p>
                 </div>
              </div>

              <div className="space-y-3 mb-8">
                 <div className="flex items-center gap-3 text-muted-foreground text-xs font-medium">
                    <Building2 className="size-3.5 text-primary/40" /> {doc.hospital || 'Private Practice'}
                 </div>
                 <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2">
                       <Star className="size-3 text-amber-500 fill-amber-500" />
                       <span className="text-xs font-black text-foreground">{doc.rating ?? '5.0'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Award className="size-3 text-primary/40" />
                       <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{doc.experience_yrs ?? '10'}Y EXP</span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border/50">
                 <div className="flex items-center gap-2">
                    <Wallet className="size-3.5 text-muted-foreground/40" />
                    <span className="text-sm font-black text-foreground">₹{doc.fee_inr || '1500'}</span>
                 </div>
                 <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">
                    View Dossier <ChevronRight className="size-3" />
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
