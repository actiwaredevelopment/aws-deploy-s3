require('dotenv').config()
const { S3Handler } = require('../src/aws-handler')

describe('AWS Handler Test', () => {
  const s3Handler = new S3Handler({
    region: process.env.AWS_S3_REGION,
    bucket: process.env.AWS_S3_BUCKET,
  })

  test('S3Handler can convert folder into upload params', async () => {
    // when
    const files = await s3Handler.readFilesToUploadParams({
      source: './test/test-folder/',
      target: 'test/',
    })

    // then
    expect(files.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          Bucket: process.env.AWS_S3_BUCKET,
          ContentType: 'text/plain',
          Body: expect.anything(),
          Key: 'test/sample.txt',
        }),
        expect.objectContaining({
          Bucket: process.env.AWS_S3_BUCKET,
          ContentType: 'text/html',
          Body: expect.anything(),
          Key: 'test/nested/sample.html',
        }),
      ])
    )
  })
})
