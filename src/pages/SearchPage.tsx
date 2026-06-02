import { useState, useMemo } from 'react'
import { portEntries, osiLayers, awsServicesSummary } from '../data/referenceData'
import { attackTypes, vpnProtocols } from '../data/netplusData'

interface SearchResult {
  id: string
  category: string
  categoryColor: string
  title: string
  detail: string
  meta?: string
}

function buildIndex(): SearchResult[] {
  const results: SearchResult[] = []

  portEntries.forEach(p => {
    results.push({
      id: `port-${p.port}`,
      category: 'Port',
      categoryColor: 'text-accent border-accent/30 bg-accent/5',
      title: `Port ${p.port} — ${p.service}`,
      detail: p.description,
      meta: p.protocol,
    })
  })

  osiLayers.forEach(l => {
    results.push({
      id: `osi-${l.number}`,
      category: 'OSI',
      categoryColor: 'text-purple-400 border-purple-400/30 bg-purple-400/5',
      title: `Layer ${l.number} — ${l.name}`,
      detail: l.function,
      meta: `PDU: ${l.pdu} · ${l.protocols.slice(0, 4).join(', ')}`,
    })
  })

  awsServicesSummary.forEach(s => {
    results.push({
      id: `aws-${s.name}`,
      category: s.category,
      categoryColor: 'text-aws border-aws/30 bg-aws/5',
      title: s.name,
      detail: s.tagline,
    })
  })

  attackTypes.forEach(a => {
    results.push({
      id: `atk-${a.name}`,
      category: 'Security',
      categoryColor: 'text-danger border-danger/30 bg-danger/5',
      title: a.name,
      detail: a.description,
      meta: a.category,
    })
  })

  vpnProtocols.forEach(v => {
    results.push({
      id: `vpn-${v.protocol}`,
      category: 'VPN',
      categoryColor: 'text-green-400 border-green-400/30 bg-green-400/5',
      title: v.protocol,
      detail: v.notes,
      meta: v.ports,
    })
  })

  return results
}

const INDEX = buildIndex()

const CATEGORY_FILTERS = [
  'All', 'Port', 'OSI', 'Security', 'VPN',
  'Compute', 'Storage', 'Database', 'Networking', 'Monitoring', 'Messaging', 'DevOps',
]

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-accent/25 text-accent rounded-sm px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return INDEX.filter(r => {
      const catMatch = activeCategory === 'All' || r.category === activeCategory
      if (!catMatch) return false
      if (!q) return true
      return (
        r.title.toLowerCase().includes(q) ||
        r.detail.toLowerCase().includes(q) ||
        (r.meta ?? '').toLowerCase().includes(q)
      )
    })
  }, [query, activeCategory])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] text-subtle font-mono tracking-widest uppercase mb-1">Reference Search</p>
        <h1 className="text-2xl font-bold text-slate-200 mb-1">Search Everything</h1>
        <p className="text-subtle text-sm">Ports, OSI layers, AWS services, security attacks, VPN protocols</p>
      </div>

      {/* Search input */}
      <div className="relative mb-5">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search ports, protocols, attacks, services..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-slate-200 placeholder:text-subtle text-sm focus:outline-none focus:border-accent/50 transition-colors"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-3 flex items-center text-subtle hover:text-slate-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORY_FILTERS.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              activeCategory === cat
                ? 'border-accent/50 bg-accent/10 text-accent'
                : 'border-border text-subtle hover:border-border/80 hover:text-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Result count */}
      <p className="text-[11px] text-subtle mb-4">
        {results.length} result{results.length !== 1 ? 's' : ''}
        {query && ` for "${query}"`}
      </p>

      {/* Results */}
      {results.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-10 h-10 text-subtle mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
          </svg>
          <p className="text-subtle text-sm">No results found for <span className="text-slate-300">"{query}"</span></p>
          <p className="text-subtle text-xs mt-1">Try a different keyword or category</p>
        </div>
      ) : (
        <div className="space-y-2">
          {results.map(r => (
            <div key={r.id} className="card p-4 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-start gap-3">
                <span className={`shrink-0 mt-0.5 text-[10px] px-2 py-0.5 rounded border font-mono font-medium ${r.categoryColor}`}>
                  {r.category}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-slate-200 text-sm font-medium mb-0.5">
                    {highlight(r.title, query)}
                  </p>
                  <p className="text-subtle text-xs leading-relaxed">
                    {highlight(r.detail, query)}
                  </p>
                  {r.meta && (
                    <p className="text-[10px] text-subtle font-mono mt-1.5 opacity-70">
                      {r.meta}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
