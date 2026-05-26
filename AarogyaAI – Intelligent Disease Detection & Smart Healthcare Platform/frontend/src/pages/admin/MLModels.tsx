import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import type { Prediction } from '../../lib/types'
import { 
  Cpu, 
  RefreshCcw, 
  Activity, 
  ShieldCheck, 
  Database,
  Lock,
  ArrowUpRight
} from 'lucide-react'

const MODULE_LABELS: Record<string, string> = {
  blood_cell: 'Hematology AI',
  heart: 'Cardiac Analysis',
  lung: 'Pulmonary Scan',
  parkinsons: 'Neural Vector',
  thyroid: 'Endocrine Scan',
  diabetes: 'Metabolic Audit',
}

const MODULE_DESC: Record<string, string> = {
  blood_cell: 'Cellular morphology and hematological anomaly detection.',
  heart: 'Cardiovascular risk assessment and ECG vector analysis.',
  lung: 'Pulmonary imaging and restrictive/obstructive pattern recognition.',
  parkinsons: 'Neural tremor analysis and kinetic vector tracing.',
  thyroid: 'Endocrine hormonal balance and glandular imaging.',
  diabetes: 'Metabolic marker auditing and glycemic prediction.',
}

export function MLModelsPage() {
  const { token: authContextToken } = useAuth()
  const token = authContextToken || (() => {
    const stored = localStorage.getItem('aarogyaai_auth')
    return stored ? JSON.parse(stored).token : null
  })()

  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    if (!token) return
    setLoading(true)
    try {
      const preds = await api.listPredictions(token)
      setPredictions(preds)
    } catch (err) {
      console.error("Admin data fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-emerald-950/20 p-8 rounded-3xl border border-emerald-900/30 backdrop-blur-xl">
         <div>
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-[0.2em]">Neural Infrastructure</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight heading-font mt-1 text-white">ML Model Registry</h2>
            <p className="text-emerald-100/40 text-xs mt-1 italic">Status and performance metrics of diagnostic cores.</p>
         </div>
         <button onClick={fetchData} className="h-12 w-12 flex items-center justify-center bg-emerald-950/20 border border-emerald-900/30 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all">
            <RefreshCcw className="size-4" />
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(MODULE_LABELS).map(([key, label]) => {
          const count = predictions.filter(p => p.disease_module === key).length
          const avgConf = predictions.length 
            ? predictions.filter(p => p.disease_module === key).reduce((acc, p) => acc + p.confidence, 0) / (count || 1)
            : 0

          return (
            <div key={key} className="bg-[#05110f]/40 border border-emerald-900/30 backdrop-blur-xl rounded-3xl p-6 space-y-6 hover:border-emerald-500/40 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
              
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                   <Cpu className="size-6" />
                </div>
                <div>
                   <h4 className="font-bold text-white text-lg tracking-tight">{label}</h4>
                   <p className="text-[10px] font-bold text-emerald-500/40 uppercase tracking-widest mt-1">Version 2.4.1 Stable</p>
                </div>
                <p className="text-xs text-emerald-100/60 leading-relaxed min-h-[40px]">{MODULE_DESC[key]}</p>
              </div>

              <div className="space-y-4 pt-6 border-t border-emerald-900/10">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-500/30 uppercase tracking-widest">Inference Load</span>
                    <span className="text-sm font-bold text-white font-mono">{count} UNIT</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-500/30 uppercase tracking-widest">Precision Index</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">{avgConf.toFixed(1)}%</span>
                 </div>
                 <div className="h-1 w-full bg-emerald-950/50 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${avgConf}%` }} />
                 </div>
              </div>

              <button className="w-full h-10 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-[10px] font-bold text-emerald-500 uppercase tracking-widest hover:bg-emerald-500/10 transition-all">
                 Audit Neural Weights →
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
