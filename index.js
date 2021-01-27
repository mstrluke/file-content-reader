const fs = require('fs');
const path = require('path');
const LRU = require('lru-cache');

const cache = new LRU({
  max: 500,
  length: function (n, key) { return n * 2 + key.length },
  maxAge: 24 * 60 * 60,
});

const isDir = dir => fs.lstatSync(dir).isDirectory();

const collectPaths = dir => (
  fs.readdirSync(dir).reduce((arr, name) => {
    const fileDir = path.resolve(dir, name);
    isDir(fileDir) ? arr.concat(collectPaths(fileDir)) : arr.push(fileDir);
    return arr;
  }, [])
);

const collectPathsAsync = dir => {
  return fs.promises.readdir(dir).then((res) => {
    return res.reduce((arr, name) => {
      const fileDir = path.resolve(dir, name);
      isDir(fileDir) ? arr.concat(collectPaths(fileDir)) : arr.push(fileDir);
      return arr;
    }, []);
  });
};

const collectFileContent = (rootDir, exts, encoding = 'utf8') => {
  if (!Array.isArray(exts)) {
    throw new Error(`Arguments types: collectFileContent(String, Array)`);
  }

  const chacheResult = cache.get('file-content');

  if (chacheResult) return chacheResult;

  const filePaths = collectPaths(rootDir);
  const result = filePaths.reduce((obj, file) => {

    if (exts.includes(path.extname(file))) {
      const content = fs.readFileSync(file, { encoding });
      const ext = path.extname(file).slice(1);

      if (!obj[ext]) obj[ext] = [];

      obj[ext].push({
        name: file.replace(rootDir, ''),
        fullName: file,
        content,
      });
    }

    return obj;
  }, {});

  cache.set('file-content', result);
  return result;
}

const collectFileContentAsync = (rootDir, exts, encoding = 'utf8') => (
  new Promise((resolve, reject) => {
    if (!Array.isArray(exts)) {
      reject(new Error(`Arguments types: collectFileContent(String, Array)`));
    }

    const chacheResult = cache.get('file-content');

    if (chacheResult) resolve(chacheResult);

    collectPathsAsync(rootDir).then((res) => ({
      promises: Promise.all(res.map((file) => fs.promises.readFile(file, { encoding }))),
      res
    })).then(({ promises, res }) => {

      resolve(promises.then((contents) => (
        res.reduce((obj, file, i) => {
          if (exts.includes(path.extname(file))) {
            const ext = path.extname(file).slice(1);
      
            if (!obj[ext]) obj[ext] = [];
      
            obj[ext].push({
              name: file.replace(rootDir, ''),
              fullName: file,
              content: contents[i],
            });
          }
      
          return obj;
        }, {})
      )))
    });
  })
);

module.exports = {
  collectFileContent: collectFileContent,
  collectFilePaths: collectPaths,
};

module.exports.async = {
  collectFileContent: collectFileContentAsync,
  collectFilePaths: collectPathsAsync,
};

module.exports.isDirectory = isDir;
