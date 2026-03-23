export function parseMoney(value: string): bigint {
  return BigInt(value);
}
export function isValidMoney(value: string): boolean {
  const money = BigInt(value);

  if (money <= 0n) {
    throw new Error(`Invalid money type ${money}`);
  }
  return true;
}
