import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, TrendingDown, DollarSign, FileText } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Header from '../Header'
import Footer from '../Footer'
import { DataService } from '../../lib/dataService'

export default function ReportsPage() {
  const [plans, setPlans]             = useState<any[]>([])
  const [consumptions, setConsumptions] = useState<any[]>([])
  const [orders, setOrders]           = useState<any[]>([])
  const [isLoading, setIsLoading]     = useState(true)

  useEffect(() => {
    Promise.all([
      DataService.getAll('productionplans'),
      DataService.getAll('actualconsumption'),
      DataService.getAll('orders'),
    ]).then(([p, c, o]) => {
      setPlans((p as any).items)
      setConsumptions((c as any).items)
      setOrders((o as any).items)
      setIsLoading(false)
    })
  }, [])

  // Cost analysis
  const itemMap = new Map<string, { planned: number; actual: number }>()
  plans.forEach(p => {
    const n = p.itemName || 'Unknown'; const v = (p.plannedQuantity||0)*(p.plannedRate||0)
    const e = itemMap.get(n) || { planned:0, actual:0 }; itemMap.set(n, { ...e, planned: e.planned+v })
  })
  consumptions.forEach(c => {
    const n = c.itemName || 'Unknown'; const v = (c.actualQuantity||0)*(c.actualRate||0)
    const e = itemMap.get(n) || { planned:0, actual:0 }; itemMap.set(n, { ...e, actual: e.actual+v })
  })
  const costAnalysis = Array.from(itemMap.entries()).map(([itemName, v]) => ({
    itemName, plannedCost: v.planned, actualCost: v.actual,
    variance: v.planned - v.actual,
    variancePercentage: v.planned > 0 ? ((v.planned - v.actual)/v.planned)*100 : 0
  }))

  const totalPlannedCost  = costAnalysis.reduce((s,i) => s+i.plannedCost, 0)
  const totalActualCost   = costAnalysis.reduce((s,i) => s+i.actualCost, 0)
  const totalVariance     = totalPlannedCost - totalActualCost
  const totalVariancePct  = totalPlannedCost > 0 ? (totalVariance/totalPlannedCost)*100 : 0
  const totalOrders       = orders.length
  const totalOrderValue   = orders.reduce((s,o) => s+(o.totalValue||0), 0)
  const totalOrderQty     = orders.reduce((s,o) => s+(o.totalQuantity||0), 0)

  const chartData = costAnalysis.slice(0,10).map(i => ({
    name: i.itemName.length > 15 ? i.itemName.substring(0,15)+'...' : i.itemName,
    planned: i.plannedCost, actual: i.actualCost
  }))

  const summaryCards = [
    { label: 'Total Planned Cost', value: `₹${totalPlannedCost.toFixed(2)}`, badge: 'Planned', icon: DollarSign, color: 'text-primary', border: 'border-primary/20', badgeColor: 'text-primary border-primary/30' },
    { label: 'Total Actual Cost',  value: `₹${totalActualCost.toFixed(2)}`,  badge: 'Actual',  icon: DollarSign, color: 'text-chart-accent3', border: 'border-chart-accent3/20', badgeColor: 'text-chart-accent3 border-chart-accent3/30' },
    { label: 'Total Variance',     value: `${totalVariancePct>=0?'+':''}${totalVariancePct.toFixed(1)}%`, badge: totalVariance>=0?'Profit':'Loss', icon: totalVariance>=0?TrendingUp:TrendingDown, color: totalVariance>=0?'text-chart-accent3':'text-destructive', border: 'border-secondary/20', badgeColor: totalVariance>=0?'text-chart-accent3 border-chart-accent3/30':'text-destructive border-destructive/30' },
    { label: 'Total Orders',       value: totalOrders.toString(), badge: 'Orders', icon: BarChart3, color: 'text-chart-accent2', border: 'border-chart-accent2/20', badgeColor: 'text-chart-accent2 border-chart-accent2/30' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground grid-bg">
      <Header />
      <main className="w-full max-w-[120rem] mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-chart-accent2/10"><FileText className="w-8 h-8 text-chart-accent2" /></div>
            <div>
              <h1 className="font-heading text-5xl font-bold bg-gradient-to-r from-chart-accent2 via-primary to-secondary bg-clip-text text-transparent">Analytics & Reports</h1>
              <p className="font-paragraph text-lg text-muted-text mt-2">Comprehensive cost analysis and performance insights</p>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 mb-12">
          {summaryCards.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className={`p-6 bg-glass-background backdrop-blur-md border ${c.border} rounded-xl`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-white/5 ${c.color}`}><c.icon className="w-6 h-6" /></div>
                  <span className={`text-xs px-2 py-1 border rounded font-paragraph ${c.badgeColor}`}>{c.badge}</span>
                </div>
                <h3 className="font-paragraph text-sm text-muted-text mb-2">{c.label}</h3>
                <p className="font-heading text-3xl font-bold text-foreground">{isLoading ? '...' : c.value}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Bar Chart */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-12">
          <div className="p-8 bg-glass-background backdrop-blur-md border border-primary/20 rounded-xl min-h-[400px]">
            <h2 className="font-heading text-2xl font-bold mb-6">Cost Comparison Analysis</h2>
            {!isLoading && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#888888" style={{ fontFamily: 'Azeret Mono', fontSize: '11px' }} angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#888888" style={{ fontFamily: 'Azeret Mono', fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(10,10,10,0.95)', border: '1px solid rgba(0,255,255,0.3)', borderRadius: '8px', fontFamily: 'Azeret Mono' }} />
                  <Legend wrapperStyle={{ fontFamily: 'Azeret Mono', fontSize: '12px' }} />
                  <Bar dataKey="planned" fill="#00FFFF" name="Planned Cost" />
                  <Bar dataKey="actual"  fill="#00FF7F" name="Actual Cost" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-muted-text font-paragraph">
                {isLoading ? 'Loading...' : 'No cost data available'}
              </div>
            )}
          </div>
        </motion.section>

        {/* Table */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <div className="p-8 bg-glass-background backdrop-blur-md border border-primary/20 rounded-xl">
            <h2 className="font-heading text-2xl font-bold mb-6">Detailed Cost Analysis</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary/20">
                    {['Item Name','Planned Cost','Actual Cost','Variance','Status'].map(h => (
                      <th key={h} className={`font-paragraph text-sm text-muted-text py-4 px-4 ${h==='Item Name'?'text-left':'text-right'} last:text-center`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? null : costAnalysis.length > 0 ? costAnalysis.map((item, i) => (
                    <motion.tr key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className="border-b border-primary/10 hover:bg-background/50 transition-all">
                      <td className="font-paragraph text-sm text-foreground py-4 px-4">{item.itemName}</td>
                      <td className="font-paragraph text-sm text-foreground text-right py-4 px-4">₹{item.plannedCost.toFixed(2)}</td>
                      <td className="font-paragraph text-sm text-foreground text-right py-4 px-4">₹{item.actualCost.toFixed(2)}</td>
                      <td className={`font-paragraph text-sm text-right py-4 px-4 font-semibold ${item.variance >= 0 ? 'text-chart-accent3' : 'text-destructive'}`}>
                        {item.variance >= 0 ? '+' : ''}₹{item.variance.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`text-xs px-2 py-1 border rounded font-paragraph ${item.variance >= 0 ? 'border-chart-accent3/30 text-chart-accent3' : 'border-destructive/30 text-destructive'}`}>
                          {item.variance >= 0 ? 'Profit' : 'Loss'}
                        </span>
                      </td>
                    </motion.tr>
                  )) : (
                    <tr><td colSpan={5} className="text-center py-12 text-muted-text font-paragraph">No cost analysis data available</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* Order Summary */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-12">
          <div className="p-8 bg-glass-background backdrop-blur-md border border-chart-accent2/20 rounded-xl">
            <h2 className="font-heading text-2xl font-bold mb-6">Order Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label:'Total Orders',  value: isLoading?'...':totalOrders,               color:'text-primary' },
                { label:'Total Quantity',value: isLoading?'...':totalOrderQty,              color:'text-chart-accent3' },
                { label:'Total Value',   value: isLoading?'...':`₹${totalOrderValue.toFixed(2)}`, color:'text-secondary' },
              ].map(s => (
                <div key={s.label} className="p-6 rounded-xl bg-background/50 border border-primary/10">
                  <p className="font-paragraph text-sm text-muted-text mb-2">{s.label}</p>
                  <p className={`font-heading text-4xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  )
}
