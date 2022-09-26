import { Component, createEffect, createSignal, For, on, Show } from 'solid-js';
import { RiSystemArrowLeftSLine } from 'solid-icons/ri';
import { TbRefresh } from 'solid-icons/tb';
import useBus from '~/context';
import { TransitionGroup } from 'solid-transition-group';
import { findLastIndex, forEach, random, sample, sampleSize, size, times } from 'lodash';

import './Game.less';

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
const GRID = 4;
const PLACE_MAX = 7;

const Game: Component = () => {
  const { setStep, side, difficulty } = useBus;
  const sideLength = () => (side() + 1) * 50;

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
        const _row = getRow(topLeft.gridIndex, GRID);
        minRow = Math.max(_row, minRow);
        if (_row > 0) {
          minCol = Math.max(getCol(topLeft.gridIndex, GRID), minCol);
        }
      }
      if (top) {
        const _row = getRow(top.gridIndex, GRID);
        minRow = Math.max(_row, minRow);
      }
      if (topRight) {
        const _row = getRow(topRight.gridIndex, GRID);
        minRow = Math.max(_row, minRow);
      }
      if (left) {
        minCol = Math.max(getCol(left.gridIndex, GRID), minCol);
      }
      const gridArr = times(GRID * GRID - 1).filter(i => {
        const gridRow = getRow(i, GRID);
        const gridCol = getCol(i, GRID);
        return gridRow >= minRow && gridCol >= minCol && i !== ignore;
      });
      return sample(gridArr)!;
    };

    const getTransform = (position: number, gridIndex: number) => {
      const gridLength = GRID ? SIZE / GRID : 0;
      const left = getCol(position, side()) * SIZE;
      const gridLeft = getCol(gridIndex, GRID) * gridLength;
      const top = getRow(position, side()) * SIZE;
      const gridTop = getRow(gridIndex, GRID) * gridLength;
      return {
        left: left + gridLeft,
        top: top + gridTop,
      };
    };

    const res: ITile[][] = [];
    let remainder: tileKey[] = [];
    const keyCount: Partial<Record<tileKey, number>> = {};
    // 由于采用相邻层内有解的算法，所以保证层数为双数，代码更为简单，否则还要对单数做特殊处理
    const level = Math.ceil(difficulty() / 2) * 2;

    // 挑选元素的种类，与边长成正比
    const keyList = sampleSize(
      Object.keys(TILE_TEXT_MAP) as tileKey[],
      Math.min(~~(side() ** 2 / 2), size(TILE_TEXT_MAP))
    );
    for (let zIndex = 0; zIndex < level; zIndex++) {
      const preList = res[zIndex - 1];
      const list: ITile[] = [];
      for (let index = 0; index < side() ** 2; index++) {
        const preGridIndex = preList?.find(it => it.position === index)?.gridIndex || -1;
        // 保证相邻层内有解
        const key = remainder.length
          ? remainder.splice(random(0, remainder.length - 1), 1)[0]
          : sample(keyList)!;
        keyCount[key] = (keyCount[key] || 0) + 1;
        const gridIndex = getGridIndex(list, index, preGridIndex);
        // 密度：元素生成概率，与难度成正比，无限趋近1
        const density = Math.random() > 1 - 2 / Math.sqrt(difficulty());
        if (gridIndex !== undefined && density) {
          list.push({
            id: `${zIndex}-${index}`,
            text: TILE_TEXT_MAP[key],
            position: index,
            status: statusType.PENDING,
            gridIndex,
            zIndex,
            key,
            ...getTransform(index, gridIndex),
          });
        }
      }
      res.push(list);

      (Object.keys(keyCount) as tileKey[]).forEach(key => {
        const value = keyCount[key];
        if (value && value % 3) {
          times(3 - (value % 3), () => remainder.push(key));
        }
      });
    }

    console.log(remainder);

    console.log(keyCount);

    forEach(keyCount, (count, key) => {
      if (count && count % 3) {
        console.log(key, count, count % 3);
        times(count % 3, () => {
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
      }
    });

    console.log(
      res.flat().reduce((res, item) => {
        res[item.key] = (res[item.key] || 0) + 1;
        return res;
      }, {})
    );

    return res;
  };

  const [tileList, setTileList] = createSignal<ITile[][]>(initTileList());
  const [collectList, setCollectList] = createSignal<ICollect[]>([]);
  const [clickFlag, setClickFlag] = createSignal(0);
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
      // const canClear = _pre.filter(it => it.key === item.key).length === 2;
      // if (canClear) {
      //   return _pre.filter(it => it.key !== item.key);
      // }

      const sameIndex = findLastIndex(_pre, it => it.key === item.key);
      const startY =
        item.top +
        tileGroupRef!.getBoundingClientRect().top -
        collectGroupRef!.getBoundingClientRect().top;
      const startX = item.left - SIZE + (VIEWPORT_WIDTH - sideLength()) / 2 + COLLECT_PADDING;

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
    setClickFlag(pre => pre + 1);
  };

  createEffect(
    on(
      clickFlag,
      () => {
        collectList().reduce((res: Partial<Record<tileKey, string[]>>, item) => {
          res[item.key] ? res[item.key]!.push(item.id) : (res[item.key] = [item.id]);
          if (res[item.key]?.length === 3) {
            setTimeout(() => {
              setCollectList(pre => pre.filter(it => !res[item.key]!.includes(it.id)));
            }, 300);
          }
          return res;
        }, {});
      },
      { defer: true }
    )
  );

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
        class="pending-group"
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
          name="collect-transition"
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
