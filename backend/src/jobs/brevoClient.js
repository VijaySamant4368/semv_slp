import axios from "axios";

const BREVO_API_KEY = process.env.BREVO_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM;

if (!BREVO_API_KEY) {
  console.warn("⚠ BREVO_PASS (Brevo API key) is not set");
}

if (!EMAIL_FROM) {
  console.warn("⚠ EMAIL_FROM is not set");
}

export async function sendEmail({ to, subject, text, html }) {
  const payload = {
    sender: { email: EMAIL_FROM },
    to: [{ email: to }],
    subject,
    textContent: text,
    htmlContent: html,
  };

  try {
    const res = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      payload,
      {
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error(
      "Error sending email via Brevo API:",
      err.response?.data || err.message
    );
    throw err;
  }
}
