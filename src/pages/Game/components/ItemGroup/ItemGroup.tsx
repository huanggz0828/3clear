import { ImShuffle, ImUndo2, ImUpload } from 'solid-icons/im';
import { last, random, sortBy } from 'lodash';
import useGameData from '~/context/useGameData';
import useAppData from '~/context/useAppData';
import { tileKey, TILE_STATUS } from '~/utils/interfaces';
import Solution from '~/utils/Solution';

import './ItemGroup.less';

const ItemGroup = () => {
  const {
    tileList,
    collectList,
    setCollectList,
    storageList,
    doStorage,
    pendingGroupRef,
    waitAnimateQueue,
  } = useGameData;
  const { localData, setLocalData } = useAppData;

  const handleGoBack = async () => {
    if (!localData().gobBackCount) return;
    await waitAnimateQueue();
    if (!collectList().length) return;
    setLocalData(pre => ({ ...pre, gobBackCount: localData().gobBackCount - 1 }));
    const backItem = last(sortBy(collectList(), 'step'))!;
    const el = backItem.el!;
    const { x: elX, y: elY } = el.getBoundingClientRect();
    const { x: pgX, y: pgY } = pendingGroupRef()!.getBoundingClientRect();
    const endX = pgX - elX + backItem.left;
    const endY = pgY - elY + backItem.top;
    el.style.zIndex = '201';
    const a = el.animate(
      [
        { transform: `translate(0px,0px)` },
        { transform: `translate(${endX}px,${endY}px)`, opacity: 0 },
      ],
      { duration: 200, easing: 'ease' }
    );
    await a.finished;
    setCollectList(pre => pre.filter(item => item.id !== backItem.id));
    const index = tileList()[backItem.zIndex].findIndex(item => item.id === backItem.id);
    tileList()[backItem.zIndex][index].setStatus(TILE_STATUS.PENDING);
  };

  const handleStorage = async () => {
    if (!localData().storageCount) return;
    await waitAnimateQueue();
    if (!collectList().length) return;
    if (storageList().length) {
      return;
    }
    setLocalData(pre => ({ ...pre, storageCount: localData().storageCount - 1 }));
    doStorage();
  };

  const handleShuffle = async () => {
    if (!localData().shuffleCount) return;
    setLocalData(pre => ({ ...pre, shuffleCount: localData().shuffleCount - 1 }));
    pendingGroupRef()!.animate(
      [
        { transform: `rotateZ(0) scale(1)` },
        { transform: `rotateZ(360deg) scale(0.5)` },
        { transform: `rotateZ(720deg) scale(1)` },
      ],
      { duration: 1500, easing: 'ease' }
    );
    setTimeout(() => {
      const flatArr = tileList()
        .flat()
        .filter(item => item.status() === TILE_STATUS.PENDING)
        .map(item => item.key());

      const { remainder, addKeyCount, getRemainKey, setSolution } = new Solution();
      tileList().forEach(levelItem => {
        levelItem.forEach(item => {
          if (item.status() !== TILE_STATUS.PENDING) {
            return true;
          }
          let key: tileKey;
          if (remainder.length) {
            key = getRemainKey();
            const index = flatArr.findIndex(k => k === key);
            flatArr.splice(index, 1);
          } else {
            key = flatArr.splice(random(0, flatArr.length - 1), 1)[0];
          }
          addKeyCount(key);
          item.setKey(key);
        });
        // 确保相邻层内有解
        setSolution();
      });
    }, 1300);
  };

  return (
    <div class="item-btn-group">
      <button class="go-back warning" onClick={handleGoBack}>
        <div class="item-num">{localData().gobBackCount}</div>
        <ImUndo2 />
      </button>
      <button class="warning" onClick={handleStorage}>
        <div class="item-num">{localData().storageCount}</div>
        <ImUpload />
      </button>
      <button class="warning" onClick={handleShuffle}>
        <div class="item-num">{localData().shuffleCount}</div>
        <ImShuffle />
      </button>
    </div>
  );
};

export default ItemGroup;
