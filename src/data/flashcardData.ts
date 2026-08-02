import { portEntries, osiLayers } from './referenceData'
import {
  wirelessStandards, wirelessSecurity, attackTypes, routingProtocols, vpnProtocols,
  dnsRecordTypes, ipv6AddressTypes, ndpMessages, eui64Desc,
  natTerminology, aclTypes, stpFeatures, sdnConcepts, netconfYang,
} from './netplusData'
import { coreServicesOverview, wellArchPillars, ec2PricingSimple, iamBasics, infraConcepts, clfScenarioTips, clfCommonGotchas } from './awsData'

export interface Flashcard {
  id: number
  front: string
  back: string
  category: string
}

export interface FlashcardDeck {
  id: 'netplus' | 'aws'
  label: string
  code: string
  tagCls: string
  categories: { id: string; label: string }[]
  cards: Flashcard[]
}

let _n = 0
const uid = () => _n++

// ── Net+ ──────────────────────────────────────────────────────────────────────

const portCards: Flashcard[] = portEntries.map(p => ({
  id: uid(),
  front: `Port ${p.port}`,
  back: `${p.service}\n${p.protocol} — ${p.description}`,
  category: 'ports',
}))

const osiCards: Flashcard[] = osiLayers.map(l => ({
  id: uid(),
  front: `OSI Layer ${l.number} — ${l.name}`,
  back: `PDU: ${l.pdu}\nProtocols: ${l.protocols.join(', ')}\nDevices: ${l.devices.join(', ')}\n\n${l.function}`,
  category: 'osi',
}))

const wirelessStdCards: Flashcard[] = wirelessStandards.map(w => ({
  id: uid(),
  front: w.standard,
  back: `Frequency: ${w.freq}\nMax Speed: ${w.maxSpeed}\nRange: ${w.range}\n\n${w.features}`,
  category: 'wireless',
}))

const wirelessSecCards: Flashcard[] = wirelessSecurity.map(w => ({
  id: uid(),
  front: `${w.standard} (${w.year})`,
  back: `Encryption: ${w.encryption}\nAuth: ${w.auth}\nStatus: ${w.status}\n\n${w.notes}`,
  category: 'wireless',
}))

const attackCards: Flashcard[] = attackTypes.slice(0, 18).map(a => ({
  id: uid(),
  front: `Attack: ${a.name}`,
  back: `Category: ${a.category}\n\n${a.description}`,
  category: 'attacks',
}))

const routingCards: Flashcard[] = routingProtocols.map(r => ({
  id: uid(),
  front: `Routing Protocol: ${r.name}`,
  back: `Type: ${r.type}\nMetric: ${r.metric}\nAdmin Distance: ${r.ad}\nConvergence: ${r.convergence}\n\n${r.notes}`,
  category: 'concepts',
}))

const vpnCards: Flashcard[] = vpnProtocols.slice(0, 4).map(v => ({
  id: uid(),
  front: `VPN: ${v.protocol}`,
  back: `Ports: ${v.ports}\nEncryption: ${v.encryption}\nModes: ${v.modes}\n\n${v.notes}`,
  category: 'concepts',
}))

const netplusMiscCards: Flashcard[] = [
  {
    id: uid(),
    front: '3 types of NAT',
    back: 'Static NAT — one private IP ↔ one public IP (servers needing a consistent address)\nDynamic NAT — pool of public IPs, first-come first-served (limited by pool)\nPAT / NAT Overload — many private IPs share ONE public IP via unique ports (most common in SOHO)',
    category: 'concepts',
  },
  {
    id: uid(),
    front: 'STP Port States (in order)',
    back: '1. Blocking (20 sec) — receives BPDUs only, no forwarding/learning\n2. Listening (15 sec) — processes BPDUs, no forwarding/learning\n3. Learning (15 sec) — builds MAC table, no forwarding\n4. Forwarding — fully operational\n5. Disabled — admin shutdown, no BPDUs',
    category: 'concepts',
  },
  {
    id: uid(),
    front: 'STP Port Roles',
    back: 'Root Port — best path to root bridge, one per non-root switch\nDesignated Port — best port per segment, one per segment\nAlternate Port (RSTP) — backup to root port, in blocking\nBackup Port (RSTP) — backup designated port, less common',
    category: 'concepts',
  },
  {
    id: uid(),
    front: 'DHCP DORA Process',
    back: 'Discover — client broadcasts (src 0.0.0.0, dst 255.255.255.255) to find servers\nOffer — server responds with IP, mask, lease time, gateway, DNS\nRequest — client broadcasts acceptance (notifies all servers of choice)\nAcknowledge — server confirms the lease; client starts using IP',
    category: 'concepts',
  },
  {
    id: uid(),
    front: 'CompTIA 7-Step Troubleshooting Model',
    back: '1. Identify the problem\n2. Establish a theory of probable cause\n3. Test the theory\n4. Establish a plan of action\n5. Implement the solution\n6. Verify full system functionality\n7. Document findings and actions',
    category: 'concepts',
  },
  {
    id: uid(),
    front: 'Non-overlapping Wi-Fi channels',
    back: '2.4 GHz: only channels 1, 6, 11 (US) — 22 MHz wide, 5 MHz spacing\n5 GHz: all channels non-overlapping with proper spacing\n6 GHz (Wi-Fi 6E/7): all 59 channels non-overlapping',
    category: 'wireless',
  },
  {
    id: uid(),
    front: 'IPv4 Private Address Ranges (RFC 1918)',
    back: 'Class A: 10.0.0.0/8 — 10.0.0.0 to 10.255.255.255\nClass B: 172.16.0.0/12 — 172.16.0.0 to 172.31.255.255\nClass C: 192.168.0.0/16 — 192.168.0.0 to 192.168.255.255',
    category: 'concepts',
  },
  {
    id: uid(),
    front: 'TCP vs UDP — key differences',
    back: 'TCP: Connection-oriented, reliable, ordered, ACKs, flow control, 20–60 byte header\nUDP: Connectionless, best-effort, no ordering, no ACK, 8 byte header\n\nTCP use: HTTP/S, SSH, FTP, SMTP\nUDP use: DNS, DHCP, VoIP, TFTP, streaming',
    category: 'concepts',
  },
  {
    id: uid(),
    front: 'VLAN Types',
    back: 'Data VLAN — regular user traffic\nVoice VLAN — VoIP with QoS priority (low latency)\nManagement VLAN — SSH/SNMP/Telnet (never use VLAN 1)\nNative VLAN — untagged traffic on trunk (change from VLAN 1 for security)\nDefault VLAN — VLAN 1, all ports assigned by default',
    category: 'concepts',
  },
  {
    id: uid(),
    front: '802.1X — Port-Based Authentication',
    back: 'EAP-based auth before granting network access\n\nRoles:\n• Supplicant — the client device\n• Authenticator — the switch or AP\n• Authentication Server — RADIUS (port 1812/1813)\n\nClient must authenticate before the switch port forwards any traffic',
    category: 'concepts',
  },
  {
    id: uid(),
    front: 'RADIUS vs TACACS+',
    back: 'RADIUS: UDP 1812/1813, encrypts password only, combines Auth+Authz\nTACACS+: TCP 49, encrypts entire payload, separates AAA (Auth/Authz/Accounting)\n\nRADIUS — standard, used for VPN/wireless\nTACACS+ — Cisco proprietary, preferred for device administration',
    category: 'concepts',
  },
  {
    id: uid(),
    front: 'DNS Record Types — key ones',
    back: 'A — hostname → IPv4\nAAAA — hostname → IPv6\nCNAME — alias → hostname\nMX — mail server for domain\nPTR — IP → hostname (reverse DNS)\nTXT — arbitrary text (SPF, DKIM, DMARC)\nNS — authoritative name servers\nSOA — start of authority, zone metadata',
    category: 'concepts',
  },
]

const dnsRecordCards: Flashcard[] = dnsRecordTypes.map(r => ({
  id: uid(),
  front: `DNS Record: ${r.type}`,
  back: `${r.description}\n\nExample: ${r.example}`,
  category: 'dns',
}))

const ipv6TypeCards: Flashcard[] = ipv6AddressTypes.map(t => ({
  id: uid(),
  front: `IPv6: ${t.type}`,
  back: `Prefix: ${t.prefix}\nIPv4 equivalent: ${t.equiv}\n\n${t.desc}`,
  category: 'ipv6',
}))

const ndpCards: Flashcard[] = ndpMessages.map(m => ({
  id: uid(),
  front: `NDP: ${m.type}`,
  back: `${m.icmpv6} → ${m.dst}\n\n${m.desc}`,
  category: 'ipv6',
}))

const eui64Card: Flashcard = {
  id: uid(),
  front: 'How does EUI-64 work?',
  back: eui64Desc,
  category: 'ipv6',
}

const natTermCards: Flashcard[] = natTerminology.map(t => ({
  id: uid(),
  front: `NAT: ${t.term}`,
  back: t.def,
  category: 'cisco',
}))

const aclCards: Flashcard[] = aclTypes.map(a => ({
  id: uid(),
  front: a.type,
  back: `Numbers: ${a.numbers}\nMatches: ${a.matches}\nPlacement: ${a.placement}\n\n${a.placementReason}`,
  category: 'cisco',
}))

const stpFeatureCards: Flashcard[] = stpFeatures.map(f => ({
  id: uid(),
  front: `STP: ${f.feature}`,
  back: `${f.desc}\n\nCommand: ${f.cmd}`,
  category: 'cisco',
}))

const wildcardCard: Flashcard = {
  id: uid(),
  front: 'Wildcard mask shortcut',
  back: 'Wildcard = 255.255.255.255 − subnet mask.\n\n/24 → 0.0.0.255\n/26 → 0.0.0.63\n/30 → 0.0.0.3\nhost → 0.0.0.0\nany → 255.255.255.255\n\nWildcard bit 1 = ignore, bit 0 = must match.',
  category: 'cisco',
}

const sdnCards: Flashcard[] = sdnConcepts.map(c => ({
  id: uid(),
  front: `SDN: ${c.concept}`,
  back: c.desc,
  category: 'automation',
}))

const netconfCards: Flashcard[] = netconfYang.map(p => ({
  id: uid(),
  front: p.item,
  back: p.desc,
  category: 'automation',
}))

// ── AWS ───────────────────────────────────────────────────────────────────────

const awsServiceCards: Flashcard[] = coreServicesOverview.map(s => ({
  id: uid(),
  front: `AWS ${s.service} — ${s.tagline}`,
  back: `${s.description}\n\nKey facts:\n${s.keyFacts.map(f => `• ${f}`).join('\n')}`,
  category: 'services',
}))

const wellArchCards: Flashcard[] = wellArchPillars.map(p => ({
  id: uid(),
  front: `Well-Architected Pillar ${p.num}: ${p.name}`,
  back: `${p.description}\n\nDesign principles:\n${p.designPrinciples.map(d => `• ${d}`).join('\n')}`,
  category: 'well-arch',
}))

const pricingCards: Flashcard[] = ec2PricingSimple.map(p => ({
  id: uid(),
  front: `EC2 Pricing: ${p.type}`,
  back: `Commitment: ${p.commitment}\nSavings: ${p.savings}\n\n${p.description}`,
  category: 'pricing',
}))

const iamCards: Flashcard[] = iamBasics.map(i => ({
  id: uid(),
  front: `AWS IAM: ${i.concept}`,
  back: i.description,
  category: 'iam',
}))

const infraCards: Flashcard[] = infraConcepts.map(c => ({
  id: uid(),
  front: `AWS: ${c.term}`,
  back: c.definition,
  category: 'infrastructure',
}))

const scenarioCards: Flashcard[] = clfScenarioTips.slice(0, 20).map(s => ({
  id: uid(),
  front: s.trigger,
  back: `Answer: ${s.answer}\n\nWhy: ${s.why}`,
  category: 'scenarios',
}))

const gotchaCards: Flashcard[] = clfCommonGotchas.map(g => ({
  id: uid(),
  front: `Misconception: "${g.gotcha}"`,
  back: `Correction:\n${g.correction}`,
  category: 'gotchas',
}))

// ── Exported decks ────────────────────────────────────────────────────────────

export const flashcardDecks: FlashcardDeck[] = [
  {
    id: 'netplus',
    label: 'Network+',
    code: 'N10-009',
    tagCls: 'tag-net',
    categories: [
      { id: 'all', label: 'All' },
      { id: 'ports', label: 'Ports' },
      { id: 'osi', label: 'OSI Model' },
      { id: 'wireless', label: 'Wireless' },
      { id: 'attacks', label: 'Attacks' },
      { id: 'concepts', label: 'Concepts' },
      { id: 'dns', label: 'DNS Records' },
      { id: 'ipv6', label: 'IPv6' },
      { id: 'cisco', label: 'NAT / ACL / STP' },
      { id: 'automation', label: 'Automation' },
    ],
    cards: [
      ...portCards,
      ...osiCards,
      ...wirelessStdCards,
      ...wirelessSecCards,
      ...attackCards,
      ...routingCards,
      ...vpnCards,
      ...netplusMiscCards,
      ...dnsRecordCards,
      ...ipv6TypeCards,
      ...ndpCards,
      eui64Card,
      ...natTermCards,
      ...aclCards,
      ...stpFeatureCards,
      wildcardCard,
      ...sdnCards,
      ...netconfCards,
    ],
  },
  {
    id: 'aws',
    label: 'AWS CLF',
    code: 'CLF-C02',
    tagCls: 'tag-aws',
    categories: [
      { id: 'all', label: 'All' },
      { id: 'services', label: 'Services' },
      { id: 'iam', label: 'IAM' },
      { id: 'pricing', label: 'Pricing' },
      { id: 'infrastructure', label: 'Infrastructure' },
      { id: 'well-arch', label: 'Well-Architected' },
      { id: 'scenarios', label: 'Scenarios' },
      { id: 'gotchas', label: 'Gotchas' },
    ],
    cards: [
      ...awsServiceCards,
      ...iamCards,
      ...pricingCards,
      ...infraCards,
      ...wellArchCards,
      ...scenarioCards,
      ...gotchaCards,
    ],
  },
]
