import {
  findLastIndex,
  forEach,
  initial,
  sample,
  sampleSize,
  sortBy,
  times,
  uniqueId,
} from 'lodash';
import { createSignal } from 'solid-js';
import { ITile, tileKey, TILE_STATUS, TILE_TEXT_MAP } from '~/utils/interfaces';
import Solution from './Solution';

export const SIDE_MIN = 3;
export const SIDE_MAX = 7;
export const SIZE = 50;
const GRID = 4;

const getCol = (pos: number, side: number) => (pos ? pos % side : 0);
const getRow = (pos: number, side: number) => (pos ? ~~(pos / side) : 0);

export default (difficulty: number, side: number) => {
  const getPosByCR = (col: number, row: number) => row * side + col;
  const getGridIndex = (currentList: ITile[], position: number, ignore: number = -1) => {
    const row = getRow(position, side);
    const col = getCol(position, side);
    const topLeft = currentList.find(item => item.realIndex === getPosByCR(col - 1, row - 1));
    const top = currentList.find(item => item.realIndex === getPosByCR(col, row - 1));
    const topRight = currentList.find(item => item.realIndex === getPosByCR(col + 1, row - 1));
    const left = currentList.find(item => item.realIndex === getPosByCR(col - 1, row));
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

  const getTransform = (realIndex: number, gridIndex: number) => {
    const gridLength = GRID ? SIZE / GRID : 0;
    const left = getCol(realIndex, side) * SIZE;
    const gridLeft = getCol(gridIndex, GRID) * gridLength;
    const top = getRow(realIndex, side) * SIZE;
    const gridTop = getRow(gridIndex, GRID) * gridLength;
    return {
      left: left + gridLeft,
      top: top + gridTop,
    };
  };

  const res: ITile[][] = [];

  const { remainder, keyCount, addKeyCount, getRemainKey, setSolution } = new Solution();
  // 由于采用相邻层内有解的算法，所以保证层数为双数，代码更为简单，否则还要对单数做特殊处理
  const level = Math.ceil(difficulty / 2) * 2;

  // 挑选元素的种类数，与难度成正比
  const keyList = sampleSize(
    Object.keys(TILE_TEXT_MAP) as tileKey[],
    ~~(Math.sqrt(difficulty) * 10)
  );
  for (let zIndex = 0; zIndex < level; zIndex++) {
    const preList = res[zIndex - 1];
    const list: ITile[] = [];
    for (let index = 0; index < side ** 2; index++) {
      const preGridIndex = preList?.find(it => it.realIndex === index)?.gridIndex || -1;
      const gridIndex = getGridIndex(list, index, preGridIndex);
      // 密度：元素生成概率，与难度成正比，无限趋近1
      const density = Math.random() > 1 - 1 / Math.pow(difficulty, 1 / 10);
      if (gridIndex !== undefined && density) {
        // 确保相邻层内有解
        let _key: tileKey;
        if (remainder.length) {
          _key = getRemainKey();
        } else {
          // 去除最高频元素的keyList，确保每个元素频率接近
          const lessKeyList = initial(sortBy(keyList, key => keyCount[key]));
          _key = sample(lessKeyList)!;
        }

        addKeyCount(_key);

        const [key, setKey] = createSignal(_key);
        const [status, setStatus] = createSignal(TILE_STATUS.PENDING);

        list.push({
          id: uniqueId(),
          realIndex: index,
          gridIndex,
          zIndex,
          text: () => TILE_TEXT_MAP[key()],
          status,
          setStatus,
          key,
          setKey,
          ...getTransform(index, gridIndex),
        });
      }
    }
    res.push(list);

    // 确保相邻层内有解
    setSolution();
  }

  forEach(keyCount, (count, key) => {
    if (count && count % 3) {
      times(count % 3, () => {
        let i = res.length - 1;
        while (i >= 0) {
          const deleteIndex = findLastIndex(res[i], item => item.key() === key);
          if (deleteIndex !== -1) {
            res[i].splice(deleteIndex, 1);
            break;
          }
          i--;
        }
      });
    }
  });

  return res;
};
