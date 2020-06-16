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
            UI: cleanUI()
          }

        case 'RET':
          return {
            ...state,
            PC: state.stack[15],
            SP: state.SP - 1
          }
        
        case 'JP':
          return {
            ...state,
            PC: action.command.opcode & 0x0fff
          }

        case 'CALL': {
          const stack = new Uint16Array(state.stack)
          stack[0xf] = state.PC
          return {
            ...state,
            SP: state.SP + 1,
            stack,
            PC: action.command.opcode & 0x0fff
          }
        }
          
        case 'SE_VX_BYTE': {
          const { x, kk } = getVars(action.command)
          const PC = (state.V[x] === kk) ? state.PC + 2 : state.PC
          return {
            ...state,
            PC
          }
        }

        case 'SNE': {
          const { x, kk } = getVars(action.command)
          const PC = (state.V[x] != kk) ? state.PC + 2 : state.PC
          return {
            ...state,
            PC
          }
        }

        case 'SE_VX_VY': {
          const { x, y } = getVars(action.command)
          const PC = (state.V[x] === state.V[y]) ? state.PC + 2 : state.PC 
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
            V
          }
        }

        case 'ADD_VX_BYTE': {
          const { x, kk } = getVars(action.command)
          const V = new Uint8Array(state.V)
          V[x] = V[x] + kk
          return {
            ...state,
            V
          }
        }

        case 'LD_VX_VY': {
          const { x, y } = getVars(action.command)
          const V = new Uint8Array(state.V)
          V[x] = V[y]
          return {
            ...state,
            V
          }
        }

        case 'OR': {
          const { x, y } = getVars(action.command)
          const V = new Uint8Array(state.V)
          V[x] = V[x] | V[y]
          return {
            ...state,
            V
          }
        }

        case 'AND': {
          const { x, y } = getVars(action.command)
          const V = new Uint8Array(state.V)
          V[x] = V[x] & V[y]
          return {
            ...state,
            V
          }
        }

        case 'XOR': {
          const { x, y } = getVars(action.command)
          const V = new Uint8Array(state.V)
          V[x] = V[x] ^ V[y]
          return {
            ...state,
            V
          }
        }

        case 'ADD_VX_VY': {
          const { x, y } = getVars(action.command)
          const V = new Uint8Array(state.V)
          const sum = V[x] + V[y]
          V[x] = sum % 0x100
          V[0xf] = (sum > 0xff) ? 1 : 0
          return {
            ...state,
            V
          }
        }

        case 'SUB': {
          const { x, y } = getVars(action.command)
          const V  = new Uint8Array(state.V)
          const sub = V[x] - V[y]
          V[x] = (sub >= 0) ? sub : 0xff
          V[0xf] = (sub >= 0) ? 1 : 0
          return {
            ...state,
            V
          }
        }

        case 'SHR': {
          const { x } = getVars(action.command)
          const V = new Uint8Array(state.V)
          V[0xf] = V[x] & 1
          V[x] = V[x] >> 1
          return {
            ...state,
            V
          }
        }

        case 'SUBN': {
          const { x, y } = getVars(action.command)
          const V  = new Uint8Array(state.V)
          const sub = V[y] - V[x]
          V[x] = (sub >= 0) ? sub : 0xff
          V[0xf] = (sub >= 0) ? 1 : 0
          return {
            ...state,
            V
          }
        }

        case 'SHL': {
          const { x } = getVars(action.command)
          const V = new Uint8Array(state.V)
          V[0xf] = V[x] >> 7
          V[x] = (V[x] << 1 > 0xff) ? 0xff : V[x] << 1
          return {
            ...state,
            V
          }
        }

        case 'SNE_VX_VY': {
          const { x, y } = getVars(action.command)
          return {
            ...state,
            PC: (state.V[x] != state.V[y]) ? state.PC + 2 : state.PC
          }
        }

        case 'LD_I': {
          const { nnn } = getVars(action.command)
          return {
            ...state,
            I: nnn
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
            V
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

          let initialX = V[x]
          y = V[y]

          // Ready each memory address starting from Register I until n
          for (let i = 0; i < n; i++) {
            const spriteX = memory[I + i]
            x = initialX 

            for (let j = 0; j < 8; j++) {
              let bit = spriteX & (1 << (7 - j)) ? 1 : 0
 
              if (UI[y][x] & bit) {
                V[0xf] = 1
              }

              UI[y][x] ^= bit
              x++
            }
            y++
          }
          
          return {
            ...state,
            V,
            UI
          }
        }

        case 'SKP_VX': {
          const { x } = getVars(action.command)
          const key = state.V[x]
          return {
            ...state,
            // check if key Vx is pressed (1)
            PC: (state.KEY[key]) ? state.PC + 2 : state.PC
          }
        }

        case 'SKNP_VX': {
          const { x } = getVars(action.command)
          const key = state.V[x]
          return {
            ...state,
            // check if key Vx is up (0)
            PC: (!state.KEY[key]) ? state.PC + 2 : state.PC
          }
        }

        case 'LD_VX_DT': {
          const { x } = getVars(action.command)
          const { DT } = state
          const V = new Uint8Array(state.V)
          V[x] = DT
          return {
            ...state,
            V
          }
        }

        //////// LD_VX_K ///////

        case 'LD_DT_VX': {
          const { x } = getVars(action.command)
          return {
            ...state,
            DT: state.V[x]
          }
        }

        case 'LD_ST_VX': {
          const { x } = getVars(action.command)
          return {
            ...state,
            ST: state.V[x]
          }
        }

        case 'ADD_I_VX': {
          const { x } = getVars(action.command)
          return {
            ...state,
            I: state.I + state.V[x]
          }
        }

        case 'LD_F_VX': {
          const { x } = getVars(action.command)
          return {
            ...state,
            I: state.V[x] * 5
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
            memory
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
            memory
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
            V
          }
        }

        default:
          return state

      }

    default:
      return state
  }
}
