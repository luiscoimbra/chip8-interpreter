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

export default [
  CLS, RET, JP, CALL, SE_VX_BYTE, SNE, SE_VX_VY, LD_VX_BYTE, 
  ADD_VX_BYTE, LD_VX_VY, OR, AND, XOR, ADD_VX_VY, SUB, SHR, SUBN,
  SHL, SNE_VX_VY, LD_I, JP_V0
]

