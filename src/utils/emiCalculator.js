export const calculateEMI = (amount, tenureMonths, annualRate) => {
  const monthlyRate = annualRate / 12 / 100;

  const emi =
    (amount *
      monthlyRate *
      Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  return Math.round(emi);
};
