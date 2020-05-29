import { createStore } from "redux"
import { CPUReducer } from "../reducers"
import { loadRom } from "../actions"

test('loadRom must add hex to memory correctly (after 0x200 address)', () => {
  const store = createStore(CPUReducer)
  const ROM:Array<string> = "60 00 61 00 a2".split(" ")
  
  store.dispatch(loadRom(ROM))

  const memoryChanged = [
    store.getState().memory[512],
    store.getState().memory[513],
    store.getState().memory[514],
    store.getState().memory[515],
    store.getState().memory[516]
  ]

  const ROMinDecimal = [96, 0, 97, 0, 162]

  expect(memoryChanged).toEqual(ROMinDecimal)
}) 
