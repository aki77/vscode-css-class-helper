import * as vscode from 'vscode'
import { ClassNameCompletionProvider } from './ClassNameCompletionProvider'
import { ClassNameManager } from './ClassNameManager'
import { ClassNameDefinitionProvider } from './ClassNameDefinitionProvider'

export async function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('cssClassHelper')
  const includeGlobPattern = config.get<string>(
    'includeGlobPattern',
    '**/*.{css,scss}'
  )
  const excludeGlobPattern = config.get<string>(
    'excludeGlobPattern',
    '{node_modules,vendor,tmp}/**'
  )
  const enableEmmetCompletion = config.get<boolean>(
    'enableEmmetCompletion',
    true
  )
  const langClassAttributePatterns = config.get<
    Record<string, readonly string[]>
  >('langClassAttributePatterns', {})

  const classNameManager = new ClassNameManager(
    includeGlobPattern,
    excludeGlobPattern
  )

  setTimeout(() => {
    classNameManager.load()
  }, 0)

  context.subscriptions.push(
    vscode.commands.registerCommand('cssClassHelper.reload', () => {
      return classNameManager.reload()
    })
  )

  for (const [lang, stringPatterns] of Object.entries(
    langClassAttributePatterns
  )) {
    const patterns = stringPatterns.map((p) => new RegExp(p))

    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        lang,
        new ClassNameCompletionProvider(
          classNameManager,
          patterns,
          enableEmmetCompletion
        ),
        ...(enableEmmetCompletion ? ['.'] : [])
      )
    )

    context.subscriptions.push(
      vscode.languages.registerDefinitionProvider(
        lang,
        new ClassNameDefinitionProvider(classNameManager, patterns)
      )
    )
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
