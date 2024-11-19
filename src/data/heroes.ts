export const heroes = [
  'Common',
  'Vanessa',
  'Dooley',
  'Pygmalien',
  'Stelle',
  'Mak',
  'Jules',
] as const

export type Hero = (typeof heroes)[number]
