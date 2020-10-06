import { DISPLAY_WIDTH, DISPLAY_HEIGHT } from "../../store/constants"
import { KEY_MAP } from "../../app/constants/Processor"
import { pressKey, resetKey } from "../../store/CPU/actions"

const COLOR = '#FF0000'
const NO_COLOR = '#010333'
const ZOOM = 10

export const Web = (store:any) => { 
  
  const canvas:HTMLCanvasElement = document.createElement('canvas')
  canvas.id = "chip8"
  canvas.width = DISPLAY_WIDTH * ZOOM
  canvas.height = DISPLAY_HEIGHT * ZOOM
  const context: CanvasRenderingContext2D = canvas.getContext('2d')
  
  document.body.addEventListener('keydown', event => {

    const key = KEY_MAP.indexOf(event.key)
    console.log(key)
    
    if (key > -1) {
      store.dispatch(pressKey(key))
    }

    setTimeout(() => store.dispatch(resetKey()), 100)

  })

  document.body.append(canvas)

  const clean = () => {
    context.fillStyle = NO_COLOR
    context.fillRect(0, 0, DISPLAY_WIDTH * ZOOM, DISPLAY_HEIGHT * ZOOM)
  }
  
  return {

    draw: (UIMap: Array<Array<number>>) => {

        // console.log(UIMap[0].length)

        for (let y = 0; y < DISPLAY_HEIGHT; y++) {
          for (let x = 0; x < DISPLAY_WIDTH; x++) {
            context.fillStyle = UIMap[y][x] ? COLOR : NO_COLOR
            context.fillRect(
              x * ZOOM,
              y * ZOOM,
              ZOOM,
              ZOOM
            )
          }
      }

      

    }
  }
}
