import { Accessor, Component, createContext, createSignal, Match, Setter, Switch } from 'solid-js';

import './App.less';
import Game from './pages/Game';
import Home from './pages/Home';

type page = 'home' | 'game';

export const AppContext = createContext<{
  step: Accessor<page>;
  setStep: Setter<page>;
  difficulty: Accessor<number>;
  setDifficulty: Setter<number>;
}>();

const App: Component = () => {
  const [step, setStep] = createSignal<page>('home');
  const [difficulty, setDifficulty] = createSignal<number>(1);
  const store = {
    step,
    setStep,
    difficulty,
    setDifficulty,
  };

  return (
    <div class="app">
      <AppContext.Provider value={store}>
        <Switch>
          <Match when={step() === 'home'}>
            <Home />
          </Match>
          <Match when={step() === 'game'}>
            <Game />
          </Match>
        </Switch>
      </AppContext.Provider>
    </div>
  );
};

export default App;
