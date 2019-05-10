import MAP from './link/map';
import Matrix from './link/matrix';
const W: number = 600;
const H: number = 600;
const canv: HTMLCanvasElement = document.createElement('canvas');
canv.width = W;
canv.height = H;
const ctx: CanvasRenderingContext2D = canv.getContext('2d');
const app: HTMLElement = document.getElementById('app');

app.appendChild(canv);

const scale = 10; // 8列
const CONFIG = {
  WIDTH: (canv.width - scale - 1) / scale,
  HEIGHT: canv.height / scale,
  TOP: 1
};
const IMG_SRC = (id: number): string =>
  require('../assets/images/' + id + '.png');

// 图片元素
class Sprite {
  img: HTMLImageElement;
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  pos: number[];
  visible: boolean;
  selected: boolean;
  constructor(imgSrc = '', width = 0, height = 0, x = 0, y = 0, pos = [0, 0]) {
    this.img = new Image();
    this.img.src = imgSrc;
    this.id = imgSrc;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.pos = pos;
    this.visible = true;
    this.selected = false;
  }
  render() {
    if (!this.visible) {
      return;
    }
    if (this.selected) {
      ctx.fillStyle = '#d80049';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.drawImage(
        this.img,
        this.x + 2,
        this.y + 2,
        this.width - 4,
        this.height - 4
      );
      return;
    }
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
  choose() {
    this.selected = true;
  }
  dischoose() {
    this.selected = false;
  }
}
// 背景
class Background {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = W;
    this.height = H;
    this.color = 'black';
  }
  render() {
    const { x, y, width, height, color = 'white' } = this;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }
}
// 游戏主体
class Game {
  background: Background;
  fps: number;
  blocks: Sprite[];
  linePos: number[][] | boolean;
  m: Matrix;
  start: Sprite;
  end: Sprite;
  constructor() {
    this.fps = 60;
    this.blocks = [];
    this.linePos = [];
    this.start = null;
    this.end = null;
    this.m = new Matrix(MAP[0], 18);
    this.background = new Background();
    this.setup();
    this.bindEvent();
  }

  setup() {
    const array = this.m.matrix;
    const len = array.length;
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < array[i].length; j++) {
        if (array[i][j]) {
          const url = IMG_SRC(array[i][j]);
          this.blocks.push(
            new Sprite(
              url,
              CONFIG.WIDTH,
              CONFIG.WIDTH,
              j * (CONFIG.WIDTH + 1),
              i * (CONFIG.WIDTH + 1) + CONFIG.TOP,
              [i, j]
            )
          );
        }
      }
    }
  }
  bindEvent() {
    canv.addEventListener('mousedown', (e: MouseEvent) => {
      const [x, y] = [e.offsetX, e.offsetY];
      this.blocks.forEach(b => {
        if (this.contain({ x, y }, b) && b.visible) {
          if (this.start) {
            this.end = b;
            if (this.start === this.end) {
              this.start.dischoose();
              this.start = null;
              this.end = null;
              return;
            }
            this.linePos = this.canRemove(this.start, this.end);
            if (this.linePos) {
              console.log('remove');
              this.removePoint(this.start, this.end);
            } else {
              console.log('can not remove');
            }
          } else {
            this.start = b;
            this.start.choose();
          }
        }
      });
    });
  }
  canRemove(start: Sprite, end: Sprite): number[][] | boolean {
    // 不是相同图片
    if (start.id !== end.id) {
      return false;
    }
    const startPoint = {
      x: start.pos[1],
      y: start.pos[0]
    };
    const endPoint = {
      x: end.pos[1],
      y: end.pos[0]
    };
    // 返回两个图片直接的路径
    return this.m.getPath(startPoint, endPoint);
  }
  removePoint(start: Sprite, end: Sprite) {
    const startPoint = {
      x: start.pos[1],
      y: start.pos[0]
    };
    const endPoint = {
      x: end.pos[1],
      y: end.pos[0]
    };
    this.m.remove(startPoint, endPoint, () => {
      this.end.visible = false;
      this.start.visible = false;
      this.start = null;
      this.end = null;
    });
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
    this.blocks.forEach(b => {
      b.render();
    });
  }
  contain(a: any, b: Sprite) {
    if (a.x > b.x && a.x < b.x + b.width) {
      if (a.y > b.y && a.y < b.y + b.height) {
        return true;
      }
    }
    return false;
  }
}

export default new Game();
