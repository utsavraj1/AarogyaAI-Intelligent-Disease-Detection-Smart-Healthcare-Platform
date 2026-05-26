import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  ChevronRight, 
  Plus, 
  Activity, 
  CheckCircle2, 
  Clock3,
  Video,
  Hospital,
  Zap,
  MoreVertical,
  Filter
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '../lib/utils'

export function AppointmentsPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  
  // Simulated appointment data for demonstration
  const [appointments] = useState([
    {
      id: 1,
      doctor_name: "Dr. Arvind Sharma",
      specialty: "Cardiologist",
      date: "2026-05-15",
      time: "10:30 AM",
      type: "In-Person",
      status: "upcoming",
      hospital: "City Heart Center"
    },
    {
      id: 2,
      doctor_name: "Dr. Neha Kapoor",
      specialty: "Neurologist",
      date: "2026-05-20",
      time: "02:15 PM",
      type: "Virtual",
      status: "upcoming",
      hospital: "Online Consult"
    },
    {
      id: 3,
      doctor_name: "Dr. Rajesh Varma",
      specialty: "Oncologist",
      date: "2026-04-28",
      time: "09:00 AM",
      type: "In-Person",
      status: "completed",
      hospital: "Cancer Care Institute"
    }
  ])

  useEffect(() => {
    // In a real app, fetch from API
    setTimeout(() => setLoading(false), 800)
  }, [token])

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
       <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/10 border-t-primary" />
    </div>
  )

  const upcoming = appointments.filter(a => a.status === 'upcoming')
  const past = appointments.filter(a => a.status === 'completed')

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/50 p-8 rounded-3xl border border-border backdrop-blur-xl relative overflow-hidden group shadow-sm">
         <div className="relative z-10">
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Patient Scheduler</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight heading-font mt-1 emerald-gradient-text">My Appointments</h1>
            <p className="text-muted-foreground text-xs mt-1 italic font-mono">Manage your clinical consultations and diagnostic sessions.</p>
         </div>
         
         <button 
           onClick={() => navigate('/doctors')}
           className="relative z-10 h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all shadow-xl shadow-primary/20 font-black text-xs flex items-center gap-2 active:scale-95"
         >
            <Plus className="size-4" /> Book New Session
         </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-8">
           <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Upcoming Cycles</h3>
                 <button className="text-[10px] text-primary font-bold uppercase tracking-widest flex items-center gap-1 hover:underline">
                    <Filter className="size-3" /> Filter Node
                 </button>
              </div>
              
              <div className="space-y-4">
                 {upcoming.length === 0 ? (
                    <div className="p-12 text-center bg-card/30 border border-dashed border-border rounded-3xl">
                       <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">No Scheduled Nodes Found</p>
                    </div>
                 ) : (
                    upcoming.map((a) => (
                       <div key={a.id} className="bg-card/50 border border-border backdrop-blur-xl rounded-3xl p-6 hover:border-primary/40 transition-all group relative overflow-hidden">
                          <div className="flex flex-col md:flex-row gap-6">
                             <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xl shrink-0 group-hover:scale-105 transition-transform">
                                {a.doctor_name.replace('Dr. ', '').charAt(0)}
                             </div>
                             
                             <div className="flex-1 space-y-3">
                                <div className="flex justify-between items-start">
                                   <div>
                                      <h4 className="text-lg font-black text-foreground heading-font">{a.doctor_name}</h4>
                                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{a.specialty}</p>
                                   </div>
                                   <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${a.type === 'Virtual' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                                      {a.type === 'Virtual' ? <Video className="size-3" /> : <Hospital className="size-3" />}
                                      {a.type}
                                   </div>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                   <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                      <Calendar className="size-3.5 text-primary/40" /> {formatDate(a.date)}
                                   </div>
                                   <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                      <Clock3 className="size-3.5 text-primary/40" /> {a.time}
                                   </div>
                                   <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium md:col-span-1 col-span-2">
                                      <MapPin className="size-3.5 text-primary/40" /> {a.hospital}
                                   </div>
                                </div>
                             </div>
                             
                             <div className="flex flex-row md:flex-col justify-end gap-2">
                                <button className="px-4 py-2 bg-secondary border border-border text-foreground hover:bg-primary/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Reschedule</button>
                                <button className="p-2.5 text-muted-foreground hover:text-destructive transition-colors"><MoreVertical className="size-4" /></button>
                             </div>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>

           <div className="space-y-4 pt-4">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2">Clinical History</h3>
              <div className="space-y-3">
                 {past.map((a) => (
                    <div key={a.id} className="bg-secondary/30 border border-border rounded-2xl p-4 flex items-center justify-between opacity-70 hover:opacity-100 transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground font-bold text-xs">
                             {a.doctor_name.replace('Dr. ', '').charAt(0)}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-foreground">{a.doctor_name}</p>
                             <p className="text-[9px] text-muted-foreground uppercase tracking-widest">{formatDate(a.date)} • {a.specialty}</p>
                          </div>
                       </div>
                       <button className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-widest group-hover:underline">
                          View Summary <ChevronRight className="size-3" />
                       </button>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-8">
           <div className="bg-card/50 border border-border backdrop-blur-xl rounded-3xl p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                 <Zap className="size-5 text-amber-500" />
                 <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Diagnostic Prep</h3>
              </div>
              <div className="space-y-4">
                 <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-bold leading-relaxed">
                       Please ensure your Health Locker vitals are updated 24 hours before any scheduled consultation for accurate AI baseline comparison.
                    </p>
                 </div>
                 <ul className="space-y-3">
                    {[
                      "Update BMI and Blood Pressure",
                      "Sync recent lab reports",
                      "Prepare medical history brief",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                         <div className="h-1.5 w-1.5 rounded-full bg-primary/40" /> {item}
                      </li>
                    ))}
                 </ul>
              </div>
           </div>

           <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 text-center space-y-4">
              <Activity className="size-10 text-primary mx-auto opacity-50" />
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Telemedicine Sync</p>
              <h4 className="text-sm font-bold text-foreground">Need immediate consultation?</h4>
              <p className="text-xs text-muted-foreground px-4">Our virtual triage nodes are active 24/7 for urgent clinical evaluation.</p>
              <button className="w-full bg-primary text-primary-foreground font-black py-3 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95">Enter Triage Node</button>
           </div>
        </div>
      </div>
    </div>
  )
}
