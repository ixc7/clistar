#!/usr/bin/env bun

import { Origin, Horoscope } from 'circular-natal-horoscope-js'
import { getLatLon } from './positionStack.js'

const rep = (n, char = ' ') => char.repeat(n)

const input = process.argv.slice(2)

if (input.length < 4) {
  console.log('usage: clistar [MM] [DD] [YYYY] [Location]')
  process.exit(1)
}

let space = {
  planet: 0,
  sign: 0,
  house: 0
}

const month = input[0] - 1 // 0=Jan, 11=Dec
const date = input[1]
const year = input[2]
const birthPlace = input.slice(3).join(' ')
const { latitude, longitude, name } = await getLatLon(birthPlace)

const results = new Horoscope({
  origin: new Origin({
    year,
    month,
    date,
    hour: 12, // TODO
    minute: 0,
    latitude,
    longitude
  })
})._celestialBodies.all.map(({
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
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'september', 'October', 'November', 'December']
const yChar = '┃'
const xChar = '━'
const header = `${months[month]} ${date}, ${year} - ${name}`
const xLen = space.planet + space.sign + space.house + 10
const xPad = (xLen - (header.length)) / 2
const xRowMid = '┣' + rep(xLen - 2, xChar) + '┫'
const xRowDown = '┏' + rep(xLen - 2, xChar) + '┓'
const xRowUp = '┗' + rep(xLen - 2, xChar) + '┛'
const lP = rep(Math.ceil(xPad) - 1)
const rP = rep(Math.floor(xPad) - 1)
const pP = rep(space.planet - 'planet'.length)
const sP = rep(space.sign - 'sign'.length)
const hP = rep(space.house - 'house'.length)

console.clear()
console.log(`${xRowDown}
${yChar}${lP}\x1b[1m${header}\x1b[0m${rP}${yChar}
${xRowMid}
${yChar} Sign${sP} ${yChar} Planet${pP} ${yChar} House${hP} ${yChar}
${xRowMid}`)

results.forEach(i => {
  const pad = k => rep(space[k] - i[k].length)

  console.log(
    `${yChar} \x1b[1m${i.sign}\x1b[0m${pad('sign')} ` +
    `${yChar} ${i.planet}${pad('planet')} ` +
    `${yChar} ${i.house}${pad('house')} ${yChar}` +
    ` #${i.sign}${i.planet}${pad('sign')}${pad('planet')}`
  )
})

console.log(xRowUp)
