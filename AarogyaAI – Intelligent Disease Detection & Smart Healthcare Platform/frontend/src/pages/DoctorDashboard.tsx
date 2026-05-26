import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  MoreVertical,
  ArrowUpRight,
  ShieldCheck,
  Video,
  Hospital,
  Zap,
  Info
} from 'lucide-react'
import { formatDate } from '../lib/utils'

export function DoctorDashboard() {
  const { token, user } = useAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats] = useState({
    totalPatients: 142,
    todayAppointments: 8,
    completionRate: '94%',
    revenue: '₹12.4k'
  })

  const loadAppointments = async () => {
    if (!token) return
    try {
      const data = await api.listDoctorAppointments(token)
      setAppointments(data)
    } catch (err) {
      console.error('Failed to load appointments', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAppointments() }, [token])

  const updateStatus = async (id: number, status: string) => {
    if (!token) return
    try {
      await api.updateAppointmentStatus(token, id, status)
      await loadAppointments()
    } catch (err) {
      console.error('Failed to update status', err)
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/50 p-8 rounded-3xl border border-border backdrop-blur-xl relative overflow-hidden group shadow-sm">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/[0.05] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:scale-110 transition-all duration-1000" />
         
         <div className="relative z-10">
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Clinical Control Node</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight heading-font mt-1 emerald-gradient-text">Welcome, {user?.full_name || 'Doctor'}</h1>
            <p className="text-muted-foreground text-xs mt-1 italic font-mono">Your clinical queue is synchronized. 8 nodes active for today.</p>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Clinical Reach', value: stats.totalPatients, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Active Sessions', value: stats.todayAppointments, icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Success Index', value: stats.completionRate, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Clinical Revenue', value: stats.revenue, icon: Activity, color: 'text-primary', bg: 'bg-primary/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-card/50 border border-border backdrop-blur-xl p-6 rounded-2xl group hover:border-primary/30 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="size-5" />
              </div>
              <ArrowUpRight className="size-4 text-muted-foreground/20 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-foreground heading-font mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        {/* Appointments Queue */}
        <div className="bg-card/50 border border-border backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border/50 flex items-center justify-between">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Clinical Queue</h3>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live Sync</span>
            </div>
          </div>
          
          <div className="divide-y divide-border/50">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-8 animate-pulse flex gap-6">
                   <div className="h-12 w-12 rounded-xl bg-secondary" />
                   <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 bg-secondary rounded" />
                      <div className="h-3 w-48 bg-secondary rounded" />
                   </div>
                </div>
              ))
            ) : appointments.length === 0 ? (
              <div className="p-20 text-center">
                 <Calendar className="size-12 text-muted-foreground/10 mx-auto mb-4" />
                 <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No Active Appointments</p>
              </div>
            ) : (
              appointments.map((a) => (
                <div key={a.id} className="p-6 hover:bg-primary/[0.02] transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xl shadow-inner group-hover:scale-105 transition-transform">
                        {a.user_name?.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <h4 className="text-lg font-black text-foreground heading-font">{a.user_name}</h4>
                           <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                             a.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                             a.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                             'bg-secondary text-muted-foreground border-border'
                           }`}>
                             {a.status}
                           </span>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-2">
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              <Clock className="size-3 text-primary/40" /> {a.time}
                           </div>
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              {a.type === 'Virtual' ? <Video className="size-3 text-blue-500/40" /> : <Hospital className="size-3 text-emerald-500/40" />}
                              {a.type}
                           </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {a.status === 'Pending' && (
                        <button 
                          onClick={() => updateStatus(a.id, 'Confirmed')}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                        >
                          Confirm
                        </button>
                      )}
                      {a.status === 'Confirmed' && (
                        <button 
                          onClick={() => updateStatus(a.id, 'Completed')}
                          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 active:scale-95"
                        >
                          Complete
                        </button>
                      )}
                      <button 
                        onClick={() => updateStatus(a.id, 'Cancelled')}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-xl hover:bg-destructive/5"
                      >
                        <XCircle className="size-5" />
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                        <MoreVertical className="size-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-8">
           <div className="bg-card/50 border border-border backdrop-blur-xl rounded-3xl p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 text-primary">
                 <Zap className="size-5" />
                 <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Triage Brief</h3>
              </div>
              <div className="space-y-4">
                 <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Next Subject Intel</p>
                    <p className="text-xs text-foreground/80 leading-relaxed italic">
                       "Patient shows high-risk markers in cardiac module. AI confidence at 92%. Requires immediate ECG correlation."
                    </p>
                 </div>
                 <button className="w-full bg-secondary border border-border text-foreground hover:bg-primary/5 font-bold py-3 rounded-xl text-[10px] uppercase tracking-widest transition-all">View Full Dossier</button>
              </div>
           </div>

           <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 space-y-6 text-center">
              <ShieldCheck className="size-12 text-primary mx-auto opacity-50" />
              <div>
                 <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Clinical Vault Sync</p>
                 <p className="text-xs text-muted-foreground">All patient data is end-to-end encrypted and HIPAA compliant.</p>
              </div>
              <div className="pt-4 border-t border-primary/10">
                 <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">
                    <span>Storage Node</span>
                    <span className="text-emerald-500 font-mono">ACTIVE</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
