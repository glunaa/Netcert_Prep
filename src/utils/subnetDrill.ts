export type DrillQuestionType = 'network' | 'broadcast' | 'hosts' | 'mask' | 'first' | 'last'

export interface DrillQuestion {
  ip: string
  prefix: number
  type: DrillQuestionType
  question: string
  choices: string[]
  answerIndex: number
}

function ipToInt(ip: string): number {
  return ip.split('.').reduce((acc, oct) => ((acc << 8) | parseInt(oct)) >>> 0, 0)
}

function intToIp(n: number): string {
  return [24, 16, 8, 0].map(s => (n >>> s) & 0xff).join('.')
}

function getMaskInt(prefix: number): number {
  return prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
}

function intToMask(prefix: number): string {
  return intToIp(getMaskInt(prefix))
}

function getNetworkInt(ipInt: number, prefix: number): number {
  return (ipInt & getMaskInt(prefix)) >>> 0
}

function getBroadcastInt(ipInt: number, prefix: number): number {
  const mask = getMaskInt(prefix)
  return ((ipInt & mask) | (~mask >>> 0)) >>> 0
}

export function getUsableHosts(prefix: number): number {
  if (prefix === 32) return 1
  if (prefix === 31) return 2
  return Math.pow(2, 32 - prefix) - 2
}

function offsetIp(ipInt: number, offset: number): string {
  return intToIp(((ipInt + offset) >>> 0))
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generateQuestion(): DrillQuestion {
  const examPrefixes = [24, 25, 26, 27, 28, 29, 30, 22, 23, 20]
  const p = examPrefixes[Math.floor(Math.random() * examPrefixes.length)]
  const subnetSize = Math.pow(2, 32 - p)

  // Pick a realistic base network
  const bases: [number, number, number][] = [
    [192, 168, Math.floor(Math.random() * 20) + 1],
    [10, Math.floor(Math.random() * 50), Math.floor(Math.random() * 10)],
    [172, 16 + Math.floor(Math.random() * 16), Math.floor(Math.random() * 10)],
  ]
  const [a, b, c] = bases[Math.floor(Math.random() * bases.length)]

  // Generate network base aligned to prefix boundary
  let baseInt = ipToInt(`${a}.${b}.${c}.0`)
  // Align to subnet boundary
  baseInt = getNetworkInt(baseInt, p)

  // Pick a random host within the subnet (not network or broadcast)
  const hostOff = Math.floor(Math.random() * (subnetSize - 2)) + 1
  const ipInt = (baseInt + hostOff) >>> 0

  const ip = intToIp(ipInt)
  const netInt = getNetworkInt(ipInt, p)
  const bcastInt = getBroadcastInt(ipInt, p)
  const netIp = intToIp(netInt)
  const bcastIp = intToIp(bcastInt)
  const firstHost = intToIp((netInt + 1) >>> 0)
  const lastHost = intToIp((bcastInt - 1) >>> 0)
  const mask = intToMask(p)
  const usable = getUsableHosts(p)

  const types: DrillQuestionType[] = ['network', 'broadcast', 'hosts', 'mask', 'first', 'last']
  const type = types[Math.floor(Math.random() * types.length)]

  let question: string
  let correct: string
  let wrongs: string[]

  switch (type) {
    case 'network':
      question = `What is the network address for ${ip}/${p}?`
      correct = netIp
      wrongs = [
        offsetIp(netInt, subnetSize),
        offsetIp(netInt, subnetSize * 2),
        bcastIp,
      ]
      break
    case 'broadcast':
      question = `What is the broadcast address for ${ip}/${p}?`
      correct = bcastIp
      wrongs = [
        offsetIp(bcastInt, 1),
        netIp,
        lastHost,
      ]
      break
    case 'hosts':
      question = `How many usable host addresses are in a /${p} subnet?`
      correct = usable.toString()
      wrongs = [
        (usable + 2).toString(),
        (usable - 2 < 0 ? usable + 4 : usable - 2).toString(),
        Math.pow(2, 32 - p).toString(),
      ]
      break
    case 'mask':
      question = `What is the dotted-decimal subnet mask for /${p}?`
      correct = mask
      wrongs = [
        p > 1 ? intToMask(p - 1) : intToMask(p + 1),
        p < 32 ? intToMask(p + 1) : intToMask(p - 1),
        p < 31 ? intToMask(p + 2) : intToMask(p - 2),
      ]
      break
    case 'first':
      question = `What is the first usable host address in ${netIp}/${p}?`
      correct = firstHost
      wrongs = [netIp, offsetIp(netInt + 1, 1), offsetIp(netInt + 1, 2)]
      break
    case 'last':
      question = `What is the last usable host address in ${netIp}/${p}?`
      correct = lastHost
      wrongs = [bcastIp, offsetIp(bcastInt - 1, -1), offsetIp(bcastInt - 1, 1)]
      break
    default:
      question = `What is the network address for ${ip}/${p}?`
      correct = netIp
      wrongs = [bcastIp, firstHost, lastHost]
  }

  // Deduplicate wrongs, ensure they differ from correct
  const uniqueWrongs = wrongs.filter((w, i, a) => w !== correct && a.indexOf(w) === i).slice(0, 3)
  const allChoices = shuffle([correct, ...uniqueWrongs])
  const answerIndex = allChoices.indexOf(correct)

  return { ip, prefix: p, type, question, choices: allChoices, answerIndex }
}

export function generateQuestions(count: number): DrillQuestion[] {
  return Array.from({ length: count }, () => generateQuestion())
}
