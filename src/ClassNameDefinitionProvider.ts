import * as vscode from 'vscode'
import type { ClassNameManager } from './ClassNameManager'

export class ClassNameDefinitionProvider implements vscode.DefinitionProvider {
  constructor(private classNameManager: ClassNameManager) {}

  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.LocationLink[]> {
    const lineText = document.lineAt(position.line).text

    const classNameReference = lineText.match(/class="[^"]+"/)
    const range = document.getWordRangeAtPosition(position, /[\w_-]+/)
    if (!classNameReference || !range) {
      return
    }

    const className = document.getText(range)
    const locations = this.classNameManager.getClassLocations(className)
    return locations.map((location) => ({
      originSelectionRange: range,
      targetUri: location.uri,
      targetRange: location.range,
    }))
  }
}
