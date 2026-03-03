// AWS Cloud Practitioner CLF-C02 Reference Data

// ─── Cloud Concepts ──────────────────────────────────────────────────────────

export const cloudBenefits = [
  { benefit: 'Trade CapEx for OpEx', description: 'Instead of owning and maintaining data centers, pay only for what you use. No upfront hardware costs.' },
  { benefit: 'Economies of Scale', description: 'AWS aggregates usage from hundreds of thousands of customers, passing savings on through lower prices.' },
  { benefit: 'Stop Guessing Capacity', description: 'Scale up or down in minutes. Never over-provision or under-provision for peak demand again.' },
  { benefit: 'Increase Speed & Agility', description: 'New resources available in minutes, not weeks. Experiment and innovate faster with lower cost of failure.' },
  { benefit: 'Stop Spending on Data Centers', description: 'Focus on your customers and differentiating work, not infrastructure racking, stacking, and powering.' },
  { benefit: 'Go Global in Minutes', description: 'Deploy your application in multiple AWS Regions worldwide with a few clicks. Low latency globally.' },
]

export const cloudServiceModels = [
  {
    model: 'IaaS',
    fullName: 'Infrastructure as a Service',
    youManage: 'OS, middleware, runtime, data, applications',
    awsManages: 'Virtualization, servers, storage, networking',
    examples: ['EC2', 'VPC', 'EBS'],
    description: 'Most flexibility and control. You manage from the OS up. Closest to managing your own data center.',
  },
  {
    model: 'PaaS',
    fullName: 'Platform as a Service',
    youManage: 'Data and applications only',
    awsManages: 'OS, runtime, middleware, infrastructure',
    examples: ['Elastic Beanstalk', 'RDS', 'Lambda (partially)'],
    description: 'AWS manages the platform. You focus on deploying your application and data. Less control, less management.',
  },
  {
    model: 'SaaS',
    fullName: 'Software as a Service',
    youManage: 'Nothing — just use the software',
    awsManages: 'Everything',
    examples: ['Amazon Chime', 'Amazon WorkMail', 'Salesforce (not AWS)'],
    description: 'Complete product run and managed by the provider. You just use the end-user application.',
  },
]

export const deploymentModels = [
  {
    model: 'Public Cloud',
    description: 'Everything runs on AWS. No on-premises infrastructure. Most common for new applications.',
    pros: ['Low cost', 'No maintenance', 'Near-unlimited scalability', 'High reliability'],
    example: 'A startup running their entire app on AWS EC2, RDS, and S3.',
  },
  {
    model: 'Private Cloud',
    description: 'Cloud infrastructure used exclusively by one organization. Hosted on-premises or by a provider. Not the same as AWS.',
    pros: ['Full control', 'Better security/compliance for regulated industries', 'Meets strict data sovereignty requirements'],
    example: 'A bank running VMware in their own data center.',
  },
  {
    model: 'Hybrid Cloud',
    description: 'Mix of public and private cloud. On-premises connected to AWS via VPN or Direct Connect.',
    pros: ['Keep sensitive data on-premises', 'Burst to cloud for demand spikes', 'Gradual cloud migration path'],
    example: 'Hospital keeps patient records on-premises, runs analytics workloads on AWS.',
  },
]

export const cloudVsOnPrem = [
  { aspect: 'Upfront cost', onPrem: 'High CapEx (buy servers, data center)', cloud: 'No upfront — pay as you go (OpEx)' },
  { aspect: 'Capacity planning', onPrem: 'Must predict and overprovision', cloud: 'Scale up/down instantly on demand' },
  { aspect: 'Time to provision', onPrem: 'Weeks to months', cloud: 'Minutes' },
  { aspect: 'Maintenance', onPrem: 'Your team handles hardware, patching', cloud: 'AWS handles underlying infrastructure' },
  { aspect: 'Global reach', onPrem: 'Build your own data centers worldwide', cloud: 'Deploy globally in minutes' },
  { aspect: 'Reliability', onPrem: 'Depends on your investment', cloud: 'Built-in redundancy across AZs' },
]

// ─── Shared Responsibility ────────────────────────────────────────────────────

export const awsResponsibility = [
  'Physical security of data centers',
  'Hardware and global networking infrastructure',
  'Regions, Availability Zones, Edge Locations',
  'Virtualization layer (hypervisor)',
  'Managed service software (e.g., RDS database engine patching)',
  'Storage, compute, and database hardware',
]

export const customerResponsibility = [
  'Data stored in AWS (encryption decisions)',
  'Application code and configuration',
  'IAM users, groups, roles, and policies',
  'Operating system patches and updates (for EC2)',
  'Security group and firewall rules',
  'Client-side and server-side data encryption',
]

export const sharedResponsibilityExamples = [
  { service: 'EC2', aws: 'Physical host, hypervisor, networking hardware', customer: 'OS patching, application, security groups, data' },
  { service: 'RDS', aws: 'DB engine patching, underlying OS, hardware', customer: 'Database settings, users, encryption, network access' },
  { service: 'S3', aws: 'Storage infrastructure, durability', customer: 'Bucket policies, encryption, access control, data classification' },
  { service: 'Lambda', aws: 'Runtime environment, scaling, underlying infrastructure', customer: 'Function code, IAM permissions, data in/out' },
]

// ─── IAM Basics ───────────────────────────────────────────────────────────────

export const iamBasics = [
  { concept: 'Root User', description: 'Created when you open an AWS account. Has complete access to everything. NEVER use for daily tasks. Enable MFA and lock it away.' },
  { concept: 'IAM User', description: 'An identity for a person or application. Has permanent credentials (password and/or access keys). Assign to individuals.' },
  { concept: 'IAM Group', description: 'Collection of IAM users. Attach policies to the group — all members inherit those permissions. Makes management easier.' },
  { concept: 'IAM Role', description: 'Temporary credentials for services or users. EC2 instances, Lambda functions, and other accounts assume roles. No permanent credentials stored.' },
  { concept: 'IAM Policy', description: 'JSON document defining what actions are allowed or denied on which resources. Attached to users, groups, or roles.' },
  { concept: 'MFA', description: 'Multi-Factor Authentication. Adds a second layer of security beyond just a password. Strongly recommended for all users, required for root.' },
]

export const iamBestPractices = [
  'Enable MFA for the root account immediately',
  'Never share or use the root account for daily work',
  'Grant least privilege — only the permissions needed for the job',
  'Create individual IAM users — never share credentials',
  'Use IAM roles for AWS services (EC2, Lambda) — not access keys',
  'Rotate access keys regularly',
  'Use IAM groups to assign permissions to multiple users at once',
  'Monitor account activity with CloudTrail',
]

// ─── Core Services ─────────────────────────────────────────────────────────

export const coreServicesOverview = [
  // Compute
  {
    category: 'Compute',
    service: 'EC2',
    tagline: 'Virtual servers in the cloud',
    description: 'Rent virtual machines (instances) in the cloud. Choose OS, CPU, RAM. Pay per hour or per second. Full control — you manage the OS.',
    keyFacts: ['100s of instance types', 'Pay per second (Linux) or per hour (Windows)', 'Pricing: On-Demand, Reserved (save 72%), Spot (save 90%), Dedicated'],
  },
  {
    category: 'Compute',
    service: 'Lambda',
    tagline: 'Run code without servers',
    description: 'Upload your code and Lambda runs it. No servers to manage. Scales automatically. Pay only when code runs (per invocation + duration).',
    keyFacts: ['Max 15-minute execution', 'Triggered by events (S3, API Gateway, etc.)', 'Free tier: 1 million requests/month'],
  },
  {
    category: 'Compute',
    service: 'Elastic Beanstalk',
    tagline: 'Deploy apps without managing infrastructure',
    description: 'PaaS — upload your code and Beanstalk handles deployment, capacity, load balancing, auto-scaling, and monitoring. You keep control of resources.',
    keyFacts: ['Supports Java, .NET, Node.js, Python, Ruby, PHP, Go', 'Free to use — pay for underlying resources', 'Good for developers who want to avoid infrastructure decisions'],
  },
  // Storage
  {
    category: 'Storage',
    service: 'S3',
    tagline: 'Object storage for anything',
    description: 'Store any amount of data as objects (files) in buckets. 99.999999999% (11 nines) durability. Used for backups, static websites, data lakes, media.',
    keyFacts: ['Unlimited storage; max 5 TB per object', 'Buckets are regional but accessed globally', 'Storage classes: Standard, Intelligent-Tiering, IA, Glacier (archive)'],
  },
  {
    category: 'Storage',
    service: 'EBS',
    tagline: 'Block storage volumes for EC2',
    description: 'Persistent hard drive attached to EC2. Like a USB drive — must be attached to an instance. Data persists when instance is stopped.',
    keyFacts: ['Tied to one AZ', 'SSD and HDD options', 'Snapshot to S3 for backup/migration'],
  },
  {
    category: 'Storage',
    service: 'EFS',
    tagline: 'Shared file storage for multiple EC2 instances',
    description: 'Network file system (NFS) that multiple EC2 instances can access simultaneously. Grows/shrinks automatically. Linux only.',
    keyFacts: ['Shared access across instances and AZs', 'Pay for storage used', 'Good for shared content, home directories, CMS'],
  },
  // Database
  {
    category: 'Database',
    service: 'RDS',
    tagline: 'Managed relational databases',
    description: 'Managed SQL databases. AWS handles backups, patching, failover. Engines: MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Aurora.',
    keyFacts: ['Multi-AZ for high availability (auto failover)', 'Read Replicas for read scaling', 'Automated backups and snapshots'],
  },
  {
    category: 'Database',
    service: 'DynamoDB',
    tagline: 'Serverless NoSQL database',
    description: 'Key-value and document NoSQL database. Single-digit millisecond performance. Fully managed, serverless. Scales to any workload automatically.',
    keyFacts: ['No servers to manage', 'Scales to millions of requests/second', 'Good for gaming, IoT, mobile apps, shopping carts'],
  },
  {
    category: 'Database',
    service: 'Aurora',
    tagline: 'AWS-built high-performance relational DB',
    description: 'MySQL and PostgreSQL compatible. 5x faster than MySQL, 3x faster than PostgreSQL. Built for the cloud. Auto-scales storage up to 128 TB.',
    keyFacts: ['Up to 15 read replicas', 'Auto-scaling storage', 'Serverless option available'],
  },
  // Networking
  {
    category: 'Networking',
    service: 'VPC',
    tagline: 'Your private network in AWS',
    description: 'Create a logically isolated network in AWS. Define subnets, routing, and security. All AWS accounts get a default VPC.',
    keyFacts: ['Public subnets = internet access via Internet Gateway', 'Private subnets = no direct internet access', 'Security Groups control traffic to instances'],
  },
  {
    category: 'Networking',
    service: 'CloudFront',
    tagline: 'Global content delivery network (CDN)',
    description: 'Caches content at 400+ edge locations worldwide. Delivers websites, APIs, and video faster to users globally. Also protects against DDoS.',
    keyFacts: ['Reduces latency by serving from nearest edge', 'Integrates with S3, ALB, EC2', 'Free tier: 1 TB data transfer out/month'],
  },
  {
    category: 'Networking',
    service: 'Route 53',
    tagline: 'Scalable DNS and domain registration',
    description: 'AWS\'s DNS service. Register domain names, route users to your application. Highly available (100% SLA). Health checks and failover.',
    keyFacts: ['Domain registration ($11+/year)', 'Routing policies: Simple, Failover, Latency, Geolocation, Weighted', '100% availability SLA'],
  },
  // Security
  {
    category: 'Security',
    service: 'IAM',
    tagline: 'Manage access to AWS services',
    description: 'Control who (authentication) can do what (authorization) in AWS. Users, groups, roles, and policies. Global service — not region-specific.',
    keyFacts: ['Free service', 'Root account = full access, should be locked away', 'Follow least privilege principle'],
  },
  {
    category: 'Security',
    service: 'Shield',
    tagline: 'DDoS protection',
    description: 'Standard (free, automatic) protects all AWS customers from common DDoS attacks. Advanced ($3k/month) adds 24/7 DRT support and cost protection.',
    keyFacts: ['Standard: free, automatic for all customers', 'Advanced: enhanced protection + response team', 'Protects EC2, ELB, CloudFront, Route 53'],
  },
  {
    category: 'Security',
    service: 'WAF',
    tagline: 'Web application firewall',
    description: 'Filter web traffic to protect against common web exploits (SQL injection, XSS). Works with CloudFront, ALB, API Gateway.',
    keyFacts: ['Block common attacks (OWASP Top 10)', 'Geographic blocking', 'Rate limiting'],
  },
  // Monitoring
  {
    category: 'Monitoring',
    service: 'CloudWatch',
    tagline: 'Monitor AWS resources and applications',
    description: 'Collect metrics, logs, and events from AWS services. Set alarms (e.g., alert when CPU > 80%). Dashboard for visibility. Automate actions.',
    keyFacts: ['Free basic monitoring (5-minute intervals)', 'Detailed monitoring = 1-minute intervals (paid)', 'Alarms can trigger Auto Scaling, SNS notifications'],
  },
  {
    category: 'Monitoring',
    service: 'CloudTrail',
    tagline: 'Audit log of all API calls in your account',
    description: 'Records every API call made in your AWS account (who, what, when, from where). Essential for security auditing and compliance. 90-day history free.',
    keyFacts: ['Enabled by default, 90-day history', 'Store logs in S3 for longer retention', '"Who did what in my account?" → CloudTrail'],
  },
  {
    category: 'Monitoring',
    service: 'Trusted Advisor',
    tagline: 'Recommendations to optimize your AWS',
    description: 'Analyzes your account and gives recommendations across 5 categories: Cost Optimization, Performance, Security, Fault Tolerance, Service Limits.',
    keyFacts: ['Basic (free): 7 core checks', 'Business/Enterprise support: all checks', 'Checks for open S3 buckets, MFA on root, underutilized EC2'],
  },
]

export const s3StorageClassesSimple = [
  { name: 'S3 Standard', access: 'Frequent', retrieval: 'Instant', cost: 'Highest storage cost', useCase: 'Websites, apps, frequently accessed data' },
  { name: 'S3 Intelligent-Tiering', access: 'Unknown/changing', retrieval: 'Instant', cost: 'Small monitoring fee', useCase: 'Data with unpredictable access patterns' },
  { name: 'S3 Standard-IA', access: 'Infrequent', retrieval: 'Instant (retrieval fee)', cost: 'Lower storage, retrieval fee', useCase: 'Backups, disaster recovery data' },
  { name: 'S3 Glacier Instant', access: 'Rare (quarterly)', retrieval: 'Milliseconds', cost: 'Low storage', useCase: 'Archive with immediate retrieval need' },
  { name: 'S3 Glacier Flexible', access: 'Archive', retrieval: '1–12 hours', cost: 'Very low storage', useCase: 'Long-term backups, compliance archives' },
  { name: 'S3 Glacier Deep Archive', access: 'Long-term archive', retrieval: '12–48 hours', cost: 'Lowest storage cost', useCase: 'Regulatory archives, 7+ year retention' },
]

export const ec2PricingSimple = [
  { type: 'On-Demand', commitment: 'None', savings: 'Baseline', description: 'Pay per hour or second. No commitment. Most flexible but most expensive. Good for short-term or unpredictable workloads.' },
  { type: 'Reserved Instances', commitment: '1 or 3 years', savings: 'Up to 72%', description: 'Commit to instance type and Region for 1 or 3 years. Best for steady, predictable workloads (databases, enterprise apps).' },
  { type: 'Savings Plans', commitment: '1 or 3 years', savings: 'Up to 66%', description: 'Commit to a dollar amount per hour, not a specific instance. More flexible than Reserved Instances.' },
  { type: 'Spot Instances', commitment: 'None', savings: 'Up to 90%', description: 'Use unused AWS capacity at steep discount. Can be interrupted with 2-minute warning. Fault-tolerant workloads only (batch jobs, ML).' },
  { type: 'Dedicated Hosts', commitment: 'On-Demand or 1/3-year', savings: 'Vary', description: 'Physical server dedicated to you. Required for certain compliance needs or bring-your-own-license software.' },
]

// ─── Well-Architected Framework ───────────────────────────────────────────────

export const wellArchPillars = [
  {
    name: 'Operational Excellence',
    num: 1,
    color: 'text-blue-400',
    description: 'Run and monitor systems to deliver business value and continually improve processes and procedures.',
    designPrinciples: ['Perform operations as code (IaC)', 'Make frequent, small, reversible changes', 'Refine operations procedures frequently', 'Anticipate failure', 'Learn from all operational failures'],
  },
  {
    name: 'Security',
    num: 2,
    color: 'text-red-400',
    description: 'Protect data, systems, and assets through risk assessments and mitigation strategies.',
    designPrinciples: ['Implement a strong identity foundation', 'Enable traceability', 'Apply security at all layers', 'Automate security best practices', 'Protect data in transit and at rest', 'Prepare for security events'],
  },
  {
    name: 'Reliability',
    num: 3,
    color: 'text-green-400',
    description: 'Ensure a workload performs its intended function correctly and consistently, recovering quickly from failures.',
    designPrinciples: ['Automatically recover from failure', 'Test recovery procedures', 'Scale horizontally to increase aggregate workload availability', 'Stop guessing capacity', 'Manage change in automation'],
  },
  {
    name: 'Performance Efficiency',
    num: 4,
    color: 'text-yellow-400',
    description: 'Use computing resources efficiently to meet requirements, and maintain efficiency as demand changes.',
    designPrinciples: ['Democratize advanced technologies', 'Go global in minutes', 'Use serverless architectures', 'Experiment more often', 'Consider mechanical sympathy'],
  },
  {
    name: 'Cost Optimization',
    num: 5,
    color: 'text-orange-400',
    description: 'Avoid unnecessary costs. Understand and control where money is being spent.',
    designPrinciples: ['Implement cloud financial management', 'Adopt a consumption model', 'Measure overall efficiency', 'Stop spending money on undifferentiated heavy lifting', 'Analyze and attribute expenditure'],
  },
  {
    name: 'Sustainability',
    num: 6,
    color: 'text-emerald-400',
    description: 'Minimize the environmental impacts of running cloud workloads.',
    designPrinciples: ['Understand your impact', 'Establish sustainability goals', 'Maximize utilization', 'Anticipate and adopt new hardware and software offerings', 'Use managed services', 'Reduce the downstream impact of your cloud workloads'],
  },
]

// ─── Billing & Pricing ────────────────────────────────────────────────────────

export const billingTools = [
  {
    tool: 'AWS Pricing Calculator',
    description: 'Estimate costs before you deploy. Build scenarios and compare service options. Free to use at calculator.aws.',
    useCase: 'Planning a new project? Use this to estimate monthly costs before committing.',
  },
  {
    tool: 'AWS Cost Explorer',
    description: 'Visualize and analyze your actual past and current AWS costs. See spending trends by service, account, or tag. Forecasts future spend.',
    useCase: '"Where is my money going?" and "How has my spending changed month-over-month?"',
  },
  {
    tool: 'AWS Budgets',
    description: 'Set custom cost or usage budgets and get alerts when you exceed (or are forecasted to exceed) thresholds. Can trigger automated actions.',
    useCase: 'Set a $100/month budget and get an email alert at 80% and 100%.',
  },
  {
    tool: 'AWS Cost and Usage Report (CUR)',
    description: 'The most detailed billing data available. Line-item level breakdown of every charge. Delivered to S3. Used for advanced analysis in Athena.',
    useCase: 'Enterprise-level cost allocation and chargeback to business units.',
  },
  {
    tool: 'AWS Compute Optimizer',
    description: 'Uses ML to analyze your EC2 usage and recommends right-sized instance types. Identifies over-provisioned (wasting money) or under-provisioned instances.',
    useCase: '"Is my EC2 instance the right size for my actual usage?"',
  },
  {
    tool: 'Savings Plans',
    description: 'Commit to a consistent amount of compute usage ($/hour) for 1 or 3 years in exchange for discounts up to 66% vs On-Demand.',
    useCase: 'You know you\'ll spend at least $10/hour on EC2/Lambda for the next year — commit for savings.',
  },
  {
    tool: 'AWS Organizations',
    description: 'Manage multiple AWS accounts centrally. Consolidated billing: all accounts on one invoice. Volume discounts apply across all accounts. Service Control Policies (SCPs) for governance.',
    useCase: 'Company with 10 AWS accounts — one bill, volume discounts, central security policies.',
  },
]

export const supportPlans = [
  {
    plan: 'Basic',
    cost: 'Free',
    responseTime: 'N/A',
    features: ['Access to documentation, whitepapers, and support forums', 'AWS Trusted Advisor (7 core checks)', 'AWS Health Dashboard', 'No technical support cases'],
  },
  {
    plan: 'Developer',
    cost: '$29/month (or 3% of monthly AWS usage)',
    responseTime: 'General guidance: < 24 business hours | System impaired: < 12 business hours',
    features: ['1 primary contact, unlimited cases', 'General architectural guidance', 'Best for development/testing environments'],
  },
  {
    plan: 'Business',
    cost: '$100/month (or 3–10% of monthly AWS usage)',
    responseTime: 'Production down: < 1 hour | Production impaired: < 4 hours',
    features: ['Unlimited contacts, unlimited cases', 'Full Trusted Advisor checks', 'Infrastructure Event Management (paid add-on)', 'AWS Support API', 'Third-party software support'],
  },
  {
    plan: 'Enterprise On-Ramp',
    cost: '$5,500/month (or 10% of monthly AWS usage)',
    responseTime: 'Business-critical down: < 30 minutes',
    features: ['Pool of Technical Account Managers (TAMs)', 'Concierge Support Team', 'Infrastructure Event Management included', 'Operations Reviews'],
  },
  {
    plan: 'Enterprise',
    cost: '$15,000/month (or 3–10% of monthly AWS usage)',
    responseTime: 'Business-critical down: < 15 minutes',
    features: ['Dedicated Technical Account Manager (TAM)', 'Concierge Support Team', 'Infrastructure Event Management included', 'Application architecture guidance', 'Training and game days'],
  },
]

// ─── Global Infrastructure ────────────────────────────────────────────────────

export const infraConcepts = [
  {
    term: 'Region',
    definition: 'A geographic area (e.g., us-east-1, eu-west-1) that contains multiple Availability Zones. Data stays within a Region unless you explicitly move it. Choose based on: latency, data compliance, service availability, pricing.',
  },
  {
    term: 'Availability Zone (AZ)',
    definition: 'One or more discrete data centers within a Region, each with independent power, cooling, and networking. Connected by low-latency links. Deploy across 2+ AZs for high availability.',
  },
  {
    term: 'Edge Location',
    definition: 'Data centers used by CloudFront CDN and Route 53. 400+ worldwide. More locations than Regions. Serve cached content to users with low latency.',
  },
  {
    term: 'Local Zone',
    definition: 'AWS infrastructure placed closer to large population centers, extending a Region. For workloads requiring single-digit millisecond latency (gaming, media, ML).',
  },
  {
    term: 'Wavelength Zone',
    definition: 'AWS infrastructure embedded within telecom networks at 5G edge. Ultra-low latency for mobile and connected devices.',
  },
  {
    term: 'AWS Outposts',
    definition: 'AWS hardware installed in your own data center. Run AWS services on-premises for latency or data residency requirements. Managed by AWS.',
  },
]

export const infraFacts = [
  { label: 'AWS Regions', value: '33+', detail: 'Geographically isolated areas globally' },
  { label: 'Availability Zones', value: '105+', detail: 'Physically separate data centers per Region' },
  { label: 'Edge Locations', value: '600+', detail: 'CloudFront and Route 53 PoPs' },
  { label: 'Local Zones', value: '30+', detail: 'Low-latency extension of Regions' },
]

// ─── Security Services Overview ────────────────────────────────────────────────

export const securityServicesSimple = [
  { service: 'IAM', category: 'Identity', description: 'Manage who can access AWS and what they can do. Users, groups, roles, policies. Global. Free.' },
  { service: 'KMS', category: 'Encryption', description: 'Create and manage encryption keys. Used to encrypt data in S3, EBS, RDS, etc. Pay per key/API call.' },
  { service: 'ACM', category: 'Encryption', description: 'Free SSL/TLS certificates for AWS services (ALB, CloudFront). Auto-renewing.' },
  { service: 'Secrets Manager', category: 'Secrets', description: 'Securely store and automatically rotate database passwords, API keys, and other secrets.' },
  { service: 'Shield Standard', category: 'DDoS', description: 'Free automatic DDoS protection for all AWS customers. Enabled by default.' },
  { service: 'Shield Advanced', category: 'DDoS', description: '$3,000/month. Enhanced protection + 24/7 DDoS Response Team (DRT) + cost protection.' },
  { service: 'WAF', category: 'App Security', description: 'Filter web traffic. Block SQL injection, XSS, bots. Works with CloudFront, ALB.' },
  { service: 'GuardDuty', category: 'Threat Detection', description: 'Intelligent threat detection using ML. Analyzes account activity for malicious behavior. Easy to enable.' },
  { service: 'Inspector', category: 'Vulnerability', description: 'Automated security scanning of EC2 and Lambda for vulnerabilities and CVEs.' },
  { service: 'Macie', category: 'Data Privacy', description: 'Uses ML to discover and protect sensitive data (PII, credentials) in S3.' },
  { service: 'CloudTrail', category: 'Auditing', description: 'Logs every API call in your account. Who did what, when, from where. Essential for compliance.' },
  { service: 'Config', category: 'Compliance', description: 'Tracks resource configurations and changes over time. Compliance rules and drift detection.' },
  { service: 'Artifact', category: 'Compliance', description: 'Self-service access to AWS compliance reports (SOC, PCI, ISO). Agreements like HIPAA BAA.' },
]
