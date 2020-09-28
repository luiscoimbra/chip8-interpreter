// Program Data must be placed in memory after 0x200. 
// All the previous memory slot are reserved to the 
// CHIP8 interpreter
// 512
export const MEMORY_OFFSET:number = 0x200
export const CPU_CLOCK:number = 1
export const KEY_MAP:Array<string> = [
  "1","2","3","4",
  "q","w","e","r",
  "a","s","d","f",
  "z","x","c","v"
]
