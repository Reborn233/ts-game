const s: number = 450; // 背景尺寸
const bs: number = 100; // 方块尺寸
const space: number = 10; // 空隙
// 颜色表
const COLOR = {
  2: 'rgb(236,228,219)',
  4: 'rgb(234,224,203)',
  8: 'rgb(233,179,129)',
  16: 'rgb(232,153,108)',
  32: 'rgb(230,130,103)',
  64: 'rgb(229,103,71)',
  128: 'rgb(232,206,126)',
  256: 'rgb(232,204,114)',
  512: 'rgb(232,199,106)',
  1024: 'rgb(231,198,89)'
};

const MIN = 1;
const MAX = 4;

const canv: HTMLCanvasElement = document.createElement('canvas');
canv.width = s;
canv.height = s;
const ctx: CanvasRenderingContext2D = canv.getContext('2d');
const app: HTMLElement = document.getElementById('app');

app.appendChild(canv);
// 随机数
const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const hasEle = (array: Block[], ele): number => {
  array.forEach((o, i) => {
    if (o.number === ele.number && o.x === ele.x && o.y === ele.y) {
      return i;
    }
  });
  return -1;
};

// 圆角矩形
const radiusRect = (left, top, width, height, r) => {
  const pi = Math.PI;
  ctx.beginPath();
  ctx.arc(left + r, top + r, r, -pi, -pi / 2);
  ctx.arc(left + width - r, top + r, r, -pi / 2, 0);
  ctx.arc(left + width - r, top + height - r, r, 0, pi / 2);
  ctx.arc(left + r, top + height - r, r, pi / 2, pi);
  ctx.fill();
  ctx.closePath();
};
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
  render(game?: Game) {
    const { x, y, width, height, color = 'white' } = this;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }
  renderRadius() {
    const { x, y, width, height, color = 'white' } = this;
    ctx.fillStyle = color;
    radiusRect(x, y, width, height, 10);
  }
}
const coord = [
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 1],
  [1, 2],
  [2, 2],
  [3, 2],
  [4, 2],
  [1, 3],
  [2, 3],
  [3, 3],
  [4, 3],
  [1, 4],
  [2, 4],
  [3, 4],
  [4, 4]
];

// 游戏背景
class Background extends Square {
  coord: any[];
  brown?: string;
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.width = canv.width;
    this.height = canv.height;
    this.color = 'rgb(185,173,162)';
    this.brown = 'rgb(202,192,180)';
    this.coord = coord;
  }
  render() {
    super.renderRadius();
    ctx.fillStyle = this.brown;
    for (const c of this.coord) {
      const [x, y] = c;
      radiusRect(
        space * x + bs * (x - 1),
        space * y + bs * (y - 1),
        bs,
        bs,
        10
      );
    }
  }
}
// 方块类
class Block extends Square {
  number: number;
  constructor(
    x: number = random(1, 4),
    y: number = random(1, 4),
    n: number = 2
  ) {
    super();
    this.number = n;
    this.x = x;
    this.y = y;
    this.width = bs;
    this.height = bs;
  }

  update(game?: Game) {
    this.move(game.dir, game);
  }
  move(dir: string, game?: Game) {
    switch (dir) {
      case 'top':
        if (game.canMove(this, dir)) {
          this.y -= 1;
        }
        break;
      case 'bottom':
        if (game.canMove(this, dir)) {
          this.y += 1;
        }
        break;
      case 'left':
        if (game.canMove(this, dir)) {
          this.x -= 1;
        }
        break;
      case 'right':
        if (game.canMove(this, dir)) {
          this.x += 1;
        }
        break;
    }
  }
  combine() {
    this.number *= 2;
  }

  isEqual(b: Block) {
    if (b.number === this.number && b.x === this.x && b.y === this.y) {
      return true;
    }
    return false;
  }

  render() {
    this.renderRadius();
    this.renderText();
  }
  renderRadius() {
    const { x, y, width, height } = this;
    const color = COLOR[this.number];
    ctx.fillStyle = color;
    radiusRect(
      space * x + bs * (x - 1),
      space * y + bs * (y - 1),
      width,
      height,
      10
    );
  }
  renderText() {
    const { x, y } = this;
    const l = space * x + bs * (x - 1) + bs / 2;
    const t = space * y + bs * (y - 1) + bs / 2 + space * 3;
    ctx.font = '90px Microsoft YaHei';
    ctx.fillStyle = 'white';
    ctx.fillText(this.number + '', l, t);
    ctx.textAlign = 'center';
  }
}
// 游戏主体
class Game {
  stop: boolean;
  fps: number;
  bg: Background;
  blocks: Block[];
  score: number;
  msg: string;
  frameCount: number;
  speed: number;
  dir: string;
  constructor(fps: number = 60) {
    this.stop = false;
    this.fps = fps;
    this.score = 0;
    this.msg = '游戏结束';
    this.frameCount = 0;
    this.dir = '';
    this.bg = new Background();
    this.blocks = [
      new Block(1, 1),
      new Block(2, 1),
      new Block(4, 1),
      new Block(2, 2)
    ];

    document.addEventListener('keydown', this.keyDown.bind(this));
    document.addEventListener('keyup', this.keyUp.bind(this));
  }
  run() {
    this.update(); // 更新
    this.clear(); // 清除
    this.draw(); // 画图
    setTimeout(() => {
      this.run();
    }, 1000 / this.fps);
  }

  update() {
    if (this.stop) {
      return;
    }
    this.blocks.forEach(b => {
      b.update(this);
    });

    this.blocks.reduce((resp, obj, i) => {
      const originObj = resp.find(
        item =>
          item.number === obj.number && item.x === obj.x && item.y === obj.y
      );
      if (originObj) {
        originObj.number += obj.number;
        this.blocks.splice(i, 1);
      } else {
        resp.push(obj);
      }
      return resp;
    }, []);
  }
  clear() {
    ctx.clearRect(0, 0, canv.width, canv.height);
  }
  draw() {
    this.bg.render();
    this.blocks.forEach(b => {
      b.render();
    });
  }
  canMove(block: Block, dir: string) {
    if (dir === 'left') {
      if (block.x === MIN) {
        return false;
      }
      const left = this.blocks.find(
        b => b.x === block.x - 1 && b.y === block.y
      );
      return !(left && left.number !== block.number);
    } else if (dir === 'right') {
      if (block.x === MAX) {
        return false;
      }
      const right = this.blocks.find(
        b => b.x === block.x + 1 && b.y === block.y
      );
      return !(right && right.number !== block.number);
    } else if (dir === 'top') {
      if (block.y === MIN) {
        return false;
      }
      const top = this.blocks.find(b => b.y === block.y - 1 && b.x === block.x);
      return !(top && top.number !== block.number);
    } else if (dir === 'bottom') {
      if (block.y === MAX) {
        return false;
      }
      const bottom = this.blocks.find(
        b => b.y === block.y + 1 && b.x === block.x
      );
      return !(bottom && bottom.number !== block.number);
    }
  }
  addBlock(x: number, y: number) {
    this.blocks.push(new Block(x, y));
  }
  setScore(score: number) {
    this.score = score;
  }
  renderScore() {
    ctx.font = '30px Georgia';
    ctx.fillStyle = 'white';
    ctx.fillText(this.score + '', 20, 30);
    if (this.stop) {
      ctx.fillStyle = 'red';
      ctx.fillText(this.msg, s / 2, s / 2);
      ctx.textAlign = 'center';
    }
  }
  gameOver() {
    this.msg = '游戏结束';
    this.stop = true;
  }
  start() {
    this.stop = false;
    this.score = 0;
  }
  pause() {
    this.stop = !this.stop;
    this.msg = '暂停';
  }
  keyDown(e: KeyboardEvent) {
    const key = e.keyCode;
    switch (key) {
      case 37:
        // 左
        this.move('left');
        break;
      case 38:
        // 上
        this.move('top');
        break;
      case 39:
        // 右
        this.move('right');
        break;
      case 40:
        // 下
        this.move('bottom');
        break;
    }
  }
  keyUp() {
    const r = {
      left: [4, random(1, 4)],
      right: [1, random(1, 4)],
      top: [random(1, 4), 4],
      bottom: [random(1, 4), 1]
    };
    this.addBlock(r[this.dir[0]], r[this.dir[1]]);
    this.dir = '';
  }
  move(dir: string) {
    this.dir = dir;
  }
}
export default new Game();
