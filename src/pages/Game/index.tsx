import { Component, createEffect, createSignal, For, Show } from 'solid-js';
import { RiSystemArrowLeftSLine } from 'solid-icons/ri';
import { TbRefresh } from 'solid-icons/tb';
import './Game.less';
import useBus from '~/context';
import { Transition, TransitionGroup } from 'solid-transition-group';
import {
  cloneDeep,
  find,
  findIndex,
  findLast,
  findLastIndex,
  forEach,
  groupBy,
  isNil,
} from 'lodash';

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
  status?: statusType;
}

interface ICollect extends ITile {
  startX: number;
  startY: number;
}

const VIEWPORT_WIDTH = 440;
const SIZE = 50;
const GAP = 2;
const COLLECT_PADDING = 20;
const PLACE_MAX = 7;

const getIndexArray = (length: number) => Array.from(Array(length)).map((_, i) => i);

const Game: Component = () => {
  const { setStep, side, level, grid } = useBus;
  const sideLength = () => (side() + 1) * 50;
  const keys = Object.keys(TILE_TEXT_MAP) as tileKey[];
  const getRandomItem = <T extends any>(arr: T[]) => arr[~~(arr.length * Math.random())];

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
            status: statusType.PENDING,
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

    return res;
  };

  const [tileList, setTileList] = createSignal<ITile[][]>(initTileList());
  const [collectList, setCollectList] = createSignal<ICollect[]>([]);
  let tileGroupRef: HTMLDivElement | undefined;
  let collectGroupRef: HTMLDivElement | undefined;

  const getDisabled = (item: ITile) => {
    if (item.zIndex === tileList().length - 1) return false;
    const { left, top } = item;
    const right = left + SIZE - GAP;
    const bottom = top + SIZE - GAP;
    for (let i = item.zIndex + 1; i < tileList().length; i++) {
      const level = tileList()[i];
      for (let j = 0; j < level.length; j++) {
        const levelItem = level[j];
        if (levelItem.status !== statusType.PENDING) continue;
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

  const handleTileClick = (item: ITile, index: number) => {
    setTileList(pre => {
      const _pre = [...pre];
      Object.assign(_pre[item.zIndex][index], { status: statusType.COLLECT });
      return _pre;
    });
    setCollectList(pre => {
      const _pre = [...pre];
      const canClear = _pre.filter(it => it.key === item.key).length === 2;
      if (canClear) {
        return _pre.filter(it => it.key !== item.key);
      }

      const sameIndex = findLastIndex(_pre, it => it.key === item.key);
      const startY =
        item.top +
        tileGroupRef!.getBoundingClientRect().top -
        collectGroupRef!.getBoundingClientRect().top;
      const startX =
        item.left + sideLength() - (VIEWPORT_WIDTH - sideLength()) / 2 + COLLECT_PADDING;

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

  const [moveList, setMoveList] = createSignal<ITile[]>([]);

  return (
    <div class="game">
      <div class="header">
        <RiSystemArrowLeftSLine class="icon-back" onClick={() => setStep('home')} />
        <TbRefresh
          class="icon-refresh"
          onClick={() => {
            setCollectList([]);
            setTileList(initTileList());
          }}
        />
      </div>
      <div
        class="tile-group"
        style={{ width: `${sideLength()}px`, height: `${sideLength()}px` }}
        ref={tileGroupRef}
      >
        <For each={tileList()}>
          {(levelItem, zIndex) => (
            <div class="level" style={{ 'z-index': zIndex() }}>
              <For each={levelItem}>
                {(item, index) => (
                  <div
                    classList={{
                      tile: true,
                      clickable: true,
                      disabled: getDisabled(item),
                    }}
                    style={{
                      display: item.status === statusType.PENDING ? 'block' : 'none',
                      transform: `translate(${item.left}px, ${item.top}px)`,
                    }}
                    onClick={() => {
                      if (getDisabled(item)) return;
                      handleTileClick(item, index());
                    }}
                  >
                    <Show when={getDisabled(item)}>
                      <div class="disabled-mask"></div>
                    </Show>
                    <span class="text">{item.text}</span>
                  </div>
                )}
              </For>
            </div>
          )}
        </For>
      </div>

      <div class="collect-group" ref={collectGroupRef}>
        <TransitionGroup
          name="fade"
          onEnter={async (el, done) => {
            if (!(el instanceof HTMLElement)) return;
            const a = el.animate(
              [
                { transform: `translate(${el.dataset.startx}px,${el.dataset.starty}px)` },
                { transform: `translate(0px,0px)` },
              ],
              {
                duration: 350,
                easing: 'ease',
              }
            );
            a.finished.then(done);
          }}
        >
          <For each={collectList()}>
            {item => (
              <div
                classList={{
                  tile: true,
                }}
                data-startX={item.startX}
                data-startY={item.startY}
                data-key={item.key}
              >
                <span class="text">{item.text}</span>
              </div>
            )}
          </For>
        </TransitionGroup>
      </div>
      <div class="btn-group"></div>
    </div>
  );
};

export default Game;
