const FileResolver = require('../../src/lib/file-resolver')
describe('File Resolver Test', () => {
  test('should a read relative folder from projtect root folder', async () => {
    // given
    const resolver = new FileResolver('./test/test-folder')

    // when
    const fileNames = await resolver.getFileNames()

    // then
    expect(resolver.source).toBe('./test/test-folder')
    expect(resolver.path.endsWith('/test/test-folder')).toBeTruthy()
    expect(fileNames).toContain('sample.txt')
    expect(fileNames).toContain('nested/sample.html')
  })
})
