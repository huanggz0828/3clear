import { dropRight, findLastIndex, isEmpty, takeRight } from 'lodash';
import useAppData from '~/context/useAppData';
import { GAME_MODE, GAME_STATUS, ICollect, ITile, PAGE, TILE_STATUS } from '~/utils/interfaces';
import { createEffect, createMemo, createRoot, createSignal, onCleanup } from 'solid-js';
import initTile, { SIDE_MAX, SIDE_MIN, SIZE } from '~/utils/initTile';

const GAP = 2;

const createGameData = () => {
  const { gameMode, difficulty, localData, step } = useAppData;
  const level = createMemo(
    () => (gameMode() === GAME_MODE.CAREER ? localData().level : difficulty()),
    [gameMode(), localData().level]
  );

  const side = () => Math.min(SIDE_MAX, ~~(level() / 2) + SIDE_MIN);
  const sideLength = () => (side() + 1) * 50;

  const [tileList, setTileList] = createSignal<ITile[][]>([]);
  const [collectList, setCollectList] = createSignal<ICollect[]>([]);
  const [animateQueue, setAnimationQueue] = createSignal<Record<string, Animation>>({});
  const [gameStatus, setGameStatus] = createSignal<GAME_STATUS>(GAME_STATUS.PLAYING);
  const [storageList, setStorageList] = createSignal<ICollect[]>([]);

  const [pendingGroupRef, setPendingGroupRef] = createSignal<HTMLDivElement>();
  const [collectGroupRef, setCollectGroupRef] = createSignal<HTMLDivElement>();

  const [startTime, setStartTime] = createSignal(0);
  const [gameTime, setGameTime] = createSignal(0);
  let timer: NodeJS.Timer | null = null;

  const leftCount = () => {
    const pendingCount = tileList()
      .flat()
      .filter(tile => tile.status === TILE_STATUS.PENDING).length;
    return pendingCount + collectList().length + storageList().length;
  };

  const handleClear = () => {
    setCollectList([]);
    setStorageList([]);
    setGameStatus(GAME_STATUS.PLAYING);
  };

  const startTiming = () => {
    setStartTime(new Date().getTime());
    setGameTime(1);
    timer = setInterval(() => {
      const timeDiff = ~~((new Date().getTime() - startTime()) / 1e3);
      if (timeDiff > 1) {
        setGameTime(timeDiff);
      }
    }, 1000);
  };

  const clearTimer = () => {
    timer && clearInterval(timer);
  };

  createEffect(() => {
    if (step() === PAGE.GAME) {
      startTiming();
      handleClear();
      setTileList(initTile(level, side));
    } else {
      clearTimer();
    }
  });

  onCleanup(() => clearTimer());

  const getDisabled = (item: ITile) => {
    if (item.zIndex === tileList().length - 1) return false;
    const { left, top } = item;
    const right = left + SIZE - GAP;
    const bottom = top + SIZE - GAP;
    for (let i = item.zIndex + 1; i < tileList().length; i++) {
      const level = tileList()[i];
      for (let j = 0; j < level.length; j++) {
        const levelItem = level[j];
        if (levelItem.status !== TILE_STATUS.PENDING) continue;
        const { left: _left, top: _top } = levelItem;
        const _right = _left + SIZE - GAP;
        const _bottom = _top + SIZE - GAP;
        const nonIntersect = _right < left || _left > right || _bottom < top || _top > bottom;
        // 相交
        if (!nonIntersect) return true;
      }
    }
    return false;
  };

  const addCollect = (x: number, y: number, item: ITile) => {
    setCollectList(pre => {
      const _pre = [...pre];
      const sameIndex = findLastIndex(_pre, it => it.key === item.key);
      const startY = y - collectGroupRef()!.getBoundingClientRect().top;
      const startX = x - SIZE;

      if (sameIndex === -1) {
        _pre.push({
          ...item,
          startX: startX - _pre.length * SIZE,
          startY,
        });
      } else {
        _pre.splice(sameIndex + 1, 0, {
          ...item,
          startX: startX - sameIndex * SIZE,
          startY,
        });
      }
      return _pre;
    });
  };

  const waitAnimateQueue = () => {
    return new Promise<void>((resolve, reject) => {
      let timer;
      let i = 0;
      if (isEmpty(animateQueue())) {
        timer && clearInterval(timer);
        resolve();
      } else {
        timer = setInterval(() => {
          waitAnimateQueue();
          if (i++ === 100) reject();
        }, 20);
      }
    });
  };

  const handleRefresh = () => {
    handleClear();
    setTileList(initTile(level, side));
  };

  const doStorage = () => {
    setStorageList(pre => [...pre, ...takeRight(collectList(), 3)]);
    setCollectList(pre => dropRight(pre, 3));
  };

  return {
    getDisabled,
    sideLength,
    tileList,
    setTileList,
    collectList,
    setCollectList,
    animateQueue,
    setAnimationQueue,
    gameStatus,
    setGameStatus,
    handleRefresh,
    collectGroupRef,
    setCollectGroupRef,
    pendingGroupRef,
    setPendingGroupRef,
    storageList,
    setStorageList,
    addCollect,
    leftCount,
    gameTime,
    waitAnimateQueue,
    doStorage,
    clearTimer
  };
};

const useGameData = createRoot(createGameData);

export default useGameData;
