#!/usr/bin/env node

const yargs = require('yargs')

yargs.usage('$0 <command> [options]')
  .command(require('./resync'))
  .command(require('./insertSubtitles'))
  .example('$0 sync -f foo.srt -o fixed.srt -t +8500', 'Resync the SRT file, moving the subs 8.5s later')
  .demandCommand(1, 1, 'Use exactly one command', 'Use exactly one command')
  .completion()
  .help('h')
  .alias('h', 'help')
  .wrap(Math.min(120, require('yargs').terminalWidth()))
  .parse()
