const CPU = () => {

    // Chip8 is capable of access up to 4kb of memory
    const memory = new Array(4096)

    // REGISTERS
    // 16 General Purpose 8-bit (Vx) from V0 to VF
    const registers = new Uint8Array(16)
    // 1 Store memory addressess 16-bit from 0000 to FFFF
    const I = 0
    // Timers (when non-zero, it shoud automatically decrement at a rate of 60hz)
    const RD = 0
    const RT = 0
    // Program Counter 16-bit - Currently executing address
    const PC = 0
    // Stack Pointer 8-bit - point to the topmost level of the stack
    const SP = 0

    // Stack of returning addressess from subroutines
    const stack = new Uint16Array(16)

    return {
        memory
    }
    
}

let cpu = CPU()



