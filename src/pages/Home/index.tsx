import { Component, Show } from 'solid-js';
import { FaSolidPlus, FaSolidMinus } from 'solid-icons/fa';
import useAppData, { LEVEL_MAX } from '~/context/useAppData';
import { GAME_MODE, PAGE } from '~/utils/interfaces';

import './Home.less';

const Home: Component = () => {
  const { localData, gameMode, setGameMode, setStep, difficulty, setDifficulty } = useAppData;

  return (
    <div class="home">
      <h1 class="title">
        <strong>3</strong>Clear
      </h1>

      <Show when={gameMode() === GAME_MODE.CAREER}>
        <div class="progress">
          当前进度: {localData().level > 1 ? `第 ${localData().level} 关` : '无进度'}
        </div>
        <button
          class="start primary"
          onClick={() => {
            setGameMode(GAME_MODE.CAREER);
            setStep(PAGE.GAME);
          }}
        >
          {localData().level > 1 ? '继 续' : '开 始'} 游 戏
        </button>
        <button
          class="start primary"
          onClick={() => {
            setGameMode(GAME_MODE.FREE);
          }}
        >
          自 由 模 式
        </button>
      </Show>

      <Show when={gameMode() === GAME_MODE.FREE}>
        <span class="difficulty">难度</span>
        <div class="difficulty-set">
          <button
            class="warning"
            onClick={() => {
              setDifficulty(pre => Math.max(pre - 1, 1));
            }}
          >
            <FaSolidMinus />
          </button>
          <input
            type="text"
            value={`${difficulty()}`}
            onChange={e => {
              const val = ~~Number(e.currentTarget.value) || 1;
              setDifficulty(Math.min(val, LEVEL_MAX));
            }}
            onBlur={e => {
              const val = ~~Number(e.currentTarget.value) || 1;
              setDifficulty(Math.min(val, LEVEL_MAX));
            }}
          />
          <button
            class="warning"
            onClick={() => {
              setDifficulty(pre => Math.min(pre + 1, LEVEL_MAX));
            }}
          >
            <FaSolidPlus />
          </button>
        </div>

        <button
          class="start primary"
          onClick={() => {
            setStep(PAGE.GAME);
          }}
        >
          开 始 游 戏
        </button>
        <button
          class="start primary"
          onClick={() => {
            setGameMode(GAME_MODE.CAREER);
          }}
        >
          返 回
        </button>
      </Show>

      <div class="footer">
        <span>version: v1.0.0</span>
        <span>by: huang-guanzhong</span>
      </div>
    </div>
  );
};

export default Home;
