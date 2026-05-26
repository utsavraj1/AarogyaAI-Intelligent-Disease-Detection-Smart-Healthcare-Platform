import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  Lock, 
  Terminal, 
  Activity,
  Zap,
  HardDrive
} from 'lucide-react'

export function LogsPage() {
  const logs = [
    { time: '14:22:01', event: 'Neural Core Vector Sync', status: 'SUCCESS', node: 'INF-01' },
    { time: '14:21:45', event: 'Database Mesh Sharding', status: 'OPTIMAL', node: 'DB-04' },
    { time: '14:20:12', event: 'Auth Gateway Handshake', status: 'ENCRYPTED', node: 'GATE-01' },
    { time: '14:18:33', event: 'Clinical Asset Decryption', status: 'SUCCESS', node: 'VAULT-02' },
    { time: '14:15:00', event: 'System Node Heartbeat', status: 'ALIVE', node: 'CORE-01' },
  ]

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-emerald-950/20 p-8 rounded-3xl border border-emerald-900/30 backdrop-blur-xl">
         <div>
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-[0.2em]">System Health</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight heading-font mt-1 text-white">Clinical Vitals</h2>
            <p className="text-emerald-100/40 text-xs mt-1 italic">Real-time system telemetry and audit logs.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="space-y-6">
            <h3 className="text-lg font-bold text-white heading-font flex items-center gap-3 px-2">
               <Terminal className="size-4 text-emerald-500" /> Event Stream
            </h3>
            <div className="bg-[#05110f]/40 border border-emerald-900/30 backdrop-blur-xl rounded-3xl overflow-hidden p-6 space-y-4">
               {logs.map((log, i) => (
                 <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/10 group hover:border-emerald-500/30 transition-all font-mono">
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] text-emerald-500/30">{log.time}</span>
                       <div className="space-y-0.5">
                          <p className="text-xs font-bold text-emerald-100/80">{log.event}</p>
                          <p className="text-[9px] text-emerald-500/40 uppercase tracking-widest">Node: {log.node}</p>
                       </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-emerald-500/5 text-emerald-400 border border-emerald-500/20 tracking-widest uppercase">
                       {log.status}
                    </span>
                 </div>
               ))}
            </div>
         </div>

         <div className="space-y-6">
            <h3 className="text-lg font-bold text-white heading-font flex items-center gap-3 px-2">
               <Activity className="size-4 text-emerald-500" /> Resource Load
            </h3>
            <div className="bg-[#05110f]/40 border border-emerald-900/30 backdrop-blur-xl rounded-3xl p-8 space-y-8">
               {[
                 { label: 'Neural Compute (NPU)', val: '42%', icon: Cpu },
                 { label: 'Clinical Data IO', val: '128 MB/s', icon: Zap },
                 { label: 'Encryption Engine', val: 'Active', icon: Lock },
                 { label: 'Grid Latency', val: '4ms', icon: HardDrive },
               ].map((item) => (
                 <div key={item.label} className="space-y-3">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <item.icon className="size-4 text-emerald-500/40" />
                          <span className="text-[10px] font-bold text-emerald-100/60 uppercase tracking-widest">{item.label}</span>
                       </div>
                       <span className="text-xs font-mono font-bold text-emerald-500">{item.val}</span>
                    </div>
                    <div className="h-1.5 w-full bg-emerald-950/50 rounded-full overflow-hidden border border-emerald-900/10">
                       <div className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] w-[65%]" />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  )
}
