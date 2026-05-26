import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import type { UploadItem, Prediction } from '../../lib/types'
import { 
  Database as DbIcon, 
  RefreshCcw, 
  Search, 
  Clock, 
  HardDrive,
  FileText,
  Activity,
  MoreVertical
} from 'lucide-react'

const MODULE_LABELS: Record<string, string> = {
  blood_cell: 'Hematology AI',
  heart: 'Cardiac Analysis',
  lung: 'Pulmonary Scan',
  parkinsons: 'Neural Vector',
  thyroid: 'Endocrine Scan',
  diabetes: 'Metabolic Audit',
}

export function DatabasePage() {
  const { token: authContextToken } = useAuth()
  const token = authContextToken || (() => {
    const stored = localStorage.getItem('aarogyaai_auth')
    return stored ? JSON.parse(stored).token : null
  })()

  const [uploads, setUploads] = useState<UploadItem[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    if (!token) return
    setLoading(true)
    try {
      const [ups, preds] = await Promise.all([
        api.listUploads(token),
        api.listPredictions(token)
      ])
      setUploads(ups)
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
               <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-[0.2em]">Data Mesh</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight heading-font mt-1 text-white">Central Archives</h2>
            <p className="text-emerald-100/40 text-xs mt-1 italic font-mono">Managed Clinical Records & Inference Logs.</p>
         </div>
         <button onClick={fetchData} className="h-12 w-12 flex items-center justify-center bg-emerald-950/20 border border-emerald-900/30 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all">
            <RefreshCcw className="size-4" />
         </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
         {[
           { label: 'Total Records', val: uploads.length, icon: FileText, color: 'emerald' },
           { label: 'Inference Logs', val: predictions.length, icon: Activity, color: 'indigo' },
           { label: 'Mesh Storage', val: '1.2 GB', icon: HardDrive, color: 'amber' },
           { label: 'Active Nodes', val: '12', icon: DbIcon, color: 'emerald' },
         ].map((stat) => (
           <div key={stat.label} className="bg-[#05110f]/40 border border-emerald-900/30 p-6 rounded-3xl space-y-2 group hover:border-emerald-500/40 transition-all">
              <div className={`p-2 w-fit rounded-xl bg-emerald-500/5 text-${stat.color}-500`}>
                 <stat.icon className="size-4" />
              </div>
              <p className="text-[9px] font-bold text-emerald-500/30 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-extrabold text-white heading-font">{stat.val}</p>
           </div>
         ))}
      </div>

      <div className="bg-[#05110f]/40 border border-emerald-900/30 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
        <div className="border-b border-emerald-900/10 py-6 px-8 flex items-center justify-between">
           <h3 className="text-xl font-bold heading-font text-white">Recent Inferences</h3>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-emerald-950/20">
              <tr className="border-b border-emerald-900/10">
                <th className="text-emerald-500/60 font-extrabold uppercase tracking-[0.2em] text-[9px] pl-8 py-4">Timestamp</th>
                <th className="text-emerald-500/60 font-extrabold uppercase tracking-[0.2em] text-[9px] py-4">Module</th>
                <th className="text-emerald-500/60 font-extrabold uppercase tracking-[0.2em] text-[9px] py-4">Confidence</th>
                <th className="text-emerald-500/60 font-extrabold uppercase tracking-[0.2em] text-[9px] py-4">Risk Level</th>
                <th className="text-right text-emerald-500/60 font-extrabold uppercase tracking-[0.2em] text-[9px] pr-8 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map(p => (
                <tr key={p.id} className="border-b border-emerald-900/5 hover:bg-emerald-500/5 transition-all">
                  <td className="pl-8 py-4 text-[10px] font-mono text-emerald-100/80">
                    {new Date(p.created_at).toLocaleString()}
                  </td>
                  <td className="font-bold text-white text-sm">{MODULE_LABELS[p.disease_module] || p.disease_module}</td>
                  <td>
                    <div className="flex items-center gap-2">
                       <div className="h-1 w-12 bg-emerald-950 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${p.confidence}%` }} />
                       </div>
                       <span className="text-[10px] font-mono text-emerald-400 font-bold">{p.confidence.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                      p.risk_level === 'high' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 
                      'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    }`}>
                      {p.risk_level}
                    </span>
                  </td>
                  <td className="text-right pr-8">
                    <button className="text-emerald-500/30 hover:text-emerald-400">
                      <MoreVertical className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
