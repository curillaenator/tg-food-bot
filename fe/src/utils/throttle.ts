const DEFAULT_DELAY = 150;

type ThrottledType = <T>(cb: (...args: T[]) => void, wait?: number) => (...args: T[]) => void;

export const throttled: ThrottledType = (cb, wait = DEFAULT_DELAY) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args) => {
    if (timer) return;

    cb(...args);

    timer = setTimeout(() => {
      timer = null;
    }, wait);
  };
};
