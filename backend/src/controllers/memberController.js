import jwt from "jsonwebtoken";
import Member from "../models/Member.js";
import Borrow from "../models/Borrow.js";
import Donate from "../models/Donate.js";
import transporter from "../jobs/nodemailer.js";
import { sendEmail } from "../jobs/brevoClient.js";


import Otp from "../models/Otp.js";

function signToken(member) {
  return jwt.sign(
    {
      id: member._id,
      email: member.email,
      role: member.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

export const memberController = {
  // memberController.js

async signup(req, res) {
  console.log("Signup request received:", req.body);

  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Member.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { email },
      { otp: otpCode, expiresAt },
      { upsert: true, new: true }
    );

    console.log("✅ OTP saved:", otpCode);

  await sendEmail({
    to: email,
    subject: "Verify your email",
    text: `Your OTP is: ${otpCode}. It expires in 10 minutes.`,
  });


    console.log("✅ OTP Sent via Brevo");

    res.json({ success: true, message: "OTP sent successfully" });

  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ message: "OTP email failed" });
  }
},


  // ------------------ VERIFY OTP ------------------
  async verifyOtp(req, res) {
    try {
      const { name, email, password, phone, otp } = req.body;

      if (!name || !email || !password || !phone || !otp) {
        return res.status(400).json({ message: "All fields and OTP are required" });
      }

      const record = await Otp.findOne({ email });
      if (!record) return res.status(400).json({ message: "OTP not found" });

      if (record.otp !== otp || record.expiresAt < new Date()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // Create the member
      const member = await Member.create({ name, email, password, phone });
      console.log("Member created:", member.email);

      // Delete OTP
      await Otp.deleteOne({ email });

      res.json({ success: true, message: "Signup successful" });
    } catch (err) {
      console.error("Verify OTP Error:", err);
      res.status(500).json({ message: err.message });
    }
  },


  async login(req, res) {
    try {
      const { email, password } = req.body;
      const member = await Member.findOne({ email });
      if (!member) return res.status(401).json({ message: "Invalid credentials" });

      console.log("Found member:", member.email, "Role:", member.role);

      const ok = await member.comparePassword(password);
      console.log(password)
      console.log(member.password)
      console.log("Password match:", ok);

      if (!ok) return res.status(401).json({ message: "Invalid credentials" });

      const token = signToken(member);
      res.json({
        message: "Login successful",
        token,
        user: {
          id: member._id,
          name: member.name,
          email: member.email,
          phone: member.phone,
          role: member.role,
        },
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  async update(req, res) {
    try {
      const { memberId } = req.params;
      const { name, email, password, phone } = req.body;

      const member = await Member.findById(memberId);
      if (!member) return res.status(404).json({ message: "Member not found" });

      if (name !== undefined) member.name = name;
      if (email !== undefined) member.email = email;
      if (phone !== undefined) member.phone = phone;
      if (password) member.password = password;

      await member.save();

      const token = signToken(member);

      res.json({
        message: "Member updated",
        token,
        user: {
          id: member._id,
          name: member.name,
          email: member.email,
          phone: member.phone,
          role: member.role,
        },
      });
    } catch (e) {
      if (e.code === 11000) return res.status(409).json({ message: "Email already in use" });
      res.status(500).json({ message: e.message });
    }
  },


  async remove(req, res) {
    try {
      const { memberId } = req.params;
      const deleted = await Member.findByIdAndDelete(memberId);
      if (!deleted) return res.status(404).json({ message: "Member not found" });
      res.json({ message: "Member deleted" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  async getUserById(req, res) {
    try {
      const { memberId } = req.params;
      const member = await Member.findById(memberId).select("-password");
      if (!member) return res.status(404).json({ message: "Member not found" });
      res.json(member);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  async getIssuingHistory(req, res) {

  const startTime = Date.now(); // Start time tracking
  
  try {
    const { memberId } = req.params;
    const history = await Borrow.find({ borrower: memberId })
      .populate("book", "title author")
      .sort({ createdAt: -1 });

    const endTime = Date.now(); // End time tracking
    const duration = endTime - startTime; // Calculate duration
    console.log(`getIssuingHistory took ${duration}ms`); // Log the duration

    res.json(history);
  } catch (e) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`getIssuingHistory failed after ${duration}ms`);
    res.status(500).json({ message: e.message });
  }


  },

  async getDonationHistory(req, res) {
    try {
      const { memberId } = req.params;
      const history = await Donate.find({ donor: memberId })
        .populate("book", "title author")
        .sort({ createdAt: -1 });
      res.json(history);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  async getAllUsers(req, res) {
    try {
      const { search } = req.query;
      const filter = {};
      if (search) {
        filter.name = { $regex: search, $options: "i" };
      }
      const users = await Member.find(filter).select("-password").sort({ createdAt: -1 });
      res.json(users);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },
};
