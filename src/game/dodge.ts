const H: number = 600;
const W: number = 400;
const canv: HTMLCanvasElement = document.createElement('canvas');
canv.width = W;
canv.height = H;
const ctx: CanvasRenderingContext2D = canv.getContext('2d');
const app: HTMLElement = document.getElementById('app');

app.appendChild(canv);

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
  constructor() {}
  update(game?: Game) {}
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
    this.y = H - this.height * 2;
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
  constructor(speed: number) {
    super();
    this.width = 99;
    this.height = 20;
    this.left = random(0, 100) % 2 === 0 ? 0 : 100;
    this.right = random(0, 100) % 2 === 0 ? 200 : 300;
    this.y = 0;
    this.highlight = false;
    this.speedY = speed || 5;
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
    this.stop = false;
    this.fps = fps;
    this.score = 0;
    this.msg = '游戏结束';
    this.frameCount = 0;
    this.bg = new Background();
    this.player = new Player();
    this.walls = [];
    this.speed = 5;
    document.addEventListener('keydown', this.keyPush.bind(this));
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
    this.frameCount++;
    if (this.stop) {
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

    if (!this.stop && this.frameCount % 60 === 0) {
      if (this.score > 0 && this.score % 10 === 0) {
        this.speed += 0.5;
      }
      this.walls.push(new Wall(this.speed));
    }
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
      ctx.fillText(this.msg, W / 2, H / 2);
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
    this.walls = [];
    this.player.reset();
  }
  pause() {
    this.stop = !this.stop;
    this.msg = '暂停';
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
