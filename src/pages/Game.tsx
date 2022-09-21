import { Component, createEffect, createSignal, For, Index, Show, useContext } from 'solid-js';
import { AppContext } from '../App';

import './Game.less';

type tileKey = 'R' | 'O' | 'Y' | 'G' | 'C' | 'B' | 'P';

const TILE_MIN = 36;
const TILE_MAX = 81;
const TILE_SEC_MAX = 49;
const SIZE = 35;
const PLACE_MAX = 7;

const toDivisible = (v: number) => (v -= v % 3);
const repeat = (times: number, callback: (item: any, index: number) => void) => {
  Array.from(Array(times)).forEach(callback);
};

interface ITile {
  key: tileKey;
  zIndex: number;
  id: string;
  left: number;
  top: number;
}

const Game: Component = () => {
  const { difficulty, setStep } = useContext(AppContext)!;

  const keys: tileKey[] = ['R', 'O', 'Y', 'G', 'C', 'B', 'P'];
  const getRandomKey = <T extends any>(arr: T[]) => arr[~~(arr.length * Math.random())];
  const isTopLevel = (zIndex: number) => zIndex && zIndex % 2;

  const initTileList = () => {
    const res: ITile[][] = [];
    Array(difficulty()).forEach((_, i) => {});
    repeat(difficulty() * 2, (_, zIndex) => {
      if (isTopLevel(zIndex)) {
        const topList: ITile[] = [];
        const preList = res[zIndex - 1];
        const keyTimes: Record<tileKey, number> = { R: 0, O: 0, Y: 0, G: 0, C: 0, B: 0, P: 0 };
        preList.forEach(({ key }) => keyTimes[key]++);
        let i = 0;
        Object.keys(keyTimes).forEach(key => {
          const value = keyTimes[key as tileKey];
          if (value && value % 3) {
            repeat(value % 3, () => {
              topList.push({
                id: `${zIndex}-${i++}`,
                key: key as tileKey,
                zIndex,
                left: 0,
                top: 0,
              });
            });
          }
        });
        const difference = toDivisible((Math.sqrt(preList.length) - 1) ** 2) - topList.length;
        if (difference > 0) {
          repeat(toDivisible(difference / 3), () => {
            const key = getRandomKey(keys);
            repeat(3, () => {
              topList.push({
                id: `${zIndex}-${i++}`,
                key,
                zIndex,
                left: 0,
                top: 0,
              });
            });
          });
        }
        const positionList = Object.keys(Array.from(Array(topList.length)));
        topList.forEach((_, i) => {
          const position = Number(positionList[Number(getRandomKey(positionList))]);
          const n = Math.sqrt(TILE_MAX);
          const left = (position % n) * SIZE + SIZE / 2;
          const top = ~~(position / n) * SIZE + SIZE / 2;
          Object.assign(topList[i], {
            id: `${zIndex}-${left},${top}`,
            left,
            top,
          });
        });
        topList.sort(() => 0.5 - Math.random());
        res.push(topList);
      } else {
        const bottom = toDivisible(Math.max(TILE_MIN, ~~(Math.random() * TILE_MAX)));
        const positionList = Object.keys(Array.from(Array(bottom)));
        res.push(
          Array.from(Array(bottom)).map(() => {
            const position = Number(positionList[Number(getRandomKey(positionList))]);
            const n = Math.sqrt(TILE_MAX);
            const left = (position % n) * SIZE;
            const top = ~~(position / n) * SIZE;
            return {
              id: `${zIndex}-${left},${top}`,
              key: getRandomKey(keys),
              zIndex,
              left,
              top,
            };
          })
        );
      }
    });
    return res;
  };

  const [tileList, setTileList] = createSignal<ITile[][]>(initTileList());

  const getDisabled = (item: ITile) => {
    if (item.zIndex === tileList().length - 1) return false;
    const { left, top } = item;
    const right = left + SIZE;
    const bottom = top + SIZE;
    for (let i = item.zIndex + 1; i < tileList().length; i++) {
      const level = tileList()[i];
      for (let j = 0; j < level.length; j++) {
        const levelItem = level[j];
        const { left: _left, top: _top } = levelItem;
        const _right = _left + SIZE;
        const _bottom = _top + SIZE;
        const nonIntersect = _right < left || _left > right || _bottom < top || _top > bottom;
        // 相交
        if (!nonIntersect) return true;
      }
    }
    return false;
  };

  const handleTileClick = (item: ITile) => {
    setTileList(v => {
      const pre = [...v];
      pre[item.zIndex] = pre[item.zIndex].filter(preItem => preItem.id !== item.id);
      return pre;
    });
    setPlaceList(v => {
      const pre = [...v];
      const keyIndex = pre.findIndex(({ key }) => key === item.key);
      if (keyIndex !== -1) {
        pre.splice(keyIndex, 0, item);
      } else {
        pre.push(item);
      }
      return pre;
    });
  };

  createEffect(() => {
    console.log(tileList(), placeList());
  });

  const renderTileGroup = () => (
    <div class="tile-group">
      <For each={tileList()}>
        {(levelItem, zIndex) => (
          <div class="level" style={{ 'z-index': zIndex() }}>
            <For each={levelItem}>
              {item => (
                <div
                  classList={{
                    tile: true,
                    [item.key]: true,
                    disabled: getDisabled(item),
                  }}
                  style={{
                    transform: `translate(${item.left}px, ${item.top}px)`,
                  }}
                  onClick={() => {
                    if (getDisabled(item)) return;
                    handleTileClick(item);
                  }}
                >
                  <Show when={getDisabled(item)}>
                    <div class="disabled-mask"></div>
                  </Show>
                  {item.key}
                </div>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );

  const [placeList, setPlaceList] = createSignal<ITile[]>([]);
  const [moveList, setMoveList] = createSignal<ITile[]>([]);

  const renderPlaceGroup = () => <div class="place-group">{placeList().map(({ key }) => key)}</div>;

  return (
    <div class="game">
      <div class="header"></div>
      {renderTileGroup()}
      {renderPlaceGroup()}
      <div class="btn-group"></div>
    </div>
  );
};

export default Game;
