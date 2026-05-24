import { addMoney, parseMoney, subtractMoney } from './money';

test('parseMoney function', () => {
  expect(parseMoney('1')).toBe(1000000000n);
  expect(parseMoney('1.1')).toBe(1100000000n);
  expect(parseMoney('1.000000001')).toBe(1000000001n);
});

test('parseMoney correct behaviour', () => {
  expect(parseMoney('0.000000001')).toBe(1n);
});

test('parseMoney throws on invalid values', () => {
  expect(() => parseMoney('1.')).toThrow('Invalid value money format');
});

test('subtractMoney', () => {
  expect(subtractMoney('1.1', '1.0')).toBe('0.1');
  expect(subtractMoney('2.2', '1.0')).toBe('1.2');
  expect(subtractMoney('1.000000001', '1.000000000')).toBe('0.000000001');
});

test('addMoney', () => {
  expect(addMoney('1.1', '1.0')).toBe('2.1');
  expect(addMoney('2.2', '1.0')).toBe('3.2');
  expect(addMoney('1.000000001', '1.000000000')).toBe('2.000000001');
});
