import PDFDocument from "pdfkit";
import Loan from "../models/Loan.model.js";

export const downloadEmiReceipt = async (req, res) => {
  try {
    const { loanId, emiId } = req.params;

    const loan = await Loan.findOne({
      _id: loanId,
      user: req.user._id,
    });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    const emi = loan.emis.id(emiId);
    if (!emi || emi.status !== "paid") {
      return res.status(400).json({ message: "Invalid or unpaid EMI" });
    }

    // 📄 Create PDF
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=EMI_Receipt_${emi._id}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // 🧾 PDF CONTENT
    doc.fontSize(20).text("EMI Payment Receipt", { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Loan ID: ${loan._id}`);
    doc.text(`EMI ID: ${emi._id}`);
    doc.text(`Loan Type: ${loan.loanType}`);
    doc.text(`Amount Paid: ₹${emi.amount}`);
    doc.text(`Paid On: ${new Date(emi.paidAt).toDateString()}`);
    doc.text(`Status: PAID`);
    doc.moveDown();

    doc.text("Thank you for your payment.", { align: "center" });

    doc.end();
  } catch (error) {
    console.error("EMI Receipt Error:", error);
    res.status(500).json({ message: "Failed to generate receipt" });
  }
};
