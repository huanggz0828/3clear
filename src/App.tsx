import { Component, Match, Switch } from 'solid-js';

import useAppData from './context/useAppData';
import Game from './pages/Game';
import Home from './pages/Home';
import { PAGE } from './utils/interfaces';

const App: Component = () => {
  const { step } = useAppData;
  return (
    <div class="app">
      测试
      <Switch>
        <Match when={step() === PAGE.HOME}>
          <Home />
        </Match>

        <Match when={step() === PAGE.GAME}>
          <Game />
        </Match>
      </Switch>
    </div>
  );
};

export default App;
