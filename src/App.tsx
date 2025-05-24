import InfoLine from "./components/InfoLine";
import useApi from "./hooks/useApi";
import "./App.css";
import { useEffect, useState } from "react";
import { fadeColorByDistance } from "./utils";

const colorMap: [number, number, number][] = [
  [255, 0, 0], //red
  [0, 255, 0], //green
  [0, 0, 255], //blue
];

function App() {
  const { status, gameData, userMoves } = useApi();

  const WIDTH: number = gameData ? gameData.width : 0;
  const HEIGHT: number = gameData ? gameData.height : 0;

  console.log({ WIDTH, HEIGHT });

  const [moveCount, setMoveCount] = useState(0);
  const [topSources, setTopSources] = useState<
    Array<[number, number, number] | null>
  >([]);
  const [leftSources, setLeftSources] = useState<
    Array<[number, number, number] | null>
  >([]);
  const [rightSources, setRightSources] = useState<
    Array<[number, number, number] | null>
  >([]);
  const [bottomSources, setBottomSources] = useState<
    Array<[number, number, number] | null>
  >([]);
  const [tiles, setTiles] = useState<[number, number, number][][]>([]);

  console.log({ bottomSources });

  useEffect(() => {
    if (gameData) {
      setTopSources(Array(gameData.width).fill(null));
      setLeftSources(Array(gameData.height).fill(null));
      setBottomSources(Array(gameData.width).fill(null));
      setRightSources(Array(gameData.height).fill(null));
      setTiles(
        Array.from({ length: gameData.height }, () =>
          Array.from({ length: gameData.width }, () => [0, 0, 0])
        )
      );
    }
  }, [gameData]);

  function handleSourceClick(
    index: number,
    dir: "row" | "col",
    side: "top" | "bottom" | "right" | "left"
  ) {
    if (moveCount >= 3) return;

    const color = colorMap[moveCount];
    const newTiles = [...tiles];

    if (dir === "col") {
      if (side === "top") {
        if (topSources[index]) return;
        const copyTopSources = [...topSources];
        copyTopSources[index] = color;
        setTopSources(copyTopSources);

        for (let row = 0; row < HEIGHT; row++) {
          const distance = row + 1;
          const faded = fadeColorByDistance(color, distance, HEIGHT)
          const rowCopy = [...newTiles[row]];
          rowCopy[index] = faded;
          newTiles[row] = rowCopy;
        }
      } else if (side === "bottom") {
        if (bottomSources[index]) return;
        const copyBtmSources = [...bottomSources];
        copyBtmSources[index] = color;
        setBottomSources(copyBtmSources);

        for (let row = 0; row < HEIGHT; row++) {
          const distance = row + 1;
          const faded = fadeColorByDistance(color, distance, HEIGHT)
          const targetRow = HEIGHT - 1 - row;
          const rowCopy = [...newTiles[targetRow]];
          rowCopy[index] = faded;
          newTiles[targetRow] = rowCopy;
        }
      }
    }

    if(dir === "row"){
      if(side === "left"){
        if(leftSources[index]) return

        const copySource = [...leftSources];
        copySource[index] = color;
        setLeftSources(copySource);

        for(let col = 0; col < WIDTH; col++){
          const distance = col + 1
          const faded = fadeColorByDistance(color, distance, WIDTH)

          const rowCopy = [...newTiles[index]]
          rowCopy[col] = faded
          newTiles[index] = rowCopy

        }
      }

      else if(side === "right"){
        if(rightSources[index]) return
        const copySource = [...rightSources];
        copySource[index] = color;
        setRightSources(copySource);

        for(let col = 0; col < WIDTH; col++){
          const distance = col + 1
          const faded = fadeColorByDistance(color, distance, WIDTH)
          const targetCol = WIDTH - 1 - col
          const rowCopy = [...newTiles[index]]
          rowCopy[targetCol] = faded
          newTiles[index] = rowCopy
        }
      }
    }

    setTiles(newTiles);

    setMoveCount((prev) => prev + 1);
  }

  return (
    <>
      <h1>RGB Alchemy</h1>

      {/* TODO.... YOU CAN USE AN ACTUAL LOADING SCREEN */}
      {status === "loading" && <p>Loading...</p>}

      {gameData !== null && (
        <InfoLine gameData={gameData} userMoves={userMoves} />
      )}

      {/* TODO: TOP CIRCLE SOURCE: SOURCE_TOP */}
      <div className="source-top flex-2">
        {topSources.length === WIDTH &&
          topSources.map((color, i) => {
            return (
              <div
                key={`top-source-${i}`}
                onClick={() => handleSourceClick(i, "col", "top")}
                style={{
                  cursor: moveCount >= 3 || color ? "not-allowed" : "pointer",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: color
                    ? `rgb(${color?.join(",")})`
                    : "rgb(0,0,0)",
                  margin: "1px",
                }}
              />
            );
          })}
      </div>
      {/* TODO... INTERACTIVE COMPONENT FOR PLAYING GAME */}
      <div className="flex">
        {/* right grid */}

        <div style={{ display: "grid" }}>
          {leftSources.length === HEIGHT &&
            leftSources.map((color, i) => {
              console.log("left color", leftSources);
              return (
                <div
                  key={`left-source-${i}`}
                  onClick={() => handleSourceClick(i, "row", "left")}
                  style={{
                    cursor: moveCount >= 3 || color ? "not-allowed" : "pointer",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: color
                      ? `rgb(${color?.join(",")})`
                      : "rgb(0,0,0)",
                    margin: "1px",
                  }}
                />
              );
            })}
        </div>

        {/* center box: TILE */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${WIDTH}, 1fr)`,
          }}
        >
          {tiles.map((row, rowIndex) =>
            row.map((color, colIndex) => (
              <div
                key={`tile-${rowIndex}-${colIndex}`}
                style={{
                  backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                  width: "20px",
                  height: "20px",
                  margin: "2px",
                }}
              />
            ))
          )}
        </div>

        {/* left grid */}

        <div style={{ display: "grid" }}>
          {rightSources.length === HEIGHT &&
            rightSources.map((color, i) => {
              console.log("right color", rightSources);
              return (
                <div
                  key={`right-source-${i}`}
                  onClick={() => handleSourceClick(i, "row", "right")}
                  style={{
                    cursor: moveCount >= 3 || color ? "not-allowed" : "pointer",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: color
                      ? `rgb(${color?.join(",")})`
                      : "rgb(0,0,0)",
                    margin: "1px",
                  }}
                />
              );
            })}
        </div>
      </div>

      {/* TODO: BOTTOM BOX */}
      <div className="source-top flex-2">
        {bottomSources.length === WIDTH &&
          bottomSources.map((color, i) => {
            console.log("bottom color", bottomSources);
            return (
              <div
                key={`bottom-source-${i}`}
                onClick={() => handleSourceClick(i, "col", "bottom")}
                style={{
                  cursor: moveCount >= 3 || color ? "not-allowed" : "pointer",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: color
                    ? `rgb(${color?.join(",")})`
                    : "rgb(0,0,0)",
                  margin: "1px",
                }}
              />
            );
          })}
      </div>
    </>
  );
}

export default App;
