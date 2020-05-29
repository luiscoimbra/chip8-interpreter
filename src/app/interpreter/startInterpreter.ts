import { InterpreterDependencies } from "."
import { createStore } from 'redux'
import { CPUReducer } from "../../store/CPU/reducers"
import { loadRom } from "../../store/CPU/actions"

export default ({
  ROM,
  View
}: InterpreterDependencies): void => {

  const store = createStore(CPUReducer) 
  store.dispatch(loadRom(ROM))
 


  // const step: () => void = (): void => {

    
  //   View.draw([[1,1,1,1], [1,0,0,1], [1,0,0,1],  [1,0,0,1], [1,1,1,1]])
  // }

  // step()


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
