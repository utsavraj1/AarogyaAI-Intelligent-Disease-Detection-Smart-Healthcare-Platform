import { useEffect, useState, useMemo } from 'react'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import type { Doctor, Prediction, UploadItem, User } from '../../lib/types'
import { 
  Activity, 
  Search, 
  RefreshCcw, 
  ArrowUpRight, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Lock as LockIcon 
} from 'lucide-react'
import { SectionCards } from '@/components/section-cards'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'

const MODULE_LABELS: Record<string, string> = {
  blood_cell: 'Hematology AI',
  heart: 'Cardiac Analysis',
  lung: 'Pulmonary Scan',
  parkinsons: 'Neural Vector',
  thyroid: 'Endocrine Scan',
  diabetes: 'Metabolic Audit',
}

export function OverviewPage() {
  const { token: authContextToken } = useAuth()
  const token = authContextToken || (() => {
    const stored = localStorage.getItem('aarogyaai_auth')
    return stored ? JSON.parse(stored).token : null
  })()

  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const [patients, setPatients] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    if (!token) return
    setLoading(true)
    try {
      const [docs, preds, ups, pts] = await Promise.all([
        api.listDoctors(token, new URLSearchParams()),
        api.listPredictions(token),
        api.listUploads(token),
        api.listPatients(token),
      ])
      setDoctors(docs)
      setPredictions(preds)
      setUploads(ups)
      setPatients(pts)
    } catch (err) {
      console.error("Admin data fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  const stats = useMemo(() => ({
    patients: patients.length,
    doctors: doctors.length,
    predictions: predictions.length,
    records: uploads.length
  }), [patients, doctors, predictions, uploads])

  if (loading && doctors.length === 0) return (
    <div className="flex h-[60vh] items-center justify-center bg-[#020807]">
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <div className="h-20 w-20 animate-spin rounded-full border-4 border-emerald-500/10 border-t-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]" />
          <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-8 text-emerald-500 animate-pulse" />
        </div>
        <p className="text-emerald-500 font-bold uppercase tracking-[0.3em] text-xs">Initializing Secure Core</p>
      </div>
    </div>
  )

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      {/* Context Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-emerald-100/50 dark:bg-emerald-950/20 p-8 rounded-3xl border border-emerald-900/10 dark:border-emerald-900/30 backdrop-blur-xl">
         <div>
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               <span className="text-[10px] font-bold text-emerald-600/60 dark:text-emerald-500/60 uppercase tracking-[0.2em]">Operational Overview</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight heading-font mt-1 text-emerald-950 dark:text-white">Operational Audit</h2>
            <p className="text-emerald-900/40 dark:text-emerald-100/40 text-xs mt-1 italic font-mono">System Node: 127.0.0.1 • Last Sync: {new Date().toLocaleTimeString()}</p>
         </div>
         <button onClick={fetchData} className="h-12 w-12 flex items-center justify-center bg-white/50 dark:bg-emerald-950/20 border border-emerald-900/10 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all">
            <RefreshCcw className="size-4" />
         </button>
      </div>

      <SectionCards stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <div className="bg-white/40 dark:bg-[#05110f]/40 border border-emerald-900/10 dark:border-emerald-900/30 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
             <div className="flex flex-row items-center justify-between border-b border-emerald-900/10 p-8 pb-6">
                <div>
                   <h3 className="heading-font text-xl text-emerald-950 dark:text-white font-bold tracking-tight">Diagnostic Throughput</h3>
                   <p className="text-emerald-600/40 dark:text-emerald-500/40 text-xs mt-1">Aggregated AI inference load across all nodes.</p>
                </div>
                <button className="flex items-center gap-2 text-[10px] px-4 h-8 bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-900/10 dark:border-emerald-900/20 text-emerald-600 dark:text-emerald-500 uppercase tracking-widest font-bold rounded-lg hover:bg-emerald-500/10 transition-all">
                   Real-time Feed <ArrowUpRight className="ml-2 size-3" />
                </button>
             </div>
             <ChartAreaInteractive />
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white/40 dark:bg-[#05110f]/40 border border-emerald-900/10 dark:border-emerald-900/30 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
            <div className="border-b border-emerald-900/10 p-6">
              <h3 className="text-lg heading-font font-bold text-emerald-950 dark:text-white flex items-center gap-2">
                 <Activity className="size-4 text-emerald-500" /> Neural Load Distribution
              </h3>
            </div>
            <div className="p-6 space-y-5">
               {Object.entries(MODULE_LABELS).map(([key, label]) => {
                 const count = predictions.filter(p => p.disease_module === key).length
                 const pct = predictions.length ? Math.round((count / predictions.length) * 100) : 0
                 return (
                   <div key={key} className="space-y-2">
                     <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-emerald-900/60 dark:text-emerald-100/60">
                       <span>{label}</span>
                       <span className="text-emerald-600 dark:text-emerald-500 font-mono">{count} units</span>
                     </div>
                     <div className="h-1.5 w-full bg-emerald-100 dark:bg-emerald-950/50 rounded-full overflow-hidden border border-emerald-900/10">
                       <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400" style={{ width: `${pct}%` }} />
                     </div>
                   </div>
                 )
               })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
