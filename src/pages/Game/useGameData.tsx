import { assign, dropRight, findLastIndex, isEmpty, last, random, sortBy, takeRight } from 'lodash';
import useAppData from '~/utils/useAppData';
import { GAME_STATUS, ICollect, ITile, TILE_STATUS } from '~/utils/constants';
import { createEffect, createRoot, createSignal } from 'solid-js';
import initTile, { SIDE_MAX, SIDE_MIN, SIZE } from './initTile';

const GAP = 2;

const createGameData = () => {
  const { difficulty, collectMax, step } = useAppData;
  const side = () => Math.min(SIDE_MAX, ~~(difficulty() / 4) + SIDE_MIN);
  const sideLength = () => (side() + 1) * 50;
  const [tileList, setTileList] = createSignal<ITile[][]>([]);

  const [collectList, setCollectList] = createSignal<ICollect[]>([]);
  const [collectFlag, setCollectFlag] = createSignal(0);
  const [animateQueue, setAnimationQueue] = createSignal<Record<string, Animation>>({});
  const [gameStatus, setGameStatus] = createSignal<GAME_STATUS>();
  const [storageList, setStorageList] = createSignal<ITile[]>([]);

  const [pendingGroupRef, setPendingGroupRef] = createSignal<HTMLDivElement>();
  const [collectGroupRef, setCollectGroupRef] = createSignal<HTMLDivElement>();

  const leftCount = () => {
    const pendingCount = tileList()
      .flat()
      .filter(tile => tile.status === TILE_STATUS.PENDING).length;
    return pendingCount + collectList().length + storageList().length;
  };

  createEffect(() => {
    console.log(leftCount());
    if (!leftCount()) {
      setGameStatus(GAME_STATUS.SUCCESS);
    }
  });

  const handleClear = () => {
    setCollectList([]);
    setStorageList([]);
    setGameStatus();
  };

  createEffect(() => {
    if (step() === 'game') {
      handleClear();
      setTileList(initTile(difficulty, side));
    }
  });

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
          step: _pre.length,
          startX: startX - _pre.length * SIZE,
          startY,
        });
      } else {
        _pre.splice(sameIndex + 1, 0, {
          ...item,
          step: _pre.length,
          startX: startX - sameIndex * SIZE,
          startY,
        });
      }
      return _pre;
    });
    setCollectFlag(pre => pre + 1);
  };

  const shuffleAnimate = () => {
    pendingGroupRef()!.animate(
      [
        { transform: `rotateZ(0) scale(1)` },
        { transform: `rotateZ(360deg) scale(0.5)` },
        { transform: `rotateZ(720deg) scale(1)` },
      ],
      { duration: 1500, easing: 'ease' }
    );
  };

  const handleRefresh = () => {
    handleClear();
    setTileList(initTile(difficulty, side));
  };

  const waitAnimateQueue = () => {
    return new Promise<void>((resolve, reject) => {
      let timer;
      if (isEmpty(animateQueue())) {
        timer && clearInterval(timer);
        resolve();
      } else {
        timer = setInterval(waitAnimateQueue, 20);
      }
    });
  };

  const handleGoBack = async () => {
    await waitAnimateQueue();
    const backItem = last(sortBy(collectList(), 'step'))!;
    const el = backItem.el!;
    const { x: elX, y: elY } = el.getBoundingClientRect();
    const { x: pgX, y: pgY } = pendingGroupRef()!.getBoundingClientRect();
    const endX = pgX - elX + backItem.left;
    const endY = pgY - elY + backItem.top;
    el.style.zIndex = '101';
    const a = el.animate(
      [
        { transform: `translate(0px,0px)` },
        { transform: `translate(${endX}px,${endY}px)`, opacity: 0 },
      ],
      { duration: 200, easing: 'ease' }
    );
    await a.finished;
    setCollectList(pre => pre.filter(item => item.id !== backItem.id));
    setTileList(pre => {
      const _pre = [...pre];
      const index = _pre[backItem.zIndex].findIndex(item => item.id === backItem.id);
      assign(_pre[backItem.zIndex][index], { status: TILE_STATUS.PENDING });
      return _pre;
    });
  };

  const handleStorage = async () => {
    await waitAnimateQueue();
    if (storageList().length) {
      return;
    }
    setStorageList(takeRight(collectList(), 3));
    setCollectList(pre => dropRight(pre, 3));
  };

  const handleShuffle = async () => {
    shuffleAnimate();
    setTimeout(() => {
      const flatArr = tileList().flat();
      setTileList(pre => {
        return pre.map(levelItem =>
          levelItem.map(item => {
            const sampleItem = flatArr.splice(random(0, flatArr.length - 1), 1)[0];
            return {
              ...item,
              key: sampleItem.key,
              text: sampleItem.text,
            };
          })
        );
      });
    }, 1300);
  };

  const isFailed = () => {
    if (collectList().length >= collectMax()) {
      setGameStatus(GAME_STATUS.FAIL);
    }
  };

  return {
    getDisabled,
    collectMax,
    sideLength,
    tileList,
    setTileList,
    collectList,
    setCollectList,
    collectFlag,
    setCollectFlag,
    animateQueue,
    setAnimationQueue,
    gameStatus,
    setGameStatus,
    isFailed,
    handleRefresh,
    handleGoBack,
    handleStorage,
    handleShuffle,
    collectGroupRef,
    setCollectGroupRef,
    pendingGroupRef,
    setPendingGroupRef,
    storageList,
    setStorageList,
    addCollect,
  };
};

const useGameData = createRoot(createGameData);

export default useGameData;
