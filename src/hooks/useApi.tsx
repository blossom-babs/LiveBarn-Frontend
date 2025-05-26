import { useEffect, useState, useCallback } from 'react';
import { STATUS, type IGameData } from '../utils';

const API_URL = 'http://localhost:9876';

const useApi = () => {
  const [status, setStatus] = useState<string>(STATUS.LOADING);
  const [gameData, setGameData] = useState<IGameData | null>(null);
  const [userMoves, setUserMoves] = useState<number>(0);

  const loadGame = useCallback(async (url: string) => {
    setStatus(STATUS.LOADING);
    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data) throw new Error('No data returned');

      setGameData(data);
      setUserMoves(data.maxMoves);
      setStatus(STATUS.IDLE);
    } catch (err) {
      console.error('[Game Load Error]', err);
      setStatus(STATUS.ERROR);
    }
  }, []);

  const fetchGameData = useCallback(() => {
    loadGame(`${API_URL}/init`);
  }, [loadGame]);

  const refreshGameData = useCallback((userId: string) => {
    loadGame(`${API_URL}/init/user/${userId}`);
  }, [loadGame]);

  useEffect(() => {
    fetchGameData();
  }, [fetchGameData]);

  return {
    status,
    gameData,
    userMoves,
    refreshGameData,
  };
};

export default useApi;
