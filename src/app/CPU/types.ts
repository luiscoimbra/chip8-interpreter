import { Opcode } from "../../store/CPU/types";

export interface Instruction {
  type: string,
  opcode: Opcode
}
