import { Instruction } from "../interpreter"

// Clear the display
const CLS:Instruction = {
  opcode: "00E0"
}

// Return from a subroutine
const RET:Instruction = {
  opcode: "00EE"
}

// Set Vx = Vx + Vy, set VF = carry.
const ADD:Instruction = {
  opcode: "8xy4"
}
