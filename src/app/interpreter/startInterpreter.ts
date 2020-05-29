import { Chip8State } from "../state"
import initState from "../state/initState"
import insertROM from "../state/insertROM"
import { Drawable } from "../../view"
import { InterpreterDependencies } from "."

export default ({
  ROM,
  View
}: InterpreterDependencies): void => {

  let state:Chip8State = initState()
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
