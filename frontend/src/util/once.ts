export function once<T extends (...args: any[]) => any>(fn: T): (...args: Parameters<T>) => ReturnType<T> {
  let called = false;
  let result: ReturnType<T>;

  return function(...args: Parameters<T>): ReturnType<T> {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}