// PLACEHOLDER — ver src/data/README.md

export const XP_TABLE: Record<number, number> = {
  1: 0,
  2: 300,
  3: 900,
  4: 2700,
  5: 6500,
  6: 14000,
  7: 23000,
  8: 34000,
  9: 48000,
  10: 64000,
  11: 85000,
  12: 100000,
  13: 120000,
  14: 140000,
  15: 165000,
  16: 195000,
  17: 225000,
  18: 265000,
  19: 305000,
  20: 355000,
}

export function getProficiencyBonus(level: number): number {
  if (level <= 4) return 3
  if (level <= 8) return 4
  if (level <= 11) return 5
  if (level <= 16) return 6
  if (level <= 20) return 7
  return 8
}

export function getLevelFromXp(xp: number): number {
  let level = 1
  for (let lvl = 20; lvl >= 1; lvl--) {
    if (xp >= XP_TABLE[lvl]) {
      level = lvl
      break
    }
  }
  return level
}

export function getXpForNextLevel(currentLevel: number): number {
  if (currentLevel >= 20) return XP_TABLE[20]
  return XP_TABLE[currentLevel + 1]
}
