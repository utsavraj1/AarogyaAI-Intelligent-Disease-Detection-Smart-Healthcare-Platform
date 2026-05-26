"use client"

import { Users, Stethoscope, Activity, ClipboardList, ArrowUpRight } from "lucide-react"

interface SectionCardsProps {
  stats: {
    patients: number
    doctors: number
    predictions: number
    records: number
  }
}

export function SectionCards({ stats }: SectionCardsProps) {
  const items = [
    { 
      label: 'Total Patients', 
      value: stats.patients, 
      icon: Users, 
      desc: 'Active user base', 
      color: 'blue',
      trend: '+12%'
    },
    { 
      label: 'Verified Doctors', 
      value: stats.doctors, 
      icon: Stethoscope, 
      desc: 'Professional faculty', 
      color: 'emerald',
      trend: '+4%'
    },
    { 
      label: 'AI Predictions', 
      value: stats.predictions, 
      icon: Activity, 
      desc: 'Diagnostic inferences', 
      color: 'amber',
      trend: '+28%'
    },
    { 
      label: 'Medical Records', 
      value: stats.records, 
      icon: ClipboardList, 
      desc: 'Securely archived', 
      color: 'indigo',
      trend: '+18%'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-4 lg:px-0">
      {items.map((item) => (
        <div key={item.label} className="bg-white/40 dark:bg-[#05110f]/40 border border-emerald-900/10 dark:border-emerald-900/30 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl group hover:border-emerald-500/40 transition-all duration-500 relative">
          <div className={`absolute top-0 right-0 w-32 h-32 bg-${item.color}-500/[0.03] rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:bg-${item.color}-500/[0.08] transition-all`} />
          
          <div className="p-8 pb-2">
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-${item.color}-500 shadow-inner`}>
                <item.icon className="size-5" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600/60 dark:text-emerald-500/60 uppercase tracking-widest">
                {item.trend} <ArrowUpRight className="size-3" />
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-[10px] font-bold text-emerald-600/40 dark:text-emerald-500/40 uppercase tracking-[0.2em]">{item.label}</p>
              <h4 className="text-4xl font-extrabold text-emerald-950 dark:text-white heading-font tracking-tight tabular-nums">
                {item.value.toLocaleString()}
              </h4>
            </div>
          </div>
          
          <div className="px-8 pt-2 pb-6">
            <p className="text-[10px] font-bold text-emerald-900/30 dark:text-emerald-100/30 uppercase tracking-widest italic">{item.desc}</p>
          </div>
          
          <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
        </div>
      ))}
    </div>
  )
}

