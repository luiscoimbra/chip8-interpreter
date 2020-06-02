import { CPU, CPUActionTypes, LOAD_ROM, COMMAND, INCREMENT_PC } from "./types";
import { MEMORY_OFFSET } from "../../app/constants/Processor";
import hexToDec from "../../app/util/hexToDec";

export const initialState = ():CPU => ({
  memory: new Uint8Array(4096),
  V: new Uint8Array(16),
  I: 0,
  DT: 0,
  ST: 0,
  PC: MEMORY_OFFSET,
  SP: 0,
  stack: new Uint16Array(16),
  //Array(hashTableSize).fill(null).map(() => new LinkedList());
  UI: Array(64).fill(null).map(() => Array(32).fill(null).map(a => 0))
})

export function CPUReducer(
  state = initialState(),
  action: CPUActionTypes
): CPU {
  switch (action.type) {

    case INCREMENT_PC:
      const { PC } = state
      return {
        ...state,
        PC: PC + 2
      }

    case LOAD_ROM:

      const memory = new Uint8Array(state.memory)

      // Get hexas from rom buffer and add to memory beggining on start offset
      for (let i: number = 0; i < action.rom.length; i++) {
        memory[MEMORY_OFFSET + i] = hexToDec(action.rom[i])
      }

      return {
        ...state,
        memory
      }

    case COMMAND:

      switch(action.command.name) {
        case 'CLS':
          const cleanUI = Array(64).fill(null).map(() => Array(32).fill(null).map(a => 0))
          return {
            ...state,
            UI: cleanUI
          }

        // 6xkk - LD Vx, byte
        // Set Vx = kk.
        // The interpreter puts the value kk into register Vx.
        case 'LD':
          const x = 1
          const kk = 2
          const V = new Uint8Array(state.V)
          V[x] = kk
          return {
            ...state,
            V
          }

        default:
          return state

      }


    default:
      return state
  }
}
