import { CPUReducer } from "./CPU/reducers";
import { createStore } from "redux";

export type Chip8State = ReturnType<typeof CPUReducer>;

export default function configureStore() {

  const store = createStore(CPUReducer);

  return store;
}
