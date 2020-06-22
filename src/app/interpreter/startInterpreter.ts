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

  let count = 180

  const run = () => {
    let { PC } = store.getState()   
    let opcode:Opcode = Fetch();

    (<any>window).opcode = () => opcode.toString(16)

    let instruction: Instruction = Decode(opcode)
    
    Execute(instruction)
    View.draw(store.getState().UI)
   
    if (count > 0) {
      // count--
      setTimeout(run, 10)
    }
  }

  run();

  (<any>window).run = run;
  (<any>window).store = () => store.getState()

}
