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

  if (parsedEvent.uid || parsedEvent.id) {
    // already has an ID and icalGen will blow it away for fun, so we skip
    return
  }

  const updatedCalendar = icalGen()
  updatedCalendar.createEvent(parsedEvent)

  await updatedCalendar.save(filePath)
}

function usage () {
  return `Usage: ./index.js <dirOrIcs>

Update one or more *.ics files to have a UID

dirOrIcs    path to folder (filters *.ics files) or single ICS file`
}

(async () => {
  if (!dirOrICal || dirOrICal === '-h') {
    console.error(usage())
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
