// 随机数
export const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
// 读取资源
export const loadImage = (obj: object) => {
  const res = {};
  const num = Object.keys(obj).length;
  return new Promise(resolve => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const img: HTMLImageElement = new Image();
        img.src = obj[key];
        img.onload = () => {
          res[key] = img;
          const resNum = Object.keys(res).length;
          if (resNum === num) {
            resolve(res);
          }
        };
      }
    }
  });
};

// 计算角度

export const getAngle = (start: any, end: any): number => {
  const diffX = end.x - start.x;
  const diffY = end.y - start.y;
  return (360 * Math.atan(diffY / diffX)) / (2 * Math.PI);
};
