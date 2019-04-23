interface Color {
  r: number;
  g: number;
  b: number;
}
const canvas: HTMLCanvasElement = document.createElement('canvas');
canvas.width = 600;
canvas.height = 600;
const context: CanvasRenderingContext2D = canvas.getContext('2d');
const app: HTMLElement = document.getElementById('app');

app.appendChild(canvas);

let k = 0; // 背景渐变参数
const i = 50;
const r = 1 / i;
const g = 50 / i;
const b = 50 / i;

const offX = 300;
const offY = 120;

class Flower {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  n: number;
  radius: number;
  rad: number;
  color: Color;
  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    n = 10,
    radius = 20,
    r = 150,
    g = 100,
    b = 100
  ) {
    this.x = x;
    this.y = y;
    this.n = n;
    this.radius = radius;
    this.color = { r, g, b };
    this.rad = 2 * Math.PI * Math.random();
    this.context = context;
  }

  // 绘制花瓣
  drawPetal(i: number) {
    const delta = 0.3 + Math.random();
    const rand = this.radius * Math.random() + this.radius;

    this.context.beginPath();
    this.context.moveTo(
      this.x + Math.cos(this.rad) * 0.1,
      this.y + Math.sin(this.rad) * 0.1
    );
    this.context.fillStyle =
      'rgba(' +
      Math.floor(this.color.r * (1.25 - Math.random() * 0.5)) +
      ',' +
      Math.floor(this.color.g * (1.25 - Math.random() * 0.5)) +
      ',' +
      Math.floor(this.color.b * (1.25 - Math.random() * 0.5)) +
      ',' +
      i +
      ')';
    this.context.bezierCurveTo(
      this.x + Math.cos(this.rad + delta) * rand * i,
      this.y + Math.sin(this.rad + delta) * rand * i,
      this.x + Math.cos(this.rad + 2 * delta) * rand * i,
      this.y + Math.sin(this.rad + 2 * delta) * rand * i,
      this.x + 0.1 * Math.cos(this.rad + 3 * delta),
      this.y + 0.1 * Math.sin(this.rad + 3 * delta)
    );
    this.context.strokeStyle = 'rgba(55,55,55,0.1)';
    this.context.stroke();
    this.context.fill();
  }

  drawBud(i: number = 1) {
    this.context.beginPath();
    this.context.arc(this.x, this.y, i, 0, 2 * Math.PI, false);
    this.context.fillStyle = 'rbga(255,50,1,.5)';
    this.context.fill();
    if (i++ < 4) {
      setTimeout(() => {
        this.drawBud();
      }, 700);
    }
  }

  // 花瓣展开
  bloom() {
    for (let i = 1; i < 7; i += 1) {
      setTimeout(() => {
        this.drawPetal(i * i * 0.01);
      }, 10 * i);
    }

    this.rad += 2.4;
  }

  start() {
    for (let i = 0; i < this.n; i++) {
      setTimeout(() => {
        this.bloom();
      }, 100 * i);
      setTimeout(() => {
        this.drawBud(4);
      }, this.n * 100);
    }
  }
}

class Game {
  num: number;
  points: Flower[];
  backgd: HTMLElement;
  frameCount: number;
  constructor() {
    this.points = [];
    this.num = 0;
    this.frameCount = 0;
    this.backgd = document.getElementById('backgd');
  }

  // 爱心轨迹坐标点
  getHeartPoint(c: number) {
    const r =
      (Math.sin(c) * Math.sqrt(Math.abs(Math.cos(c)))) / (Math.sin(c) + 1.4) -
      2 * Math.sin(c) +
      2;
    const x = 125 * Math.cos(c) * r;
    const y = -125 * Math.sin(c) * r;
    return [x, y];
  }

  // 两点间的距离
  dist(x0: number, y0: number, x1: number, y1: number) {
    return Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
  }

  // 绘制爱心
  drawHeart() {
    const last = [0, 0];
    context.translate(offX, offY);
    for (let z = 4.7; z < 11; z += 0.04) {
      const h = this.getHeartPoint(z);
      if (this.dist(h[0], h[1], last[0], last[1]) < 40) {
        continue;
      } else {
        last[0] = h[0];
        last[1] = h[1];
        this.points.push(new Flower(context, h[0], h[1], 7, 35, 255, 12, 50));
      }
    }
  }

  // 绘制花朵
  drawFlowers() {
    if (this.points[this.num - 1]) {
      this.points[this.num - 1].start();
      if (this.num-- > 0) {
        setTimeout(this.drawFlowers.bind(this), 130);
      }
    }
  }

  // 绘制文字
  drawText() {
    context.font = '70px Arial';
    context.fillStyle = 'rbga(255,100,50,0.05)';
    context.fillText('I LOVE YOU', 0, 150);
  }

  drawName() {
    context.font = '70px Arial';
    context.fillStyle = 'rbga(255,70,70,0.06)';
    context.fillText('程宝宝', 0, 230);
  }

  days() {
    const lovestartday = '2019/03/20';
    const lovedays = Math.floor(
      (Date.parse(new Date() + '') - Date.parse(new Date(lovestartday) + '')) /
        86400000
    );
    context.font = '16px Arial';
    context.fillStyle = 'rgb(229,103,71)';
    context.fillText(`在一起 ${lovedays} 天啦!`, 0, 300);
  }

  // 背景渐变
  gradient() {
    const [red, green, blue] = [
      Math.floor(255 - r * k),
      Math.floor(255 - g * k),
      Math.floor(255 - b * k)
    ];
    this.backgd.style.backgroundColor = `rgb(${red},${green},${blue})`;
    k++;
  }

  run() {
    this.drawHeart();
    context.textAlign = 'center';
    for (let i = 0; i < 20; i++) {
      setTimeout(this.drawText, 120 * i);
    }
    setTimeout(() => {
      for (let j = 0; j < 20; j++) {
        setTimeout(this.drawName, 120 * j);
      }
      this.days();
    }, 3000);

    this.num = this.points.length;
    this.drawFlowers();

    for (let k = 0; k < i; k++) {
      setTimeout(this.gradient, 100 * k);
    }
  }
}

export default new Game();
