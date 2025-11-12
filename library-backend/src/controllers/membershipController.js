import Membership from "../models/Membership.js";

export const applyMembership = async (req, res) => {
  const { name, email, phone, address, reason } = req.body;
  const member = new Membership({ name, email, phone, address, reason });
  await member.save();
  res.json({ message: "Membership request submitted successfully!" });
};

export const getAllMemberships = async (req, res) => {
  const list = await Membership.find();
  res.json(list);
};
