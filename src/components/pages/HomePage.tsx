import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Package, AlertTriangle, TrendingUp, TrendingDown,
  ShoppingCart, Activity, BarChart3, Cpu, Zap, Layers,
  ArrowRight, Database, Search
} from 'lucide-react'
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import Header from '../Header'
import Footer from '../Footer'
import { DataService } from '../../lib/dataService'

const SectionDivider = () => (
  <div className="w-full flex items-center justify-center py-12 opacity-30">
    <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
    <div className="mx-4 text-primary text-xs font-paragraph tracking-widest whitespace-nowrap">SYSTEM_DIVIDER</div>
    <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
  </div>
)

const CornerBrackets = () => (
  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/50" />
    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/50" />
    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/50" />
    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/50" />
  </div>
)

export default function HomePage() {
  const [inventory, setInventory]   = useState<any[]>([])
  const [alerts, setAlerts]         = useState<any[]>([])
  const [consumption, setConsumption] = useState<any[]>([])
  const [orders, setOrders]         = useState<any[]>([])
  const [isLoading, setIsLoading]   = useState(true)

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const heroY       = useTransform(scrollYProgress, [0, 0.2], [0, 100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  useEffect(() => {
    Promise.all([
      DataService.getAll('orders'),
      DataService.getAll('inventoryitems'),
      DataService.getAll('systemalerts'),
      DataService.getAll('actualconsumption'),
    ]).then(([o, inv, al, con]) => {
      setOrders((o as any).items)
      setInventory((inv as any).items)
      setAlerts((al as any).items)
      setConsumption((con as any).items)
      setIsLoading(false)
    })
  }, [])

  const totalOrders   = orders.length
  const totalStock    = inventory.reduce((s, i) => s + (i.currentStock || 0), 0)
  const reorderAlerts = inventory.filter(i => (i.currentStock || 0) <= (i.safetyStock || 0)).length
  const totalOrderValue = orders.reduce((s, o) => s + (o.totalValue || 0), 0)
  const totalActualCost = consumption.reduce((s, c) => s + ((c.actualQuantity || 0) * (c.actualRate || 0)), 0)
  const variance = totalOrderValue - totalActualCost
  const variancePercentage = totalOrderValue > 0 ? ((variance / totalOrderValue) * 100).toFixed(1) : '0'

  const consumptionTrend = consumption.slice(-7).map((c, i) => ({
    date: c.consumptionDateTime ? new Date(c.consumptionDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : `Day ${i+1}`,
    quantity: c.actualQuantity || 0,
    cost: (c.actualQuantity || 0) * (c.actualRate || 0),
  }))

  const stockLevelData = [
    { name: 'In Stock',      value: inventory.filter(i => (i.currentStock||0) > (i.safetyStock||0)).length,                                                 color: '#00FF7F' },
    { name: 'Low Stock',     value: inventory.filter(i => (i.currentStock||0) <= (i.safetyStock||0) && (i.currentStock||0) > 0).length,                     color: '#FF00FF' },
    { name: 'Out of Stock',  value: inventory.filter(i => (i.currentStock||0) === 0).length,                                                                color: '#FF0000' },
  ]

  const metrics = [
    { title: 'Total Orders',    value: totalOrders,           icon: ShoppingCart, color: 'text-primary',       border: 'border-primary/20',       sub: 'Active in pipeline' },
    { title: 'Current Stock',   value: totalStock,            icon: Package,      color: 'text-chart-accent3', border: 'border-chart-accent3/20', sub: 'Units across all warehouses' },
    { title: 'Reorder Alerts',  value: reorderAlerts,         icon: AlertTriangle,color: 'text-destructive',   border: 'border-destructive/20',   sub: 'Requires immediate attention' },
    { title: 'Variance Status', value: `${variancePercentage}%`, icon: variance >= 0 ? TrendingUp : TrendingDown, color: variance >= 0 ? 'text-chart-accent3' : 'text-destructive', border: variance >= 0 ? 'border-chart-accent3/20' : 'border-destructive/20', sub: variance >= 0 ? 'Profit Margin' : 'Loss Detected' },
  ]

  const commandModules = [
    { title: 'Production Planning', desc: 'Input BOM & Schedules',  icon: Layers,   link: '/production-planning',  hoverColor: 'group-hover:text-primary',       hoverBg: 'group-hover:bg-primary/10',       hoverBorder: 'group-hover:border-primary/50' },
    { title: 'Actual Consumption',  desc: 'Track Usage & Variance', icon: Database, link: '/actual-consumption',   hoverColor: 'group-hover:text-chart-accent3', hoverBg: 'group-hover:bg-chart-accent3/10', hoverBorder: 'group-hover:border-chart-accent3/50' },
    { title: 'AI Prediction',       desc: 'Forecast Shortages',     icon: Zap,      link: '/inventory-prediction', hoverColor: 'group-hover:text-secondary',     hoverBg: 'group-hover:bg-secondary/10',     hoverBorder: 'group-hover:border-secondary/50' },
    { title: 'System Reports',      desc: 'Deep Dive Analytics',    icon: Search,   link: '/reports',              hoverColor: 'group-hover:text-white',         hoverBg: 'group-hover:bg-white/10',         hoverBorder: 'group-hover:border-white/50' },
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground overflow-clip grid-bg selection:bg-primary/30 selection:text-primary-foreground">
      <Header />
      <main className="w-full relative">

        {/* ── HERO ── */}
        <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden px-6">
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background z-10" />
            <img
              src="https://static.wixstatic.com/media/153483_e35d3fe2ccb64dbaacb3b21c86e27002~mv2.png"
              alt="Digital Infrastructure"
              className="w-full h-full object-cover opacity-40"
            />
          </motion.div>

          <div className="relative z-10 w-full max-w-[120rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse-dot" />
                  <span className="font-paragraph text-xs tracking-[0.2em] text-primary uppercase">System Operational</span>
                </div>
                <h1 className="font-heading text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter mb-6">
                  QUANTUM<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary">INVENTORY</span>
                </h1>
                <p className="font-paragraph text-lg md:text-xl text-muted-text max-w-2xl leading-relaxed border-l-2 border-primary/30 pl-6">
                  The next generation of predictive logistics. Monitor, analyze, and optimize your supply chain with AI-driven precision.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="flex flex-wrap gap-4 mt-8">
                <Link to="/inventory-prediction">
                  <button className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-heading tracking-wide border border-primary relative overflow-hidden group hover:opacity-90 transition-opacity">
                    <span className="relative z-10 flex items-center gap-2"><Zap className="w-4 h-4" /> Initialize Prediction</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </button>
                </Link>
                <Link to="/reports">
                  <button className="px-6 py-3 border border-secondary text-secondary hover:bg-secondary/10 font-heading tracking-wide transition-colors">
                    View Analytics
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* HUD */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="relative aspect-square">
                <div className="absolute inset-0 border border-primary/20 rounded-full animate-spin-slow" />
                <div className="absolute inset-4 border border-secondary/20 rounded-full animate-spin-slow-rev" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 bg-glass-background backdrop-blur-xl border border-white/10 rounded-full flex flex-col items-center justify-center text-center p-6 shadow-[0_0_50px_rgba(0,255,255,0.1)]">
                    <Cpu className="w-12 h-12 text-primary mb-4" />
                    <div className="font-heading text-4xl font-bold text-white">{isLoading ? '...' : totalStock}</div>
                    <div className="font-paragraph text-xs text-muted-text uppercase tracking-widest mt-2">Total Units Tracked</div>
                  </div>
                </div>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-0 right-0 bg-black/80 border border-primary/30 p-4 backdrop-blur-md">
                  <div className="text-xs text-primary font-paragraph mb-1">ACTIVE ORDERS</div>
                  <div className="text-2xl font-heading font-bold">{isLoading ? '...' : totalOrders}</div>
                </motion.div>
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute bottom-10 left-0 bg-black/80 border border-secondary/30 p-4 backdrop-blur-md">
                  <div className="text-xs text-secondary font-paragraph mb-1">CRITICAL ALERTS</div>
                  <div className="text-2xl font-heading font-bold text-destructive">{isLoading ? '...' : reorderAlerts}</div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── TICKER ── */}
        <div className="w-full bg-primary/5 border-y border-primary/10 overflow-hidden py-3">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-12 mx-6 shrink-0">
                {alerts.slice(0, 5).map((a, idx) => (
                  <div key={`${i}-${idx}`} className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-secondary" />
                    <span className="font-paragraph text-sm text-muted-text uppercase">{a.message || 'System Nominal'}</span>
                    <span className="text-primary/30">///</span>
                  </div>
                ))}
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="font-paragraph text-sm text-primary uppercase">LIVE DATA FEED ACTIVE</span>
                  <span className="text-primary/30">///</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── METRICS ── */}
        <section className="w-full max-w-[120rem] mx-auto px-6 py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-3">
              <div className="sticky top-32">
                <h2 className="font-heading text-4xl font-bold mb-4 text-white">SYSTEM<br />METRICS</h2>
                <p className="font-paragraph text-sm text-muted-text mb-8">Real-time telemetry of your inventory ecosystem.</p>
                <div className="h-1 w-24 bg-primary mb-8" />
                <div className="font-paragraph text-xs text-muted-text mb-2">LAST UPDATED</div>
                <div className="font-mono text-primary">{new Date().toLocaleTimeString()}</div>
              </div>
            </div>
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
              {metrics.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className={`relative p-8 bg-glass-background backdrop-blur-md border ${m.border} hover:bg-white/5 transition-all duration-500 group overflow-hidden`}>
                    <CornerBrackets />
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-3 rounded-lg bg-white/5 ${m.color}`}><m.icon className="w-6 h-6" /></div>
                      <div className="font-paragraph text-xs text-muted-text tracking-widest">0{i + 1}</div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-paragraph text-sm text-muted-text uppercase tracking-wider">{m.title}</h3>
                      <div className="font-heading text-5xl font-bold text-white group-hover:scale-105 transition-transform origin-left">
                        {isLoading ? '...' : m.value}
                      </div>
                      <p className="font-paragraph text-xs text-muted-text/60 pt-2 border-t border-white/5 mt-4">{m.sub}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ── ANALYTICS ── */}
        <section className="w-full max-w-[120rem] mx-auto px-6 py-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-5xl font-bold mb-2">ANALYTICS ENGINE</h2>
              <p className="font-paragraph text-muted-text">Visualizing consumption patterns and stock distribution.</p>
            </div>
            <Link to="/reports" className="hidden md:flex items-center gap-2 text-primary hover:text-white transition-colors font-paragraph text-sm">
              FULL REPORT <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Line Chart */}
            <motion.div className="lg:col-span-2 h-[500px] relative group" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <div className="absolute inset-0 bg-glass-background backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-50" />
                <div className="p-6 flex justify-between items-center border-b border-white/5">
                  <div className="flex items-center gap-3"><Activity className="w-5 h-5 text-primary" /><h3 className="font-heading text-lg">Consumption Trend</h3></div>
                  <div className="flex gap-4 text-xs font-paragraph text-muted-text">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> QTY</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-secondary" /> COST</span>
                  </div>
                </div>
                <div className="p-6 h-[calc(100%-80px)]">
                  {isLoading ? <div className="w-full h-full flex items-center justify-center text-muted-text">Loading...</div>
                  : consumptionTrend.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={consumptionTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="date" stroke="#444" tick={{ fill: '#888', fontFamily: 'Azeret Mono', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                        <YAxis stroke="#444" tick={{ fill: '#888', fontFamily: 'Azeret Mono', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
                        <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Azeret Mono' }} />
                        <Line type="step" dataKey="quantity" stroke="#00FFFF" strokeWidth={2} dot={{ fill: '#0A0A0A', stroke: '#00FFFF', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#00FFFF' }} />
                        <Line type="step" dataKey="cost" stroke="#FF00FF" strokeWidth={2} dot={{ fill: '#0A0A0A', stroke: '#FF00FF', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#FF00FF' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : <div className="w-full h-full flex items-center justify-center text-muted-text font-paragraph">No Data Available</div>}
                </div>
              </div>
            </motion.div>

            {/* Pie Chart */}
            <motion.div className="h-[500px] relative" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="absolute inset-0 bg-glass-background backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/5"><div className="flex items-center gap-3"><BarChart3 className="w-5 h-5 text-secondary" /><h3 className="font-heading text-lg">Stock Distribution</h3></div></div>
                <div className="flex-1 relative flex items-center justify-center p-6">
                  {stockLevelData.some(d => d.value > 0) ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={stockLevelData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value" stroke="none">
                          {stockLevelData.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Azeret Mono' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="square" formatter={(v) => <span className="text-muted-text font-paragraph text-xs ml-2">{v}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : <div className="text-muted-text font-paragraph">No Stock Data</div>}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-3xl font-heading font-bold text-white">{totalStock}</div>
                      <div className="text-xs text-muted-text font-paragraph">TOTAL UNITS</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── COMMAND MODULES ── */}
        <section className="w-full bg-white/5 border-t border-white/10 py-24 mt-12">
          <div className="w-full max-w-[120rem] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="font-heading text-4xl font-bold mb-4">COMMAND MODULES</h2>
                <p className="font-paragraph text-muted-text max-w-xl">Direct access to core system functions. Manage production, track consumption, and generate AI predictions.</p>
              </div>
              <div className="flex gap-2">
                {['bg-primary', 'bg-secondary', 'bg-white'].map((c, i) => (
                  <div key={i} className={`w-3 h-3 ${c} rounded-full animate-pulse-dot`} style={{ animationDelay: `${i * 75}ms` }} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {commandModules.map((m, i) => (
                <Link key={i} to={m.link} className="block h-full">
                  <motion.div
                    className={`h-full p-8 bg-black border border-white/10 transition-all duration-300 group relative overflow-hidden ${m.hoverBorder}`}
                    whileHover={{ y: -5 }}
                  >
                    <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${m.hoverBg}`} />
                    <div className="relative z-10 flex flex-col h-full justify-between min-h-[200px]">
                      <div className="flex justify-between items-start">
                        <m.icon className={`w-8 h-8 text-muted-text transition-colors duration-300 ${m.hoverColor}`} />
                        <ArrowRight className={`w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300 text-muted-text ${m.hoverColor}`} />
                      </div>
                      <div>
                        <h3 className="font-heading text-xl font-bold mb-2 text-white group-hover:translate-x-2 transition-transform duration-300">{m.title}</h3>
                        <p className="font-paragraph text-sm text-muted-text">{m.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── SYSTEM LOGS ── */}
        <section className="w-full max-w-[120rem] mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl font-bold mb-6">SYSTEM LOGS</h2>
              <div className="space-y-4">
                {alerts.slice(0, 4).map((a, i) => (
                  <motion.div key={a._id || i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 border-l-2 border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${a.severity === 'High' || a.severity === 'Critical' ? 'bg-destructive' : 'bg-primary'}`} />
                    <div className="flex-1">
                      <div className="font-paragraph text-xs text-muted-text mb-1">
                        {a.generatedAt ? new Date(a.generatedAt).toLocaleString() : 'Unknown Time'}
                      </div>
                      <div className="font-heading text-sm font-semibold text-white">{a.message}</div>
                    </div>
                    <span className="border border-white/20 text-xs text-muted-text px-2 py-1">{a.type || 'System'}</span>
                  </motion.div>
                ))}
                {alerts.length === 0 && <div className="text-muted-text font-paragraph italic">No active system alerts.</div>}
              </div>
              <div className="mt-8">
                <Link to="/alerts" className="flex items-center gap-2 text-primary hover:text-white transition-colors font-paragraph text-sm">
                  VIEW ALL LOGS <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] w-full overflow-hidden rounded-2xl">
              <img src="https://static.wixstatic.com/media/153483_65253f4c4dbc4bd1a0fd098efe300de7~mv2.png" alt="Data Visualization" className="w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="font-heading text-2xl font-bold mb-2">INTELLIGENT MONITORING</div>
                <p className="font-paragraph text-sm text-muted-text">Our AI constantly scans for anomalies in your supply chain, ensuring you stay ahead of shortages before they impact production.</p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
