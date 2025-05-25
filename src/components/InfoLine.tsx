
import { IoTriangleOutline } from 'react-icons/io5';
import type { IcolorMatch, IGameData } from '../utils'

interface InfoLineInterface{
    gameData: IGameData;
    userMoves: number,
    closestMatch: IcolorMatch | null
    availableMove: number
}

const InfoLine:React.FC<InfoLineInterface> = ({gameData, closestMatch, availableMove}) => {
  return (
        <ul>
          <li>
            <span>User ID: </span>
            <span>{gameData.userId}</span>
          </li>
          <li>
            <span>Moves Left: </span>
            <span>{availableMove}</span>
          </li>
          <li>
            <div className="flex-5">
            <span>Target Color: </span>
            <span
              style={{
                width: "20px",
                height: "20px",
                display: "block",
                backgroundColor: `rgb(${gameData.target.join(",")})`,
              }}
            >
            </span>
            </div>
          </li>
          <li >
            <div className="flex-5">        
            <span>Closest Color: </span>
          {closestMatch &&
          <>  
          <span
            style={{
              width: "20px",
              height: "20px",
              display: "block",
              backgroundColor: `rgb(${closestMatch.color.join(",")})`,
            }}
          >
          </span>
          <span className='flex'> <IoTriangleOutline />

          {closestMatch.percentageDiff} %</span>
          </>
        }
            </div>
          </li>
        </ul>


  )
}

export default InfoLine