import { CPU, CPUActionTypes, LOAD_ROM } from "./types";
import { MEMORY_OFFSET } from "../../app/constants/Processor";
import hexToDec from "../../app/util/hexToDec";

const initialState:CPU = {
  memory: new Uint8Array(4096),
  V: new Uint8Array(16),
  I: 0,
  DT: 0,
  ST: 0,
  PC: MEMORY_OFFSET,
  SP: 0,
  stack: new Uint16Array(16),
  UI: Array(64).fill(Array(32))
}

export function CPUReducer(
  state = initialState,
  action: CPUActionTypes
): CPU {
  switch (action.type) {
    case LOAD_ROM:

      const memory  = new Uint8Array(state.memory)

      // Get hexas from rom buffer and add to memory beggining on start offset
      for (let i: number = 0; i < action.rom.length; i++) {
        memory[MEMORY_OFFSET + i] = hexToDec(action.rom[i])
      }

      return {
        ...state,
        memory
      }

    default:
      return state
  }
}
