import { useState } from 'react'

type Tab = 'basics' | 'security' | 'architectures' | 'connectivity'

const tabs: { id: Tab; label: string }[] = [
  { id: 'basics', label: 'VPC Basics' },
  { id: 'security', label: 'Security' },
  { id: 'architectures', label: 'Architectures' },
  { id: 'connectivity', label: 'Connectivity' },
]

const vpcComponents = [
  {
    name: 'VPC', icon: '🏗', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    description: 'A Virtual Private Cloud is a logically isolated section of the AWS Cloud with its own IP address range (CIDR block).',
    details: ['CIDR block: /16 to /28', 'Default VPC exists in every region', 'Can have multiple VPCs per region (default limit: 5)', 'Enables full control over networking'],
  },
  {
    name: 'Subnet', icon: '📦', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    description: 'A range of IP addresses within a VPC. Resources are launched into subnets.',
    details: ['Public subnet: has route to IGW', 'Private subnet: no direct internet route', 'Tied to a single Availability Zone', 'AWS reserves 5 IP addresses per subnet'],
  },
  {
    name: 'Internet Gateway (IGW)', icon: '🌐', color: 'text-green-400 bg-green-400/10 border-green-400/20',
    description: 'Enables communication between your VPC and the internet. Horizontally scaled, redundant, and highly available.',
    details: ['Attached to a VPC (1:1)', 'Required for public subnets', 'Performs NAT for instances with public IPs', 'No bandwidth limits or availability risk'],
  },
  {
    name: 'NAT Gateway', icon: '↔', color: 'text-aws bg-aws/10 border-aws/20',
    description: 'Allows instances in private subnets to initiate outbound internet traffic while blocking inbound connections.',
    details: ['Lives in a public subnet', 'Requires an Elastic IP', 'Charged per hour + data processed', 'Use one per AZ for HA'],
  },
  {
    name: 'Route Table', icon: '🗺', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    description: 'Contains rules (routes) that determine where network traffic is directed.',
    details: ['Every subnet must be associated with a route table', 'Main route table: default for subnets not explicitly associated', 'Local route always present (VPC CIDR)', 'Custom route tables for fine-grained control'],
  },
  {
    name: 'Elastic IP', icon: '📍', color: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
    description: 'A static, public IPv4 address that can be associated with EC2 instances or NAT Gateways.',
    details: ['Free while associated with a running instance', 'Charged when not in use or extra EIPs exist', 'Can be remapped between instances', 'Useful for failover scenarios'],
  },
]

const sgVsNaclRows = [
  { feature: 'Applies to', sg: 'EC2 instances (ENIs)', nacl: 'Subnets' },
  { feature: 'State', sg: 'Stateful — return traffic auto-allowed', nacl: 'Stateless — explicit rules for both directions' },
  { feature: 'Rule types', sg: 'Allow only (implicit deny)', nacl: 'Allow and Deny rules' },
  { feature: 'Rule evaluation', sg: 'All rules evaluated; most permissive wins', nacl: 'Rules evaluated in order; first match wins' },
  { feature: 'Default (new)', sg: 'Deny all inbound, allow all outbound', nacl: 'Allow all inbound and outbound' },
  { feature: 'Layer', sg: 'Instance level (Layer 4)', nacl: 'Subnet level (Layer 3/4)' },
  { feature: 'Use case', sg: 'Fine-grained instance access control', nacl: 'Subnet-level blacklisting / broad rules' },
]

const architectures = [
  {
    name: '2-Tier (Public + Private)',
    desc: 'Web servers in public subnet, databases in private subnet. Most common pattern.',
    diagram: `
  ┌─────────────────────────────────────────────┐
  │              VPC: 10.0.0.0/16               │
  │                                             │
  │  ┌──────────────────┐  ┌──────────────────┐ │
  │  │  Public Subnet   │  │  Private Subnet  │ │
  │  │  10.0.1.0/24     │  │  10.0.2.0/24     │ │
  │  │                  │  │                  │ │
  │  │  ┌────────────┐  │  │  ┌────────────┐  │ │
  │  │  │  EC2 Web   │──┼──┼─▶│  RDS DB    │  │ │
  │  │  │  Server    │  │  │  │  (private) │  │ │
  │  │  └────────────┘  │  │  └────────────┘  │ │
  │  │       │          │  │                  │ │
  │  └───────┼──────────┘  └──────────────────┘ │
  │          │                                   │
  └──────────┼───────────────────────────────────┘
             │
    ┌─────────▼─────────┐
    │  Internet Gateway │
    └─────────┬─────────┘
              │
           Internet
`.trim(),
  },
  {
    name: '3-Tier (Public + App + Data)',
    desc: 'Load balancers in public, app servers in private, databases in isolated data subnet.',
    diagram: `
  ┌──────────────────────────────────────────────────────┐
  │                 VPC: 10.0.0.0/16                     │
  │                                                      │
  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │
  │  │ Public Subnet│ │  App Subnet  │ │  Data Subnet │  │
  │  │ 10.0.1.0/24  │ │ 10.0.2.0/24  │ │ 10.0.3.0/24  │  │
  │  │              │ │              │ │              │  │
  │  │  ┌────────┐  │ │  ┌────────┐  │ │  ┌────────┐  │  │
  │  │  │  ALB   │──┼─┼─▶│  EC2   │──┼─┼─▶│  RDS   │  │  │
  │  │  │  (LB)  │  │ │  │  App   │  │ │  │  DB    │  │  │
  │  │  └────────┘  │ │  └────────┘  │ │  └────────┘  │  │
  │  └──────────────┘ └──────────────┘ └──────────────┘  │
  │                          │                            │
  │               ┌──────────▼──────────┐                 │
  │               │  NAT Gateway (pub)  │                 │
  │               └──────────┬──────────┘                 │
  └──────────────────────────┼────────────────────────────┘
                             │
                    Internet Gateway
                             │
                          Internet
`.trim(),
  },
  {
    name: 'Multi-AZ High Availability',
    desc: 'Duplicate subnets across 2+ AZs with an ALB distributing traffic.',
    diagram: `
  ┌──────────────────────────────────────────────────────┐
  │                 VPC: 10.0.0.0/16                     │
  │                                                      │
  │  ┌────────────────────┐  ┌────────────────────────┐  │
  │  │  AZ-1 (us-east-1a)│  │  AZ-2 (us-east-1b)     │  │
  │  │                    │  │                        │  │
  │  │  [Public 10.0.1/24]│  │  [Public 10.0.3/24]   │  │
  │  │  ┌──────────────┐  │  │  ┌──────────────┐     │  │
  │  │  │  ALB Node 1  │──┼──┼──│  ALB Node 2  │     │  │
  │  │  └──────────────┘  │  │  └──────────────┘     │  │
  │  │                    │  │                        │  │
  │  │ [Private 10.0.2/24]│  │  [Private 10.0.4/24]  │  │
  │  │  ┌──────────────┐  │  │  ┌──────────────┐     │  │
  │  │  │   EC2 (AZ-1) │  │  │  │   EC2 (AZ-2) │     │  │
  │  │  └──────────────┘  │  │  └──────────────┘     │  │
  │  │                    │  │                        │  │
  │  │  ┌──────────────┐  │  │  ┌──────────────┐     │  │
  │  │  │ RDS Primary  │──┼──┼──│ RDS Standby  │     │  │
  │  │  └──────────────┘  │  │  └──────────────┘     │  │
  │  └────────────────────┘  └────────────────────────┘  │
  └──────────────────────────────────────────────────────┘
`.trim(),
  },
]

const connectivityOptions = [
  {
    name: 'VPC Peering',
    tag: 'Private',
    tagCls: 'tag bg-blue-500/10 text-blue-400 border border-blue-500/20',
    desc: 'Direct network connection between two VPCs using private IP addresses.',
    pros: ['Simple setup', 'Low latency', 'No bandwidth limits from AWS', 'Cross-account and cross-region supported'],
    cons: ['Not transitive (no hub-and-spoke)', 'Does not support overlapping CIDR blocks', 'Max 125 peering connections per VPC'],
    useCase: 'Connect 2-3 VPCs that need to communicate directly with low latency.',
  },
  {
    name: 'Transit Gateway',
    tag: 'Hub-and-Spoke',
    tagCls: 'tag bg-purple-500/10 text-purple-400 border border-purple-500/20',
    desc: 'Central hub that connects VPCs, on-premises networks, and Direct Connect. Transitive routing.',
    pros: ['Supports transitive routing', 'Single connection point for many VPCs', 'Scales to thousands of connections', 'Cross-account via RAM'],
    cons: ['More expensive', 'Additional hop (slight latency)', 'More complex to configure'],
    useCase: 'Large organizations with many VPCs and on-premises networks needing centralized routing.',
  },
  {
    name: 'AWS VPN',
    tag: 'Encrypted',
    tagCls: 'tag bg-green-500/10 text-green-400 border border-green-500/20',
    desc: 'Site-to-Site or Client VPN connecting on-premises networks or individual clients to VPC over the internet using IPsec.',
    pros: ['Quick to set up', 'Encrypted via IPsec', 'Lower cost than Direct Connect', 'Built-in redundancy'],
    cons: ['Internet dependent (variable latency)', 'Max 1.25 Gbps bandwidth', 'Not suitable for consistent high-throughput workloads'],
    useCase: 'Secure connectivity to on-premises when Direct Connect is not needed or too costly.',
  },
  {
    name: 'Direct Connect',
    tag: 'Dedicated',
    tagCls: 'tag bg-aws/10 text-aws border border-aws/20',
    desc: 'Dedicated private network connection from on-premises data center to AWS, bypassing the public internet.',
    pros: ['Consistent bandwidth and latency', 'Up to 100 Gbps speeds', 'Reduced data transfer costs', 'More reliable than VPN'],
    cons: ['Long provisioning time (weeks)', 'Higher cost', 'Physical co-location required', 'No built-in redundancy — pair with VPN'],
    useCase: 'Production workloads requiring consistent high bandwidth and low latency to AWS.',
  },
]

export default function VPCPage() {
  const [activeTab, setActiveTab] = useState<Tab>('basics')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="tag bg-blue-500/10 text-blue-400 border border-blue-500/20">AWS</span>
          <span className="text-subtle text-xs">Networking & Content Delivery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100">VPC <span className="text-blue-400">Reference</span></h1>
        <p className="text-subtle text-sm mt-1">AWS Virtual Private Cloud — components, security, architectures, and connectivity options.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-surface border border-border rounded-xl p-1 w-fit flex-wrap">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${activeTab === tab.id ? 'bg-blue-500 text-white' : 'text-subtle hover:text-slate-200'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Basics Tab */}
      {activeTab === 'basics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vpcComponents.map((comp) => (
            <div key={comp.name} className="card p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center text-lg flex-shrink-0 ${comp.color}`}>
                  {comp.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 text-sm">{comp.name}</h3>
                  <p className="text-xs text-subtle leading-relaxed mt-0.5">{comp.description}</p>
                </div>
              </div>
              <ul className="space-y-1 ml-12">
                {comp.details.map((d) => (
                  <li key={d} className="flex items-start gap-1.5 text-xs text-subtle">
                    <span className="text-blue-400 flex-shrink-0 mt-0.5">•</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-200 mb-1">Security Groups vs. Network ACLs</h2>
            <p className="text-subtle text-sm mb-4">Both control traffic but operate at different levels and in different ways.</p>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-subtle font-medium text-xs uppercase tracking-wider w-40">Feature</th>
                      <th className="text-left px-4 py-3 text-blue-400 font-semibold text-sm">Security Groups</th>
                      <th className="text-left px-4 py-3 text-purple-400 font-semibold text-sm">Network ACLs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sgVsNaclRows.map((row, i) => (
                      <tr key={row.feature}
                        className={`border-b border-border/40 ${i === sgVsNaclRows.length - 1 ? 'border-b-0' : ''}`}>
                        <td className="px-4 py-3 text-xs font-medium text-subtle">{row.feature}</td>
                        <td className="px-4 py-3 text-xs text-slate-300">{row.sg}</td>
                        <td className="px-4 py-3 text-xs text-slate-300">{row.nacl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card-glass p-5 rounded-xl">
            <h3 className="font-semibold text-slate-200 mb-3 text-sm">Defense in Depth: Layered Security</h3>
            <div className="terminal p-4 text-xs">
              <p className="text-subtle mb-2"># Traffic flow through security layers:</p>
              <p className="text-green-400">Internet</p>
              <p className="text-subtle">   │</p>
              <p className="text-yellow-400">   ├─ Internet Gateway (IGW)</p>
              <p className="text-subtle">   │</p>
              <p className="text-purple-400">   ├─ Network ACL (subnet boundary) — stateless</p>
              <p className="text-subtle">   │     Rules evaluated in order (100, 200, 300...)</p>
              <p className="text-subtle">   │</p>
              <p className="text-blue-400">   ├─ Security Group (instance boundary) — stateful</p>
              <p className="text-subtle">   │     All rules evaluated; most permissive wins</p>
              <p className="text-subtle">   │</p>
              <p className="text-green-400">   └─ EC2 Instance</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Security Group Best Practices', icon: '🔒', color: 'text-blue-400', tips: [
                'Apply principle of least privilege', 'Use security group references instead of IP ranges where possible', 'Never use 0.0.0.0/0 for inbound unless necessary', 'Separate SGs for web, app, and DB tiers', 'Regularly audit and remove unused rules',
              ]},
              { title: 'NACL Best Practices', icon: '🛡', color: 'text-purple-400', tips: [
                'Use for subnet-level deny rules (block specific IPs)', 'Remember rules are evaluated in order — put most specific first', 'Use increments of 100 for rule numbering (room to insert later)', 'Default NACL allows all traffic — custom NACLs deny all by default', 'Always have symmetric inbound and outbound rules (stateless!)',
              ]},
            ].map((card) => (
              <div key={card.title} className="card p-5">
                <h3 className={`font-semibold text-sm mb-3 flex items-center gap-2 ${card.color}`}>
                  <span>{card.icon}</span>{card.title}
                </h3>
                <ul className="space-y-1.5">
                  {card.tips.map((tip) => (
                    <li key={tip} className="flex items-start gap-1.5 text-xs text-subtle">
                      <span className={`flex-shrink-0 mt-0.5 ${card.color}`}>→</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Architectures Tab */}
      {activeTab === 'architectures' && (
        <div className="space-y-6">
          {architectures.map((arch) => (
            <div key={arch.name} className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-border bg-surface/50">
                <h3 className="font-semibold text-slate-100 text-sm">{arch.name}</h3>
                <p className="text-xs text-subtle mt-0.5">{arch.desc}</p>
              </div>
              <div className="terminal p-5 rounded-none border-0 overflow-x-auto">
                <pre className="text-xs text-green-400/80 font-mono leading-relaxed whitespace-pre">{arch.diagram}</pre>
              </div>
            </div>
          ))}

          <div className="card p-5">
            <h3 className="font-semibold text-slate-200 mb-3 text-sm">Architecture Design Principles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { rule: 'Never put databases in public subnets', why: 'Direct internet exposure is a critical security risk.' },
                { rule: 'Deploy across multiple AZs', why: 'Protects against AZ failures. Use AZ = 2+ for HA.' },
                { rule: 'Use private subnets for app servers', why: 'Only the load balancer needs internet exposure.' },
                { rule: 'Place NAT Gateways in each AZ', why: 'One NAT Gateway is a single point of failure for outbound traffic.' },
                { rule: 'Use ALB, not EC2 in public subnets', why: 'Application Load Balancers handle internet traffic; EC2 should be private.' },
                { rule: 'Plan CIDR ranges carefully', why: 'Overlapping CIDRs prevent peering and complicate routing. Reserve room to grow.' },
              ].map((item) => (
                <div key={item.rule} className="flex gap-3">
                  <span className="text-blue-400 font-mono text-xs mt-0.5 flex-shrink-0">✓</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{item.rule}</p>
                    <p className="text-xs text-subtle">{item.why}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Connectivity Tab */}
      {activeTab === 'connectivity' && (
        <div className="space-y-4">
          {connectivityOptions.map((opt) => (
            <div key={opt.name} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-100 text-base">{opt.name}</h3>
                    <span className={opt.tagCls}>{opt.tag}</span>
                  </div>
                  <p className="text-sm text-subtle">{opt.desc}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                <div>
                  <p className="text-[10px] text-subtle uppercase tracking-wider mb-2">Advantages</p>
                  <ul className="space-y-1">
                    {opt.pros.map((p) => (
                      <li key={p} className="flex items-start gap-1.5 text-xs text-success">
                        <span className="flex-shrink-0 mt-0.5">+</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] text-subtle uppercase tracking-wider mb-2">Limitations</p>
                  <ul className="space-y-1">
                    {opt.cons.map((c) => (
                      <li key={c} className="flex items-start gap-1.5 text-xs text-danger">
                        <span className="flex-shrink-0 mt-0.5">-</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card-glass p-3 rounded-lg">
                  <p className="text-[10px] text-subtle uppercase tracking-wider mb-1">Best For</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{opt.useCase}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
