import { Component, createSignal, For, Show } from 'solid-js';
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

const TILE_MAX = 81;
const SIDE_LENGTH = 9;
const SIZE = 40;
const GAP = 2;
const PLACE_MAX = 7;

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
    const getCol = (pos: number, side: number) => pos % side;
    const getRow = (pos: number, side: number) => ~~(pos / side);
    const getPosByCR = (col: number, row: number) => row * SIDE_LENGTH + col;
    const getGridIndex = (currentList: ITile[], position: number, ignore: number = -1) => {
      const row = getRow(position, SIDE_LENGTH);
      const col = getCol(position, SIDE_LENGTH);
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
      const left = getCol(position, SIDE_LENGTH) * SIZE;
      const gridLeft = getCol(gridIndex, grid()) * (SIZE / grid());
      const top = getRow(position, SIDE_LENGTH) * SIZE;
      const gridTop = getRow(gridIndex, grid()) * (SIZE / grid());
      return {
        left: left + gridLeft,
        top: top + gridTop,
      };
    };
    const getLevel = (zIndex: number) => {
      const preList = res[zIndex - 1];
      const list: ITile[] = [];
      repeat(TILE_MAX, (_, index) => {
        const preGridIndex = preList?.find(it => it.position === index)?.gridIndex || -1;
        const key = getRandomItem(keys);
        const gridIndex = getGridIndex(list, index, preGridIndex);
        if (gridIndex === undefined || Math.random() < 0.4) return;
        list.push({
          id: `${zIndex}-${index}`,
          text: TILE_MAP[key],
          position: index,
          gridIndex,
          zIndex,
          key,
          ...getTransform(index, gridIndex),
        });
      });
      if (isTopLevel(zIndex)) {
        const keyTimes: Partial<Record<tileKey, number>> = {};
        preList.forEach(({ key }) => {
          keyTimes[key] = keyTimes[key] || 0 + 1;
        });
        const ketTimesList = Object.keys(keyTimes) as Array<tileKey>;
        ketTimesList.forEach(key => {
          const value = keyTimes[key];
          if (value && value % 3) {
            repeat(value % 3, () => {
              const deleteIndex = list.findIndex(it => it.key === key);
              list.splice(deleteIndex, 1);
            });
          }
        });
      }
      return list;
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
        <TbRefresh class="icon-refresh" onClick={() => setTileList(initTileList())} />
      </div>
      {renderTileGroup()}
      {renderPlaceGroup()}
      <div class="btn-group"></div>
    </div>
  );
};

export default Game;
