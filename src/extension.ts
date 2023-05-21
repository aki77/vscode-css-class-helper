import * as vscode from 'vscode'
import { ClassNameCompletionProvider } from './ClassNameCompletionProvider'
import { ClassNameManager } from './ClassNameManager'
import { ClassNameDefinitionProvider } from './ClassNameDefinitionProvider'

export async function activate(context: vscode.ExtensionContext) {
  const classNameManager = new ClassNameManager()

  const config = vscode.workspace.getConfiguration('myExtension')
  const includeGlobPattern = config.get<string>(
    'cssClassHelper.includeGlobPattern',
    '**/*.{css,scss}'
  )
  const excludeGlobPattern = config.get<string>(
    'cssClassHelper.excludeGlobPattern',
    '{node_modules,vendor}/**'
  )
  const cssFiles = await vscode.workspace.findFiles(
    includeGlobPattern,
    excludeGlobPattern
  )
  console.log('Found cssFiles', cssFiles)
  for (const cssFile of cssFiles) {
    classNameManager.processCssFile(cssFile.fsPath)
  }

  const completionProvider = new ClassNameCompletionProvider(classNameManager)
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('html', completionProvider)
  )

  const definitionProvider = new ClassNameDefinitionProvider(classNameManager)
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider('html', definitionProvider)
  )
}

// This method is called when your extension is deactivated
export function deactivate() {}
