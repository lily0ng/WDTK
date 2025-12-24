import { toolProjectContext } from './tools/projectContext.js'
import { toolRegexTest } from './tools/regexTest.js'
import { toolSearchReplace } from './tools/searchReplace.js'
import { toolConvert } from './tools/convert.js'
import { toolJwt } from './tools/jwt.js'
import { toolPassword } from './tools/password.js'
import { toolEnvManager } from './tools/envManager.js'
import { toolSnippets } from './tools/snippets.js'
import { toolStaticServer } from './tools/staticServer.js'
import { toolPreferences } from './tools/preferences.js'
import { toolFsSearch } from './tools/fsSearch.js'
import { toolFileTree } from './tools/fileTree.js'
import { toolHash } from './tools/hash.js'
import { toolSchemaInfer } from './tools/schemaInfer.js'
import { toolFakeData } from './tools/fakeData.js'
import { toolContrast } from './tools/contrast.js'
import { toolSeo } from './tools/seo.js'
import { toolDockerfile } from './tools/dockerfile.js'
import { toolGithubActions } from './tools/githubActions.js'
import { toolHttpRequest } from './tools/httpRequest.js'
import { toolSupabaseTest } from './tools/supabaseTest.js'
import { toolSupabaseSyncPreferences } from './tools/supabaseSyncPreferences.js'
import { toolSupabaseSyncSnippets } from './tools/supabaseSyncSnippets.js'
import { toolPlugins } from './tools/plugins.js'
import { toolAiChat } from './tools/aiChat.js'
import { toolAiModels } from './tools/aiModels.js'
import { toolAiCodegen } from './tools/aiCodegen.js'
import { toolAiFilesWrite } from './tools/aiFilesWrite.js'
import { toolCyberCodec } from './tools/cyberCodec.js'
import { extraToolEntries } from './tools/extra/index.js'
import { toolOsInfo } from './tools/osInfo.js'
import { toolVmEval } from './tools/vmEval.js'
import { toolSecurityScan } from './tools/securityScan.js'

const tools = new Map([
  ['project.context', toolProjectContext],
  ['regex.test', toolRegexTest],
  ['searchReplace.run', toolSearchReplace],
  ['convert.run', toolConvert],
  ['jwt.debug', toolJwt],
  ['password.check', toolPassword],
  ['env.list', toolEnvManager],
  ['snippets.run', toolSnippets],
  ['server.static', toolStaticServer],
  ['preferences.getSet', toolPreferences],
  ['fs.search', toolFsSearch],
  ['fs.tree', toolFileTree],
  ['hash.compute', toolHash],
  ['schema.infer', toolSchemaInfer],
  ['fakeData.generate', toolFakeData],
  ['a11y.contrast', toolContrast],
  ['seo.generate', toolSeo],
  ['dockerfile.generate', toolDockerfile],
  ['cicd.githubActions', toolGithubActions],
  ['http.request', toolHttpRequest],
  ['supabase.test', toolSupabaseTest],
  ['supabase.syncPreferences', toolSupabaseSyncPreferences],
  ['supabase.syncSnippets', toolSupabaseSyncSnippets],
  ['plugins.manage', toolPlugins],
  ['ai.chat', toolAiChat],
  ['ai.models', toolAiModels],
  ['ai.codegen', toolAiCodegen],
  ['ai.files.write', toolAiFilesWrite],
  ['cyber.codec', toolCyberCodec],
  ['os.info', toolOsInfo],
  ['vm.eval', toolVmEval],
  ['security.scan', toolSecurityScan]
])

for (const [name, fn] of extraToolEntries) {
  tools.set(name, fn)
}

export function listTools() {
  return Array.from(tools.keys()).sort()
}

export async function runTool({ name, params, context, db, events }) {
  const fn = tools.get(name)
  if (!fn) throw new Error(`Unknown tool: ${name}`)
  return await fn({ params, context, db, events })
}
