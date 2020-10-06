import { CPUReducer, initialState } from "../reducers"
import { createStore } from "redux"
import { executeCommand, loadFontset } from "../actions"
import { Instruction } from "../../../app/CPU/types"
import getInstruction from "../../../app/CPU/getInstruction"
import getFontset from "../../../app/CPU/getFontset"

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
  testState.SP = 0x2
  testState.stack[0x2] = 0xf
 
  const store = createStore(CPUReducer, testState)
    
  expect(RET.name).toBe('RET')
  expect(RET.opcode).toBe(opcode)

  store.dispatch(executeCommand(RET))

  expect(store.getState().PC).toBe(0xf)
  expect(store.getState().SP).toBe(0x1)
})

test('1nnn - JP addr - Jump to location nnn.', () => {
  const opcode = 0x1225
  const JP: Instruction = getInstruction(opcode)
  const store = createStore(CPUReducer)

  store.dispatch(executeCommand(JP))

  expect(JP.name).toBe('JP')
  expect(JP.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x225)
})

test('2nnn - CALL addr - Call subroutine at nnn.', () => {
  const opcode = 0x2062
  const CALL:Instruction = getInstruction(opcode)
  const store = createStore(CPUReducer)
  const PREV_PC = store.getState().PC
  store.dispatch(executeCommand(CALL))

  expect(CALL.name).toBe('CALL')
  expect(CALL.opcode).toBe(opcode)
  const { SP, PC, stack } = store.getState()
  expect(SP).toBe(1)
  expect(stack[SP]).toBe(PREV_PC + 2)
  expect(PC).toBe(0x062)
})

test('3xkk - SE Vx, byte [NOT EQUAL] - Skip next instruction if Vx = kk.', () => {
  const opcode = 0x3abb
  const SE_VX_BYTE: Instruction = getInstruction(opcode)
  const store = createStore(CPUReducer)
  store.dispatch(executeCommand(SE_VX_BYTE))

  expect(SE_VX_BYTE.name).toBe('SE_VX_BYTE')
  expect(SE_VX_BYTE.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x202)
})

test('3xkk - SE Vx, byte [EQUAL] - Skip next instruction if Vx = kk.', () => {
  const opcode = 0x3abb
  const SE_VX_BYTE: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[0xa] = 0xbb

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SE_VX_BYTE))

  expect(SE_VX_BYTE.name).toBe('SE_VX_BYTE')
  expect(SE_VX_BYTE.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x204)
})

test('4xkk - SNE Vx, byte [NOT EQUAL] - Skip next instruction if Vx != kk.', () => {
  const opcode = 0x4acc
  const SNE: Instruction = getInstruction(opcode)
  const store = createStore(CPUReducer)
  store.dispatch(executeCommand(SNE))

  expect(SNE.name).toBe('SNE')
  expect(SNE.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x204)
})

test('4xkk - SNE Vx, byte [EQUAL] - Skip next instruction if Vx != kk.', () => {
  const opcode = 0x4acc
  const SNE: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[0xa] = 0xcc
  
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SNE))

  expect(SNE.name).toBe('SNE')
  expect(SNE.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x202)
})

test('5xy0 - SE Vx, Vy [EQUAL] - Skip next instruction if Vx = Vy.', () => {
  const opcode = 0x5ab0
  const SE_VX_VY: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[0xa] = 0x5
  testState.V[0xb] = 0x5

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SE_VX_VY))

  expect(SE_VX_VY.name).toBe('SE_VX_VY')
  expect(SE_VX_VY.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x204)
})

test('5xy0 - SE Vx, Vy [NOT EQUAL] - Skip next instruction if Vx = Vy.', () => {
  const opcode = 0x5ab0
  const SE_VX_VY: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[0xa] = 0x5
  testState.V[0xb] = 0x6
  
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SE_VX_VY))

  expect(SE_VX_VY.name).toBe('SE_VX_VY')
  expect(SE_VX_VY.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x202)
})

test('6xkk - LD Vx, byte - Set Vx = kk.', () => {
  const opcode = 0x6abb
  const LD_VX_BYTE: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[0xa] = 0x10
  const store = createStore(CPUReducer, testState)

  store.dispatch(executeCommand(LD_VX_BYTE))

  expect(LD_VX_BYTE.name).toBe('LD_VX_BYTE')
  expect(LD_VX_BYTE.opcode).toBe(opcode)
  expect(store.getState().V[0xa]).toBe(0xbb)
})

test('7xkk - ADD Vx, byte - Set Vx = Vx + kk.', () => {
  const opcode = 0x7abb
  const ADD_VX_BYTE: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[0xa] = 0x10
  const store = createStore(CPUReducer, testState)
  
  store.dispatch(executeCommand(ADD_VX_BYTE))

  expect(ADD_VX_BYTE.name).toBe('ADD_VX_BYTE')
  expect(ADD_VX_BYTE.opcode).toBe(opcode)
  expect(store.getState().V[0xa]).toBe(0x10 + 0xbb)
})

test('8xy0 - LD Vx, Vy - Set Vx = Vy.', () => {
  const opcode = 0x8ab0
  const LD_VX_VY: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[0xb] = 0x8

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(LD_VX_VY))

  expect(LD_VX_VY.name).toBe('LD_VX_VY')
  expect(LD_VX_VY.opcode).toBe(opcode)
  expect(store.getState().V[0xa]).toBe(0x8)
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
  const opcode = 0x8ab4
  const ADD_VX_VY: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[0xa] = 0xff
  testState.V[0xb] = 0xff
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(ADD_VX_VY))

  expect(ADD_VX_VY.name).toBe('ADD_VX_VY')
  expect(ADD_VX_VY.opcode).toBe(opcode)
  expect(store.getState().V[0xa]).toBe(0xfe)
  expect(store.getState().V[0xf]).toBe(1)
})

test('8xy4 - ADD Vx, Vy [W/O CARRY] - Set Vx = Vx + Vy, set VF = carry.', () => {
  const opcode = 0x8ab4
  const ADD_VX_VY: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[0xa] = 0x3
  testState.V[0xb] = 0x4
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(ADD_VX_VY))

  expect(ADD_VX_VY.name).toBe('ADD_VX_VY')
  expect(ADD_VX_VY.opcode).toBe(opcode)
  expect(store.getState().V[0xa]).toBe(0x7)
  expect(store.getState().V[0xf]).toBe(0)
})

test('8xy5 - SUB Vx, Vy [NOT BORROW] - Set Vx = Vx - Vy, set VF = NOT borrow.', () => {
  const opcode = 0x8ab5
  const SUB: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[0xa] = 0x4
  testState.V[0xb] = 0x2
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SUB))

  expect(SUB.name).toBe('SUB')
  expect(SUB.opcode).toBe(opcode)
  expect(store.getState().V[0xa]).toBe(2)
  expect(store.getState().V[0xf]).toBe(1)
})

test('8xy5 - SUB Vx, Vy [BORROW] - Set Vx = Vx - Vy, set VF = NOT borrow.', () => {
  const opcode = 0x8ab5
  const SUB: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[0xa] = 0x2
  testState.V[0xb] = 0x3
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SUB))

  expect(SUB.name).toBe('SUB')
  expect(SUB.opcode).toBe(opcode)
  expect(store.getState().V[0xa]).toBe(255)
  expect(store.getState().V[0xf]).toBe(0)
})

test('8xy6 - SHR Vx {, Vy} [Least-Significant bit of Vx = 1] - Set Vx = Vx SHR 1.', () => {
  const opcode = 0x8ab6
  const SHR: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[0xa] = 0x3
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SHR))
  
  expect(SHR.name).toBe('SHR')
  expect(SHR.opcode).toBe(opcode)
  expect(store.getState().V[0xa]).toBe(0x3 >> 1)
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
  const opcode = 0x8ab7
  const SUBN: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[0xa] = 0x3
  testState.V[0xb] = 0x2
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SUBN))

  expect(SUBN.name).toBe('SUBN')
  expect(SUBN.opcode).toBe(opcode)
  expect(store.getState().V[0xa]).toBe(255)
  expect(store.getState().V[0xf]).toBe(0)
})

test('8xyE - SHL Vx {, Vy} [Most-Significant = 1] - Set Vx = Vx SHL 1.', () => {
  const opcode = 0x8abe
  const SHL: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[0xa] = 135
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SHL))

  expect(SHL.name).toBe('SHL')
  expect(SHL.opcode).toBe(opcode)
  expect(store.getState().V[0xa]).toBe((135 << 1) % 256)
  expect(store.getState().V[0xf]).toBe(1)
})

test('8xyE - SHL Vx {, Vy} [Most-Significant = 0] - Set Vx = Vx SHL 1.', () => {
  const opcode = 0x8abe
  const SHL: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[0xa] = 0x3
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SHL))

  expect(SHL.name).toBe('SHL')
  expect(SHL.opcode).toBe(opcode)
  expect(store.getState().V[0xa]).toBe(0x3 << 1)
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
  expect(store.getState().PC).toBe(0x204)
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
  expect(store.getState().PC).toBe(0x202)
})

test('Annn - LD I, addr - Set I = nnn.', () => {
  const opcode = 0xA999
  const LD_I: Instruction = getInstruction(opcode)
  const store = createStore(CPUReducer)
  store.dispatch(executeCommand(LD_I))

  expect(LD_I.name).toBe('LD_I')
  expect(LD_I.opcode).toBe(opcode)
  expect(store.getState().I).toBe(0x999)
})

test('Bnnn - JP V0, addr - Jump to location nnn + V0.', () => {
  const opcode = 0xb300
  const JP_V0: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[0] = 0x2
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(JP_V0))

  expect(JP_V0.name).toBe('JP_V0')
  expect(JP_V0.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x2 + 0x300)
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

test('DRW COMMAND MORE TESTS', () => {
  const opcode = 0xd125
  const DRW: Instruction = getInstruction(opcode)

  const testState = initialState()
  testState.V[0x1] = 1
  testState.V[0x2] = 1
  
  const store = createStore(CPUReducer, testState)
  store.dispatch(loadFontset(getFontset()))
  store.dispatch(executeCommand(DRW))

  expect(store.getState().UI[1][1]).toBe(1)
  expect(store.getState().UI[2][1]).toBe(1)
  expect(store.getState().UI[3][1]).toBe(1)
  expect(store.getState().UI[4][1]).toBe(1)
  expect(store.getState().UI[2][1]).toBe(1)
  expect(store.getState().UI[2][2]).toBe(0)
  expect(store.getState().UI[2][3]).toBe(0)
  expect(store.getState().UI[2][4]).toBe(1)
  expect(store.getState().UI[3][1]).toBe(1)
  expect(store.getState().UI[3][2]).toBe(0)
  expect(store.getState().UI[3][3]).toBe(0)
  expect(store.getState().UI[3][4]).toBe(1)
  expect(store.getState().UI[4][1]).toBe(1)
  expect(store.getState().UI[4][2]).toBe(0)
  expect(store.getState().UI[4][3]).toBe(0)
  expect(store.getState().UI[4][4]).toBe(1)
  expect(store.getState().UI[5][1]).toBe(1)
  expect(store.getState().UI[5][1]).toBe(1)
  expect(store.getState().UI[5][1]).toBe(1)
  expect(store.getState().UI[5][1]).toBe(1)

  expect(store.getState().V[0xf]).toBe(0)

  store.dispatch(executeCommand(DRW))

  expect(store.getState().UI[1][1]).toBe(0)
  expect(store.getState().UI[2][1]).toBe(0)
  expect(store.getState().UI[3][1]).toBe(0)
  expect(store.getState().UI[4][1]).toBe(0)
  expect(store.getState().UI[2][1]).toBe(0)
  expect(store.getState().UI[2][4]).toBe(0)
  expect(store.getState().UI[3][1]).toBe(0)
  expect(store.getState().UI[3][4]).toBe(0)
  expect(store.getState().UI[4][1]).toBe(0)
  expect(store.getState().UI[4][4]).toBe(0)
  expect(store.getState().UI[5][1]).toBe(0)
  expect(store.getState().UI[5][1]).toBe(0)
  expect(store.getState().UI[5][1]).toBe(0)
  expect(store.getState().UI[5][1]).toBe(0)

  expect(store.getState().V[0xf]).toBe(1)
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
  testState.V[0x3] = 0xb
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SKP_VX))
  
  expect(SKP_VX.name).toBe('SKP_VX')
  expect(SKP_VX.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x202)
})

test('Ex9E - SKP Vx - [KEY is DOWN] Skip next instruction if key with the value of Vx is pressed.', () => {
  const opcode = 0xea9e
  const SKP_VX = getInstruction(opcode)

  const testState = initialState()
  // testState.PC = 0x401
  testState.V[0xa] = 4
  testState.KEY = 0x4
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SKP_VX))
  
  expect(SKP_VX.name).toBe('SKP_VX')
  expect(SKP_VX.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x204)
})

test('ExA1 - SKNP Vx - [KEY is DOWN] Skip next instruction if key with the value of Vx is not pressed.', () => {
  const opcode = 0xeba1
  const SKNP_VX = getInstruction(opcode)

  const testState = initialState()
  testState.V[0xb] = 4
  testState.KEY = 0x4
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SKNP_VX))
  
  expect(SKNP_VX.name).toBe('SKNP_VX')
  expect(SKNP_VX.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x202)
})

test('ExA1 - SKNP Vx - [KEY is UP] Skip next instruction if key with the value of Vx is not pressed.', () => {
  const opcode = 0xeba1
  const SKNP_VX = getInstruction(opcode)

  const testState = initialState()
  testState.V[0xb] = 1
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(SKNP_VX))

  expect(SKNP_VX.name).toBe('SKNP_VX')
  expect(SKNP_VX.opcode).toBe(opcode)
  expect(store.getState().PC).toBe(0x204)
})

test('Fx07 - LD Vx, DT - Set Vx = delay timer value.', () => {
  const opcode = 0xfa07
  const LD_VX_DT: Instruction = getInstruction(opcode)
  
  const testState = initialState()
  testState.DT = 0xf
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(LD_VX_DT))

  expect(LD_VX_DT.name).toBe('LD_VX_DT')
  expect(LD_VX_DT.opcode).toBe(opcode)
  expect(store.getState().V[0xa]).toBe(0xf)
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
  const opcode = 0xfb15
  const LD_DT_VX: Instruction = getInstruction(opcode)

  const testState = initialState()
  testState.V[0xb] = 0xf

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(LD_DT_VX))
  
  expect(LD_DT_VX.name).toBe('LD_DT_VX')
  expect(LD_DT_VX.opcode).toBe(opcode)
  expect(store.getState().DT).toBe(0xf)
})

test('Fx18 - LD ST, Vx - Set sound timer = Vx.', () => {
  const opcode = 0xfa18
  const LD_ST_VX: Instruction = getInstruction(opcode)

  const testState = initialState()
  testState.V[0xa] = 0xf

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(LD_ST_VX))
  
  expect(LD_ST_VX.name).toBe('LD_ST_VX')
  expect(LD_ST_VX.opcode).toBe(opcode)
  expect(store.getState().ST).toBe(0xf)
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

test('ADD_I_VX Fx1E more tests',() => {
  const opcode = 0xfa1e
  const ADD_I_VX: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.I = 0xe
  testState.V[0xa] = 0xf

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(ADD_I_VX))

  expect(store.getState().I).toBe(0xe + 0xf)
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

test('LD_F_VX Fx29 more tests', () => {
  const opcode = 0xfa29
  const LD_F_VX: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[0xa] = 0xa
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(LD_F_VX))
  expect(store.getState().I).toBe(0xa * 5)
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

test('LD_B_VX Fx33 - more tests', () => {
  const opcode = 0xfa33
  const LD_B_VX: Instruction = getInstruction(opcode)
  const testState = initialState()
  testState.V[0xa] = 0x7b
  testState.I = 0x300
  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(LD_B_VX))
  expect(store.getState().memory[0x300]).toBe(1)
  expect(store.getState().memory[0x301]).toBe(2)
  expect(store.getState().memory[0x302]).toBe(3)
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

test('LD_I_VX Fx55 more tests', () => {
  const opcode = 0xfb55
  const LD_I_VX: Instruction = getInstruction(opcode)

  const testState = initialState()
  testState.I = 0x400

  for (let i = 0; i <= 0xb; i++) {
    testState.V[i] = i
  }

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(LD_I_VX))

  for (let i = 0; i <= 0xb; i++) {
    expect(store.getState().memory[store.getState().I + i]).toBe(i)
  }

  expect(store.getState().memory[store.getState().I + 0xc]).toBe(0)
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

test('LD_VX_I Fx65 more tests', () => {
  const opcode = 0xfa65
  const LD_VX_I: Instruction = getInstruction(opcode)

  const testState = initialState()
  testState.I = 0x400

  for (let i = 0; i <= 0xa; i++) {
    testState.memory[testState.I + i] = i
  }

  const store = createStore(CPUReducer, testState)
  store.dispatch(executeCommand(LD_VX_I))

  for (let i = 0; i <= 0xa; i++) {
    expect(store.getState().V[i]).toBe(i)
  }
  expect(store.getState().V[0xb]).toBe(0)

})
