// import express from "express";
// import cors from "cors";

// // Routes
// import authRoutes from "./routes/auth.routes.js";
// import userRoutes from "./routes/user.routes.js";
// import dashboardRoutes from "./routes/dashboard.routes.js";
// import loanRoutes from "./routes/loan.routes.js";
// import documentRoutes from "./routes/document.routes.js";
// import trackingRoutes from "./routes/tracking.routes.js";
// import marketplaceRoutes from "./routes/marketplace.routes.js";
// import sustainabilityRoutes from "./routes/sustainability.routes.js";
// import adminRoutes from "./routes/admin.routes.js";
// import emiRoutes from "./routes/emi.routes.js";

// // Cron
// import { startCronJobs } from "./utils/cronJobs.js";

// const app = express();

// /* ---------- CORS ---------- */
// const allowedOrigins = [
//   "http://localhost:5173",                    // local frontend
//   "https://greenfin-frontend-1.onrender.com" // Render frontend
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true); // allow server-to-server or Postman
//       if (allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("CORS not allowed ❌"));
//       }
//     },
//     credentials: true, // allow cookies or JWT headers
//   })
// );

// /* ---------- Middleware ---------- */
// app.use(express.json({ limit: "5mb" }));
// app.use(express.urlencoded({ extended: true }));

// /* ---------- Routes ---------- */
// app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/loans", loanRoutes);
// app.use("/api/documents", documentRoutes);
// app.use("/api/tracking", trackingRoutes);
// app.use("/api/loan/tracking", trackingRoutes);
// app.use("/api/sustainability", sustainabilityRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/emi", emiRoutes);
// app.use("/api/marketplace", marketplaceRoutes);

// /* ---------- Health Check ---------- */
// app.get("/", (req, res) => {
//   res.json({ status: "GreenFin Backend Running 🌱" });
// });

// /* ---------- Cron Jobs ---------- */
// startCronJobs();

// export default app;
import express from "express";
import cors from "cors";

// Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import loanRoutes from "./routes/loan.routes.js";
import documentRoutes from "./routes/document.routes.js";
import trackingRoutes from "./routes/tracking.routes.js";
import marketplaceRoutes from "./routes/marketplace.routes.js";
import sustainabilityRoutes from "./routes/sustainability.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import emiRoutes from "./routes/emi.routes.js";

// Cron
import { startCronJobs } from "./utils/cronJobs.js";

const app = express();

/* ---------- CORS (FIXED & SIMPLE) ---------- */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://greenfin-frontend-1.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ---------- Middleware ---------- */
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

/* ---------- Routes ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/loan/tracking", trackingRoutes);
app.use("/api/sustainability", sustainabilityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/emi", emiRoutes);
app.use("/api/marketplace", marketplaceRoutes);

/* ---------- Health Check ---------- */
app.get("/", (req, res) => {
  res.json({ status: "GreenFin Backend Running 🌱" });
});

/* ---------- Cron Jobs ---------- */
startCronJobs();

export default app;
