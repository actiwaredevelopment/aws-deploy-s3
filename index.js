const core = require('@actions/core')
const main = require('./src/main')

async function run() {
  try {
    const result = await main({
      region: core.getInput('region'),
      bucket: core.getInput('bucket'),
      source: core.getInput('source'),
      target: core.getInput('target'),
    })
    core.startGroup(`Computed options`)
    core.info(JSON.stringify(result.options, null, 2))
    core.endGroup()
    core.startGroup(`${result.files.items.length} files are ready`)
    core.info(JSON.stringify(result.files.resolver, null, 2))
    core.info(result.files.items.map((s) => s.Key).join('\n'))
    core.endGroup()
    core.startGroup(
      `${result.successes.length} files are uploaded successfully`
    )
    core.info(result.successes.map((s) => s.Location).join('\n'))
    core.endGroup()
    core.startGroup(`${result.fails.length} files are failed to upload`)
    core.info(result.fails.map((f) => f.Key).join('\n'))
    core.endGroup()
  } catch (error) {
    core.setFailed(error.message)
  }
}
run()
