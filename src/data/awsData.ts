// AWS Solutions Architect Associate SAA-C03 Reference Data

// ─── VPC ─────────────────────────────────────────────────────────────────────

export const vpcComponents = [
  {
    component: 'VPC',
    description: 'Virtual Private Cloud — logically isolated section of AWS cloud. Spans all AZs in a Region. CIDR range assigned at creation (e.g. 10.0.0.0/16). Max /16 to /28.',
  },
  {
    component: 'Subnet',
    description: 'Subdivision of VPC within a single AZ. Public subnet = has route to Internet Gateway. Private subnet = no direct internet access. One AZ per subnet.',
  },
  {
    component: 'Route Table',
    description: 'Controls traffic routing within VPC. Main route table applies to subnets without explicit association. Each subnet can have one route table.',
  },
  {
    component: 'Internet Gateway (IGW)',
    description: 'Enables internet access for VPC. Horizontally scaled, redundant. Attach one per VPC. Public subnets need: IGW + route table entry (0.0.0.0/0 → IGW) + public IP.',
  },
  {
    component: 'NAT Gateway',
    description: 'Allows private subnet instances to initiate outbound internet connections. Managed, highly available within an AZ. Created in public subnet. Charged per hour + data transfer.',
  },
  {
    component: 'NAT Instance',
    description: 'EC2 instance acting as NAT. Must disable source/destination check. Not highly available — manual setup needed. Cost-effective for dev/test. Superseded by NAT Gateway.',
  },
  {
    component: 'Elastic IP (EIP)',
    description: 'Static public IPv4 address. Associated with account (not instance). Free when in use, charged when not. Used for NAT Gateway, EC2, load balancers.',
  },
  {
    component: 'VPC Peering',
    description: 'Private connection between two VPCs (same or different accounts/regions). Not transitive — A↔B and B↔C does NOT mean A↔C. No CIDR overlap allowed.',
  },
  {
    component: 'Transit Gateway',
    description: 'Hub-and-spoke connectivity for VPCs and on-premises networks. Transitive routing. Attach VPCs, VPNs, Direct Connect. Cross-region peering supported.',
  },
  {
    component: 'VPC Endpoint',
    description: 'Private connection to AWS services without internet. Gateway type (S3, DynamoDB — free). Interface type (most services — powered by PrivateLink, ENI-based, charged).',
  },
  {
    component: 'PrivateLink',
    description: 'Expose services to other VPCs privately using Interface VPC Endpoints. Traffic stays within AWS network.',
  },
]

export const sgVsNacl = [
  { feature: 'Scope', sg: 'Instance level (ENI)', nacl: 'Subnet level' },
  { feature: 'State', sg: 'Stateful (return traffic auto-allowed)', nacl: 'Stateless (must explicitly allow inbound AND outbound)' },
  { feature: 'Rules', sg: 'Allow rules only', nacl: 'Allow AND Deny rules' },
  { feature: 'Rule Evaluation', sg: 'All rules evaluated before decision', nacl: 'Rules evaluated in order (lowest number first). First match wins.' },
  { feature: 'Default', sg: 'Default SG: allows all outbound, allows inbound from same SG', nacl: 'Default NACL: allows all inbound and outbound' },
  { feature: 'Assignment', sg: 'Must be explicitly associated with instance/ENI', nacl: 'Automatically applies to all instances in subnet' },
  { feature: 'Use case', sg: 'Fine-grained instance protection', nacl: 'Subnet-level defense; block specific IPs (e.g. DDoS mitigation)' },
]

// ─── IAM ─────────────────────────────────────────────────────────────────────

export const iamComponents = [
  {
    component: 'User',
    description: 'Represents a person or application. Long-term credentials (password, access keys). Best practice: use roles instead of long-term keys for applications.',
  },
  {
    component: 'Group',
    description: 'Collection of users. Policies attached to group apply to all members. Users can belong to multiple groups. Groups cannot contain other groups.',
  },
  {
    component: 'Role',
    description: 'Temporary credentials granted to trusted entities (EC2, Lambda, another account, federated user). No long-term credentials. Assumed via STS AssumeRole.',
  },
  {
    component: 'Policy',
    description: 'JSON document defining permissions. Attached to users, groups, or roles. Explicit Deny always overrides Allow. Default deny for unspecified actions.',
  },
  {
    component: 'Permission Boundary',
    description: 'Maximum permissions an IAM entity can have. Even if a policy grants more, the boundary limits it. Used for delegation of administration.',
  },
  {
    component: 'STS (Security Token Service)',
    description: 'Issues temporary security credentials. Used by AssumeRole, federation, EC2 instance profiles. Short-lived (15 min to 36 hours).',
  },
]

export const iamPolicyTypes = [
  { type: 'Identity-Based', scope: 'Attached to user/group/role', description: 'Defines what actions the identity can perform on which resources. Inline (embedded) or managed (standalone).' },
  { type: 'Resource-Based', scope: 'Attached to resource (S3, SQS, etc.)', description: 'Defines who can access the resource and what they can do. Supports cross-account access directly.' },
  { type: 'SCP (Service Control Policy)', scope: 'AWS Organizations', description: 'Maximum permissions for accounts in an OU. Does not grant permissions — only restricts. Applies to all users including root.' },
  { type: 'Permission Boundary', scope: 'IAM entity', description: 'Sets maximum permissions for a user/role. Evaluated alongside identity-based policy (both must allow).' },
  { type: 'Session Policy', scope: 'Temporary sessions', description: 'Passed during AssumeRole or federation. Further restricts temporary session permissions.' },
  { type: 'ACL', scope: 'S3, VPC', description: 'Legacy cross-account access control. Less granular than bucket policies. Mostly superseded by resource-based policies.' },
]

export const iamBestPractices = [
  'Enable MFA for all users, especially root account',
  'Never use root account for daily operations — lock it away',
  'Grant least privilege — start minimal, expand as needed',
  'Use IAM roles for applications/services (avoid long-term access keys)',
  'Rotate access keys regularly (or use roles to eliminate them)',
  'Use IAM Access Analyzer to identify external access to resources',
  'Enable CloudTrail to log all API calls',
  'Use AWS Organizations and SCPs for multi-account governance',
  'Use permission boundaries when delegating IAM administration',
  'Review and remove unused users, roles, and policies regularly',
]

// ─── EC2 Compute ─────────────────────────────────────────────────────────────

export const ec2InstanceFamilies = [
  { family: 'T (t3, t3a, t4g)', category: 'General Purpose', purpose: 'Burstable performance', detail: 'Credit-based CPU bursting. Good for workloads with variable traffic. Baseline CPU + burst above. T4g uses Graviton2 ARM.' },
  { family: 'M (m5, m6i, m7g)', category: 'General Purpose', purpose: 'Balanced compute/memory/network', detail: 'Workhorses for most applications. Good baseline performance. m7g = Graviton3.' },
  { family: 'C (c5, c6i, c7g)', category: 'Compute Optimized', purpose: 'High CPU-to-memory ratio', detail: 'Web servers, batch processing, HPC, gaming, ML inference, media transcoding.' },
  { family: 'R (r5, r6i, r7g)', category: 'Memory Optimized', purpose: 'High memory-to-CPU ratio', detail: 'In-memory databases, big data analytics, SAP HANA, caching (Redis), real-time big data.' },
  { family: 'X (x1e, x2iezn)', category: 'Memory Optimized', purpose: 'Extreme memory', detail: 'Highest memory per instance. SAP HANA, Apache Spark, in-memory analytics. Up to 24 TiB RAM.' },
  { family: 'I (i3, i3en, i4i)', category: 'Storage Optimized', purpose: 'High I/O with local NVMe', detail: 'NoSQL databases (DynamoDB local), data warehousing, Elasticsearch, HDFS.' },
  { family: 'D (d2, d3)', category: 'Storage Optimized', purpose: 'Dense HDD storage', detail: 'Massive parallel processing, MapReduce, HDFS. Sequential read/write. Up to 336 TB local HDD.' },
  { family: 'P (p3, p4d)', category: 'Accelerated (GPU)', purpose: 'NVIDIA GPU for ML training/inference', detail: 'Deep learning training, HPC, video rendering, molecular dynamics.' },
  { family: 'G (g4dn, g5)', category: 'Accelerated (GPU)', purpose: 'Graphics workloads', detail: 'Game streaming, graphics-intensive applications, ML inference. g4dn has T4 GPUs.' },
  { family: 'Inf (inf1, inf2)', category: 'Accelerated (AI)', purpose: 'AWS Inferentia ML chips', detail: 'Optimized for ML inference workloads at low cost. Custom AWS silicon.' },
]

export const ec2PurchasingOptions = [
  {
    option: 'On-Demand',
    commitment: 'None',
    discount: '0% (baseline)',
    bestFor: 'Short-term, unpredictable workloads; development/testing; first use of new applications',
    notes: 'Pay per second (Linux/Windows) or per hour. Most flexible. Most expensive.',
  },
  {
    option: 'Reserved Instance (Standard)',
    commitment: '1 or 3 years',
    discount: 'Up to 72%',
    bestFor: 'Steady-state, predictable workloads (databases, enterprise apps)',
    notes: 'Choose: instance type, Region, tenancy, OS upfront. Convertible RI allows changes but less discount (up to 66%).',
  },
  {
    option: 'Savings Plans (EC2/Compute)',
    commitment: '1 or 3 years',
    discount: 'Up to 66-72%',
    bestFor: 'Flexible commitment regardless of instance family/region/OS (Compute Savings Plans)',
    notes: 'Commit to $ per hour spend. Compute Savings Plans apply to EC2, Fargate, Lambda. More flexible than RIs.',
  },
  {
    option: 'Spot Instances',
    commitment: 'None',
    discount: 'Up to 90%',
    bestFor: 'Fault-tolerant, flexible workloads: batch jobs, ML training, big data, stateless services',
    notes: 'Can be interrupted with 2-minute warning when AWS needs capacity back. Never use for critical or stateful workloads.',
  },
  {
    option: 'Dedicated Host',
    commitment: 'On-Demand or 1/3-year',
    discount: 'BYOL savings (no new discount)',
    bestFor: 'BYOL (Bring Your Own License) for per-socket/per-core software. Compliance requiring physical isolation.',
    notes: 'Physical server dedicated to your account. Visibility into physical sockets/cores. Most expensive option.',
  },
  {
    option: 'Dedicated Instance',
    commitment: 'None',
    discount: 'Slight premium',
    bestFor: 'Compliance/security requiring hardware isolation (no hardware sharing with other AWS accounts)',
    notes: 'Instance runs on hardware dedicated to you, but AWS manages the physical host. Less control than Dedicated Host.',
  },
]

export const ec2PlacementGroups = [
  {
    type: 'Cluster',
    layout: 'All instances in same rack, same AZ',
    pros: 'Lowest latency, highest throughput (10 Gbps enhanced networking)',
    cons: 'Single point of failure (rack failure). Not spread across AZs.',
    useCase: 'HPC, big data analytics, tightly coupled distributed computing (MPI)',
  },
  {
    type: 'Spread',
    layout: 'Each instance on separate hardware rack',
    pros: 'Maximum redundancy. Up to 7 instances per AZ. Reduces correlated failures.',
    cons: 'Limited to 7 running instances per AZ per group.',
    useCase: 'Critical applications needing high availability — Hadoop nodes, HDFS, database clusters',
  },
  {
    type: 'Partition',
    layout: 'Groups of instances in separate partitions (racks)',
    pros: 'Scale to hundreds of instances. Partition metadata visible to HDFS/Cassandra.',
    cons: 'More complex than Spread.',
    useCase: 'Large distributed and replicated workloads: HDFS, HBase, Cassandra, Kafka',
  },
]

export const lbTypes = [
  {
    type: 'Application Load Balancer (ALB)',
    layer: 'Layer 7 (HTTP/HTTPS)',
    protocols: 'HTTP, HTTPS, gRPC, WebSocket',
    routing: 'Path-based, host-based, query string, headers, source IP',
    features: 'Sticky sessions, Lambda targets, ECS native, WAF integration, native HTTPS offload, redirect rules',
    useCase: 'Web applications, microservices, containerized apps, HTTP APIs',
  },
  {
    type: 'Network Load Balancer (NLB)',
    layer: 'Layer 4 (TCP/UDP)',
    protocols: 'TCP, UDP, TLS',
    routing: 'Source IP preservation, static IPs per AZ, Elastic IPs supported',
    features: 'Ultra-low latency, millions of requests/sec, preserves client IP, TLS termination, cross-zone LB',
    useCase: 'Gaming, IoT, financial apps needing extreme performance; use with PrivateLink',
  },
  {
    type: 'Gateway Load Balancer (GWLB)',
    layer: 'Layer 3 (IP)',
    protocols: 'All IP traffic (GENEVE protocol)',
    routing: 'Transparent to applications, uses GENEVE 6081',
    features: 'Integrate 3rd-party virtual appliances (firewalls, IDS/IPS, deep packet inspection)',
    useCase: 'Inline network security appliances, traffic inspection',
  },
  {
    type: 'Classic Load Balancer (CLB)',
    layer: 'Layer 4 & 7',
    protocols: 'HTTP, HTTPS, TCP, SSL',
    routing: 'Basic HTTP/TCP load balancing',
    features: 'Legacy. Being phased out. Lacks advanced features of ALB/NLB.',
    useCase: 'Legacy EC2-Classic applications only. Use ALB or NLB for new deployments.',
  },
]

// ─── Storage ─────────────────────────────────────────────────────────────────

export const s3StorageClasses = [
  {
    name: 'S3 Standard',
    availability: '99.99%',
    durability: '11 9s',
    retrievalFee: 'None',
    minStorage: 'None',
    minDuration: 'None',
    useCase: 'Frequently accessed data, websites, content distribution, big data analytics',
  },
  {
    name: 'S3 Intelligent-Tiering',
    availability: '99.9%',
    durability: '11 9s',
    retrievalFee: 'None',
    minStorage: 'None',
    minDuration: 'None',
    useCase: 'Unknown or changing access patterns. Auto-moves between tiers. Small monitoring/automation fee.',
  },
  {
    name: 'S3 Standard-IA',
    availability: '99.9%',
    durability: '11 9s',
    retrievalFee: 'Per GB',
    minStorage: '128 KB',
    minDuration: '30 days',
    useCase: 'Infrequently accessed but needs millisecond retrieval. Backups, disaster recovery.',
  },
  {
    name: 'S3 One Zone-IA',
    availability: '99.5%',
    durability: '11 9s (single AZ)',
    retrievalFee: 'Per GB',
    minStorage: '128 KB',
    minDuration: '30 days',
    useCase: 'Infrequently accessed, re-creatable data. Secondary backups, easily reproducible data. 20% cheaper than Standard-IA.',
  },
  {
    name: 'S3 Glacier Instant Retrieval',
    availability: '99.9%',
    durability: '11 9s',
    retrievalFee: 'Per GB',
    minStorage: '128 KB',
    minDuration: '90 days',
    useCase: 'Archive with millisecond retrieval. Medical images, news media. Quarterly access pattern.',
  },
  {
    name: 'S3 Glacier Flexible Retrieval',
    availability: '99.99%',
    durability: '11 9s',
    retrievalFee: 'Per GB',
    minStorage: '40 KB',
    minDuration: '90 days',
    useCase: 'Archive data accessed 1-2x/year. Retrieval: Expedited (1-5 min), Standard (3-5 hr), Bulk (5-12 hr). Compliance archives.',
  },
  {
    name: 'S3 Glacier Deep Archive',
    availability: '99.99%',
    durability: '11 9s',
    retrievalFee: 'Per GB',
    minStorage: '40 KB',
    minDuration: '180 days',
    useCase: 'Lowest cost storage. Accessed once or twice per year. Standard retrieval: 12 hr. Bulk: 48 hr. Regulatory archives.',
  },
]

export const s3Features = [
  { feature: 'Versioning', description: 'Keeps all versions of objects. Protects against accidental delete/overwrite. Must be explicitly enabled. MFA Delete adds extra protection.' },
  { feature: 'Cross-Region Replication (CRR)', description: 'Asynchronously copies objects to bucket in different Region. Requires versioning on both buckets. Used for compliance, DR, lower latency.' },
  { feature: 'Same-Region Replication (SRR)', description: 'Copies objects within same Region. Log aggregation, live replication between production/test, compliance within same Region.' },
  { feature: 'Lifecycle Policies', description: 'Automatically transition objects between storage classes or expire them. E.g., Standard → Standard-IA after 30 days → Glacier after 90 days.' },
  { feature: 'Transfer Acceleration', description: 'Uses CloudFront edge network for faster uploads. Extra cost. Good for uploads from geographically distant locations.' },
  { feature: 'Multipart Upload', description: 'Required for objects >5 GB, recommended for >100 MB. Upload parts in parallel. Retry failed parts only.' },
  { feature: 'Object Lock', description: 'WORM (Write Once Read Many) storage. Compliance mode (no one can delete, even root) or Governance mode. For SEC/FINRA compliance.' },
  { feature: 'Bucket Policy', description: 'JSON-based resource policy attached to bucket. Controls access from any principal (cross-account, AWS services). Evaluated with IAM policies.' },
  { feature: 'ACL (Access Control List)', description: 'Legacy fine-grained access control at bucket or object level. Generally prefer bucket policies. Disabled by default in newer buckets.' },
  { feature: 'Block Public Access', description: 'Account or bucket-level settings preventing public access. Enabled by default since Apr 2023. Override requires explicit action.' },
]

export const ebsTypes = [
  { type: 'gp3 (General Purpose SSD)', iops: '3,000 baseline (up to 16,000)', throughput: '125 MB/s baseline (up to 1,000 MB/s)', cost: 'Cheapest SSD', useCase: 'Boot volumes, low-latency apps, dev/test. IOPS and throughput configurable independently.' },
  { type: 'gp2 (General Purpose SSD)', iops: '3 IOPS/GB (up to 16,000)', throughput: '128–250 MB/s', cost: 'Slightly more than gp3', useCase: 'Legacy. IOPS scales with size. Bursts up to 3,000 IOPS. Prefer gp3 for new deployments.' },
  { type: 'io2 Block Express (Provisioned IOPS)', iops: 'Up to 256,000', throughput: 'Up to 4,000 MB/s', cost: 'Most expensive SSD', useCase: 'I/O intensive: large databases (Oracle, SQL Server, SAP HANA). 99.999% durability. Sub-millisecond latency.' },
  { type: 'io1 (Provisioned IOPS)', iops: 'Up to 64,000', throughput: 'Up to 1,000 MB/s', cost: 'Expensive SSD', useCase: 'Critical databases needing sustained high IOPS. Legacy compared to io2.' },
  { type: 'st1 (Throughput Optimized HDD)', iops: '40 IOPS/TB (up to 500)', throughput: '40 MB/s/TB (up to 500 MB/s)', cost: 'Cheap HDD', useCase: 'Big data, data warehouses, log processing. Sequential workloads. Cannot be boot volume.' },
  { type: 'sc1 (Cold HDD)', iops: '12 IOPS/TB (up to 250)', throughput: '12 MB/s/TB (up to 250 MB/s)', cost: 'Cheapest EBS', useCase: 'Infrequently accessed, cold data. Archive. Sequential access. Cannot be boot volume.' },
]

export const storageComparison = [
  { dimension: 'Storage type', ebs: 'Block (attached to one EC2 per AZ)', efs: 'File (NFS)', s3: 'Object', instanceStore: 'Block (physically attached to host)' },
  { dimension: 'Access', ebs: 'Single EC2 (io1/io2 = multi-attach, same AZ)', efs: 'Thousands of EC2 concurrently (NFS), Linux only', s3: 'Any AWS service or internet via HTTP/S', instanceStore: 'Single EC2 only' },
  { dimension: 'Persistence', ebs: 'Persistent (survives instance stop/start)', efs: 'Persistent', s3: 'Persistent', instanceStore: 'EPHEMERAL — data lost on stop/terminate/hardware failure' },
  { dimension: 'Durability', ebs: '99.8-99.9% (gp2) / 99.999% (io2)', efs: '99.999999999% (11 9s)', s3: '99.999999999% (11 9s)', instanceStore: 'No durability guarantee' },
  { dimension: 'Max size', ebs: '64 TiB per volume', efs: 'Unlimited (petabyte-scale)', s3: 'Unlimited (5 TB per object)', instanceStore: 'Varies by instance type (up to 60 TB for i3)' },
  { dimension: 'Pricing model', ebs: 'Provisioned GB/month + IOPS + throughput', efs: 'GB used (pay for what you use)', s3: 'GB stored + requests + transfer', instanceStore: 'Included with instance' },
  { dimension: 'Best for', ebs: 'Database storage, boot volumes, low-latency block', efs: 'Shared content, home directories, content management, ECS task shared storage', s3: 'Static assets, backups, archives, data lake, serverless backend', instanceStore: 'Temp data, buffers, caches, scratch space, replicated data (Hadoop/Cassandra)' },
]

// ─── Databases ───────────────────────────────────────────────────────────────

export const rdsFeatures = [
  { feature: 'Multi-AZ Deployment', description: 'Synchronous standby replica in different AZ. Automatic failover (~1-2 min). NOT readable — only for HA/DR. Automatic backups maintained.' },
  { feature: 'Read Replicas', description: 'Asynchronous copies for read scaling. Up to 5 per primary (some engines more). Can be in same Region, cross-region, or cross-AZ. Can be promoted to standalone DB.' },
  { feature: 'Automated Backups', description: 'Daily snapshot + transaction logs. Retention 1-35 days. Point-in-time recovery within retention window. Stored in S3.' },
  { feature: 'Manual Snapshots', description: 'User-initiated. Persist beyond instance deletion. Can copy cross-region or cross-account. Used for migration.' },
  { feature: 'Encryption', description: 'At rest: AES-256 via KMS. Must be enabled at creation. Snapshots, replicas, and logs also encrypted. In transit: SSL/TLS.' },
  { feature: 'IAM DB Authentication', description: 'Use IAM roles/users instead of DB passwords (MySQL, PostgreSQL). Token-based, short-lived. No password management needed.' },
  { feature: 'RDS Proxy', description: 'Manages connection pooling. Reduces DB connections from Lambda/ECS. Improves failover time. Integrates with Secrets Manager.' },
]

export const rdsEngines = [
  { engine: 'MySQL', version: '5.7, 8.0', notes: 'Most popular open source RDBMS. Excellent Read Replica support. Compatible with Aurora MySQL.' },
  { engine: 'PostgreSQL', version: '12, 13, 14, 15, 16', notes: 'Feature-rich open source. Advanced data types, full-text search. Compatible with Aurora PostgreSQL.' },
  { engine: 'MariaDB', version: '10.5, 10.6, 10.11', notes: 'MySQL fork. Open source. Similar to MySQL with some enhancements.' },
  { engine: 'Oracle', version: 'SE2, EE', notes: 'Enterprise. BYOL or License Included. Best for Oracle-specific features.' },
  { engine: 'SQL Server', version: 'Express, Web, Standard, Enterprise', notes: 'Microsoft. Windows-based. License Included pricing. Best for .NET workloads.' },
  { engine: 'Aurora MySQL', version: 'Compatible with MySQL 5.7, 8.0', notes: '5x MySQL performance. Serverless v2 option. Up to 15 Read Replicas. Global Database. Auto-scaling storage (10 GB–128 TB).' },
  { engine: 'Aurora PostgreSQL', version: 'Compatible with PostgreSQL 12-16', notes: '3x PostgreSQL performance. Same Aurora features. Babelfish for SQL Server compatibility.' },
]

export const dynamoDBConcepts = [
  { concept: 'Table', description: 'Collection of items (rows). Schema-less except for primary key attributes. No row limit. Unlimited scale.' },
  { concept: 'Partition Key', description: 'Also called hash key. Determines partition where item is stored. Must be unique if no sort key. Choose high-cardinality attribute for even distribution.' },
  { concept: 'Sort Key', description: 'Also called range key. Combined with partition key for composite primary key. Enables range queries on items with same partition key.' },
  { concept: 'GSI (Global Secondary Index)', description: 'Index with different partition and/or sort key than base table. Separate read/write capacity. Query any attribute. Up to 20 per table. Eventually consistent.' },
  { concept: 'LSI (Local Secondary Index)', description: 'Same partition key as base table but different sort key. Must be created at table creation. Shares capacity with base table. Strongly consistent reads possible.' },
  { concept: 'On-Demand Capacity', description: 'Pay per request (RCU/WCU). No capacity planning. Good for unpredictable workloads. More expensive per request than provisioned.' },
  { concept: 'Provisioned Capacity', description: 'Specify Read/Write Capacity Units (RCU/WCU). With Auto Scaling enabled, scales within defined limits. Cost-effective for predictable traffic.' },
  { concept: 'DynamoDB Streams', description: 'Ordered log of item-level changes (creates, updates, deletes). 24-hour retention. Triggers Lambda for event-driven architectures. Powers cross-region replication.' },
  { concept: 'DAX (DynamoDB Accelerator)', description: 'In-memory cache for DynamoDB. Microsecond read latency (vs single-digit milliseconds). Fully managed, API-compatible. No code changes for reads.' },
  { concept: 'DynamoDB Global Tables', description: 'Multi-region, multi-active replication. Read/write to any region. Last-write-wins conflict resolution. Requires DynamoDB Streams enabled.' },
  { concept: 'TTL (Time to Live)', description: 'Automatically delete items after a specified timestamp attribute. Free operation. Useful for session data, temporary records, compliance data deletion.' },
]

export const cacheComparison = [
  { feature: 'Data Structure Support', redis: 'Strings, Hashes, Lists, Sets, Sorted Sets, Bitmaps, HyperLogLog, Geospatial', memcached: 'Strings (simple key-value only)' },
  { feature: 'Persistence', redis: 'Yes (RDB snapshots + AOF logs)', memcached: 'No — purely in-memory, data lost on restart' },
  { feature: 'Replication', redis: 'Yes (primary-replica, Multi-AZ failover)', memcached: 'No replication' },
  { feature: 'Clustering', redis: 'Redis Cluster (sharding + HA)', memcached: 'Multi-node (auto-sharding, horizontal scale only)' },
  { feature: 'Multi-threading', redis: 'Single-threaded (v6+ partially multi-threaded)', memcached: 'Multi-threaded — better for simple high-concurrency workloads' },
  { feature: 'Pub/Sub', redis: 'Yes', memcached: 'No' },
  { feature: 'Lua scripting', redis: 'Yes (atomic operations)', memcached: 'No' },
  { feature: 'Backup', redis: 'Yes (automatic + manual snapshots)', memcached: 'No' },
  { feature: 'Use Cases', redis: 'Session management, leaderboards, real-time analytics, pub/sub, geospatial, queues', memcached: 'Simple object caching, read-heavy workloads, horizontal scale needed' },
]

// ─── High Availability & Scaling ─────────────────────────────────────────────

export const route53Policies = [
  { policy: 'Simple', description: 'Single resource or multiple values (random selection by client). No health checks (unless using Alias). Default policy.' },
  { policy: 'Failover', description: 'Primary and secondary resources. Routes to secondary if primary health check fails. Requires health checks. Active-passive HA.' },
  { policy: 'Geolocation', description: 'Routes based on geographic location of the user (continent, country, or US state). Serves localized content or compliance restrictions.' },
  { policy: 'Geoproximity', description: 'Routes based on geographic location of users AND resources. Bias value to expand/shrink routing area. Requires Route 53 Traffic Flow.' },
  { policy: 'Latency', description: 'Routes to the AWS Region with lowest latency for the user. AWS measures latency to regions and routes accordingly. Global apps.' },
  { policy: 'IP-Based', description: 'Routes based on user\'s IP address (CIDR ranges). ISP-based routing, localized optimization.' },
  { policy: 'Multivalue Answer', description: 'Returns up to 8 healthy records randomly. Client-side load balancing. Health checks supported. NOT a replacement for load balancer.' },
  { policy: 'Weighted', description: 'Split traffic by percentage weights (e.g., 90/10 for blue/green deploy or A/B testing). Weight 0 = stop routing. Any resource type.' },
]

export const autoScalingPolicies = [
  { policy: 'Target Tracking Scaling', description: 'Scales to maintain a target metric value (e.g., keep CPU at 50%). Simplest to configure. AWS handles scale-out and scale-in automatically.' },
  { policy: 'Step Scaling', description: 'Scales based on CloudWatch alarm with step adjustments based on alarm breach magnitude. More granular than Simple scaling.' },
  { policy: 'Simple Scaling', description: 'Single scaling action triggered by CloudWatch alarm. Cooldown period before next action. Legacy — prefer Target Tracking.' },
  { policy: 'Scheduled Scaling', description: 'Scale at known times (e.g., increase capacity every Monday 8am). Predictable load patterns.' },
  { policy: 'Predictive Scaling', description: 'ML-based forecasting using historical CloudWatch data. Pre-provisions capacity before expected load. Works with Target Tracking.' },
]

export const cloudfrontConcepts = [
  { concept: 'Edge Location', description: 'CDN point of presence where content is cached. 400+ worldwide. Separate from Regions/AZs.' },
  { concept: 'Distribution', description: 'CloudFront configuration entity. Web distribution (HTTP/S) or RTMP (deprecated, streaming).' },
  { concept: 'Origin', description: 'Source of content. S3 bucket, ALB, EC2, API Gateway, HTTP server. Multiple origins supported.' },
  { concept: 'Cache Behavior', description: 'Rules mapping URL patterns to origins. Path patterns, TTL, query string forwarding, cookie handling.' },
  { concept: 'OAC (Origin Access Control)', description: 'Restricts S3 origin to allow only CloudFront access. Successor to OAI. Supports KMS encryption, all S3 operations.' },
  { concept: 'Field-Level Encryption', description: 'End-to-end encryption of sensitive form fields (credit card, SSN) from viewer to application using asymmetric encryption.' },
  { concept: 'Lambda@Edge / CloudFront Functions', description: 'Run code at edge locations. Lambda@Edge: Node.js/Python, viewer/origin request+response. CloudFront Functions: JS, viewer request/response only, faster/cheaper.' },
  { concept: 'Signed URLs / Cookies', description: 'Control access to content with time-limited signed URLs (single file) or cookies (multiple files). Used for premium content.' },
  { concept: 'Price Class', description: 'Restrict to subset of edge locations to reduce cost. All edges vs US/Canada/Europe only vs further reduced sets.' },
]

// ─── Security Services ────────────────────────────────────────────────────────

export const awsSecurityServices = [
  {
    service: 'IAM',
    category: 'Identity',
    description: 'Users, groups, roles, policies. Identity and access management. Evaluate all requests. Global service.',
  },
  {
    service: 'KMS (Key Management Service)',
    category: 'Encryption',
    description: 'Create/manage Customer Managed Keys (CMK). Envelope encryption. Integrates with 100+ AWS services. Audit via CloudTrail. Multi-region keys supported.',
  },
  {
    service: 'CloudHSM',
    category: 'Encryption',
    description: 'Dedicated hardware security module. FIPS 140-2 Level 3 certified. You manage keys (AWS has no access). For compliance requiring dedicated HSM.',
  },
  {
    service: 'ACM (Certificate Manager)',
    category: 'Encryption',
    description: 'Free SSL/TLS certificates for AWS services. Auto-renewal. Integrates with ALB, CloudFront, API Gateway. Cannot export private key.',
  },
  {
    service: 'Secrets Manager',
    category: 'Secrets',
    description: 'Store, rotate, and manage secrets (DB credentials, API keys). Automatic rotation via Lambda. Cross-account sharing. Per-secret pricing.',
  },
  {
    service: 'Parameter Store (SSM)',
    category: 'Secrets',
    description: 'Free for standard parameters (StringList, String). SecureString uses KMS. Lower cost than Secrets Manager. No auto-rotation.',
  },
  {
    service: 'Shield Standard',
    category: 'DDoS',
    description: 'Automatic DDoS protection for all AWS customers. Free. Protects against Layer 3/4 attacks (SYN floods, UDP reflection). Always on.',
  },
  {
    service: 'Shield Advanced',
    category: 'DDoS',
    description: '$3,000/month + DRT (DDoS Response Team) access. Layer 7 protection. Cost protection (no charges for DDoS traffic). Proactive monitoring.',
  },
  {
    service: 'WAF (Web Application Firewall)',
    category: 'Application Security',
    description: 'Protect web apps from OWASP Top 10. Web ACLs with rules (SQL injection, XSS, rate limiting, IP blocking, geo-blocking). Integrates with ALB, CloudFront, API Gateway, AppSync.',
  },
  {
    service: 'GuardDuty',
    category: 'Threat Detection',
    description: 'ML-based threat detection. Analyzes VPC Flow Logs, CloudTrail, DNS logs, EKS audit logs. Finds malware, cryptocurrency mining, compromised credentials. Regional service.',
  },
  {
    service: 'Inspector',
    category: 'Vulnerability Assessment',
    description: 'Automated vulnerability scanning for EC2, Lambda, and ECR container images. CVE database. Integrates with Security Hub. Continuous scanning.',
  },
  {
    service: 'Macie',
    category: 'Data Security',
    description: 'ML-powered discovery of sensitive data (PII, credentials) in S3. Automated data classification. GDPR/HIPAA compliance assistance.',
  },
  {
    service: 'Security Hub',
    category: 'SIEM / Compliance',
    description: 'Centralized security findings from GuardDuty, Inspector, Macie, Firewall Manager, etc. CIS AWS Benchmarks, PCI DSS, AWS Foundational Security Standard checks.',
  },
  {
    service: 'CloudTrail',
    category: 'Auditing',
    description: 'Logs all API calls (who, what, when, from where). Management events (free) vs Data events (charged). Multi-region trail. 90-day default + S3/CloudWatch for longer retention.',
  },
  {
    service: 'Config',
    category: 'Compliance',
    description: 'Records AWS resource configurations and changes over time. Compliance rules (managed or custom Lambda). Configuration history and drift detection.',
  },
  {
    service: 'Firewall Manager',
    category: 'Centralized Security',
    description: 'Manage WAF rules, Shield Advanced, Security Groups, Network Firewall across multiple accounts from AWS Organizations. Centralized policy enforcement.',
  },
]

// ─── Serverless ───────────────────────────────────────────────────────────────

export const serverlessServices = [
  {
    service: 'Lambda',
    description: 'Run code without servers. Triggered by 200+ event sources. Up to 15 min timeout. 10 GB RAM. 250 MB /tmp storage (ephemeral). Pay per invocation + duration.',
    limits: 'Max 15 min timeout. 250 MB deployment package (50 MB zipped, 10 GB with container image). Concurrent executions: 1,000 default (burst up to 3,000 in some regions).',
    useCase: 'Event-driven processing, API backends (with API Gateway), scheduled jobs, stream processing (Kinesis/DynamoDB Streams), S3 event processing.',
  },
  {
    service: 'API Gateway',
    description: 'Fully managed API creation. REST API (original), HTTP API (cheaper, faster, fewer features), WebSocket API. Integrates with Lambda, HTTP endpoints, AWS services.',
    limits: 'Max 29 second integration timeout. 10 MB payload limit for REST. Throttling: default 10,000 RPS + 5,000 burst.',
    useCase: 'RESTful APIs, WebSocket APIs, serverless backend, API versioning and throttling.',
  },
  {
    service: 'Step Functions',
    description: 'Visual workflow orchestration for Lambda functions and AWS services. State machine JSON/YAML (ASL). Standard (1 year, auditable) or Express (5 min, high-throughput) workflows.',
    limits: 'Standard: 1-year execution, 25,000 state transitions/day free. Express: 5-min max, charged per transition.',
    useCase: 'Complex multi-step workflows, data processing pipelines, order fulfillment, retry/error handling logic.',
  },
  {
    service: 'SQS (Simple Queue Service)',
    description: 'Managed message queue. Standard (at-least-once, nearly unlimited TPS) or FIFO (exactly-once, 300 TPS / 3,000 with batching). Messages retained up to 14 days. Max message size: 256 KB.',
    limits: 'Visibility timeout: 0-12 hours. Long polling (up to 20s) reduces empty responses. Dead Letter Queue (DLQ) for failed messages.',
    useCase: 'Decoupling microservices, work queue, fan-out (with SNS), buffering spikes, ordered processing (FIFO).',
  },
  {
    service: 'SNS (Simple Notification Service)',
    description: 'Pub/Sub messaging. Topics with subscribers. Subscribers: SQS, Lambda, HTTP/S, email, SMS, mobile push. Filter policies for message routing. Fan-out pattern.',
    limits: '100,000 topics per account. 12.5 million subscriptions per topic. 256 KB message size. FIFO topics available.',
    useCase: 'Fan-out (one message to many), alert notifications, mobile push, application integration, event-driven architectures.',
  },
  {
    service: 'EventBridge',
    description: 'Event bus for AWS and SaaS events. Rules route events to targets. Schema registry. Scheduled events (cron). Partner event sources (Zendesk, PagerDuty). Replaces CloudWatch Events.',
    limits: '300 targets per rule. 5 MB event size max. Events retained 24 hours.',
    useCase: 'Event-driven architectures, cross-account event routing, SaaS integration, scheduled tasks, application event routing.',
  },
  {
    service: 'Kinesis Data Streams',
    description: 'Real-time streaming data ingestion. Shards = 1 MB/s write, 2 MB/s read. Data retained 1-365 days. Producers: Kinesis Producer Library (KPL), Kinesis Agent, API. Consumers: KCL, Lambda, Firehose.',
    limits: '1 MB/s write or 1,000 records/s per shard. 2 MB/s read per shard. Extended data retention (7-365 days) costs extra.',
    useCase: 'Real-time analytics, clickstream analysis, log and event data collection, IoT telemetry, financial transactions.',
  },
]
