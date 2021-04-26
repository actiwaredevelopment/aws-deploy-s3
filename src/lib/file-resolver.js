const glob = require('@actions/glob')
const nodePath = require('path')

module.exports = class FileResolver {
  constructor(source = './') {
    this.path = nodePath.resolve(process.cwd(), source)
    this.source = source
  }

  async getFileNames() {
    const pattern = `${this.source}/**/*.*`
    const option = { followSymbolicLinks: false }
    const globber = await glob.create(pattern, option)
    const files = await globber.glob()
    return files.map((name) => name.replace(this.path + '/', ''))
  }
}
