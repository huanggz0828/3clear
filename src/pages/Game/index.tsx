import { Component, createSignal, For, Show } from 'solid-js';
import { RiSystemArrowLeftSLine } from 'solid-icons/ri';
import { TbRefresh } from 'solid-icons/tb';
import './Game.less';
import useBus from '~/context';

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

const SIZE = 50;
const GAP = 2;
const PLACE_MAX = 7;

const getIndexArray = (length: number) => Array.from(Array(length)).map((_, i) => i);

const Game: Component = () => {
  const { setStep, side, level, grid } = useBus;
  const keys = Object.keys(TILE_TEXT_MAP) as tileKey[];
  const getRandomItem = <T extends any>(arr: T[]) => arr[~~(arr.length * Math.random())];

  const initTileList = () => {
    const getCol = (pos: number, side: number) => pos % side;
    const getRow = (pos: number, side: number) => ~~(pos / side);
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
      const left = getCol(position, side()) * SIZE;
      const gridLeft = getCol(gridIndex, grid()) * (SIZE / grid());
      const top = getRow(position, side()) * SIZE;
      const gridTop = getRow(gridIndex, grid()) * (SIZE / grid());
      return {
        left: left + gridLeft,
        top: top + gridTop,
      };
    };

    const res: ITile[][] = [];
    const remainder: tileKey[] = [];
    const keyTimes: Partial<Record<tileKey, number>> = {};
    for (let zIndex = 0; zIndex < level(); zIndex++) {
      const ketTimesList = Object.keys(keyTimes) as tileKey[];
      ketTimesList.forEach(key => {
        const value = keyTimes[key];
        if (value && value % 3) {
          for (let i = 0; i < 3 - (value % 3); i++) {
            remainder.push(key);
          }
        }
      });

      const preList = res[zIndex - 1];
      const list: ITile[] = [];
      for (let index = 0; index < side() ** 2; index++) {
        const preGridIndex = preList?.find(it => it.position === index)?.gridIndex || -1;
        const key = remainder.length
          ? remainder.splice(~~(remainder.length * Math.random()), 1)[0]
          : getRandomItem(keys);
        keyTimes[key] = keyTimes[key] || 0 + 1;
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
          });
        }
      }
      res.push(list);
    }

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
      <div
        class="tile-group"
        style={{ width: `${(side() + 1) * 50}px`, height: `${(side() + 1) * 50}px` }}
      >
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
