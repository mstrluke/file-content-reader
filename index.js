var fs = require('fs');
var path = require('path');
var LRU = require('lru-cache')

var cache = new LRU({
  max: 500,
  length: function (n, key) { return n * 2 + key.length },
  dispose: function (key, n) { n.close() },
  maxAge: 24 * 60 * 60,
});

function dirWalker(dir) {
  var result = []

  fs.readdirSync(dir).forEach(function (file) {
    var fileDir = path.resolve(dir, file);

    if (fs.lstatSync(fileDir).isDirectory()) {
      result = result.concat(dirWalker(fileDir))
    } else {
      result.push(fileDir);
    }
  })

  return result
}


function getFilesContent(dir, exts) {
  if (!Array.isArray(exts)) {
    throw new Error(`Available type of 2 argument is Array, not a ${typeof exts}`)
  }

  const chacheResult = cache.get('file-content');

  if (chacheResult) return chacheResult;

  const filePaths = dirWalker(dir);
  const result = {}

  exts.forEach(function (ext) {
    result[ext.slice(1)] = []
  })

  filePaths.forEach(function (uri) {
    if (exts.includes(path.extname(uri))) {
      const content = fs.readFileSync(uri, { encoding: 'utf8' });
      if (content) {
        result[path.extname(uri).slice(1)].push({
          [uri.replace(dir, '')]: content
        })
      }
    }
  })

  cache.set('file-content', result);
  return result;
}

module.exports = getFilesContent;
