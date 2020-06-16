import { Instruction } from "./types"

// Clear the display
const CLS:Instruction = {
  name: 'CLS',
  mask: 0xffff,
  pattern: 0x00E0,
  opcode: 0
}

// Return from a subroutine
const RET:Instruction = {
  name: 'RET',
  mask: 0xffff,
  pattern: 0x00EE,
  opcode: 0
}

// Jump to location nnn.
const JP: Instruction = {
  name: 'JP',
  mask: 0xf000,
  pattern: 0x1000,
  opcode: 0
}

// Call subroutine at nnn
const CALL:Instruction = {
  name: 'CALL',
  mask: 0xf000,
  pattern: 0x2000,
  opcode: 0
}

// Skip next instruction if Vx = kk.
const SE_VX_BYTE = {
  name: 'SE_VX_BYTE',
  mask: 0xf000,
  pattern: 0x3000,
  opcode: 0
}

// Skip next instruction if Vx != kk.
const SNE = {
  name: 'SNE',
  mask: 0xf000,
  pattern: 0x4000,
  opcode: 0
}

// Skip next instruction if Vx = Vy.
const SE_VX_VY:Instruction = {
  name: 'SE_VX_VY',
  mask: 0xf00f,
  pattern: 0x5000,
  opcode: 0
}

// Set Vx = kk.
const LD_VX_BYTE:Instruction = {
  name: 'LD_VX_BYTE',
  mask: 0xf000,
  pattern: 0x6000,
  opcode: 0
}

// Set Vx = Vx + kk.
const ADD_VX_BYTE: Instruction = {
  name: 'ADD_VX_BYTE',
  mask: 0xf000,
  pattern: 0x7000,
  opcode: 0
}

// Set Vx = Vy.
const LD_VX_VY: Instruction = {
  name: 'LD_VX_VY',
  mask: 0xf00f,
  pattern: 0x8000,
  opcode: 0
}

// Set Vx = Vx OR Vy.
const OR: Instruction = {
  name: 'OR',
  mask: 0xf00f,
  pattern: 0x8001,
  opcode: 0
}

// Set Vx = Vx AND Vy. 
const AND: Instruction = {
  name: 'AND',
  mask: 0xf00f,
  pattern: 0x8002, 
  opcode: 0
}

// Set Vx = Vx XOR Vy
const XOR: Instruction = {
  name: 'XOR',
  mask: 0xf00f,
  pattern: 0x8003, 
  opcode: 0
}

// Set Vx = Vx + Vy, set VF = carry.
const ADD_VX_VY: Instruction = {
  name: 'ADD_VX_VY',
  mask: 0xf00f,
  pattern: 0x8004,
  opcode: 0
}

// Set Vx = Vx - Vy, set VF = NOT borrow.
const SUB:Instruction = {
  name: 'SUB',
  mask: 0xf00f,
  pattern: 0x8005,
  opcode: 0
}

// Set Vx = Vx SHR 1.
const SHR:Instruction = {
  name: 'SHR',
  mask: 0xf00f,
  pattern: 0x8006,
  opcode: 0
}

// Set Vx = Vy - Vx, set VF = NOT borrow.
const SUBN:Instruction = {
  name: 'SUBN',
  mask: 0xf00f,
  pattern: 0x8007,
  opcode: 0
}

// Set Vx = Vx SHL 1.
const SHL:Instruction = {
  name: 'SHL',
  mask: 0xf00f,
  pattern: 0x800e,
  opcode: 0
}

// Skip next instruction if Vx != Vy.
const SNE_VX_VY: Instruction = {
  name: 'SNE_VX_VY',
  mask: 0xf00f,
  pattern: 0x9000,
  opcode: 0
}

// Set I = nnn.
const LD_I: Instruction = {
  name: 'LD_I',
  mask: 0xf000,
  pattern: 0xa000,
  opcode: 0
}

// Jump to location nnn + V0.
const JP_V0: Instruction = {
  name: 'JP_V0',
  mask: 0xf000,
  pattern: 0xb000,
  opcode: 0
}

// Set Vx = random byte AND kk.
const RND: Instruction = {
  name: 'RND',
  mask: 0xf000,
  pattern: 0xc000,
  opcode: 0
}

// Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision.
const DRW: Instruction = {
  name: 'DRW',
  mask: 0xf000,
  pattern: 0xd000,
  opcode: 0
}

// Skip next instruction if key with the value of Vx is pressed.
const SKP_VX: Instruction = {
  name: 'SKP_VX',
  mask: 0xf0ff,
  pattern: 0xe09e,
  opcode: 0
}

// Skip next instruction if key with the value of Vx is not pressed.
const SKNP_VX: Instruction = {
  name: 'SKNP_VX',
  mask: 0xf0ff,
  pattern: 0xe0a1,
  opcode: 0
}

// Set Vx = delay timer value.
const LD_VX_DT: Instruction = {
  name: 'LD_VX_DT',
  mask: 0xf0ff,
  pattern: 0xf007,
  opcode: 0
}

// Wait for a key press, store the value of the key in Vx.
const LD_VX_K: Instruction = {
  name: 'LD_VX_K',
  mask: 0xf0ff,
  pattern: 0xf00a,
  opcode: 0
}

// Set delay timer = Vx.
const LD_DT_VX: Instruction = {
  name: 'LD_DT_VX',
  mask: 0xf0ff,
  pattern: 0xf015,
  opcode: 0
}

// Set sound timer = Vx.
const LD_ST_VX: Instruction = {
  name: 'LD_ST_VX',
  mask: 0xf0ff,
  pattern: 0xf018,
  opcode: 0
}

// Set I = I + Vx.
const ADD_I_VX: Instruction = {
  name: 'ADD_I_VX',
  mask: 0xf0ff,
  pattern: 0xf01e,
  opcode: 0
}

// Set I = location of sprite for digit Vx.
const LD_F_VX: Instruction = {
  name: 'LD_F_VX',
  mask: 0xf0ff,
  pattern: 0xf029,
  opcode: 0
}

// Store BCD representation of Vx in memory locations I, I+1, and I+2.
const LD_B_VX: Instruction = {
  name: 'LD_B_VX',
  mask: 0xf0ff,
  pattern: 0xf033,
  opcode: 0
}

// Store registers V0 through Vx in memory starting at location I.
const LD_I_VX: Instruction = {
  name: 'LD_I_VX',
  mask: 0xf0ff,
  pattern: 0xf055,
  opcode: 0
}

// Read registers V0 through Vx from memory starting at location I.
const LD_VX_I: Instruction = {
  name: 'LD_VX_I',
  mask: 0xf0ff,
  pattern: 0xf065,
  opcode: 0
}

export default [
  CLS, RET, JP, CALL, SE_VX_BYTE, SNE, SE_VX_VY, LD_VX_BYTE, 
  ADD_VX_BYTE, LD_VX_VY, OR, AND, XOR, ADD_VX_VY, SUB, SHR, SUBN,
  SHL, SNE_VX_VY, LD_I, JP_V0, RND, DRW, SKP_VX, SKNP_VX, LD_VX_DT,
  LD_VX_K, LD_DT_VX, LD_ST_VX, ADD_I_VX, LD_F_VX, LD_B_VX, LD_I_VX,
  LD_VX_I
]

