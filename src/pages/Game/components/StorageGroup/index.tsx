import { For } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';
import { ITile } from '~/utils/constants';
import useGameData from '../../useGameData';

const StorageGroup = () => {
  const { storageList, setStorageList, addCollect } = useGameData;

  const handleTileClick = (
    el: MouseEvent & {
      currentTarget: HTMLDivElement;
      target: Element;
    },
    item: ITile
  ) => {
    const { x, y } = el.target.getBoundingClientRect();
    setStorageList(pre => pre.filter(it => item.id !== it.id));
    addCollect(x, y, item);
  };

  return (
    <div class="storage-group">
      <TransitionGroup name="storage-transition">
        <For each={storageList()}>
          {item => (
            <div
              classList={{
                tile: true,
                clickable: true,
              }}
              onClick={el => {
                handleTileClick(el, item);
              }}
            >
              <span class="text">{item.text}</span>
            </div>
          )}
        </For>
      </TransitionGroup>
    </div>
  );
};

export default StorageGroup;
