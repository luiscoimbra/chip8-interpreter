import { Opcode } from "../../store/CPU/types";

interface OpcodeVars {
  x: number,
  y: number,
  kk: number,
  nnn: number,
  n: number
}

export default ({ opcode }: { opcode: Opcode }): OpcodeVars => ({
  x: (opcode & 0x0f00) >> 8,
  y: (opcode & 0x00f0) >> 4,
  kk: opcode & 0x00ff,
  nnn: opcode & 0x0fff,
  n: opcode & 0x000f
})
