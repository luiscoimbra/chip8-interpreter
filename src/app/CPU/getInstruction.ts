import { Opcode } from "../../store/CPU/types";
import { Instruction } from "./types";
import instructions from "./instructions";

const isRND = ({ name }: { name: string }): boolean =>
  name === "RND" ? true : false;

const getRand = () => Math.floor(Math.random() * 256);

export default (opcode: Opcode): Instruction => {
  const instruction = instructions.find(
    (instruction: Instruction) =>
      (opcode & instruction.mask) === instruction.pattern
  );

  console.log(opcode.toString(16))

  if (!instruction) {
    throw Error(`Instruction ${opcode} not found!`);
  }

  return {
    ...instruction,
    opcode,
    rnd: isRND(instruction) ? getRand() : undefined,
  };
};
