import { Address } from "../state";
import { Drawable } from "../../view";

export type Instruction = {
  // label: string,
  opcode: string
}

export type InterpreterDependencies = {
  ROM: Buffer,
  View: Drawable
}

export interface Interpreter {
  fetch(): Address,
  decode(address: Address): void,
  execute(instruction: Instruction): void
}
