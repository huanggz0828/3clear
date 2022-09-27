import { Component, Show } from 'solid-js';
import { RiSystemArrowLeftSLine } from 'solid-icons/ri';
import { ImShuffle, ImUndo2, ImUpload } from 'solid-icons/im';
import { TbRefresh } from 'solid-icons/tb';
import useAppData from '~/utils/useAppData';
import Result from './components/Result';

import './Game.less';
import useGameData from './useGameData';
import PendingGroup from './components/PendingGroup';
import CollectGroup from './components/CollectGroup';
import StorageGroup from './components/StorageGroup';

const Game: Component = () => {
  const { setStep, difficulty } = useAppData;
  const { handleRefresh, handleGoBack, handleStorage, handleShuffle, gameStatus } = useGameData;

  return (
    <div class="game">
      <Show when={gameStatus()}>
        <Result />
      </Show>

      <div class="header">
        <RiSystemArrowLeftSLine class="icon-back" onClick={() => setStep('home')} />
        <span class="difficulty">当前难度: {difficulty()}</span>
        <button class="btn-refresh warning" onClick={() => handleRefresh()}>
          <TbRefresh />
        </button>
      </div>

      <PendingGroup />

      <div class="footer">
        <StorageGroup />
        <CollectGroup />

        <div class="btn-group">
          <button class="go-back warning" onClick={handleGoBack}>
            <ImUndo2 />
          </button>
          <button class="warning" onClick={handleStorage}>
            <ImUpload />
          </button>
          <button class="warning" onClick={handleShuffle}>
            <ImShuffle />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;
