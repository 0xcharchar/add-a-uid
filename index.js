#!/bin/env node
'use strict'

const icalReader = require('ical')
const icalGen = require('ical-generator')
const fs = require('fs/promises')
const path = require('path')

const dirOrICal = process.argv.slice(2)[0]

// check if argument is directory or file
// if file, load, parse, write
// if dir, load *.ics, parse, write 

async function updateCalendarFile (filePath) {
  const existingCalendar = icalReader.parseFile(filePath)

  let parsedEvent = {}
  for (let k in existingCalendar) {
    if (!existingCalendar.hasOwnProperty(k)) continue
    if (existingCalendar[k].type !== 'VEVENT') continue

    parsedEvent = { ...existingCalendar[k] }
  }

  const updatedCalendar = icalGen()
  updatedCalendar.createEvent(parsedEvent)

  await updatedCalendar.save(filePath)
}

(async () => {
  if (!dirOrICal) {
    console.error('You need to pass a single calendar file path or a folder where you have .ics files')
    process.exit(1)
  }

  const location = await fs.lstat(dirOrICal)

  if (!location.isFile() && !location.isDirectory()) {
    console.error('I cannot help you')
    process.exit(2)
  }

  if (location.isFile()) {
    await updateCalendarFile(dirOrICal)
    return
  }

  const calFiles = (await fs.readdir(dirOrICal)).filter(name => name.endsWith('.ics'))
  for (let x = 0; x < calFiles.length; x += 1) {
    await updateCalendarFile(path.resolve(dirOrICal, calFiles[x]))
  }
})();
