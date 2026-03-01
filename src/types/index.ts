export type ExamType = 'netplus' | 'aws'
export interface Question {
  id: number; q: string; options: [string, string, string, string]; answer: 0 | 1 | 2 | 3; explanation: string; domain: string
}
export interface SubnetInput { id: string; hosts: number; label: string }
export interface SubnetResult { label: string; hosts_requested: number; subnet: string; mask: string; first_host: string; last_host: string; broadcast: string; usable_hosts: number; prefix: number }
export interface TestResult { questionId: number; question: string; correct: boolean; yourAnswer: string; correctAnswer: string; explanation: string; domain: string }
export interface OsiLayer { number: number; name: string; protocols: string[]; function: string; pdu: string; devices: string[] }
export interface PortEntry { port: string; protocol: 'TCP' | 'UDP' | 'TCP/UDP'; service: string; description: string }