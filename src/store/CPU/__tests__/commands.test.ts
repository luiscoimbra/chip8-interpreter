import { CPUReducer, initialState } from "../reducers"
import { createStore } from "redux"
import { executeCommand } from "../actions"
import { Instruction } from "../../../app/CPU/types"
import getInstruction from "../../../app/CPU/getInstruction"

test('00E0 - CLS - clear the display', () => {
  const opcode = 0x00E0
  const CLS: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.UI[0][0] = 1
  testState.UI[1][1] = 1
  testState.UI[2][2] = 1
  testState.UI[31][60] = 1
  
  const store = createStore(CPUReducer, testState)
  
  store.dispatch(executeCommand(CLS))
  
  expect(CLS.name).toBe('CLS')
  expect(CLS.opcode).toBe(opcode)
  expect(store.getState().UI).toEqual(initialState().UI)
})

test('00EE - RET - Return from a subroutine.', () => {
  const opcode = 0x00EE
  const RET: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.stack[15] = 0x208
  testState.PC = 0x300
  testState.SP = 10
  
  const store = createStore(CPUReducer, testState)
    
  expect(RET.name).toBe('RET')
  expect(RET.opcode).toBe(opcode)

  store.dispatch(executeCommand(RET))

  expect(store.getState().PC).toBe(0x208)
  expect(store.getState().SP).toBe(9)
})

test('1nnn - JP addr - Jump to location nnn.', () => {
  const opcode = 0x13BA
  const JP: Instruction = getInstruction(opcode)
  const store = createStore(CPUReducer)

  store.dispatch(executeCommand(JP))

  expect(JP.name).toBe('JP')
  expect(JP.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x03BA)
})

test('2nnn - CALL addr - Call subroutine at nnn.', () => {
  const opcode = 0x2AF1
  const CALL:Instruction = getInstruction(opcode)
  const store = createStore(CPUReducer)

  store.dispatch(executeCommand(CALL))

  expect(CALL.name).toBe('CALL')
  expect(CALL.opcode).toBe(opcode)
  expect(store.getState().SP).toBe(1)
  expect(store.getState().stack[15]).toBe(0x200)
  expect(store.getState().PC).toBe(0x0AF1)
})

test('3xkk - SE Vx, byte [TRUE] - Skip next instruction if Vx = kk.', () => {
  const opcode = 0x3422
  const SE_VX_BYTE: Instruction = getInstruction(opcode)
  const x = 4
  const kk = 0x0022
  const testState = initialState()
  testState.V[x] = kk

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SE_VX_BYTE))

  expect(SE_VX_BYTE.name).toBe('SE_VX_BYTE')
  expect(SE_VX_BYTE.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x202)
})

test('3xkk - SE Vx, byte [FALSE] - Skip next instruction if Vx = kk.', () => {
  const opcode = 0x3422
  const SE_VX_BYTE: Instruction = getInstruction(opcode)
  const x = 4
  const kk = 0x0011
  const testState = initialState()
  testState.V[x] = kk

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SE_VX_BYTE))

  expect(SE_VX_BYTE.name).toBe('SE_VX_BYTE')
  expect(SE_VX_BYTE.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x200)
})

test('4xkk - SNE Vx, byte [TRUE] - Skip next instruction if Vx != kk.', () => {
  const opcode = 0x4422
  const SNE: Instruction = getInstruction(opcode)
  const x = 4
  const kk = 0x0011
  const testState = initialState()
  testState.V[x] = kk

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SNE))

  expect(SNE.name).toBe('SNE')
  expect(SNE.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x202)
})

test('4xkk - SNE Vx, byte [FALSE] - Skip next instruction if Vx != kk.', () => {
  const opcode = 0x4422
  const SNE: Instruction = getInstruction(opcode)
  const x = 4
  const kk = 0x0022
  const testState = initialState()
  testState.V[x] = kk
  
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SNE))

  expect(SNE.name).toBe('SNE')
  expect(SNE.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x200)
})

test('5xy0 - SE Vx, Vy [TRUE] - Skip next instruction if Vx = Vy.', () => {
  const opcode = 0x5460
  const SE_VX_VY: Instruction = getInstruction(opcode)
  const x = 4
  const y = 6
  const testState = initialState()
  testState.V[x] = 0xab
  testState.V[y] = 0xab

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SE_VX_VY))

  expect(SE_VX_VY.name).toBe('SE_VX_VY')
  expect(SE_VX_VY.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x202)
})

test('5xy0 - SE Vx, Vy [FALSE] - Skip next instruction if Vx = Vy.', () => {
  const opcode = 0x5460
  const SE_VX_VY: Instruction = getInstruction(opcode)
  const x = 4
  const y = 6
  const testState = initialState()
  testState.V[x] = 0xab
  testState.V[y] = 0xcd
  
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

test('8xy5 - SUB Vx, Vy [BORROW] - Set Vx = Vx - Vy, set VF = NOT borrow.', () => {
  const opcode = 0x85b5
  const SUB: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[5] = 100
  testState.V[0xb] = 120
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SUB))

  expect(SUB.name).toBe('SUB')
  expect(SUB.opcode).toBe(opcode)
  expect(store.getState().V[5]).toBe(0xff)
  expect(store.getState().V[0xf]).toBe(0)
})

test('8xy6 - SHR Vx {, Vy} [Least-Significant bit of Vx = 1] - Set Vx = Vx SHR 1.', () => {
  const opcode = 0x8df6
  const SHR: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[0xd] = 0b111101
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SHR))
  
  expect(SHR.name).toBe('SHR')
  expect(SHR.opcode).toBe(opcode)
  expect(store.getState().V[0xd]).toBe(30)
  expect(store.getState().V[0xf]).toBe(1)
})

test('8xy6 - SHR Vx {, Vy} [Least-Significant bit of Vx = 0] - Set Vx = Vx SHR 1.', () => {
  const opcode = 0x8df6
  const SHR: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[0xd] = 0b111110
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SHR))
  
  expect(SHR.name).toBe('SHR')
  expect(SHR.opcode).toBe(opcode)
  expect(store.getState().V[0xd]).toBe(31)
  expect(store.getState().V[0xf]).toBe(0)
})

test('8xy7 - SUBN Vx, Vy [NOT BORROW] - Set Vx = Vy - Vx, set VF = NOT borrow.', () => {
  const opcode = 0x85b7
  const SUBN: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[5] = 30
  testState.V[0xb] = 100
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SUBN))

  expect(SUBN.name).toBe('SUBN')
  expect(SUBN.opcode).toBe(opcode)
  expect(store.getState().V[5]).toBe(70)
  expect(store.getState().V[0xf]).toBe(1)
})

test('8xy7 - SUBN Vx, Vy [BORROW] - Set Vx = Vy - Vx, set VF = NOT borrow.', () => {
  const opcode = 0x85b7
  const SUBN: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[5] = 120
  testState.V[0xb] = 100
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SUBN))

  expect(SUBN.name).toBe('SUBN')
  expect(SUBN.opcode).toBe(opcode)
  expect(store.getState().V[5]).toBe(0xff)
  expect(store.getState().V[0xf]).toBe(0)
})

test('8xyE - SHL Vx {, Vy} [Most-Significant = 1] - Set Vx = Vx SHL 1.', () => {
  const opcode = 0x825e
  const SHL: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[2] = 0b10101010
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SHL))

  expect(SHL.name).toBe('SHL')
  expect(SHL.opcode).toBe(opcode)
  expect(store.getState().V[2]).toBe(255)
  expect(store.getState().V[0xf]).toBe(1)
})

test('8xyE - SHL Vx {, Vy} [Most-Significant = 0] - Set Vx = Vx SHL 1.', () => {
  const opcode = 0x825e
  const SHL: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[2] = 0b00101010
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SHL))

  expect(SHL.name).toBe('SHL')
  expect(SHL.opcode).toBe(opcode)
  expect(store.getState().V[2]).toBe(84)
  expect(store.getState().V[0xf]).toBe(0)
})

test('9xy0 - SNE Vx, Vy [Vx != Vy] - Skip next instruction if Vx != Vy.', () => {
  const opcode = 0x9340
  const SNE_VX_VY: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[3] = 0xab
  testState.V[4] = 0xdd
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SNE_VX_VY))
  
  expect(SNE_VX_VY.name).toBe('SNE_VX_VY')
  expect(SNE_VX_VY.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x202)
})

test('9xy0 - SNE Vx, Vy [Vx == Vy] - Skip next instruction if Vx != Vy.', () => {
  const opcode = 0x9340
  const SNE_VX_VY: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[3] = 0xab
  testState.V[4] = 0xab
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SNE_VX_VY))
  
  expect(SNE_VX_VY.name).toBe('SNE_VX_VY')
  expect(SNE_VX_VY.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x200)
})

test('Annn - LD I, addr - Set I = nnn.', () => {
  const opcode = 0xA23c
  const LD_I: Instruction = getInstruction(opcode)
  const store = createStore(CPUReducer)
  store.dispatch(executeCommand(LD_I))

  expect(LD_I.name).toBe('LD_I')
  expect(LD_I.opcode).toBe(opcode)
  expect(store.getState().I).toBe(0x23c)
})

test('Bnnn - JP V0, addr - Jump to location nnn + V0.', () => {
  const opcode = 0xb231
  const JP_V0: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[0] = 90
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(JP_V0))

  expect(JP_V0.name).toBe('JP_V0')
  expect(JP_V0.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(651)
})

test('Cxkk - RND Vx, byte - Set Vx = random byte AND kk.', () => {
  const opcode = 0xc38c
  const RND: Instruction = getInstruction(opcode)
  const store = createStore(CPUReducer)
  
  expect(RND.name).toBe('RND')
  expect(RND.opcode).toBe(opcode)
  expect(RND.rnd).toBeGreaterThanOrEqual(0)
  expect(RND.rnd).toBeLessThan(256)
  
  RND.rnd = 130
  store.dispatch(executeCommand(RND))
  
  expect(store.getState().V[3]).toBe(128)
})

test('Dxyn - DRW Vx, Vy, nibble [NO COLLISION] - Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision.', () => {
  const opcode = 0xd465
  const DRW: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.I = 0x400
  testState.V[4] = 2  
  testState.V[6] = 3

  // sprite of 0
  testState.memory[testState.I] = 0b11110000
  testState.memory[testState.I + 1] = 0b10010000
  testState.memory[testState.I + 2] = 0b10010000
  testState.memory[testState.I + 3] = 0b10010000
  testState.memory[testState.I + 4] = 0b11110000

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(DRW))

  const { UI, V } = store.getState()
  
  expect(V[0xf]).toBe(0)
  expect(UI[1].splice(0, 10)).toEqual([0,0,0,0,0,0,0,0,0,0])
  expect(UI[2].splice(0, 10)).toEqual([0,0,0,0,0,0,0,0,0,0])
  expect(UI[3].splice(0, 10)).toEqual([0,0,1,1,1,1,0,0,0,0])
  expect(UI[4].splice(0, 10)).toEqual([0,0,1,0,0,1,0,0,0,0])
  expect(UI[5].splice(0, 10)).toEqual([0,0,1,0,0,1,0,0,0,0])
  expect(UI[6].splice(0, 10)).toEqual([0,0,1,0,0,1,0,0,0,0])
  expect(UI[7].splice(0, 10)).toEqual([0,0,1,1,1,1,0,0,0,0])
  expect(UI[8].splice(0, 10)).toEqual([0,0,0,0,0,0,0,0,0,0])
  expect(UI[9].splice(0, 10)).toEqual([0,0,0,0,0,0,0,0,0,0])
})

test('Dxyn - DRW Vx, Vy, nibble [W/ COLLISION] - Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision.', () => {
  const opcode = 0xdad5
  const DRW: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.I = 0x400
  testState.V[0xa] = 0xa  
  testState.V[0xd] = 0xf
  testState.UI[15][12] = 0b1
  testState.UI[18][11] = 0b1

  // sprite of 7
  testState.memory[testState.I] =     0b11110000
  testState.memory[testState.I + 1] = 0b00010000
  testState.memory[testState.I + 2] = 0b00100000
  testState.memory[testState.I + 3] = 0b01000000
  testState.memory[testState.I + 4] = 0b01000000

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(DRW))

  const { UI, V } = store.getState()
  
  expect(V[0xf]).toBe(1)
  expect(UI[13].splice(8, 10)).toEqual([0,0,0,0,0,0,0,0,0,0])
  expect(UI[14].splice(8, 10)).toEqual([0,0,0,0,0,0,0,0,0,0])
  expect(UI[15].splice(8, 10)).toEqual([0,0,1,1,0,1,0,0,0,0])
  expect(UI[16].splice(8, 10)).toEqual([0,0,0,0,0,1,0,0,0,0])
  expect(UI[17].splice(8, 10)).toEqual([0,0,0,0,1,0,0,0,0,0])
  expect(UI[18].splice(8, 10)).toEqual([0,0,0,0,0,0,0,0,0,0])
  expect(UI[19].splice(8, 10)).toEqual([0,0,0,1,0,0,0,0,0,0])
  expect(UI[20].splice(8, 10)).toEqual([0,0,0,0,0,0,0,0,0,0])
  expect(UI[21].splice(8, 10)).toEqual([0,0,0,0,0,0,0,0,0,0])
})

test('Ex9E - SKP Vx - [KEY is UP] Skip next instruction if key with the value of Vx is pressed.', () => {
  const opcode = 0xe39e
  const SKP_VX = getInstruction(opcode)

  const testState = initialState()
  testState.PC = 0x401
  testState.V[0x3] = 0xb
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SKP_VX))
  
  expect(SKP_VX.name).toBe('SKP_VX')
  expect(SKP_VX.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x401)
})

test('Ex9E - SKP Vx - [KEY is DOWN] Skip next instruction if key with the value of Vx is pressed.', () => {
  const opcode = 0xe39e
  const SKP_VX = getInstruction(opcode)

  const testState = initialState()
  testState.PC = 0x401
  testState.V[0x3] = 0xb
  testState.KEY[0xb] = 1
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SKP_VX))
  
  expect(SKP_VX.name).toBe('SKP_VX')
  expect(SKP_VX.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x403)
})

test('ExA1 - SKNP Vx - [KEY is DOWN] Skip next instruction if key with the value of Vx is not pressed.', () => {
  const opcode = 0xe3a1
  const SKNP_VX = getInstruction(opcode)

  const testState = initialState()
  testState.PC = 0x401
  testState.V[0x3] = 0xb
  testState.KEY[0xb] = 1
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SKNP_VX))
  
  expect(SKNP_VX.name).toBe('SKNP_VX')
  expect(SKNP_VX.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x401)
})

test('ExA1 - SKNP Vx - [KEY is UP] Skip next instruction if key with the value of Vx is not pressed.', () => {
  const opcode = 0xe3a1
  const SKNP_VX = getInstruction(opcode)

  const testState = initialState()
  testState.PC = 0x401
  testState.V[0x3] = 0xb
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SKNP_VX))

  expect(SKNP_VX.name).toBe('SKNP_VX')
  expect(SKNP_VX.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x403)
})

test('Fx07 - LD Vx, DT - Set Vx = delay timer value.', () => {
  const opcode = 0xfc07
  const LD_VX_DT: Instruction = getInstruction(opcode)
  
  const testState = initialState()
  testState.DT = 0x10
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(LD_VX_DT))

  expect(LD_VX_DT.name).toBe('LD_VX_DT')
  expect(LD_VX_DT.opcode).toBe(opcode)
  expect(store.getState().V[0xc]).toBe(0x10)
})

// @TODO
// test('Fx0A - LD Vx, K - Wait for a key press, store the value of the key in Vx.', () => {
//   const opcode = 0xf80a
//   const LD_VX_K: Instruction = getInstruction(opcode)

//   const testState = initialState()

//   // KEY 9 is pressed
//   testState.KEY[0x9] = 0x39

//   const store = createStore(CPUReducer, testState)
//   store.dispatch(executeCommand(LD_VX_K))

//   expect(LD_VX_K.name).toBe('LD_VX_K')
//   expect(LD_VX_K.opcode).toBe(opcode)
//   // 0x39 hex for 9
//   expect(store.getState().V[0x8]).toBe(0x39)
// })

test('Fx15 - LD DT, Vx - Set delay timer = Vx.', () => {
  const opcode = 0xf415
  const LD_DT_VX: Instruction = getInstruction(opcode)

  const testState = initialState()
  testState.V[0x4] = 0x40

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(LD_DT_VX))
  
  expect(LD_DT_VX.name).toBe('LD_DT_VX')
  expect(LD_DT_VX.opcode).toBe(opcode)
  expect(store.getState().DT).toBe(0x40)
})

test('Fx18 - LD ST, Vx - Set sound timer = Vx.', () => {
  const opcode = 0xf418
  const LD_ST_VX: Instruction = getInstruction(opcode)

  const testState = initialState()
  testState.V[0x4] = 0x40

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(LD_ST_VX))
  
  expect(LD_ST_VX.name).toBe('LD_ST_VX')
  expect(LD_ST_VX.opcode).toBe(opcode)
  expect(store.getState().ST).toBe(0x40)
})

test('Fx1E - ADD I, Vx - Set I = I + Vx.', () => {
  const opcode = 0xfa1e
  const ADD_I_VX: Instruction = getInstruction(opcode)

  const testState = initialState()
  testState.I = 0x200
  testState.V[0xa] = 0x11

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(ADD_I_VX))

  expect(ADD_I_VX.name).toBe('ADD_I_VX')
  expect(ADD_I_VX.opcode).toBe(opcode)
  expect(store.getState().I).toBe(0x211)
})

test('Fx29 - LD F, Vx - Set I = location of sprite for digit Vx.', () => {
  const opcode = 0xf729
  const LD_F_VX: Instruction = getInstruction(opcode)

  const testState = initialState()
  // position of 0x2 is 0xa (10)
  testState.V[0x7] = 0x2
  testState.I = 0

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(LD_F_VX))
  
  expect(LD_F_VX.name).toBe('LD_F_VX')
  expect(LD_F_VX.opcode).toBe(opcode)
  expect(store.getState().I).toBe(10)
})

test('Fx33 - LD B, Vx - Store BCD representation of Vx in memory locations I, I+1, and I+2.', () => {
  const opcode = 0xf533
  const LD_B_VX: Instruction = getInstruction(opcode)

  const testState = initialState()
  testState.I = 0x250
  testState.V[0x5] = 189
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(LD_B_VX))

  expect(LD_B_VX.name).toBe('LD_B_VX')
  expect(LD_B_VX.opcode).toBe(opcode)
  expect(store.getState().memory[0x250]).toBe(1)
  expect(store.getState().memory[0x251]).toBe(8)
  expect(store.getState().memory[0x252]).toBe(9)
})

test('Fx55 - LD [I], Vx - Store registers V0 through Vx in memory starting at location I.', () => {
  const opcode = 0xfd55
  const LD_I_VX: Instruction = getInstruction(opcode)

  const testState = initialState()
  const V = [5, 2, 66, 22, 1, 7, 10, 111, 200, 180, 144, 0, 34, 44, 0, 0]
  testState.V = new Uint8Array(V)
  testState.I = 0x310

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(LD_I_VX))

  expect(LD_I_VX.name).toBe('LD_I_VX')
  expect(LD_I_VX.opcode).toBe(opcode)
  const { memory } = store.getState()
  expect(memory.slice(0x310, 0x320).toString()).toBe(V.toString())
})

test('Fx65 - LD Vx, [I] - Read registers V0 through Vx from memory starting at location I.', () => {
  const opcode = 0xf465
  const LD_VX_I: Instruction = getInstruction(opcode)

  const testState = initialState()
  testState.I = 0x400
  testState.memory[0x400] = 12
  testState.memory[0x401] = 20
  testState.memory[0x402] = 28
  testState.memory[0x403] = 36
  testState.memory[0x404] = 42

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(LD_VX_I))
  
  expect(LD_VX_I.name).toBe('LD_VX_I')
  expect(LD_VX_I.opcode).toBe(opcode)
  const { V } = store.getState()
  expect(V.slice(0, 7).toString()).toBe([12, 20, 28, 36, 42, 0, 0].toString())
})
