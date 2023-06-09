# CSS Class Helper

CSS Class Helper is a VSCode extension that provides CSS class autocomplete with definition jump.

## Features

- CSS class autocomplete
- Definition jump
- Emmet completion

![Demo](https://i.gyazo.com/633d416403fd3e2e6f741c654b477de1.gif)

## Extension Settings

This extension contributes the following settings:

- `cssClassHelper.includeGlobPattern`: List of glob patterns to find css files. (default: "\*_/_.{css,scss}")
- `cssClassHelper.excludeGlobPattern`: List of glob patterns to exclude css files. (default: "{node_modules,vendor,tmp}/\*\*")
- `cssClassHelper.enableEmmetCompletion`: Enable emmet completion. (default: true)
- `cssClassHelper.langClassAttributePatterns`: List of language id and class attribute patterns. (default: see below)

  ```json
  {
    "html": ["class=[\"'][^\"']+$"],
    "haml": ["^\\s*%?(?:\\w+)?(?:\\.[\\w-_]+)+$", "class:\\s*[\"'][^\"']+$"]
  }
  ```

- `cssClassHelper.langAliases`: List of language aliases. (default: see below)

  The `langAliases` setting is used to specify aliases for language IDs. This is useful when you want to use a different language ID than the one provided by VSCode. For example, if you want to use the `vue` language ID instead of `html`, you can add the following to your settings:

  ```json
  {
    "cssClassHelper.langAliases": {
      "html": ["vue"],
      "haml": ["pug"]
    }
  }
  ```

## Commands

This extension provides the following commands:

- `cssClassHelper.reload`: Reloads the CSS class definitions.

## Supported CSS file formats

- `.css`
- `.scss`

## Known Issues

- Automatic reloading does not occur when CSS is updated.
- Class names that do not match `/[\w_-]+/` are not targeted.
