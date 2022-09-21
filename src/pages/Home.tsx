import { Component, createSignal, Setter, useContext } from 'solid-js';
import { AppContext } from '../App';

import './Home.less';

const Home: Component = () => {
  const { setStep, difficulty, setDifficulty } = useContext(AppContext)!;
  return (
    <div class="home">
      <div class="difficulty-set">
        <button
          onClick={() => {
            setDifficulty(pre => pre - 1);
          }}
        >
          -
        </button>
        <div class="display">{difficulty()}</div>
        <button
          onClick={() => {
            setDifficulty(pre => pre + 1);
          }}
        >
          +
        </button>
      </div>
      <button
        class="start"
        onClick={() => {
          setStep('game');
        }}
      >
        开始游戏
      </button>
    </div>
  );
};

export default Home;
