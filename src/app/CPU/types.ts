import { Opcode } from "../../store/CPU/types";

export interface Instruction {
  name: string,
  mask: number,
  pattern: Opcode,
  opcode: Opcode,
}

