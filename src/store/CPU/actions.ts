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

const loadFontset = (fontset: Uint8Array): CPUActionTypes => (
  {
    type: 'LOAD_FONTSET',
    fontset
  }
)

export {
  loadRom,
  executeCommand,
  incrementPC,
  loadFontset
}
