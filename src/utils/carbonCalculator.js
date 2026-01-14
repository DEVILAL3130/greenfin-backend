export const calculateCarbonSaved = () => {
  // Avg paper document ≈ 5 pages
  // 1 page ≈ 5g CO₂

  const pages = 5;
  const carbonPerPage = 5;

  return pages * carbonPerPage; // grams CO₂
};
