export const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

export interface IGameData {
  userId: string;
  width: number;
  height: number;
  maxMoves: number;
  target: number[];
}

export interface IcolorMatch{
    distance: number ,
    color: [number, number, number] ,
    coords: number[],
    percentageDiff:number,
  }

export function fadeColorByDistance(
    baseColor: [number, number, number],
    distance: number,
    maxDistance: number
  ): [number, number, number] {
    const factor = (maxDistance + 1 - distance) / (maxDistance + 1);
    return baseColor.map((c) => Math.floor(c * factor)) as [number, number, number];
  }
  

export function getBlendedColorForTile([r, g, b]:[number, number, number]):[number, number, number]{
    const maxChannel = Math.max(r, g, b, 255)
    const factor = 255 / maxChannel

    return [
        Math.round(r * factor),
        Math.round(g * factor),
        Math.round(b * factor),
    ]
}

export function getColorDistance(
    colorA: [number, number, number],
    colorB: [number, number, number]
):number{
    const [r1, g1, b1] = colorA
    const [r2, g2, b2] = colorB

    return Math.sqrt(
        Math.pow(r1 - r2, 2) +
        Math.pow(g1 - g2, 2) +
        Math.pow(b1 - b2, 2) 
    )
}

export function computeTileContributions({
    topSources,
    bottomSources,
    leftSources,
    rightSources,
    WIDTH,
    HEIGHT,
  }: {
    topSources: Array<[number, number, number] | null>;
    bottomSources: Array<[number, number, number] | null>;
    leftSources: Array<[number, number, number] | null>;
    rightSources: Array<[number, number, number] | null>;
    WIDTH: number;
    HEIGHT: number;
  }): [number, number, number][][] {
    const contributions: [number, number, number][][] = Array.from({ length: HEIGHT }, () =>
      Array.from({ length: WIDTH }, () => [0, 0, 0])
    );
  
    // Top
    topSources.forEach((color, col) => {
      if (!color) return;
      for (let row = 0; row < HEIGHT; row++) {
        const d = row + 1;
        const faded = fadeColorByDistance(color, d, HEIGHT);
        contributions[row][col] = contributions[row][col].map((c, i) => c + faded[i]) as [number, number, number];
      }
    });
  
    // Bottom
    bottomSources.forEach((color, col) => {
      if (!color) return;
      for (let row = 0; row < HEIGHT; row++) {
        const d = row + 1;
        const targetRow = HEIGHT - 1 - row;
        const faded = fadeColorByDistance(color, d, HEIGHT);
        contributions[targetRow][col] = contributions[targetRow][col].map((c, i) => c + faded[i]) as [number, number, number];
      }
    });
  
    // Left
    leftSources.forEach((color, row) => {
      if (!color) return;
      for (let col = 0; col < WIDTH; col++) {
        const d = col + 1;
        const faded = fadeColorByDistance(color, d, WIDTH);
        contributions[row][col] = contributions[row][col].map((c, i) => c + faded[i]) as [number, number, number];
      }
    });
  
    // Right
    rightSources.forEach((color, row) => {
      if (!color) return;
      for (let col = 0; col < WIDTH; col++) {
        const d = col + 1;
        const targetCol = WIDTH - 1 - col;
        const faded = fadeColorByDistance(color, d, WIDTH);
        contributions[row][targetCol] = contributions[row][targetCol].map((c, i) => c + faded[i]) as [number, number, number];
      }
    });
  
    return contributions;
  }
  
type RGB = [number, number, number]

  export function applyDirContribution(
    matrix: RGB[][],
    srcColor: RGB,
    length: number,
    iterate: (i: number) => {row: number; col: number}
  ) {
    for (let i = 0; i < length; i++) {
      const { row, col } = iterate(i);
      const faded = fadeColorByDistance(srcColor, i + 1, length);
      matrix[row][col] = matrix[row][col].map(
        (c, k) => c + faded[k]
      ) as RGB;
    }
  }
  