#!/usr/bin/env node

import pkg from 'circular-natal-horoscope-js'
const { Origin, Horoscope } = pkg

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'september', 'October', 'November', 'December']

const input = process.argv.slice(2)
if (!input.length) {
  console.log('usage: clistar [DD] [MM] [YYYY]')
  process.exit(0)
}


const DOB = { 
  year: input[2],
  // 0=Jan, 11=Dec
  month: input[1] - 1,
  date: input[0]
}

const horoscope = new Horoscope({
  origin: new Origin({
    year: DOB.year,
    month: DOB.month,
    date: DOB.date,
    hour: 12,
    minute: 0,
    latitude: 43.038902,
    longitude: -87.906471
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
const lrPad = ( hRow().length - ('|July 31, 1998|'.length) )  / 2
const llPad = ' '.repeat( Math.ceil(lrPad) )
const rrPad = ' '.repeat( Math.floor(lrPad) )

console.log('\x1Bc\x1b[3J\n' + hRow())
console.log(`|${llPad}\x1b[1m${months[DOB.month]} ${DOB.date}, ${DOB.year}\x1b[0m${rrPad}|`)
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
