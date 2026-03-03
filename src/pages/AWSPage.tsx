import { useState } from 'react'
import { Link } from 'react-router-dom'
import { awsServicesSummary } from '../data/referenceData'
import {
  cloudBenefits, cloudServiceModels, deploymentModels, cloudVsOnPrem,
  awsResponsibility, customerResponsibility, sharedResponsibilityExamples,
  iamBasics, iamBestPractices,
  coreServicesOverview, s3StorageClassesSimple, ec2PricingSimple,
  wellArchPillars,
  billingTools, supportPlans,
  infraConcepts, infraFacts,
  securityServicesSimple,
} from '../data/awsData'

type Tab = 'services' | 'cloudconcepts' | 'security' | 'wellarch' | 'billing' | 'infrastructure'

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

const tabs: { id: Tab; label: string }[] = [
  { id: 'services', label: 'Services' },
  { id: 'cloudconcepts', label: 'Cloud Concepts' },
  { id: 'security', label: 'Security & IAM' },
  { id: 'wellarch', label: 'Well-Architected' },
  { id: 'billing', label: 'Billing & Pricing' },
  { id: 'infrastructure', label: 'Infrastructure' },
]

const secCategoryList = [...new Set(securityServicesSimple.map(s => s.category))]

export default function AWSPage() {
  const [activeTab, setActiveTab] = useState<Tab>('services')
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [secFilter, setSecFilter] = useState('All')
  const [serviceDetail, setServiceDetail] = useState<string | null>(null)

  const filtered = activeCategory === 'All' ? awsServicesSummary : awsServicesSummary.filter(s => s.category === activeCategory)
  const filteredSec = secFilter === 'All' ? securityServicesSimple : securityServicesSimple.filter(s => s.category === secFilter)
  const detailService = coreServicesOverview.find(s => s.service === serviceDetail)

  const SectionHeader = ({ title }: { title: string }) => (
    <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
      <span className="w-1 h-5 rounded-full inline-block bg-aws" />
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

  const Tr = ({ cells }: { cells: React.ReactNode[] }) => (
    <tr className="border-b border-border/40 last:border-b-0 hover:bg-white/[0.02] transition-colors">
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
            <span className="tag-aws">CLF-C02</span>
            <span className="text-subtle text-xs">AWS Cloud Practitioner</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100">AWS <span className="text-aws">Study Guide</span></h1>
          <p className="text-subtle text-sm mt-1">Complete reference covering all CLF-C02 exam domains.</p>
        </div>
        <Link to="/aws/test"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-aws text-void font-semibold text-sm hover:bg-aws/85 transition-colors self-start sm:self-auto whitespace-nowrap">
          Take Practice Test
        </Link>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 mb-6 bg-surface border border-border rounded-xl p-1 flex-wrap">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${activeTab === tab.id ? 'bg-aws text-void' : 'text-subtle hover:text-slate-200'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Services ─── */}
      {activeTab === 'services' && (
        <div>
          {/* Service detail panel */}
          {detailService && (
            <div className="card p-5 mb-6 border-aws/30">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-bold text-aws text-lg">{detailService.service}</h3>
                  <p className="text-xs text-subtle">{detailService.tagline}</p>
                </div>
                <button onClick={() => setServiceDetail(null)} className="text-subtle hover:text-slate-200 transition-colors text-xs">✕ close</button>
              </div>
              <p className="text-sm text-slate-300 mb-3 leading-relaxed">{detailService.description}</p>
              <div>
                <p className="text-xs text-subtle uppercase tracking-wider font-mono mb-2">Key Facts</p>
                <ul className="space-y-1">
                  {detailService.keyFacts.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-subtle">
                      <span className="text-aws mt-0.5 flex-shrink-0">•</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-5">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
                  activeCategory === cat ? 'bg-aws text-void border-aws' : 'bg-surface border-border text-subtle hover:text-slate-200 hover:border-slate-500'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Grid — click for details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map(service => {
              const hasDetail = coreServicesOverview.some(s => s.service === service.name)
              return (
                <div key={service.name}
                  onClick={() => hasDetail ? setServiceDetail(service.name) : undefined}
                  className={`card p-4 transition-colors border ${hasDetail ? 'cursor-pointer hover:border-aws/40 hover:bg-white/[0.02]' : 'hover:bg-white/[0.02]'} ${serviceDetail === service.name ? 'border-aws/50 bg-aws/5' : ''}`}
                  style={{ borderColor: serviceDetail === service.name ? undefined : `${service.color}20` }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold font-mono"
                      style={{ backgroundColor: `${service.color}15`, color: service.color }}>
                      {service.name.slice(0, 2)}
                    </div>
                    <span className={catTagCls[service.category] ?? 'tag'}>{service.category}</span>
                  </div>
                  <h3 className="font-semibold text-slate-100 text-sm mb-0.5">{service.name}</h3>
                  <p className="text-xs text-subtle">{service.tagline}</p>
                  {hasDetail && <p className="text-xs text-aws/60 mt-2">click for details →</p>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── Cloud Concepts ─── */}
      {activeTab === 'cloudconcepts' && (
        <div className="space-y-8">
          <div>
            <SectionHeader title="Benefits of Cloud Computing" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {cloudBenefits.map(b => (
                <div key={b.benefit} className="card p-4">
                  <h3 className="font-semibold text-aws text-sm mb-1">{b.benefit}</h3>
                  <p className="text-xs text-subtle leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="Cloud vs On-Premises" />
            <Table heads={['Aspect', 'On-Premises', 'AWS Cloud']}>
              {cloudVsOnPrem.map(r => (
                <Tr key={r.aspect} cells={[
                  <span className="font-medium text-slate-300">{r.aspect}</span>,
                  <span className="text-xs text-danger/80">{r.onPrem}</span>,
                  <span className="text-xs text-success">{r.cloud}</span>,
                ]} />
              ))}
            </Table>
          </div>

          <div>
            <SectionHeader title="Cloud Service Models (IaaS / PaaS / SaaS)" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              {cloudServiceModels.map(m => (
                <div key={m.model} className="card p-5">
                  <div className="mb-3">
                    <span className="text-2xl font-bold font-mono text-aws">{m.model}</span>
                    <p className="text-xs text-subtle">{m.fullName}</p>
                  </div>
                  <p className="text-xs text-subtle mb-3 leading-relaxed">{m.description}</p>
                  <div className="space-y-2 mb-3">
                    <div>
                      <p className="text-[10px] text-subtle uppercase tracking-wider">You manage</p>
                      <p className="text-xs text-slate-300">{m.youManage}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-subtle uppercase tracking-wider">AWS manages</p>
                      <p className="text-xs text-slate-300">{m.awsManages}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {m.examples.map(e => (
                      <span key={e} className="text-xs font-mono text-aws bg-aws/10 border border-aws/20 px-2 py-0.5 rounded">{e}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="Cloud Deployment Models" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {deploymentModels.map(d => (
                <div key={d.model} className="card p-5">
                  <h3 className="font-bold text-aws text-base mb-2">{d.model}</h3>
                  <p className="text-xs text-subtle mb-3 leading-relaxed">{d.description}</p>
                  <ul className="space-y-1 mb-3">
                    {d.pros.map(p => (
                      <li key={p} className="flex items-start gap-2 text-xs text-subtle">
                        <span className="text-success mt-0.5 flex-shrink-0">✓</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-3 border-t border-border">
                    <p className="text-[10px] text-subtle uppercase tracking-wider mb-1">Example</p>
                    <p className="text-xs text-slate-400 italic">{d.example}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Security & IAM ─── */}
      {activeTab === 'security' && (
        <div className="space-y-8">
          {/* Shared Responsibility */}
          <div>
            <SectionHeader title="Shared Responsibility Model" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="card p-5 border-blue-500/20">
                <p className="font-semibold text-blue-400 text-sm mb-3">AWS — Security OF the Cloud</p>
                <ul className="space-y-2">
                  {awsResponsibility.map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-subtle">
                      <span className="text-blue-400 mt-0.5 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card p-5 border-aws/20">
                <p className="font-semibold text-aws text-sm mb-3">Customer — Security IN the Cloud</p>
                <ul className="space-y-2">
                  {customerResponsibility.map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-subtle">
                      <span className="text-aws mt-0.5 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="card-glass p-3 rounded-xl mb-6">
              <p className="text-xs text-subtle text-center">
                <span className="text-slate-300 font-semibold">Key insight:</span> The more managed the service (Lambda vs EC2), the more AWS is responsible for. AWS = physical security + managed service infrastructure. You = your data, access control, and config.
              </p>
            </div>
            <SectionHeader title="Responsibility by Service" />
            <Table heads={['Service', 'AWS Manages', 'Customer Manages']}>
              {sharedResponsibilityExamples.map(r => (
                <Tr key={r.service} cells={[
                  <span className="font-bold text-aws">{r.service}</span>,
                  <span className="text-xs text-blue-400">{r.aws}</span>,
                  <span className="text-xs text-orange-400">{r.customer}</span>,
                ]} />
              ))}
            </Table>
          </div>

          {/* IAM */}
          <div>
            <SectionHeader title="IAM Basics" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {iamBasics.map(c => (
                <div key={c.concept} className="card p-4">
                  <h3 className="font-semibold text-aws text-sm mb-1">{c.concept}</h3>
                  <p className="text-xs text-subtle leading-relaxed">{c.description}</p>
                </div>
              ))}
            </div>
            <div className="card p-5 mb-6">
              <h3 className="font-semibold text-slate-200 text-sm mb-3">IAM Best Practices</h3>
              <ul className="space-y-2">
                {iamBestPractices.map(p => (
                  <li key={p} className="flex items-start gap-2 text-xs text-subtle">
                    <span className="text-success mt-0.5 flex-shrink-0">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Security Services */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
              <SectionHeader title="Security Services" />
              <div className="flex flex-wrap gap-1 pb-4">
                {['All', ...secCategoryList].map(cat => (
                  <button key={cat} onClick={() => setSecFilter(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border ${secFilter === cat ? 'bg-danger text-white border-danger' : 'bg-surface border-border text-subtle hover:text-slate-200'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredSec.map(s => (
                <div key={s.service} className="card p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-slate-200 text-sm">{s.service}</h3>
                    <span className="text-xs text-danger bg-danger/10 border border-danger/20 px-1.5 py-0.5 rounded">{s.category}</span>
                  </div>
                  <p className="text-xs text-subtle leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Well-Architected ─── */}
      {activeTab === 'wellarch' && (
        <div className="space-y-6">
          <div className="card-glass p-4 rounded-xl">
            <p className="text-sm text-subtle text-center">
              The AWS Well-Architected Framework describes key concepts, design principles, and architectural best practices for designing and running workloads in the cloud.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wellArchPillars.map(p => (
              <div key={p.name} className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-aws/10 border border-aws/20 flex items-center justify-center">
                    <span className={`font-bold text-sm ${p.color}`}>{p.num}</span>
                  </div>
                  <h3 className={`font-semibold text-sm ${p.color}`}>{p.name}</h3>
                </div>
                <p className="text-xs text-subtle mb-3 leading-relaxed">{p.description}</p>
                <div>
                  <p className="text-[10px] text-subtle uppercase tracking-wider font-mono mb-2">Design Principles</p>
                  <ul className="space-y-1">
                    {p.designPrinciples.map(d => (
                      <li key={d} className="flex items-start gap-1.5 text-xs text-slate-400">
                        <span className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${p.color}`} style={{ backgroundColor: 'currentColor' }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-3">Exam Tips — Well-Architected</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Know all 6 pillar names and their one-sentence definition',
                'Operational Excellence → Infrastructure as Code, frequent small changes',
                'Security → least privilege, enable traceability (CloudTrail), encrypt data',
                'Reliability → multi-AZ, auto-recovery, test recovery procedures',
                'Performance Efficiency → right-sizing, serverless, go global',
                'Cost Optimization → pay for what you use, right-size, reserved instances',
                'Sustainability → maximize utilization, use managed services',
                'AWS Well-Architected Tool: free service to review workloads against pillars',
              ].map(t => (
                <div key={t} className="flex items-start gap-2 text-xs text-subtle">
                  <span className="text-aws mt-0.5 flex-shrink-0">→</span>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Billing & Pricing ─── */}
      {activeTab === 'billing' && (
        <div className="space-y-8">
          <div>
            <SectionHeader title="AWS Pricing Fundamentals" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { model: 'Pay as you go', icon: '⏱', desc: 'Only pay for what you use, when you use it. No long-term contracts or complex licensing.' },
                { model: 'Save when you commit', icon: '📅', desc: 'Save up to 72% by committing to 1 or 3 years of usage (Reserved Instances, Savings Plans).' },
                { model: 'Pay less by using more', icon: '📊', desc: 'Volume discounts — the more you use (especially S3, data transfer), the less you pay per unit.' },
              ].map(p => (
                <div key={p.model} className="card p-5 text-center">
                  <div className="text-3xl mb-2">{p.icon}</div>
                  <h3 className="font-bold text-aws text-sm mb-2">{p.model}</h3>
                  <p className="text-xs text-subtle leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="EC2 Pricing Models" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {ec2PricingSimple.map(p => (
                <div key={p.type} className="card p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-slate-200 text-sm">{p.type}</h3>
                    <span className="text-xs font-mono text-success">{p.savings}</span>
                  </div>
                  <p className="text-[10px] text-subtle uppercase tracking-wider mb-2">{p.commitment}</p>
                  <p className="text-xs text-subtle leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="S3 Storage Classes" />
            <Table heads={['Class', 'Access Frequency', 'Retrieval', 'Best For']}>
              {s3StorageClassesSimple.map(s => (
                <Tr key={s.name} cells={[
                  <span className="font-semibold text-aws text-xs">{s.name}</span>,
                  <span className="text-xs">{s.access}</span>,
                  <span className="text-xs font-mono text-slate-300">{s.retrieval}</span>,
                  <span className="text-xs">{s.useCase}</span>,
                ]} />
              ))}
            </Table>
          </div>

          <div>
            <SectionHeader title="Billing & Cost Management Tools" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {billingTools.map(t => (
                <div key={t.tool} className="card p-4">
                  <h3 className="font-semibold text-aws text-sm mb-1">{t.tool}</h3>
                  <p className="text-xs text-subtle mb-2 leading-relaxed">{t.description}</p>
                  <p className="text-xs text-slate-400 italic">{t.useCase}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="AWS Support Plans" />
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {supportPlans.map(p => (
                <div key={p.plan} className="card p-4 flex flex-col">
                  <h3 className="font-bold text-aws text-sm mb-1">{p.plan}</h3>
                  <p className="text-xs font-mono text-slate-300 mb-2">{p.cost}</p>
                  <p className="text-[10px] text-subtle uppercase tracking-wider mb-2">Response time</p>
                  <p className="text-xs text-yellow-400 mb-3">{p.responseTime}</p>
                  <ul className="space-y-1 mt-auto">
                    {p.features.map(f => (
                      <li key={f} className="flex items-start gap-1.5 text-xs text-subtle">
                        <span className="text-success mt-0.5 flex-shrink-0">•</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-4 card p-4 bg-aws/5 border-aws/20">
              <p className="text-xs text-subtle text-center">
                <span className="text-slate-300 font-semibold">Exam tip:</span> Basic is free. Developer for dev/test. Business for production. Enterprise for mission-critical. The more you pay, the faster the response and the more dedicated support you get.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Infrastructure ─── */}
      {activeTab === 'infrastructure' && (
        <div className="space-y-8">
          <div>
            <SectionHeader title="AWS Global Infrastructure" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {infraFacts.map(f => (
                <div key={f.label} className="card p-4 text-center border-aws/10">
                  <p className="text-3xl font-bold font-mono text-aws mb-1">{f.value}</p>
                  <p className="text-xs font-semibold text-slate-200 mb-1">{f.label}</p>
                  <p className="text-xs text-subtle">{f.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="Key Infrastructure Concepts" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {infraConcepts.map(c => (
                <div key={c.term} className="card p-4">
                  <h3 className="font-bold text-aws text-sm mb-2">{c.term}</h3>
                  <p className="text-xs text-subtle leading-relaxed">{c.definition}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-3">How to Choose an AWS Region</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { factor: 'Compliance & Data Sovereignty', detail: 'Some regulations require data to stay in a specific country. Always comply with legal requirements first.' },
                { factor: 'Proximity to Users', detail: 'Choose a Region closest to your users to minimize latency. Use CloudFront for global distribution.' },
                { factor: 'Service Availability', detail: 'Not all AWS services are available in every Region. Check if the service you need is available in your preferred Region.' },
                { factor: 'Pricing', detail: 'Pricing varies by Region. us-east-1 (N. Virginia) is often the cheapest. Factor in data transfer costs.' },
              ].map(f => (
                <div key={f.factor} className="card p-4 bg-surface/50">
                  <h4 className="font-semibold text-aws text-xs mb-1">{f.factor}</h4>
                  <p className="text-xs text-subtle">{f.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-3">High Availability with AZs</h3>
            <p className="text-xs text-subtle mb-3">Deploy your application across multiple Availability Zones (minimum 2) to achieve high availability. If one AZ has an outage, your application continues running in the other AZ.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Single AZ', risk: 'High', desc: 'One data center fails → entire app down. Never for production.' },
                { label: 'Multi-AZ', risk: 'Low', desc: '2+ AZs: if one fails, others handle traffic. Standard HA pattern.' },
                { label: 'Multi-Region', risk: 'Very Low', desc: 'Global deployment. Handles entire Region failures. DR & compliance.' },
              ].map(a => (
                <div key={a.label} className="card p-3 bg-surface/50">
                  <h4 className="font-semibold text-slate-200 text-xs mb-1">{a.label}</h4>
                  <p className="text-xs text-danger mb-1">Risk: {a.risk}</p>
                  <p className="text-xs text-subtle">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-10 card-glass p-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl">
        <div>
          <p className="font-semibold text-slate-200 mb-1">Ready to test your AWS knowledge?</p>
          <p className="text-sm text-subtle">30 randomized questions covering CLF-C02 exam domains.</p>
        </div>
        <Link to="/aws/test"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-aws text-void font-semibold text-sm hover:bg-aws/85 transition-colors whitespace-nowrap">
          Take Practice Test
        </Link>
      </div>

    </div>
  )
}
