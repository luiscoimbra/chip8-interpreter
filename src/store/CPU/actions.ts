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
 
const incrementPC = (): CPUActionTypes => (
  {
    type: 'INCREMENT_PC'
  }
)

export {
  loadRom,
  executeCommand,
  incrementPC
}
