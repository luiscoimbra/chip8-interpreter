import { InterpreterDependencies } from "."
import getCPU from "../CPU/getCPU"
import configureStore from "../../store"
import { loadRom } from "../../store/CPU/actions"
import { Opcode } from "../../store/CPU/types"

export default ({
  ROM,
  View
}: InterpreterDependencies): void => {

  const store = configureStore()
  store.dispatch(loadRom(ROM))
  
  const { Fetch } = getCPU(store)

  const run = () => {
    let { PC } = store.getState()   
    let opcode:Opcode = Fetch()
    // Execute()
    
  }

  run()
  // step(store);

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
