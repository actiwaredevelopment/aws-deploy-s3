const { S3Handler } = require('./aws-handler')

class DeployOptions {
  constructor() {
    this.region = 'us-east-1'
    this.bucket = ''
    this.source = './dist'
    this.target = ''
  }

  merge(other = DeployOptions.prototype) {
    this.region = other.region || this.region
    this.bucket = other.bucket || this.bucket
    this.source = other.source || this.source
    this.target = other.target || this.target
    return this
  }

  validate() {
    if (!this.source.endsWith('/')) {
      this.source += '/'
    }
    if (!this.target.endsWith('/')) {
      this.target += '/'
    }
    return this
  }
}

class DeployResult {
  constructor(options = DeployOptions.prototype) {
    this.options = options
    this.files = {
      resolver: null,
      items: [],
    }
    this.successes = []
    this.fails = []
    this.invalidation = null
  }
}

module.exports = async (options = new DeployOptions()) => {
  const merged = new DeployOptions().merge(options).validate()
  const s3Handler = new S3Handler({
    region: merged.region,
    bucket: merged.bucket,
  })
  const files = await s3Handler.readFilesToUploadParams({
    source: merged.source,
    target: merged.target,
  })
  await s3Handler.deleteAllObjects(merged.target)
  const uploaded = await s3Handler.uploadFiles(files.items)
  const result = new DeployResult()
  result.options = merged
  result.files = files
  result.successes = uploaded.filter((r) => r.Location)
  result.fails = uploaded.filter((r) => !r.Location)
  return result
}
