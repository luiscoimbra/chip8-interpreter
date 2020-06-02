import { CPU, CPUActionTypes, LOAD_ROM, COMMAND, INCREMENT_PC } from "./types";
import { MEMORY_OFFSET } from "../../app/constants/Processor";
import hexToDec from "../../app/util/hexToDec";

// Fixed viewport size 64x32 with zero values
export const cleanUI = ():Array<Array<number>> => 
  Array(64).fill(null).map(() => Array(32).fill(null).map(a => 0))

export const initialState = ():CPU => ({
  memory: new Uint8Array(4096),
  V: new Uint8Array(16),
  I: 0,
  DT: 0,
  ST: 0,
  PC: MEMORY_OFFSET,
  SP: 0,
  stack: new Uint16Array(16),
  UI: cleanUI()
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
          return {
            ...state,
            UI: cleanUI()
          }

        case 'RET':
          const PC = state.stack[15]
          const SP = state.SP - 1
          return {
            ...state,
            PC,
            SP
          }

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
