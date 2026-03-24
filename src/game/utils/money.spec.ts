import { parseMoney } from './money';

test('parseMoney function', () => {
  expect(parseMoney('1.111111111')).toBe(1111111111n);
});
