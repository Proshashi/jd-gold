export const GRAM_VALUE = 11.6638038;

export const gramToTola = (gram) => {
  // 4.286766209
  // return Number(gram * 0.085735260233307).toFixed(4);
  return Number(gram / GRAM_VALUE);
};

export const laalToTola = (laal) => {
  // return Number(laal * 0.085735260233307).toFixed(6);
  return Number(laal / 100);
};

export const tolaToGram = (tola) => {
  return Number(tola * GRAM_VALUE);
};

export const tolaToLaal = (tola) => {
  return Number(tola * 100);
};
