import { For, Show } from 'solid-js';
import { ITile, TILE_STATUS } from '~/utils/interfaces';
import useGameData from '~/context/useGameData';
import useAppData from '~/context/useAppData';

const PendingGroup = () => {
  const { localData } = useAppData;
  const {
    getDisabled,
    sideLength,
    tileList,
    collectList,
    addCollect,
    setPendingGroupRef,
  } = useGameData;

  const handleTileClick = async (
    el: MouseEvent & {
      currentTarget: HTMLDivElement;
      target: Element;
    },
    item: ITile,
    index: number
  ) => {
    if (collectList().length === localData().collectMax) {
      return;
    }
    const { x, y } = el.target.getBoundingClientRect();
    tileList()[item.zIndex][index].setStatus(TILE_STATUS.COLLECT)
    addCollect(x, y, item);
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
                    display: item.status() === TILE_STATUS.PENDING ? 'block' : 'none',
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
