import * as vscode from 'vscode'
import type { ClassNameManager } from './ClassNameManager'

const EMMET_REGEX = /^\s*(?:[\w-]+)(\.[\w-_]+)+/

export class ClassNameCompletionProvider
  implements vscode.CompletionItemProvider
{
  constructor(
    private classNameManager: ClassNameManager,
    private patterns: readonly RegExp[],
    private enableEmmetCompletion: boolean
  ) {}

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    const lineText = document.getText(
      new vscode.Range(position.with({ character: 0 }), position)
    )

    if (
      !this.patterns.some((regex) => regex.test(lineText)) &&
      (!this.enableEmmetCompletion || !EMMET_REGEX.test(lineText))
    ) {
      return
    }

    return this.classNameManager.getClassNames().map((className) => {
      const item = new vscode.CompletionItem(
        className,
        vscode.CompletionItemKind.Class
      )
      const locations = this.classNameManager.getClassLocations(className)

      item.documentation = new vscode.MarkdownString(
        locations
          .map((location) => {
            const relativePath = vscode.workspace.asRelativePath(location.uri)
            return `- [${relativePath}:${location.range.start.line + 1}](${
              location.uri
            })`
          })
          .join('\n')
      )
      return item
    })
  }
}
