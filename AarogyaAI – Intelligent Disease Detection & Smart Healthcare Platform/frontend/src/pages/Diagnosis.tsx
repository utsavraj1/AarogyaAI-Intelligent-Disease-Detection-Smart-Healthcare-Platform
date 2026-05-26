import { useMemo, useState } from 'react'
import { api } from '../lib/api'
import { readFileAsBase64 } from '../lib/utils'
import type { Prediction } from '../lib/types'
import { useAuth } from '../context/AuthContext'
import { modules, type Field } from './diagnosisConfig'
import {
  Microscope as MicroscopeIcon,
  UploadCloud as UploadCloudIcon,
  CheckCircle2 as CheckCircle2Icon,
  AlertTriangle as AlertTriangleIcon,
  XCircle as XCircleIcon,
  ChevronRight,
  LoaderCircle as LoaderCircleIcon,
  BrainCircuit, ShieldCheck, Zap, Activity, Info
} from 'lucide-react'

const riskConfig = {
  high:     { color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30', icon: XCircleIcon },
  moderate: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: AlertTriangleIcon },
  low:      { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: CheckCircle2Icon },
}

export function DiagnosisPage() {
  const { token } = useAuth()
  const [moduleId, setModuleId] = useState(modules[0].id)
  const [image, setImage] = useState<File | null>(null)
  const [result, setResult] = useState<Prediction | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const activeModule = modules.find((m) => m.id === moduleId) || modules[0]

  const initialValues = useMemo(() => {
    const v: Record<string, number> = {}
    activeModule.groups.forEach((g) => g.fields.forEach((f) => { v[f.name] = f.defaultValue }))
    return v
  }, [activeModule])

  const [values, setValues] = useState<Record<string, number>>(initialValues)

  const handleFieldChange = (field: Field, value: number) =>
    setValues((p) => ({ ...p, [field.name]: value }))

  const resetModule = (id: string) => {
    setModuleId(id)
    setResult(null)
    setError('')
    setImage(null)
    const mod = modules.find((m) => m.id === id) || modules[0]
    const next: Record<string, number> = {}
    mod.groups.forEach((g) => g.fields.forEach((f) => { next[f.name] = f.defaultValue }))
    setValues(next)
  }

  const handleSubmit = async () => {
    if (!token) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const payload: { features: Record<string, number>; image_b64?: string } = { features: values }
      if (activeModule.supportsImage) {
        if (!image) throw new Error('Please upload a clinical scan image to continue.')
        payload.image_b64 = await readFileAsBase64(image)
      }
      const response = await api.predict(token, activeModule.id, payload)
      setResult({ ...response, disease_module: activeModule.id })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const risk = result?.risk_level as 'high' | 'moderate' | 'low' | undefined
  const RiskIcon = risk ? riskConfig[risk].icon : null

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/50 p-8 rounded-3xl border border-border backdrop-blur-xl relative overflow-hidden group shadow-sm">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/[0.05] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:scale-110 transition-all duration-1000" />
         
         <div className="relative z-10">
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Neural Diagnostics Core</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight heading-font mt-1 emerald-gradient-text">AI Clinical Scan</h1>
            <p className="text-muted-foreground text-xs mt-1 italic font-mono">Select a disease module and input patient telemetry for inference.</p>
         </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Module Selection */}
        <div className="space-y-6">
          <div className="bg-card/50 border border-border backdrop-blur-xl rounded-3xl p-6 shadow-sm">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-1">Clinical Modules</p>
            <div className="space-y-2">
              {modules.map((m) => (
                <button
                  key={m.id}
                  onClick={() => resetModule(m.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all group ${
                    m.id === moduleId
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BrainCircuit className={`size-4 ${m.id === moduleId ? 'text-primary-foreground' : 'text-primary/40'}`} />
                    {m.label}
                  </div>
                  {m.id === moduleId && <ChevronRight className="size-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Module Specs */}
          <div className="bg-primary/[0.03] border border-primary/10 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-primary">
               <Info className="size-4" />
               <p className="text-[10px] font-bold uppercase tracking-widest">Module Intel</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              {activeModule.description}
            </p>
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-8">
          <div className="bg-card/50 border border-border backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm">
            <div className="p-8 space-y-8">
              {/* Image Upload */}
              {activeModule.supportsImage && (
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-1">Clinical Imaging Input</p>
                  <label className={`relative group flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
                    image 
                    ? 'border-primary/40 bg-primary/5' 
                    : 'border-border hover:border-primary/40 hover:bg-primary/5'
                  }`}>
                    <UploadCloudIcon className={`size-12 mb-4 transition-transform group-hover:scale-110 ${image ? 'text-primary' : 'text-primary/20'}`} />
                    {image ? (
                      <div className="text-center relative z-10">
                        <p className="text-sm font-black text-foreground">{image.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">{(image.size / 1024).toFixed(1)} KB • Ready for Sync</p>
                      </div>
                    ) : (
                      <div className="text-center relative z-10">
                        <p className="text-sm font-bold text-foreground">Drop Clinical Scan Here</p>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">PNG, JPG up to 10MB</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="sr-only" />
                  </label>
                </div>
              )}

              {/* Data Fields */}
              <div className="space-y-8">
                {activeModule.groups.map((group) => (
                  <div key={group.title} className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-1">{group.title}</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {group.fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">{field.label}</label>
                          {field.type === 'select' ? (
                            <select
                              value={values[field.name]}
                              onChange={(e) => handleFieldChange(field, Number(e.target.value))}
                              className="w-full bg-secondary/50 border border-border text-foreground rounded-xl h-12 px-4 focus:outline-none focus:border-primary/50 transition-all text-sm font-medium"
                            >
                              {field.options?.map((o) => (
                                <option key={o.value} value={o.value} className="bg-background">{o.label}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="number"
                              value={values[field.name]}
                              onChange={(e) => handleFieldChange(field, Number(e.target.value))}
                              step={field.step}
                              className="w-full bg-secondary/50 border border-border text-foreground rounded-xl h-12 px-4 focus:outline-none focus:border-primary/50 transition-all text-sm font-mono"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold flex items-center gap-3">
                  <AlertTriangleIcon className="size-4" /> {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-4 rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group active:scale-95 disabled:opacity-50"
              >
                {loading ? <LoaderCircleIcon className="size-5 animate-spin" /> : <Zap className="size-5" />}
                {loading ? 'NEURAL INFERENCE IN PROGRESS...' : 'INITIALIZE DIAGNOSTIC PROTOCOL'}
              </button>
            </div>
          </div>

          {/* Result Output */}
          {result && risk && RiskIcon && (
            <div className={`animate-in slide-in-from-top-8 duration-500 bg-card/60 border-2 ${riskConfig[risk].border} backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl`}>
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${riskConfig[risk].bg} ${riskConfig[risk].color} shadow-inner`}>
                         <RiskIcon className="size-8" />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Inference Outcome</p>
                         <h3 className={`text-3xl font-black heading-font tracking-tight ${riskConfig[risk].color}`}>
                           {result.result_label}
                         </h3>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${riskConfig[risk].bg} ${riskConfig[risk].color} ${riskConfig[risk].border}`}>
                        {risk} RISK DETECTED
                      </span>
                   </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                   <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                        <span>Confidence Index</span>
                        <span className="text-primary font-mono">{result.confidence.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary border border-border overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ${
                            risk === 'high' ? 'bg-rose-500' : risk === 'moderate' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                   </div>
                </div>

                <div className={`p-6 rounded-2xl border ${riskConfig[risk].border} ${riskConfig[risk].bg} relative overflow-hidden`}>
                  <h4 className="text-xs font-black text-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                    <ShieldCheck className="size-4 text-primary" /> AI Clinical Intelligence
                  </h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {risk === 'high' ? (
                      <strong>CRITICAL ALERT: Clinical data correlates with high-risk pathology. Immediate specialist consultation required.</strong>
                    ) : risk === 'moderate' ? (
                      <strong>WARNING: Detected atypical biomarkers. Clinical correlation via traditional testing is recommended.</strong>
                    ) : (
                      <strong>ANALYSIS STABLE: No high-risk neural patterns detected. Continue standard clinical protocols.</strong>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
