import { useState } from 'react'

type OS = 'windows' | 'linux' | 'cisco'

interface Command {
  cmd: string
  desc: string
  flags?: string
  example?: string
}

interface CommandGroup {
  category: string
  commands: Command[]
}

const windowsCommands: CommandGroup[] = [
  {
    category: 'IP Configuration',
    commands: [
      { cmd: 'ipconfig', desc: 'Show IP configuration for all adapters', flags: '/all — detailed info including MAC\n/release — release DHCP lease\n/renew — renew DHCP lease\n/flushdns — clear DNS cache\n/registerdns — re-register in DNS', example: 'ipconfig /all' },
      { cmd: 'netsh interface ip show config', desc: 'Show detailed interface IP settings', example: 'netsh interface ip show config' },
      { cmd: 'netsh interface ip set address', desc: 'Set a static IP (or switch back to DHCP) from the CLI', example: 'netsh interface ip set address "Ethernet" static 192.168.1.50 255.255.255.0 192.168.1.1\nnetsh interface ip set address "Ethernet" dhcp' },
      { cmd: 'netsh int ip reset', desc: 'Rebuild the TCP/IP stack — classic fix for broken connectivity (reboot after)', example: 'netsh int ip reset\nnetsh winsock reset' },
      { cmd: 'getmac /v', desc: 'List MAC addresses and their adapter bindings', flags: '/v — verbose (adapter names)\n/fo list — list format', example: 'getmac /v /fo list' },
      { cmd: 'Get-NetIPConfiguration', desc: 'PowerShell: ipconfig equivalent with richer, filterable output', example: 'Get-NetIPConfiguration -Detailed' },
    ],
  },
  {
    category: 'Wireless',
    commands: [
      { cmd: 'netsh wlan show interfaces', desc: 'Show live Wi-Fi details: SSID, BSSID, channel, band, and signal %', example: 'netsh wlan show interfaces' },
      { cmd: 'netsh wlan show profiles', desc: 'List saved Wi-Fi profiles — add key=clear to reveal a saved password', example: 'netsh wlan show profiles\nnetsh wlan show profile name="HomeWiFi" key=clear' },
      { cmd: 'netsh wlan show wlanreport', desc: 'Generate a detailed HTML Wi-Fi report (history, disconnects, errors)', example: 'netsh wlan show wlanreport' },
    ],
  },
  {
    category: 'Connectivity Testing',
    commands: [
      { cmd: 'ping', desc: 'Test connectivity to a host using ICMP echo requests', flags: '-t — ping until stopped\n-n <count> — number of packets\n-l <size> — packet size\n-a — resolve hostname', example: 'ping -t 8.8.8.8' },
      { cmd: 'tracert', desc: 'Trace the route to a host, showing each hop', flags: '-d — no reverse DNS lookup (faster)\n-h <hops> — max hops', example: 'tracert -d google.com' },
      { cmd: 'pathping', desc: 'Combines ping and tracert with packet loss statistics', example: 'pathping google.com' },
      { cmd: 'Test-NetConnection', desc: 'PowerShell: test TCP port connectivity', flags: '-Port <n> — test a TCP port\n-TraceRoute — include route trace\n-InformationLevel Detailed', example: 'Test-NetConnection -ComputerName google.com -Port 443' },
      { cmd: 'curl.exe', desc: 'Real curl ships with Windows 10+ — test HTTP(S) endpoints without a browser', flags: '-I — headers only\n-v — verbose (shows TLS handshake)\n-L — follow redirects', example: 'curl.exe -I https://example.com' },
    ],
  },
  {
    category: 'DNS',
    commands: [
      { cmd: 'nslookup', desc: 'Query DNS servers for name resolution', flags: 'Type a domain to query\nset type=MX — query MX records\nset type=NS — name servers', example: 'nslookup google.com 8.8.8.8' },
      { cmd: 'ipconfig /flushdns', desc: 'Flush the local DNS resolver cache', example: 'ipconfig /flushdns' },
      { cmd: 'ipconfig /displaydns', desc: 'Display cached DNS entries', example: 'ipconfig /displaydns' },
      { cmd: 'Resolve-DnsName', desc: 'PowerShell: modern nslookup replacement with full record-type support', flags: '-Type MX/TXT/NS/PTR\n-Server <ip> — query a specific DNS server\n-DnssecOk — request DNSSEC data', example: 'Resolve-DnsName google.com -Type MX -Server 8.8.8.8' },
    ],
  },
  {
    category: 'Connections & Ports',
    commands: [
      { cmd: 'netstat', desc: 'Display active TCP/UDP connections and listening ports', flags: '-a — all connections and ports\n-n — numeric addresses\n-o — include PID\n-b — include process name\n-e — interface statistics', example: 'netstat -ano' },
      { cmd: 'Get-NetTCPConnection', desc: 'PowerShell: netstat replacement — filter and sort connections as objects', flags: '-State Listen — listening ports only\n-LocalPort <n> — filter by port\n-OwningProcess — PID column', example: 'Get-NetTCPConnection -State Listen' },
      { cmd: 'arp', desc: 'View and manage the ARP cache (IP to MAC mappings)', flags: '-a — show ARP cache\n-d <ip> — delete entry\n-s <ip> <mac> — add static entry', example: 'arp -a' },
      { cmd: 'nbtstat', desc: 'NetBIOS over TCP/IP statistics and name resolution', flags: '-A <ip> — remote name table by IP\n-c — name cache\n-R — purge and reload cache', example: 'nbtstat -A 192.168.1.10' },
      { cmd: 'netstat -r', desc: 'Display routing table (same as route print)', example: 'netstat -r' },
    ],
  },
  {
    category: 'Routing',
    commands: [
      { cmd: 'route', desc: 'View and modify the IP routing table', flags: 'print — display routing table\nadd — add a route\ndelete — remove a route\nchange — modify a route\n-p — make an added route persistent across reboots', example: 'route print\nroute -p add 10.0.0.0 mask 255.0.0.0 192.168.1.1' },
    ],
  },
]

const linuxCommands: CommandGroup[] = [
  {
    category: 'IP Configuration',
    commands: [
      { cmd: 'ip addr', desc: 'Show IP addresses for all interfaces (modern)', flags: 'ip addr show eth0 — specific interface\nip addr add 10.0.0.1/24 dev eth0 — add IP\nip addr del 10.0.0.1/24 dev eth0 — remove IP', example: 'ip addr show' },
      { cmd: 'ifconfig', desc: 'Legacy interface configuration tool', flags: '-a — show all interfaces\neth0 up/down — enable or disable', example: 'ifconfig -a' },
      { cmd: 'ip link', desc: 'Show and manage network interfaces (Layer 2)', flags: 'ip link set eth0 up/down', example: 'ip link show' },
      { cmd: 'ethtool', desc: 'Show link speed, duplex, and NIC driver info — first stop for duplex-mismatch issues', flags: '-S eth0 — NIC statistics\n-p eth0 — blink the port LED to find the cable', example: 'ethtool eth0' },
      { cmd: 'nmcli', desc: 'NetworkManager CLI — manage connections on modern distros', flags: 'device status — all interfaces\ncon show — saved connections\ndevice wifi list — scan for Wi-Fi', example: 'nmcli device status' },
      { cmd: 'hostname -I', desc: 'Print just the host\'s IP address(es) — handy in scripts', example: 'hostname -I' },
    ],
  },
  {
    category: 'Connectivity Testing',
    commands: [
      { cmd: 'ping', desc: 'Send ICMP echo requests to test connectivity', flags: '-c <count> — number of packets\n-i <interval> — interval between packets\n-s <size> — packet size\n-I <interface> — use specific interface', example: 'ping -c 4 8.8.8.8' },
      { cmd: 'traceroute', desc: 'Trace route to destination using UDP probes', flags: '-n — no reverse DNS\n-I — use ICMP\n-T — use TCP', example: 'traceroute -n google.com' },
      { cmd: 'mtr', desc: 'Combined ping + traceroute with live statistics', example: 'mtr --report google.com' },
      { cmd: 'tracepath', desc: 'Like traceroute but needs no root privileges; also discovers path MTU', example: 'tracepath google.com' },
      { cmd: 'arping', desc: 'Ping at Layer 2 via ARP — works when ICMP is blocked; great for finding duplicate IPs', flags: '-D — duplicate address detection\n-I eth0 — interface to use', example: 'arping -I eth0 192.168.1.1' },
    ],
  },
  {
    category: 'DNS',
    commands: [
      { cmd: 'dig', desc: 'Query DNS (more powerful than nslookup)', flags: '@server — specify DNS server\n+short — terse output\nMX, NS, TXT — record types\n+trace — trace delegation', example: 'dig @8.8.8.8 google.com MX' },
      { cmd: 'nslookup', desc: 'Interactive or one-shot DNS queries', example: 'nslookup google.com' },
      { cmd: 'host', desc: 'Simple DNS lookup utility', example: 'host -t MX google.com' },
      { cmd: 'resolvectl', desc: 'systemd-resolved status: which DNS server each interface actually uses; can flush the cache', flags: 'status — per-link DNS servers\nflush-caches — clear resolver cache\nquery <name> — resolve via systemd', example: 'resolvectl status\nresolvectl flush-caches' },
    ],
  },
  {
    category: 'Connections & Ports',
    commands: [
      { cmd: 'ss', desc: 'Modern socket statistics (replacement for netstat)', flags: '-tuln — TCP/UDP listening numeric\n-tp — include process\n-s — summary statistics', example: 'ss -tuln' },
      { cmd: 'lsof -i', desc: 'Show which process owns a socket or port', flags: '-i :443 — filter by port\n-i @10.0.0.5 — filter by host\n-nP — numeric, no port names', example: 'lsof -i :443' },
      { cmd: 'nc (netcat)', desc: 'TCP/UDP swiss-army knife — test ports, run throwaway listeners, send raw data', flags: '-zv — port scan with status output\n-l <port> — listen\n-u — UDP mode', example: 'nc -zv google.com 443\nnc -l 9000' },
      { cmd: 'ip neigh', desc: 'Modern replacement for arp — show the neighbor (ARP/NDP) table', flags: 'show — list entries\nflush all — clear the table', example: 'ip neigh show' },
      { cmd: 'netstat', desc: 'Legacy network statistics (may require net-tools)', flags: '-tuln — TCP/UDP listening numeric\n-r — routing table\n-p — include process', example: 'netstat -tuln' },
      { cmd: 'tcpdump', desc: 'Capture and analyze network packets', flags: '-i eth0 — specify interface\n-n — no DNS lookup\nport 80 — filter by port\nhost 10.0.0.1 — filter by host', example: 'tcpdump -i eth0 -n port 443' },
      { cmd: 'arp', desc: 'View ARP cache', flags: '-n — numeric output\n-a — BSD-style output', example: 'arp -n' },
    ],
  },
  {
    category: 'Routing',
    commands: [
      { cmd: 'ip route', desc: 'View and manage routing table', flags: 'ip route show — display table\nip route add 10.0.0.0/8 via 192.168.1.1 — add route\nip route del — remove route\nip route get <ip> — show best route', example: 'ip route show\nip route get 8.8.8.8' },
      { cmd: 'route -n', desc: 'Legacy routing table display (numeric)', example: 'route -n' },
    ],
  },
  {
    category: 'Misc',
    commands: [
      { cmd: 'curl', desc: 'Transfer data from/to URLs (HTTP, FTP, etc.)', flags: '-I — headers only\n-L — follow redirects\n-o <file> — save output\n-v — verbose', example: 'curl -I https://example.com' },
      { cmd: 'nmap', desc: 'Network scanner — discover hosts and open ports', flags: '-sn — ping scan only\n-sV — service version detection\n-p- — all ports', example: 'nmap -sn 192.168.1.0/24' },
      { cmd: 'iperf3', desc: 'Measure real network throughput between two hosts', flags: '-s — run as server\n-c <host> — run as client\n-R — reverse direction\n-u — UDP test', example: 'iperf3 -s          # on one host\niperf3 -c 10.0.0.5 # on the other' },
      { cmd: 'whois', desc: 'Look up domain registration and IP block ownership', example: 'whois example.com' },
    ],
  },
]

const ciscoCommands: CommandGroup[] = [
  {
    category: 'Show Commands',
    commands: [
      { cmd: 'show ip interface brief', desc: 'Quick view of all interface IP addresses and states', example: 'Router# show ip interface brief' },
      { cmd: 'show running-config', desc: 'Display the current active configuration in RAM', flags: '| include — filter output\n| section — show a section\ninterface Gi0/0 — specific interface config', example: 'Router# show running-config | include hostname' },
      { cmd: 'show startup-config', desc: 'Display saved configuration in NVRAM', example: 'Router# show startup-config' },
      { cmd: 'show version', desc: 'Show IOS version, uptime, hardware info', example: 'Router# show version' },
      { cmd: 'show ip route', desc: 'Display the routing table', flags: '| begin — start at a line\nstatic — show only static routes\nospf — OSPF routes only', example: 'Router# show ip route' },
      { cmd: 'show interfaces', desc: 'Show detailed status and statistics for all interfaces', example: 'Router# show interfaces GigabitEthernet 0/0' },
      { cmd: 'show mac address-table', desc: 'View the Layer 2 MAC address forwarding table (switch)', example: 'Switch# show mac address-table' },
      { cmd: 'show vlan brief', desc: 'Display VLAN database and port assignments (switch)', example: 'Switch# show vlan brief' },
      { cmd: 'show cdp neighbors', desc: 'Show directly connected Cisco devices via CDP', flags: 'detail — more info including IP', example: 'Switch# show cdp neighbors detail' },
      { cmd: 'show spanning-tree', desc: 'Display STP topology, root bridge, and port states', example: 'Switch# show spanning-tree vlan 10' },
      { cmd: 'show ip ospf neighbor', desc: 'View OSPF adjacencies', example: 'Router# show ip ospf neighbor' },
      { cmd: 'show interfaces status', desc: 'One line per switchport: connected/notconnect, VLAN, speed, duplex — fastest port health check', example: 'Switch# show interfaces status' },
      { cmd: 'show interfaces trunk', desc: 'List trunk ports, their allowed VLANs, and native VLAN', example: 'Switch# show interfaces trunk' },
      { cmd: 'show ip arp', desc: 'Display the device\'s ARP table (IP-to-MAC on routed interfaces)', example: 'Router# show ip arp' },
      { cmd: 'show port-security interface', desc: 'Port security status: violation mode, counts, and secure MACs', example: 'Switch# show port-security interface Gi0/1' },
      { cmd: 'show ip dhcp binding', desc: 'Leases handed out when the device is the DHCP server', example: 'Router# show ip dhcp binding' },
      { cmd: 'show inventory', desc: 'Hardware model and serial numbers — what you need for RMAs and licensing', example: 'Router# show inventory' },
    ],
  },
  {
    category: 'Configuration',
    commands: [
      { cmd: 'configure terminal', desc: 'Enter global configuration mode', example: 'Router# configure terminal\nRouter(config)#' },
      { cmd: 'interface GigabitEthernet 0/0', desc: 'Enter interface configuration mode', example: 'Router(config)# interface GigabitEthernet 0/0' },
      { cmd: 'ip address', desc: 'Assign an IP address to an interface', example: 'Router(config-if)# ip address 192.168.1.1 255.255.255.0' },
      { cmd: 'no shutdown', desc: 'Enable an interface (interfaces default to administratively down)', example: 'Router(config-if)# no shutdown' },
      { cmd: 'ip route', desc: 'Add a static route', example: 'Router(config)# ip route 10.0.0.0 255.0.0.0 192.168.1.254' },
      { cmd: 'copy running-config startup-config', desc: 'Save configuration to NVRAM', example: 'Router# copy running-config startup-config\n(or: write memory / wr)' },
      { cmd: 'switchport', desc: 'Set a switchport\'s mode and VLAN assignment', flags: 'mode access — end-device port\nmode trunk — inter-switch link\naccess vlan <id> — assign VLAN', example: 'Switch(config-if)# switchport mode access\nSwitch(config-if)# switchport access vlan 10' },
      { cmd: 'do', desc: 'Little-known: run any exec command from config mode without exiting', example: 'Router(config-if)# do show ip interface brief' },
    ],
  },
  {
    category: 'Diagnostics',
    commands: [
      { cmd: 'ping', desc: 'Send ICMP ping from the router/switch', flags: 'Extended ping — enter "ping" and press Enter for options', example: 'Router# ping 8.8.8.8\nRouter# ping 192.168.1.1 source GigabitEthernet 0/1' },
      { cmd: 'traceroute', desc: 'Trace route to destination from the device', example: 'Router# traceroute 8.8.8.8' },
      { cmd: 'debug ip icmp', desc: 'Enable ICMP debugging (use carefully in production)', example: 'Router# debug ip icmp\nRouter# undebug all' },
      { cmd: 'terminal monitor', desc: 'Send debug output to current terminal session', example: 'Router# terminal monitor' },
      { cmd: 'terminal length 0', desc: 'Disable --More-- paging so long output scrolls uninterrupted (great before copying configs)', example: 'Router# terminal length 0' },
      { cmd: 'Ctrl+Shift+6', desc: 'Escape sequence — abort a stuck ping, traceroute, or DNS lookup', example: 'Router# ping 10.99.99.99\n(press Ctrl+Shift+6 to abort)' },
      { cmd: 'show logging', desc: 'View buffered syslog messages — interface flaps, config changes, errors', example: 'Router# show logging | include GigabitEthernet0/1' },
    ],
  },
]

const osSections: Record<OS, CommandGroup[]> = {
  windows: windowsCommands,
  linux: linuxCommands,
  cisco: ciscoCommands,
}

const osLabels: Record<OS, string> = {
  windows: 'Windows',
  linux: 'Linux / macOS',
  cisco: 'Cisco IOS',
}

const osColors: Record<OS, string> = {
  windows: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  linux: 'text-green-400 bg-green-400/10 border-green-400/20',
  cisco: 'text-aws bg-aws/10 border-aws/20',
}

export default function CLIPage() {
  const [activeOS, setActiveOS] = useState<OS>('windows')
  const [search, setSearch] = useState('')

  const sections = osSections[activeOS]
  const filteredSections = sections.map((group) => ({
    ...group,
    commands: group.commands.filter(
      (c) => c.cmd.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((g) => g.commands.length > 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="tag bg-success/10 text-success border border-success/20">REFERENCE</span>
          <span className="text-subtle text-xs">Network Troubleshooting</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100">CLI <span className="text-success">Reference</span></h1>
        <p className="text-subtle text-sm mt-1">Essential commands for Windows, Linux/macOS, and Cisco IOS network troubleshooting.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* OS Tabs */}
        <div className="flex gap-1 bg-surface border border-border rounded-xl p-1">
          {(Object.keys(osLabels) as OS[]).map((os) => (
            <button key={os} onClick={() => setActiveOS(os)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                activeOS === os ? `${osColors[os]} border` : 'text-subtle hover:text-slate-200'}`}>
              {osLabels[os]}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle pointer-events-none"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input type="text" placeholder="Search commands..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-subtle focus:outline-none focus:border-success/50 transition-colors" />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-slate-300 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Command Groups */}
      {filteredSections.length === 0 ? (
        <div className="text-center py-16 text-subtle">
          <p className="text-lg mb-2">No commands found</p>
          <p className="text-sm">Try a different search term.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredSections.map((group) => (
            <div key={group.category}>
              <h2 className="text-xs font-mono text-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="flex-1 h-px bg-border" />
                {group.category}
                <span className="flex-1 h-px bg-border" />
              </h2>
              <div className="space-y-3">
                {group.commands.map((cmd) => (
                  <div key={cmd.cmd} className="card overflow-hidden">
                    <div className="terminal p-4 rounded-none border-0 border-b border-border">
                      <div className="flex items-start gap-2">
                        <span className="text-success select-none flex-shrink-0">$</span>
                        <span className="text-slate-100 font-bold break-all">{cmd.cmd}</span>
                      </div>
                      {cmd.example && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <p className="text-[10px] text-subtle uppercase tracking-wider mb-1">Example</p>
                          <pre className="text-xs text-success/80 whitespace-pre-wrap font-mono">{cmd.example}</pre>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-slate-300 mb-2">{cmd.desc}</p>
                      {cmd.flags && (
                        <div>
                          <p className="text-[10px] text-subtle uppercase tracking-wider mb-1.5">Common Flags</p>
                          <pre className="text-xs text-subtle font-mono whitespace-pre-wrap leading-relaxed">{cmd.flags}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
