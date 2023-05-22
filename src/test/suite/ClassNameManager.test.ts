import * as assert from 'assert'

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode'
import * as path from 'path'
import { ClassNameManager } from '../../ClassNameManager'

test('Should return empty array for default', () => {
  const classNameManager = new ClassNameManager()
  assert.deepStrictEqual(classNameManager.getClassNames(), [])
})

test('Should return class names for css file', async () => {
  const classNameManager = new ClassNameManager()
  await classNameManager.processCssFile('./src/test/test.css')
  assert.deepStrictEqual(classNameManager.getClassNames(), [
    'test-class-1',
    'test-class-2',
    'test-class-3',
    'test-class-4',
  ])
})

test('Should return class names for scss file', async () => {
  const classNameManager = new ClassNameManager()
  await classNameManager.processCssFile('./src/test/test.scss')
  assert.deepStrictEqual(classNameManager.getClassNames(), [
    'test-class-1',
    'test-class-2',
    'test-class-2__is-active',
    'test-class-3',
    'test-class-4',
  ])
})

test('Should return locations for class name', async () => {
  const classNameManager = new ClassNameManager()
  await classNameManager.processCssFile('./src/test/test.css')
  assert.deepStrictEqual(classNameManager.getClassLocations('test-class-4'), [
    new vscode.Location(
      vscode.Uri.file(path.resolve(__dirname, '../../../src/test/test.css')),
      new vscode.Position(10, 0)
    ),
  ])
})
