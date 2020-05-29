export default (UIMap:Array<Array<number>>) => {

    console.log(" ---------")
    UIMap.map((y: Array<number>) => {
    

      let ret:Array<string> = ["|"]
      y.map((x:number) => {
        ret.push((x === 1) ? "*" : " ")
      })
      ret.push("|")
      console.log(ret.join(" "))
      
    })

    console.log(" ---------")

  }


