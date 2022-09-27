import { Component } from 'solid-js';
import { FaSolidPlus, FaSolidMinus } from 'solid-icons/fa';
import './Home.less';
import useAppData from '~/utils/useAppData';

const Home: Component = () => {
  const { setStep, difficulty, setDifficulty } = useAppData;
  return (
    <div class="home">
      <h1 class="title">
        <strong>3</strong>Clear
      </h1>
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
        <div class="display">{difficulty()}</div>
        <button
          class="warning"
          onClick={() => {
            setDifficulty(pre => Math.min(pre + 1, 100));
          }}
        >
          <FaSolidPlus />
        </button>
      </div>
      <button
        class="start primary"
        onClick={() => {
          setStep('game');
        }}
      >
        开 始 游 戏
      </button>
    </div>
  );
};

export default Home;
