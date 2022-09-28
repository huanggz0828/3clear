import { Component, Show } from 'solid-js';
import { RiSystemArrowLeftSLine, RiSystemTimerFlashLine } from 'solid-icons/ri';
import { TbRefresh } from 'solid-icons/tb';
import { BsStack } from 'solid-icons/bs';
import useAppData from '~/context/useAppData';
import Result from './components/Result';
import useGameData from '~/context/useGameData';
import PendingGroup from './components/PendingGroup';
import CollectGroup from './components/CollectGroup';
import StorageGroup from './components/StorageGroup';
import ItemGroup from './components/ItemGroup/ItemGroup';
import { GAME_MODE, PAGE } from '~/utils/interfaces';

import './Game.less';

const Game: Component = () => {
  const { gameMode, setStep, difficulty, localData } = useAppData;
  const { handleRefresh, gameStatus, leftCount, gameTime } = useGameData;

  const getTime = () => {
    let t = '';
    if (gameTime() > -1) {
      const hour = Math.floor(gameTime() / 3600);
      const min = Math.floor(gameTime() / 60) % 60;
      const sec = gameTime() % 60;
      if (hour && hour < 10) {
        t = '0' + hour + ':';
      }
      if (min < 10) {
        t += '0';
      }
      t += min + ':';
      if (sec < 10) {
        t += '0';
      }
      t += sec.toFixed(0);
    }
    return t;
  };

  return (
    <div class="game">
      <Show when={gameStatus()}>
        <Result />
      </Show>

      <div class="header">
        <RiSystemArrowLeftSLine class="icon-back" onClick={() => setStep(PAGE.HOME)} />
        <div class="center">
          <span class="title">
            {gameMode() === GAME_MODE.CAREER ? `第 ${localData().level} 关` : `难度：${difficulty()}`}
          </span>
          <div class="info">
            <div class="time">
              <RiSystemTimerFlashLine color="#D2691E " />
              <span class="info-desc">{getTime()}</span>
            </div>
            <Show when={localData().leftCountShow}>
              <div class="left-count">
                <BsStack color="#0DB3A6" />
                <span class="info-desc">{leftCount()}</span>
              </div>
            </Show>
          </div>
        </div>
        <button class="btn-refresh warning" onClick={() => handleRefresh()}>
          <TbRefresh />
        </button>
      </div>

      <div class="content">
        <PendingGroup />
        <StorageGroup />
        <CollectGroup />
        <ItemGroup />
      </div>
    </div>
  );
};

export default Game;
