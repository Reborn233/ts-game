const screenW = document.documentElement.clientWidth;
const screenH = document.documentElement.clientHeight;
const width = screenW > 500 ? 500 : screenW;
const W: number = width;
const H: number = screenH;
const canv: HTMLCanvasElement = document.createElement('canvas');
canv.width = W;
canv.height = H;
const ctx: CanvasRenderingContext2D = canv.getContext('2d');
const app: HTMLElement = document.getElementById('app');
// const startBtn = document.createElement('button');
// const pauseBtn = document.createElement('button');
// startBtn.textContent = '开始';
// pauseBtn.textContent = '暂停';

app.appendChild(canv);
// app.appendChild(startBtn);
// app.appendChild(pauseBtn);

// 随机数
const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
  constructor() { }
  update(game?: Game) { }
  render(game?: Game) {
    const { x, y, width, height, color = 'white' } = this;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }
}
// 横坐标
const actions = [0, 100, 200, 300];
// 玩家
class Player extends Square {
  left: number;
  right: number;
  constructor() {
    super();
    this.left = actions[1];
    this.right = actions[2];
    this.width = 99;
    this.height = 50;
    this.color = '#fff';
    this.y = canv.height - this.height * 4;
  }

  render() {
    const { left, right, y, height, width, color } = this;
    ctx.fillStyle = color;
    ctx.fillRect(left, y, width, height);
    ctx.fillRect(right, y, width, height);
  }

  move(dir: string, index) {
    switch (dir) {
      case 'left':
        this.left = actions[index];
        break;
      case 'right':
        this.right = actions[index];
        break;
    }
  }

  reset() {
    this.left = actions[1];
    this.right = actions[2];
  }
}
// 墙类
class Wall extends Square {
  left: number;
  right: number;
  highlight: boolean;
  constructor(speed: number = 10) {
    super();
    this.width = 99;
    this.height = 20;
    this.left = random(0, 100) % 2 === 0 ? 0 : 100;
    this.right = random(0, 100) % 2 === 0 ? 200 : 300;
    this.y = 0;
    this.highlight = false;
    this.speedY = speed;
  }

  update(game?: Game) {
    this.y += this.speedY;
  }
  offscreen() {
    return this.y > H;
  }

  render() {
    const { width, height, left, right, y } = this;
    ctx.fillStyle = 'lime';
    if (this.highlight) {
      ctx.fillStyle = 'red';
    }
    ctx.fillRect(left, y, width, height);
    ctx.fillRect(right, y, width, height);
  }

  hits(player: Player) {
    if (
      player.y < this.y + this.height &&
      player.y + player.height > this.y + this.height
    ) {
      if (player.left === this.left || player.right === this.right) {
        this.highlight = true;
        return true;
      }
    }
    this.highlight = false;
    return false;
  }
}
// 游戏背景
class Background extends Square {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.width = canv.width;
    this.height = canv.height;
    this.color = 'black';
  }
}
// 游戏主体
class Game {
  over: boolean;
  stop: boolean;
  fps: number;
  bg: Background;
  walls: Wall[];
  player: Player;
  score: number;
  msg: string;
  frameCount: number;
  speed: number;
  constructor(fps: number = 60) {
    this.stop = true;
    this.fps = fps;
    this.score = 0;
    this.msg = '点击屏幕开始';
    this.frameCount = 0;
    this.bg = new Background();
    this.player = new Player();
    this.walls = [];
    this.speed = 5;
    // startBtn.addEventListener('click', this.start.bind(this));
    // pauseBtn.addEventListener('click', this.pause.bind(this));
    canv.addEventListener('touchstart', this.touchstart.bind(this));
    canv.addEventListener('touchend', this.touchend.bind(this));
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
    this.frameCount++;
    if (this.stop || this.over) {
      return;
    }

    for (let i = this.walls.length - 1; i >= 0; i--) {
      const wall = this.walls[i];
      wall.update(this);

      // 碰撞
      if (wall.hits(this.player)) {
        this.gameOver();
      }

      // 超出屏幕 移除
      if (wall.offscreen()) {
        this.walls.splice(i, 1);
        this.score++;
      }
    }
  }
  clear() {
    ctx.clearRect(0, 0, canv.width, canv.height);
  }
  draw() {
    this.bg.render();
    for (let i = this.walls.length - 1; i >= 0; i--) {
      const wall = this.walls[i];
      wall.render();
    }
    this.player.render();
    this.renderScore();

    if (!this.stop) {
      const lastWall = this.walls[this.walls.length - 1];
      if (lastWall) {
        if (lastWall.y > 180 - this.speed) {
          if (this.score > 0 && this.score % 3 === 0) {
            this.speed += 5;
          }
          this.walls.push(new Wall(5));
        }
      } else {
        this.walls.push(new Wall(5));
      }
    }
  }
  setScore(score: number) {
    this.score = score;
  }
  renderScore() {
    ctx.font = '30px Georgia';
    ctx.fillStyle = 'white';
    ctx.fillText(this.score + '', 20, 30);
    if (this.stop || this.over) {
      ctx.fillStyle = 'red';
      ctx.fillText(this.msg, W / 2, H / 2);
      ctx.textAlign = 'center';
    }
  }
  gameOver() {
    this.msg = '游戏结束';
    this.over = true;
  }
  start() {
    if (this.stop === false) {
      return;
    }
    this.stop = false;
    this.score = 0;
    this.walls = [];
    this.player.reset();
    this.speed = 5;
  }
  pause() {
    this.stop = !this.stop;
    this.msg = '暂停';
  }
  touchstart(e) {
    e.preventDefault();
    this.start()
    if (this.stop) {
      return;
    }
    for (const touch of e.touches) {
      const { clientX, clientY } = touch;
      if (clientY > H / 2 && clientX < W / 2) {
        this.player.move('left', 0);
      } else if (clientY > H / 2 && clientX > W / 2) {
        this.player.move('right', 3);
      }
    }
  }
  touchend(e) {
    e.preventDefault();
    if (this.stop) {
      return;
    }
    const touches = [];
    for (const touch of e.touches) {
      const { clientX, clientY } = touch;
      if (clientY > H / 2 && clientX < W / 2) {
        touches.push('left');
      } else if (clientY > H / 2 && clientX > W / 2) {
        touches.push('right');
      }
    }
    if (touches.indexOf('left') > -1) {
      this.player.move('left', 0);
    } else {
      this.player.move('left', 1);
    }
    if (touches.indexOf('right') > -1) {
      this.player.move('right', 3);
    } else {
      this.player.move('right', 2);
    }
  }
  keyPush(e: KeyboardEvent) {
    switch (e.keyCode) {
      case 65: // 按下 A 左移
        this.player.move('left', 0);
        break;
      case 83: // 按下 s 右移
        this.player.move('right', 3);
        break;
      case 49: // 按 1 开始
        this.start();
        break;
      case 50: // 按 2 暂停
        this.pause();
        break;
    }
  }
  keyUp(e: KeyboardEvent) {
    switch (e.keyCode) {
      case 65: // 松开 A 恢复
        this.player.move('left', 1);
        break;
      case 83: // 松开 s 恢复
        this.player.move('right', 2);
        break;
    }
  }
}
export default new Game();
