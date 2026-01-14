import Sustainability from "../models/Sustainability.js";
import { calculateSustainability } from "../utils/sustainabilityCalculator.js";

/**
 * Update ESG metrics (called internally)
 */
export const updateSustainability = async (
  userId,
  payload
) => {
  const metrics = calculateSustainability(payload);

  await Sustainability.findOneAndUpdate(
    { user: userId },
    { $inc: metrics },
    { upsert: true, new: true }
  );
};

/**
 * Get user ESG dashboard
 */
export const getSustainabilityReport = async (
  req,
  res
) => {
  const report = await Sustainability.findOne({
    user: req.user.id,
  }).lean();

  res.json(
    report || {
      carbonSavedKg: 0,
      paperSaved: 0,
      greenPoints: 0,
      greenScore: 0,
    }
  );
};
