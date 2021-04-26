const AWS = require('aws-sdk')
const fs = require('fs')
const mime = require('mime')
const FileResolver = require('./lib/file-resolver')

class UploadParam {
  constructor({ Bucket, Key, Body, ContentType }) {
    this.Bucket = Bucket
    this.Key = Key
    this.Body = Body
    this.ContentType = ContentType
  }
}

module.exports.S3Handler = class {
  constructor({ region, bucket }) {
    this.s3 = new AWS.S3({ region })
    this.lambda = new AWS.Lambda({ apiVersion: '2015-03-31', region })
    this.cloudfront = new AWS.CloudFront({ region })
    this.bucket = bucket
  }

  listAllObjects(folder) {
    return new Promise((resolve, reject) => {
      this.s3.listObjects(
        { Bucket: this.bucket, Prefix: folder },
        function (err, data) {
          if (err) {
            reject(err)
          } else {
            resolve(data.Contents || [])
          }
        }
      )
    })
  }

  deleteAllObjects(folder) {
    return new Promise((resolve, reject) => {
      this.listAllObjects(folder)
        .then((objects) => {
          if (objects.length === 0) {
            resolve()
          } else {
            const deleteParams = {
              Bucket: this.bucket,
              Delete: { Objects: objects.map((e) => ({ Key: e.Key })) },
            }
            this.s3.deleteObjects(deleteParams, function (err, data) {
              if (err) reject(err)
              else resolve(data)
            })
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  async readFilesToUploadParams({ source = './', target }) {
    const resolver = new FileResolver(source)
    const fileNames = await resolver.getFileNames()
    return {
      resolver,
      items: await Promise.all(
        fileNames.map((fileName) =>
          this.readFileToUploadParam({ source, target, fileName })
        )
      ),
    }
  }

  readFileToUploadParam({ source, target, fileName }) {
    return new Promise((resolve, reject) => {
      fs.readFile(source + fileName, (err, file) => {
        if (err) reject(err)
        else {
          resolve(
            new UploadParam({
              Bucket: this.bucket,
              Key: target + fileName,
              Body: file,
              ContentType: mime.getType(fileName),
            })
          )
        }
      })
    })
  }

  uploadFiles(uploadParams = []) {
    return Promise.all(uploadParams.map((param) => this.uploadFile(param)))
  }

  uploadFile(uploadParam = UploadParam.prototype) {
    return new Promise((resolve) => {
      this.s3.upload(uploadParam, (err, data) => {
        if (err) {
          resolve(uploadParam)
        } else {
          resolve(data)
        }
      })
    })
  }
}
