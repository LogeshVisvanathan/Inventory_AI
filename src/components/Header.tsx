import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LayoutDashboard } from 'lucide-react'

const navLinks = [
  { path: '/',                     label: 'Dashboard',           icon: LayoutDashboard },
  { path: '/production-planning',  label: 'Production Planning' },
  { path: '/actual-consumption',   label: 'Actual Consumption' },
  { path: '/inventory-prediction', label: 'AI Prediction' },
  { path: '/reports',              label: 'Reports' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/80 backdrop-blur-xl">
      <div className="w-full max-w-[120rem] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-chart-accent3 flex items-center justify-center">
                <span className="font-heading text-xl font-bold text-background">Q</span>
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-none">
                  Quantum
                </h1>
                <p className="font-paragraph text-xs text-muted-text">Inventory AI</p>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg font-paragraph text-sm transition-all ${
                    isActive(link.path)
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'text-muted-text hover:text-foreground hover:bg-glass-background'
                  }`}
                >
                  {link.label}
                </motion.div>
              </Link>
            ))}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/alerts">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-heading font-semibold text-sm tracking-wide hover:bg-primary/90 transition-all"
              >
                System Alerts
              </motion.button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-glass-background border border-primary/20 hover:border-primary/50 transition-all"
          >
            {isMenuOpen
              ? <X className="w-6 h-6 text-primary" />
              : <Menu className="w-6 h-6 text-primary" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 overflow-hidden"
            >
              <nav className="flex flex-col gap-2 pb-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className={`px-4 py-3 rounded-lg font-paragraph text-sm transition-all ${
                      isActive(link.path)
                        ? 'bg-primary/10 text-primary border border-primary/30'
                        : 'text-muted-text hover:text-foreground hover:bg-glass-background'
                    }`}>
                      {link.label}
                    </div>
                  </Link>
                ))}
                <Link to="/alerts" onClick={() => setIsMenuOpen(false)}>
                  <div className="px-4 py-3 rounded-lg font-paragraph text-sm bg-primary/10 text-primary border border-primary/30">
                    System Alerts
                  </div>
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
