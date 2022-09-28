import { createSignal, createRoot, createEffect } from 'solid-js';
import { GAME_MODE, ILocalData, PAGE } from '~/utils/interfaces';

export const LEVEL_MAX = 100;
export const COLLECT_MAX = 14;
const DEFAULT_LOCAL_DATA = {
  level: 1,
  collectMax: 7,
  gobBackCount: 1,
  storageCount: 1,
  shuffleCount: 1,
  reviveCount: 1,
  leftCountShow: false,
};

const createAppData = () => {
  const [step, setStep] = createSignal<PAGE>(PAGE.HOME);
  const [gameMode, setGameMode] = createSignal<GAME_MODE>(GAME_MODE.CAREER);
  const [localData, setLocalData] = createSignal<ILocalData>(DEFAULT_LOCAL_DATA);
  const [difficulty, setDifficulty] = createSignal<number>(1);

  const localDataJSON = localStorage.getItem('localData');
  createEffect(() => {
    if (gameMode() === GAME_MODE.CAREER) {
      if (localDataJSON) {
        const _localData = JSON.parse(localDataJSON);
        if (_localData.collectMax > COLLECT_MAX) {
          _localData.collectMax = COLLECT_MAX;
        }
        setLocalData({ ...DEFAULT_LOCAL_DATA, ..._localData });
      }
    } else {
      setLocalData({ ...DEFAULT_LOCAL_DATA, leftCountShow: true });
    }
  });

  const resetProgress = () => {
    setLocalData(DEFAULT_LOCAL_DATA);
    localStorage.setItem('localData', JSON.stringify(DEFAULT_LOCAL_DATA));
  };

  return {
    gameMode,
    setGameMode,
    step,
    setStep,
    difficulty,
    setDifficulty,
    localData,
    resetProgress,
    setLocalData,
  };
};

const useAppData = createRoot(createAppData);

export default useAppData;
