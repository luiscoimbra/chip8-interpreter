import { CPU, CPUActionTypes, Opcode, COMMAND } from '../../store/CPU/types';
import { Store } from 'redux';
import DecToHex from '../util/decToHex';
import { Instruction } from './types';
import { executeCommand } from '../../store/CPU/actions';
import getInstruction from './getInstruction';

export default (store: Store<CPU, CPUActionTypes>) => {
  
  const _buildOpCode = (opCodeSegments: Array<number>): number => {
    let hexString = opCodeSegments
      .map(DecToHex)
      .map(d => d.padStart(2, "0"))
      .join("")

    hexString = "0x" + hexString
    return +hexString
  }

  return {

    Fetch: (): Opcode => {
      let { PC, memory } = store.getState()
      return  _buildOpCode([memory[PC], memory[PC + 1]])
    },
  
    Decode: (opcode:Opcode): Instruction => getInstruction(opcode),

    Execute: (command: Instruction): CPUActionTypes => store.dispatch(executeCommand(command))
  }
}
