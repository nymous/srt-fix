#!/usr/bin/env node

const fs = require('fs')
const readline = require('readline')
const Subtitle = require('subtitle')

const file = './SRT.srt'
const outputFile = './fix.srt'
const re = /^[0-9]+$/
const numberThreshold = 682
const increment = 10

const ws = fs.createWriteStream(outputFile)

const subFileContent = fs.readFileSync(file, 'utf8')

const subtitles = Subtitle.parse(subFileContent)
const correctSubs = subtitles.filter(s => s.start <= Subtitle.toMS('00:01:35,443'))
const subsToFix = subtitles.filter(s => s.start > Subtitle.toMS('00:01:35,443'))
const newSubs = Subtitle.resync(subsToFix, 3500)

ws.write(Subtitle.stringify([...correctSubs, ...newSubs]))
