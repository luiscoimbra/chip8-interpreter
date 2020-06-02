// 
// 00EE - RET
// 0nnn - SYS addr
// 1nnn - JP addr
// 2nnn - CALL addr
// 3xkk - SE Vx, byte
// 4xkk - SNE Vx, byte
// 5xy0 - SE Vx, Vy
// 6xkk - LD Vx, byte
// 7xkk - ADD Vx, byte
// 8xy0 - LD Vx, Vy
// 8xy1 - OR Vx, Vy
// 8xy2 - AND Vx, Vy
// 8xy3 - XOR Vx, Vy
// 8xy4 - ADD Vx, Vy
// 8xy5 - SUB Vx, Vy
// 8xy6 - SHR Vx {, Vy}
// 8xy7 - SUBN Vx, Vy
// 8xyE - SHL Vx {, Vy}
// 9xy0 - SNE Vx, Vy
// Annn - LD I, addr
// Bnnn - JP V0, addr
// Cxkk - RND Vx, byte
// Dxyn - DRW Vx, Vy, nibble
// Ex9E - SKP Vx
// ExA1 - SKNP Vx
// Fx07 - LD Vx, DT
// Fx0A - LD Vx, K
// Fx15 - LD DT, Vx
// Fx18 - LD ST, Vx
// Fx1E - ADD I, Vx
// Fx29 - LD F, Vx
// Fx33 - LD B, Vx
// Fx55 - LD [I], Vx
// Fx65 - LD Vx, [I]

import { CPUReducer, initialState } from "../reducers"
import { createStore } from "redux"
import { executeCommand } from "../actions"
import { Instruction } from "../../../app/CPU/types"
import { CLS } from "../../../app/CPU/instructions"

test('00E0 - CLS - clear the display', () => {
  const testState = initialState()
  testState.UI[0][0] = 1
  testState.UI[1][1] = 1
  testState.UI[2][2] = 1
  testState.UI[60][31] = 1
  const store = createStore(CPUReducer, testState)
  const cls: Instruction = CLS
  store.dispatch(executeCommand(cls))

  expect(store.getState().UI).toEqual(initialState().UI)
})


