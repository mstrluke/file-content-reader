## File content reader

This package can read any type of files and make object of KV, where Key is equal path and Value is file content.
Additional feature is insert critical css to the html in SSR react, [here](https://github.com/mstrluke/simple-ssr.git) is example repository.

Example:

```js
  const { collectFileContent } = require('file-content-reader');
  const filesContent = collectFileContent(path.resolve(process.cwd() + '/src'), ['.css', '.js', '.md'], 'utf8');
  // Output
  {
    css: [
      { 
        name: "/app.css",
        fullName: "/Users/user/projects/simple-ssr/src/app.css",
        content:  "./src/styles.css": "body {\n  margin: 0;\n  padding: 28px 16px;\n}"
      }
    ],
    js: [
      { 
        name: "./src/index.js",
        fullName: "/Users/user/projects/simple-ssr/src/index.js",
        content: "
          import React from 'react';\n" +
          "import './component.css';\n" +
          '\n' +
          'export default () => (\n' +
          '  <div>\n' +
          '   Hello world !!!\n' +
          '  </div>\n' +
          ');\n"
      }
    ],
    md: [
      { 
        name: "/README.md",
        fullName: "/Users/user/projects/simple-ssr/src/README.md",
        content: "
          '## File content reader\n' +
          '\n' +
          'This package can read any type of files and make object of KV\n' +
          '```\n"
      }
    ]
  ]
```

### Supported features

- Any type of files
- Lru cache
