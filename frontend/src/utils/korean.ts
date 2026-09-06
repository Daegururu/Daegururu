const HANGUL_START = 0xac00
const HANGUL_END = 0xd7a3
/** 한글 음절은 초성 19 × 중성 21 × 종성 28 조합으로 이루어집니다. */
const JONGSEONG_COUNT = 28

/** 받침 유무에 따라 형태가 갈리는 조사 쌍입니다. */
const PARTICLE_PAIRS = {
  '을/를': ['을', '를'],
  '이/가': ['이', '가'],
  '은/는': ['은', '는'],
  '과/와': ['과', '와'],
  '으로/로': ['으로', '로'],
} as const

export type ParticlePair = keyof typeof PARTICLE_PAIRS

/**
 * 마지막 글자에 받침이 있는지 확인합니다.
 * 한글이 아닌 글자로 끝나면 판별할 수 없으므로 null을 반환합니다.
 */
function hasFinalConsonant(word: string): boolean | null {
  const lastChar = word.trim().at(-1)
  if (!lastChar) return null

  const code = lastChar.charCodeAt(0)
  if (code < HANGUL_START || code > HANGUL_END) return null

  return (code - HANGUL_START) % JONGSEONG_COUNT !== 0
}

/**
 * 단어 뒤에 알맞은 조사를 붙입니다.
 *
 * - `appendParticle('개업일', '을/를')` → `'개업일을'`
 * - `appendParticle('주소', '을/를')` → `'주소를'`
 *
 * 받침을 판별할 수 없으면(영문·숫자로 끝나는 경우) 조사 쌍을 그대로 붙입니다.
 * 예: `appendParticle('PDF', '을/를')` → `'PDF을(를)'`
 */
export function appendParticle(word: string, pair: ParticlePair): string {
  const [withFinal, withoutFinal] = PARTICLE_PAIRS[pair]
  const final = hasFinalConsonant(word)

  if (final === null) return `${word}${withFinal}(${withoutFinal})`
  return `${word}${final ? withFinal : withoutFinal}`
}
