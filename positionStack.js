#!/usr/bin/env bun

import { apiKey } from './apiKey.js'

export const getLatLon = async (query = '') => {
  const response = await fetch(`http://api.positionstack.com/v1/forward?access_key=${apiKey}&query=${query}`)
  const json = await response.json()

  if (json.data) return {
    latitude: json.data[0]?.latitude || 0,
    longitude: json.data[0]?.longitude || 0,
    name: json.data[0]?.name || ''
  }

  return { latitude: 0, longitude: 0, name: '' }
}

