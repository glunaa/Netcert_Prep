import { useState } from 'react'
import { Link } from 'react-router-dom'
import { osiLayers, portEntries, subnetCheatSheet } from '../data/referenceData'
import {
  tcpipModel, tcpVsUdp, tcpHandshake,
  ipv6Rules, ipv6Types, ipv6Transition,
  wirelessStandards, wirelessChannels, wirelessSecurity, eapTypes,
  vlanTypes, stpPortStates, stpPortRoles, stpVariants, routingProtocols, natTypes,
  attackTypes, defenseTools, vpnProtocols,
  troubleshootingSteps, troubleshootingTools,
  networkTypes, topologies, cableTypes, connectorTypes, wanTechnologies, pinouts,
  dnsRecordTypes, dnsHierarchy, dnsResolutionSteps, dnsConceptsFacts,
  dhcpDoraSteps, dhcpComponents, dhcpRelayFacts,
} from '../data/netplusData'

type Tab = 'osi' | 'tcpip' | 'ports' | 'subnets' | 'ipv6' | 'wireless' | 'routing' | 'security' | 'troubleshooting' | 'networktypes' | 'dns' | 'quickfacts'

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
    { label: 'Multi-Mode Fiber (OM4)', value: 'Up to 400 m at 10G' },
  ]},
  { category: 'Wireless Standards', facts: [
    { label: '802.11a — 5 GHz', value: '54 Mbps' },
    { label: '802.11b — 2.4 GHz', value: '11 Mbps' },
    { label: '802.11g — 2.4 GHz', value: '54 Mbps' },
    { label: '802.11n — dual-band (Wi-Fi 4)', value: '600 Mbps' },
    { label: '802.11ac — 5 GHz (Wi-Fi 5)', value: '3.5 Gbps' },
    { label: '802.11ax — dual (Wi-Fi 6)', value: '9.6 Gbps' },
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

const tabs: { id: Tab; label: string }[] = [
  { id: 'osi', label: 'OSI Model' },
  { id: 'tcpip', label: 'TCP/IP' },
  { id: 'ports', label: 'Ports' },
  { id: 'subnets', label: 'Subnets' },
  { id: 'ipv6', label: 'IPv6' },
  { id: 'wireless', label: 'Wireless' },
  { id: 'routing', label: 'Routing & Switching' },
  { id: 'security', label: 'Security' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'networktypes', label: 'Network Types' },
  { id: 'dns', label: 'DNS & DHCP' },
  { id: 'quickfacts', label: 'Quick Facts' },
]

const attackCategories = [...new Set(attackTypes.map(a => a.category))]

export default function NetPlusPage() {
  const [activeTab, setActiveTab] = useState<Tab>('osi')
  const [portSearch, setPortSearch] = useState('')
  const [attackFilter, setAttackFilter] = useState('All')

  const filteredPorts = portEntries.filter(
    (p) => p.port.includes(portSearch) || p.service.toLowerCase().includes(portSearch.toLowerCase()) || p.description.toLowerCase().includes(portSearch.toLowerCase())
  )

  const filteredAttacks = attackFilter === 'All' ? attackTypes : attackTypes.filter(a => a.category === attackFilter)

  const SectionHeader = ({ title, color = 'accent' }: { title: string; color?: string }) => (
    <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
      <span className={`w-1 h-5 rounded-full inline-block bg-${color}`} />
      {title}
    </h2>
  )

  const Table = ({ heads, children }: { heads: string[]; children: React.ReactNode }) => (
    <div className="card overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {heads.map(h => (
                <th key={h} className="text-left px-4 py-3 text-subtle font-medium text-xs uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  )

  const Tr = ({ cells, highlight }: { cells: React.ReactNode[]; highlight?: boolean }) => (
    <tr className={`border-b border-border/40 last:border-b-0 hover:bg-white/[0.02] transition-colors ${highlight ? 'bg-accent/5' : ''}`}>
      {cells.map((c, i) => (
        <td key={i} className="px-4 py-3 text-sm text-subtle align-top">{c}</td>
      ))}
    </tr>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="tag-net">N10-009</span>
            <span className="text-subtle text-xs">CompTIA Network+</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100">Net<span className="text-accent">+</span> Study Guide</h1>
          <p className="text-subtle text-sm mt-1">Complete reference covering all N10-009 exam domains.</p>
        </div>
        <Link to="/netplus/test"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-void font-semibold text-sm hover:bg-accent/85 transition-colors self-start sm:self-auto whitespace-nowrap">
          Take Practice Test
        </Link>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 mb-6 bg-surface border border-border rounded-xl p-1 flex-wrap">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${activeTab === tab.id ? 'bg-accent text-void' : 'text-subtle hover:text-slate-200'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── OSI Model ─── */}
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

      {/* ─── TCP/IP ─── */}
      {activeTab === 'tcpip' && (
        <div className="space-y-8">
          <div>
            <SectionHeader title="TCP/IP Model" />
            <Table heads={['Layer', '#', 'OSI Equivalent', 'Key Protocols', 'Function']}>
              {tcpipModel.map(l => (
                <Tr key={l.layer} cells={[
                  <span className="font-semibold text-accent">{l.layer}</span>,
                  <span className="font-mono text-slate-400">{l.num}</span>,
                  <span className="text-xs text-slate-500">{l.osiMap}</span>,
                  <div className="flex flex-wrap gap-1">{l.protocols.map(p => <span key={p} className="text-xs bg-border/40 px-1.5 py-0.5 rounded font-mono text-slate-400">{p}</span>)}</div>,
                  <span className="text-xs">{l.description}</span>,
                ]} />
              ))}
            </Table>
          </div>

          <div>
            <SectionHeader title="TCP vs UDP" />
            <Table heads={['Feature', 'TCP', 'UDP']}>
              {tcpVsUdp.map(row => (
                <Tr key={row.feature} cells={[
                  <span className="font-medium text-slate-300">{row.feature}</span>,
                  <span className="text-green-400 text-xs">{row.tcp}</span>,
                  <span className="text-yellow-400 text-xs">{row.udp}</span>,
                ]} />
              ))}
            </Table>
          </div>

          <div>
            <SectionHeader title="TCP 3-Way Handshake" />
            <div className="card p-4 mb-6">
              <div className="space-y-3">
                {tcpHandshake.map(step => (
                  <div key={step.step} className="flex items-start gap-4">
                    <span className="w-7 h-7 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-bold text-xs flex-shrink-0">{step.step}</span>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs text-subtle font-mono">{step.direction}</span>
                        <span className="text-xs font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded font-mono">{step.flag}</span>
                      </div>
                      <p className="text-xs text-subtle">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-subtle"><span className="text-slate-300 font-semibold">Connection teardown:</span> Uses 4-way handshake — FIN → ACK → FIN → ACK. Either side can initiate.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card p-4">
                <p className="text-xs text-accent uppercase tracking-wider font-mono mb-2">Flow Control</p>
                <p className="text-xs text-subtle">Windowing — receiver advertises receive window (rwnd) size. Sender cannot send more than window allows. Window scales dynamically based on buffer availability.</p>
              </div>
              <div className="card p-4">
                <p className="text-xs text-accent uppercase tracking-wider font-mono mb-2">Congestion Control</p>
                <p className="text-xs text-subtle">Slow start → Congestion Avoidance → Fast Retransmit → Fast Recovery. TCP adjusts transmission rate based on network conditions (packet loss, RTT).</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Ports ─── */}
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

      {/* ─── Subnets ─── */}
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
          <div className="card p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-3">VLSM Subnetting Steps</h3>
            <ol className="space-y-2">
              {[
                'Sort subnets from largest to smallest (most hosts first)',
                'Start with the original network address',
                'Assign the smallest possible subnet that fits the host requirement',
                'The next subnet begins at the next network address after the assigned subnet',
                'Repeat until all subnets are assigned',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-subtle">
                  <span className="text-accent font-mono font-bold flex-shrink-0">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* ─── IPv6 ─── */}
      {activeTab === 'ipv6' && (
        <div className="space-y-8">
          <div>
            <SectionHeader title="Address Notation Rules" />
            <Table heads={['Rule', 'Example', 'Description']}>
              {ipv6Rules.map(r => (
                <Tr key={r.rule} cells={[
                  <span className="font-semibold text-slate-300">{r.rule}</span>,
                  <code className="text-xs font-mono text-accent">{r.example}</code>,
                  <span className="text-xs">{r.description}</span>,
                ]} />
              ))}
            </Table>
            <div className="card p-4 bg-accent/5 border-accent/20 mb-6">
              <p className="text-xs text-subtle"><span className="text-accent font-semibold">Full address:</span> <code className="font-mono">2001:0db8:0000:0000:0000:ff00:0042:8329</code></p>
              <p className="text-xs text-subtle mt-1"><span className="text-accent font-semibold">Compressed:</span> <code className="font-mono">2001:db8::ff00:42:8329</code></p>
            </div>
          </div>

          <div>
            <SectionHeader title="IPv6 Address Types" />
            <Table heads={['Type', 'Prefix', 'Description']}>
              {ipv6Types.map(t => (
                <Tr key={t.type} cells={[
                  <span className="font-semibold text-accent">{t.type}</span>,
                  <code className="text-xs font-mono text-slate-300">{t.prefix}</code>,
                  <span className="text-xs">{t.description}</span>,
                ]} />
              ))}
            </Table>
          </div>

          <div>
            <SectionHeader title="IPv4 to IPv6 Transition Mechanisms" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ipv6Transition.map(t => (
                <div key={t.mechanism} className="card p-4">
                  <h3 className="font-semibold text-slate-200 text-sm mb-1">{t.mechanism}</h3>
                  <p className="text-xs text-subtle leading-relaxed">{t.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-3">Key IPv6 Differences from IPv4</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { item: 'No broadcasts', detail: 'IPv6 uses multicast instead of broadcast. All-nodes multicast = ff02::1.' },
                { item: 'No ARP', detail: 'Neighbor Discovery Protocol (NDP) replaces ARP. Uses ICMPv6 messages.' },
                { item: 'No DHCP required', detail: 'SLAAC (Stateless Address Autoconfiguration) uses router advertisements + EUI-64. DHCPv6 still available.' },
                { item: 'IPSec built-in', detail: 'IPSec support is mandatory in IPv6 (vs optional in IPv4).' },
                { item: 'Larger headers', detail: '40-byte fixed header (simpler than IPv4\'s variable header). Extension headers handle options.' },
                { item: 'EUI-64', detail: 'Interface ID derived from 48-bit MAC address. Insert FFFE in middle, flip 7th bit of first octet.' },
              ].map(item => (
                <div key={item.item} className="flex gap-3">
                  <span className="text-accent font-mono text-xs mt-0.5 flex-shrink-0">→</span>
                  <div>
                    <span className="text-sm font-semibold text-slate-200">{item.item}: </span>
                    <span className="text-xs text-subtle">{item.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Wireless ─── */}
      {activeTab === 'wireless' && (
        <div className="space-y-8">
          <div>
            <SectionHeader title="802.11 Standards" />
            <div className="card overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {['Standard', 'Frequency', 'Max Speed', 'Indoor Range', 'Key Features'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-subtle font-medium text-xs uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {wirelessStandards.map((s, i) => (
                      <tr key={s.standard} className={`border-b border-border/40 last:border-b-0 hover:bg-white/[0.02] ${i === 0 ? '' : ''}`}>
                        <td className="px-4 py-3 font-mono font-bold text-accent">{s.standard}</td>
                        <td className="px-4 py-3 text-xs text-slate-300">{s.freq}</td>
                        <td className="px-4 py-3 font-mono text-sm text-success">{s.maxSpeed}</td>
                        <td className="px-4 py-3 text-xs text-subtle">{s.range}</td>
                        <td className="px-4 py-3 text-xs text-subtle">{s.features}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <SectionHeader title="Wi-Fi Channels" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {Object.values(wirelessChannels).map(band => (
                <div key={band.label} className="card p-4">
                  <h3 className="font-mono text-xs text-accent uppercase tracking-wider mb-2">{band.label}</h3>
                  <div className="mb-2">
                    <span className="text-xs text-subtle">Non-overlapping: </span>
                    <span className="font-mono text-sm text-slate-200">
                      {Array.isArray(band.nonOverlapping) ? band.nonOverlapping.join(', ') : band.nonOverlapping}
                    </span>
                  </div>
                  <p className="text-xs text-subtle leading-relaxed">{band.notes}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="Wireless Security" />
            <Table heads={['Standard', 'Year', 'Encryption', 'Authentication', 'Status', 'Notes']}>
              {wirelessSecurity.map(s => (
                <Tr key={s.standard} cells={[
                  <span className="font-bold text-slate-200">{s.standard}</span>,
                  <span className="text-xs">{s.year}</span>,
                  <code className="text-xs font-mono text-slate-300">{s.encryption}</code>,
                  <span className="text-xs">{s.auth}</span>,
                  <span className={`text-xs font-semibold ${s.status.includes('Deprecated') ? 'text-danger' : s.status.includes('Recommended') ? 'text-success' : 'text-yellow-400'}`}>{s.status}</span>,
                  <span className="text-xs">{s.notes}</span>,
                ]} />
              ))}
            </Table>
          </div>

          <div>
            <SectionHeader title="EAP Types (802.1X Authentication)" />
            <Table heads={['Type', 'Full Name', 'Tunnel', 'Inner Auth', 'Certificates', 'Notes']}>
              {eapTypes.map(e => (
                <Tr key={e.type} cells={[
                  <span className="font-bold text-accent font-mono">{e.type}</span>,
                  <span className="text-xs text-slate-300">{e.fullName}</span>,
                  <span className="text-xs">{e.tunnel}</span>,
                  <span className="text-xs">{e.innerAuth}</span>,
                  <span className="text-xs">{e.cert}</span>,
                  <span className="text-xs">{e.notes}</span>,
                ]} />
              ))}
            </Table>
          </div>
        </div>
      )}

      {/* ─── Routing & Switching ─── */}
      {activeTab === 'routing' && (
        <div className="space-y-8">
          <div>
            <SectionHeader title="VLANs" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {vlanTypes.map(v => (
                <div key={v.type} className="card p-4">
                  <h3 className="font-semibold text-accent text-sm mb-1">{v.type}</h3>
                  <p className="text-xs text-subtle leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
            <div className="card p-4 mb-6">
              <h3 className="font-semibold text-slate-200 text-sm mb-2">802.1Q VLAN Trunking</h3>
              <p className="text-xs text-subtle">Trunk links carry multiple VLANs using 802.1Q tagging. Each frame is tagged with a 4-byte VLAN tag (including 12-bit VLAN ID supporting 4,094 VLANs). Native VLAN frames are NOT tagged — both ends must agree on native VLAN or you risk VLAN hopping. Inter-VLAN routing requires a Layer 3 device (router or L3 switch with SVIs).</p>
            </div>
          </div>

          <div>
            <SectionHeader title="STP Port States (802.1D)" />
            <Table heads={['State', 'Duration', 'Activity']}>
              {stpPortStates.map(s => (
                <Tr key={s.state} cells={[
                  <span className="font-semibold text-slate-200">{s.state}</span>,
                  <span className="text-xs font-mono text-yellow-400">{s.duration}</span>,
                  <span className="text-xs">{s.activity}</span>,
                ]} />
              ))}
            </Table>
            <SectionHeader title="STP Port Roles" />
            <Table heads={['Role', 'Description']}>
              {stpPortRoles.map(r => (
                <Tr key={r.role} cells={[
                  <span className="font-semibold text-accent">{r.role}</span>,
                  <span className="text-xs">{r.description}</span>,
                ]} />
              ))}
            </Table>
            <SectionHeader title="STP Variants" />
            <Table heads={['Variant', 'Standard', 'Convergence', 'Instances', 'VLANs']}>
              {stpVariants.map(s => (
                <Tr key={s.name} cells={[
                  <span className="font-bold text-slate-200">{s.name}</span>,
                  <code className="text-xs font-mono text-slate-400">{s.std}</code>,
                  <span className="text-xs text-success">{s.convergence}</span>,
                  <span className="text-xs">{s.instances}</span>,
                  <span className="text-xs">{s.vlans}</span>,
                ]} />
              ))}
            </Table>
          </div>

          <div>
            <SectionHeader title="Routing Protocols" />
            <Table heads={['Protocol', 'Type', 'Metric', 'Admin Distance', 'Convergence', 'Scope']}>
              {routingProtocols.map(r => (
                <Tr key={r.name} cells={[
                  <span className="font-bold text-accent">{r.name}</span>,
                  <span className="text-xs">{r.type}</span>,
                  <span className="text-xs text-slate-300">{r.metric}</span>,
                  <span className="font-mono text-sm text-yellow-400">{r.ad}</span>,
                  <span className="text-xs">{r.convergence}</span>,
                  <span className="text-xs">{r.scope}</span>,
                ]} />
              ))}
            </Table>
            <div className="card p-4 bg-accent/5 border-accent/20 mb-6">
              <p className="text-xs text-subtle"><span className="text-accent font-semibold">Admin Distance (AD):</span> Lower AD = preferred route when multiple protocols know the same destination. Connected = 0, Static = 1, eBGP = 20, EIGRP = 90, OSPF = 110, IS-IS = 115, RIP = 120, iBGP = 200.</p>
            </div>
          </div>

          <div>
            <SectionHeader title="NAT Types" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {natTypes.map(n => (
                <div key={n.type} className="card p-4">
                  <h3 className="font-semibold text-accent text-sm mb-1">{n.type}</h3>
                  <div className="mb-2">
                    <span className="text-xs font-mono bg-border/40 text-slate-400 px-2 py-0.5 rounded">{n.mapping}</span>
                  </div>
                  <p className="text-xs text-subtle mb-2">{n.description}</p>
                  <code className="text-xs font-mono text-green-400">{n.example}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Security ─── */}
      {activeTab === 'security' && (
        <div className="space-y-8">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <SectionHeader title="Attack Types" />
              <div className="flex flex-wrap gap-1 pb-4">
                {['All', ...attackCategories].map(cat => (
                  <button key={cat} onClick={() => setAttackFilter(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border ${attackFilter === cat ? 'bg-danger text-white border-danger' : 'bg-surface border-border text-subtle hover:text-slate-200'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {filteredAttacks.map(a => (
                <div key={a.name} className="card p-4 border-danger/10 hover:border-danger/25 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-200 text-sm">{a.name}</h3>
                    <span className="text-xs text-danger bg-danger/10 border border-danger/20 px-2 py-0.5 rounded">{a.category}</span>
                  </div>
                  <p className="text-xs text-subtle leading-relaxed">{a.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="Defense Tools & Techniques" />
            <Table heads={['Tool', 'Layer', 'Description']}>
              {defenseTools.map(d => (
                <Tr key={d.tool} cells={[
                  <span className="font-semibold text-success text-sm">{d.tool}</span>,
                  <span className="text-xs font-mono text-slate-400 whitespace-nowrap">{d.layer}</span>,
                  <span className="text-xs">{d.description}</span>,
                ]} />
              ))}
            </Table>
          </div>

          <div>
            <SectionHeader title="VPN Protocols" />
            <Table heads={['Protocol', 'Ports', 'Encryption', 'Modes', 'Notes']}>
              {vpnProtocols.map(v => (
                <Tr key={v.protocol} cells={[
                  <span className="font-bold text-accent">{v.protocol}</span>,
                  <code className="text-xs font-mono text-slate-300">{v.ports}</code>,
                  <span className="text-xs">{v.encryption}</span>,
                  <span className="text-xs text-slate-300">{v.modes}</span>,
                  <span className="text-xs">{v.notes}</span>,
                ]} />
              ))}
            </Table>
          </div>
        </div>
      )}

      {/* ─── Troubleshooting ─── */}
      {activeTab === 'troubleshooting' && (
        <div className="space-y-8">
          <div>
            <SectionHeader title="CompTIA Troubleshooting Methodology (7 Steps)" />
            <div className="space-y-3 mb-6">
              {troubleshootingSteps.map(s => (
                <div key={s.step} className="card p-4 flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-bold text-sm flex-shrink-0">{s.step}</div>
                  <div>
                    <h3 className="font-semibold text-slate-200 text-sm mb-1">{s.title}</h3>
                    <p className="text-xs text-subtle leading-relaxed">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="Network Troubleshooting Tools" />
            <Table heads={['Tool', 'OS', 'OSI Layer', 'Command Example', 'Description']}>
              {troubleshootingTools.map(t => (
                <Tr key={t.tool} cells={[
                  <span className="font-bold text-accent font-mono">{t.tool}</span>,
                  <span className="text-xs text-slate-400">{t.os}</span>,
                  <span className="text-xs font-mono text-yellow-400">{t.layer}</span>,
                  <code className="text-xs font-mono text-green-400 whitespace-nowrap">{t.command}</code>,
                  <span className="text-xs">{t.description}</span>,
                ]} />
              ))}
            </Table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-5">
              <h3 className="font-semibold text-slate-200 text-sm mb-3">OSI Troubleshooting Approaches</h3>
              <div className="space-y-2">
                {[
                  { approach: 'Bottom-Up', desc: 'Start at Layer 1 (physical). Good for new deployments. Check cables, LEDs, then work up.' },
                  { approach: 'Top-Down', desc: 'Start at Layer 7 (application). Good when app works elsewhere. Check app, then work down.' },
                  { approach: 'Divide and Conquer', desc: 'Start in the middle (Layer 3 — ping). If ping works, go up. If not, go down.' },
                  { approach: 'Follow the Path', desc: 'Trace from source to destination systematically, checking each hop.' },
                ].map(a => (
                  <div key={a.approach}>
                    <span className="text-xs font-semibold text-accent">{a.approach}: </span>
                    <span className="text-xs text-subtle">{a.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-slate-200 text-sm mb-3">Common Network Issues</h3>
              <div className="space-y-2">
                {[
                  { issue: 'Duplicate IP', cause: 'Two devices with same IP. ARP conflicts. Check with arp -a.' },
                  { issue: 'Broadcast storm', cause: 'Switching loop without STP. All ports flood continuously.' },
                  { issue: 'DHCP exhaustion', cause: 'DHCP pool full. Clients get APIPA (169.254.x.x).' },
                  { issue: 'DNS failure', cause: 'Name resolution fails but IP ping works. Check DNS server reachability.' },
                  { issue: 'Asymmetric routing', cause: 'Packets take different paths in/out. Stateful firewall drops return traffic.' },
                  { issue: 'MTU mismatch', cause: 'Fragmentation or drops with large packets. Test with ping -f -l 1472.' },
                ].map(i => (
                  <div key={i.issue}>
                    <span className="text-xs font-semibold text-danger">{i.issue}: </span>
                    <span className="text-xs text-subtle">{i.cause}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Network Types ─── */}
      {activeTab === 'networktypes' && (
        <div className="space-y-8">
          <div>
            <SectionHeader title="Network Types" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {networkTypes.map(n => (
                <div key={n.type} className="card p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-accent text-lg">{n.type}</span>
                    <span className="text-xs text-subtle">{n.fullName}</span>
                  </div>
                  <p className="text-xs text-subtle leading-relaxed">{n.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="Network Topologies" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {topologies.map(t => (
                <div key={t.type} className="card p-4">
                  <h3 className="font-semibold text-slate-200 text-sm mb-1">{t.type}</h3>
                  <p className="text-xs text-subtle leading-relaxed">{t.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="Cabling Standards" />
            <Table heads={['Category', 'Type', 'Max Speed', 'Max Distance', 'Notes']}>
              {cableTypes.map(c => (
                <Tr key={c.name} cells={[
                  <span className="text-xs text-slate-400">{c.category}</span>,
                  <span className="font-semibold text-slate-200">{c.name}</span>,
                  <span className="font-mono text-xs text-success">{c.speed}</span>,
                  <span className="font-mono text-xs text-yellow-400">{c.distance}</span>,
                  <span className="text-xs">{c.notes}</span>,
                ]} />
              ))}
            </Table>
          </div>

          <div>
            <SectionHeader title="Common Connectors" />
            <Table heads={['Connector', 'Media Type', 'Use Case']}>
              {connectorTypes.map(c => (
                <Tr key={c.connector} cells={[
                  <span className="font-bold text-accent">{c.connector}</span>,
                  <span className="text-xs font-mono text-slate-400">{c.type}</span>,
                  <span className="text-xs">{c.use}</span>,
                ]} />
              ))}
            </Table>
          </div>

          <div>
            <SectionHeader title="Cable Pinouts" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {pinouts.map(p => (
                <div key={p.name} className="card p-4">
                  <h3 className="font-semibold text-accent text-sm mb-1">{p.name}</h3>
                  <p className="text-xs text-slate-300 mb-2">{p.pairs}</p>
                  <p className="text-xs text-subtle">{p.use}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="WAN Technologies" />
            <Table heads={['Technology', 'Speed', 'Notes']}>
              {wanTechnologies.map(w => (
                <Tr key={w.tech} cells={[
                  <span className="font-bold text-slate-200">{w.tech}</span>,
                  <span className="font-mono text-xs text-success">{w.speed}</span>,
                  <span className="text-xs">{w.notes}</span>,
                ]} />
              ))}
            </Table>
          </div>
        </div>
      )}

      {/* ─── DNS & DHCP ─── */}
      {activeTab === 'dns' && (
        <div className="space-y-8">
          <div>
            <SectionHeader title="DNS Record Types" />
            <Table heads={['Type', 'Description', 'Example']}>
              {dnsRecordTypes.map(r => (
                <Tr key={r.type} cells={[
                  <span className="font-mono font-bold text-accent">{r.type}</span>,
                  <span className="text-xs text-subtle">{r.description}</span>,
                  <span className="font-mono text-xs text-success">{r.example}</span>,
                ]} />
              ))}
            </Table>
          </div>

          <div>
            <SectionHeader title="DNS Hierarchy" />
            <Table heads={['Level', 'Description']}>
              {dnsHierarchy.map(h => (
                <Tr key={h.level} cells={[
                  <span className="font-semibold text-yellow-400 whitespace-nowrap">{h.level}</span>,
                  <span className="text-xs text-subtle">{h.description}</span>,
                ]} />
              ))}
            </Table>
          </div>

          <div>
            <SectionHeader title="DNS Resolution Process" />
            <div className="space-y-2">
              {dnsResolutionSteps.map((s) => (
                <div key={s.step} className="card p-3 flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent font-mono text-xs flex items-center justify-center font-bold">{s.step}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{s.action}</p>
                    <p className="text-xs text-subtle">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="DNS Concepts & Exam Facts" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dnsConceptsFacts.map(f => (
                <div key={f.concept} className="card p-3">
                  <p className="text-xs font-mono text-accent mb-1">{f.concept}</p>
                  <p className="text-xs text-subtle">{f.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="DHCP DORA Process" />
            <Table heads={['Step', 'Direction', 'Src Port', 'Dst Port', 'Description']}>
              {dhcpDoraSteps.map(d => (
                <Tr key={d.step} cells={[
                  <span className="font-mono font-bold text-accent whitespace-nowrap">{d.step}</span>,
                  <span className="text-xs text-slate-300 whitespace-nowrap">{d.direction}</span>,
                  <span className="font-mono text-xs text-success">{d.srcPort}</span>,
                  <span className="font-mono text-xs text-success">{d.dstPort}</span>,
                  <span className="text-xs text-subtle">{d.description}</span>,
                ]} />
              ))}
            </Table>
          </div>

          <div>
            <SectionHeader title="DHCP Components" />
            <Table heads={['Component', 'Description']}>
              {dhcpComponents.map(c => (
                <Tr key={c.component} cells={[
                  <span className="font-semibold text-slate-200 whitespace-nowrap">{c.component}</span>,
                  <span className="text-xs text-subtle">{c.description}</span>,
                ]} />
              ))}
            </Table>
          </div>

          <div>
            <SectionHeader title="DHCP Relay (ip helper-address)" />
            <div className="space-y-2">
              {dhcpRelayFacts.map((fact, i) => (
                <div key={i} className="card p-3 flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5 shrink-0">›</span>
                  <p className="text-xs text-subtle">{fact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Quick Facts ─── */}
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
