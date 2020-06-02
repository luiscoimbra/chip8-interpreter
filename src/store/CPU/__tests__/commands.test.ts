import { CPUReducer, initialState } from "../reducers"
import { createStore } from "redux"
import { executeCommand } from "../actions"
import { Instruction } from "../../../app/CPU/types"
import getInstruction from "../../../app/CPU/getInstruction"

test('00E0 - CLS - clear the display', () => {
  const testState = initialState()
  testState.UI[0][0] = 1
  testState.UI[1][1] = 1
  testState.UI[2][2] = 1
  testState.UI[60][31] = 1
  const opcode = 0x00E0
  const store = createStore(CPUReducer, testState)
  const CLS: Instruction = getInstruction(opcode)
  store.dispatch(executeCommand(CLS))
  
  expect(CLS.name).toBe('CLS')
  expect(CLS.opcode).toBe(opcode)
  expect(store.getState().UI).toEqual(initialState().UI)
})

test('00EE - RET - Return from a subroutine.', () => {
  const testState = initialState()
  testState.stack[15] = 0x208
  testState.PC = 0x300
  testState.SP = 10
  
  const store = createStore(CPUReducer, testState)
  
  const opcode = 0x00EE
  const RET: Instruction = getInstruction(opcode)
  
  expect(RET.name).toBe('RET')
  expect(RET.opcode).toBe(opcode)

  store.dispatch(executeCommand(RET))

  expect(store.getState().PC).toBe(0x208)
  expect(store.getState().SP).toBe(9)
})

test('1nnn - JP addr - Jump to location nnn.', () => {
  const store = createStore(CPUReducer)
  
  const opcode = 0x13BA
  const JP: Instruction = getInstruction(opcode)

  store.dispatch(executeCommand(JP))

  expect(JP.name).toBe('JP')
  expect(JP.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x03BA)
})

test('2nnn - CALL addr - Call subroutine at nnn.', () => {
  const store = createStore(CPUReducer)

  const opcode = 0x2AF1
  const CALL:Instruction = getInstruction(opcode)

  store.dispatch(executeCommand(CALL))

  expect(CALL.name).toBe('CALL')
  expect(CALL.opcode).toBe(opcode)
  expect(store.getState().SP).toBe(1)
  expect(store.getState().stack[15]).toBe(0x200)
  expect(store.getState().PC).toBe(0x0AF1)
})

test('3xkk - SE Vx, byte [TRUE] - Skip next instruction if Vx = kk.', () => {
  const x = 4
  const kk = 0x0022
  const testState = initialState()
  testState.V[x] = kk
  
  const opcode = 0x3422
  const SE_VX_BYTE: Instruction = getInstruction(opcode)

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SE_VX_BYTE))

  expect(SE_VX_BYTE.name).toBe('SE_VX_BYTE')
  expect(SE_VX_BYTE.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x202)
})

test('3xkk - SE Vx, byte [FALSE] - Skip next instruction if Vx = kk.', () => {
  const x = 4
  const kk = 0x0011
  const testState = initialState()
  testState.V[x] = kk
  
  const opcode = 0x3422
  const SE_VX_BYTE: Instruction = getInstruction(opcode)

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SE_VX_BYTE))

  expect(SE_VX_BYTE.name).toBe('SE_VX_BYTE')
  expect(SE_VX_BYTE.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x200)
})


