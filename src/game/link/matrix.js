export default class Matrix {
  constructor(matrix, count) {
    this.count = parseInt(count);
    this.init(matrix);
  }

  init(matrix) {
    if (!matrix) return;
    let length = matrix
      .map(a => a.filter(b => b).length)
      .reduce((a, b) => parseInt(a) + parseInt(b));
    this.length = length;
    let arr = new Array(length / 2)
      .join(',')
      .split(',')
      .map(a => parseInt(Math.random() * this.count + 1));
    arr = arr.concat(arr);
    arr.sort(() => Math.random() > 0.5);
    let index = 0;
    this.matrix = matrix.map(a => {
      return a.map(b => {
        let v = b;
        if (b) {
          v = arr[index];
          index++;
        }
        return v;
      });
    });
    return this.matrix;
  }

  setMatrix(matrix) {
    this.matrix = this.init(matrix);
  }

  getPath(startPoint, endPoint) {
    let singleLinePath = this.singleLinePath(startPoint, endPoint);
    if (singleLinePath) {
      return this.concatPath(startPoint, singleLinePath, endPoint);
    }
    let doubleLinePath = this.doubleLinePath(startPoint, endPoint);
    if (doubleLinePath && doubleLinePath.length) {
      return this.concatPath(startPoint, doubleLinePath, endPoint);
    }
    let threeLinePath = this.threeLinePath(startPoint, endPoint);
    if (threeLinePath && threeLinePath.length) {
      return this.concatPath(startPoint, threeLinePath, endPoint);
    }
  }

  concatPath() {
    let arg = Array.prototype.slice.call(arguments);
    let arr = [];
    for (let i = 0; i < arg.length; i++) {
      arr = arr.concat(arg[i]);
    }
    return arr;
  }

  singleLinePath(startPoint, endPoint) {
    let path;
    //same col
    if (startPoint.x == endPoint.x) {
      if (Math.abs(startPoint.y - endPoint.y) == 1) {
        path = [];
      } else {
        let min = Math.min(startPoint.y, endPoint.y),
          max = Math.max(startPoint.y, endPoint.y);
        let arr = [],
          bool = true;
        for (let y = min + 1; y < max; y++) {
          if (this.matrix[y][startPoint.x] == 0) {
            arr.push({ x: startPoint.x, y: y });
          } else {
            bool = false;
            break;
          }
        }
        if (bool) {
          path = arr;
        }
      }
    }
    //same row
    if (startPoint.y == endPoint.y) {
      if (Math.abs(startPoint.x - endPoint.x) == 1) {
        path = [];
      } else {
        let min = Math.min(startPoint.x, endPoint.x),
          max = Math.max(startPoint.x, endPoint.x);
        let arr = [],
          bool = true;
        for (let x = min + 1; x < max; x++) {
          if (this.matrix[startPoint.y][x] == 0) {
            arr.push({ x: x, y: startPoint.y });
          } else {
            bool = false;
            break;
          }
        }
        if (bool) {
          path = arr;
        }
      }
    }
    return path;
  }

  doubleLinePath(startPoint, endPoint) {
    let path;
    if (startPoint.x !== endPoint.x && startPoint.y !== endPoint.y) {
      let point1 = {
        x: startPoint.x,
        y: endPoint.y
      };
      let point2 = {
        x: endPoint.x,
        y: startPoint.y
      };
      let c_point_1 = this.checkpoint(point1),
        c_point_2 = this.checkpoint(point2);
      if (!c_point_1) {
        let line1 = this.singleLinePath(startPoint, point1),
          line2 = this.singleLinePath(point1, endPoint);
        if (line1 && line2) {
          path = []
            .concat(point1)
            .concat(line1)
            .concat(line2);
          return path;
        }
      }
      if (!c_point_2) {
        let line3 = this.singleLinePath(startPoint, point2),
          line4 = this.singleLinePath(point2, endPoint);
        if (line3 && line4) {
          path = []
            .concat(point2)
            .concat(line3)
            .concat(line4);
          return path;
        }
      }
    }
    return path;
  }

  threeLinePath(startPoint, endPoint) {
    let patharr = [];
    let c_point = null;
    //x
    for (let i = 0; i < this.matrix[0].length; i++) {
      if (i != startPoint.x) {
        let point_x = {
          x: i,
          y: startPoint.y
        };

        c_point = this.checkpoint(point_x);
        if (!c_point) {
          let line_1 = this.singleLinePath(startPoint, point_x),
            line_2 = this.doubleLinePath(point_x, endPoint);
          if (line_1 && line_2) {
            patharr.push(line_1.concat(line_2).concat(point_x));
          }
        }
      }
    }
    //y
    for (let j = 0; j < this.matrix.length; j++) {
      if (j != startPoint.y) {
        let point_y = {
          x: startPoint.x,
          y: j
        };

        c_point = this.checkpoint(point_y);
        if (!c_point) {
          let line_3 = this.singleLinePath(startPoint, point_y),
            line_4 = this.doubleLinePath(point_y, endPoint);
          if (line_3 && line_4) {
            patharr.push(line_3.concat(line_4).concat(point_y));
          }
        }
      }
    }

    if (patharr.length) {
      patharr = patharr.sort(function(a, b) {
        return a.length > b.length;
      })[0];
    }

    return patharr.length ? patharr : false;
  }

  checkpoint(point) {
    return this.matrix[point.y][point.x];
  }
  resort() {
    console.log('!!!');
    if (this.length <= 0) return;

    let arr = [];
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[0].length; j++) {
        let x = this.matrix[i][j];
        if (x) {
          arr.push(x);
        }
      }
    }
    if (!arr || !arr.length) {
      return;
    }
    arr.sort(() => Math.random() > 0.5);
    let length = arr.length,
      index = 0;
    this.matrix = this.matrix.map(a => {
      return a.map(b => {
        if (b) {
          b = parseInt(arr[index]);
          index++;
        }
        return b;
      });
    });
    this.checkIsNeedResort();
  }

  Win() {
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[0].length; j++) {
        if (this.matrix[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  tip() {
    //先筛选非空的坐标
    let arr = [];
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[0].length; j++) {
        if (this.matrix[i][j]) {
          arr.push({ x: j, y: i });
        }
      }
    }
    if (!arr.length) {
      return false;
    }

    let result = [];
    let last = -1;
    let self = this;
    // console.log(arr.length);
    function choose() {
      let index = parseInt(Math.random() * arr.length);
      if (index == last) {
        choose();
        return;
      } else {
        last = index;
      }
      let coor1 = arr[index];

      let _arr = arr.filter((a, i) => {
        return (
          self.matrix[a.y][a.x] == self.matrix[coor1.y][coor1.x] && i != index
        );
      });
      for (let i = 0; i < _arr.length; i++) {
        let coor2 = _arr[i];
        let path = self.getPath(coor1, coor2);
        if (path) {
          result = [coor1, coor2];
          break;
        }
      }
      if (result.length == 0) {
        choose();
      }
    }
    choose();
    return result.length ? result : false;
  }

  remove(startPoint, endPoint, callback) {
    this.matrix[startPoint.y][startPoint.x] = 0;
    this.matrix[endPoint.y][endPoint.x] = 0;
    if (callback) callback.call(this, startPoint, endPoint);
    this.length -= 2;
  }

  checkIsNeedResort(callback) {
    let result = this.tip();
    if (!result) {
      console.log('需要重排');
      this.resort();
      if (callback) callback();
    }
    return !result;
  }

  getPattern() {
    return ['up', 'down', 'left', 'right', 'vertical', 'transverse', 'center'][
      parseInt(Math.random() * 7)
    ];
  }

  setPattern(pattern) {
    this.pattern = pattern || this.getPattern();
  }
}
