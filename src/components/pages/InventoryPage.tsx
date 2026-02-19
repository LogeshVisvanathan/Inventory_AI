import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, AlertTriangle, CheckCircle } from 'lucide-react'
import Header from '../Header'
import Footer from '../Footer'
import { DataService } from '../../lib/dataService'

export default function InventoryPage() {
  const [items, setItems]         = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    DataService.getAll('inventoryitems').then(r => {
      setItems((r as any).items); setIsLoading(false)
    })
  }, [])

  const getStatus = (cur: number, safe: number) => {
    if (cur === 0)    return { label: 'Out of Stock', color: 'text-destructive', border: 'border-destructive/20 hover:border-destructive/50', bg: 'bg-destructive/10' }
    if (cur <= safe)  return { label: 'Low Stock',    color: 'text-secondary',   border: 'border-secondary/20 hover:border-secondary/50',   bg: 'bg-secondary/10' }
    return              { label: 'In Stock',      color: 'text-chart-accent3', border: 'border-chart-accent3/20 hover:border-chart-accent3/50', bg: 'bg-chart-accent3/10' }
  }

  const pct = (cur: number, safe: number) => Math.min((cur / Math.max(safe * 2, 1)) * 100, 100)

  return (
    <div className="min-h-screen bg-background text-foreground grid-bg">
      <Header />
      <main className="w-full max-w-[120rem] mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-chart-accent3/10"><Package className="w-8 h-8 text-chart-accent3" /></div>
            <div>
              <h1 className="font-heading text-5xl font-bold bg-gradient-to-r from-chart-accent3 to-primary bg-clip-text text-transparent">Inventory Items</h1>
              <p className="font-paragraph text-lg text-muted-text mt-2">Complete overview of all inventory items and stock levels</p>
            </div>
          </div>
        </motion.div>

        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[600px]">
          {isLoading ? <div className="text-muted-text font-paragraph">Loading...</div>
          : items.length > 0 ? items.map((item, i) => {
            const st = getStatus(item.currentStock||0, item.safetyStock||0)
            const p  = pct(item.currentStock||0, item.safetyStock||0)
            return (
              <motion.div key={item._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className={`p-6 bg-glass-background backdrop-blur-md border ${st.border} rounded-xl transition-all h-full`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-heading text-xl font-semibold mb-2">{item.itemName}</h3>
                      {item.description && <p className="font-paragraph text-sm text-muted-text line-clamp-2">{item.description}</p>}
                    </div>
                    <div className={`p-2 rounded-lg ${st.bg}`}>
                      {item.currentStock === 0
                        ? <AlertTriangle className={`w-5 h-5 ${st.color}`} />
                        : item.currentStock <= item.safetyStock
                        ? <AlertTriangle className={`w-5 h-5 ${st.color}`} />
                        : <CheckCircle className={`w-5 h-5 ${st.color}`} />}
                    </div>
                  </div>

                  {/* Stock bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-paragraph text-muted-text mb-2">
                      <span>Stock Level</span><span>{p.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${p < 30 ? 'bg-destructive' : p < 60 ? 'bg-secondary' : 'bg-chart-accent3'}`} style={{ width: `${p}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { label:'Current Stock', val:`${item.currentStock||0} ${item.unitOfMeasure||''}` },
                      { label:'Safety Stock',  val:`${item.safetyStock||0} ${item.unitOfMeasure||''}` },
                      { label:'Lead Time',     val:`${item.leadTime||0} days` },
                      { label:'Unit',          val: item.unitOfMeasure||'N/A' },
                    ].map(s => (
                      <div key={s.label}>
                        <p className="font-paragraph text-xs text-muted-text">{s.label}</p>
                        <p className="font-paragraph text-sm font-semibold text-foreground">{s.val}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 border rounded font-paragraph ${st.color} ${st.border.split(' ')[0]}`}>{st.label}</span>
                    <span className="font-paragraph text-xs text-muted-text">{item._id?.slice(0,8)}</span>
                  </div>
                </div>
              </motion.div>
            )
          }) : (
            <div className="col-span-3 text-center py-20">
              <Package className="w-20 h-20 text-muted-text mx-auto mb-4 opacity-50" />
              <p className="font-paragraph text-muted-text text-xl">No inventory items found</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
