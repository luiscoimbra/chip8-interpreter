import { InterpreterDependencies } from "."
import getCPU from "../CPU/getCPU"
import configureStore from "../../store"
import { loadRom, incrementPC, loadFontset } from "../../store/CPU/actions"
import { Opcode, INCREMENT_PC } from "../../store/CPU/types"
import { Instruction } from "../CPU/types"
import DecToHex from "../util/decToHex"
import getInstruction from "../CPU/getInstruction"
import getFontset from "../CPU/getFontset"

export default ({
  ROM,
  View
}: InterpreterDependencies): void => {

  const store = configureStore()
  store.dispatch(loadRom(ROM))
  store.dispatch(loadFontset(getFontset()))
  
  const { Fetch, Decode, Execute } = getCPU(store)

  let count = 20

  const run = () => {
    let { PC } = store.getState()   
    let opcode:Opcode = Fetch()
    let instruction:Instruction = Decode(opcode)
    Execute(instruction)
    store.dispatch(incrementPC())
  }

  while(count > 0) {
    run()
    count--
  }
  
  // step(store);

  // const step: () => void = (): void => {

    
  //   View.draw([[1,1,1,1], [1,0,0,1], [1,0,0,1],  [1,0,0,1], [1,1,1,1]])
  // }

  // step()


}
