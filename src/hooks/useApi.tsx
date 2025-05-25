import { useEffect, useState } from 'react'
import { STATUS, type IGameData } from '../utils';

const useApi = () => {
  const [status, setStatus] = useState<string>(STATUS.LOADING);
  const [gameData, setGameData] = useState<IGameData | null>(null);
  const [userMoves, setUserMoves] = useState<number>(0);
  
    async function fetchGameData() {
        try {
          // --- TODO: OPTION THAT GOES HERE ---
          const response = await fetch(`http://localhost:9876/init`, {});
          const data = await response.json();
          if (data) {
            setGameData(data);
            setUserMoves(data.maxMoves);
            setStatus(STATUS.IDLE);
          } else {
            setStatus(STATUS.ERROR);
          }
        } catch (error) {
          console.log(error);
          setStatus(STATUS.ERROR);
          setStatus(STATUS.IDLE);
        }
      }
    
      async function refreshGameData(userId: string){
        try {

            const response = await fetch(`http://localhost:9876/init/user/${userId}`, {});
            const data = await response.json();
            if (data) {
              setGameData(data);
              setUserMoves(data.maxMoves);
              setStatus(STATUS.IDLE);
            } else {
              setStatus(STATUS.ERROR);
            }
          } catch (error) {
            console.log(error);
            setStatus(STATUS.ERROR);
            setStatus(STATUS.IDLE);
          }
      }
      // TODO: PREVENT API FROM BEING CALLED EVERYTIME I REFRESH
      useEffect(() => {
        fetchGameData();
      }, []);

  return {
    status, gameData, userMoves, refreshGameData
  }
}

export default useApi