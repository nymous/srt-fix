#!/usr/bin/env node

const fs = require('fs')
const readline = require('readline')

const file = './SRT.srt'
const outputFile = './fix.srt'
const re = /^[0-9]+$/
const numberThreshold = 682
const increment = 10

const ws = fs.createWriteStream(outputFile)

readline.createInterface({
	input: fs.createReadStream(file),
	termninal: false
}).on('line', line => {
	if(line.match(re) && parseInt(line, 10) > numberThreshold) {
		const correctNumber = increment + parseInt(line, 10)
		ws.write(correctNumber.toString() + '\n')
	} else {
		ws.write(line + '\n')
	}
})
