export interface IPos {
  x: number;
  y: number;
}

export interface IImage extends IPos {
  texture: HTMLImageElement;
}

export interface IText extends IPos {
  font: string | number;
  color: string;
  txt: string;
}

export interface IRect extends IPos {
  color: string;
  width: number;
  height: number;
}
