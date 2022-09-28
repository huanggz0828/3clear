import {
  findLastIndex,
  forEach,
  initial,
  random,
  sample,
  sampleSize,
  size,
  sortBy,
  times,
  uniqueId,
} from 'lodash';
import { Accessor } from 'solid-js';
import { ITile, tileKey, TILE_STATUS, TILE_TEXT_MAP } from '~/utils/interfaces';

export const SIDE_MIN = 3;
export const SIDE_MAX = 7;
export const SIZE = 50;
const GRID = 4;

const getCol = (pos: number, side: number) => (pos ? pos % side : 0);
const getRow = (pos: number, side: number) => (pos ? ~~(pos / side) : 0);

export default (difficulty: Accessor<number>, side: Accessor<number>) => {
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

  // 挑选元素的种类数，与难度成正比
  const keyList = sampleSize(
    Object.keys(TILE_TEXT_MAP) as tileKey[],
    ~~(Math.sqrt(difficulty()) * 10)
  );
  for (let zIndex = 0; zIndex < level; zIndex++) {
    const preList = res[zIndex - 1];
    const list: ITile[] = [];
    for (let index = 0; index < side() ** 2; index++) {
      const preGridIndex = preList?.find(it => it.position === index)?.gridIndex || -1;
      const gridIndex = getGridIndex(list, index, preGridIndex);
      // 密度：元素生成概率，与难度成正比，无限趋近1
      const density = Math.random() > 1 - 1 / Math.pow(difficulty(), 1 / 5);
      if (gridIndex !== undefined && density) {
        // 确保相邻层内有解
        let key: tileKey;
        if (remainder.length) {
          key = remainder.splice(random(0, remainder.length - 1), 1)[0];
        } else {
          // 去除最高频元素的keyList，确保每个元素频率接近
          const lessKeyList = initial(sortBy(keyList, key => keyCount[key]));
          key = sample(lessKeyList)!;
        }

        keyCount[key] = (keyCount[key] || 0) + 1;

        list.push({
          id: uniqueId(),
          text: TILE_TEXT_MAP[key],
          position: index,
          status: TILE_STATUS.PENDING,
          gridIndex,
          zIndex,
          key,
          ...getTransform(index, gridIndex),
        });
      }
    }
    res.push(list);

    // 确保相邻层内有解
    (Object.keys(keyCount) as tileKey[]).forEach(key => {
      const value = keyCount[key];
      if (value && value % 3) {
        times(3 - (value % 3), () => remainder.push(key));
      }
    });
  }

  forEach(keyCount, (count, key) => {
    if (count && count % 3) {
      times(count % 3, () => {
        let i = res.length - 1;
        while (i >= 0) {
          const deleteIndex = findLastIndex(res[i], item => item.key === key);
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
