import { Component, createSignal, For, Show } from 'solid-js';
import { RiSystemArrowLeftSLine } from 'solid-icons/ri';
import { TbRefresh } from 'solid-icons/tb';
import './Game.less';
import useBus from '~/context';
import { Transition } from 'solid-transition-group';

const TILE_TEXT_MAP = {
  hotFace: '🥵',
  lemon: '🍋',
  dragon: '🐲',
  diamond: '💎',
  heart: '💖',
  sun: '☀️',
  turtle: '🐢',
  whale: '🐳',
  pepper: '🌶️',
  star: '⭐',
  fourLeafClover: '🍀',
  unicorn: '🦄',
  meat: '🥩',
  planet: '🪐',
  sakura: '🌸',
} as const;

type tileKey = keyof typeof TILE_TEXT_MAP;

enum statusType {
  PENDING,
  COLLECT,
  STORAGE,
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
  status: { type: statusType; index?: number };
}

const SIZE = 50;
const GAP = 2;
const PLACE_MAX = 7;

const getIndexArray = (length: number) => Array.from(Array(length)).map((_, i) => i);
const getRandomItem = <T extends any>(arr: T[]) => arr[~~(arr.length * Math.random())];

const Game: Component = () => {
  const { setStep, side, level, grid } = useBus;
  const sideLength = () => (side() + 1) * SIZE;

  const initTileList = () => {
    const getCol = (pos: number, side: number) => (pos ? pos % side : 0);
    const getRow = (pos: number, side: number) => (pos ? ~~(pos / side) : 0);
    const getPosByCR = (col: number, row: number) => row * side() + col;
    const getGridIndex = (currentList: ITile[], position: number, ignore: number = -1) => {
      const row = getRow(position, side());
      const col = getCol(position, side());
      const topLeft = currentList.find(item => item.position === getPosByCR(col - 1, row - 1));
      const top = currentList.find(item => item.position === getPosByCR(col, row - 1));
      const topRight = currentList.find(item => item.position === getPosByCR(col + 1, row - 1));
      const left = currentList.find(item => item.position === getPosByCR(col - 1, row));
      let [minRow, minCol] = [0, 0];
      if (topLeft) {
        const _row = getRow(topLeft.gridIndex, grid());
        minRow = Math.max(_row, minRow);
        if (_row > 0) {
          minCol = Math.max(getCol(topLeft.gridIndex, grid()), minCol);
        }
      }
      if (top) {
        const _row = getRow(top.gridIndex, grid());
        minRow = Math.max(_row, minRow);
      }
      if (topRight) {
        const _row = getRow(topRight.gridIndex, grid());
        minRow = Math.max(_row, minRow);
      }
      if (left) {
        minCol = Math.max(getCol(left.gridIndex, grid()), minCol);
      }
      const gridArr = getIndexArray(grid() * grid() - 1).filter(i => {
        const gridRow = getRow(i, grid());
        const gridCol = getCol(i, grid());
        return gridRow >= minRow && gridCol >= minCol && i !== ignore;
      });
      return getRandomItem(gridArr);
    };
    const getTransform = (position: number, gridIndex: number) => {
      const gridLength = grid() ? SIZE / grid() : 0;
      const left = getCol(position, side()) * SIZE;
      const gridLeft = getCol(gridIndex, grid()) * gridLength;
      const top = getRow(position, side()) * SIZE;
      const gridTop = getRow(gridIndex, grid()) * gridLength;
      console.log({
        left: left + gridLeft,
        top: top + gridTop,
      });
      return {
        left: left + gridLeft,
        top: top + gridTop,
      };
    };

    const res: ITile[][] = [];
    let remainder: tileKey[] = [];
    const keyTimes: Partial<Record<tileKey, number>> = {};
    for (let zIndex = 0; zIndex < level(); zIndex++) {
      const preList = res[zIndex - 1];
      const list: ITile[] = [];
      for (let index = 0; index < side() ** 2; index++) {
        const preGridIndex = preList?.find(it => it.position === index)?.gridIndex || -1;
        const key = remainder.length
          ? remainder.splice(~~(remainder.length * Math.random()), 1)[0]
          : getRandomItem(Object.keys(TILE_TEXT_MAP) as tileKey[]);
        keyTimes[key] = (keyTimes[key] || 0) + 1;
        const gridIndex = getGridIndex(list, index, preGridIndex);
        if (gridIndex !== undefined || Math.random() > 0.4) {
          list.push({
            id: `${zIndex}-${index}`,
            text: TILE_TEXT_MAP[key],
            position: index,
            gridIndex,
            zIndex,
            key,
            ...getTransform(index, gridIndex),
            status: { type: statusType.PENDING },
          });
        }
      }
      res.push(list);

      (Object.keys(keyTimes) as tileKey[]).forEach(key => {
        const value = keyTimes[key];
        if (value && value % 3) {
          for (let i = 0; i < 3 - (value % 3); i++) {
            remainder.push(key);
          }
        }
      });
    }

    remainder.forEach(key => {
      let i = res.length - 1;
      while (i >= 0) {
        const deleteIndex = res[i].findIndex(item => item.key === key);
        if (deleteIndex !== -1) {
          res[i].splice(deleteIndex, 1);
          break;
        }
        i--;
      }
    });

    return res;
  };

  const [tileList, setTileList] = createSignal<ITile[][]>(initTileList());
  const [collectList, setCollectList] = createSignal<ITile[]>([]);

  const getDisabled = (item: ITile) => {
    if (item.zIndex === tileList().length - 1) return false;
    const { left, top } = item;
    const right = left + SIZE - GAP;
    const bottom = top + SIZE - GAP;
    for (let i = item.zIndex + 1; i < tileList().length; i++) {
      const level = tileList()[i];
      for (let j = 0; j < level.length; j++) {
        const levelItem = level[j];
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

  const handleTileClick = (item: ITile) => {
    setTileList(pre => {
      const _pre = [...pre];
      _pre[item.zIndex] = _pre[item.zIndex].filter(it => it.id !== item.id);
      return _pre;
    });
    setTimeout(() => {
      setCollectList(pre => pre.map((item, index) => ({ ...item, top: 0, left: index * 52 })));
    }, 200);
  };

  const renderTileGroup = () => (
    <div class="tile-wrapper">
      <div class="tile-group" style={{ width: `${sideLength()}px`, height: `${sideLength()}px` }}>
        <For each={tileList()}>
          {(levelItem, zIndex) => (
            <div class="level" style={{ 'z-index': zIndex() }}>
              <For each={levelItem}>
                {(item, index) => (
                  <div
                    classList={{
                      tile: true,
                      clickable: item.status.type === statusType.PENDING,
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

  const renderPlaceGroup = () => (
    <div class="place-group">
      <For each={collectList()}>
        {item => (
          <div
            classList={{
              tile: true,
            }}
          >
            {item.text}
          </div>
        )}
      </For>
    </div>
  );

  return (
    <div class="game">
      <div class="header">
        <RiSystemArrowLeftSLine class="icon-back" onClick={() => setStep('home')} />
        <TbRefresh class="icon-refresh" onClick={() => setTileList(initTileList())} />
      </div>
      <Transition></Transition>
      {renderTileGroup()}
      {renderPlaceGroup()}
      <div class="btn-group"></div>
    </div>
  );
};

export default Game;
