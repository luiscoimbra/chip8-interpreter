import { InterpreterDependencies } from "."
import getCPU from "../CPU/getCPU"
import configureStore from "../../store"
import { loadRom, incrementPC, loadFontset } from "../../store/CPU/actions"
import { Opcode, INCREMENT_PC } from "../../store/CPU/types"
import { Instruction } from "../CPU/types"
import DecToHex from "../util/decToHex"
import getInstruction from "../CPU/getInstruction"
import getFontset from "../CPU/getFontset"
import { CPU_CLOCK } from "../constants/Processor"

export default ({
  ROM,
  View
}: InterpreterDependencies): void => {

  const store = configureStore()
  store.dispatch(loadRom(ROM))
  store.dispatch(loadFontset(getFontset()))
  
  const { Fetch, Decode, Execute } = getCPU(store)

  let count = 500

  const run = () => {
    let { PC } = store.getState()   
    let opcode:Opcode = Fetch()

    let instruction: Instruction
    try {
      instruction = Decode(opcode)
    } catch(e) {
      throw Error(e)
    }

    Execute(instruction)
    View.draw(store.getState().UI)
    store.dispatch(incrementPC())
    setTimeout(run, 10)
  }


  run()


}
