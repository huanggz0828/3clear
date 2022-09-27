import { assign, cloneDeep } from 'lodash';
import { createEffect, For, on } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';
import { tileKey } from '~/utils/constants';
import useGameData from '../../useGameData';

const CollectGroup = () => {
  let {
    collectMax,
    collectFlag,
    collectList,
    setCollectList,
    setAnimationQueue,
    isFailed,
    setCollectGroupRef,
  } = useGameData;

  createEffect(
    // 仅在点击事件时执行effect，避免effect内setCollectList导致无限effect
    on(
      collectFlag,
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

  return (
    <div class="collect-group" ref={el => setCollectGroupRef(el)}>
      <div class="tile-group" style={{ width: `${collectMax() * 50}px` }}>
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
            isFailed();
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
                    assign(_pre[index()], { el });
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
