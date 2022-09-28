import { Component, Show } from 'solid-js';
import { GAME_MODE, GAME_STATUS, PAGE } from '~/utils/interfaces';
import useAppData from '~/context/useAppData';
import useGameData from '~/context/useGameData';
import { FaSolidHeartPulse } from 'solid-icons/fa';

import './Result.less';

const Result: Component = () => {
  const { localData, setStep, gameMode, resetProgress, setLocalData } = useAppData;
  const { gameStatus, setGameStatus, handleRefresh, doStorage } = useGameData;

  return (
    <div class="result-modal">
      <div class="modal-content">
        <h1>{gameStatus() === GAME_STATUS.SUCCESS ? `通过第${localData().level}关` : '失败'}</h1>
        <div class="btn-group">
          <Show when={gameStatus() === GAME_STATUS.SUCCESS}>
            <button
              class="primary"
              onClick={() => {
                setLocalData(pre => ({ ...pre, level: pre.level + 1 }));
              }}
            >
              下一关
            </button>
          </Show>
          <Show when={gameStatus() === GAME_STATUS.FAIL}>
            <Show when={gameMode() === GAME_MODE.CAREER || true}>
              <button
                class="revive primary"
                onClick={() => {
                  if (!localData().reviveCount) return;
                  setLocalData(pre => ({ ...pre, reviveCount: pre.reviveCount - 1 }));
                  setGameStatus(GAME_STATUS.PLAYING);
                  doStorage();
                }}
              >
                <div class="item-num">{localData().reviveCount}</div>
                <FaSolidHeartPulse /> <span class="text">立即复活</span>
              </button>
            </Show>
            <button
              class="primary"
              onClick={() => {
                if (gameMode() === GAME_MODE.CAREER) {
                  resetProgress();
                }
                handleRefresh();
              }}
            >
              重新挑战
            </button>
          </Show>
          <button
            class="primary"
            onClick={() => {
              if (gameMode() === GAME_MODE.CAREER && gameStatus() === GAME_STATUS.FAIL) {
                resetProgress();
              }
              setStep(PAGE.HOME);
            }}
          >
            返回主页
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
