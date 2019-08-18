const express = require('express')
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const compiler = webpack(require('../webpack.config.js'))
const argv = require('yargs').argv

const port = 4444
const app = express()

app
  .use(middleware(compiler, { serverSideRender: true }))
  .use((req, res) => {
    const webpackJson = res.locals.webpackStats.toJson()
    let paths
    if (argv.chunks) {
      paths = getJsPathsFromChunks(webpackJson, argv.chunks)
    } else {
      paths = getAllJsPaths(webpackJson)
    }
    res.send(
      `<!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Test</title>
        </head>
        <body>
          <div id="root"></div>
          ${paths.map((path) => `<script src="${path}"></script>`).join('')}
        </body>
      </html>`
    )
  })
  .listen(port, () => {
    console.log(`Server started at http://localhost:${port}/`)
  })

// Gets all the Javascript paths that Webpack has compiled, across chunks
function getAllJsPaths(webpackJson) {
  const { assetsByChunkName } = webpackJson
  return Object.values(assetsByChunkName).reduce((paths, assets) => {
    return setPaths(paths, assets)
  }, [])
}

// Optionally, just get the Javascript paths from specific chunks
function getJsPathsFromChunks(webpackJson, chunkNames) {
  const { assetsByChunkName } = webpackJson
  chunkNames = chunkNames.split(',')
  return chunkNames.reduce((paths, name) => {
    if (assetsByChunkName[name] != null) {
      const assets = assetsByChunkName[name]
      paths = setPaths(paths, assets)
    }
    return paths
  }, [])
}

// Fetch asset paths
function setPaths(paths, assets) {
  for (let asset of normalizeArray(assets)) {
    if (asset != null && asset.endsWith('.js')) {
      paths.push(asset)
    }
  }
  return paths
}

// Turns input into an array if not one already
function normalizeArray(arr) {
  return Array.isArray(arr) ? arr : [arr]
}
