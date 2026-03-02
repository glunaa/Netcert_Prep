import { useState } from 'react'
import { Link } from 'react-router-dom'
import { awsServicesSummary } from '../data/referenceData'

type Category = 'All' | 'Compute' | 'Storage' | 'Database' | 'Networking' | 'Security' | 'Monitoring' | 'Messaging' | 'DevOps'

const categories: Category[] = ['All', 'Compute', 'Storage', 'Database', 'Networking', 'Security', 'Monitoring', 'Messaging', 'DevOps']

const catTagCls: Record<string, string> = {
  Compute: 'tag bg-orange-400/10 text-orange-400 border border-orange-400/20',
  Storage: 'tag bg-green-500/10 text-green-400 border border-green-500/20',
  Database: 'tag bg-blue-500/10 text-blue-400 border border-blue-500/20',
  Networking: 'tag bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
  Security: 'tag bg-red-500/10 text-red-400 border border-red-500/20',
  Monitoring: 'tag bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  Messaging: 'tag bg-orange-500/10 text-orange-300 border border-orange-500/20',
  DevOps: 'tag bg-slate-500/10 text-slate-400 border border-slate-500/20',
}

const wellArchPillars = [
  { name: 'Operational Excellence', num: 1, color: 'text-blue-400', icon: '⚙', description: 'Run and monitor systems to deliver business value and continually improve processes.', points: ['Infrastructure as Code', 'Frequent small changes', 'Anticipate failure', 'Learn from events'] },
  { name: 'Security', num: 2, color: 'text-red-400', icon: '🔒', description: 'Protect information, systems, and assets while delivering business value through risk assessments.', points: ['Identity & access management', 'Detective controls', 'Data at rest & transit protection', 'Incident response'] },
  { name: 'Reliability', num: 3, color: 'text-green-400', icon: '✓', description: 'Recover from failures and dynamically acquire computing resources to meet demand.', points: ['Automatic recovery', 'Test recovery procedures', 'Scale horizontally', 'Stop guessing capacity'] },
  { name: 'Performance Efficiency', num: 4, color: 'text-yellow-400', icon: '⚡', description: 'Use computing resources efficiently and maintain efficiency as demand changes and technology evolves.', points: ['Democratize advanced tech', 'Go global in minutes', 'Use serverless architectures', 'Experiment more often'] },
  { name: 'Cost Optimization', num: 5, color: 'text-aws', icon: '$', description: 'Avoid unnecessary costs, understand and control spending, and select the most cost-effective resources.', points: ['Pay only for what you use', 'Right-size resources', 'Reserved vs On-Demand', 'Measure efficiency'] },
  { name: 'Sustainability', num: 6, color: 'text-emerald-400', icon: '🌱', description: 'Minimize the environmental impact of running cloud workloads.', points: ['Maximize utilization', 'Adopt efficient hardware', 'Use managed services', 'Reduce downstream impact'] },
]

const awsResp = ['Regions, Availability Zones, Edge Locations', 'Physical security of data centers', 'Hardware and global infrastructure', 'Virtualization layer (EC2 hypervisor)', 'Managed service software (RDS, Lambda runtime)', 'Network infrastructure']
const custResp = ['OS patches and updates', 'Application code and data', 'IAM users, roles, and policies', 'Security group and NACL rules', 'Encryption of data at rest and in transit', 'Client-side and server-side data protection']

const infraFacts = [
  { label: 'AWS Regions', value: '33+', detail: 'Geographically isolated areas with 2+ AZs' },
  { label: 'Availability Zones', value: '105+', detail: 'Physically separate data centers within a Region' },
  { label: 'Edge Locations', value: '600+', detail: 'Used by CloudFront CDN and Route 53' },
  { label: 'Local Zones', value: '30+', detail: 'Region extension for low-latency workloads' },
  { label: 'Wavelength Zones', value: '20+', detail: '5G network edge for ultra-low latency' },
  { label: 'Direct Connect Locations', value: '100+', detail: 'Dedicated private connectivity to AWS' },
]

export default function AWSPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')

  const filtered = activeCategory === 'All' ? awsServicesSummary : awsServicesSummary.filter((s) => s.category === activeCategory)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="tag-aws">SAA-C03</span>
            <span className="text-subtle text-xs">AWS Solutions Architect Associate</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100">AWS <span className="text-aws">Reference</span></h1>
          <p className="text-subtle text-sm mt-1">Services overview, shared responsibility model, and well-architected framework.</p>
        </div>
        <Link to="/aws/test"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-aws text-void font-semibold text-sm hover:bg-aws/85 transition-colors self-start sm:self-auto whitespace-nowrap">
          Take Practice Test
        </Link>
      </div>

      {/* Services Grid */}
      <section className="mb-14">
        <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-aws inline-block" />
          AWS Services
        </h2>
        <div className="flex flex-wrap gap-2 mb-5">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
                activeCategory === cat ? 'bg-aws text-void border-aws' : 'bg-surface border-border text-subtle hover:text-slate-200 hover:border-slate-500'}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((service) => (
            <div key={service.name} className="card p-4 hover:bg-white/[0.02] transition-colors border"
              style={{ borderColor: `${service.color}20` }}>
              <div className="flex items-start justify-between mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold font-mono"
                  style={{ backgroundColor: `${service.color}15`, color: service.color }}>
                  {service.name.slice(0, 2)}
                </div>
                <span className={catTagCls[service.category] ?? 'tag'}>{service.category}</span>
              </div>
              <h3 className="font-semibold text-slate-100 text-sm mb-0.5">{service.name}</h3>
              <p className="text-xs text-subtle">{service.tagline}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Shared Responsibility */}
      <section className="mb-14">
        <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-aws inline-block" />
          Shared Responsibility Model
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-5 border-blue-500/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-subtle uppercase tracking-wider">Managed by</p>
                <p className="font-semibold text-blue-400 text-sm">AWS — Security OF the Cloud</p>
              </div>
            </div>
            <ul className="space-y-2">
              {awsResp.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-subtle">
                  <svg className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-5 border-aws/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-aws/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-aws" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-subtle uppercase tracking-wider">Managed by</p>
                <p className="font-semibold text-aws text-sm">Customer — Security IN the Cloud</p>
              </div>
            </div>
            <ul className="space-y-2">
              {custResp.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-subtle">
                  <svg className="w-4 h-4 text-aws mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-3 card-glass p-3 rounded-xl">
          <p className="text-xs text-subtle text-center">
            <span className="text-slate-300 font-semibold">Key insight:</span> For managed services (RDS, Lambda), AWS takes more responsibility than for unmanaged (EC2). The division shifts based on abstraction level.
          </p>
        </div>
      </section>

      {/* Well-Architected */}
      <section className="mb-14">
        <h2 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-aws inline-block" />
          Well-Architected Framework
        </h2>
        <p className="text-subtle text-sm mb-5">Six pillars for building reliable, secure, efficient, and cost-effective systems on AWS.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wellArchPillars.map((pillar) => (
            <div key={pillar.name} className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xl ${pillar.color}`}>{pillar.icon}</span>
                <div>
                  <p className="text-[10px] text-subtle font-mono">PILLAR {pillar.num}</p>
                  <h3 className={`font-semibold text-sm ${pillar.color}`}>{pillar.name}</h3>
                </div>
              </div>
              <p className="text-xs text-subtle mb-3 leading-relaxed">{pillar.description}</p>
              <ul className="space-y-1">
                {pillar.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className={`w-1 h-1 rounded-full flex-shrink-0 ${pillar.color}`} style={{ backgroundColor: 'currentColor' }} />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Global Infrastructure */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-aws inline-block" />
          AWS Global Infrastructure
        </h2>
        <p className="text-subtle text-sm mb-5">Key facts about AWS's worldwide physical infrastructure.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {infraFacts.map((fact) => (
            <div key={fact.label} className="card p-4 border-aws/10 hover:border-aws/30 transition-colors">
              <p className="text-xs text-subtle uppercase tracking-wider mb-1">{fact.label}</p>
              <p className="text-3xl font-bold font-mono text-aws mb-1">{fact.value}</p>
              <p className="text-xs text-subtle leading-relaxed">{fact.detail}</p>
            </div>
          ))}
        </div>
        <div className="card p-5 border-aws/10">
          <h3 className="font-semibold text-slate-200 text-sm mb-3">Key Concepts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { term: 'Region', def: 'A geographic area with 2+ AZs. Choose based on latency, compliance, and service availability.' },
              { term: 'Availability Zone (AZ)', def: 'One or more discrete data centers with redundant power, networking, and connectivity.' },
              { term: 'Edge Location', def: 'Used by CloudFront to cache content closer to users. More locations than Regions.' },
              { term: 'Local Zone', def: 'Places compute, storage, and database closer to large population centers for low latency.' },
              { term: 'Direct Connect', def: 'Dedicated private network connection from on-premises to AWS, bypassing the public internet.' },
              { term: 'Transit Gateway', def: 'Hub for connecting multiple VPCs and on-premises networks through a central routing point.' },
            ].map((item) => (
              <div key={item.term} className="flex gap-3">
                <span className="text-aws font-mono text-xs mt-0.5 flex-shrink-0">→</span>
                <div>
                  <span className="text-sm font-semibold text-slate-200">{item.term}: </span>
                  <span className="text-xs text-subtle">{item.def}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="card-glass p-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl">
        <div>
          <p className="font-semibold text-slate-200 mb-1">Ready to test your AWS knowledge?</p>
          <p className="text-sm text-subtle">30 randomized questions covering SAA-C03 exam domains.</p>
        </div>
        <Link to="/aws/test"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-aws text-void font-semibold text-sm hover:bg-aws/85 transition-colors whitespace-nowrap">
          Take Practice Test
        </Link>
      </div>

    </div>
  )
}
