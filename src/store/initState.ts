import { Chip8CPU } from "."
import { MEMORY_OFFSET } from "../app/constants/Processor"

export default ():Chip8CPU => (
  {
    memory: new Uint8Array(4096),
    V: new Uint8Array(16),
    I: 0,
    DT: 0,
    ST: 0,
    PC: MEMORY_OFFSET,
    SP: 0,
    stack: new Uint16Array(16),
    UI: Array(64).fill(Array(32))
  }
)



