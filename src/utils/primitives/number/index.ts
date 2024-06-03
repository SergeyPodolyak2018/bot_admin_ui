export const getRandomNumber = (min: number, max: number) => {
  return Number(Math.random() * (max - min) + min);
};

export const convertAmount = (n: number): string => {
  const str = String(n);
  if (n === 0) return `0`;
  // if (n <= 0) return `0`;
  return `${str.slice(0, str.length - 2)}.${str.slice(str.length - 2, str.length)}`;
};
