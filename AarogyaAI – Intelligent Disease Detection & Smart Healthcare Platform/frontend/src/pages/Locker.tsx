import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { RecordItem, UploadItem } from '../lib/types'
import { useAuth } from '../context/AuthContext'
import { formatDate } from '../lib/utils'
import { 
  ShieldCheck, 
  UploadCloud, 
  FileText, 
  Activity, 
  Trash2, 
  Download, 
  Plus, 
  ClipboardList,
  Heart,
  Thermometer,
  Scale,
  Ruler,
  Droplets,
  Zap,
  Info
} from 'lucide-react'

const categories = ['Blood Test', 'Urine Test', 'X-Ray / Scan', 'Prescription', 'ECG', 'MRI / CT', 'Other']

export function LockerPage() {
  const { token } = useAuth()
  const [records, setRecords] = useState<RecordItem[]>([])
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadMeta, setUploadMeta] = useState({ description: '', category: categories[0] })

  const [recordForm, setRecordForm] = useState({
    title: '', notes: '', weight_kg: '', height_cm: '', bp_systolic: '', bp_diastolic: '',
    glucose: '', cholesterol: '', heart_rate: '', temperature: '',
  })

  const loadData = async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const [recordsRes, uploadsRes] = await Promise.all([api.listRecords(token), api.listUploads(token)])
      setRecords(recordsRes)
      setUploads(uploadsRes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [token])

  const submitRecord = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!token) return
    try {
      const payload = {
        title: recordForm.title,
        notes: recordForm.notes || undefined,
        weight_kg: recordForm.weight_kg ? Number(recordForm.weight_kg) : undefined,
        height_cm: recordForm.height_cm ? Number(recordForm.height_cm) : undefined,
        bp_systolic: recordForm.bp_systolic ? Number(recordForm.bp_systolic) : undefined,
        bp_diastolic: recordForm.bp_diastolic ? Number(recordForm.bp_diastolic) : undefined,
        glucose: recordForm.glucose ? Number(recordForm.glucose) : undefined,
        cholesterol: recordForm.cholesterol ? Number(recordForm.cholesterol) : undefined,
        heart_rate: recordForm.heart_rate ? Number(recordForm.heart_rate) : undefined,
        temperature: recordForm.temperature ? Number(recordForm.temperature) : undefined,
      }
      await api.addRecord(token, payload)
      setRecordForm({
        title: '', notes: '', weight_kg: '', height_cm: '', bp_systolic: '', bp_diastolic: '',
        glucose: '', cholesterol: '', heart_rate: '', temperature: '',
      })
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save record')
    }
  }

  const submitUpload = async () => {
    if (!token || !uploadFile) return
    try {
      const formData = new FormData()
      formData.append('file', uploadFile)
      formData.append('description', uploadMeta.description)
      formData.append('category', uploadMeta.category)
      await api.uploadFile(token, formData)
      setUploadFile(null)
      setUploadMeta({ description: '', category: categories[0] })
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    }
  }

  const handleDownload = async (item: UploadItem) => {
    if (!token) return
    const blob = await api.downloadUpload(token, item.id)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = item.filename
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleDelete = async (item: UploadItem) => {
    if (!token) return
    await api.deleteUpload(token, item.id)
    await loadData()
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/50 p-8 rounded-3xl border border-border backdrop-blur-xl relative overflow-hidden group shadow-sm">
         <div className="relative z-10">
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Clinical Vault</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight heading-font mt-1 emerald-gradient-text">Health Locker</h1>
            <p className="text-muted-foreground text-xs mt-1 italic font-mono">Secure AES-256 encrypted storage for your clinical data.</p>
         </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form Column */}
        <div className="space-y-8">
          <div className="bg-card/50 border border-border backdrop-blur-xl rounded-3xl p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
               <ClipboardList className="size-5 text-primary" />
               <h3 className="text-lg font-bold text-foreground uppercase tracking-widest">Record Vitals</h3>
            </div>
            <form onSubmit={submitRecord} className="space-y-4">
              <input
                required
                value={recordForm.title}
                onChange={(e) => setRecordForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full bg-secondary/50 border border-border text-foreground rounded-xl h-12 px-4 focus:outline-none focus:border-primary/50 transition-all text-sm font-medium"
                placeholder="Log Entry Title (e.g. Morning Vitals)"
              />
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'weight_kg', label: 'Weight (kg)', icon: Scale },
                  { name: 'height_cm', label: 'Height (cm)', icon: Ruler },
                  { name: 'bp_systolic', label: 'BP Systolic', icon: Activity },
                  { name: 'bp_diastolic', label: 'BP Diastolic', icon: Activity },
                  { name: 'glucose', label: 'Glucose', icon: Droplets },
                  { name: 'heart_rate', label: 'Heart Rate', icon: Heart },
                ].map((field) => (
                  <div key={field.name} className="relative group">
                    <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                    <input
                      value={(recordForm as any)[field.name]}
                      onChange={(e) => setRecordForm((p) => ({ ...p, [field.name]: e.target.value }))}
                      className="w-full pl-11 bg-secondary/50 border border-border text-foreground rounded-xl h-12 px-4 focus:outline-none focus:border-primary/50 transition-all text-xs font-mono"
                      placeholder={field.label}
                    />
                  </div>
                ))}
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-4 rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95">
                <Zap className="size-4" /> Commit to Vault
              </button>
            </form>
          </div>

          <div className="bg-card/50 border border-border backdrop-blur-xl rounded-3xl p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
               <UploadCloud className="size-5 text-primary" />
               <h3 className="text-lg font-bold text-foreground uppercase tracking-widest">Sync Reports</h3>
            </div>
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group">
                <Plus className="size-8 text-primary/20 group-hover:text-primary transition-colors mb-2" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{uploadFile ? uploadFile.name : 'Select PDF / Image'}</p>
                <input type="file" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} className="sr-only" />
              </label>
              <div className="grid gap-4">
                <input
                  value={uploadMeta.description}
                  onChange={(e) => setUploadMeta((p) => ({ ...p, description: e.target.value }))}
                  className="w-full bg-secondary/50 border border-border text-foreground rounded-xl h-12 px-4 focus:outline-none focus:border-primary/50 transition-all text-sm"
                  placeholder="Clinical Description..."
                />
                <select
                  value={uploadMeta.category}
                  onChange={(e) => setUploadMeta((p) => ({ ...p, category: e.target.value }))}
                  className="w-full bg-secondary/50 border border-border text-foreground rounded-xl h-12 px-4 focus:outline-none focus:border-primary/50 transition-all text-sm"
                >
                  {categories.map((c) => <option key={c} value={c} className="bg-background">{c}</option>)}
                </select>
              </div>
              <button onClick={submitUpload} disabled={!uploadFile} className="w-full bg-secondary border border-border text-primary hover:bg-primary/10 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30">
                Upload to Secure Node
              </button>
            </div>
          </div>
        </div>

        {/* Display Column */}
        <div className="space-y-8">
          <div className="bg-card/50 border border-border backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border/50">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Recent Vital Syncs</h3>
            </div>
            <div className="p-6 space-y-4">
              {records.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground/30 font-bold uppercase tracking-widest text-xs">No Records Found</div>
              ) : (
                records.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-secondary/50 border border-border group hover:border-primary/30 transition-all">
                    <div className="flex justify-between items-center mb-2">
                       <p className="font-bold text-foreground tracking-tight text-sm">{item.title}</p>
                       <span className="text-[9px] font-mono text-muted-foreground">{formatDate(item.recorded_at)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {item.weight_kg && <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/10 text-[9px] font-bold">{item.weight_kg}kg</span>}
                       {item.bp_systolic && <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/10 text-[9px] font-bold">{item.bp_systolic}/{item.bp_diastolic} BP</span>}
                       {item.heart_rate && <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/10 text-[9px] font-bold">{item.heart_rate}bpm</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-card/50 border border-border backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border/50">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Clinical Dossiers</h3>
            </div>
            <div className="p-6 space-y-4">
              {uploads.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground/30 font-bold uppercase tracking-widest text-xs">Empty Vault</div>
              ) : (
                uploads.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-secondary/50 border border-border group hover:border-primary/30 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                          <FileText className="size-5" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-foreground truncate max-w-[150px]">{item.filename}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{item.category}</p>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => handleDownload(item)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all"><Download className="size-4" /></button>
                       <button onClick={() => handleDelete(item)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all"><Trash2 className="size-4" /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
