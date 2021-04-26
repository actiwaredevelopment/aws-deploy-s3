require('dotenv').config()
const main = require('../src/main')

describe('Main Flow Test', () => {
  test('full params test', async () => {
    // when
    const result = await main({
      bucket: 's3-deploy-test.oneyedev.com',
      region: 'ap-northeast-2',
      source: './test/test-folder',
      target: 'test',
    })

    // then
    expect(result.files.items).toHaveLength(2)
    expect(result.successes).toHaveLength(2)
    expect(result.fails).toHaveLength(0)
  })
})
