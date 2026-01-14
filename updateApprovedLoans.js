// import mongoose from "mongoose";
// import Loan from "./models/Loan.model.js"; // adjust path if needed

// // Wrap in async function
// async function updateLoans() {
//   try {
//     await mongoose.connect("mongodb://127.0.0.1:27017/GreenFin", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     const approvedLoans = await Loan.find({ status: "APPROVED", emis: { $size: 0 } });

//     for (const loan of approvedLoans) {
//       const principal = loan.amount;
//       const rate = loan.interestRate / 12 / 100;
//       const n = loan.tenureMonths;

//       const emiAmount = Math.round(
//         (principal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1)
//       );
//       loan.emiAmount = emiAmount;

//       const emis = [];
//       const startDate = new Date();
//       for (let i = 0; i < n; i++) {
//         const dueDate = new Date(startDate);
//         dueDate.setMonth(dueDate.getMonth() + i);
//         emis.push({ dueDate, amount: emiAmount, status: "due" });
//       }
//       loan.emis = emis;
//       loan.alerts = [
//         { message: `Next EMI of ₹${emiAmount} due on ${emis[0].dueDate.toDateString()}` },
//       ];

//       await loan.save();
//       console.log(`Updated Loan ${loan._id}`);
//     }

//     console.log("✅ All approved loans updated with EMIs and alerts");
//     process.exit();
//   } catch (error) {
//     console.error("Error updating loans:", error);
//     process.exit(1);
//   }
// }

// // Run the function
// updateLoans();
// updateApprovedLoans.js
import mongoose from "mongoose";
import Loan from "./src/models/Loan.model.js";

await mongoose.connect("mongodb://127.0.0.1:27017/GreenFin");

console.log("MongoDB connected 🌱");

// Find approved loans without EMIs
const approvedLoans = await Loan.find({
  status: "APPROVED",
  $or: [{ emis: { $exists: false } }, { emis: { $size: 0 } }],
});

for (const loan of approvedLoans) {
  const principal = loan.amount;
  const rate = loan.interestRate / 12 / 100;
  const n = loan.tenureMonths;

  const emiAmount = Math.round(
    (principal * rate * Math.pow(1 + rate, n)) /
      (Math.pow(1 + rate, n) - 1)
  );

  loan.emiAmount = emiAmount;

  const emis = [];
  const startDate = new Date();

  for (let i = 0; i < n; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    emis.push({
      dueDate,
      amount: emiAmount,
      status: "due",
    });
  }

  loan.emis = emis;
  loan.alerts = [
    {
      message: `Next EMI of ₹${emiAmount} due on ${emis[0].dueDate.toDateString()}`,
    },
  ];

  await loan.save();
  console.log(`✅ Updated Loan ${loan._id}`);
}

console.log("🎉 All approved loans updated with EMIs & alerts");
process.exit();
