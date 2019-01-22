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
  1024: 'rgb(231,198,89)',
  2048: 'rgb(291,188,63)'
};
// 字体大小和间隙
const FONT = {
  1: {
    size: 90,
    space: 30
  },
  2: {
    size: 75,
    space: 26
  },
  3: {
    size: 55,
    space: 20
  },
  4: {
    size: 40,
    space: 15
  }
};

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

// 圆角矩形
const radiusRect = (
  left: number,
  top: number,
  width: number,
  height: number,
  r: number
) => {
  const pi = Math.PI;
  ctx.beginPath();
  ctx.arc(left + r, top + r, r, -pi, -pi / 2);
  ctx.arc(left + width - r, top + r, r, -pi / 2, 0);
  ctx.arc(left + width - r, top + height - r, r, 0, pi / 2);
  ctx.arc(left + r, top + height - r, r, pi / 2, pi);
  ctx.fill();
  ctx.closePath();
};

// 往左移动数组数字相同合并 (核心算法)  上右下 在此基础拓展
const moveArray = (arr: number[]): number[] => {
  /**
   *  遍历数组从数组的的当前位置的下一个开始遍历，找不是0的位置()
   *  如果没找到什么也不做
   *  如果找到
   *  如果当前位置是0，那么像当前位置与下一个进行互换（当前位置获得下一个位置的数据，并且将下一个位置数据置为0，将下标减一）
   *  如果当前位置和下一个位置相等，将当前位置数据*2，下个位置数据置0
   */
  let i: number;
  let nextI: number;
  let m: number;
  const len = arr.length;
  for (i = 0; i < len; i += 1) {
    // 先找nextI
    nextI = -1;
    for (m = i + 1; m < len; m++) {
      if (arr[m] !== 0) {
        nextI = m;
        break;
      }
    }

    if (nextI !== -1) {
      // 存在下个不为0的位置
      if (arr[i] === 0) {
        arr[i] = arr[nextI];
        arr[nextI] = 0;
        i -= 1;
      } else if (arr[i] === arr[nextI]) {
        arr[i] = arr[i] * 2;
        arr[nextI] = 0;
      }
    }
  }
  return arr;
};

// 二维数组旋转
const rotateLeft = (matrix: number[][]) => {
  // 左转
  // 列 = 行
  // 行 = n - 1 - 列(j);  n表示总行数
  const temp = [];
  const len = matrix.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      const k = len - 1 - j;
      if (!temp[k]) {
        temp[k] = [];
      }
      temp[k][i] = matrix[i][j];
    }
  }

  return temp;
};
// 二维数组旋转
const rotateRight = (matrix: number[][]) => {
  // 右转
  // 行 = 列
  // 列 = n - 1 - 行(i);  n表示总列数
  const temp = [];
  const len = matrix.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      const k = len - 1 - i;
      if (!temp[j]) {
        temp[j] = [];
      }
      temp[j][k] = matrix[i][j];
    }
  }

  return temp;
};

// 游戏背景
class Background {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  coord: any[];
  brown?: string;
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = canv.width;
    this.height = canv.height;
    this.color = 'rgb(185,173,162)';
    this.brown = 'rgb(202,192,180)';
    this.coord = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  }
  render() {
    this.renderRadius();
    ctx.fillStyle = this.brown;
    for (let i = 0; i < this.coord.length; i++) {
      for (let j = 0; j < this.coord[i].length; j++) {
        radiusRect(
          space * (i + 1) + bs * i,
          space * (j + 1) + bs * j,
          bs,
          bs,
          10
        );
      }
    }
  }
  renderRadius() {
    const { x, y, width, height, color = 'white' } = this;
    ctx.fillStyle = color;
    radiusRect(x, y, width, height, 10);
  }
}
// 方块类
class Blocks {
  blocks: number[][];
  row: number;
  col: number;
  fontSize: number;
  constructor() {
    this.row = 4; // 4行
    this.col = 4; // 4列
    this.blocks = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    this.fontSize = 90;
    this.init();
  }

  update(game?: Game) {}
  init() {
    for (let i = 0; i < this.row; i++) {
      this.blocks[i] = [];
      for (let j = 0; j < this.col; j++) {
        this.blocks[i][j] = 0;
      }
    }
    this.addBlock();
    this.addBlock();
  }
  move(dir: number) {
    switch (dir) {
      case 37:
        this.left();
        break;
      case 39:
        this.right();
        break;
      case 38:
        this.up();
        break;
      case 40:
        this.down();
        break;
    }
    this.addBlock();
  }
  up() {
    const arr = [];
    for (let i = 0; i < this.row; i++) {
      arr.push(moveArray(rotateLeft(this.blocks)[i]));
    }
    this.blocks = rotateRight(arr);
  }
  down() {
    const arr = [];
    for (let i = 0; i < this.row; i++) {
      arr.push(moveArray(rotateRight(this.blocks)[i]));
    }
    this.blocks = rotateLeft(arr);
  }
  left() {
    const arr = [];
    for (let i = 0; i < this.row; i++) {
      arr.push(moveArray(this.blocks[i]));
    }
    this.blocks = arr;
  }
  right() {
    const arr = [];
    for (let i = 0; i < this.row; i++) {
      arr.push(moveArray(this.blocks[i].reverse()).reverse());
    }
    this.blocks = arr;
  }

  over(): boolean {
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        if (this.blocks[i][j] === 0) {
          return false;
        }
      }
    }
    return true;
  }
  gameOver() {
    /**
     * 循环二维数组 从左到右，从上到下比较相邻数字 是否相等
     * 相等表示游戏可以继续 或者  有一位为0  也可以继续游戏
     * 否则 游戏结束
     */
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        if (this.blocks[i][j] === 0) {
          return false;
        } else if (
          j < this.blocks[i].length - 1 &&
          this.blocks[i][j] === this.blocks[i][j + 1]
        ) {
          return false;
        } else if (
          i < this.blocks.length - 1 &&
          this.blocks[i][j] === this.blocks[i + 1][j]
        ) {
          return false;
        }
      }
    }
    return true;
  }

  win() {
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        if (this.blocks[i][j] === 2048) {
          return true;
        }
      }
      return false;
    }
  }

  addBlock() {
    // 没有空格添加
    if (this.over()) {
      console.log('over');
      return false;
    }
    const row = random(0, 3);
    const col = random(0, 3);
    if (!this.blocks[row][col]) {
      this.blocks[row][col] = 2;
    } else {
      this.addBlock();
    }
  }

  render() {
    this.renderRadius();
  }
  renderRadius() {
    for (let i = 0; i < this.blocks.length; i++) {
      for (let j = 0; j < this.blocks[i].length; j++) {
        const b = this.blocks[i][j];
        if (b) {
          ctx.fillStyle = COLOR[b];
          radiusRect(
            space * (j + 1) + bs * j,
            space * (i + 1) + bs * i,
            bs,
            bs,
            10
          );
          this.renderText(i, j, b);
        }
      }
    }
  }
  renderText(row: number, col: number, num: number) {
    ctx.fillStyle = 'white';
    this.fontSize = FONT[('' + num).length].size;
    const l = space * (col + 1) + bs * col + bs / 2;
    const t =
      space * (row + 1) + bs * row + bs / 2 + FONT[('' + num).length].space;
    ctx.font = `${this.fontSize}px Microsoft YaHei`;
    ctx.fillText(num + '', l, t);
    ctx.textAlign = 'center';
  }
}
// 游戏主体
class Game {
  fps: number;
  bg: Background;
  blocks: Blocks;
  stop: boolean;
  msg: number;
  constructor(fps: number = 60) {
    this.fps = fps;
    this.stop = false;
    this.bg = new Background();
    this.blocks = new Blocks();
    this.msg = 1;

    document.addEventListener('keydown', this.keyDown.bind(this));
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
    this.bg.render();
    this.blocks.render();
    this.renderMsg();
  }
  renderMsg() {
    const msg = {
      1: 'Game Over',
      2: 'You Win'
    };
    ctx.font = '60px Microsoft YaHei';
    if (this.stop) {
      ctx.fillStyle = 'rgba(0,0,0,.5)';
      radiusRect(0, 0, s, s, 10);
      ctx.fillStyle = this.msg === 1 ? 'red' : 'white';
      ctx.fillText(msg[this.msg], s / 2, s / 2);
      ctx.textAlign = 'center';
    }
  }
  start() {
    this.blocks.init();
    this.stop = false;
    this.msg = 1;
  }
  keyDown(e: KeyboardEvent) {
    const key = e.keyCode;
    if (key === 49) {
      this.start();
      return;
    }
    if (this.stop) {
      return;
    }
    if (this.blocks.gameOver()) {
      this.stop = true;
      this.msg = 1;
      return false;
    }
    if (this.blocks.win()) {
      this.stop = true;
      this.msg = 2;
      return false;
    }
    this.blocks.move(key);
  }
}
export default new Game();
