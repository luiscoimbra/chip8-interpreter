import { Chip8CPU } from ".";
import { MEMORY_OFFSET } from "../app/constants/Processor";
import hexToDec from "../app/util/hexToDec";

export default (ROM:Array<string>, state:Chip8CPU): Chip8CPU => {

  const memory  = new Uint8Array(state.memory)
  
  // Get hexas from rom buffer and add to memory beggining on start offset
  for (let i: number = 0; i < ROM.length; i++) {
    memory[MEMORY_OFFSET + i] =  hexToDec(ROM[i])
  }

  return {
    ...state,
    memory
  }
}
