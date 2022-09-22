import { Component, Match, Switch } from 'solid-js';

import './App.less';
import useBus from './context';
import Game from './pages/Game';
import Home from './pages/Home';

const App: Component = () => {
  const { step } = useBus;
  return (
    <div class="app">
      <Switch>
        <Match when={step() === 'home'}>
          <Home />
        </Match>
        <Match when={step() === 'game'}>
          <Game />
        </Match>
      </Switch>
    </div>
  );
};

export default App;
