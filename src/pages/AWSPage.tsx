import { useState } from 'react'
import { Link } from 'react-router-dom'
import { awsServicesSummary } from '../data/referenceData'
import {
  vpcComponents, sgVsNacl,
  iamComponents, iamPolicyTypes, iamBestPractices,
  ec2InstanceFamilies, ec2PurchasingOptions, ec2PlacementGroups, lbTypes,
  s3StorageClasses, s3Features, ebsTypes, storageComparison,
  rdsFeatures, rdsEngines, dynamoDBConcepts, cacheComparison,
  route53Policies, autoScalingPolicies, cloudfrontConcepts,
  awsSecurityServices, serverlessServices,
} from '../data/awsData'

type Tab = 'services' | 'vpc' | 'iam' | 'compute' | 'storage' | 'databases' | 'ha' | 'security' | 'serverless'

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
  { name: 'Performance Efficiency', num: 4, color: 'text-yellow-400', icon: '⚡', description: 'Use computing resources efficiently and maintain efficiency as demand changes.', points: ['Democratize advanced tech', 'Go global in minutes', 'Use serverless architectures', 'Experiment more often'] },
  { name: 'Cost Optimization', num: 5, color: 'text-aws', icon: '$', description: 'Avoid unnecessary costs, understand and control spending.', points: ['Pay only for what you use', 'Right-size resources', 'Reserved vs On-Demand', 'Measure efficiency'] },
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

const tabs: { id: Tab; label: string }[] = [
  { id: 'services', label: 'Services Overview' },
  { id: 'vpc', label: 'VPC & Networking' },
  { id: 'iam', label: 'IAM' },
  { id: 'compute', label: 'EC2 & Compute' },
  { id: 'storage', label: 'Storage' },
  { id: 'databases', label: 'Databases' },
  { id: 'ha', label: 'HA & Scaling' },
  { id: 'security', label: 'Security Services' },
  { id: 'serverless', label: 'Serverless' },
]

const securityCategories = [...new Set(awsSecurityServices.map(s => s.category))]

export default function AWSPage() {
  const [activeTab, setActiveTab] = useState<Tab>('services')
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [secFilter, setSecFilter] = useState('All')

  const filtered = activeCategory === 'All' ? awsServicesSummary : awsServicesSummary.filter((s) => s.category === activeCategory)
  const filteredSec = secFilter === 'All' ? awsSecurityServices : awsSecurityServices.filter(s => s.category === secFilter)

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
            <span className="tag-aws">SAA-C03</span>
            <span className="text-subtle text-xs">AWS Solutions Architect Associate</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100">AWS <span className="text-aws">Study Guide</span></h1>
          <p className="text-subtle text-sm mt-1">Complete reference covering all SAA-C03 exam domains.</p>
        </div>
        <Link to="/aws/test"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-aws text-void font-semibold text-sm hover:bg-aws/85 transition-colors self-start sm:self-auto whitespace-nowrap">
          Take Practice Test
        </Link>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 mb-6 bg-surface border border-border rounded-xl p-1 flex-wrap">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${activeTab === tab.id ? 'bg-aws text-void' : 'text-subtle hover:text-slate-200'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Services Overview ─── */}
      {activeTab === 'services' && (
        <div>
          {/* Services Grid */}
          <section className="mb-14">
            <SectionHeader title="AWS Services" />
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
            <SectionHeader title="Shared Responsibility Model" />
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
            <SectionHeader title="Well-Architected Framework" />
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
          <section>
            <SectionHeader title="AWS Global Infrastructure" />
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
        </div>
      )}

      {/* ─── VPC & Networking ─── */}
      {activeTab === 'vpc' && (
        <div className="space-y-8">
          <div>
            <SectionHeader title="VPC Components" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {vpcComponents.map(c => (
                <div key={c.component} className="card p-4">
                  <h3 className="font-semibold text-aws text-sm mb-1">{c.component}</h3>
                  <p className="text-xs text-subtle leading-relaxed">{c.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="Security Groups vs NACLs" />
            <Table heads={['Feature', 'Security Group', 'Network ACL']}>
              {sgVsNacl.map(r => (
                <Tr key={r.feature} cells={[
                  <span className="font-medium text-slate-300">{r.feature}</span>,
                  <span className="text-xs text-green-400">{r.sg}</span>,
                  <span className="text-xs text-yellow-400">{r.nacl}</span>,
                ]} />
              ))}
            </Table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-5">
              <h3 className="font-semibold text-slate-200 text-sm mb-3">VPC Endpoint Types</h3>
              <div className="space-y-3">
                {[
                  { type: 'Gateway Endpoint', services: 'S3 and DynamoDB ONLY', detail: 'Free. Added as route table entry. No ENI. Highly scalable. Must be in same region as S3/DynamoDB.' },
                  { type: 'Interface Endpoint (PrivateLink)', services: 'Most AWS services (90+)', detail: 'Creates ENI with private IP in subnet. Charged per hour + data. Supports on-premises access via VPN/DX.' },
                ].map(e => (
                  <div key={e.type}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-aws text-sm">{e.type}</span>
                      <span className="text-xs font-mono text-slate-400">{e.services}</span>
                    </div>
                    <p className="text-xs text-subtle">{e.detail}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-slate-200 text-sm mb-3">VPC Connectivity Options</h3>
              <div className="space-y-2">
                {[
                  { opt: 'VPC Peering', desc: 'Private connection, not transitive, max /28 CIDR, same or cross-account.' },
                  { opt: 'Transit Gateway', desc: 'Hub-and-spoke, transitive routing, cross-region peering, attach VPNs.' },
                  { opt: 'Site-to-Site VPN', desc: 'Encrypted tunnel over internet. Virtual Private Gateway on AWS side. <1.25 Gbps per tunnel.' },
                  { opt: 'Direct Connect (DX)', desc: 'Physical dedicated line. 1 or 10 Gbps. Low latency, consistent throughput. 1–3 months to provision.' },
                  { opt: 'Direct Connect + VPN', desc: 'IPSec over DX for encryption. Consistent performance + security.' },
                  { opt: 'PrivateLink', desc: 'Expose services privately to other VPCs. No peering, no IGW, no NAT.' },
                ].map(o => (
                  <div key={o.opt}>
                    <span className="text-xs font-semibold text-aws">{o.opt}: </span>
                    <span className="text-xs text-subtle">{o.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-3">Key VPC Exam Facts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Max 5 VPCs per Region (soft limit)',
                'Max CIDR block: /16, Min: /28',
                'First 4 IPs and last 1 IP in each subnet are reserved by AWS',
                'Subnets cannot span Availability Zones',
                'Route table: most specific route wins (longest prefix match)',
                'Default VPC has public subnets in every AZ + IGW attached',
                'Security groups are stateful; NACLs are stateless',
                'VPC Flow Logs captured to S3 or CloudWatch; not real-time',
                'NAT Gateway: managed, HA within AZ, 5 Gbps scalable to 100 Gbps',
                'DNS resolution in VPC uses 169.254.169.253 (or VPC Base + 2)',
              ].map(f => (
                <div key={f} className="flex items-start gap-2 text-xs text-subtle">
                  <span className="text-aws mt-0.5 flex-shrink-0">•</span>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── IAM ─── */}
      {activeTab === 'iam' && (
        <div className="space-y-8">
          <div>
            <SectionHeader title="IAM Components" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {iamComponents.map(c => (
                <div key={c.component} className="card p-4">
                  <h3 className="font-semibold text-aws text-sm mb-1">{c.component}</h3>
                  <p className="text-xs text-subtle leading-relaxed">{c.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="Policy Types" />
            <Table heads={['Policy Type', 'Scope / Attachment', 'Description']}>
              {iamPolicyTypes.map(p => (
                <Tr key={p.type} cells={[
                  <span className="font-bold text-aws">{p.type}</span>,
                  <span className="text-xs text-slate-400">{p.scope}</span>,
                  <span className="text-xs">{p.description}</span>,
                ]} />
              ))}
            </Table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-5">
              <h3 className="font-semibold text-slate-200 text-sm mb-3">IAM Policy Evaluation Logic</h3>
              <ol className="space-y-2">
                {[
                  'Deny by default (implicit deny for everything)',
                  'Evaluate all applicable policies',
                  'Any explicit Deny → DENY (overrides everything)',
                  'Any Allow without Deny → ALLOW',
                  'SCPs: even an Allow requires SCP to also allow it',
                  'Permission boundaries: further restrict allowed actions',
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-subtle">
                    <span className="text-aws font-mono flex-shrink-0">{i + 1}.</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-slate-200 text-sm mb-3">IAM Best Practices</h3>
              <ul className="space-y-1.5">
                {iamBestPractices.map(p => (
                  <li key={p} className="flex items-start gap-2 text-xs text-subtle">
                    <span className="text-success mt-0.5 flex-shrink-0">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-3">Identity Federation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'SAML 2.0', detail: 'Enterprise SSO (AD, ADFS). Trust between IdP and AWS. Console access or API access. AssumeRoleWithSAML.' },
                { name: 'OIDC / OAuth 2.0', detail: 'Social login (Google, Facebook) or modern IdP. AssumeRoleWithWebIdentity. Cognito handles token exchange.' },
                { name: 'AWS IAM Identity Center (SSO)', detail: 'Successor to AWS SSO. Centralized access to AWS accounts and apps. SAML/SCIM integration. Recommended for multi-account.' },
                { name: 'Amazon Cognito', detail: 'User pools (authentication), Identity pools (authorization/federation). Mobile/web app auth. Scales to millions of users.' },
              ].map(f => (
                <div key={f.name} className="card p-3 bg-surface/50">
                  <h4 className="font-semibold text-aws text-xs mb-1">{f.name}</h4>
                  <p className="text-xs text-subtle">{f.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── EC2 & Compute ─── */}
      {activeTab === 'compute' && (
        <div className="space-y-8">
          <div>
            <SectionHeader title="EC2 Instance Families" />
            <Table heads={['Family', 'Category', 'Purpose', 'Details']}>
              {ec2InstanceFamilies.map(f => (
                <Tr key={f.family} cells={[
                  <code className="text-xs font-mono text-aws">{f.family}</code>,
                  <span className="text-xs text-slate-300">{f.category}</span>,
                  <span className="text-xs font-semibold text-slate-200">{f.purpose}</span>,
                  <span className="text-xs">{f.detail}</span>,
                ]} />
              ))}
            </Table>
          </div>

          <div>
            <SectionHeader title="Purchasing Options" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
              {ec2PurchasingOptions.map(o => (
                <div key={o.option} className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-200 text-sm">{o.option}</h3>
                    <span className="text-xs font-mono text-success">{o.discount}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-xs text-subtle">Commitment: </span>
                    <span className="text-xs text-slate-300">{o.commitment}</span>
                  </div>
                  <p className="text-xs text-subtle mb-2">{o.bestFor}</p>
                  <p className="text-xs text-slate-400 italic">{o.notes}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="Placement Groups" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              {ec2PlacementGroups.map(g => (
                <div key={g.type} className="card p-4">
                  <h3 className="font-bold text-aws text-sm mb-1">{g.type}</h3>
                  <p className="text-xs text-subtle mb-2"><span className="text-slate-400">Layout:</span> {g.layout}</p>
                  <p className="text-xs text-success mb-1">✓ {g.pros}</p>
                  <p className="text-xs text-danger mb-2">✗ {g.cons}</p>
                  <p className="text-xs text-slate-300"><span className="text-subtle">Best for:</span> {g.useCase}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="Load Balancers" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {lbTypes.map(lb => (
                <div key={lb.type} className="card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-slate-200 text-sm">{lb.type}</h3>
                    <span className="text-xs font-mono text-aws border border-aws/30 bg-aws/10 px-2 py-0.5 rounded">{lb.layer}</span>
                  </div>
                  <p className="text-xs text-subtle mb-1"><span className="text-slate-400">Protocols:</span> {lb.protocols}</p>
                  <p className="text-xs text-subtle mb-1"><span className="text-slate-400">Routing:</span> {lb.routing}</p>
                  <p className="text-xs text-slate-300 mb-1">{lb.features}</p>
                  <p className="text-xs text-aws">{lb.useCase}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-3">Key EC2 Concepts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'AMI is region-specific; copy cross-region for DR',
                'EBS-backed: data persists on stop; instance store: ephemeral',
                'User Data: script runs once on first boot (or with cloud-init)',
                'Instance Metadata: 169.254.169.254/latest/meta-data/ (IMDSv2 preferred)',
                'Elastic Network Interface (ENI): can be attached/detached; preserves MAC',
                'Enhanced Networking (SR-IOV): up to 100 Gbps; ENA or VF driver',
                'Hibernate: saves RAM to EBS, faster resume. Root EBS must be encrypted.',
                'EC2 Image Builder: automated AMI pipeline for patching and testing',
              ].map(f => (
                <div key={f} className="flex items-start gap-2 text-xs text-subtle">
                  <span className="text-aws mt-0.5 flex-shrink-0">•</span>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Storage ─── */}
      {activeTab === 'storage' && (
        <div className="space-y-8">
          <div>
            <SectionHeader title="S3 Storage Classes" />
            <div className="card overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {['Class', 'Availability', 'Retrieval Fee', 'Min Storage', 'Min Duration', 'Best For'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-subtle font-medium text-xs uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s3StorageClasses.map(s => (
                      <tr key={s.name} className="border-b border-border/40 last:border-b-0 hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-semibold text-aws text-xs">{s.name}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-300">{s.availability}</td>
                        <td className="px-4 py-3 text-xs">{s.retrievalFee}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-400">{s.minStorage}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-400">{s.minDuration}</td>
                        <td className="px-4 py-3 text-xs text-subtle">{s.useCase}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <SectionHeader title="S3 Features" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {s3Features.map(f => (
                <div key={f.feature} className="card p-4">
                  <h3 className="font-semibold text-aws text-sm mb-1">{f.feature}</h3>
                  <p className="text-xs text-subtle leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="EBS Volume Types" />
            <Table heads={['Type', 'IOPS', 'Throughput', 'Cost', 'Use Case']}>
              {ebsTypes.map(e => (
                <Tr key={e.type} cells={[
                  <span className="font-bold text-slate-200 text-xs">{e.type}</span>,
                  <span className="font-mono text-xs text-aws">{e.iops}</span>,
                  <span className="font-mono text-xs text-slate-300">{e.throughput}</span>,
                  <span className="text-xs">{e.cost}</span>,
                  <span className="text-xs">{e.useCase}</span>,
                ]} />
              ))}
            </Table>
          </div>

          <div>
            <SectionHeader title="Storage Comparison" />
            <Table heads={['Dimension', 'EBS', 'EFS', 'S3', 'Instance Store']}>
              {storageComparison.map(r => (
                <Tr key={r.dimension} cells={[
                  <span className="font-medium text-slate-300">{r.dimension}</span>,
                  <span className="text-xs">{r.ebs}</span>,
                  <span className="text-xs">{r.efs}</span>,
                  <span className="text-xs">{r.s3}</span>,
                  <span className="text-xs">{r.instanceStore}</span>,
                ]} />
              ))}
            </Table>
          </div>
        </div>
      )}

      {/* ─── Databases ─── */}
      {activeTab === 'databases' && (
        <div className="space-y-8">
          <div>
            <SectionHeader title="RDS Engines" />
            <Table heads={['Engine', 'Version', 'Notes']}>
              {rdsEngines.map(e => (
                <Tr key={e.engine} cells={[
                  <span className="font-bold text-aws">{e.engine}</span>,
                  <code className="text-xs font-mono text-slate-400">{e.version}</code>,
                  <span className="text-xs">{e.notes}</span>,
                ]} />
              ))}
            </Table>
          </div>

          <div>
            <SectionHeader title="RDS Features" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {rdsFeatures.map(f => (
                <div key={f.feature} className="card p-4">
                  <h3 className="font-semibold text-aws text-sm mb-1">{f.feature}</h3>
                  <p className="text-xs text-subtle leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="DynamoDB Concepts" />
            <Table heads={['Concept', 'Description']}>
              {dynamoDBConcepts.map(c => (
                <Tr key={c.concept} cells={[
                  <span className="font-bold text-aws">{c.concept}</span>,
                  <span className="text-xs">{c.description}</span>,
                ]} />
              ))}
            </Table>
          </div>

          <div>
            <SectionHeader title="ElastiCache: Redis vs Memcached" />
            <Table heads={['Feature', 'Redis', 'Memcached']}>
              {cacheComparison.map(c => (
                <Tr key={c.feature} cells={[
                  <span className="font-medium text-slate-300">{c.feature}</span>,
                  <span className="text-xs text-green-400">{c.redis}</span>,
                  <span className="text-xs text-yellow-400">{c.memcached}</span>,
                ]} />
              ))}
            </Table>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-3">Key Database Decision Points</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Need ACID transactions + SQL → RDS or Aurora',
                'Need massive scale + key-value/NoSQL → DynamoDB',
                'Need in-memory caching + persistence/pub-sub → Redis (ElastiCache)',
                'Need simple caching, horizontal scale → Memcached',
                'Need data warehousing/analytics → Redshift (columnar)',
                'Need graph data → Neptune',
                'Need time-series data → Timestream',
                'Need search/analytics → OpenSearch (Elasticsearch)',
                'Multi-AZ for HA, Read Replicas for read scaling (RDS)',
                'Aurora is 5x PostgreSQL performance, auto-scales storage to 128 TB',
              ].map(f => (
                <div key={f} className="flex items-start gap-2 text-xs text-subtle">
                  <span className="text-aws mt-0.5 flex-shrink-0">→</span>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── HA & Scaling ─── */}
      {activeTab === 'ha' && (
        <div className="space-y-8">
          <div>
            <SectionHeader title="Route 53 Routing Policies" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {route53Policies.map(p => (
                <div key={p.policy} className="card p-4">
                  <h3 className="font-semibold text-aws text-sm mb-1">{p.policy}</h3>
                  <p className="text-xs text-subtle leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="Auto Scaling Policies" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {autoScalingPolicies.map(p => (
                <div key={p.policy} className="card p-4">
                  <h3 className="font-semibold text-aws text-sm mb-1">{p.policy}</h3>
                  <p className="text-xs text-subtle leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-slate-200 text-sm mb-3">Auto Scaling Key Concepts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Launch Template (preferred) or Launch Configuration defines instance config',
                  'Min, Max, Desired capacity — ASG keeps desired count',
                  'Cooldown period (default 300s): prevents rapid scaling after event',
                  'Lifecycle hooks: pause instance during launch/terminate for custom actions',
                  'Scale-in protection: prevent specific instances from termination',
                  'Warm pools: pre-launched, pre-configured instances ready to join ASG',
                  'Health checks: EC2 (default) or ELB (recommended for web apps)',
                  'Termination policy: default = OldestLaunchTemplate → closest to next billing hour',
                ].map(f => (
                  <div key={f} className="flex items-start gap-2 text-xs text-subtle">
                    <span className="text-aws mt-0.5 flex-shrink-0">•</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <SectionHeader title="CloudFront" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {cloudfrontConcepts.map(c => (
                <div key={c.concept} className="card p-4">
                  <h3 className="font-semibold text-aws text-sm mb-1">{c.concept}</h3>
                  <p className="text-xs text-subtle leading-relaxed">{c.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-3">HA Architecture Patterns</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Deploy across minimum 2 AZs for HA, 3 for high resilience',
                'Use ALB + ASG for stateless web tiers',
                'RDS Multi-AZ for database HA (automatic failover)',
                'ElastiCache for session state (stateless app servers)',
                'S3 for static assets + CloudFront for global distribution',
                'Route 53 Failover policy for active-passive DR',
                'CloudFront + S3 for global static website with zero infra',
                'SQS + Lambda for decoupled, fault-tolerant async processing',
              ].map(f => (
                <div key={f} className="flex items-start gap-2 text-xs text-subtle">
                  <span className="text-aws mt-0.5 flex-shrink-0">→</span>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Security Services ─── */}
      {activeTab === 'security' && (
        <div className="space-y-8">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <SectionHeader title="AWS Security Services" />
              <div className="flex flex-wrap gap-1 pb-4">
                {['All', ...securityCategories].map(cat => (
                  <button key={cat} onClick={() => setSecFilter(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border ${secFilter === cat ? 'bg-danger text-white border-danger' : 'bg-surface border-border text-subtle hover:text-slate-200'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredSec.map(s => (
                <div key={s.service} className="card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-slate-200 text-sm">{s.service}</h3>
                    <span className="text-xs text-danger bg-danger/10 border border-danger/20 px-2 py-0.5 rounded">{s.category}</span>
                  </div>
                  <p className="text-xs text-subtle leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-3">Encryption Key Points</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'KMS: max 4 KB data per Encrypt API call — use envelope encryption for larger data',
                'Envelope encryption: KMS encrypts the data key, data key encrypts the data',
                'CMK types: AWS managed (free, auto-rotate), Customer managed (charge, you control), Customer provided (BYOK)',
                'S3 SSE: SSE-S3 (AWS-managed keys), SSE-KMS (KMS keys, audit trail), SSE-C (customer-provided keys)',
                'RDS encryption: must enable at creation time; cannot encrypt unencrypted DB in-place (snapshot → copy → restore)',
                'CloudTrail: stores logs in S3; use KMS to encrypt; log file validation for integrity',
                'ACM certificates: FREE for ALB/CloudFront; cannot be exported from ACM',
                'Secrets Manager auto-rotation uses Lambda function; no downtime if apps handle rotation',
              ].map(f => (
                <div key={f} className="flex items-start gap-2 text-xs text-subtle">
                  <span className="text-aws mt-0.5 flex-shrink-0">•</span>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Serverless ─── */}
      {activeTab === 'serverless' && (
        <div className="space-y-6">
          <SectionHeader title="Serverless Services" />
          {serverlessServices.map(s => (
            <div key={s.service} className="card p-5">
              <h3 className="font-bold text-aws text-base mb-2">{s.service}</h3>
              <p className="text-sm text-subtle mb-3 leading-relaxed">{s.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-mono mb-1">Limits & Quotas</p>
                  <p className="text-xs text-subtle">{s.limits}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-mono mb-1">Use Cases</p>
                  <p className="text-xs text-subtle">{s.useCase}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="card p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-3">Serverless Architecture Patterns</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'API Gateway + Lambda + DynamoDB = fully serverless REST API',
                'S3 event → Lambda → process and store results (image resize, ETL)',
                'SNS → SQS → Lambda = fan-out with buffering and retry',
                'EventBridge → Lambda = event-driven microservices',
                'Step Functions orchestrate multi-step Lambda workflows with retry/error',
                'Kinesis → Lambda = real-time stream processing',
                'DynamoDB Streams → Lambda = event-driven data replication',
                'Lambda@Edge for A/B testing, auth, URL rewriting at CloudFront edge',
              ].map(f => (
                <div key={f} className="flex items-start gap-2 text-xs text-subtle">
                  <span className="text-aws mt-0.5 flex-shrink-0">→</span>
                  {f}
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
