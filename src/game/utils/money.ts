export function parseMoney(value: string): bigint {
  const splitString: string[] = value.split('.');
  const integerPart = splitString[0];
  let decimalPart = splitString[1] ?? '';

  /**
   * basically if splitString has 3+ strings in our array it means
   * the string came in like this 123.123.123 which is wrong
   * we check for all possible edge cases here
   */
  if (splitString.length > 2) {
    throw new Error('Split string has >=3 string in array ');
  }
  if (integerPart.length > 9) {
    throw new Error('Integer part cant be longer than 9 characters');
  }
  if (decimalPart.length > 9) {
    throw new Error('Decimal part cant be longer than 9 characters');
  }

  /**
   * we add 0 to the end to match our db type so it would have 9 decimal digits
   */
  if (decimalPart.length < 9) {
    decimalPart = decimalPart.padEnd(9, '0');
  }

  const combinedMoney = integerPart + decimalPart;

  return BigInt(combinedMoney);
}
export function isValidMoney(value: string): boolean {
  const money = BigInt(value);

  if (money <= 0n) {
    throw new Error(`Invalid money type ${money}`);
  }
  return true;
}
export function compareMoney(a: string, b: string): number {
  const firstField = parseMoney(a);
  const secondField = parseMoney(b);

  if (firstField < secondField) return -1;
  else if (firstField > secondField) return 1;
  else return 0;
}
