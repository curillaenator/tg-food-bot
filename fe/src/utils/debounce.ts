const DEFAULT_DELAY = 1000;

type DebouncedType = <T>(cb: (...args: T[]) => void, delay?: number) => (...args: T[]) => void;

export const debounced: DebouncedType = (cb, delay = DEFAULT_DELAY) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => cb(...args), delay);
  };
};
