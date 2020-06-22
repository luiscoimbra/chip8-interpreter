import { CPU, CPUActionTypes, LOAD_ROM, COMMAND, INCREMENT_PC, LOAD_FONTSET } from "./types";
import { MEMORY_OFFSET } from "../../app/constants/Processor";
import hexToDec from "../../app/util/hexToDec";
import getVars from "../../app/CPU/getVars";
import { DISPLAY_HEIGHT, DISPLAY_WIDTH } from "../constants";

// Fixed viewport size 64x32 with zero values
export const cleanUI = ():Array<Array<number>> => 
  Array(DISPLAY_HEIGHT).fill(null).map(() => Array(DISPLAY_WIDTH).fill(null).map(a => 0))

export const initialState = ():CPU => ({
  memory: new Uint8Array(4096),
  V: new Uint8Array(16),
  I: 0,
  DT: 0,
  ST: 0,
  PC: MEMORY_OFFSET,
  SP: 0,
  stack: new Uint16Array(16),
  UI: cleanUI(),
  KEY: Array(0xf).fill(0),
  halted: false
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
        PC: PC + action.value
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

    case LOAD_FONTSET: {
      const memory = new Uint8Array(state.memory)

      for (let i: number = 0; i < 80; i++) {
        memory[i] = action.fontset[i]
      }

      return {
        ...state,
        memory
      }
    }

    case COMMAND:

      switch(action.command.name) {
        case 'CLS': 
          return {
            ...state,
            UI: cleanUI(),
            PC: state.PC + 2
          }

        case 'RET':
          return {
            ...state,
            PC: state.stack[state.SP],
            SP: state.SP - 1
          }
        
        case 'JP': {
          const { nnn } = getVars(action.command)
          return {
            ...state,
            PC: nnn
          }
        }

        case 'CALL': {
          const { nnn } = getVars(action.command)
          const stack = new Uint16Array(state.stack)
          let { SP, PC } = state

          SP++
          stack[SP] = PC + 2
          PC = nnn
          return {
            ...state,
            SP,
            stack,
            PC
          }
        }
          
        case 'SE_VX_BYTE': {
          const { x, kk } = getVars(action.command)
          const PC = (state.V[x] === kk) ? state.PC + 4 : state.PC + 2
          return {
            ...state,
            PC
          }
        }

        case 'SNE': {
          const { x, kk } = getVars(action.command)
          const PC = (state.V[x] !== kk) ? state.PC + 4 : state.PC + 2
          return {
            ...state,
            PC
          }
        }

        case 'SE_VX_VY': {
          const { x, y } = getVars(action.command)
          const PC = (state.V[x] === state.V[y]) ? state.PC + 4 : state.PC + 2 
          return {
            ...state,
            PC
          }
        } 
      
        case 'LD_VX_BYTE': {
          const { x, kk } = getVars(action.command)
          const V = new Uint8Array(state.V)
          V[x] = kk
          return {
            ...state,
            V,
            PC: state.PC + 2
          }
        }

        case 'ADD_VX_BYTE': {
          const { x, kk } = getVars(action.command)
          const V = new Uint8Array(state.V)
          V[x] = V[x] + kk
          return {
            ...state,
            V,
            PC: state.PC + 2
          }
        }

        case 'LD_VX_VY': {
          const { x, y } = getVars(action.command)
          const V = new Uint8Array(state.V)
          V[x] = V[y]
          return {
            ...state,
            V,
            PC: state.PC + 2
          }
        }

        case 'OR': {
          const { x, y } = getVars(action.command)
          const V = new Uint8Array(state.V)
          V[x] = V[x] | V[y]
          return {
            ...state,
            V,
            PC: state.PC + 2
          }
        }

        case 'AND': {
          const { x, y } = getVars(action.command)
          const V = new Uint8Array(state.V)
          V[x] = V[x] & V[y]
          return {
            ...state,
            V,
            PC: state.PC + 2
          }
        }

        case 'XOR': {
          const { x, y } = getVars(action.command)
          const V = new Uint8Array(state.V)
          V[x] = V[x] ^ V[y]
          return {
            ...state,
            V,
            PC: state.PC + 2
          }
        }

        case 'ADD_VX_VY': {
          const { x, y } = getVars(action.command)
          const V = new Uint8Array(state.V)
          V[x] += V[y]
          V[0xf] = (V[x] + V[y] > 0xff) ? 1 : 0
          return {
            ...state,
            V,
            PC: state.PC + 2
          }
        }

        case 'SUB': {
          const { x, y } = getVars(action.command)
          const V  = new Uint8Array(state.V)
          V[0xf] = V[x] > V[y] ? 1 : 0
          V[x] -= V[y]
          return {
            ...state,
            V,
            PC: state.PC + 2
          }
        }

        case 'SHR': {
          const { x } = getVars(action.command)
          const V = new Uint8Array(state.V)
          V[0xf] = V[x] & 1
          V[x] = V[x] >> 1
          return {
            ...state,
            V,
            PC: state.PC + 2
          }
        }

        case 'SUBN': {
          const { x, y } = getVars(action.command)
          const V  = new Uint8Array(state.V)
          V[0xf] = V[y] > V[x] ? 1 : 0
          V[x] = V[y] - V[x]
          return {
            ...state,
            V,
            PC: state.PC + 2
          }
        }

        case 'SHL': {
          const { x } = getVars(action.command)
          const V = new Uint8Array(state.V)
          V[0xf] = V[x] >> 7
          V[x] <<= 1
          return {
            ...state,
            V,
            PC: state.PC + 2
          }
        }

        case 'SNE_VX_VY': {
          const { x, y } = getVars(action.command)
          return {
            ...state,
            PC: (state.V[x] != state.V[y]) ? state.PC + 4 : state.PC + 2
          }
        }

        case 'LD_I': {
          const { nnn } = getVars(action.command)
          return {
            ...state,
            I: nnn,
            PC: state.PC + 2
          }
        }

        case 'JP_V0': {
          const { nnn } = getVars(action.command)
          return {
            ...state,
            PC: nnn + state.V[0]
          }
        }

        case 'RND': {
          const { x, kk } = getVars(action.command)
          const V = new Uint8Array(state.V)
          V[x] = action.command.rnd & kk 
          return {
            ...state,
            V,
            PC: state.PC + 2
          }
        }

        case 'DRW': {
          let { x, y, n } = getVars(action.command)
          const V = new Uint8Array(state.V)
          const UI = [...state.UI]
          const { I, memory } = state

          // set "no collision" - this will be overriden if colission is detected 
          // when assigning pixels
          V[0xf] = 0

          // Reading bytes from memory start at I
          for (let i = 0; i < n; i++) {
            let spriteByte = memory[I + i]
            
            for (let bit = 0; bit < 8; bit++) {
              // extract the bit from the given sprite byte
              let value = spriteByte & (1 << (7 - bit)) ? 1 : 0

              const w = (V[x] + bit) % DISPLAY_WIDTH
              const h = (V[y] + i) % DISPLAY_HEIGHT

              if (UI[h][w] & value) {
                V[0xf] = 1
              }

              UI[h][w] ^= value
            }
          }
          
          return {
            ...state,
            V,
            UI,
            PC: state.PC + 2
          }
        }

        case 'SKP_VX': {
          const { x } = getVars(action.command)
          const key = state.V[x]
          return {
            ...state,
            // check if key Vx is pressed (1)
            PC: (state.KEY[key]) ? state.PC + 4 : state.PC + 2
          }
        }

        case 'SKNP_VX': {
          const { x } = getVars(action.command)
          const key = state.V[x]
          return {
            ...state,
            // check if key Vx is up (0)
            PC: (!state.KEY[key]) ? state.PC + 4 : state.PC + 2
          }
        }

        case 'LD_VX_DT': {
          const { x } = getVars(action.command)
          const { DT } = state
          const V = new Uint8Array(state.V)
          V[x] = DT
          return {
            ...state,
            V,
            PC: state.PC + 2
          }
        }

        //////// LD_VX_K ///////
        case 'LD_VX_K': {
          return {
            ...state,
            PC: state.PC + 2
          }
        }

        case 'LD_DT_VX': {
          const { x } = getVars(action.command)
          return {
            ...state,
            DT: state.V[x],
            PC: state.PC + 2
          }
        }

        case 'LD_ST_VX': {
          const { x } = getVars(action.command)
          return {
            ...state,
            ST: state.V[x],
            PC: state.PC + 2
          }
        }

        case 'ADD_I_VX': {
          const { x } = getVars(action.command)
          return {
            ...state,
            I: state.I + state.V[x],
            PC: state.PC + 2
          }
        }

        case 'LD_F_VX': {
          const { x } = getVars(action.command)
          return {
            ...state,
            I: state.V[x] * 5,
            PC: state.PC + 2
          }
        }

        case 'LD_B_VX': {
          const { x } = getVars(action.command)
          let Vx = state.V[x]
          const hundreds = Math.floor(Vx / 100)
          Vx = Vx - hundreds * 100
          const tens = Math.floor(Vx / 10);
          Vx = Vx - tens * 10
          const ones = Math.floor(Vx)

          const memory = new Uint8Array(state.memory)
          memory[state.I] = hundreds
          memory[state.I + 1] = tens 
          memory[state.I + 2] = ones

          return {
            ...state,
            memory,
            PC: state.PC + 2
          }
        }

        case 'LD_I_VX': {
          const { x } = getVars(action.command)
          const { V, I } = state
          const memory = new Uint8Array(state.memory)
          
          for (let i = 0; i <= x; i++) {
            memory[I + i] = V[i]
          }

          return {
            ...state,
            memory,
            PC: state.PC + 2
          }
        }

        case 'LD_VX_I': {
          const { x } = getVars(action.command)
          const { memory, I } = state
          const V = new Uint8Array(state.V)
          
          for (let i = 0; i <= x; i++) {
            V[i] = memory[I + i] 
          }

          return {
            ...state,
            V,
            PC: state.PC + 2
          }
        }

        default:
          return state

      }

    default:
      return state
  }
}
