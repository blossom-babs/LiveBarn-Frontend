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

