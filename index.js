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


function getFilesContent(dir, ext) {
  const chacheResult = cache.get('file-content');

  if (chacheResult) return chacheResult;

  const filePaths = dirWalker(dir);

  const result = filePaths
    .map(function (uri, i) {
      if (path.extname(uri) === ext) {
        return {
          [uri.replace(dir, '')]: fs.readFileSync(uri, { encoding: 'utf8' })
        }
      }
    })
    .filter(Boolean)
    .filter(function (item) {
      return Object.values(item)[0]
    });
    

  cache.set('file-content', result);
  return result;
}

module.exports = getFilesContent;
