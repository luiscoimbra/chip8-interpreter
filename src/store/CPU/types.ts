import { Instruction } from "../../app/CPU/types"

export type Address = number
export type Opcode = number

export interface CPU {
  // Chip8 is capable of access up to 4kb of memory
  // Interpreter uses the first 512 bytes. from 0x000 to 0x1FF
  // The rest of the memory is reserved for the program data > 0x200
  memory: Uint8Array

  // REGISTERS
  // 16 General Purpose 8-bit (Vx) from V0 to VF
  V: Uint8Array

  // Index addressess 16-bit from 0000 to FFFF
  I: Address

  // Timers (when non-zero, it shoud automatically decrement at a rate of 60hz)
  // DT = Delay, ST = Sound
  DT: number
  ST: number

  // Program Counter 16-bit - Currently executing address
  PC: Address

  // Stack Pointer 8-bit - point to the topmost level of the stack
  SP: number

  // Stack of returning addressess from subroutines
  stack: Uint16Array

  // Maps references to UI 64x32 
  UI: Array<Array<number>>
}

export const LOAD_ROM = 'LOAD_ROM'
export const COMMAND = 'COMMAND'
export const INCREMENT_PC = 'INCREMENT_PC'

interface LoadRomAction {
  type: typeof LOAD_ROM,
  rom: Array<string>
}

interface CommandAction {
  type: typeof COMMAND,
  command: Instruction
}

interface IncrementPCAction {
  type: typeof INCREMENT_PC
}

export type CPUActionTypes = LoadRomAction | CommandAction | IncrementPCAction
