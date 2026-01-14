export const getMarketplaceLoans = async (req, res) => {
  try {
    // Example: replace with MongoDB Loan model
    const loans = await Loan.find({ status: "APPROVED" }).select(
      "borrowerName riskLevel roi greenScore"
    );

    res.json({
      success: true,
      loans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch marketplace loans",
    });
  }
};
