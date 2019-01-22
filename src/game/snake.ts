interface pos {
  x: number;
  y: number;
}

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
canv.width = 400;
canv.height = 400;
const ctx = canv.getContext('2d');
const app = document.getElementById('app');

app.appendChild(canv);

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
    const pos = game ? game.gs : 0;
    ctx.fillRect(x * pos, y * pos, width, height);
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
// 苹果
class Apple extends Square {
  constructor(obj: attr) {
    super(obj);
  }

  update(game?: Game) {
    const snake = game.snake;

    if (this.x === snake.x && this.y === snake.y) {
      snake.tail++;
      this.setPos(
        Math.floor(Math.random() * 20),
        Math.floor(Math.random() * 20)
      );
      const score = game.score + 1;
      game.setScore(score);
    }
  }
}
// 蛇
class Snake extends Square {
  tails: pos[];
  tail: number;
  constructor(obj: attr) {
    super(obj);
    this.tails = [];
    this.tail = 5;
  }

  update(game) {
    const ts = game.tc - 1;
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0) {
      this.setPos(ts, this.y);
    }
    if (this.x > ts) {
      this.setPos(0, this.y);
    }
    if (this.y < 0) {
      this.setPos(this.x, ts);
    }
    if (this.y > ts) {
      this.setPos(this.x, 0);
    }
    while (this.tails.length > this.tail) {
      this.tails.shift();
    }
  }

  render(game) {
    const { width, height, color } = this;
    ctx.fillStyle = color;
    const pos = game.gs || 0;
    this.tails.forEach(el => {
      ctx.fillRect(el.x * pos, el.y * pos, width, height);
      if (el.x === this.x && el.y === this.y) {
        this.tail = 5;
        game.score = 0;
      }
    });
    this.tails.push({ x: this.x, y: this.y });
  }
}
// 游戏主体
class Game {
  stop: boolean;
  fps: number;
  gs: number;
  tc: number;
  bg: Background;
  apple: Apple;
  snake: Snake;
  score: number;
  constructor(fps: number = 15) {
    this.stop = false;
    this.fps = fps;
    this.gs = 20;
    this.tc = 20;
    this.score = 0;
    this.bg = new Background({
      x: 0,
      y: 0,
      width: canv.width,
      height: canv.height,
      color: 'black'
    });
    this.apple = new Apple({
      x: 15,
      y: 15,
      width: this.tc - 2,
      height: this.tc - 2,
      color: 'red'
    });
    this.snake = new Snake({
      x: 10,
      y: 10,
      width: this.tc - 2,
      height: this.tc - 2,
      color: 'lime'
    });

    document.addEventListener('keydown', this.keyPush.bind(this));
  }
  run() {
    this.update();
    this.clear();
    this.draw();
    setTimeout(() => {
      this.run();
    }, 1000 / this.fps);
  }

  update() {
    if (this.stop) {
      return;
    }
    this.apple.update(this);
    this.snake.update(this);
  }

  clear() {
    ctx.clearRect(0, 0, canv.width, canv.height);
  }

  draw() {
    this.bg.render();
    this.apple.render(this);
    this.snake.render(this);
    this.renderScore();
  }

  setScore(score) {
    this.score = score;
  }

  renderScore() {
    ctx.font = '30px Georgia';
    ctx.fillStyle = 'white';
    ctx.fillText(this.score + '', 20, 30);
  }

  keyPush(e) {
    const snake = this.snake;
    switch (e.keyCode) {
      case 37:
        if (snake.speedX <= 0) {
          snake.setSpeed(-1, 0);
        }
        break;
      case 38:
        if (snake.speedY <= 0) {
          snake.setSpeed(0, -1);
        }
        break;
      case 39:
        if (snake.speedX >= 0) {
          snake.setSpeed(1, 0);
        }
        break;
      case 40:
        if (snake.speedY >= 0) {
          snake.setSpeed(0, 1);
        }
        break;
      case 32:
        this.stop = !this.stop;
        break;
    }
  }
}
export default new Game();
