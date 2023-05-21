import * as vscode from 'vscode'
import type { ClassNameManager } from './ClassNameManager'

const CLASS_NAME_REGEX = /[\w_-]+/

export class ClassNameDefinitionProvider implements vscode.DefinitionProvider {
  constructor(
    private classNameManager: ClassNameManager,
    private patterns: readonly RegExp[]
  ) {}

  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.ProviderResult<vscode.LocationLink[]> {
    const lineText = document.getText(
      new vscode.Range(position.with({ character: 0 }), position)
    )

    const range = document.getWordRangeAtPosition(position, CLASS_NAME_REGEX)
    if (!range || !this.patterns.some((regex) => regex.test(lineText))) {
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
