import { findLastIndex } from 'lodash';
import { For, Show } from 'solid-js';
import { ITile, TILE_STATUS } from '~/utils/constants';
import { SIZE } from '../../initTile';
import useGameData from '../../useGameData';

const PendingGroup = () => {
  const {
    getDisabled,
    sideLength,
    tileList,
    setTileList,
    addCollect,
    setPendingGroupRef,
  } = useGameData;

  const handleTileClick = (
    el: MouseEvent & {
      currentTarget: HTMLDivElement;
      target: Element;
    },
    item: ITile,
    index: number
  ) => {
    const { x, y } = el.target.getBoundingClientRect();
    setTileList(pre => {
      const _pre = [...pre];
      Object.assign(_pre[item.zIndex][index], { status: TILE_STATUS.COLLECT });
      return _pre;
    });
    addCollect(x,y,item)
  };

  return (
    <div
      class="pending-group"
      style={{ width: `${sideLength()}px`, height: `${sideLength()}px` }}
      ref={el => setPendingGroupRef(el)}
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
                    display: item.status === TILE_STATUS.PENDING ? 'block' : 'none',
                    transform: `translate(${item.left}px, ${item.top}px)`,
                  }}
                  onClick={el => {
                    if (getDisabled(item)) return;
                    handleTileClick(el, item, index());
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
  );
};

export default PendingGroup;
