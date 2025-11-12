import jwt from "jsonwebtoken";
import Member from "../models/Member.js";
import Borrow from "../models/Borrow.js";
import Donate from "../models/Donate.js";

function signToken(member) {
  return jwt.sign(
    {
      id: member._id,
      email: member.email,
      role: member.role, // ✅ Include role in JWT
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

export const memberController = {
  async signup(req, res) {
    try {
      const { name, email, password, phone } = req.body;
      if (!name || !email || !password)
        return res.status(400).json({ message: "name, email, password are required" });

      const exists = await Member.findOne({ email });
      if (exists) return res.status(409).json({ message: "Email already registered" });

      const member = await Member.create({ name, email, password, phone });
      const token = signToken(member);
      res.status(201).json({
        message: "Signup successful",
        token,
        user: {
          id: member._id,
          name: member.name,
          email: member.email,
          phone: member.phone,
          role: member.role, // ✅ Include this
        },
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
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
      res.json({
        message: "Member updated",
        user: {
          id: member._id,
          name: member.name,
          email: member.email,
          phone: member.phone,
          role: member.role, // ✅ Include this
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
    try {
      const { memberId } = req.params;
      const history = await Borrow.find({ borrower: memberId })
        .populate("book", "title author")
        .sort({ createdAt: -1 });
      res.json(history);
    } catch (e) {
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
