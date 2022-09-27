import { Component, Show } from 'solid-js';

import useAppData from './utils/useAppData';
import Game from './pages/Game';
import Home from './pages/Home';

const App: Component = () => {
  const { step } = useAppData;
  return (
    <div class="app">
      <Show when={step() === 'home'}>
        <Home />
      </Show>
      <Show when={step() === 'game'}>
        <Game />
      </Show>
    </div>
  );
};

export default App;
