import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Zap, Activity } from 'lucide-react'
import Header from '../Header'
import Footer from '../Footer'

interface FormData {
  Planned_Qty: string
  Actual_Qty: string
  Planned_Rate: string
  Actual_Rate: string
  Current_Stock: string
  Lead_Time: string
  Safety_Stock: string
}

interface PredictionResult {
  Predicted_Consumption: number
  Reorder_Level: number
  Reorder_Quantity: number
  Variance: number
  Alert: string
}

const CornerBrackets = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-secondary/50" />
    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-secondary/50" />
    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-secondary/50" />
    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-secondary/50" />
  </div>
)

export default function InventoryPredictionPage() {
  const [form, setForm] = useState<FormData>({
    Planned_Qty:   '',
    Actual_Qty:    '',
    Planned_Rate:  '',
    Actual_Rate:   '',
    Current_Stock: '',
    Lead_Time:     '',
    Safety_Stock:  '',
  })
  const [result, setResult]         = useState<PredictionResult | null>(null)
  const [isPredicting, setIsPredicting] = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [apiStatus, setApiStatus]   = useState<'idle' | 'ok' | 'error'>('idle')

  const handleChange = (key: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handlePredict = async () => {
    setIsPredicting(true)
    setError(null)
    setResult(null)
    setApiStatus('idle')

    try {
      const payload = {
        Planned_Qty:   parseFloat(form.Planned_Qty),
        Actual_Qty:    parseFloat(form.Actual_Qty),
        Planned_Rate:  parseFloat(form.Planned_Rate),
        Actual_Rate:   parseFloat(form.Actual_Rate),
        Current_Stock: parseFloat(form.Current_Stock),
        Lead_Time:     parseFloat(form.Lead_Time),
        Safety_Stock:  parseFloat(form.Safety_Stock),
      }

      const res = await axios.post('http://127.0.0.1:5000/predict', payload)
      setResult(res.data)
      setApiStatus('ok')
    } catch (err: any) {
      setApiStatus('error')
      setError(
        err?.response?.data?.error ||
        'Cannot reach Flask API. Make sure the backend is running on http://127.0.0.1:5000'
      )
    } finally {
      setIsPredicting(false)
    }
  }

  const isFormValid = Object.values(form).every(v => v !== '' && !isNaN(parseFloat(v)))

  const isReorder     = result?.Alert === 'REORDER REQUIRED'
  const varianceColor = result ? (result.Variance <= 0 ? 'text-chart-accent3' : 'text-destructive') : 'text-foreground'

  // Stock level % relative to reorder level
  const stockPct = result
    ? Math.min((parseFloat(form.Current_Stock) / Math.max(result.Reorder_Level, 1)) * 100, 100)
    : 0

  const inputFields: { label: string; key: keyof FormData; placeholder: string; hint?: string }[] = [
    { label: 'Planned Quantity',  key: 'Planned_Qty',   placeholder: '500',   hint: 'units' },
    { label: 'Actual Quantity',   key: 'Actual_Qty',    placeholder: '480',   hint: 'units' },
    { label: 'Planned Rate (₹)',  key: 'Planned_Rate',  placeholder: '85.00' },
    { label: 'Actual Rate (₹)',   key: 'Actual_Rate',   placeholder: '87.50' },
    { label: 'Current Stock',     key: 'Current_Stock', placeholder: '450',   hint: 'units' },
    { label: 'Lead Time',         key: 'Lead_Time',     placeholder: '7',     hint: 'days' },
    { label: 'Safety Stock',      key: 'Safety_Stock',  placeholder: '100',   hint: 'units' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground grid-bg">
      <Header />

      <main className="w-full max-w-[120rem] mx-auto px-6 py-12">

        {/* Page Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-secondary/10">
              <Brain className="w-8 h-8 text-secondary" />
            </div>
            <div>
              <h1 className="font-heading text-5xl font-bold bg-gradient-to-r from-secondary via-primary to-chart-accent3 bg-clip-text text-transparent">
                AI Inventory Prediction
              </h1>
              <p className="font-paragraph text-lg text-muted-text mt-2">
                ML-powered shortage forecasting and intelligent reorder recommendations
              </p>
            </div>
          </div>

          {/* Pipeline visual */}
          <div className="flex flex-wrap items-center gap-2 mt-6 font-paragraph text-xs text-muted-text">
            {['React UI', 'Axios POST', 'Flask /predict', 'inventory_model.pkl', 'Reorder Formula', 'Variance Formula', 'JSON Response'].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span className="px-2 py-1 border border-primary/20 text-primary bg-primary/5">{step}</span>
                {i < arr.length - 1 && <span className="text-primary/30">→</span>}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">

          {/* ── INPUT FORM ── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="relative p-8 bg-glass-background backdrop-blur-md border border-secondary/20 rounded-xl overflow-hidden">
              <CornerBrackets />
              <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-secondary" />
                Input Parameters
              </h2>

              <div className="space-y-5">
                {inputFields.map(f => (
                  <div key={f.key}>
                    <label className="font-paragraph text-sm text-muted-text mb-2 block tracking-wide">
                      {f.label} {f.hint && <span className="text-xs text-primary/60">({f.hint})</span>}
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={form[f.key]}
                      onChange={e => handleChange(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full bg-background/60 border border-secondary/20 focus:border-secondary text-foreground font-paragraph text-sm px-4 py-3 rounded-lg outline-none transition-colors placeholder:text-muted-text/40"
                    />
                  </div>
                ))}

                {/* Cost preview */}
                <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20 grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-paragraph text-xs text-muted-text mb-1">Planned Cost</p>
                    <p className="font-heading text-xl font-bold text-primary">
                      ₹{((parseFloat(form.Planned_Qty)||0) * (parseFloat(form.Planned_Rate)||0)).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="font-paragraph text-xs text-muted-text mb-1">Actual Cost</p>
                    <p className="font-heading text-xl font-bold text-secondary">
                      ₹{((parseFloat(form.Actual_Qty)||0) * (parseFloat(form.Actual_Rate)||0)).toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handlePredict}
                  disabled={!isFormValid || isPredicting}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-secondary text-secondary-foreground font-heading font-bold tracking-wide hover:bg-secondary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10 flex items-center gap-2">
                    {isPredicting ? (
                      <>
                        <Activity className="w-5 h-5 animate-spin" />
                        Analyzing with ML Model...
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5" />
                        Generate AI Prediction
                      </>
                    )}
                  </span>
                </button>

                {/* API status indicator */}
                {apiStatus !== 'idle' && (
                  <div className={`flex items-center gap-2 text-xs font-paragraph ${apiStatus === 'ok' ? 'text-chart-accent3' : 'text-destructive'}`}>
                    <div className={`w-2 h-2 rounded-full ${apiStatus === 'ok' ? 'bg-chart-accent3' : 'bg-destructive'}`} />
                    {apiStatus === 'ok' ? 'Flask API responded successfully' : 'Flask API connection failed'}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── RESULTS ── */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="relative p-8 bg-glass-background backdrop-blur-md border border-secondary/20 rounded-xl min-h-[600px] overflow-hidden">
              <CornerBrackets />
              <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
                <Activity className="w-6 h-6 text-primary" />
                Prediction Results
              </h2>

              {error && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                    <div>
                      <p className="font-heading text-sm font-semibold text-destructive mb-1">API Error</p>
                      <p className="font-paragraph text-xs text-muted-text">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {result ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">

                  {/* Alert Banner */}
                  <div className={`p-5 rounded-xl border flex items-center gap-4 ${isReorder ? 'bg-destructive/10 border-destructive/30' : 'bg-chart-accent3/10 border-chart-accent3/30'}`}>
                    {isReorder
                      ? <AlertTriangle className="w-8 h-8 text-destructive shrink-0" />
                      : <CheckCircle className="w-8 h-8 text-chart-accent3 shrink-0" />}
                    <div>
                      <p className={`font-heading text-xl font-bold ${isReorder ? 'text-destructive' : 'text-chart-accent3'}`}>
                        {result.Alert}
                      </p>
                      <p className="font-paragraph text-xs text-muted-text mt-1">
                        {isReorder
                          ? `Order ${result.Reorder_Quantity.toFixed(0)} units immediately to prevent stockout.`
                          : 'Current stock levels are sufficient for the lead time period.'}
                      </p>
                    </div>
                  </div>

                  {/* Stock Level Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-paragraph text-sm text-muted-text">Stock vs Reorder Level</p>
                      <p className="font-paragraph text-sm font-semibold text-foreground">{stockPct.toFixed(0)}%</p>
                    </div>
                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stockPct}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full rounded-full ${stockPct < 50 ? 'bg-destructive' : stockPct < 80 ? 'bg-secondary' : 'bg-chart-accent3'}`}
                      />
                    </div>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Predicted Consumption', value: result.Predicted_Consumption.toFixed(0), unit: 'units/cycle', color: 'text-primary', border: 'border-primary/20', bg: 'bg-primary/5' },
                      { label: 'Reorder Level', value: result.Reorder_Level.toFixed(0), unit: 'units trigger', color: 'text-secondary', border: 'border-secondary/20', bg: 'bg-secondary/5' },
                      { label: 'Reorder Quantity', value: result.Reorder_Quantity.toFixed(0), unit: 'units to order', color: isReorder ? 'text-destructive' : 'text-chart-accent3', border: isReorder ? 'border-destructive/20' : 'border-chart-accent3/20', bg: isReorder ? 'bg-destructive/5' : 'bg-chart-accent3/5' },
                      { label: 'Cost Variance', value: `₹${Math.abs(result.Variance).toFixed(0)}`, unit: result.Variance <= 0 ? 'saved' : 'over budget', color: varianceColor, border: 'border-white/10', bg: 'bg-white/5' },
                    ].map((m, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className={`p-4 rounded-xl ${m.bg} border ${m.border}`}>
                        <p className="font-paragraph text-xs text-muted-text mb-2">{m.label}</p>
                        <p className={`font-heading text-2xl font-bold ${m.color}`}>{m.value}</p>
                        <p className="font-paragraph text-xs text-muted-text/60 mt-1">{m.unit}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Full Breakdown */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-secondary/10 to-primary/10 border border-secondary/20">
                    <h4 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-secondary" /> Full Analysis
                    </h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Predicted Consumption', val: result.Predicted_Consumption.toFixed(2) + ' units' },
                        { label: 'Reorder Level',         val: result.Reorder_Level.toFixed(2) + ' units' },
                        { label: 'Reorder Quantity',      val: result.Reorder_Quantity.toFixed(2) + ' units' },
                        { label: 'Cost Variance',         val: `₹${result.Variance.toFixed(2)}` },
                        { label: 'Alert',                 val: result.Alert },
                      ].map(row => (
                        <div key={row.label} className="flex items-center justify-between">
                          <p className="font-paragraph text-sm text-muted-text">{row.label}</p>
                          <p className={`font-paragraph text-sm font-semibold ${row.label === 'Alert' ? (isReorder ? 'text-destructive' : 'text-chart-accent3') : 'text-foreground'}`}>
                            {row.val}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* API Response raw JSON */}
                  <details className="group">
                    <summary className="font-paragraph text-xs text-muted-text cursor-pointer hover:text-primary transition-colors">
                      View raw API response ↓
                    </summary>
                    <pre className="mt-2 p-4 bg-black/60 border border-white/10 rounded-lg text-xs text-chart-accent3 font-mono overflow-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </details>
                </motion.div>
              ) : (
                !error && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative mb-6">
                      <Brain className="w-20 h-20 text-muted-text opacity-30" />
                      <div className="absolute inset-0 border border-secondary/20 rounded-full animate-ping" />
                    </div>
                    <p className="font-paragraph text-muted-text text-center max-w-xs">
                      Fill in the input parameters and click <span className="text-secondary">Generate AI Prediction</span> to see ML-powered insights.
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-text/60 font-paragraph">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      Flask API: <code className="text-primary ml-1">http://127.0.0.1:5000/predict</code>
                    </div>
                  </div>
                )
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
