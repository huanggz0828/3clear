import { Component, createSignal, For, Show, useContext } from 'solid-js';
import { RiSystemArrowLeftSLine } from 'solid-icons/ri';
import { TbRefresh } from 'solid-icons/tb';
import './Game.less';
import useBus from '~/context';

const TILE_MAP = {
  hotFace: '🥵',
  heart: '💖',
  lemon: '🍋',
  pepper: '🌶️',
  meat: '🥩',
  sun: '☀️',
  star: '⭐',
  planet: '🪐',
  unicorn: '🦄',
  turtle: '🐢',
  dragon: '🐲',
  whale: '🐳',
  sakura: '🌸',
  fourLeafClover: '🍀',
  diamond: '💎',
} as const;

type tileKey = keyof typeof TILE_MAP;
enum statusType {
  'pending',
  'collect',
  'storage',
}

interface ITile {
  key: tileKey;
  text: string;
  position: number;
  gridIndex: number;
  zIndex: number;
  id: string;
  left: number;
  top: number;
  status?: { type: statusType };
}

const TILE_MIN = 36;
const TILE_MAX = 81;
const SIDE_LENGTH = 9;
const TILE_SEC_MAX = 49;
const SIZE = 40;
const PLACE_MAX = 7;

const toDivisible = (v: number) => (v -= v % 3);
const repeat = (times: number, callback: (item: any, index: number) => void) => {
  Array.from(Array(times)).forEach(callback);
};
const getIndexArray = (length: number) => Array.from(Array(length)).map((_, i) => i);

const Game: Component = () => {
  const { setStep, difficulty, grid } = useBus;
  const keys = Object.keys(TILE_MAP) as Array<tileKey>;
  const getRandomItem = <T extends any>(arr: T[]) => arr[~~(arr.length * Math.random())];
  const isTopLevel = (zIndex: number) => zIndex && zIndex % 2;

  const initTileList = () => {
    const res: ITile[][] = [];
    const getRandomTileNum = () => toDivisible(Math.max(TILE_MIN, ~~(Math.random() * TILE_MAX)));
    // 闭包
    const createGetPosition = () => {
      const positionList = getIndexArray(TILE_MAX);
      return () => positionList.splice(~~(positionList.length * Math.random()), 1)[0];
    };
    const getGridIndex = (position: number, ignore: number = -1) => {
      const gridArr = getIndexArray(grid() * grid() - 1).filter(i => {
        return i !== ignore;
      });
      return getRandomItem(gridArr);
    };
    const getTransform = (position: number, gridIndex: number) => {
      const left = (position % SIDE_LENGTH) * SIZE;
      const gridLeft = (gridIndex % grid()) * (SIZE / grid());
      const top = ~~(position / SIDE_LENGTH) * SIZE;
      const gridTop = ~~(gridIndex / grid()) * (SIZE / grid());
      return {
        left: left + gridLeft,
        top: top + gridTop,
      };
    };
    const getItem = ({
      zIndex,
      index,
      key,
      position = 0,
      gridIndex = 0,
    }: {
      zIndex: number;
      index: number;
      key: tileKey;
      position?: number;
      gridIndex?: number;
      left?: number;
      top?: number;
    }) => ({
      id: `${zIndex}-${index}`,
      text: TILE_MAP[key],
      position,
      gridIndex,
      zIndex,
      key,
      ...getTransform(position, gridIndex),
    });
    const getLevel = (zIndex: number) => {
      if (zIndex === 0 && difficulty() !== 1) {
        return Array.from(Array(TILE_MAX)).map((_, index) => {
          const key = getRandomItem(keys);
          return getItem({
            zIndex,
            index,
            key,
            position: index,
          });
        });
      } 
      
      const preList = res[zIndex - 1];
      if (isTopLevel(zIndex)) {
        let topList: ITile[] = [];
       
        const keyTimes: Partial<Record<tileKey, number>> = {};
        preList.forEach(({ key }) => {
          keyTimes[key] = keyTimes[key] || 0 + 1;
        });
        let i = 0;
        const ketTimesList = Object.keys(keyTimes) as Array<tileKey>;
        ketTimesList.forEach(key => {
          const value = keyTimes[key];
          if (!(value && value % 3)) return;
          const reminder = 3 - (value % 3);
          if (topList.length + reminder > TILE_MAX) {
            repeat(value % 3, () => {
              const deleteIndex = topList.findIndex(item => key === item.key);
              topList.splice(deleteIndex, 1);
            });
          }
          repeat(reminder, () => {
            topList.push(
              getItem({
                key,
                zIndex,
                index: i++,
              })
            );
          });
        });
        if (preList.length < TILE_MIN) {
          repeat(toDivisible((getRandomTileNum() - preList.length) / 3), () => {
            const key = getRandomItem(keys);
            repeat(3, () => {
              topList.push(
                getItem({
                  key,
                  zIndex,
                  index: i++,
                })
              );
            });
          });
        }
        const getPosition = createGetPosition();
        const position = getPosition();
        const preGridIndex = preList.find(it => it.position === position)?.gridIndex || -1;
        topList = topList.map(item => {
          return {
            ...item,
            position,
            gridIndex: getGridIndex(position, preGridIndex),
          };
        });
        return topList;
      } else if (zIndex === difficulty()) {
        const preList = res[zIndex - 1];
        const getPosition = createGetPosition();
        const position = getPosition();
        const preGridIndex = preList.find(it => it.position === position)?.gridIndex || -1;
        const list: ITile[] = [];
        let i = 0;
        repeat(toDivisible(getRandomTileNum() / 3), () => {
          repeat(3, () => {
            list.push(
              getItem({
                key: getRandomItem(keys),
                position: getPosition(),
                gridIndex: getGridIndex(position, preGridIndex),
                zIndex,
                index: i++,
              })
            );
          });
        });
        return list;
      } else {
        // 主层
        const getPosition = createGetPosition();
        const position = getPosition();
        const preGridIndex = preList.find(it => it.position === position)?.gridIndex || -1;
        return Array.from(Array(2)).map((_, index) => {
          const key = getRandomItem(keys);
          return getItem({
            gridIndex: getGridIndex(getPosition(), preGridIndex),
            position,
            key,
            zIndex,
            index,
          });
        });
      }
    };

    repeat(difficulty(), (_, zIndex) => {
      res.push(getLevel(zIndex));
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

  const handleTileClick = (item: ITile) => {};

  const renderTileGroup = () => (
    <div class="tile-wrapper">
      <div class="tile-group">
        <For each={tileList()}>
          {(levelItem, zIndex) => (
            <div class="level" style={{ 'z-index': zIndex() }}>
              <For each={levelItem}>
                {item => (
                  <div
                    classList={{
                      tile: true,
                      clickable: true,
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
                    {item.text}
                  </div>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
    </div>
  );

  const [moveList, setMoveList] = createSignal<ITile[]>([]);

  // 用transform确定位置，方便动画
  const renderPlaceGroup = () => <div class="place-group"></div>;

  return (
    <div class="game">
      <div class="header">
        <RiSystemArrowLeftSLine class="icon-back" onClick={() => setStep('home')} />
        <TbRefresh class="icon-refresh" />
      </div>
      {renderTileGroup()}
      {renderPlaceGroup()}
      <div class="btn-group"></div>
    </div>
  );
};

export default Game;
