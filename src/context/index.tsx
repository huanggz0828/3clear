import { createSignal, createRoot } from 'solid-js';

type page = 'home' | 'game';

const SIDE_MIN = 3;
const SIDE_MAX = 7;

function createBus() {
  const [step, setStep] = createSignal<page>('home');
  const [difficulty, setDifficulty] = createSignal<number>(1);

  return {
    step,
    setStep,
    difficulty,
    setDifficulty,
    side: () => Math.min(SIDE_MAX, ~~(difficulty() / 4) + SIDE_MIN),
  };
}

const useBus = createRoot(createBus);

export default useBus;
