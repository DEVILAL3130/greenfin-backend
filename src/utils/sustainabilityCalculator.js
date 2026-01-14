/**
 * ESG assumptions (documented & explainable)
 * - 1 paper page ≈ 5g CO₂
 * - Avg loan docs = 10 pages
 * - Digital EMI reminder saves travel & paper
 */

export const calculateSustainability = ({
  documentsUploaded = 0,
  emisPaid = 0,
}) => {
  const paperSaved = documentsUploaded * 10; // pages
  const carbonSavedKg =
    (paperSaved * 5) / 1000 + emisPaid * 0.02;

  const greenPoints =
    paperSaved * 2 + emisPaid * 5;

  const greenScore = Math.min(
    100,
    Math.round(greenPoints / 10)
  );

  return {
    paperSaved,
    carbonSavedKg: Number(carbonSavedKg.toFixed(2)),
    greenPoints,
    greenScore,
  };
};
