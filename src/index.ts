import startInterpreter from './app/interpreter/startInterpreter'
import loadRomFromMemory from './infra/ROMLoader/loadRomFromMemory'
import { InterpreterDependencies } from './app/interpreter'
import { ConsoleView } from './view/ConsoleView'

const ROM:Buffer = loadRomFromMemory("MAZE")

const dependencies: InterpreterDependencies = {
  ROM,
  View: ConsoleView()
}

startInterpreter(dependencies)




