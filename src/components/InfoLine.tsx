
import type { IGameData } from '../utils'

interface InfoLineInterface{
    gameData: IGameData;
    userMoves: number,
}

const InfoLine:React.FC<InfoLineInterface> = ({gameData, userMoves}) => {
  return (
        <ul>
          <li>
            <span>User ID: </span>
            <span>{gameData.userId}</span>
          </li>
          <li>
            <span>Moves Left: </span>
            <span>{userMoves}</span>
          </li>
          <li className="flex">
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
          </li>
          <li className="flex">
            <span>Closest Color: </span>
            <span
              style={{
                width: "20px",
                height: "20px",
                display: "block",
                // backgroundColor: `rgb(${gameData.target.join(",")})`,
              }}
            >
            </span>
          </li>
        </ul>


  )
}

export default InfoLine