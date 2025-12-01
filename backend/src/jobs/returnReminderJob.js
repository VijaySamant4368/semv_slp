import Borrow from "../models/Borrow.js";
import { sendEmail } from "./brevoClient.js";

export async function sendReturnReminders() {
  try {
    const today = new Date();
    
    // Target is tomorrow (1 day before return)
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    // Find books due tomorrow
    const booksToReturn = await Borrow.find({
      dueDate: { $gte: tomorrow, $lte: endOfTomorrow },
      returned: false,
    }).populate("borrower", "email name");

    for (const record of booksToReturn) {
      const email = record.borrower.email;
      const name = record.borrower.name;

      const text = `Hello ${name},\n\nThis is a friendly reminder that your borrowed book "${record.bookTitle}" is due tomorrow (${record.dueDate.toDateString()}).\n\nPlease return it on time.\n\nThank you!`;

      await sendEmail({
        to: email,
        subject: "Return Reminder",
        text,
      });

      console.log(`Reminder sent to ${email} for book "${record.bookTitle}"`);
    }

    console.log("All return reminders sent!");
  } catch (err) {
    console.error("Error sending return reminders:", err);
  }
}
