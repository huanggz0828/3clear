import { createSignal, createRoot } from 'solid-js';

type page = 'home' | 'game';

const createAppData = () => {
  const [step, setStep] = createSignal<page>('home');
  const [difficulty, setDifficulty] = createSignal<number>(1);
  const [collectMax, setCollectMax] = createSignal<number>(7);

  return {
    step,
    setStep,
    difficulty,
    setDifficulty,
    collectMax,
    setCollectMax,
  };
};

const useAppData = createRoot(createAppData);

export default useAppData;
