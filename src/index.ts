import startInterpreter from './app/interpreter/startInterpreter'
import loadRomFromMemory from './infra/ROMLoader/loadRomFromMemory'
import { InterpreterDependencies } from './app/interpreter'
import { Web } from './view/Web'
import { DISPLAY_WIDTH } from './store/constants'
import loadRom from './infra/ROMLoader/loadRom'
import { ConsoleView } from './view/ConsoleView'
import toString from './infra/ROMLoader/toString'


const ROM:Array<string> = loadRomFromMemory("MAZE")

// const ROM2 = loadRom("./roms/INVADERS")

// console.log(toString(ROM2))
// const View = ConsoleView()



const dependencies: InterpreterDependencies = {
  ROM
}

startInterpreter(dependencies)




