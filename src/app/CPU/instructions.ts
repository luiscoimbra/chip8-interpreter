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

// Set Vx = Vx + Vy, set VF = carry.
// 0x8xy4
const ADD:Instruction = {
  name: 'ADD_VX_VY',
  mask: 0xf00f,
  pattern: 0x8004,
  opcode: 0
}

// 6xkk - LD Vx, byte
// Set Vx = kk.
// The interpreter puts the value kk into register Vx.
const LD:Instruction = {
  name: 'LD_VX_BYTE',
  mask: 0xf000,
  pattern: 0x6000,
  opcode: 0
}

export default [
  CLS, RET, LD 
]

