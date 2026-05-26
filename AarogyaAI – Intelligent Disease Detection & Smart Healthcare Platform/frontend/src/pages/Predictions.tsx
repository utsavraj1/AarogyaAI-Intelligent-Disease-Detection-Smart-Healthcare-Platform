import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import type { Prediction } from '../lib/types'
import { useAuth } from '../context/AuthContext'
import { formatDate, toTitle } from '../lib/utils'
import { FileText, Download, Activity, AlertTriangle, CheckCircle2, Search, Filter, Clock, ArrowUpRight } from 'lucide-react'

export function PredictionsPage() {
  const { token } = useAuth()
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!token) return
      setLoading(true)
      try {
        const data = await api.listPredictions(token)
        setPredictions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load predictions')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  const stats = useMemo(() => {
    const total = predictions.length
    const high = predictions.filter((item) => item.risk_level === 'high').length
    const moderate = predictions.filter((item) => item.risk_level === 'moderate').length
    const low = total - high - moderate
    return { total, high, moderate, low }
  }, [predictions])

  const download = async (prediction: Prediction) => {
    if (!token) return
    const blob = await api.downloadReport(token, prediction.id)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `HonestIQ_Report_${prediction.id}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading && predictions.length === 0) return (
    <div className="flex h-[40vh] items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
    </div>
  )

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-emerald-950/20 p-8 rounded-3xl border border-emerald-900/30 backdrop-blur-xl relative overflow-hidden group">
         <div className="relative z-10">
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-[0.2em]">Clinical Records</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight heading-font mt-1 text-white">Diagnostic Archives</h1>
            <p className="text-emerald-100/40 text-xs mt-1 italic font-mono">Immutable ledger of AI inferences and clinical outcomes.</p>
         </div>
      </div>

      {/* Stats Mini Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Syncs', value: stats.total, icon: Activity, color: 'emerald' },
          { label: 'Critical Risk', value: stats.high, icon: AlertTriangle, color: 'rose' },
          { label: 'Moderate Risk', value: stats.moderate, icon: AlertTriangle, color: 'amber' },
          { label: 'Stable Scan', value: stats.low, icon: CheckCircle2, color: 'emerald' },
        ].map((item) => (
          <div key={item.label} className="bg-[#05110f]/40 border border-emerald-900/30 backdrop-blur-xl rounded-2xl p-6 group hover:border-emerald-500/40 transition-all">
            <p className="text-[10px] font-bold text-emerald-500/40 uppercase tracking-widest">{item.label}</p>
            <div className="mt-2 flex items-center justify-between">
              <h4 className="text-2xl font-black text-white">{item.value}</h4>
              <item.icon className={`size-4 text-${item.color}-500/60`} />
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold flex items-center gap-3">
          <AlertTriangle className="size-4" /> {error}
        </div>
      )}

      {/* Registry Table */}
      <div className="bg-[#05110f]/40 border border-emerald-900/30 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-emerald-950/20">
              <tr className="border-b border-emerald-900/10">
                <th className="text-emerald-500/60 font-extrabold uppercase tracking-[0.2em] text-[9px] pl-8 py-4">Inference Identity</th>
                <th className="text-emerald-500/60 font-extrabold uppercase tracking-[0.2em] text-[9px] py-4">Clinical Module</th>
                <th className="text-emerald-500/60 font-extrabold uppercase tracking-[0.2em] text-[9px] py-4">Confidence Index</th>
                <th className="text-emerald-500/60 font-extrabold uppercase tracking-[0.2em] text-[9px] py-4">Risk Level</th>
                <th className="text-right text-emerald-500/60 font-extrabold uppercase tracking-[0.2em] text-[9px] pr-8 py-4">Dossier</th>
              </tr>
            </thead>
            <tbody>
              {predictions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <p className="text-emerald-500/20 font-bold uppercase tracking-widest text-sm">Registry is Empty</p>
                  </td>
                </tr>
              ) : (
                predictions.map((item) => (
                  <tr key={item.id} className="border-b border-emerald-900/5 hover:bg-emerald-500/5 transition-all group">
                    <td className="pl-8 py-6">
                      <div className="flex items-center gap-3">
                         <Clock className="size-3 text-emerald-500/40" />
                         <p className="text-[10px] font-mono text-emerald-100/80">
                            {formatDate(item.created_at)}
                         </p>
                      </div>
                    </td>
                    <td>
                      <div className="space-y-0.5">
                        <p className="font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight">{item.result_label}</p>
                        <p className="text-[9px] font-bold text-emerald-500/40 uppercase tracking-widest">{toTitle(item.disease_module)}</p>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                         <div className="h-1.5 w-16 rounded-full bg-emerald-950/50 border border-emerald-900/10 overflow-hidden">
                            <div className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: `${item.confidence}%` }} />
                         </div>
                         <span className="text-[10px] font-mono text-emerald-400 font-bold">{item.confidence.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td>
                      <span 
                        className={`px-3 py-1 rounded-full border text-[8px] font-extrabold uppercase tracking-widest ${
                          item.risk_level === 'high' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                          item.risk_level === 'moderate' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                          'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        }`}
                      >
                        {item.risk_level}
                      </span>
                    </td>
                    <td className="text-right pr-8">
                      {item.report_path && (
                        <button 
                          onClick={() => download(item)}
                          className="text-emerald-500 hover:text-emerald-400 p-2 rounded-lg hover:bg-emerald-500/10 transition-all flex items-center gap-2 ml-auto text-[10px] font-bold uppercase tracking-widest"
                        >
                          <Download className="size-3.5" /> PDF
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
