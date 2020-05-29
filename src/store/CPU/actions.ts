import { CPUActionTypes, LOAD_ROM } from "./types";

export function loadRom(rom: Array<string>): CPUActionTypes {
  return {
    type: LOAD_ROM,
    rom
  }
}
