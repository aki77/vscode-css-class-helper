import * as vscode from 'vscode'
import * as fs from 'fs'
import postcss from 'postcss'
import * as postcssScss from 'postcss-scss'
import * as postcssNested from 'postcss-nested'
import * as createSelectorParser from 'postcss-selector-parser'

type FileLocation = `${string}:${number}`

export class ClassNameManager {
  private classNameLocations: Map<string, Set<FileLocation>>

  constructor() {
    this.classNameLocations = new Map()
  }

  public getClassNames(): string[] {
    return [...this.classNameLocations.keys()]
  }

  public getClassLocations(className: string): vscode.Location[] {
    const fileLocations = this.classNameLocations.get(className) ?? []
    return [...fileLocations.values()].map((fileLocation) => {
      const [filePath, line] = fileLocation.split(':')
      return new vscode.Location(
        vscode.Uri.file(filePath),
        new vscode.Position(parseInt(line, 10), 0)
      )
    })
  }

  public async processCssFile(cssFilePath: string): Promise<void> {
    // Read the CSS file and extract class names
    const css = await fs.promises.readFile(cssFilePath, 'utf8')

    postcss([postcssNested()])
      .process(css, { from: cssFilePath, syntax: postcssScss })
      .then((result) => {
        result.root?.walkRules((rule) => {
          rule.selectors.forEach((selector) => {
            const ast = createSelectorParser().astSync(selector)
            ast.walkClasses((node) => {
              const location: FileLocation | undefined = rule.source?.start
                ? `${rule.source.input.file}:${rule.source.start.line - 1}`
                : undefined

              this.addClassLocation(node.value, location)
            })
          })
        })
      })
  }

  private addClassLocation(
    className: string,
    location: FileLocation | undefined
  ): void {
    if (!this.classNameLocations.has(className)) {
      this.classNameLocations.set(className, new Set())
    }

    if (location) {
      this.classNameLocations.get(className)?.add(location)
    }
  }
}
