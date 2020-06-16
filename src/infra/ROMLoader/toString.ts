export default (ROMBuffer: Buffer): string => {
  let romString = ""
  ROMBuffer.map(h => {
    romString += " " + h.toString(16).padStart(2, "0")
    return h
  })

  return romString
}
