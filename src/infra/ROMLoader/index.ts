/**
 * ROM Loader 
 * Loads the rom file and returs the hexdump
 * output: {data: Hexdump array}
 */

export type ROMData = {
  data: Buffer
}

export interface Loader {
  load(ROMPath: String): ROMData
}
