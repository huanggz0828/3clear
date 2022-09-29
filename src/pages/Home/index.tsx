import { Component, Show } from 'solid-js';
import { FaSolidPlus, FaSolidMinus } from 'solid-icons/fa';
import useAppData, { LEVEL_MAX } from '~/context/useAppData';
import { GAME_MODE, PAGE } from '~/utils/interfaces';
import { version, author, repository } from 'root/package.json';
import { SiGitee } from 'solid-icons/si';
import { FaSolidCircleArrowUp } from 'solid-icons/fa';

import './Home.less';

const Home: Component = () => {
  const { localData, gameMode, setGameMode, setStep, difficulty, setDifficulty, resetProgress } =
    useAppData;

  return (
    <div class="home">
      <div class="content">
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
          <Show when={localData().level > 1}>
            <button
              class="start primary"
              onClick={() => {
                resetProgress();
                setGameMode(GAME_MODE.CAREER);
                setStep(PAGE.GAME);
              }}
            >
              重 新 开 始
            </button>
          </Show>
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
      </div>

      <span class="statement" onClick={() => window.open(repository.url, '_blank')}>
        本项目仅供交流学习，禁止商业用途，点击查看源码↘
      </span>

      <div class="footer">
        <div class="version" onClick={() => window.location.reload()}>
          <span>version: v{version}</span>
          <FaSolidCircleArrowUp color="#c71d23" class="update" />
        </div>
        <div class="author" onClick={() => window.open(repository.url, '_blank')}>
          <span>by: {author}</span>
          <SiGitee color="#c71d23" class="gitee" />
        </div>
      </div>
    </div>
  );
};

export default Home;
