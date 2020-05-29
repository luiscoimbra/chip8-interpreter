import decToHex from "../DecToHex"

test('convert decimal number to hex string', () => {
  const decimals = [100, 188, 0, 999999999999]
  expect(decimals.map(d => decToHex(d))).toEqual(["64", "bc", "0", "e8d4a50fff"])
})
