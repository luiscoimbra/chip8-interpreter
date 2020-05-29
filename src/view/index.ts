import draw from "./ConsoleView/draw";

export interface Drawable {
  draw(Bitmap: Array<Array<number>>): void
}


