import zlib from 'node:zlib'
import { domainToASCII, domainToUnicode } from 'node:url'

function asString(v) {
  return v == null ? '' : String(v)
}

function rot13(s) {
  return String(s).replace(/[a-zA-Z]/g, (c) => {
    const base = c <= 'Z' ? 65 : 97
    const code = c.charCodeAt(0) - base
    return String.fromCharCode(((code + 13) % 26) + base)
  })
}

function caesarShift(s, shift) {
  const n = Number(shift) || 0
  return String(s).replace(/[a-zA-Z]/g, (c) => {
    const base = c <= 'Z' ? 65 : 97
    const code = c.charCodeAt(0) - base
    const moved = ((code + n) % 26 + 26) % 26
    return String.fromCharCode(moved + base)
  })
}

function xorBytes(buf, key) {
  const k = Buffer.from(String(key || ''), 'utf8')
  if (k.length === 0) return null
  const out = Buffer.allocUnsafe(buf.length)
  for (let i = 0; i < buf.length; i++) out[i] = buf[i] ^ k[i % k.length]
  return out
}

const MORSE = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.'
}

const MORSE_REV = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]))

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

function base32Encode(buf) {
  let bits = 0
  let value = 0
  let out = ''
  for (const b of buf) {
    value = (value << 8) | b
    bits += 8
    while (bits >= 5) {
      out += BASE32_ALPHABET[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) out += BASE32_ALPHABET[(value << (5 - bits)) & 31]
  return out
}

function base32Decode(s) {
  const input = String(s || '').toUpperCase().replace(/=+$/g, '').replace(/\s+/g, '')
  let bits = 0
  let value = 0
  const out = []

  for (const ch of input) {
    const idx = BASE32_ALPHABET.indexOf(ch)
    if (idx < 0) throw new Error('Invalid base32 character')
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }

  return Buffer.from(out)
}

function makeBaseX(alphabet) {
  const base = alphabet.length
  const map = Object.create(null)
  for (let i = 0; i < alphabet.length; i++) map[alphabet[i]] = i

  function encode(buf) {
    if (!buf || buf.length === 0) return ''

    let zeros = 0
    while (zeros < buf.length && buf[zeros] === 0) zeros++

    const digits = [0]
    for (let i = zeros; i < buf.length; i++) {
      let carry = buf[i]
      for (let j = 0; j < digits.length; j++) {
        carry += digits[j] << 8
        digits[j] = carry % base
        carry = Math.floor(carry / base)
      }
      while (carry > 0) {
        digits.push(carry % base)
        carry = Math.floor(carry / base)
      }
    }

    let out = alphabet[0].repeat(zeros)
    for (let i = digits.length - 1; i >= 0; i--) out += alphabet[digits[i]]
    return out
  }

  function decode(str) {
    const s = String(str || '')
    if (!s) return Buffer.alloc(0)

    let zeros = 0
    while (zeros < s.length && s[zeros] === alphabet[0]) zeros++

    const bytes = [0]
    for (let i = zeros; i < s.length; i++) {
      const val = map[s[i]]
      if (val == null) throw new Error('Invalid base-x character')

      let carry = val
      for (let j = 0; j < bytes.length; j++) {
        carry += bytes[j] * base
        bytes[j] = carry & 0xff
        carry >>= 8
      }
      while (carry > 0) {
        bytes.push(carry & 0xff)
        carry >>= 8
      }
    }

    const out = Buffer.alloc(zeros + bytes.length)
    out.fill(0, 0, zeros)
    for (let i = 0; i < bytes.length; i++) out[out.length - 1 - i] = bytes[i]
    return out
  }

  return { encode, decode }
}

const BASE58 = makeBaseX('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz')

function htmlEncode(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function htmlDecode(s) {
  const str = String(s)
  return str
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
}

function unicodeEscapeEncode(s) {
  let out = ''
  for (const ch of String(s)) {
    const code = ch.charCodeAt(0)
    out += `\\u${code.toString(16).padStart(4, '0')}`
  }
  return out
}

function unicodeEscapeDecode(s) {
  return String(s).replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
}

function binaryEncode(s) {
  const buf = Buffer.from(String(s), 'utf8')
  if (buf.length === 0) return ''
  const pairs = buf.toString('hex').match(/../g) || []
  return pairs.map((h) => parseInt(h, 16).toString(2).padStart(8, '0')).join(' ')
}

function binaryDecode(s) {
  const trimmed = String(s).trim()
  if (!trimmed) return ''
  const parts = trimmed.split(/\s+/).filter(Boolean)
  const bytes = parts.map((p) => {
    if (!/^[01]{8}$/.test(p)) throw new Error('Binary input must be 8-bit groups')
    return parseInt(p, 2)
  })
  return Buffer.from(bytes).toString('utf8')
}

function asciiEncode(s) {
  return Array.from(Buffer.from(String(s), 'utf8')).join(' ')
}

function asciiDecode(s) {
  const parts = String(s).trim().split(/\s+/).filter(Boolean)
  const bytes = parts.map((p) => {
    const n = Number(p)
    if (!Number.isFinite(n) || n < 0 || n > 255) throw new Error('ASCII bytes must be 0..255')
    return n
  })
  return Buffer.from(bytes).toString('utf8')
}

function morseEncode(s) {
  const words = String(s).toUpperCase().split(/\s+/)
  return words
    .map((w) =>
      w
        .split('')
        .map((ch) => MORSE[ch] || '?')
        .join(' ')
    )
    .join(' / ')
}

function morseDecode(s) {
  return String(s)
    .split(' / ')
    .map((w) =>
      w
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((tok) => MORSE_REV[tok] || '?')
        .join('')
    )
    .join(' ')
}

const CODECS = [
  { id: 'base64', label: 'Base64' },
  { id: 'hex', label: 'Hex' },
  { id: 'base32', label: 'Base32 (RFC4648, no padding)' },
  { id: 'base58', label: 'Base58 (Bitcoin alphabet)' },
  { id: 'url', label: 'URL percent encoding' },
  { id: 'html', label: 'HTML entities' },
  { id: 'unicode_escape', label: 'Unicode \\uXXXX escape' },
  { id: 'binary', label: 'Binary (8-bit groups)' },
  { id: 'ascii', label: 'ASCII bytes (0-255)' },
  { id: 'rot13', label: 'ROT13' },
  { id: 'caesar', label: 'Caesar shift (option: shift)' },
  { id: 'xor_base64', label: 'XOR then Base64 (option: key)' },
  { id: 'gzip_base64', label: 'Gzip then Base64' },
  { id: 'punycode', label: 'Punycode domain (IDNA)' },
  { id: 'morse', label: 'Morse code' }
]

function runCodec({ codec, action, input, options }) {
  const c = String(codec || '')
  const a = String(action || 'encode')
  const s = asString(input)
  const opt = options && typeof options === 'object' ? options : {}

  if (c === 'base64') {
    if (a === 'encode') return Buffer.from(s, 'utf8').toString('base64')
    return Buffer.from(s, 'base64').toString('utf8')
  }

  if (c === 'hex') {
    if (a === 'encode') return Buffer.from(s, 'utf8').toString('hex')
    return Buffer.from(s, 'hex').toString('utf8')
  }

  if (c === 'base32') {
    if (a === 'encode') return base32Encode(Buffer.from(s, 'utf8'))
    return base32Decode(s).toString('utf8')
  }

  if (c === 'base58') {
    if (a === 'encode') return BASE58.encode(Buffer.from(s, 'utf8'))
    return BASE58.decode(s).toString('utf8')
  }

  if (c === 'url') {
    if (a === 'encode') return encodeURIComponent(s)
    return decodeURIComponent(s)
  }

  if (c === 'html') {
    if (a === 'encode') return htmlEncode(s)
    return htmlDecode(s)
  }

  if (c === 'unicode_escape') {
    if (a === 'encode') return unicodeEscapeEncode(s)
    return unicodeEscapeDecode(s)
  }

  if (c === 'binary') {
    if (a === 'encode') return binaryEncode(s)
    return binaryDecode(s)
  }

  if (c === 'ascii') {
    if (a === 'encode') return asciiEncode(s)
    return asciiDecode(s)
  }

  if (c === 'rot13') {
    return rot13(s)
  }

  if (c === 'caesar') {
    const shift = Number(opt.shift ?? 13)
    return a === 'encode' ? caesarShift(s, shift) : caesarShift(s, -shift)
  }

  if (c === 'xor_base64') {
    const key = asString(opt.key)
    if (!key) throw new Error('Missing options.key')
    if (a === 'encode') {
      const out = xorBytes(Buffer.from(s, 'utf8'), key)
      if (!out) throw new Error('Missing options.key')
      return out.toString('base64')
    }
    const buf = Buffer.from(s, 'base64')
    const out = xorBytes(buf, key)
    if (!out) throw new Error('Missing options.key')
    return out.toString('utf8')
  }

  if (c === 'gzip_base64') {
    if (a === 'encode') return zlib.gzipSync(Buffer.from(s, 'utf8')).toString('base64')
    return zlib.gunzipSync(Buffer.from(s, 'base64')).toString('utf8')
  }

  if (c === 'punycode') {
    if (a === 'encode') return domainToASCII(s)
    return domainToUnicode(s)
  }

  if (c === 'morse') {
    if (a === 'encode') return morseEncode(s)
    return morseDecode(s)
  }

  throw new Error('Unsupported codec')
}

export async function toolCyberCodec({ params }) {
  const action = String(params?.action || 'encode')

  if (action === 'list') {
    return { ok: true, codecs: CODECS, actions: ['encode', 'decode'] }
  }

  const codec = String(params?.codec || '')
  if (!codec) return { ok: false, error: 'Missing codec' }
  if (action !== 'encode' && action !== 'decode') return { ok: false, error: 'Unsupported action' }

  const input = asString(params?.input)
  const options = params?.options && typeof params.options === 'object' ? params.options : {}

  try {
    const output = runCodec({ codec, action, input, options })
    return {
      ok: true,
      action,
      codec,
      options,
      inputBytes: Buffer.byteLength(input, 'utf8'),
      outputBytes: Buffer.byteLength(String(output), 'utf8'),
      output
    }
  } catch (e) {
    return { ok: false, error: e?.message || String(e), action, codec }
  }
}
