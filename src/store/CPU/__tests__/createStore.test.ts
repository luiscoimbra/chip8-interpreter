import { createStore } from "redux";
import { CPUReducer, cleanUI } from "../reducers";
import { CPU } from "../types";

test('init the state with all the default keys and values', () => {
  const initialState:CPU = {
    memory: new Uint8Array(4096),
    V: new Uint8Array(16),
    I: 0,
    DT: 0,
    ST: 0,
    PC: 0x200,
    SP: 0,
    stack: new Uint16Array(16),
    UI: cleanUI(),
    KEY: Array(0xf).fill(0)
  }

  const store = createStore(CPUReducer)
  expect(store.getState()).toEqual(initialState);
});
