import { Opcode } from "../../store/CPU/types";
import { Instruction } from "./types";
import instructions from "./instructions";

export default (opcode: Opcode): Instruction => 
  instructions.find((i: Instruction) => 
    (opcode & i.mask) === i.pattern)

