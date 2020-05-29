import initState from '../initState'
import { Chip8CPU } from '..';

test('initState with all the correct keys and values', () => {
  const initialState:Chip8CPU = {
    memory: new Uint8Array(4096),
    V: new Uint8Array(16),
    I: 0,
    DT: 0,
    ST: 0,
    PC: 0x200,
    SP: 0,
    stack: new Uint16Array(16),
    UI: Array(64).fill(Array(32))
  }

  expect(initState()).toEqual(initialState);
});
