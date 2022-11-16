#!/usr/bin/env bun

import pkg from 'circular-natal-horoscope-js'
const { Origin, Horoscope } = pkg
import { getLatLon } from './positionStack.js'

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'september', 'October', 'November', 'December']

const rep = (n, char = ' ') => char.repeat(n)

const input = process.argv.slice(2)

if (input.length < 4) {
  console.log('usage: clistar [MM] [DD] [YYYY] [Location]')
  process.exit(0)
}

const birthPlace = input.slice(3).join(' ')
const { latitude, longitude, name } = await getLatLon(birthPlace)

const DOB = {
  month: input[0] - 1, // 0=Jan, 11=Dec
  date: input[1],
  year: input[2]
}

const horoscope = new Horoscope({
  origin: new Origin({
    year: DOB.year,
    month: DOB.month,
    date: DOB.date,
    hour: 12,
    minute: 0,
    latitude,
    longitude
  })
})

let space = {
  planet: 0,
  sign: 0,
  house: 0
}

const results = horoscope._celestialBodies.all.map(({
  label, Sign, House = { label: '' }
}) => {
  if (label.length > space.planet) space.planet = label.length
  if (Sign.label.length > space.sign) space.sign = Sign.label.length
  if (House.label.length > space.house) space.house = House.label.length

  return {
    planet: label,
    sign: Sign.label,
    house: House.label
  }
})

const header = `${months[DOB.month]} ${DOB.date}, ${DOB.year} - ${name}`
const xLen = space.planet + space.sign + space.house + 10
const xPad = (xLen - (header.length)) / 2
const xRow = rep(xLen, '~')
const lP = rep(Math.ceil(xPad) - 1)
const rP = rep(Math.floor(xPad) - 1)
const pP = rep(space.planet - 'planet'.length)
const sP = rep(space.sign - 'sign'.length)
const hP = rep(space.house - 'house'.length)

console.clear()

console.log(`${xRow}
|${lP}\x1b[1m${header}\x1b[0m${rP}|
${xRow}
| Sign${sP} | Planet${pP} | House${hP} |
${xRow}`)

results.forEach(i => {
  const pad = k => rep(space[k] - i[k].length)
  console.log(
    `| \x1b[1m${i.sign}\x1b[0m${pad('sign')} ` +
    `| ${i.planet}${pad('planet')} ` +
    `| ${i.house}${pad('house')} |` +
    ` #${i.sign}${i.planet}${pad('sign')}${pad('planet')}`
  )
})

console.log(xRow)
