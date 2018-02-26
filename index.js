#!/usr/bin/env node

const fs = require('fs')
const Subtitle = require('subtitle')

const argv = require('yargs')
  .usage('$0 <command> [options]')
  .command('sync', 'resync a given SRT file')
  .example('$0 sync -f foo.srt -o fixed.srt -t +8500', 'Resync the SRT file, moving the subs 8.5s later')
  .option('f', {
    alias: 'file',
    demandOption: true,
    group: 'General',
    describe: 'Load a file',
    nargs: 1,
    type: 'string'
  })
  .option('o', {
    alias: 'output',
    demandOption: true,
    group: 'General',
    describe: 'Output to file',
    nargs: 1,
    type: 'string'
  })
  .option('d', {
    alias: 'delay',
    describe: 'Move subs by X miliseconds forward (+) or backward (-)',
    group: 'Sync',
    demandOption: true,
    nargs: 1,
    type: 'number'
  })
  .option('s', {
    alias: 'start-at',
    group: 'Sync',
    describe: 'Start syncing at this timestamp (format: 01:37:47,512)',
    nargs: 1,
    type: 'string',
    default: '00:00:00,000'
  })
  .demandCommand(1, 1, 'Use exactly one command', 'Use exactly one command')
  .completion()
  .help('h')
  .alias('h', 'help')
  .wrap(Math.min(120, require('yargs').terminalWidth()))
  .argv

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
