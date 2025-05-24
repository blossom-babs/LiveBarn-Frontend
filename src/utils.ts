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
