import { useState } from 'react'
import { Link } from 'react-router-dom'
import { osiLayers, portEntries, subnetCheatSheet } from '../data/referenceData'

type Tab = 'osi' | 'ports' | 'subnets' | 'quickfacts'

const osiColors: Record<number, string> = {
  7: 'text-purple-400', 6: 'text-blue-400', 5: 'text-cyan-400',
  4: 'text-green-400', 3: 'text-yellow-400', 2: 'text-orange-400', 1: 'text-red-400',
}

const quickFacts = [
  { category: 'Cable Lengths', facts: [
    { label: 'Cat5e / Cat6 (1 GbE)', value: '100 m' },
    { label: 'Cat6 (10 GbE)', value: '55 m' },
    { label: 'Cat6A (10 GbE)', value: '100 m' },
    { label: 'Single-Mode Fiber', value: 'Up to 40 km' },
    { label: 'Multi-Mode Fiber', value: 'Up to 2 km' },
  ]},
  { category: 'Wireless Standards', facts: [
    { label: '802.11a — 5 GHz', value: '54 Mbps' },
    { label: '802.11b — 2.4 GHz', value: '11 Mbps' },
    { label: '802.11g — 2.4 GHz', value: '54 Mbps' },
    { label: '802.11n — dual-band', value: '600 Mbps' },
    { label: '802.11ac — 5 GHz', value: '3.5 Gbps' },
    { label: '802.11ax (Wi-Fi 6)', value: '9.6 Gbps' },
  ]},
  { category: 'IP Address Classes', facts: [
    { label: 'Class A', value: '1.0.0.0 – 126.x.x.x (/8)' },
    { label: 'Class B', value: '128.0.0.0 – 191.x.x.x (/16)' },
    { label: 'Class C', value: '192.0.0.0 – 223.x.x.x (/24)' },
    { label: 'Class D (Multicast)', value: '224.0.0.0 – 239.x.x.x' },
    { label: 'Class E (Reserved)', value: '240.0.0.0 – 255.x.x.x' },
  ]},
  { category: 'Private & Special IPs', facts: [
    { label: 'Class A private', value: '10.0.0.0/8' },
    { label: 'Class B private', value: '172.16.0.0/12' },
    { label: 'Class C private', value: '192.168.0.0/16' },
    { label: 'Loopback', value: '127.0.0.1' },
    { label: 'APIPA', value: '169.254.0.0/16' },
    { label: 'IPv6 Link-local', value: 'fe80::/10' },
  ]},
  { category: 'Routing Protocols', facts: [
    { label: 'RIPv2 — metric', value: 'Hop count (max 15)' },
    { label: 'OSPF — metric', value: 'Cost (bandwidth-based)' },
    { label: 'EIGRP — metric', value: 'Composite (BW + delay)' },
    { label: 'BGP — metric', value: 'Path attributes (AS-PATH)' },
    { label: 'Admin distance: RIP', value: '120' },
    { label: 'Admin distance: OSPF', value: '110' },
    { label: 'Admin distance: EIGRP', value: '90' },
    { label: 'Admin distance: static', value: '1' },
  ]},
  { category: 'Network Devices', facts: [
    { label: 'Hub', value: 'Layer 1 — floods all ports' },
    { label: 'Switch', value: 'Layer 2 — MAC table' },
    { label: 'Router', value: 'Layer 3 — IP routing' },
    { label: 'Firewall', value: 'L3–7 — ACL/stateful' },
    { label: 'IDS', value: 'Passive detection, alerts only' },
    { label: 'IPS', value: 'Inline, actively blocks' },
  ]},
  { category: 'VPN Protocols', facts: [
    { label: 'SSL VPN port', value: 'TCP 443' },
    { label: 'IPSec IKE', value: 'UDP 500 / 4500' },
    { label: 'L2TP port', value: 'UDP 1701' },
    { label: 'PPTP port', value: 'TCP 1723 (legacy)' },
    { label: 'GRE protocol', value: 'IP Protocol 47' },
    { label: 'ESP protocol', value: 'IP Protocol 50 (encrypts)' },
    { label: 'AH protocol', value: 'IP Protocol 51 (auth only)' },
  ]},
  { category: 'STP & Switching', facts: [
    { label: 'STP standard', value: '802.1D' },
    { label: 'RSTP standard', value: '802.1W (faster converge)' },
    { label: 'VLAN trunking', value: '802.1Q' },
    { label: 'STP blocking port', value: 'No forwarding, no learning' },
    { label: 'STP forwarding port', value: 'Fully operational' },
    { label: 'PortFast', value: 'Skips listening/learning for edge ports' },
  ]},
]

export default function NetPlusPage() {
  const [activeTab, setActiveTab] = useState<Tab>('osi')
  const [portSearch, setPortSearch] = useState('')

  const filteredPorts = portEntries.filter(
    (p) => p.port.includes(portSearch) || p.service.toLowerCase().includes(portSearch.toLowerCase()) || p.description.toLowerCase().includes(portSearch.toLowerCase())
  )

  const tabs: { id: Tab; label: string }[] = [
    { id: 'osi', label: 'OSI Model' },
    { id: 'ports', label: 'Ports' },
    { id: 'subnets', label: 'Subnets' },
    { id: 'quickfacts', label: 'Quick Facts' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="tag-net">N10-009</span>
            <span className="text-subtle text-xs">CompTIA Network+</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100">Net<span className="text-accent">+</span> Reference</h1>
          <p className="text-subtle text-sm mt-1">Complete study guide: OSI model, ports, subnetting, and key facts.</p>
        </div>
        <Link to="/netplus/test"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-void font-semibold text-sm hover:bg-accent/85 transition-colors self-start sm:self-auto whitespace-nowrap">
          Take Practice Test
        </Link>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 mb-6 bg-surface border border-border rounded-xl p-1 w-fit flex-wrap">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${activeTab === tab.id ? 'bg-accent text-void' : 'text-subtle hover:text-slate-200'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* OSI Tab */}
      {activeTab === 'osi' && (
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-surface/50">
            <p className="text-xs text-subtle">Mnemonic (1→7): <span className="text-slate-300 font-mono">Please Do Not Throw Sausage Pizza Away</span></p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['#', 'Layer', 'PDU', 'Protocols', 'Devices', 'Function'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-subtle font-medium text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {osiLayers.map((layer, i) => (
                  <tr key={layer.number}
                    className={`border-b border-border/40 hover:bg-white/[0.02] transition-colors ${i === osiLayers.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="px-4 py-3.5">
                      <span className={`font-bold font-mono text-lg ${osiColors[layer.number]}`}>{layer.number}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`font-semibold ${osiColors[layer.number]}`}>{layer.name}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs text-subtle bg-surface border border-border px-2 py-0.5 rounded whitespace-nowrap">{layer.pdu}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {layer.protocols.map((p) => (
                          <span key={p} className="text-xs text-slate-400 bg-border/40 px-1.5 py-0.5 rounded font-mono">{p}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {layer.devices.map((d) => (
                          <span key={d} className="text-xs text-slate-500 bg-surface px-1.5 py-0.5 rounded">{d}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-subtle text-xs leading-relaxed">{layer.function}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ports Tab */}
      {activeTab === 'ports' && (
        <div className="space-y-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle pointer-events-none"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input type="text" placeholder="Search by port number or service name..."
              value={portSearch} onChange={(e) => setPortSearch(e.target.value)}
              className="w-full sm:w-96 bg-surface border border-border rounded-lg pl-9 pr-9 py-2.5 text-sm text-slate-200 placeholder-subtle focus:outline-none focus:border-accent/50 transition-colors" />
            {portSearch && (
              <button onClick={() => setPortSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-slate-300 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Port', 'Protocol', 'Service', 'Description'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-subtle font-medium text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPorts.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-subtle text-sm">No ports match "{portSearch}"</td></tr>
                  ) : filteredPorts.map((entry, i) => (
                    <tr key={entry.port}
                      className={`border-b border-border/40 hover:bg-white/[0.02] transition-colors ${i === filteredPorts.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="px-4 py-3"><span className="font-mono font-bold text-accent">{entry.port}</span></td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                          entry.protocol === 'TCP' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' :
                          entry.protocol === 'UDP' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                          'text-purple-400 bg-purple-400/10 border-purple-400/20'}`}>
                          {entry.protocol}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-200">{entry.service}</td>
                      <td className="px-4 py-3 text-subtle text-xs">{entry.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2.5 border-t border-border bg-surface/50">
              <p className="text-xs text-subtle">{filteredPorts.length} of {portEntries.length} ports shown</p>
            </div>
          </div>
        </div>
      )}

      {/* Subnets Tab */}
      {activeTab === 'subnets' && (
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-surface/50">
              <p className="text-xs text-subtle">Usable hosts = 2<sup>n</sup> − 2 (subtract network and broadcast).</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Prefix', 'Subnet Mask', 'Usable Hosts', 'Subnets from /24'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-subtle font-medium text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {subnetCheatSheet.map((row, i) => (
                    <tr key={row.prefix}
                      className={`border-b border-border/40 hover:bg-white/[0.02] transition-colors ${i === subnetCheatSheet.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="px-4 py-3.5"><span className="font-mono font-bold text-accent text-base">{row.prefix}</span></td>
                      <td className="px-4 py-3.5"><span className="font-mono text-sm text-slate-300">{row.mask}</span></td>
                      <td className="px-4 py-3.5"><span className="font-mono font-semibold text-success">{row.hosts}</span></td>
                      <td className="px-4 py-3.5"><span className="font-mono text-slate-400">{row.subnets}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Usable Hosts', formula: '2ⁿ - 2', desc: 'n = host bits. Subtract network (all 0s) and broadcast (all 1s).' },
              { title: 'Number of Subnets', formula: '2ˢ', desc: 's = subnet bits borrowed from original host portion.' },
              { title: 'Block Size', formula: '256 - mask octet', desc: 'The increment between subnet addresses in the last relevant octet.' },
            ].map((item) => (
              <div key={item.title} className="card p-4 border-accent/10">
                <p className="text-xs text-subtle uppercase tracking-wider mb-1">{item.title}</p>
                <p className="text-2xl font-mono font-bold text-accent mb-2">{item.formula}</p>
                <p className="text-xs text-subtle leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Facts Tab */}
      {activeTab === 'quickfacts' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {quickFacts.map((group) => (
            <div key={group.category} className="card p-4">
              <h3 className="text-xs font-mono text-accent uppercase tracking-wider mb-3 pb-2 border-b border-border">{group.category}</h3>
              <div className="space-y-2">
                {group.facts.map((fact) => (
                  <div key={fact.label} className="flex items-start justify-between gap-3">
                    <span className="text-xs text-subtle flex-shrink-0">{fact.label}</span>
                    <span className="text-xs font-mono text-slate-300 text-right">{fact.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-10 card-glass p-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl">
        <div>
          <p className="font-semibold text-slate-200 mb-1">Ready to test your knowledge?</p>
          <p className="text-sm text-subtle">30 randomized questions covering all Network+ exam domains.</p>
        </div>
        <Link to="/netplus/test"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-void font-semibold text-sm hover:bg-accent/85 transition-colors whitespace-nowrap">
          Take Practice Test
        </Link>
      </div>

    </div>
  )
}
