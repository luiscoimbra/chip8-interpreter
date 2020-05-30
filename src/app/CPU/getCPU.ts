import { CPU, CPUActionTypes, Opcode } from '../../store/CPU/types';
import { Store } from 'redux';
import DecToHex from '../util/decToHex';
import { Instruction } from './types';

export default (store: Store<CPU, CPUActionTypes>) => ({

  Fetch: (): Opcode => {
    let { PC, memory } = store.getState()
    return [memory[PC], memory[PC + 1]]
      .map(DecToHex)
      .map(h => h.padStart(2, "0"))
      .join("")
  },
  
  Decode: (opcode:Opcode): void => {
    
  }
  // execute
})
