// CompTIA Network+ N10-009 Reference Data

// ─── TCP/IP Model ────────────────────────────────────────────────────────────

export const tcpipModel = [
  {
    layer: 'Application',
    num: 4,
    osiMap: 'Layers 5–7',
    protocols: ['HTTP', 'HTTPS', 'FTP', 'SMTP', 'DNS', 'DHCP', 'SNMP', 'Telnet', 'SSH', 'POP3', 'IMAP', 'NTP'],
    description: 'Interfaces directly with end-user applications. Provides services like web browsing, email, file transfer.',
  },
  {
    layer: 'Transport',
    num: 3,
    osiMap: 'Layer 4',
    protocols: ['TCP', 'UDP'],
    description: 'End-to-end communication, segmentation, flow control, error recovery.',
  },
  {
    layer: 'Internet',
    num: 2,
    osiMap: 'Layer 3',
    protocols: ['IP (IPv4/v6)', 'ICMP', 'ARP', 'IGMP', 'OSPF', 'BGP'],
    description: 'Logical addressing and routing of packets across networks.',
  },
  {
    layer: 'Network Access',
    num: 1,
    osiMap: 'Layers 1–2',
    protocols: ['Ethernet', '802.11 Wi-Fi', 'PPP', 'ARP', 'Frame Relay', 'ATM'],
    description: 'Physical transmission and MAC-level framing over a single network link.',
  },
]

export const tcpVsUdp = [
  { feature: 'Connection', tcp: 'Connection-oriented (3-way handshake)', udp: 'Connectionless' },
  { feature: 'Reliability', tcp: 'Guaranteed delivery with ACKs', udp: 'Best-effort, no ACKs' },
  { feature: 'Ordering', tcp: 'Sequence numbers ensure order', udp: 'No ordering guarantee' },
  { feature: 'Error Checking', tcp: 'Full error detection & correction', udp: 'Checksum only (optional)' },
  { feature: 'Flow Control', tcp: 'Yes (windowing)', udp: 'No' },
  { feature: 'Speed', tcp: 'Slower (overhead)', udp: 'Faster (less overhead)' },
  { feature: 'Header Size', tcp: '20–60 bytes', udp: '8 bytes' },
  { feature: 'Use Cases', tcp: 'HTTP/S, FTP, SSH, SMTP, Telnet', udp: 'DNS, DHCP, TFTP, VoIP, streaming, SNMP' },
]

export const tcpHandshake = [
  { step: 1, direction: 'Client → Server', flag: 'SYN', description: 'Client sends SYN with initial sequence number (ISN). Opens active connection.' },
  { step: 2, direction: 'Server → Client', flag: 'SYN-ACK', description: 'Server acknowledges client SYN and sends its own SYN with server ISN.' },
  { step: 3, direction: 'Client → Server', flag: 'ACK', description: 'Client acknowledges server SYN. Connection established. Data can flow.' },
]

// ─── IPv6 ────────────────────────────────────────────────────────────────────

export const ipv6Rules = [
  { rule: 'Full notation', example: '2001:0db8:0000:0000:0000:ff00:0042:8329', description: '8 groups of 4 hex digits, separated by colons' },
  { rule: 'Drop leading zeros', example: '2001:db8:0:0:0:ff00:42:8329', description: 'Leading zeros within each group can be omitted' },
  { rule: 'Double colon (::)', example: '2001:db8::ff00:42:8329', description: ':: replaces one or more consecutive all-zero groups — can only appear ONCE' },
]

export const ipv6Types = [
  { type: 'Global Unicast', prefix: '2000::/3', description: 'Publicly routable addresses (like public IPv4). Assigned by ISP.' },
  { type: 'Link-Local', prefix: 'fe80::/10', description: 'Auto-configured on every interface. Not routable beyond local segment. Used for neighbor discovery.' },
  { type: 'Unique Local', prefix: 'fc00::/7 (fd00::/8 common)', description: 'Private addresses (like RFC 1918). Routable within an organization but not on internet.' },
  { type: 'Multicast', prefix: 'ff00::/8', description: 'One-to-many delivery. Replaces IPv4 broadcast. All-nodes ff02::1, All-routers ff02::2.' },
  { type: 'Anycast', prefix: 'From unicast space', description: 'Same address assigned to multiple nodes. Packet delivered to nearest node.' },
  { type: 'Loopback', prefix: '::1/128', description: 'IPv6 equivalent of 127.0.0.1. Single address.' },
  { type: 'Unspecified', prefix: '::/128', description: 'Used as source address before address assignment. Like 0.0.0.0 in IPv4.' },
]

export const ipv6Transition = [
  { mechanism: 'Dual Stack', description: 'Device runs both IPv4 and IPv6 simultaneously. Preferred method. No tunneling needed.' },
  { mechanism: '6to4 Tunneling', description: 'IPv6 packets encapsulated in IPv4. Requires public IPv4. Prefix 2002::/16.' },
  { mechanism: 'Teredo', description: 'IPv6 tunneled through IPv4 UDP when behind NAT. Prefix 2001::/32. Windows built-in.' },
  { mechanism: 'ISATAP', description: 'Intra-Site Automatic Tunnel Addressing Protocol. Uses IPv4 address in last 32 bits of IPv6 address.' },
  { mechanism: 'NAT64 / DNS64', description: 'Allows IPv6-only clients to communicate with IPv4-only servers. DNS64 synthesizes AAAA records.' },
]

// ─── Wireless ────────────────────────────────────────────────────────────────

export const wirelessStandards = [
  { standard: '802.11a', freq: '5 GHz', maxSpeed: '54 Mbps', range: '~35 m indoor', features: 'OFDM; first 5 GHz standard; less interference but shorter range' },
  { standard: '802.11b', freq: '2.4 GHz', maxSpeed: '11 Mbps', range: '~35–40 m indoor', features: 'DSSS; widely adopted; prone to interference (microwaves, Bluetooth)' },
  { standard: '802.11g', freq: '2.4 GHz', maxSpeed: '54 Mbps', range: '~38 m indoor', features: 'OFDM; backward compatible with 802.11b; still susceptible to 2.4 GHz interference' },
  { standard: '802.11n (Wi-Fi 4)', freq: '2.4 / 5 GHz', maxSpeed: '600 Mbps', range: '~70 m indoor', features: 'MIMO (up to 4×4); channel bonding (20/40 MHz); dual-band' },
  { standard: '802.11ac (Wi-Fi 5)', freq: '5 GHz only', maxSpeed: '3.5 Gbps', range: '~35 m indoor', features: 'MU-MIMO (downlink); 80/160 MHz channels; beamforming; Wave 1 & 2' },
  { standard: '802.11ax (Wi-Fi 6)', freq: '2.4 / 5 GHz', maxSpeed: '9.6 Gbps', range: '~30 m indoor', features: 'OFDMA; MU-MIMO uplink+downlink; BSS Coloring; TWT; better in dense environments' },
  { standard: '802.11ax (Wi-Fi 6E)', freq: '6 GHz added', maxSpeed: '9.6 Gbps', range: '~30 m indoor', features: 'Same as Wi-Fi 6 but adds 6 GHz band for less congestion; 14 additional 80 MHz channels' },
  { standard: '802.11be (Wi-Fi 7)', freq: '2.4 / 5 / 6 GHz', maxSpeed: '46 Gbps', range: '~30 m indoor', features: '320 MHz channels; Multi-Link Operation (MLO); 4K-QAM; extremely high throughput' },
]

export const wirelessChannels = {
  band24: {
    label: '2.4 GHz Band',
    totalChannels: 11,
    nonOverlapping: [1, 6, 11],
    notes: 'Only channels 1, 6, and 11 are non-overlapping (US). Each channel is 22 MHz wide with 5 MHz spacing. Susceptible to interference from microwaves, Bluetooth, baby monitors, cordless phones.',
  },
  band5: {
    label: '5 GHz Band',
    totalChannels: 24,
    nonOverlapping: 'All (with proper spacing — 20 MHz apart)',
    notes: 'Far more non-overlapping channels than 2.4 GHz. Higher frequency = shorter range. Less interference. DFS (Dynamic Frequency Selection) required for some channels to avoid radar.',
  },
  band6: {
    label: '6 GHz Band (Wi-Fi 6E/7)',
    totalChannels: 59,
    nonOverlapping: 'All',
    notes: 'Introduced with Wi-Fi 6E. No legacy devices; clean spectrum. Supports up to 7 non-overlapping 160 MHz channels.',
  },
}

export const wirelessSecurity = [
  {
    standard: 'WEP',
    year: '1999',
    encryption: 'RC4 (40/104-bit key)',
    auth: 'Open / Shared Key',
    status: 'Deprecated',
    notes: 'Easily cracked in minutes. IV (Initialization Vector) reuse vulnerability. Never use.',
  },
  {
    standard: 'WPA',
    year: '2003',
    encryption: 'TKIP (RC4-based)',
    auth: 'PSK or Enterprise (802.1X)',
    status: 'Deprecated',
    notes: 'Temporary fix for WEP. TKIP still has weaknesses. Superseded by WPA2.',
  },
  {
    standard: 'WPA2',
    year: '2004',
    encryption: 'AES-CCMP (128-bit)',
    auth: 'PSK or Enterprise (802.1X)',
    status: 'Current (widely used)',
    notes: 'CCMP replaces TKIP. Secure. Vulnerable to KRACK attack but patched. Still widely deployed.',
  },
  {
    standard: 'WPA3',
    year: '2018',
    encryption: 'AES-GCMP (128/256-bit)',
    auth: 'SAE (Simultaneous Auth of Equals) or Enterprise',
    status: 'Recommended',
    notes: 'SAE replaces PSK (no offline dictionary attacks). Forward secrecy. PMF (Protected Management Frames) mandatory. WPA3-Enterprise uses 192-bit security suite.',
  },
]

export const eapTypes = [
  { type: 'PEAP', fullName: 'Protected EAP', tunnel: 'TLS tunnel', innerAuth: 'MSCHAPv2 or GTC', cert: 'Server only', notes: 'Most common. Wraps inner auth in TLS. Widely supported.' },
  { type: 'EAP-TLS', fullName: 'EAP Transport Layer Security', tunnel: 'TLS', innerAuth: 'Certificate-based', cert: 'Both client and server', notes: 'Strongest mutual auth. Requires PKI for client certs. Very secure.' },
  { type: 'EAP-TTLS', fullName: 'EAP Tunneled TLS', tunnel: 'TLS tunnel', innerAuth: 'Any (PAP, CHAP, MSCHAPv2)', cert: 'Server only', notes: 'Similar to PEAP but supports more inner auth methods.' },
  { type: 'LEAP', fullName: 'Lightweight EAP', tunnel: 'None (Cisco proprietary)', innerAuth: 'MSCHAPv1', cert: 'None (password only)', notes: 'Cisco proprietary. Vulnerable to dictionary attacks. Avoid.' },
  { type: 'EAP-FAST', fullName: 'EAP Flexible Auth via Secure Tunneling', tunnel: 'Protected Access Credentials (PAC)', innerAuth: 'MSCHAPv2 or GTC', cert: 'None required', notes: 'Cisco replacement for LEAP. Uses PAC instead of certificates.' },
]

// ─── Routing & Switching ─────────────────────────────────────────────────────

export const vlanTypes = [
  { type: 'Data VLAN', description: 'Carries user-generated data traffic. Standard workstation traffic.' },
  { type: 'Voice VLAN', description: 'Dedicated to VoIP traffic. Given QoS priority (low latency, jitter, loss). CDP/LLDP auto-configured.' },
  { type: 'Management VLAN', description: 'Used for switch management traffic (SSH, Telnet, SNMP). Should not be VLAN 1.' },
  { type: 'Native VLAN', description: 'Untagged VLAN on a trunk port. Default is VLAN 1 (change for security). Both ends must match.' },
  { type: 'Default VLAN', description: 'All ports assigned to VLAN 1 by default. Should not be used for regular traffic.' },
]

export const stpPortStates = [
  { state: 'Blocking', duration: 'Max Age (20 sec)', activity: 'No forwarding, no learning. Receives BPDUs only.' },
  { state: 'Listening', duration: '15 sec (Forward Delay)', activity: 'Processing BPDUs, not forwarding or learning MACs.' },
  { state: 'Learning', duration: '15 sec (Forward Delay)', activity: 'Building MAC table, not forwarding frames.' },
  { state: 'Forwarding', duration: 'Indefinite', activity: 'Fully operational — forwards frames and learns MACs.' },
  { state: 'Disabled', duration: 'Administrative', activity: 'Port shut down by administrator. No BPDUs processed.' },
]

export const stpPortRoles = [
  { role: 'Root Port', description: 'The port on a non-root bridge that has the best path to the root bridge. One per switch.' },
  { role: 'Designated Port', description: 'Best port to forward traffic toward a network segment. One per segment, on root bridge for all its ports.' },
  { role: 'Alternate Port (RSTP)', description: 'Backup to the root port. Provides alternate path to root bridge. In blocking state.' },
  { role: 'Backup Port (RSTP)', description: 'Backup to a designated port on the same segment. Less common. In discarding state.' },
]

export const stpVariants = [
  { name: 'STP', std: '802.1D', convergence: '30–50 seconds', instances: 'Single (CST)', vlans: 'All VLANs share one tree' },
  { name: 'RSTP', std: '802.1W', convergence: '<6 seconds', instances: 'Single', vlans: 'Adds Alternate/Backup port roles' },
  { name: 'PVST+', std: 'Cisco proprietary', convergence: '30–50 seconds', instances: 'Per VLAN', vlans: 'One STP instance per VLAN' },
  { name: 'Rapid PVST+', std: 'Cisco proprietary', convergence: '<6 seconds', instances: 'Per VLAN', vlans: 'RSTP per VLAN' },
  { name: 'MSTP', std: '802.1S', convergence: '<6 seconds', instances: 'Multiple (mapped to VLANs)', vlans: 'Groups VLANs into instances (reduces STP overhead)' },
]

export const routingProtocols = [
  {
    name: 'RIPv2',
    type: 'Distance Vector',
    metric: 'Hop count (max 15)',
    ad: 120,
    convergence: 'Slow (minutes)',
    scope: 'IGP',
    notes: 'Simple, legacy. Max 15 hops limits scalability. Sends full routing table every 30s.',
  },
  {
    name: 'OSPF',
    type: 'Link State',
    metric: 'Cost (100 Mbps / bandwidth)',
    ad: 110,
    convergence: 'Fast (seconds)',
    scope: 'IGP',
    notes: 'Hierarchical areas (Area 0 = backbone). Dijkstra SPF algorithm. Most common enterprise IGP.',
  },
  {
    name: 'EIGRP',
    type: 'Advanced Distance Vector (Hybrid)',
    metric: 'Composite (BW + delay + reliability + load)',
    ad: 90,
    convergence: 'Very fast (milliseconds)',
    scope: 'IGP',
    notes: 'Cisco proprietary (now partially open). DUAL algorithm. Successor and feasible successor routes.',
  },
  {
    name: 'IS-IS',
    type: 'Link State',
    metric: 'Cost (admin-set)',
    ad: 115,
    convergence: 'Fast',
    scope: 'IGP',
    notes: 'Common in ISP backbones. Runs directly over Layer 2 (not IP). OSI-based.',
  },
  {
    name: 'BGP',
    type: 'Path Vector',
    metric: 'Path attributes (AS-PATH, MED, LOCAL_PREF)',
    ad: 20,
    convergence: 'Slow (minutes)',
    scope: 'EGP (internet routing)',
    notes: 'THE internet routing protocol. Connects ASes. TCP port 179. iBGP (within AS) vs eBGP (between ASes).',
  },
]

export const natTypes = [
  {
    type: 'Static NAT',
    mapping: 'One-to-one',
    description: 'Single private IP permanently mapped to single public IP. Used for servers that need consistent public address.',
    example: '192.168.1.10 ↔ 203.0.113.10 (always)',
  },
  {
    type: 'Dynamic NAT',
    mapping: 'Many-to-pool',
    description: 'Private IPs mapped to a pool of public IPs dynamically. No consistent mapping. Limited by pool size.',
    example: '192.168.1.x → 203.0.113.{10-20} (first-come, first-served)',
  },
  {
    type: 'PAT / NAT Overload',
    mapping: 'Many-to-one',
    description: 'Many private IPs share one public IP using unique port numbers. Most common in home/office routers. Also called "IP Masquerade."',
    example: '192.168.1.x → 203.0.113.1:port (port multiplexing)',
  },
]

// ─── Security ────────────────────────────────────────────────────────────────

export const attackTypes = [
  // Reconnaissance
  { category: 'Reconnaissance', name: 'Ping Sweep', description: 'ICMP pings to a range of IPs to discover live hosts. Often first step in network scanning.' },
  { category: 'Reconnaissance', name: 'Port Scan', description: 'Probing a host\'s ports to find open services. Tools: nmap, masscan. Types: SYN scan, connect scan, stealth scan.' },
  { category: 'Reconnaissance', name: 'OSINT', description: 'Open Source Intelligence gathering — DNS lookup, WHOIS, social media, job listings, company websites.' },
  { category: 'Reconnaissance', name: 'Packet Sniffing', description: 'Capturing network traffic passively. Requires promiscuous mode NIC or port mirroring.' },
  // Spoofing
  { category: 'Spoofing', name: 'IP Spoofing', description: 'Forging source IP address in packets. Used in DoS reflection attacks and to bypass IP-based access control.' },
  { category: 'Spoofing', name: 'ARP Spoofing / Poisoning', description: 'Sending fake ARP replies to associate attacker\'s MAC with victim\'s IP. Enables MITM on local network. Mitigated by DAI.' },
  { category: 'Spoofing', name: 'MAC Spoofing', description: 'Changing NIC MAC address to impersonate another device or bypass MAC-based access control.' },
  { category: 'Spoofing', name: 'DNS Spoofing / Cache Poisoning', description: 'Injecting false DNS records to redirect traffic to attacker-controlled sites.' },
  // DoS/DDoS
  { category: 'DoS / DDoS', name: 'Ping of Death', description: 'Oversized ICMP packet (>65,535 bytes) causes buffer overflow. Largely patched in modern systems.' },
  { category: 'DoS / DDoS', name: 'SYN Flood', description: 'Sends many SYN requests without completing handshake, exhausting server\'s connection table. Mitigated by SYN cookies.' },
  { category: 'DoS / DDoS', name: 'Smurf Attack', description: 'Sends ICMP echo to broadcast address with spoofed victim source IP. All hosts reply to victim. Amplification attack.' },
  { category: 'DoS / DDoS', name: 'Amplification / Reflection', description: 'Attacker sends small requests to open resolvers (DNS, NTP, SSDP) with spoofed victim IP. Servers flood victim.' },
  { category: 'DoS / DDoS', name: 'Volumetric DDoS', description: 'Overwhelms bandwidth. Measured in Gbps. Botnet-powered. Mitigated by upstream scrubbing or CDN.' },
  // MITM
  { category: 'MITM', name: 'Evil Twin', description: 'Rogue AP broadcasting same SSID as legitimate AP. Clients connect to attacker\'s AP believing it is legitimate.' },
  { category: 'MITM', name: 'SSL Stripping', description: 'Downgrades HTTPS to HTTP between victim and attacker. Victim thinks connection is HTTPS but it\'s HTTP to attacker. Mitigated by HSTS.' },
  { category: 'MITM', name: 'Session Hijacking', description: 'Stealing a valid session cookie or token to impersonate authenticated user.' },
  // Wireless
  { category: 'Wireless', name: 'Deauthentication Attack', description: 'Sends spoofed 802.11 deauth frames to disconnect clients from legitimate AP. Used to force WPA handshake capture.' },
  { category: 'Wireless', name: 'Rogue Access Point', description: 'Unauthorized AP connected to network. Can bypass wireless security and provide unauthorized entry.' },
  { category: 'Wireless', name: 'WPS Pin Attack', description: 'WPS 8-digit PIN can be brute-forced in <11,000 attempts due to design flaw. Disable WPS.' },
  // VLAN / Switching
  { category: 'VLAN Attacks', name: 'VLAN Hopping (Switch Spoofing)', description: 'Attacker negotiates a trunk link with a switch (DTP) to access all VLANs. Mitigate by disabling DTP and using non-default native VLAN.' },
  { category: 'VLAN Attacks', name: 'VLAN Hopping (Double Tagging)', description: 'Attacker sends double-tagged 802.1Q frame. First tag stripped by first switch, inner tag carries packet to victim VLAN. Only works toward native VLAN direction.' },
  // Social Engineering
  { category: 'Social Engineering', name: 'Phishing', description: 'Email/message impersonating trusted entity to steal credentials or deliver malware.' },
  { category: 'Social Engineering', name: 'Spear Phishing', description: 'Targeted phishing against specific individual using personalized information.' },
  { category: 'Social Engineering', name: 'Vishing', description: 'Voice phishing — phone calls impersonating IT support, bank, IRS, etc.' },
  { category: 'Social Engineering', name: 'Tailgating / Piggybacking', description: 'Physically following authorized person into restricted area without proper authentication.' },
]

export const defenseTools = [
  { tool: 'Port Security', layer: 'Layer 2', description: 'Limits the number of valid MAC addresses on a port. Violation actions: Protect (drop), Restrict (drop + log), Shutdown (err-disable).' },
  { tool: 'Sticky MAC', layer: 'Layer 2', description: 'Dynamically learned MAC addresses are added to running config and can be saved. Combines dynamic learning with security.' },
  { tool: 'DHCP Snooping', layer: 'Layer 2', description: 'Switch acts as firewall for DHCP. Drops DHCP offers from untrusted ports. Builds binding table (IP, MAC, port, VLAN). Prevents rogue DHCP servers.' },
  { tool: 'Dynamic ARP Inspection (DAI)', layer: 'Layer 2', description: 'Validates ARP packets against DHCP snooping binding table. Drops ARP replies with incorrect IP-MAC mappings. Prevents ARP poisoning.' },
  { tool: 'IP Source Guard', layer: 'Layer 2', description: 'Restricts IP traffic based on DHCP snooping table. Prevents IP spoofing on a per-port basis.' },
  { tool: '802.1X Port-Based Auth', layer: 'Layer 2', description: 'EAP-based authentication before network access granted. Roles: Supplicant (client), Authenticator (switch), Authentication Server (RADIUS).' },
  { tool: 'RADIUS', layer: 'AAA', description: 'Remote Authentication Dial-In User Service. UDP 1812 (auth), 1813 (accounting). Encrypts password only. Used for network device and VPN auth.' },
  { tool: 'TACACS+', layer: 'AAA', description: 'Terminal Access Controller Access-Control System Plus. TCP 49. Encrypts entire payload. Separates Authentication, Authorization, Accounting. Cisco proprietary.' },
  { tool: 'Firewall (Packet Filtering)', layer: 'Layer 3–4', description: 'Inspects packets based on source/dest IP, port, protocol (stateless). Fast but limited — doesn\'t track connection state.' },
  { tool: 'Firewall (Stateful)', layer: 'Layer 3–4', description: 'Tracks connection state table. Allows return traffic automatically. Better than packet filtering.' },
  { tool: 'NGFW / UTM', layer: 'Layer 7', description: 'Next-Gen Firewall: DPI, IPS, application awareness, SSL inspection, URL filtering, sandboxing — all in one device.' },
  { tool: 'IDS (Intrusion Detection)', layer: 'Passive', description: 'Monitors traffic and alerts on suspicious activity. Does not block. Placed out-of-band (SPAN port). False positives possible.' },
  { tool: 'IPS (Intrusion Prevention)', layer: 'Inline', description: 'Monitors and actively blocks malicious traffic. Placed inline — adds latency. Can cause false positives that disrupt traffic.' },
]

export const vpnProtocols = [
  { protocol: 'IPSec', ports: 'UDP 500 (IKE), UDP 4500 (NAT-T)', encryption: 'AES, 3DES', modes: 'Transport, Tunnel', notes: 'Industry standard. Two phases: IKE (Phase 1: SA negotiation), IPSec (Phase 2: data). Components: AH, ESP.' },
  { protocol: 'SSL / TLS VPN', ports: 'TCP 443', encryption: 'AES (via TLS)', modes: 'Clientless, thin client, full client', notes: 'Works through firewalls/NAT easily (port 443). Clientless = browser-based. Full client = all traffic tunneled.' },
  { protocol: 'L2TP/IPSec', ports: 'UDP 1701 (L2TP), UDP 500/4500 (IPSec)', encryption: 'IPSec for encryption (L2TP itself has none)', modes: 'Tunnel', notes: 'L2TP provides tunnel, IPSec provides encryption. Double encapsulation = more overhead.' },
  { protocol: 'PPTP', ports: 'TCP 1723 + GRE (Protocol 47)', encryption: 'MPPE (weak)', modes: 'Tunnel', notes: 'Legacy. Easy to configure but weak encryption (MS-CHAPv2 vulnerabilities). Avoid — not exam-recommended for new deployments.' },
  { protocol: 'GRE', ports: 'IP Protocol 47', encryption: 'None (can be combined with IPSec)', modes: 'Tunnel', notes: 'Generic encapsulation — can tunnel any Layer 3 protocol. No security inherently. Often used with IPSec.' },
  { protocol: 'OpenVPN', ports: 'UDP 1194 (default, configurable)', encryption: 'OpenSSL (AES)', modes: 'Full tunnel', notes: 'Open source, highly configurable. Uses TLS for control channel. Very portable.' },
]

// ─── Troubleshooting ─────────────────────────────────────────────────────────

export const troubleshootingSteps = [
  { step: 1, title: 'Identify the Problem', description: 'Gather information from users and systems. Document symptoms. Check recent changes. Question users carefully — do not assume.' },
  { step: 2, title: 'Establish a Theory of Probable Cause', description: 'Consider obvious causes first (OSI bottom-up or top-down). Use prior experience. Question the obvious — check if it\'s plugged in, enabled, or configured.' },
  { step: 3, title: 'Test the Theory', description: 'Confirm or eliminate the probable cause. If confirmed, determine next steps. If not confirmed, establish a new theory and test again.' },
  { step: 4, title: 'Establish a Plan of Action', description: 'Develop an action plan to resolve the problem. Identify potential effects of the plan. Escalate if outside your skill set or scope.' },
  { step: 5, title: 'Implement the Solution', description: 'Execute the plan. Make one change at a time when possible. Test after each change. Have a rollback plan ready.' },
  { step: 6, title: 'Verify Full System Functionality', description: 'Confirm the problem is fully resolved. Test related systems — ensure fix didn\'t break something else. Implement preventive measures.' },
  { step: 7, title: 'Document Findings and Actions', description: 'Record what the problem was, what caused it, how it was fixed, and what was learned. Critical for knowledge base and future troubleshooting.' },
]

export const troubleshootingTools = [
  { tool: 'ping', os: 'All', layer: 'Layer 3', command: 'ping <host/IP>', description: 'Tests ICMP reachability. Verifies Layer 3 connectivity and basic network path. TTL in response indicates OS type.' },
  { tool: 'traceroute / tracert', os: 'Linux/Mac / Windows', layer: 'Layer 3', command: 'traceroute <host> / tracert <host>', description: 'Shows hop-by-hop path to destination using TTL manipulation. Identifies where packets are dropped or slowed. Uses ICMP (Windows) or UDP (Linux).' },
  { tool: 'pathping', os: 'Windows', layer: 'Layer 3', command: 'pathping <host>', description: 'Combines ping and traceroute. Shows per-hop latency and packet loss statistics over time.' },
  { tool: 'nslookup', os: 'All', layer: 'Layer 7 (DNS)', command: 'nslookup <hostname>', description: 'Queries DNS servers. Tests name resolution. Can specify alternative DNS server. Non-interactive and interactive modes.' },
  { tool: 'dig', os: 'Linux/Mac', layer: 'Layer 7 (DNS)', command: 'dig <hostname> [record type]', description: 'Detailed DNS query tool. Shows full response including authority and additional sections. Better than nslookup for troubleshooting.' },
  { tool: 'ipconfig', os: 'Windows', layer: 'Layer 3', command: 'ipconfig /all | /release | /renew | /flushdns', description: 'Shows IP configuration. /all shows detailed info including MAC, DNS, gateway. /flushdns clears resolver cache.' },
  { tool: 'ifconfig', os: 'Linux/Mac', layer: 'Layer 3', command: 'ifconfig <interface>', description: 'Legacy Linux IP configuration tool. Shows/sets IP, mask, MAC. Replaced by "ip addr" in modern Linux.' },
  { tool: 'ip', os: 'Linux', layer: 'Layer 3', command: 'ip addr | ip route | ip link', description: 'Modern Linux network tool. ip addr (interfaces), ip route (routing table), ip link (link layer).' },
  { tool: 'netstat', os: 'All', layer: 'Layer 4', command: 'netstat -an | -rn | -s', description: 'Shows active connections, listening ports, routing table (-rn), and protocol stats (-s). Useful for finding open ports and connections.' },
  { tool: 'ss', os: 'Linux', layer: 'Layer 4', command: 'ss -tuln', description: 'Modern replacement for netstat on Linux. Faster, more detail. -t TCP, -u UDP, -l listening, -n numeric.' },
  { tool: 'arp', os: 'All', layer: 'Layer 2', command: 'arp -a | arp -d <IP>', description: 'Displays and manipulates ARP cache. -a shows all entries. Useful for finding MAC addresses and detecting ARP spoofing.' },
  { tool: 'nmap', os: 'All', layer: 'Layer 3–7', command: 'nmap -sS -p- <host>', description: 'Network scanner. Port scanning, OS detection, service version detection, script scanning. Use with proper authorization only.' },
  { tool: 'Wireshark / tcpdump', os: 'All', layer: 'Layer 1–7', command: 'tcpdump -i eth0 -w capture.pcap', description: 'Full packet capture and analysis. Wireshark = GUI. tcpdump = CLI. Filter by IP, port, protocol. Essential for deep analysis.' },
  { tool: 'route', os: 'All', layer: 'Layer 3', command: 'route print (Win) / route -n (Linux)', description: 'Displays and modifies the routing table. Verifies default gateway and specific routes.' },
]

// ─── Network Types & Cabling ─────────────────────────────────────────────────

export const networkTypes = [
  { type: 'LAN', fullName: 'Local Area Network', description: 'Small geographic area (office, building). High speed, low latency. Typically Ethernet or Wi-Fi.' },
  { type: 'WLAN', fullName: 'Wireless LAN', description: 'LAN using wireless (802.11). Mobile access within a building/campus.' },
  { type: 'MAN', fullName: 'Metropolitan Area Network', description: 'City-wide coverage. Connects multiple buildings. Example: Metro Ethernet ring.' },
  { type: 'WAN', fullName: 'Wide Area Network', description: 'Large geographic area (country/worldwide). Uses leased lines, MPLS, internet. Lower speed, higher latency than LAN.' },
  { type: 'PAN', fullName: 'Personal Area Network', description: 'Very short range (< 10 m). Bluetooth, USB, IrDA. Device-to-device.' },
  { type: 'CAN', fullName: 'Campus Area Network', description: 'Multiple buildings in a campus (university, corporate park). Larger than LAN, smaller than MAN.' },
  { type: 'SAN', fullName: 'Storage Area Network', description: 'High-speed network for block-level storage. Fibre Channel or iSCSI. Appears as local disk to servers.' },
  { type: 'SD-WAN', fullName: 'Software-Defined WAN', description: 'WAN with software control plane. Overlays multiple links (MPLS + broadband + LTE). Dynamic path selection, centrally managed.' },
]

export const topologies = [
  { type: 'Bus', description: 'All devices share a single cable (the bus). Legacy (coax). Collision domain = entire network. Single point of failure. Terminated at each end.' },
  { type: 'Star', description: 'All devices connect to a central switch/hub. Most common today. Easy to add/remove nodes. Single point of failure = central device.' },
  { type: 'Ring', description: 'Each device connects to two others forming a ring. Data travels in one direction. Token Ring (802.5). Single break = failure. SONET rings have redundancy.' },
  { type: 'Mesh', description: 'Every device connects to every other device (full mesh) or to multiple (partial mesh). Highly redundant. Used in WANs and wireless backhaul.' },
  { type: 'Hybrid', description: 'Combination of topologies. Most enterprise networks are hybrid (star-bus, star-ring).' },
  { type: 'Point-to-Point', description: 'Direct link between two nodes. WAN connections, leased lines.' },
  { type: 'Point-to-Multipoint', description: 'One central node connects to multiple peripheral nodes. Common in wireless (AP to clients) and Frame Relay.' },
]

export const cableTypes = [
  // Twisted Pair
  { category: 'Twisted Pair', name: 'Cat 5e', speed: '1 Gbps', distance: '100 m', notes: 'Enhanced Cat5. Minimum for Gigabit. Older installs.' },
  { category: 'Twisted Pair', name: 'Cat 6', speed: '1 Gbps (100 m) / 10 Gbps (55 m)', distance: '100 m / 55 m', notes: '10GbE limited to 55 m. Standard for new installs.' },
  { category: 'Twisted Pair', name: 'Cat 6A', speed: '10 Gbps', distance: '100 m', notes: 'Augmented Cat6. Full 100 m at 10 GbE. More shielding.' },
  { category: 'Twisted Pair', name: 'Cat 7', speed: '10 Gbps', distance: '100 m', notes: 'Fully shielded (SSTP). GG45 or TERA connectors. Not TIA-recognized.' },
  { category: 'Twisted Pair', name: 'Cat 8', speed: '25/40 Gbps', distance: '30 m', notes: 'Data center use. Short runs between switches/servers.' },
  // Fiber
  { category: 'Fiber Optic', name: 'SMF (OS1/OS2)', speed: '10G/40G/100G+', distance: 'OS1: 10 km | OS2: 80+ km', notes: 'Single-mode. Yellow jacket. Laser light source. Long distance. Data center backbones, WAN.' },
  { category: 'Fiber Optic', name: 'MMF OM1', speed: '1 Gbps', distance: '275 m', notes: '62.5 µm core. Orange jacket. LED light. Legacy.' },
  { category: 'Fiber Optic', name: 'MMF OM2', speed: '1 Gbps', distance: '550 m', notes: '50 µm core. Orange jacket. LED/laser.' },
  { category: 'Fiber Optic', name: 'MMF OM3', speed: '10 Gbps', distance: '300 m', notes: '50 µm laser-optimized. Aqua jacket. Common in data centers.' },
  { category: 'Fiber Optic', name: 'MMF OM4', speed: '10 Gbps', distance: '550 m', notes: '50 µm high-bandwidth. Aqua or violet jacket. 40G/100G short distances.' },
  { category: 'Fiber Optic', name: 'MMF OM5', speed: '100 Gbps', distance: '150 m', notes: 'Lime-green jacket. SWDM4 (4 wavelengths). Newest MMF standard.' },
]

export const connectorTypes = [
  { connector: 'RJ-45', type: 'Twisted Pair', use: 'Ethernet (10BASE-T through 10GBASE-T). 8P8C. Standard network connector.' },
  { connector: 'RJ-11', type: 'Twisted Pair', use: 'Telephone. 6P2C or 6P4C. DSL connections.' },
  { connector: 'LC', type: 'Fiber', use: 'Small form factor. Most common in SFP/SFP+ modules. Push-pull latch. Data centers.' },
  { connector: 'SC', type: 'Fiber', use: 'Square connector. Push-pull. Common in older installs and FTTH (PON).' },
  { connector: 'ST', type: 'Fiber', use: 'Bayonet twist-lock. Older standard. Less common now.' },
  { connector: 'MPO/MTP', type: 'Fiber', use: 'Multi-fiber (12 or 24 strands). Used in 40G/100G trunk cables in data centers.' },
  { connector: 'BNC', type: 'Coax', use: 'Bayonet Neill-Concelman. Legacy 10BASE2 Ethernet, video surveillance.' },
  { connector: 'F-Type', type: 'Coax', use: 'Screw-on. Cable TV (CATV), DOCSIS, satellite.' },
]

export const wanTechnologies = [
  { tech: 'T1 / DS1', speed: '1.544 Mbps', notes: '24 DS0 channels × 64 Kbps. Point-to-point leased line. Dedicated bandwidth.' },
  { tech: 'T3 / DS3', speed: '44.736 Mbps', notes: '28 T1 circuits. Carrier-class connectivity.' },
  { tech: 'OC-3 / STM-1', speed: '155 Mbps', notes: 'SONET/SDH optical carrier. Carrier backbone.' },
  { tech: 'MPLS', speed: 'Variable (QoS-enabled)', notes: 'Label-switched paths. VPN-like private connectivity over carrier network. Traffic engineered by labels, not IP routing. Common enterprise WAN.' },
  { tech: 'Metro Ethernet', speed: '100 Mbps – 10 Gbps', notes: 'Carrier Ethernet over MAN. Simpler than MPLS for businesses. E-Line (P2P), E-LAN (multipoint).' },
  { tech: 'DSL (ADSL)', speed: 'Down 24 Mbps / Up 3.5 Mbps', notes: 'Asymmetric DSL over phone lines. Distance-limited (~5 km from DSLAM). Consumer broadband.' },
  { tech: 'VDSL / VDSL2', speed: 'Down 100 Mbps / Up 100 Mbps', notes: 'Very high-speed DSL. Short range (<1.5 km). Used in FTTN/FTTC deployments.' },
  { tech: 'DOCSIS (Cable)', speed: 'DOCSIS 3.1: Down 10 Gbps / Up 1 Gbps', notes: 'Cable TV network repurposed for internet. Shared medium (neighborhood node). DOCSIS 3.1 current standard.' },
  { tech: 'Fiber (FTTH/FTTP)', speed: '1 Gbps+ symmetric', notes: 'Fiber to the Home/Premises. Highest performance broadband. PON (Passive Optical Network) architecture common.' },
  { tech: 'Cellular (4G LTE)', speed: 'Down ~150 Mbps / Up ~50 Mbps', notes: 'Mobile broadband. LTE-A (LTE Advanced) peak >1 Gbps. Used for WAN failover, remote sites, mobile workers.' },
  { tech: 'Cellular (5G)', speed: 'Down 1–20 Gbps / Up 100 Mbps+', notes: 'Sub-6 GHz (coverage) and mmWave (ultra-speed, short range). Fixed 5G for home/business replacing cable.' },
  { tech: 'Satellite', speed: 'LEO (Starlink): ~100–200 Mbps. GEO: 25 Mbps', notes: 'GEO: 600+ ms latency. LEO (Starlink, OneWeb): 20–40 ms. Remote areas without terrestrial infrastructure.' },
]

export const pinouts = [
  { name: 'T568A', pairs: 'Pair 3 (white-green/green) on pins 1-2, Pair 2 (white-orange/orange) on pins 3-6', use: 'Less common in commercial, used in residential. Required for government/residential per some standards.' },
  { name: 'T568B', pairs: 'Pair 2 (white-orange/orange) on pins 1-2, Pair 3 (white-green/green) on pins 3-6', use: 'Most common commercial standard. Default for enterprise networking.' },
  { name: 'Straight-through', pairs: 'Both ends same standard (T568A-T568A or T568B-T568B)', use: 'PC to switch, PC to router, switch to router (unlike-device connections). Most common patch cable.' },
  { name: 'Crossover', pairs: 'T568A on one end, T568B on other', use: 'PC to PC, switch to switch, router to router (like-device connections). Modern switches use Auto-MDI/MDIX so often not needed.' },
  { name: 'Rollover / Console', pairs: 'Pins reversed (1↔8, 2↔7, 3↔6, 4↔5)', use: 'Cisco console cable. RJ-45 to DB-9 (or USB adapter). Used for out-of-band router/switch management.' },
]

// ─── DNS ─────────────────────────────────────────────────────────────────────

export const dnsRecordTypes = [
  { type: 'A', description: 'Maps a hostname to an IPv4 address.', example: 'example.com → 93.184.216.34' },
  { type: 'AAAA', description: 'Maps a hostname to an IPv6 address.', example: 'example.com → 2606:2800:220:1:248:1893:25c8:1946' },
  { type: 'CNAME', description: 'Canonical Name — alias pointing to another hostname. Cannot coexist with other records at same name. No IP directly.', example: 'www.example.com → example.com' },
  { type: 'MX', description: 'Mail Exchange — specifies mail server for a domain. Has a priority value (lower = higher priority).', example: 'example.com → mail.example.com (priority 10)' },
  { type: 'PTR', description: 'Pointer — reverse DNS. Maps IP address back to hostname. Lives in in-addr.arpa zone.', example: '34.216.184.93.in-addr.arpa → example.com' },
  { type: 'TXT', description: 'Text record — stores arbitrary text. Used for SPF (spam prevention), DKIM (email signing), DMARC, and domain ownership verification.', example: '"v=spf1 include:_spf.google.com ~all"' },
  { type: 'NS', description: 'Name Server — lists the authoritative DNS servers for a domain. Delegated from parent zone.', example: 'example.com → ns1.example.com, ns2.example.com' },
  { type: 'SOA', description: 'Start of Authority — first record in a zone. Contains primary nameserver, admin email, serial number, refresh/retry/expire/TTL values.', example: 'Serial 2024010101, Refresh 3600, Retry 900, Expire 604800' },
  { type: 'SRV', description: 'Service — specifies host and port for specific services. Used by SIP, XMPP, Exchange AutoDiscover.', example: '_sip._tcp.example.com → sipserver.example.com:5060' },
  { type: 'CAA', description: 'Certification Authority Authorization — specifies which CAs can issue SSL/TLS certs for a domain.', example: '0 issue "letsencrypt.org"' },
]

export const dnsHierarchy = [
  { level: 'Root Zone (.)', description: 'Top of the DNS hierarchy. 13 sets of root servers (A–M). Managed by IANA. Knows where all TLD servers are.' },
  { level: 'TLD Servers', description: 'Top-Level Domain servers for .com, .org, .net, .uk, etc. Know which authoritative servers handle each domain.' },
  { level: 'Authoritative Name Server', description: 'The definitive source of DNS records for a domain. Answers queries about records it owns. Managed by domain owner or DNS provider.' },
  { level: 'Recursive Resolver', description: 'The "middleman" — queries on behalf of the client. Checks its own cache first, then queries root → TLD → authoritative. Provided by ISP or Google (8.8.8.8), Cloudflare (1.1.1.1).' },
  { level: 'DNS Cache', description: 'Resolvers and clients cache records for the duration of the TTL (Time To Live). Reduces query load and speeds up responses. flushed with ipconfig /flushdns (Windows) or systemd-resolve --flush-caches (Linux).' },
]

export const dnsResolutionSteps = [
  { step: 1, action: 'Local cache check', detail: 'Client checks its own DNS resolver cache. If found and not expired (TTL), returns immediately.' },
  { step: 2, action: 'Recursive resolver query', detail: 'Client asks its configured DNS resolver (ISP, 8.8.8.8, 1.1.1.1). Resolver checks its own cache.' },
  { step: 3, action: 'Root server query', detail: 'Resolver asks a root server: "Who handles .com?" Root responds with TLD server addresses.' },
  { step: 4, action: 'TLD server query', detail: 'Resolver asks the .com TLD server: "Who handles example.com?" TLD responds with authoritative name server.' },
  { step: 5, action: 'Authoritative server query', detail: 'Resolver asks the authoritative NS: "What is the IP for www.example.com?" Gets the A record.' },
  { step: 6, action: 'Response returned & cached', detail: 'Resolver caches the answer for the TTL duration, returns it to the client. Client caches it too.' },
]

export const dnsConceptsFacts = [
  { concept: 'TTL (Time to Live)', detail: 'How long (in seconds) a DNS record is cached. Short TTL (60–300s) = faster propagation, more queries. Long TTL (3600–86400s) = fewer queries, slower changes.' },
  { concept: 'Forward Lookup', detail: 'Resolving a hostname to an IP address. The standard direction — what you do when visiting a website.' },
  { concept: 'Reverse Lookup', detail: 'Resolving an IP address back to a hostname using PTR records in the in-addr.arpa zone. Used for logging, email verification.' },
  { concept: 'DNS Zone', detail: 'Administrative space in DNS. A zone file contains all records for a domain (A, MX, NS, etc.). Transferred between servers via Zone Transfer (AXFR/IXFR).' },
  { concept: 'Split-horizon DNS', detail: 'Different DNS responses based on query source. Internal clients get private IPs; external clients get public IPs for the same hostname.' },
  { concept: 'DNSSEC', detail: 'DNS Security Extensions. Adds cryptographic signatures to DNS records to prevent cache poisoning and man-in-the-middle attacks.' },
  { concept: 'DNS over HTTPS (DoH)', detail: 'Encrypts DNS queries using HTTPS (port 443). Prevents ISP from seeing DNS queries. Supported in modern browsers.' },
  { concept: 'DNS over TLS (DoT)', detail: 'Encrypts DNS queries using TLS (port 853). Similar goal to DoH but uses dedicated port.' },
]

// ─── DHCP ────────────────────────────────────────────────────────────────────

export const dhcpDoraSteps = [
  { step: 'D — Discover', srcPort: '68 (client)', dstPort: '67 (server)', direction: 'Client → Broadcast', description: 'Client broadcasts to find available DHCP servers. Source IP: 0.0.0.0. Destination: 255.255.255.255.' },
  { step: 'O — Offer', srcPort: '67 (server)', dstPort: '68 (client)', direction: 'Server → Client (broadcast)', description: 'DHCP server responds with an IP offer, subnet mask, lease time, gateway, and DNS server.' },
  { step: 'R — Request', srcPort: '68 (client)', dstPort: '67 (server)', direction: 'Client → Broadcast', description: 'Client broadcasts acceptance of the offer (multiple servers may have offered — this selects one and notifies all).' },
  { step: 'A — Acknowledge', srcPort: '67 (server)', dstPort: '68 (client)', direction: 'Server → Client', description: 'Server confirms the lease. Client can now use the IP address for the lease duration.' },
]

export const dhcpComponents = [
  { component: 'Scope', description: 'The range of IP addresses the DHCP server can assign. Example: 192.168.1.100 – 192.168.1.200.' },
  { component: 'Lease Time', description: 'How long a client can use an assigned IP before it must renew. Clients attempt renewal at 50% of lease time.' },
  { component: 'Exclusion Range', description: 'IP addresses within the scope that will NOT be assigned (reserved for static devices like servers, printers, routers).' },
  { component: 'Reservation', description: 'Binds a specific IP address to a specific MAC address. That device always gets the same IP. Also called "static mapping."' },
  { component: 'Options', description: 'Additional configuration sent with the IP: Option 3 = Default Gateway, Option 6 = DNS Servers, Option 15 = Domain Name, Option 51 = Lease Time.' },
  { component: 'Superscope', description: 'A group of scopes merged into one administrative unit. Used when a single VLAN has multiple subnets (multinetting).' },
]

export const dhcpRelayFacts = [
  'DHCP uses broadcasts (layer 2) which do NOT cross router boundaries by default',
  'DHCP Relay Agent (Cisco: ip helper-address) forwards DHCP broadcasts as unicast to DHCP server on another subnet',
  'Allows a single DHCP server to serve multiple subnets',
  'Relay agent adds Option 82 (circuit ID, remote ID) to identify originating interface/VLAN',
  'The DHCP server must have scopes matching each subnet\'s range to respond correctly',
  'ip helper-address forwards 8 UDP services by default (DHCP, DNS, TFTP, BOOTP, Time, etc.)',
]
