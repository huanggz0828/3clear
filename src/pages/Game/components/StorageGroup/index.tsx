import { For } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';
import { ITile } from '~/utils/interfaces';
import useGameData from '~/context/useGameData';
import useAppData from '~/context/useAppData';

const StorageGroup = () => {
  const { localData } = useAppData;
  const { storageList, setStorageList, addCollect, collectList } = useGameData;

  const handleTileClick = async (
    el: MouseEvent & {
      currentTarget: HTMLDivElement;
      target: Element;
    },
    item: ITile
  ) => {
    if (collectList().length === localData().collectMax) {
      return;
    }
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
