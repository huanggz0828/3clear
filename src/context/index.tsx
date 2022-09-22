import { createSignal, createRoot } from 'solid-js';

type page = 'home' | 'game';

function createBus() {
  const [step, setStep] = createSignal<page>('home');
  const [difficulty, setDifficulty] = createSignal<number>(1);
  return {
    step,
    setStep,
    difficulty,
    setDifficulty,
  };
}

const useBus = createRoot(createBus)

export default useBus;
