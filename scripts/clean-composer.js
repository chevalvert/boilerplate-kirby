const path = require('path')
const fs = require('fs-extra')
const regQuote = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const FILES = [
  'autoload_classmap',
  'autoload_files',
  'autoload_namespaces',
  'autoload_psr4',
  'autoload_static'
]

const WWW_PATH = '/www'

function fixBaseDirVar (str) {
  const reg = new RegExp('\\$baseDir = (dirname\\()*\\$vendorDir\\)*;', 'img')
  const match = str.match(reg)
  if (!match) return str

  const repeats = 1
  const newString = [
    '$baseDir = ',
    ('dirname(').repeat(repeats),
    '$vendorDir',
    (')').repeat(repeats),
    ';'
  ].join('')
  return str.replace(reg, newString)
}

function fixRelativePaths (str) {
  const url = WWW_PATH
  const backRepeats = 1
  const backs = '/' + Array(backRepeats).fill('..').join('/')
  const reg = new RegExp(regQuote(backs) + '\' ?\\. ?\'' + regQuote(url), 'img')
  const match = str.match(reg)
  if (!match) return str

  const repeats = 0
  const newString = [
    Array(repeats).fill('..').join('/'),
    '\' . \'',
    url
  ].join('')
  return str.replace(reg, newString)
}

function fixWWWPaths (str) {
  const url = WWW_PATH
  const reg = new RegExp(regQuote(url) + '\\/?', 'img')
  const match = str.match(reg)
  if (!match) return str

  const newString = '/'
  return str.replace(reg, newString)
}

;(async () => {
  try {
    const composerDir = path.join(__dirname, '..', 'www', 'vendor', 'composer')
    for (const file of FILES) {
      const fp = path.join(composerDir, file + '.php')
      const content = await fs.readFile(fp, 'utf8')
      const newContent = fixWWWPaths(fixRelativePaths(fixBaseDirVar(content)))
      if (content === newContent) continue
      await fs.writeFile(fp, newContent, 'utf8')
    }
    console.log('Fix composer autoload paths')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
