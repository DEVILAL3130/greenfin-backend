export const calculateRiskScore = ({ amount, tenureMonths, loanType }) => {
  let score = 50; // base score

  if (amount > 500000) score += 15;
  if (tenureMonths > 36) score += 10;
  if (loanType === "GREEN") score -= 15; // eco-friendly incentive 🌱

  return Math.min(Math.max(score, 0), 100);
};
