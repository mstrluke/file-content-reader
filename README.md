## File content reader

This package can read any type of files and make object of KV, where Key is equal path and Value is file content.
Additional feature is insert critical css to the html in SSR react, [here](https://github.com/mstrluke/simple-ssr.git) is example repository.
Example:

```js
  [
    { "./src/styles.css": "body {\n  margin: 0;\n  padding: 28px 16px;\n}" }
    { "./src/index.js": "
      import React from 'react';\n" +
      "import './component.css';\n" +
      '\n' +
      'export default () => (\n' +
      '  <div>\n' +
      '   Hello world !!!\n' +
      '  </div>\n' +
      ');\n'
    },
    { './README.md': 
      '## File content reader\n' +
      '\n' +
      'This package can read any type of files and make object of KV\n' +
      '```\n'
    }
  ]
```

### Supported features

- Any type of files
- Lru cache