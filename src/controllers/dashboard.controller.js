
import Loan from "../models/Loan.model.js";
// import Sustainability from "../models/Sustainability.model.js";
import Sustainability from "../models/Sustainability.js";

import { getCache, setCache } from "../utils/cache.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    // 🔹 STEP 1: CHECK CACHE FIRST
    const cacheKey = `dashboard_${userId}`;
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      return res.json(cachedData); // ⚡ instant response
    }

    // 🔹 STEP 2: FETCH DATA FROM DB (ONLY IF CACHE MISS)
    const loans = await Loan.find(
      { user: userId, status: "ACTIVE" },
      {
        type: 1,
        emiAmount: 1,
        totalEmis: 1,
        paidEmis: 1,
        nextEmiDate: 1,
      }
    ).lean();

    let totalEmiDue = 0;
    loans.forEach((loan) => {
      totalEmiDue += loan.emiAmount || 0;
    });

    const sustainability =
      (await Sustainability.findOne(
        { user: userId },
        { paperSaved: 1, carbonSaved: 1 }
      ).lean()) || {};

    // 🔹 STEP 3: PREPARE RESPONSE OBJECT
    const response = {
      activeLoans: loans.length,
      totalEmiDue,
      loans,
      sustainability: {
        paperSaved: sustainability.paperSaved || 0,
        carbonSaved: sustainability.carbonSaved || 0,
      },
    };

    // 🔹 STEP 4: SAVE TO CACHE (TTL = 60s)
    setCache(cacheKey, response, 60000);

    return res.json(response);
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Dashboard fetch failed" });
  }
};
