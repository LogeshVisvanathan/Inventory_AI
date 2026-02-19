import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Save, Trash2, TrendingDown } from 'lucide-react'
import Header from '../Header'
import Footer from '../Footer'
import { DataService } from '../../lib/dataService'

export default function ActualConsumptionPage() {
  const [consumptions, setConsumptions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving]   = useState(false)
  const [toast, setToast]         = useState<{ msg: string; type: 'ok'|'err' }|null>(null)

  const [form, setForm] = useState({
    itemSKU: '', itemName: '', actualQuantity: '', actualRate: '',
    consumptionDateTime: new Date().toISOString().slice(0, 16), unitOfMeasure: ''
  })

  const showToast = (msg: string, type: 'ok'|'err' = 'ok') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    DataService.getAll('actualconsumption').then(r => {
      setConsumptions((r as any).items); setIsLoading(false)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSaving(true)
    const item = {
      _id: crypto.randomUUID(), itemSKU: form.itemSKU, itemName: form.itemName,
      actualQuantity: parseFloat(form.actualQuantity), actualRate: parseFloat(form.actualRate),
      consumptionDateTime: form.consumptionDateTime, unitOfMeasure: form.unitOfMeasure,
    }
    await DataService.create('actualconsumption', item)
    setConsumptions(c => [item, ...c])
    setForm({ itemSKU: '', itemName: '', actualQuantity: '', actualRate: '', consumptionDateTime: new Date().toISOString().slice(0,16), unitOfMeasure: '' })
    showToast('Consumption recorded')
    setIsSaving(false)
  }

  const handleDelete = async (id: string) => {
    setConsumptions(c => c.filter(x => x._id !== id))
    await DataService.delete('actualconsumption', id)
    showToast('Record deleted')
  }

  const accent = 'text-chart-accent3'
  const borderAccent = 'border-chart-accent3/20'

  return (
    <div className="min-h-screen bg-background text-foreground grid-bg">
      <Header />
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg border font-paragraph text-sm ${toast.type === 'ok' ? 'bg-chart-accent3/10 border-chart-accent3/30 text-chart-accent3' : 'bg-destructive/10 border-destructive/30 text-destructive'}`}>
          {toast.msg}
        </div>
      )}
      <main className="w-full max-w-[120rem] mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-chart-accent3/10"><Activity className="w-8 h-8 text-chart-accent3" /></div>
            <div>
              <h1 className="font-heading text-5xl font-bold bg-gradient-to-r from-chart-accent3 to-primary bg-clip-text text-transparent">Actual Consumption</h1>
              <p className="font-paragraph text-lg text-muted-text mt-2">Track actual usage for cost variance and loss detection</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className={`p-8 bg-glass-background backdrop-blur-md border ${borderAccent} rounded-xl`}>
              <h2 className="font-heading text-2xl font-bold mb-6">Record Consumption</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Item SKU *',        key: 'itemSKU',        placeholder: 'SKU-001' },
                    { label: 'Unit of Measure *', key: 'unitOfMeasure',  placeholder: 'kg, pcs, m' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="font-paragraph text-sm text-foreground mb-2 block">{f.label}</label>
                      <input type="text" required value={(form as any)[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} placeholder={f.placeholder}
                        className={`w-full bg-background/50 border ${borderAccent} focus:border-chart-accent3 text-foreground font-paragraph text-sm px-4 py-3 rounded-lg outline-none transition-colors`} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="font-paragraph text-sm text-foreground mb-2 block">Item Name *</label>
                  <input type="text" required value={form.itemName} onChange={e => setForm({...form, itemName: e.target.value})} placeholder="Steel Rods"
                    className={`w-full bg-background/50 border ${borderAccent} focus:border-chart-accent3 text-foreground font-paragraph text-sm px-4 py-3 rounded-lg outline-none transition-colors`} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Actual Quantity *', key: 'actualQuantity', placeholder: '0' },
                    { label: 'Actual Rate (₹) *', key: 'actualRate',     placeholder: '0.00' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="font-paragraph text-sm text-foreground mb-2 block">{f.label}</label>
                      <input type="number" step="0.01" required value={(form as any)[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} placeholder={f.placeholder}
                        className={`w-full bg-background/50 border ${borderAccent} focus:border-chart-accent3 text-foreground font-paragraph text-sm px-4 py-3 rounded-lg outline-none transition-colors`} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="font-paragraph text-sm text-foreground mb-2 block">Consumption Date & Time *</label>
                  <input type="datetime-local" required value={form.consumptionDateTime} onChange={e => setForm({...form, consumptionDateTime: e.target.value})}
                    className={`w-full bg-background/50 border ${borderAccent} focus:border-chart-accent3 text-foreground font-paragraph text-sm px-4 py-3 rounded-lg outline-none transition-colors`} />
                </div>
                <div className="p-4 rounded-xl bg-chart-accent3/5 border border-chart-accent3/20">
                  <p className="font-paragraph text-sm text-muted-text mb-2">Total Actual Cost</p>
                  <p className="font-heading text-3xl font-bold text-chart-accent3">
                    ₹{((parseFloat(form.actualQuantity)||0)*(parseFloat(form.actualRate)||0)).toFixed(2)}
                  </p>
                </div>
                <button type="submit" disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-chart-accent3 text-background font-heading font-bold tracking-wide hover:opacity-90 disabled:opacity-50 transition-all rounded-lg">
                  <Save className="w-5 h-5" />
                  {isSaving ? 'Saving...' : 'Record Consumption'}
                </button>
              </form>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className={`p-8 bg-glass-background backdrop-blur-md border ${borderAccent} rounded-xl min-h-[600px]`}>
              <h2 className="font-heading text-2xl font-bold mb-6">Recent Consumption</h2>
              <div className="space-y-4">
                {isLoading ? <div className="text-muted-text font-paragraph">Loading...</div>
                : consumptions.length > 0 ? consumptions.map((c, i) => (
                  <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-xl bg-background/50 border border-chart-accent3/10 hover:border-chart-accent3/30 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-heading text-lg font-semibold">{c.itemName}</h3>
                        <p className="font-paragraph text-xs text-muted-text">{c.itemSKU}</p>
                      </div>
                      <button onClick={() => handleDelete(c._id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div><p className="font-paragraph text-xs text-muted-text">Quantity</p><p className="font-paragraph text-sm font-semibold">{c.actualQuantity} {c.unitOfMeasure}</p></div>
                      <div><p className="font-paragraph text-xs text-muted-text">Rate</p><p className="font-paragraph text-sm font-semibold">₹{(c.actualRate||0).toFixed(2)}</p></div>
                      <div><p className="font-paragraph text-xs text-muted-text">Total</p><p className="font-paragraph text-sm text-chart-accent3 font-semibold">₹{((c.actualQuantity||0)*(c.actualRate||0)).toFixed(2)}</p></div>
                    </div>
                    <p className="font-paragraph text-xs text-muted-text pt-3 border-t border-chart-accent3/10">
                      {c.consumptionDateTime ? new Date(c.consumptionDateTime).toLocaleString() : 'N/A'}
                    </p>
                  </motion.div>
                )) : (
                  <div className="text-center py-12">
                    <TrendingDown className="w-16 h-16 text-muted-text mx-auto mb-4 opacity-50" />
                    <p className="font-paragraph text-muted-text">No consumption records yet</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
