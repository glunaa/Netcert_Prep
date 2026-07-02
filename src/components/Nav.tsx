import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/netplus', label: 'Net+' },
  { to: '/aws', label: 'AWS' },
  { to: '/vlsm', label: 'VLSM' },
  { to: '/cli', label: 'CLI Ref' },
  { to: '/vpc', label: 'VPC' },
  { to: '/flashcards', label: 'Flashcards' },
  { to: '/subnet-drill', label: 'Drill' },
  { to: '/analytics', label: 'Analytics' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-void/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center glow-accent">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-accent fill-none stroke-current stroke-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-wider text-slate-200 group-hover:text-accent transition-colors">
              NET<span className="text-accent">CERT</span>
            </span>
          </NavLink>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTA buttons */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink
              to="/search"
              className="p-1.5 rounded-lg text-subtle hover:text-slate-200 hover:bg-white/5 transition-colors"
              aria-label="Search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
              </svg>
            </NavLink>
            <NavLink
              to="/netplus/test"
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-accent/30 text-accent hover:bg-accent/10 transition-colors"
            >
              Net+ Test
            </NavLink>
            <NavLink
              to="/aws/test"
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-aws/30 text-aws hover:bg-aws/10 transition-colors"
            >
              AWS Test
            </NavLink>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-subtle hover:text-slate-200 transition-colors"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-surface">
          <div className="px-4 py-3 flex flex-col gap-1">
            {links.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-accent/10 text-accent' : 'text-subtle hover:text-slate-200 hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-border flex gap-2">
              <NavLink
                to="/netplus/test"
                onClick={() => setOpen(false)}
                className="flex-1 text-center px-3 py-2 text-xs font-medium rounded-lg border border-accent/30 text-accent hover:bg-accent/10 transition-colors"
              >
                Net+ Test
              </NavLink>
              <NavLink
                to="/aws/test"
                onClick={() => setOpen(false)}
                className="flex-1 text-center px-3 py-2 text-xs font-medium rounded-lg border border-aws/30 text-aws hover:bg-aws/10 transition-colors"
              >
                AWS Test
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
