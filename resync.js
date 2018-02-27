const fs = require('fs')
const Subtitle = require('subtitle')

/**
 * Sync an SRT file by delaying subtitles by a given amount
 * @example <caption>This moves subtitles 3.5s sooner after 12 minutes 17 seconds in the movie</caption>
 * resync({file: 'input.srt', output: 'out.srt', delay: -3500, 'start-at': '00:12:17,000'})
 * @param {Object} argv - Configuration object
 * @param {string} argv.file - Input file path, SRT format
 * @param {string} argv.output - Output file path
 * @param {number} argv.delay - Delay to apply to subtitles in milliseconds, positive number to make subtitles appear later
 * @param {string} [argv.start-at] - Start syncing after this timestamp; format: <code>01:27:36,624</code> If omitted it will start at <code>00:00:00,000</code>
 */
function resync (argv) {
  const inputFile = argv.file
  const outputFile = argv.output
  const syncDelay = argv.delay
  const startSyncTime = Subtitle.toMS(argv['start-at'])

  const subFileContent = fs.readFileSync(inputFile, 'utf8')
  const writeStream = fs.createWriteStream(outputFile)

  const allSubtitles = Subtitle.parse(subFileContent)
  const correctSubs = allSubtitles.filter(s => s.start <= startSyncTime)
  const subsToFix = allSubtitles.filter(s => s.start > startSyncTime)
  const newSubs = Subtitle.resync(subsToFix, syncDelay)

  writeStream.write(Subtitle.stringify([...correctSubs, ...newSubs]))
}

module.exports = {
  command: 'resync',
  describe: 'resync a given SRT file',
  builder: {
    f: {
      alias: 'file',
      demandOption: true,
      group: 'resync',
      describe: 'Input file path',
      nargs: 1,
      type: 'string'
    },
    o: {
      alias: 'output',
      demandOption: true,
      group: 'resync',
      describe: 'Output file path',
      nargs: 1,
      type: 'string'
    },
    d: {
      alias: 'delay',
      demandOption: true,
      group: 'resync',
      describe: 'Move subs by X miliseconds forward (+) or backward (-)',
      nargs: 1,
      type: 'number'
    },
    s: {
      alias: 'start-at',
      group: 'resync',
      describe: 'Start syncing at this timestamp (format: 01:37:47,512)',
      nargs: 1,
      type: 'string',
      default: '00:00:00,000'
    }
  },
  handler: resync
}
