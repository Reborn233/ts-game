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
// 鸟
class Bird extends Square {
  g: number;
  lift: number;
  v: number;
  constructor() {
    super();
    // 位置坐标
    this.x = 64;
    this.y = H / 2;
    // 长宽
    this.width = this.height = 15;
    // 重力
    this.g = 0.6;
    // 跳跃力度
    this.lift = -15;
    // 加速度
    this.v = 0;
  }
  update(game: Game) {
    // 下落
    this.v += this.g;
    this.v *= 0.9;
    this.y += this.v;
    // 落地
    if (this.y >= H - this.height) {
      this.y = H - this.height;
      this.v = 0;
      game.gameOver();
    }
    // 到顶！d=====(￣▽￣*)b
    if (this.y < 15) {
      this.y = 15;
      this.v = 0;
    }
  }
  jump() {
    this.v += this.lift;
  }
  render() {
    const { x, y, width, height, color = 'white' } = this;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, width, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }
  init() {
    this.y = H / 2;
    this.v = 0;
  }
}
// 管子
class Pipe extends Square {
  top: number;
  bottom: number;
  highlight: boolean;
  space: number;
  constructor() {
    super();
    this.top = random(50, H / 2); // 上面的管子
    this.bottom = 0; // 下面的管子
    this.width = 50;
    this.x = W;
    this.space = random(100, 150);
    this.speedX = 2;
    this.highlight = false;
  }
  update(game?: Game) {
    this.x -= this.speedX;
  }
  offscreen() {
    return this.x < -this.width;
  }
  hits(bird) {
    if (bird.y - bird.height < this.top || bird.y + bird.height > this.bottom) {
      if (
        bird.x + bird.width > this.x &&
        bird.x + bird.width < this.x + this.width
      ) {
        this.highlight = true;
        return true;
      }
    }
    this.highlight = false;
    return false;
  }
  render() {
    const { x, y, width, top, bottom } = this;
    ctx.fillStyle = 'lime';
    if (this.highlight) {
      ctx.fillStyle = 'red';
    }
    this.bottom = this.top + this.space;
    ctx.fillRect(x, 0, width, top);
    ctx.fillRect(x, this.bottom, width, H - bottom);
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
  bird: Bird;
  bg: Background;
  score: number;
  msg: string;
  pipes: Pipe[];
  frameCount: number;
  constructor(fps: number = 60) {
    this.stop = false;
    this.fps = fps;
    this.score = 0;
    this.msg = '游戏结束';
    this.frameCount = 0;
    this.pipes = [];
    this.bg = new Background();
    this.bird = new Bird();
    document.addEventListener('keydown', this.keyPush.bind(this));
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
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const pipe = this.pipes[i];
      pipe.update(this);

      // 碰撞
      if (pipe.hits(this.bird)) {
        this.gameOver();
      }

      // 超出屏幕 移除
      if (pipe.offscreen()) {
        this.pipes.splice(i, 1);
        this.score++;
      }
    }
    this.bird.update(this);
  }
  clear() {
    ctx.clearRect(0, 0, canv.width, canv.height);
  }
  draw() {
    this.bg.render();
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const pipe = this.pipes[i];
      pipe.render();
    }
    this.bird.render();
    this.renderScore();
    if (!this.stop && this.frameCount % 100 === 0) {
      this.pipes.push(new Pipe());
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
    this.bird.init();
    this.pipes = [];
    this.score = 0;
  }
  pause() {
    this.stop = !this.stop;
    this.msg = '暂停';
  }
  keyPush(e) {
    const bird = this.bird;
    switch (e.keyCode) {
      case 32: // 按 space 跳跃
        bird.jump();
        break;
      case 49: // 按 1 开始
        this.start();
        break;
      case 50: // 按 2 暂停
        this.pause();
        break;
    }
  }
}
export default new Game();
