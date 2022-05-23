#!/usr/bin/env node

import pkg from 'circular-natal-horoscope-js'
const { Origin, Horoscope } = pkg

const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'september', 'October', 'November', 'December']

const input = process.argv.slice(2)
if (input.length < 3) {
  console.log('usage: clistar [MM] [DD] [YYYY]')
  process.exit(0)
}

// TODO more locations
const locations = {
  detroit: {
    lattitude: 42.331429,
    longitude: -83.045753
  },
  atlanta: {
    latitude: 33.748783,
    longitude: -84.388168
  },
  newyork: {
    latitude: 40.730610,
    longitude: -73.935242
  },
  hanover: {
    lattitude: 52.373920,
    longitude: 9.735603
  }
}

// TODO validate input here
const DOB = {
  // 0=Jan, 11=Dec
  month: input[0] - 1,
  date: input[1],
  year: input[2]
}

const header = `${monthName[DOB.month]} ${DOB.date}, ${DOB.year}`

const horoscope = new Horoscope({
  origin: new Origin({
    year: DOB.year,
    month: DOB.month,
    date: DOB.date,
    hour: 12,
    minute: 0,
    lattitude: locations.hanover.lattitude,
    longitude: locations.hanover.longitude
  })
})

let space = {
  planet: 0,
  sign: 0,
  house: 0
}

const results = horoscope._celestialBodies.all.map(item => {
  let { label, Sign, House } = item

  if (!House) House = { label: '' }

  if (label.length > space.planet) space.planet = label.length
  if (Sign.label.length > space.sign) space.sign = Sign.label.length
  if (House.label.length > space.house) space.house = House.label.length

  return {
    planet: label,
    sign: Sign.label,
    house: House.label
  }
})

const hRow = () => '-'.repeat(space.planet + space.sign + space.house + 10)

const ptPad = ' '.repeat(space.planet - 'planet'.length)
const stPad = ' '.repeat(space.sign - 'sign'.length)
const htPad = ' '.repeat(space.house - 'house'.length)
const lrPad = (hRow().length - (header.length))  / 2
const llPad = ' '.repeat( Math.ceil(lrPad) - 1)
const rrPad = ' '.repeat( Math.floor(lrPad) - 1)

console.log('\x1Bc\x1b[3J\n' + hRow())
console.log(`|${llPad}\x1b[1m${header}\x1b[0m${rrPad}|`)
console.log(hRow())
console.log(`| Sign${stPad} | Planet${ptPad} | House${htPad} |`)
console.log(hRow())

for (let i = 0; i < results.length; i += 1) {
  const { planet, sign, house } = results[i]
  const pPad = ' '.repeat(space.planet - planet.length)
  const sPad = ' '.repeat(space.sign - sign.length)
  const hPad = ' '.repeat(space.house - house.length)
  console.log(`| \x1b[1m${sign}\x1b[0m${sPad} | ${planet}${pPad} | ${house}${hPad} |`)
}

console.log(hRow() + '\n')
