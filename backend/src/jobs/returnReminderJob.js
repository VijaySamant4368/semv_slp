import cron from "node-cron";
import Borrow from "../models/Borrow.js";
import transporter from "./nodemailer.js"; // reuse transporter

// Schedule daily at 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("Checking for return reminders...");

  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const start = new Date(tomorrow.setHours(0, 0, 0, 0));
    const end = new Date(tomorrow.setHours(23, 59, 59, 999));

    const borrows = await Borrow.find({
      returnDate: { $gte: start, $lte: end },
      status: "borrowed",
      reminderSent: false,
    }).populate("borrower book");

    for (const b of borrows) {
      if (!b.borrower.email) continue;

      const emailOptions = {
        from: process.env.EMAIL_USER,
        to: b.borrower.email,
        subject: `Book Return Reminder: ${b.book.title}`,
        text: `Hi ${b.borrower.name},

This is a reminder that your borrowed book "${b.book.title}" is due tomorrow: ${b.returnDate.toDateString()}.

Please return it on time.

Library Admin
BHC`,
      };

      await transporter.sendMail(emailOptions);

      b.reminderSent = true;
      await b.save();

      console.log("Reminder sent to:", b.borrower.email);
    }
  } catch (err) {
    console.error("Error sending reminders:", err);
  }
});

console.log("Return reminder cron job scheduled.");
