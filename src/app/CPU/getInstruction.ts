import { Opcode } from "../../store/CPU/types";
import { Instruction } from "./types";
import instructions from "./instructions";

export default (opcode: Opcode): Instruction => {

  const instruction = instructions.find((i: Instruction) => 
    ((opcode & i.mask) === i.pattern))
    
  return {
    ...instruction,
    opcode
  }
}
  

