import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import type { Prediction } from '../../lib/types'
import { 
  BarChart3, 
  RefreshCcw, 
  ArrowUpRight,
  TrendingUp,
  PieChart,
  Activity
} from 'lucide-react'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'

export function StatisticsPage() {
  const { token: authContextToken } = useAuth()
  const token = authContextToken || (() => {
    const stored = localStorage.getItem('aarogyaai_auth')
    return stored ? JSON.parse(stored).token : null
  })()

  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    if (!token) return
    setLoading(true)
    setTimeout(() => setLoading(false), 500) // Mock sync
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
               <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-[0.2em]">Data Analytics</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight heading-font mt-1 text-white">System Statistics</h2>
            <p className="text-emerald-100/40 text-xs mt-1 italic">Network performance and diagnostic trending.</p>
         </div>
         <button onClick={fetchData} className="h-12 w-12 flex items-center justify-center bg-emerald-950/20 border border-emerald-900/30 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all">
            <RefreshCcw className="size-4" />
         </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         <div className="xl:col-span-2 space-y-8">
            <div className="bg-[#05110f]/40 border border-emerald-900/30 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
               <div className="p-8 border-b border-emerald-900/10 flex items-center justify-between">
                  <div>
                     <h3 className="text-xl font-bold text-white heading-font tracking-tight">Throughput Velocity</h3>
                     <p className="text-xs text-emerald-500/40">Real-time inference load across global nodes.</p>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/5 px-3 py-1.5 rounded-lg border border-emerald-400/10">
                     <TrendingUp className="size-4" />
                     <span className="text-xs font-bold">+24% Increase</span>
                  </div>
               </div>
               <ChartAreaInteractive />
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-[#05110f]/40 border border-emerald-900/30 backdrop-blur-xl rounded-3xl p-8 space-y-6">
               <h3 className="text-lg font-bold text-white heading-font flex items-center gap-3">
                  <PieChart className="size-4 text-emerald-500" /> Accuracy Benchmarks
               </h3>
               <div className="space-y-6">
                  {[
                    { label: 'CNN Accuracy', val: '98.2%', color: 'emerald' },
                    { label: 'XGBoost Precision', val: '94.5%', color: 'emerald' },
                    { label: 'BERT Entity Match', val: '91.8%', color: 'indigo' },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                       <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-emerald-100/60">
                          <span>{item.label}</span>
                          <span className="text-emerald-500">{item.val}</span>
                       </div>
                       <div className="h-1.5 w-full bg-emerald-950/50 rounded-full overflow-hidden border border-emerald-900/10">
                          <div className={`h-full bg-${item.color}-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] w-[90%]`} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-[#05110f]/40 border border-emerald-900/30 backdrop-blur-xl rounded-3xl p-8 space-y-6">
               <h3 className="text-lg font-bold text-white heading-font flex items-center gap-3">
                  <Activity className="size-4 text-emerald-500" /> Network Health
               </h3>
               <div className="flex items-center justify-center py-4">
                  <div className="relative">
                     <div className="h-32 w-32 rounded-full border-4 border-emerald-500/10 flex items-center justify-center">
                        <div className="text-center">
                           <p className="text-2xl font-extrabold text-white">99.9%</p>
                           <p className="text-[8px] font-bold text-emerald-500/40 uppercase tracking-widest">Uptime</p>
                        </div>
                     </div>
                     <svg className="absolute top-0 left-0 h-32 w-32 -rotate-90">
                        <circle cx="64" cy="64" r="62" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="390" strokeDashoffset="40" className="opacity-20" />
                     </svg>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
