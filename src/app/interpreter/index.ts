import { Address } from "../../store";
import { Drawable } from "../../view";

export type Instruction = {
  // label: string,
  opcode: string
}

export type InterpreterDependencies = {
  ROM: Array<string>,
  View: Drawable
}

export interface Interpreter {
  fetch(): Address,
  decode(address: Address): void,
  execute(instruction: Instruction): void
}
