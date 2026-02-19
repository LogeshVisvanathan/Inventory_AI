import { Link } from 'react-router-dom'
import { Github, Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-primary/20 bg-background">
      <div className="w-full max-w-[120rem] mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-chart-accent3 flex items-center justify-center">
                <span className="font-heading text-xl font-bold text-background">Q</span>
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Quantum
                </h2>
                <p className="font-paragraph text-xs text-muted-text">
                  Inventory AI
                </p>
              </div>
            </div>
            <p className="font-paragraph text-sm text-muted-text leading-relaxed">
              AI-powered inventory monitoring dashboard for predictive analytics and smart reorder management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Dashboard' },
                { to: '/production-planning', label: 'Production Planning' },
                { to: '/actual-consumption', label: 'Actual Consumption' },
                { to: '/inventory-prediction', label: 'AI Prediction' },
              ].map(l => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="font-paragraph text-sm text-muted-text hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {[
                { to: '/reports', label: 'Reports' },
                { to: '/alerts', label: 'System Alerts' },
                { to: '/inventory', label: 'Inventory Items' },
                { to: '/orders', label: 'Orders' },
              ].map(l => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="font-paragraph text-sm text-muted-text hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
              Connect
            </h3>

            <p className="font-paragraph text-sm text-muted-text mb-2">
              Contact: 6381975196
            </p>

            <div className="flex items-center gap-3 mt-3">

              {/* GitHub */}
              <a
                href="https://github.com/LogeshVisvanathan"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-glass-background border border-primary/20 hover:border-primary/50 transition-all"
              >
                <Github className="w-5 h-5 text-primary" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/logeshjd"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-glass-background border border-primary/20 hover:border-primary/50 transition-all"
              >
                <Linkedin className="w-5 h-5 text-primary" />
              </a>

              {/* Twitter */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-glass-background border border-primary/20 hover:border-primary/50 transition-all"
              >
                <Twitter className="w-5 h-5 text-primary" />
              </a>

            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex flex-col md:flex-row items-center gap-1">
            <p className="font-paragraph text-sm text-muted-text">
              © {year} Quantum Inventory AI. All rights reserved.
            </p>
            <p className="font-paragraph text-xs text-muted-text">
              Developed by{" "}
              <span className="text-primary font-semibold">
                Logesh Visvanathan (MCA)
              </span>
            </p>
          </div>

          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Contact'].map(t => (
              <a
                key={t}
                href="#"
                className="font-paragraph text-sm text-muted-text hover:text-primary transition-colors"
              >
                {t}
              </a>
            ))}
          </div>

        </div>

      </div>
    </footer>
  )
}
