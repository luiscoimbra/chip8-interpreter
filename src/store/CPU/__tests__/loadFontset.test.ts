import { createStore } from "redux"
import { CPUReducer } from "../reducers"
import { loadFontset } from "../actions"
import getFontset from "../../../app/CPU/getFontset"

test('load fontset to memory', () => {
  const state = createStore(CPUReducer)
  const fontset = getFontset()
  state.dispatch(loadFontset(fontset))
  
  const { memory } = state.getState()
  expect(memory.slice(0, 80)).toEqual(fontset)
})
