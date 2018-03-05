

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.restart()
  }

  restart() {
    console.log("hello");
    var gl = canvas.getContext("webgl");
    console.log(gl);
  }

}
