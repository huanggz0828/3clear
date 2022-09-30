import { random, times } from 'lodash';
import { tileKey } from './interfaces';

export default class Solution {
  private _remainder: tileKey[] = [];
  private _keyCount: Partial<Record<tileKey, number>> = {};

  constructor() {
    this._remainder = [];
    this._keyCount = {};
  }

  get remainder() {
    return this._remainder;
  }

  get keyCount() {
    return this._keyCount;
  }

  addKeyCount = (key: tileKey) => {
    this._keyCount[key] = (this._keyCount[key] || 0) + 1;
  };

  getRemainKey = () => this._remainder.splice(random(0, this._remainder.length - 1), 1)[0];

  // 确保相邻层内有解
  setSolution = () => {
    (Object.keys(this._keyCount) as tileKey[]).forEach(key => {
      const value = this._keyCount[key];
      if (value && value % 3) {
        times(3 - (value % 3), () => this._remainder.push(key));
      }
    });
  };
}
