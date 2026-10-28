const fs = require('node:fs')
const path = require('node:path')

// Remove only this package's generated output, including obsolete migrations.
const packageRoot = path.resolve(__dirname, '..')
const output = path.join(packageRoot, 'build')
if (path.dirname(output) !== packageRoot || path.basename(output) !== 'build') throw new Error('Invalid build path')
fs.rmSync(output, { recursive: true, force: true })
