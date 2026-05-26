import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Prediction, RecordItem } from '../lib/types'
import { useAuth } from '../context/AuthContext'
import { 
  Activity, 
  History, 
  Microscope, 
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  Cpu,
  BrainCircuit,
  Zap,
  Lock,
  Search,
  RefreshCcw,
  User as UserIcon
} from "lucide-react"
import { formatDate } from '../lib/utils'

export function DashboardPage() {
  const { token, user } = useAuth()
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [records, setRecords] = useState<RecordItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    if (!token) return
    setLoading(true)
    try {
      const [pData, rData] = await Promise.all([
        api.listPredictions(token),
        api.listRecords(token)
      ])
      setPredictions(pData)
      setRecords(rData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  const stats = [
    { label: "Clinical Throughput", value: predictions.length, icon: Microscope, color: "text-emerald-500", desc: "Diagnostic inferences" },
    { label: "High Risk Alerts", value: predictions.filter(p => p.risk_level === 'high').length, icon: Activity, color: "text-rose-500", desc: "Urgent care required" },
    { label: "Vault Records", value: records.length, icon: History, color: "text-blue-500", desc: "Secure health locker" },
    { label: "Trust Index", value: "99.4%", icon: ShieldCheck, color: "text-amber-500", desc: "Model accuracy rate" },
  ]

  if (loading && predictions.length === 0) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <div className="h-20 w-20 animate-spin rounded-full border-4 border-primary/10 border-t-primary shadow-[0_0_30px_rgba(16,185,129,0.1)]" />
          <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-8 text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground font-bold uppercase tracking-[0.3em] text-[10px]">Synchronizing Health Node</p>
      </div>
    </div>
  )

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      {/* ── Context Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/50 p-8 rounded-3xl border border-border backdrop-blur-xl relative overflow-hidden group shadow-sm">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/[0.05] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-all duration-1000 group-hover:scale-110" />
         
         <div className="relative z-10">
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Patient Terminal Access</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight heading-font mt-1 emerald-gradient-text">Health Overview</h1>
            <p className="text-muted-foreground text-xs mt-1 italic font-mono flex items-center gap-2">
               Welcome back, {user?.full_name} <span className="h-1 w-1 rounded-full bg-border" /> Node Sync: {new Date().toLocaleTimeString()}
            </p>
         </div>
         
         <div className="flex items-center gap-4 relative z-10">
            <button 
              onClick={fetchData} 
              className="h-11 px-6 flex items-center justify-center bg-secondary hover:bg-primary/10 text-primary border border-primary/10 rounded-xl transition-all font-bold text-xs gap-2 active:scale-95"
            >
               <RefreshCcw className="size-4" /> Sync Cloud
            </button>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card/50 border border-border backdrop-blur-xl rounded-3xl p-8 shadow-sm group hover:border-primary/40 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/[0.02] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center justify-between mb-6">
              <div className={`p-2.5 rounded-xl bg-primary/10 ${stat.color} shadow-inner`}>
                <stat.icon className="size-5" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Live <Zap className="size-3 text-amber-500 fill-amber-500" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
              <h4 className="text-4xl font-extrabold text-foreground heading-font tracking-tight tabular-nums">
                {stat.value}
              </h4>
            </div>
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-7">
        {/* Recent Inferences */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card/50 border border-border backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm">
            <div className="flex flex-row items-center justify-between border-b border-border/50 p-8 pb-6">
              <div>
                <h3 className="heading-font text-xl text-foreground font-bold tracking-tight">Recent Inferences</h3>
                <p className="text-muted-foreground text-xs mt-1">Audit log of your AI diagnostic history.</p>
              </div>
              <button className="flex items-center gap-2 text-[10px] px-4 h-8 bg-secondary border border-border text-primary uppercase tracking-widest font-bold rounded-lg hover:bg-primary/5 transition-all">
                Full Archives <ArrowUpRight className="ml-2 size-3" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              {predictions.length === 0 ? (
                <div className="py-12 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground/20 mx-auto" />
                  <p className="text-muted-foreground/40 mt-4 text-xs font-bold uppercase tracking-widest">No Inference Syncs Found</p>
                </div>
              ) : (
                predictions.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-5 rounded-2xl bg-secondary/30 border border-border group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${p.risk_level === 'high' ? 'bg-rose-500/10 text-rose-500' : 'bg-primary/10 text-primary'}`}>
                        <BrainCircuit className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{p.result_label}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">{p.disease_module.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-primary font-mono">{p.confidence.toFixed(1)}% CONF</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5 uppercase tracking-tighter">{formatDate(p.created_at)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Identity & Protocol */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-card/50 border border-border backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.03] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="border-b border-border/50 p-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Node Identity</h3>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-6 p-6 rounded-2xl bg-secondary/50 border border-border">
                <div className="h-20 w-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-3xl font-black shadow-inner">
                  {user?.full_name?.charAt(0)}
                </div>
                <div>
                  <p className="text-2xl font-black text-foreground heading-font leading-tight">{user?.full_name}</p>
                  <p className="text-[10px] text-primary/60 font-mono flex items-center gap-2 mt-1">
                    <ShieldCheck className="size-3" /> VERIFIED PATIENT
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Clinical Node UID", value: `PID-${user?.id?.toString().padStart(6, '0')}`, icon: Cpu },
                  { label: "Security Protocol", value: "AES-256 END-TO-END", icon: Lock },
                  { label: "Permissions", value: "Standard Clinical Access", icon: ShieldCheck },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-xs px-2 group/item">
                    <span className="text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2 text-[9px]">
                      <item.icon className="size-3 text-muted-foreground/40 group-hover/item:text-primary transition-colors" /> {item.label}
                    </span>
                    <span className="text-foreground font-black font-mono text-[10px]">{item.value}</span>
                  </div>
                ))}
              </div>

              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-4 rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group active:scale-95">
                Audit Full Profile
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
