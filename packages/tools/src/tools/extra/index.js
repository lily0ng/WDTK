import { toolTimeNow } from './timeNow.js'
import { toolUuidV4 } from './uuidV4.js'
import { toolJsonPretty } from './jsonPretty.js'
import { toolJsonMinify } from './jsonMinify.js'
import { toolTextCount } from './textCount.js'
import { toolTextSlugify } from './textSlugify.js'
import { toolTextUpper } from './textUpper.js'
import { toolTextLower } from './textLower.js'
import { toolTextTitle } from './textTitle.js'
import { toolTextReverse } from './textReverse.js'
import { toolRandomInt } from './randomInt.js'
import { toolRandomPick } from './randomPick.js'
import { toolUrlParse } from './urlParse.js'
import { toolRegexEscape } from './regexEscape.js'
import { toolPathJoin } from './pathJoin.js'
import { toolFsExists } from './fsExists.js'
import { toolFsReadText } from './fsReadText.js'
import { toolEnvGet } from './envGet.js'
import { toolMathMean } from './mathMean.js'
import { toolMathMedian } from './mathMedian.js'
import { toolColorInvert } from './colorInvert.js'
import { toolHashText } from './hashText.js'
import { toolBase64Encode } from './base64Encode.js'
import { toolBase64Decode } from './base64Decode.js'
import { toolHexEncode } from './hexEncode.js'
import { toolHexDecode } from './hexDecode.js'
import { toolUrlEncode } from './urlEncode.js'
import { toolUrlDecode } from './urlDecode.js'
import { toolHtmlEncode } from './htmlEncode.js'
import { toolHtmlDecode } from './htmlDecode.js'

export const extraToolEntries = [
  ['util.time.now', toolTimeNow],
  ['util.uuid.v4', toolUuidV4],
  ['util.json.pretty', toolJsonPretty],
  ['util.json.minify', toolJsonMinify],
  ['util.text.count', toolTextCount],
  ['util.text.slugify', toolTextSlugify],
  ['util.text.upper', toolTextUpper],
  ['util.text.lower', toolTextLower],
  ['util.text.title', toolTextTitle],
  ['util.text.reverse', toolTextReverse],
  ['util.random.int', toolRandomInt],
  ['util.random.pick', toolRandomPick],
  ['util.url.parse', toolUrlParse],
  ['util.regex.escape', toolRegexEscape],
  ['util.path.join', toolPathJoin],
  ['util.fs.exists', toolFsExists],
  ['util.fs.readText', toolFsReadText],
  ['util.env.get', toolEnvGet],
  ['util.math.mean', toolMathMean],
  ['util.math.median', toolMathMedian],
  ['util.color.invert', toolColorInvert],
  ['util.hash.text', toolHashText],
  ['util.base64.encode', toolBase64Encode],
  ['util.base64.decode', toolBase64Decode],
  ['util.hex.encode', toolHexEncode],
  ['util.hex.decode', toolHexDecode],
  ['util.url.encode', toolUrlEncode],
  ['util.url.decode', toolUrlDecode],
  ['util.html.encode', toolHtmlEncode],
  ['util.html.decode', toolHtmlDecode]
]
