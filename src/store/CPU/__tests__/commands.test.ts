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

test('4xkk - SNE Vx, byte [TRUE] - Skip next instruction if Vx != kk.', () => {
  const x = 4
  const kk = 0x0011
  const testState = initialState()
  testState.V[x] = kk
  
  const opcode = 0x4422
  const SNE: Instruction = getInstruction(opcode)

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SNE))

  expect(SNE.name).toBe('SNE')
  expect(SNE.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x202)
})

test('4xkk - SNE Vx, byte [FALSE] - Skip next instruction if Vx != kk.', () => {
  const x = 4
  const kk = 0x0022
  const testState = initialState()
  testState.V[x] = kk
  
  const opcode = 0x4422
  const SNE: Instruction = getInstruction(opcode)

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SNE))

  expect(SNE.name).toBe('SNE')
  expect(SNE.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x200)
})

test('5xy0 - SE Vx, Vy [TRUE] - Skip next instruction if Vx = Vy.', () => {
  const x = 4
  const y = 6
  const testState = initialState()
  testState.V[x] = 0xab
  testState.V[y] = 0xab
     
  const opcode = 0x5460
  const SE_VX_VY: Instruction = getInstruction(opcode)

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SE_VX_VY))

  expect(SE_VX_VY.name).toBe('SE_VX_VY')
  expect(SE_VX_VY.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x202)
})

test('5xy0 - SE Vx, Vy [FALSE] - Skip next instruction if Vx = Vy.', () => {
  const x = 4
  const y = 6
  const testState = initialState()
  testState.V[x] = 0xab
  testState.V[y] = 0xcd
     
  const opcode = 0x5460
  const SE_VX_VY: Instruction = getInstruction(opcode)

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SE_VX_VY))

  expect(SE_VX_VY.name).toBe('SE_VX_VY')
  expect(SE_VX_VY.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x200)
})

test('6xkk - LD Vx, byte - Set Vx = kk.', () => {
  const opcode = 0x64ca
  const LD_VX_BYTE: Instruction = getInstruction(opcode)
  const store = createStore(CPUReducer)

  store.dispatch(executeCommand(LD_VX_BYTE))

  expect(LD_VX_BYTE.name).toBe('LD_VX_BYTE')
  expect(LD_VX_BYTE.opcode).toBe(opcode)
  expect(store.getState().V[4]).toBe(0xca)
})

test('7xkk - ADD Vx, byte - Set Vx = Vx + kk.', () => {
  const opcode = 0x73db
  const ADD_VX_BYTE: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[3] = 0x14
  const store = createStore(CPUReducer, testState)
  
  store.dispatch(executeCommand(ADD_VX_BYTE))

  expect(ADD_VX_BYTE.name).toBe('ADD_VX_BYTE')
  expect(ADD_VX_BYTE.opcode).toBe(opcode)
  expect(store.getState().V[3]).toBe(0xef)
})

test('8xy0 - LD Vx, Vy - Set Vx = Vy.', () => {
  const opcode = 0x8560
  const LD_VX_VY: Instruction = getInstruction(opcode)
  const testState = initialState()
  const y = 0x3d
  testState.V[6] = y

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(LD_VX_VY))

  expect(LD_VX_VY.name).toBe('LD_VX_VY')
  expect(LD_VX_VY.opcode).toBe(opcode)
  expect(store.getState().V[5]).toBe(y)
})

test('8xy1 - OR Vx, Vy - Set Vx = Vx OR Vy.', () => {
  const opcode = 0x84a1
  const OR: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[4] = 0b10001100
  testState.V[0xa] = 0b01000001
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(OR))

  expect(OR.name).toBe('OR')
  expect(OR.opcode).toBe(opcode)
  expect(store.getState().V[4]).toBe(0b11001101)
})

test('8xy2 - AND Vx, Vy - Set Vx = Vx AND Vy.', () => {
  const opcode = 0x84a2
  const AND: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[4] = 0b10001100
  testState.V[0xa] = 0b01000100
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(AND))

  expect(AND.name).toBe('AND')
  expect(AND.opcode).toBe(opcode)
  expect(store.getState().V[4]).toBe(0b00000100)
})

test('8xy3 - XOR Vx, Vy - Set Vx = Vx XOR Vy.', () => {
  const opcode = 0x84a3
  const XOR: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[4] = 0b10001100
  testState.V[0xa] = 0b01000100
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(XOR))

  expect(XOR.name).toBe('XOR')
  expect(XOR.opcode).toBe(opcode)
  expect(store.getState().V[4]).toBe(0b11001000)
})

test('8xy4 - ADD Vx, Vy [W/ CARRY] - Set Vx = Vx + Vy, set VF = carry.', () => {
  const opcode = 0x85b4
  const ADD_VX_VY: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[5] = 180
  testState.V[0xb] = 200
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(ADD_VX_VY))

  expect(ADD_VX_VY.name).toBe('ADD_VX_VY')
  expect(ADD_VX_VY.opcode).toBe(opcode)
  expect(store.getState().V[5]).toBe(124)
  expect(store.getState().V[0xf]).toBe(1)
})

test('8xy4 - ADD Vx, Vy [W/O CARRY] - Set Vx = Vx + Vy, set VF = carry.', () => {
  const opcode = 0x85b4
  const ADD_VX_VY: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[5] = 180
  testState.V[0xb] = 20
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(ADD_VX_VY))

  expect(ADD_VX_VY.name).toBe('ADD_VX_VY')
  expect(ADD_VX_VY.opcode).toBe(opcode)
  expect(store.getState().V[5]).toBe(200)
  expect(store.getState().V[0xf]).toBe(0)
})

test('8xy5 - SUB Vx, Vy [NOT BORROW] - Set Vx = Vx - Vy, set VF = NOT borrow.', () => {
  const opcode = 0x85b5
  const SUB: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[5] = 100
  testState.V[0xb] = 30
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SUB))

  expect(SUB.name).toBe('SUB')
  expect(SUB.opcode).toBe(opcode)
  expect(store.getState().V[5]).toBe(70)
  expect(store.getState().V[0xf]).toBe(1)
})

test('8xy5 - SUB Vx, Vy [W/ BORROW] - Set Vx = Vx - Vy, set VF = NOT borrow.', () => {
  const opcode = 0x85b5
  const SUB: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[5] = 100
  testState.V[0xb] = 120
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SUB))

  expect(SUB.name).toBe('SUB')
  expect(SUB.opcode).toBe(opcode)
  expect(store.getState().V[5]).toBe(0)
  expect(store.getState().V[0xf]).toBe(0)
})
