import initState from "../initState"
import insertROM from "../insertROM"

test('insertROM must add hex to memory correctly (after 0x200 address)', () => {
  const state = initState()
  const ROM:Array<string> = "60 00 61 00 a2".split(" ")
  const stateWithRom = insertROM(ROM, state)

  const memoryChanged = [
    stateWithRom.memory[512],
    stateWithRom.memory[513],
    stateWithRom.memory[514],
    stateWithRom.memory[515],
    stateWithRom.memory[516]
  ]

  const ROMinDecimal = [96, 0, 97, 0, 162]

  expect(memoryChanged).toEqual(ROMinDecimal)
}) 
