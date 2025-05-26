import InfoLine from "./components/InfoLine";
import useApi from "./hooks/useApi";
import "./App.css";
import { useEffect, useMemo, useState } from "react";
import {
  applyDirContribution,
  computeTileContributions,
  getBlendedColorForTile,
  getColorDistance,
  type IcolorMatch,
} from "./utils";
import SourceBar from "./components/SourceBar";
import Modal from "./components/Modal";
import { FiAlertTriangle } from "react-icons/fi";
import { VscDebugRestart } from "react-icons/vsc";

// Initial Color for source
const colorMap: [number, number, number][] = [
  [255, 0, 0], //red
  [0, 255, 0], //green
  [0, 0, 255], //blue
];

function App() {
  const { status, gameData, userMoves, refreshGameData } = useApi();

  const targetColor = gameData?.target;
  const WIDTH: number = gameData ? gameData.width : 0;
  const HEIGHT: number = gameData ? gameData.height : 0;

  const [closestMatch, setClosestMatch] = useState<IcolorMatch | null>(null);

  const [moveCount, setMoveCount] = useState(0);
  const [availableMove, setAvailableMoves] = useState(0);
  const [restartGamePrompt, setRestartGamePrompt] = useState<boolean>(false);
  const [draggingColor, setDraggingColor] = useState<
    [number, number, number] | null
  >(null);


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
  const [contributions, setContributions] = useState<
    [number, number, number][][]
  >([]);

  useEffect(() => {
    if (gameData) {
      setTopSources(Array(gameData.width).fill(null));
      setLeftSources(Array(gameData.height).fill(null));
      setBottomSources(Array(gameData.width).fill(null));
      setRightSources(Array(gameData.height).fill(null));
      setAvailableMoves(gameData.maxMoves);
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

  const resetGame = () => {
    setClosestMatch(null);
    setMoveCount(0);
    setDraggingColor(null);
    setTopSources([]);
    setBottomSources([]);
    setLeftSources([]);
    setRightSources([]);
  };
  const closeModal = () => {
    setClosestMatch(null);
    setRestartGamePrompt(true);
  };

  function handleSourceClick(
    index: number,
    dir: "row" | "col",
    side: "top" | "bottom" | "right" | "left"
  ) {
    if (moveCount >= 3) return;

    const color = colorMap[moveCount];

    const newContributions = contributions.map((row) =>
      row.map((c) => [...c] as [number, number, number])
    );

    if (dir === "col") {
      if (side === "top") {
        if (topSources[index]) return;
        const copyTopSources = [...topSources];
        copyTopSources[index] = color;
        setTopSources(copyTopSources);
        applyDirContribution(newContributions, color, HEIGHT, i => ({ row: i, col: index }));
      } else if (side === "bottom") {
        if (bottomSources[index]) return;
        const copyBtmSources = [...bottomSources];
        copyBtmSources[index] = color;
        setBottomSources(copyBtmSources);

       
        applyDirContribution(newContributions, color, HEIGHT, i => ({ row: HEIGHT - 1 - i, col: index }));
      }
    }

    if (dir === "row") {
      if (side === "left") {
        if (leftSources[index]) return;

        const copySource = [...leftSources];
        copySource[index] = color;
        setLeftSources(copySource);
        applyDirContribution(newContributions, color, WIDTH, i => ({ row: index, col: i }));

      } else if (side === "right") {
        if (rightSources[index]) return;
        const copySource = [...rightSources];
        copySource[index] = color;
        setRightSources(copySource);

        applyDirContribution(newContributions, color, WIDTH, i => ({ row: index, col: WIDTH - 1 - i }));

      }
    }

    const newTiles = newContributions.map((row) =>
      row.map(getBlendedColorForTile)
    );
    setContributions(newContributions);
    setTiles(newTiles);
    setMoveCount((prev) => prev + 1);
    setAvailableMoves((prev) => prev - 1);

    if (targetColor) {
      let closest: {
        x: number;
        y: number;
        color: [number, number, number];
        distance: number;
      } | null = null;
      tiles.forEach((row, y) => {
        row.forEach((color, x) => {
          const dist = getColorDistance(
            color,
            targetColor as [number, number, number]
          );

          if (!closest || dist < closest.distance) {
            closest = { x, y, color, distance: dist };
          }
        });
      });

      setClosestMatch({
        color: closest!.color,
        distance: closest!.distance,
        coords: [closest!.x, closest!.y],
        percentageDiff: parseFloat(
          ((closest!.distance / 441.67) * 100).toFixed(2)
        ),
      });
    }
  }

  function handleSourceDrop(
    index: number,
    color: [number, number, number],
    dir: "row" | "col",
    side: "top" | "bottom" | "right" | "left"
  ) {
    let newTopSources = [...topSources];
    let newBottomSources = [...bottomSources];
    let newLeftSources = [...leftSources];
    let newRightSources = [...rightSources];

    if (dir === "col") {
      if (side === "top") {
        newTopSources[index] = color;
      } else if (side === "bottom") {
        newBottomSources[index] = color;
      }
    }

    if (dir === "row") {
      if (side === "left") {
        newLeftSources[index] = color;
      } else if (side === "right") {
        newRightSources[index] = color;
      }
    }

    if (targetColor) {
      let closest: {
        x: number;
        y: number;
        color: [number, number, number];
        distance: number;
      } | null = null;
      tiles.forEach((row, y) => {
        row.forEach((color, x) => {
          const dist = getColorDistance(
            color,
            targetColor as [number, number, number]
          );

          if (!closest || dist < closest.distance) {
            closest = { x, y, color, distance: dist };
          }
        });
      });

      setClosestMatch({
        color: closest!.color,
        distance: closest!.distance,
        coords: [closest!.x, closest!.y],
        percentageDiff: parseFloat(
          ((closest!.distance / 441.67) * 100).toFixed(2)
        ),
      });
    }

    const newContributions = computeTileContributions({
      topSources: newTopSources,
      bottomSources: newBottomSources,
      leftSources: newLeftSources,
      rightSources: newRightSources,
      WIDTH,
      HEIGHT,
    });

    const newTiles = newContributions.map((row) =>
      row.map(getBlendedColorForTile)
    );

    setTopSources(newTopSources);
    setBottomSources(newBottomSources);
    setLeftSources(newLeftSources);
    setRightSources(newRightSources);
    setContributions(newContributions);
    setTiles(newTiles);
    setAvailableMoves((prev) => prev - 1);
  }

  const USERLOST = useMemo(() => {
    if (!closestMatch) return false;
    return availableMove <= 0 && closestMatch.percentageDiff >= 10;
  }, [closestMatch, availableMove]);

  const USERWIN = useMemo(() => {
    if (!closestMatch) return false;
    return availableMove >= 0 && closestMatch.percentageDiff < 10;
  }, [closestMatch, availableMove]);

  return (
    <>
      <h1 className="heading">RGB Alchemy</h1>

      {/* TODO.... ACTUAL LOADING GIF */}
      {status === "loading" && <p>Loading...</p>}


      {status === "error" && 
       <div className="small-screen-alert">
       <div>
         <FiAlertTriangle />
       </div>
       <p>
         An error has occured. Please connect to the server or try some other time.
       </p>
     </div>
      }

      {gameData !== null && (
        <InfoLine
          gameData={gameData}
          userMoves={userMoves}
          closestMatch={closestMatch}
          availableMove={availableMove}
        />
      )}

      <div className="small-screen-alert hidden-lg">
        <div>
          <FiAlertTriangle />
        </div>
        <p>
          Game not supported on screen size. For best experience, Please try on
          larger screen.
        </p>
      </div>

{(status !== 'error' || gameData) &&
      <section className="game-board">
        {/* SOURCE - TOP */}
        {topSources.length && (
          <SourceBar
            handleDrop={handleSourceDrop}
            draggingColor={draggingColor}
            availableMove={availableMove}
            sources={topSources}
            setDraggingColor={setDraggingColor}
            size={WIDTH}
            handleClick={handleSourceClick}
            dir="col"
            side="top"
            moveCount={moveCount}
            cls={["source-top", "flex-2"]}
          />
        )}

        <div className="flex">
          {/* Left Source */}
          {leftSources.length && (
            <SourceBar
              handleDrop={handleSourceDrop}
              draggingColor={draggingColor}
              availableMove={availableMove}
              setDraggingColor={setDraggingColor}
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
              row.map((color, colIndex) => {
                const isDraggable = availableMove > 0 && moveCount >= 3;
                return (
                  <div
                    draggable={isDraggable}
                    onDragStart={() =>
                      setDraggingColor(tiles[rowIndex][colIndex])
                    }
                    key={`tile-${rowIndex}-${colIndex}`}
                    style={{
                      cursor: isDraggable ? "pointer" : "not-allowed",
                      backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                      width: "20px",
                      height: "20px",
                      margin: "2px",
                    }}
                  />
                );
              })
            )}
          </div>

          {/* left grid */}

          {rightSources.length && (
            <SourceBar
              handleDrop={handleSourceDrop}
              draggingColor={draggingColor}
              availableMove={availableMove}
              setDraggingColor={setDraggingColor}
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

        {/* SOURCE- BOTTOM */}
        {bottomSources.length && (
          <SourceBar
            handleDrop={handleSourceDrop}
            draggingColor={draggingColor}
            availableMove={availableMove}
            setDraggingColor={setDraggingColor}
            sources={bottomSources}
            size={WIDTH}
            handleClick={handleSourceClick}
            dir="col"
            side="bottom"
            moveCount={moveCount}
            cls={["source-top", "flex-2"]}
          />
        )}
      </section>
}

      {restartGamePrompt && (
        <div className="restart-game">
          <button
          style={{ backgroundColor: `rgb(${gameData?.target.join(",")}` }}
            onClick={() => {
              refreshGameData(gameData?.userId || "");
              resetGame();
              setRestartGamePrompt(false);
            }}
          > <VscDebugRestart />

            Restart Game
          </button>
        </div>
      )}

      <Modal visible={USERLOST} onClose={() => closeModal()}>
        <div className="modal-inner">
          <p> You failed!</p>
          <button
            style={{ backgroundColor: `rgb(${gameData?.target.join(",")}` }}
            onClick={() => {
              refreshGameData(gameData?.userId || "");
              resetGame();
            }}
          >
            Try again
          </button>
        </div>
      </Modal>

      <Modal visible={USERWIN} onClose={() => {}}>
        <div className="modal-inner">
          <p> Congratulations!</p>
          <p> You found a match less than 10%</p>
          <button
            style={{ backgroundColor: `rgb(${gameData?.target.join(",")}` }}
            onClick={() => {
              refreshGameData(gameData?.userId || "");
              resetGame();
            }}
          >
            Play again
          </button>
        </div>
      </Modal>
    </>
  );
}

export default App;
