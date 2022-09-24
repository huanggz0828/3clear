import { createSignal, createRoot } from 'solid-js';

type page = 'home' | 'game';

function createBus() {
  const [step, setStep] = createSignal<page>('game');
  const [grid, setGrid] = createSignal<number>(3);
  const [difficulty, setDifficulty] = createSignal<number>(1);
  return {
    step,
    setStep,
    difficulty,
    setDifficulty,
    grid,
    setGrid,
  };
}

const useBus = createRoot(createBus);

export default useBus;
