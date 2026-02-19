import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, AlertTriangle, Info, CheckCircle, Trash2 } from 'lucide-react'
import Header from '../Header'
import Footer from '../Footer'
import { DataService } from '../../lib/dataService'

export default function AlertsPage() {
  const [alerts, setAlerts]     = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast]       = useState<{ msg: string; type: 'ok'|'err' }|null>(null)

  const showToast = (msg: string, type: 'ok'|'err' = 'ok') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    DataService.getAll('systemalerts').then(r => {
      const items = (r as any).items.sort((a: any, b: any) =>
        new Date(b.generatedAt||0).getTime() - new Date(a.generatedAt||0).getTime()
      )
      setAlerts(items); setIsLoading(false)
    })
  }, [])

  const markRead = async (id: string) => {
    setAlerts(a => a.map(x => x._id===id ? { ...x, isRead: true } : x))
    await DataService.update('systemalerts', { _id: id, isRead: true })
  }

  const deleteAlert = async (id: string) => {
    setAlerts(a => a.filter(x => x._id !== id))
    await DataService.delete('systemalerts', id)
    showToast('Alert deleted')
  }

  const severityIcon = (s?: string) => {
    switch (s?.toLowerCase()) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-destructive" />
      case 'high':     return <AlertTriangle className="w-5 h-5 text-destructive" />
      case 'warning':  return <AlertTriangle className="w-5 h-5 text-secondary" />
      case 'info':     return <Info className="w-5 h-5 text-primary" />
      default:         return <Bell className="w-5 h-5 text-muted-text" />
    }
  }

  const severityClass = (s?: string) => {
    switch (s?.toLowerCase()) {
      case 'critical':
      case 'high':    return { text: 'text-destructive', border: 'border-destructive/30', bg: 'bg-destructive/10' }
      case 'warning': return { text: 'text-secondary',   border: 'border-secondary/30',  bg: 'bg-secondary/10' }
      case 'info':    return { text: 'text-primary',     border: 'border-primary/30',    bg: 'bg-primary/10' }
      default:        return { text: 'text-muted-text',  border: 'border-white/10',      bg: 'bg-white/5' }
    }
  }

  const unreadCount = alerts.filter(a => !a.isRead).length

  return (
    <div className="min-h-screen bg-background text-foreground grid-bg">
      <Header />
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg border font-paragraph text-sm ${toast.type==='ok'?'bg-chart-accent3/10 border-chart-accent3/30 text-chart-accent3':'bg-destructive/10 border-destructive/30 text-destructive'}`}>
          {toast.msg}
        </div>
      )}
      <main className="w-full max-w-[120rem] mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10"><Bell className="w-8 h-8 text-primary" /></div>
              <div>
                <h1 className="font-heading text-5xl font-bold bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">System Alerts</h1>
                <p className="font-paragraph text-lg text-muted-text mt-2">Monitor critical notifications and warnings</p>
              </div>
            </div>
            {unreadCount > 0 && (
              <span className="border border-destructive/30 text-destructive text-lg px-4 py-2 font-paragraph">
                {unreadCount} Unread
              </span>
            )}
          </div>
        </motion.div>

        <section className="mt-12 space-y-4 min-h-[600px]">
          {isLoading ? <div className="text-muted-text font-paragraph">Loading...</div>
          : alerts.length > 0 ? alerts.map((alert, i) => {
            const sc = severityClass(alert.severity)
            return (
              <motion.div key={alert._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <div className={`p-6 bg-glass-background backdrop-blur-md border rounded-xl transition-all ${alert.isRead ? 'border-primary/10 opacity-70' : `${sc.border} hover:border-opacity-75`}`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${sc.bg} shrink-0`}>{severityIcon(alert.severity)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-xs px-2 py-1 border rounded font-paragraph ${sc.text} ${sc.border}`}>
                              {alert.severity?.toUpperCase() || 'ALERT'}
                            </span>
                            {alert.type && <span className="font-paragraph text-xs text-muted-text">{alert.type}</span>}
                          </div>
                          <p className="font-paragraph text-base text-foreground leading-relaxed">{alert.message}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {!alert.isRead && (
                            <button onClick={() => markRead(alert._id)}
                              className="flex items-center gap-1 text-chart-accent3 hover:bg-chart-accent3/10 px-3 py-2 rounded-lg text-sm font-paragraph transition-colors">
                              <CheckCircle className="w-4 h-4" /> Mark Read
                            </button>
                          )}
                          <button onClick={() => deleteAlert(alert._id)}
                            className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-primary/10">
                        <p className="font-paragraph text-xs text-muted-text">
                          {alert.generatedAt ? new Date(alert.generatedAt).toLocaleString() : 'Unknown time'}
                        </p>
                        {alert.isRead && <span className="text-xs px-2 py-1 border border-chart-accent3/30 text-chart-accent3 rounded font-paragraph">Read</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          }) : (
            <div className="p-16 bg-glass-background backdrop-blur-md border border-primary/20 rounded-xl text-center">
              <Bell className="w-20 h-20 text-muted-text mx-auto mb-4 opacity-50" />
              <h3 className="font-heading text-2xl font-semibold mb-2">No Alerts</h3>
              <p className="font-paragraph text-muted-text">All clear! No system alerts at this time.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
