
import InfoLine from "./components/InfoLine";
import useApi from "./hooks/useApi";
import './App.css'
import { useEffect, useState } from "react";

const colorMap: [number, number, number][] = [
  [255, 0, 0] , //red
  [0, 255, 0], //green
  [0, 0, 255], //blue
];

function App() {
  const {status, gameData, userMoves} = useApi()

  const WIDTH: number = gameData ? gameData.width : 0
  const HEIGHT: number = gameData ? gameData.height : 0

  console.log(WIDTH, HEIGHT)


const [moveCount, setMoveCount] = useState(0)
  const [topSources, setTopSources] = useState<Array<[number, number, number] | null>>([]);

  useEffect(() => {
    if (gameData) {
      setTopSources(Array(gameData.width).fill(null));
    }
  }, [gameData]);
  

  

  function handleSourceClick(index: number, dir: "row" | "col"){
  
    if(moveCount >= 3 || topSources[index]) return;
    const copyArray = [...topSources]
    copyArray[index] = colorMap[moveCount]
    setTopSources(copyArray)
    setMoveCount(prev => prev + 1)
  }


  return (
    <>
      <h1>RGB Alchemy</h1>

      {/* TODO.... YOU CAN USE AN ACTUAL LOADING SCREEN */}
      {status === "loading" && <p>Loading...</p>}


      {gameData !== null && (
        <InfoLine gameData={gameData} userMoves={userMoves}/>
      )}

{/* TODO: TOP CIRCLE SOURCE: SOURCE_TOP */}
<div className="source-top flex-2">
  {
    topSources.length === WIDTH && topSources.map((color, i) => {
      return (
        <div
        key={`top-source-${i}`}
        onClick={() => handleSourceClick(i, "row")}
   style={{
     cursor: moveCount >= 3 || color ? 'not-allowed' : "pointer",
     width: "20px",
     height: "20px",
     borderRadius: "50%",
     backgroundColor: color ? `rgb(${color?.join(',')})` : 'rgb(0,0,0)',
     margin: "1px",
   }}
  />
      )
    })
  }
      
      </div>


      {/* TODO... INTERACTIVE COMPONENT FOR PLAYING GAME */}

   

<div className="flex">

  {/* right grid */}

  <div style={{ display: "grid", }}>
        {Array.from({ length: HEIGHT }, (_, x) => (
          
           <div
           key={`col-source-${x}`}

      style={{
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        backgroundColor: "rgb(0,0,0)",
        border: "1px solid black",
        margin: "1px",
      }}
    />
    
        ))}
      </div>

{/* center box */}
<div style={{ display: "grid", gridTemplateColumns: `repeat(${WIDTH}, 1fr)`,  }}>
  {Array.from({ length: WIDTH }, (_, i) =>
    Array.from({ length: HEIGHT }, (_, j) => (
      <div key={`tile-${i}-${j}`} style={{ backgroundColor: 'rgb(0, 0, 0)' , width: "20px", height: "20px", margin: "2px"}}>
      </div>
    ))
  ).flat()}
</div>

 {/* left grid */}

 <div style={{ display: "grid"}}>
        {Array.from({ length: HEIGHT }, (_, x) => (
          
           <div
           key={`col-source-${x}`}
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        backgroundColor: "rgb(0,0,0)",
        border: "1px solid black",
        margin: "1px",
      }}
    />
    
        ))}
      </div>
</div>

{/* TODO: BOTTOM BOX */}
<div style={{ display: "flex", marginLeft: '1.5rem'}}>
        {Array.from({ length: WIDTH }, (_, x) => (
          
           <div
           key={`col-source-${x}`}
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        backgroundColor: "rgb(0,0,0)",
        border: "1px solid black",
        margin: "1px",
      }}
    />
    
        ))}
      </div>
    </>
  );
}

export default App;
