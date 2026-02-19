import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Save, Trash2, Package } from 'lucide-react'
import Header from '../Header'
import Footer from '../Footer'
import { DataService } from '../../lib/dataService'

export default function ProductionPlanningPage() {
  const [plans, setPlans]       = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast]       = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  const [form, setForm] = useState({
    planIdentifier: '', itemName: '', plannedQuantity: '',
    plannedRate: '', planningDate: new Date().toISOString().split('T')[0], notes: ''
  })

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    DataService.getAll('productionplans').then(r => {
      setPlans((r as any).items)
      setIsLoading(false)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const newPlan = {
      _id: crypto.randomUUID(),
      planIdentifier: form.planIdentifier,
      itemName: form.itemName,
      plannedQuantity: parseFloat(form.plannedQuantity),
      plannedRate: parseFloat(form.plannedRate),
      planningDate: form.planningDate,
      notes: form.notes,
    }
    await DataService.create('productionplans', newPlan)
    setPlans(p => [newPlan, ...p])
    setForm({ planIdentifier: '', itemName: '', plannedQuantity: '', plannedRate: '', planningDate: new Date().toISOString().split('T')[0], notes: '' })
    showToast('Production plan created successfully')
    setIsSaving(false)
  }

  const handleDelete = async (id: string) => {
    setPlans(p => p.filter(x => x._id !== id))
    await DataService.delete('productionplans', id)
    showToast('Plan deleted')
  }

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
            <div className="p-3 rounded-xl bg-primary/10"><Package className="w-8 h-8 text-primary" /></div>
            <div>
              <h1 className="font-heading text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Production Planning</h1>
              <p className="font-paragraph text-lg text-muted-text mt-2">Enter planned BOM items and production schedules</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="relative p-8 bg-glass-background backdrop-blur-md border border-primary/20 rounded-xl overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/30" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/30" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/30" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/30" />
              </div>
              <h2 className="font-heading text-2xl font-bold mb-6">Create New Plan</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  { label: 'Plan Identifier *', key: 'planIdentifier', placeholder: 'PLAN-2026-001', type: 'text' },
                  { label: 'Item Name *',        key: 'itemName',       placeholder: 'Steel Rods',    type: 'text' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="font-paragraph text-sm text-foreground mb-2 block">{f.label}</label>
                    <input
                      type={f.type} required value={(form as any)[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full bg-background/50 border border-primary/20 focus:border-primary text-foreground font-paragraph text-sm px-4 py-3 rounded-lg outline-none transition-colors"
                    />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Planned Quantity *', key: 'plannedQuantity', placeholder: '0' },
                    { label: 'Planned Rate *',     key: 'plannedRate',     placeholder: '0.00' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="font-paragraph text-sm text-foreground mb-2 block">{f.label}</label>
                      <input
                        type="number" step="0.01" required value={(form as any)[f.key]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        className="w-full bg-background/50 border border-primary/20 focus:border-primary text-foreground font-paragraph text-sm px-4 py-3 rounded-lg outline-none transition-colors"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="font-paragraph text-sm text-foreground mb-2 block">Planning Date *</label>
                  <input type="date" required value={form.planningDate}
                    onChange={e => setForm({ ...form, planningDate: e.target.value })}
                    className="w-full bg-background/50 border border-primary/20 focus:border-primary text-foreground font-paragraph text-sm px-4 py-3 rounded-lg outline-none transition-colors" />
                </div>
                <div>
                  <label className="font-paragraph text-sm text-foreground mb-2 block">Notes</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                    placeholder="Additional notes..." rows={3}
                    className="w-full bg-background/50 border border-primary/20 focus:border-primary text-foreground font-paragraph text-sm px-4 py-3 rounded-lg outline-none transition-colors resize-none" />
                </div>
                {/* Cost preview */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="font-paragraph text-sm text-muted-text mb-1">Total Planned Cost</p>
                  <p className="font-heading text-3xl font-bold text-primary">
                    ₹{((parseFloat(form.plannedQuantity)||0) * (parseFloat(form.plannedRate)||0)).toFixed(2)}
                  </p>
                </div>
                <button type="submit" disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground font-heading font-bold tracking-wide hover:bg-primary/90 disabled:opacity-50 transition-all rounded-lg">
                  <Save className="w-5 h-5" />
                  {isSaving ? 'Saving...' : 'Create Plan'}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Plans list */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="p-8 bg-glass-background backdrop-blur-md border border-primary/20 rounded-xl min-h-[600px]">
              <h2 className="font-heading text-2xl font-bold mb-6">Recent Plans</h2>
              <div className="space-y-4">
                {isLoading ? <div className="text-muted-text font-paragraph">Loading...</div>
                : plans.length > 0 ? plans.map((plan, i) => (
                  <motion.div key={plan._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-xl bg-background/50 border border-primary/10 hover:border-primary/30 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-foreground">{plan.itemName}</h3>
                        <p className="font-paragraph text-xs text-muted-text">{plan.planIdentifier}</p>
                      </div>
                      <button onClick={() => handleDelete(plan._id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div><p className="font-paragraph text-xs text-muted-text">Quantity</p><p className="font-paragraph text-sm font-semibold">{plan.plannedQuantity}</p></div>
                      <div><p className="font-paragraph text-xs text-muted-text">Rate</p><p className="font-paragraph text-sm font-semibold">₹{(plan.plannedRate||0).toFixed(2)}</p></div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-primary/10">
                      <p className="font-paragraph text-xs text-muted-text">{plan.planningDate ? new Date(plan.planningDate).toLocaleDateString() : 'N/A'}</p>
                      <p className="font-paragraph text-sm text-primary font-semibold">₹{((plan.plannedQuantity||0)*(plan.plannedRate||0)).toFixed(2)}</p>
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-muted-text mx-auto mb-4 opacity-50" />
                    <p className="font-paragraph text-muted-text">No production plans yet</p>
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
