import { Component, Show } from 'solid-js';
import { GAME_STATUS } from '~/utils/constants';
import useAppData from '~/utils/useAppData';
import useGameData from '../../useGameData';

import './Result.less';

const Result: Component = () => {
  const { setStep, setDifficulty } = useAppData;
  const { gameStatus, handleRefresh } = useGameData;

  return (
    <div class="result-modal">
      <div class="content">
        <h1>{gameStatus() === GAME_STATUS.SUCCESS ? '胜利' : '失败'}</h1>
        <div class="btn-group">
          <Show when={gameStatus() === GAME_STATUS.SUCCESS}>
            <button
              class="primary"
              onClick={() => {
                setDifficulty(pre => Math.min(pre + 1, 100));
                handleRefresh();
              }}
            >
              下一关
            </button>
          </Show>
          <Show when={gameStatus() === GAME_STATUS.FAIL}>
            <button class="primary" onClick={() => handleRefresh()}>
              重新挑战
            </button>
          </Show>
          <button class="primary" onClick={() => setStep('home')}>
            返回主页
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
