import InfoLine from "./components/InfoLine";
import useApi from "./hooks/useApi";
import "./App.css";
import { useEffect, useState } from "react";
import { fadeColorByDistance, getBlendedColorForTile } from "./utils";
import SourceBar from "./components/SourceBar";

const colorMap: [number, number, number][] = [
  [255, 0, 0], //red
  [0, 255, 0], //green
  [0, 0, 255], //blue
];

function App() {
  const { status, gameData, userMoves } = useApi();

  const targetColor = gameData?.target
  const WIDTH: number = gameData ? gameData.width : 0;
  const HEIGHT: number = gameData ? gameData.height : 0;




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
  const [contributions, setContributions] = useState<[number, number, number][][]>([]);

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
      setContributions(
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
   // const newTiles = [...tiles];
    const newContributions = contributions.map(row => row.map(c => [...c] as [number, number, number]));


    if (dir === "col") {
      if (side === "top") {
        if (topSources[index]) return;
        const copyTopSources = [...topSources];
        copyTopSources[index] = color;
        setTopSources(copyTopSources);

        for (let row = 0; row < HEIGHT; row++) {
          const distance = row + 1;
          const faded = fadeColorByDistance(color, distance, HEIGHT);
        
          newContributions[row][index] = newContributions[row][index].map((c, i) => c + faded[i]) as [number, number, number]
        }
      } else if (side === "bottom") {
        if (bottomSources[index]) return;
        const copyBtmSources = [...bottomSources];
        copyBtmSources[index] = color;
        setBottomSources(copyBtmSources);

        for (let row = 0; row < HEIGHT; row++) {
          const distance = row + 1;
          const faded = fadeColorByDistance(color, distance, HEIGHT);
          const targetRow = HEIGHT - 1 - row;
          // const rowCopy = [...newTiles[targetRow]];
          // rowCopy[index] = faded;
          // newTiles[targetRow] = rowCopy;
          newContributions[targetRow][index] = newContributions[targetRow][index].map((c, i) => c + faded[i]) as [number, number, number]
        }
      }
    }

    if (dir === "row") {
      if (side === "left") {
        if (leftSources[index]) return;

        const copySource = [...leftSources];
        copySource[index] = color;
        setLeftSources(copySource);

        for (let col = 0; col < WIDTH; col++) {
          const distance = col + 1;
          const faded = fadeColorByDistance(color, distance, WIDTH);

          // const rowCopy = [...newTiles[index]];
          // rowCopy[col] = faded;
          // newTiles[index] = rowCopy;

          newContributions[index][col] = newContributions[index][col].map((c, i) => c + faded[i]) as [number, number, number]
        }
      } else if (side === "right") {
        if (rightSources[index]) return;
        const copySource = [...rightSources];
        copySource[index] = color;
        setRightSources(copySource);

        for (let col = 0; col < WIDTH; col++) {
          const distance = col + 1;
          const faded = fadeColorByDistance(color, distance, WIDTH);
          const targetCol = WIDTH - 1 - col;

          newContributions[index][targetCol] = newContributions[index][targetCol].map((c, i) => c + faded[i]) as [number, number, number]
          // const rowCopy = [...newTiles[index]];
          // rowCopy[targetCol] = faded;
          // newTiles[index] = rowCopy;
        }
      }
    }

    const newTiles = newContributions.map(row => row.map(getBlendedColorForTile))
    setContributions(newContributions)
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
      {topSources.length && (
        <SourceBar
          sources={topSources}
          size={WIDTH}
          handleClick={handleSourceClick}
          dir="col"
          side="top"
          moveCount={moveCount}
          cls={["source-top", "flex-2"]}
        />
      )}
      {/* TODO... INTERACTIVE COMPONENT FOR PLAYING GAME */}
      <div className="flex">
        {/* Left Source */}
        {leftSources.length && (
          <SourceBar
            sources={leftSources}
            size={HEIGHT}
            handleClick={handleSourceClick}
            dir="row"
            side="left"
            moveCount={moveCount}
            cls={["grid gap-2"]}
          />
        )}

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

        {rightSources.length && (
          <SourceBar
            sources={rightSources}
            size={HEIGHT}
            handleClick={handleSourceClick}
            dir="row"
            side="right"
            moveCount={moveCount}
            cls={["grid gap-2"]}
          />
        )}
      </div>

      {/* TODO: BOTTOM BOX */}
      {bottomSources.length && (
        <SourceBar
          sources={bottomSources}
          size={WIDTH}
          handleClick={handleSourceClick}
          dir="col"
          side="bottom"
          moveCount={moveCount}
          cls={["source-top", "flex-2"]}
        />
      )}
    </>
  );
}

export default App;
