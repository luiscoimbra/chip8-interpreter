import { Chip8CPU } from "../../store"
import initState from "../../store/initState"
import insertROM from "../../store/insertROM"
import { InterpreterDependencies } from "."
import { createStore, Store } from 'redux'

export default ({
  ROM,
  View
}: InterpreterDependencies): void => {

  let store:Store = createStore((store) => store, initState()) 
  // store.dispatch()

  // console.log(store.getState())

  let state:Chip8CPU = initState()
  state = insertROM(ROM, state)

  const step: () => void = (): void => {

    
    View.draw([[1,1,1,1], [1,0,0,1], [1,0,0,1],  [1,0,0,1], [1,1,1,1]])
  }

  step()


  // new Interpreter(state)
  // interpreter.start()

  // Interpreter
  // (state) {
    // step() {
    //   cpu.fetch()
    //   cpu.decode()
    //   cpu.execute()

        // step()

        // Draw()
    // }
  // }
}
