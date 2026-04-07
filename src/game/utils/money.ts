export function parseMoney(value: string): bigint {
  const splitString: string[] = value.split('.');
  const integerPart = splitString[0];
  const regex: RegExp = /^\d+(\.\d+)?$/;
  let decimalPart = splitString[1] ?? '';

  /**
   * basically if splitString has 3+ strings in our array it means
   * the string came in like this 123.123.123 which is wrong
   * we check for all possible edge cases here
   */
  if (!regex.test(value)) {
    throw new Error('Invalid value money format');
  }
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

export function compareMoney(a: string, b: string): number {
  const firstField = parseMoney(a);
  const secondField = parseMoney(b);

  if (firstField < secondField) return -1;
  else if (firstField > secondField) return 1;
  else return 0;
}

export function subtractMoney(a: string, b: string): string {
  const firstField = parseMoney(a);
  const secondField = parseMoney(b);

  const subtractionResult = firstField - secondField;
  const isNegative = subtractionResult < 0n;
  const absoluteResult = isNegative ? -subtractionResult : subtractionResult;

  const raw = absoluteResult.toString().padStart(10, '0');
  const integerPart = raw.slice(0, -9).replace(/^0+(?=\d)/, '');
  const decimalPart = raw.slice(-9).replace(/0+$/, '');

  const formatted = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;

  return isNegative ? `-${formatted}` : formatted;
}
