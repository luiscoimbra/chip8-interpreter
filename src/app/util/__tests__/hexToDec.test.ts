import hexToDec from "../hexToDec"

test('convert hex to decimals', () => {
  const hex = ["64", "bc", "0", "e8d4a50fff"]
  const decimals = [100, 188, 0, 999999999999]
  expect(hex.map(h => hexToDec(h))).toEqual(decimals)
})
