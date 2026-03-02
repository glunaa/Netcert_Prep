import type { SubnetInput, SubnetResult } from '../types'

function ipToNum(ip: string): number {
  return ip.split('.').reduce((acc, oct) => (acc << 8) + parseInt(oct), 0) >>> 0
}
function numToIp(num: number): string {
  return [(num >>> 24) & 255,(num >>> 16) & 255,(num >>> 8) & 255, num & 255].join('.')
}
function prefixToMask(prefix: number): string {
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
  return numToIp(mask)
}
function nextPowerOf2(n: number): number {
  let p = 2; while (p < n) p *= 2; return p
}
export function validateIp(ip: string): boolean {
  const parts = ip.split('.')
  if (parts.length !== 4) return false
  return parts.every(p => { const n = parseInt(p); return !isNaN(n) && n >= 0 && n <= 255 })
}
export function calculateVLSM(networkIp: string, prefix: number, subnets: SubnetInput[]): SubnetResult[] | { error: string } {
  if (!validateIp(networkIp)) return { error: 'Invalid network IP address' }
  if (prefix < 8 || prefix > 30) return { error: 'Prefix must be between /8 and /30' }
  if (subnets.length === 0) return { error: 'Add at least one subnet' }
  const sorted = [...subnets].sort((a, b) => b.hosts - a.hosts)
  const networkStart = ipToNum(networkIp)
  const networkSize = Math.pow(2, 32 - prefix)
  const networkEnd = networkStart + networkSize - 1
  const results: SubnetResult[] = []
  let current = networkStart
  for (const subnet of sorted) {
    const blockSize = nextPowerOf2(subnet.hosts + 2)
    const subnetPrefix = 32 - Math.log2(blockSize)
    if (current % blockSize !== 0) current = (Math.floor(current / blockSize) + 1) * blockSize
    const subnetEnd = current + blockSize - 1
    if (subnetEnd > networkEnd) return { error: `Not enough address space for "${subnet.label}" (${subnet.hosts} hosts).` }
    results.push({ label: subnet.label, hosts_requested: subnet.hosts, subnet: numToIp(current) + '/' + subnetPrefix, mask: prefixToMask(subnetPrefix), first_host: numToIp(current + 1), last_host: numToIp(subnetEnd - 1), broadcast: numToIp(subnetEnd), usable_hosts: blockSize - 2, prefix: subnetPrefix })
    current = subnetEnd + 1
  }
  return results
}