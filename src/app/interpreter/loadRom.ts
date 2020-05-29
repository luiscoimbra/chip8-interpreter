import { CPU } from "./actionTypes";

export default (ROM:Array<string>) => ({
  type: CPU.LOAD_ROM,
  ROM
})
