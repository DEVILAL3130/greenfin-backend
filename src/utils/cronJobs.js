
import cron from "node-cron";
import { checkEmiStatus } from "../services/emi.service.js";

export const startCronJobs = () => {
  cron.schedule("0 0 * * *", async () => {
    await checkEmiStatus();
  });
};
