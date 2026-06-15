import { randomBytes } from 'crypto';

function randomUnit(): number {
  return randomBytes(4).readUInt32BE(0) / 2 ** 32;
}

export function generateCrashPoint(
  houseEdge: number,
  instantCrashChance: number,
): number {
  const instantCrashCheck = randomUnit();

  if (instantCrashCheck < instantCrashChance) {
    return 1.0;
  }

  const random = Math.max(randomUnit(), Number.EPSILON);
  const crashPoint = Number(((1 - houseEdge) / random).toFixed(2));

  return Math.max(1.0, crashPoint);
}
