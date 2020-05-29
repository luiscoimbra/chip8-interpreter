import { CPUActionTypes, LOAD_ROM } from "./types";

export function loadRom(rom: string): CPUActionTypes {
  return {
    type: LOAD_ROM,
    rom: []
  }
}
