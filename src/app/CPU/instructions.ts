import { Instruction } from "./types"

// Clear the display
const CLS:Instruction = {
  type: 'CLS',
  opcode: "0x00E0"
}

// Return from a subroutine
const RET:Instruction = {
  type: 'RET',
  opcode: "0x00EE"
}

// Set Vx = Vx + Vy, set VF = carry.
const ADD:Instruction = {
  type: 'ADD',
  opcode: "0x8xy4"
}

// 6xkk - LD Vx, byte
// Set Vx = kk.
// The interpreter puts the value kk into register Vx.
const LD = {
  type: 'LD',
  opcode: "0x6xkk"
}

export {
  CLS, RET, LD, ADD
}


