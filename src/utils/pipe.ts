type func<T> = (arg: T) => T;

const pipe = <T>(...fns: func<T>[]): ((arg: T) => T) => {
  for (const f of fns) {
    if (typeof f !== 'function') {
      throw new Error('All compose arguments should be functions');
    }
  }
  return (x: T) => fns.reduce((v: T, f) => f(v), x);
};

export { pipe };
