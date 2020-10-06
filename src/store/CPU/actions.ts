import { CPUActionTypes, LOAD_ROM, CPU } from "./types";
import { Instruction } from "../../app/CPU/types";

const loadRom = (rom: Array<string>): CPUActionTypes => (
  {
    type: LOAD_ROM,
    rom
  }
)

const executeCommand = (instruction:Instruction): CPUActionTypes => (
  {
    type: 'COMMAND',
    command: instruction
  }
)
 
const incrementPC = (value: number): CPUActionTypes => (
  {
    type: 'INCREMENT_PC',
    value
  }
)

const decrementDT = (): CPUActionTypes => (
  {
    type: 'DECREMENT_DT'
  }
)

const loadFontset = (fontset: Uint8Array): CPUActionTypes => (
  {
    type: 'LOAD_FONTSET',
    fontset
  }
)

const pressKey = (key: number): CPUActionTypes => (
  {
    type: 'PRESS_KEY',
    key
  }
)

const resetKey = (): CPUActionTypes => (
  {
    type: 'RESET_KEY'
  }
)

export {
  loadRom,
  executeCommand,
  incrementPC,
  loadFontset,
  decrementDT,
  pressKey,
  resetKey
}
