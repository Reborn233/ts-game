interface attr {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  speedX?: number;
  speedY?: number;
}
const canv = document.createElement('canvas');
canv.width = 320;
canv.height = 550;
const ctx = canv.getContext('2d');
const app = document.getElementById('app');

app.appendChild(canv);
// 定义砖块
const Tetris = [
  [[1], [1], [1], [1]],
  [
    [1, 0],
    [1, 0],
    [1, 1]
  ],
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1, 0],
    [1, 1],
    [0, 1]
  ],
  [
    [0, 1, 0],
    [1, 1, 1]
  ]
];
// 游戏元素类
class Square {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  speedX?: number;
  speedY?: number;

  constructor(obj: attr) {
    this.x = obj.x;
    this.y = obj.y;
    this.width = obj.width;
    this.height = obj.height;
    this.color = obj.color || 'white';
    this.speedX = obj.speedX || 0;
    this.speedY = obj.speedY || 0;
  }

  update(game?: Game) {}

  render(game?: Game) {
    const { x, y, width, height, color } = this;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }

  setPos(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setSpeed(x?: number, y?: number) {
    this.speedX = x;
    this.speedY = y;
  }
}
// 游戏背景
class Background extends Square {
  constructor(obj: attr) {
    super(obj);
  }
}
class Game {
  fps: number;
  bg: Background;
  constructor(fps: number = 15) {
    this.fps = fps;
    this.bg = new Background({
      x: 0,
      y: 0,
      width: canv.width,
      height: canv.height,
      color: 'black'
    });
  }
  run() {
    this.update();
    this.clear();
    this.draw();
    setTimeout(() => {
      this.run();
    }, 1000 / this.fps);
  }

  update() {}

  clear() {
    ctx.clearRect(0, 0, canv.width, canv.height);
  }

  draw() {
    this.bg.render();
  }
}

export default new Game();
