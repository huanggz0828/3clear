import { assign, cloneDeep, isEmpty, maxBy, orderBy } from 'lodash';
import { createEffect, For, on } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';
import { GAME_MODE, GAME_STATUS, tileKey } from '~/utils/interfaces';
import useGameData from '~/context/useGameData';
import useAppData from '~/context/useAppData';

const CollectGroup = () => {
  const { localData, gameMode, setLocalSuccess } = useAppData;
  let {
    collectList,
    setCollectList,
    animateQueue,
    setAnimationQueue,
    setCollectGroupRef,
    setGameStatus,
    leftCount,
    clearTimer,
  } = useGameData;

  const row = () => ~~(Math.ceil(localData().collectMax) / 7);

  createEffect(
    on(
      animateQueue,
      aq => {
        if (!isEmpty(aq)) return;
        orderBy(collectList(), 'step', 'desc').reduce(
          (res: Partial<Record<tileKey, string[]>>, item) => {
            res[item.key] ? res[item.key]!.push(item.id) : (res[item.key] = [item.id]);
            if (res[item.key]?.length === 3) {
              setCollectList(pre => pre.filter(it => !res[item.key]!.includes(it.id)));
            }
            return res;
          },
          {}
        );
        if (collectList().length >= localData().collectMax) {
          setGameStatus(GAME_STATUS.FAIL);
        }
        if (!leftCount()) {
          setGameStatus(GAME_STATUS.SUCCESS);
          clearTimer();
          if (gameMode() === GAME_MODE.CAREER) {
            setLocalSuccess();
          }
        }
      },
      { defer: true }
    )
  );

  return (
    <div
      class="collect-group"
      ref={el => setCollectGroupRef(el)}
      style={{ height: `${row() * 80}px` }}
    >
      <div class="tile-group" style={{ height: `${row() * 54}px` }}>
        <TransitionGroup
          name="collect-transition"
          onEnter={async (el, done) => {
            if (!(el instanceof HTMLElement)) return;
            const a = el.animate(
              [
                { transform: `translate(${el.dataset.x}px,${el.dataset.y}px)` },
                { transform: `translate(0px,0px)` },
              ],
              {
                duration: 300,
                easing: 'ease',
              }
            );
            const id = el.dataset.id!;
            setAnimationQueue(pre => ({ ...pre, [id]: a }));
            await a.finished;
            done();
            setAnimationQueue(pre => {
              const _pre = cloneDeep(pre);
              delete _pre[id];
              return _pre;
            });
          }}
        >
          <For each={collectList()}>
            {(item, index) => (
              <div
                ref={el => {
                  setCollectList(pre => {
                    const _pre = [...pre];
                    assign(_pre[index()], { el, step: (maxBy(_pre, 'step')?.step || 0) + 1 });
                    return pre;
                  });
                }}
                classList={{
                  tile: true,
                }}
                data-x={item.startX}
                data-y={item.startY}
                data-key={item.key}
                data-id={item.id}
              >
                <span class="text">{item.text}</span>
              </div>
            )}
          </For>
        </TransitionGroup>
      </div>
    </div>
  );
};

export default CollectGroup;
