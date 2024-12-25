export const calcWorkingTime = (num: number, gas: boolean) => {
  let res = 0;

  res = 0.4 * num;

  if (gas) {
    res += 0.2 * num;
  }

  return res;
};
