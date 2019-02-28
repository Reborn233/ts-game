import { random } from '../libs/utils';
const W: number = 600;
const H: number = 400;
const canv: HTMLCanvasElement = document.createElement('canvas');
canv.width = W;
canv.height = H;
const ctx: CanvasRenderingContext2D = canv.getContext('2d');
const app: HTMLElement = document.getElementById('app');

app.appendChild(canv);

// 元素基础类
class Square {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  speedX?: number;
  speedY?: number;
  constructor() {}
  update(game?: Game) {}
  render() {
    const { x, y, width, height, color = 'white' } = this;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }
}

class Circle {
  x: number;
  y: number;
  r: number;
  color: string;
  constructor() {}

  update(game?: Game) {}

  render() {
    const { x, y, r, color = 'white' } = this;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }
}

class Background extends Square {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.width = W;
    this.height = H;
    this.color = 'black';
  }
}

class Star extends Circle {
  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
    this.r = 1;
  }
}

class Game {
  background: Background;
  stars: Star[];
  fps: number;
  constructor() {
    this.fps = 60;
    this.background = new Background();
    this.stars = [];
    for (let i = 0; i < 100; i++) {
      this.stars.push(new Star(random(0, 600), random(0, 400)));
    }
  }
  run() {
    this.update(); // 更新
    this.clear(); // 清除
    this.draw(); // 画图
    setTimeout(() => {
      this.run();
    }, 1000 / this.fps);
  }

  update() {}
  clear() {
    ctx.clearRect(0, 0, canv.width, canv.height);
  }
  draw() {
    this.background.render();
    this.stars.forEach((s: Star) => {
      s.render();
    });
  }
}

export default new Game();
