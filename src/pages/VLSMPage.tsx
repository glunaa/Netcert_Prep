import { useState } from 'react'
import { calculateVLSM } from '../utils/vlsm'
import type { SubnetInput, SubnetResult } from '../types'

let nextId = 1
function makeId() { return String(nextId++) }

function defaultSubnets(): SubnetInput[] {
  return [
    { id: makeId(), label: 'Subnet A', hosts: 50 },
    { id: makeId(), label: 'Subnet B', hosts: 25 },
  ]
}

export default function VLSMPage() {
  const [networkIp, setNetworkIp] = useState('192.168.1.0')
  const [prefix, setPrefix] = useState(24)
  const [subnets, setSubnets] = useState<SubnetInput[]>(defaultSubnets)
  const [results, setResults] = useState<SubnetResult[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  function addSubnet() {
    setSubnets((prev) => [...prev, { id: makeId(), label: `Subnet ${String.fromCharCode(65 + prev.length)}`, hosts: 10 }])
  }

  function removeSubnet(id: string) {
    setSubnets((prev) => prev.filter((s) => s.id !== id))
  }

  function updateSubnet(id: string, field: 'label' | 'hosts', value: string) {
    setSubnets((prev) => prev.map((s) => s.id !== id ? s : { ...s, [field]: field === 'hosts' ? Math.max(1, parseInt(value) || 1) : value }))
  }

  function calculate() {
    setError(null)
    setResults(null)
    const res = calculateVLSM(networkIp, prefix, subnets)
    if ('error' in res) {
      setError(res.error)
    } else {
      setResults(res)
    }
  }

  function reset() {
    setNetworkIp('192.168.1.0')
    setPrefix(24)
    setSubnets(defaultSubnets())
    setResults(null)
    setError(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="tag bg-purple-500/10 text-purple-400 border border-purple-500/20">TOOL</span>
          <span className="text-subtle text-xs">Networking</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100">VLSM <span className="text-purple-400">Calculator</span></h1>
        <p className="text-subtle text-sm mt-1">Variable Length Subnet Masking — plan your IP addressing scheme efficiently.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left: Inputs */}
        <div className="xl:col-span-2 space-y-5">

          {/* Network Config */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              Network Configuration
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-subtle mb-1.5 uppercase tracking-wider">Network Address</label>
                <input
                  type="text"
                  value={networkIp}
                  onChange={(e) => setNetworkIp(e.target.value)}
                  placeholder="e.g. 192.168.1.0"
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm font-mono text-slate-200 placeholder-subtle focus:outline-none focus:border-purple-400/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-subtle mb-1.5 uppercase tracking-wider">
                  Prefix Length: <span className="text-purple-400 font-mono font-bold">/{prefix}</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={8}
                    max={30}
                    value={prefix}
                    onChange={(e) => setPrefix(parseInt(e.target.value))}
                    className="flex-1 accent-purple-400"
                  />
                  <input
                    type="number"
                    min={8}
                    max={30}
                    value={prefix}
                    onChange={(e) => setPrefix(Math.min(30, Math.max(8, parseInt(e.target.value) || 24)))}
                    className="w-16 bg-surface border border-border rounded-lg px-2 py-2 text-sm font-mono text-center text-slate-200 focus:outline-none focus:border-purple-400/50"
                  />
                </div>
                <p className="text-xs text-subtle mt-1">Available host addresses: {Math.pow(2, 32 - prefix).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Subnets */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                </svg>
                Subnets ({subnets.length})
              </h2>
              <button onClick={addSubnet}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-medium hover:bg-purple-500/20 transition-colors">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Subnet
              </button>
            </div>

            {subnets.length === 0 ? (
              <div className="text-center py-8 text-subtle text-sm">
                <p>No subnets added. Click "Add Subnet" to begin.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-[1fr_120px_40px] gap-3 px-1 mb-1">
                  <p className="text-[10px] text-subtle uppercase tracking-wider">Label</p>
                  <p className="text-[10px] text-subtle uppercase tracking-wider">Hosts Needed</p>
                  <span />
                </div>
                {subnets.map((subnet) => (
                  <div key={subnet.id} className="grid grid-cols-[1fr_120px_40px] gap-3 items-center">
                    <input
                      type="text"
                      value={subnet.label}
                      onChange={(e) => updateSubnet(subnet.id, 'label', e.target.value)}
                      className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-400/50 transition-colors"
                    />
                    <input
                      type="number"
                      min={1}
                      value={subnet.hosts}
                      onChange={(e) => updateSubnet(subnet.id, 'hosts', e.target.value)}
                      className="bg-surface border border-border rounded-lg px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-purple-400/50 transition-colors"
                    />
                    <button
                      onClick={() => removeSubnet(subnet.id)}
                      disabled={subnets.length <= 1}
                      className="w-9 h-9 rounded-lg bg-danger/10 border border-danger/20 text-danger hover:bg-danger/20 transition-colors flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={calculate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-500 text-white font-semibold text-sm hover:bg-purple-400 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
              </svg>
              Calculate
            </button>
            <button onClick={reset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-subtle hover:text-slate-200 hover:border-slate-500 text-sm font-medium transition-colors">
              Reset
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="card p-4 border-danger/30 bg-danger/5">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-danger">Calculation Error</p>
                  <p className="text-sm text-subtle mt-0.5">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-surface/50 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-200">Results — {results.length} subnets allocated</h3>
                <span className="tag bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {networkIp}/{prefix}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {['Label', 'Hosts Req.', 'Subnet (CIDR)', 'Mask', 'First Host', 'Last Host', 'Broadcast', 'Usable'].map((h) => (
                        <th key={h} className="text-left px-3 py-3 text-subtle font-medium text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={r.label + i}
                        className={`border-b border-border/40 hover:bg-white/[0.02] transition-colors ${i === results.length - 1 ? 'border-b-0' : ''}`}>
                        <td className="px-3 py-3 font-semibold text-slate-200">{r.label}</td>
                        <td className="px-3 py-3 font-mono text-subtle">{r.hosts_requested}</td>
                        <td className="px-3 py-3"><span className="font-mono font-bold text-purple-400">{r.subnet}</span></td>
                        <td className="px-3 py-3 font-mono text-slate-400 text-xs">{r.mask}</td>
                        <td className="px-3 py-3 font-mono text-success text-xs">{r.first_host}</td>
                        <td className="px-3 py-3 font-mono text-success text-xs">{r.last_host}</td>
                        <td className="px-3 py-3 font-mono text-subtle text-xs">{r.broadcast}</td>
                        <td className="px-3 py-3 font-mono font-semibold text-accent">{r.usable_hosts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right: Tips */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
              What is VLSM?
            </h3>
            <p className="text-xs text-subtle leading-relaxed">
              Variable Length Subnet Masking (VLSM) allows dividing a network into subnets of different sizes, each sized to fit the actual number of hosts needed. This is more efficient than fixed-size subnetting (FLSM).
            </p>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">How VLSM Works</h3>
            <ol className="space-y-2 text-xs text-subtle">
              {[
                'Sort subnets by host count (largest first)',
                'Allocate the first (largest) subnet starting at the network address',
                'Assign each subnet the next power-of-2 block size that fits the hosts + 2',
                'The next subnet starts immediately after the previous broadcast address',
                'Continue until all subnets are allocated or space runs out',
              ].map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-purple-400 font-mono flex-shrink-0">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Block Size Formula</h3>
            <div className="terminal p-3 text-xs mb-2">
              <span className="text-success">hosts_needed + 2</span>
              <span className="text-subtle"> (network + broadcast)</span>
              <br />
              <span className="text-accent">→ round up to next power of 2</span>
              <br />
              <span className="text-subtle">prefix = 32 - log₂(block_size)</span>
            </div>
            <p className="text-xs text-subtle">Example: 50 hosts → 52 → next power of 2 = 64 → /26 (62 usable hosts)</p>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Common Block Sizes</h3>
            <div className="space-y-1.5">
              {[
                { prefix: '/30', block: 4, usable: 2 },
                { prefix: '/29', block: 8, usable: 6 },
                { prefix: '/28', block: 16, usable: 14 },
                { prefix: '/27', block: 32, usable: 30 },
                { prefix: '/26', block: 64, usable: 62 },
                { prefix: '/25', block: 128, usable: 126 },
                { prefix: '/24', block: 256, usable: 254 },
              ].map((row) => (
                <div key={row.prefix} className="flex items-center justify-between text-xs">
                  <span className="font-mono text-purple-400">{row.prefix}</span>
                  <span className="text-subtle">block={row.block}</span>
                  <span className="font-mono text-success">{row.usable} hosts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
