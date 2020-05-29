import { Chip8State } from ".";

export default (ROM:Buffer, state:Chip8State): Chip8State => {

  const { memory } = state
  const memoryOffset = 512
  
  // Get hexas from rom buffer and add to memory beggining on start offset
  for (let i: number = 0; i < ROM.length; i++) {
    memory[memoryOffset + i] = ROM[i]
  }

  return {
    memory,
    ...state
  }
}
