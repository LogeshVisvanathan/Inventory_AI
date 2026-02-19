import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, TrendingUp } from 'lucide-react'
import Header from '../Header'
import Footer from '../Footer'
import { DataService } from '../../lib/dataService'

export default function OrdersPage() {
  const [orders, setOrders]       = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    DataService.getAll('orders').then(r => {
      setOrders((r as any).items); setIsLoading(false)
    })
  }, [])

  const statusColors: Record<string, string> = {
    delivered: 'text-chart-accent3 border-chart-accent3/30',
    pending:   'text-secondary border-secondary/30',
    cancelled: 'text-destructive border-destructive/30',
  }

  return (
    <div className="min-h-screen bg-background text-foreground grid-bg">
      <Header />
      <main className="w-full max-w-[120rem] mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-primary/10"><ShoppingCart className="w-8 h-8 text-primary" /></div>
            <div>
              <h1 className="font-heading text-5xl font-bold bg-gradient-to-r from-primary to-chart-accent3 bg-clip-text text-transparent">Orders</h1>
              <p className="font-paragraph text-lg text-muted-text mt-2">All purchase orders and their status</p>
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-12">
          {[
            { label: 'Total Orders',   val: orders.length,                                           color: 'text-primary' },
            { label: 'Total Value',    val: `₹${orders.reduce((s,o)=>s+(o.totalValue||0),0).toFixed(2)}`, color: 'text-chart-accent3' },
            { label: 'Total Quantity', val: orders.reduce((s,o)=>s+(o.totalQuantity||0),0),          color: 'text-secondary' },
          ].map(s => (
            <div key={s.label} className="p-6 bg-glass-background border border-primary/20 rounded-xl">
              <p className="font-paragraph text-sm text-muted-text mb-2">{s.label}</p>
              <p className={`font-heading text-3xl font-bold ${s.color}`}>{isLoading ? '...' : s.val}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4 min-h-[400px]">
          {isLoading ? <div className="text-muted-text font-paragraph">Loading...</div>
          : orders.length > 0 ? orders.map((order, i) => (
            <motion.div key={order._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="p-6 bg-glass-background backdrop-blur-md border border-primary/20 hover:border-primary/40 transition-all rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-foreground">{order.orderNumber || `ORD-${order._id?.slice(0,6)}`}</h3>
                    <p className="font-paragraph text-sm text-muted-text">{order.vendor || 'Vendor N/A'}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 border rounded font-paragraph ${statusColors[order.status] || 'text-muted-text border-white/10'}`}>
                    {(order.status || 'unknown').toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><p className="font-paragraph text-xs text-muted-text">Quantity</p><p className="font-paragraph text-lg font-semibold text-primary">{order.totalQuantity||0}</p></div>
                  <div><p className="font-paragraph text-xs text-muted-text">Total Value</p><p className="font-paragraph text-lg font-semibold text-chart-accent3">₹{(order.totalValue||0).toFixed(2)}</p></div>
                  <div><p className="font-paragraph text-xs text-muted-text">Date</p><p className="font-paragraph text-sm font-semibold text-foreground">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p></div>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-20">
              <ShoppingCart className="w-20 h-20 text-muted-text mx-auto mb-4 opacity-50" />
              <p className="font-paragraph text-muted-text text-xl">No orders found</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
