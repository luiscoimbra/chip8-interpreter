import { InterpreterDependencies } from "."
import getCPU from "../CPU/getCPU"
import configureStore from "../../store"
import { loadRom, incrementPC, loadFontset, decrementDT } from "../../store/CPU/actions"
import { Opcode, INCREMENT_PC } from "../../store/CPU/types"
import { Instruction } from "../CPU/types"
import DecToHex from "../util/decToHex"
import getInstruction from "../CPU/getInstruction"
import getFontset from "../CPU/getFontset"
import { CPU_CLOCK } from "../constants/Processor"
import { Web } from "../../view/Web"

export default ({
  ROM
}: InterpreterDependencies): void => {

  const store = configureStore()
  const View = Web(store)
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

    if (store.getState().DT > 0) {
      store.dispatch(decrementDT())
    }
   
    if (count > 0) {
      // count--
      setTimeout(run, 600)
    }
  }

  run();

  (<any>window).run = run;
  (<any>window).store = () => store.getState()

}
