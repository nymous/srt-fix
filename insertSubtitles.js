const fs = require('fs')
const path = require('path')
const readline = require('readline')

/**
 * Add a fixed offset to subtitles ID after a specific timestamp, to allow inserting new subtitles in between
 * @example <caption>This will add 10 to all subtitles ID after subtitle #682</caption>
 * insertSubtitles({file: 'input.srt', output: 'out.srt', offset: 10, 'start-at-id': 682})
 * @param {Object} argv - Configuration object
 * @param {string} argv.file - Input file path, SRT format
 * @param {string} argv.output - Output file path
 * @param {number} argv.offset - Offset to apply to subtitles ID
 * @param {number} [argv.start-at-id] - Start syncing after this ID. If omitted it will start at <code>1</code>
 */
function insertSubtitles (argv) {
  const file = argv.file
  const outputFile = argv.output
  const subtitleIdRegex = /^\d+$/
  const idThreshold = argv['start-at-id']
  const offset = argv.offset

  const writeStream = fs.createWriteStream(outputFile)

  readline.createInterface({
    input: fs.createReadStream(file),
    terminal: false
  }).on('line', line => {
    if (subtitleIdRegex.test(line.trimLeft()) && parseInt(line, 10) >= idThreshold) {
      const correctNumber = offset + parseInt(line, 10)
      writeStream.write(correctNumber.toString() + '\n')
    } else {
      writeStream.write(line + '\n')
    }
  })
}

module.exports = {
  command: 'insert',
  describe: 'offset subtitles ID to allow inserting new subtitles',
  builder: {
    f: {
      alias: 'file',
      demandOption: true,
      group: 'insert',
      describe: 'Input file path',
      nargs: 1,
      coerce: path.resolve,
      type: 'string'
    },
    o: {
      alias: 'output',
      demandOption: true,
      group: 'insert',
      describe: 'Output file path',
      nargs: 1,
      coerce: path.resolve,
      type: 'string'
    },
    offset: {
      demandOption: true,
      group: 'insert',
      describe: 'Offset to apply to subtitles ID',
      nargs: 1,
      type: 'number'
    },
    'start-at-id': {
      group: 'insert',
      describe: 'Start syncing after this ID',
      nargs: 1,
      type: 'number',
      default: 1
    }
  },
  handler: insertSubtitles
}
