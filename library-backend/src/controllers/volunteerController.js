import Volunteer from "../models/Volunteer.js";

export const applyVolunteer = async (req, res) => {
  const { name, email, phone, reason } = req.body;
  const volunteer = new Volunteer({ name, email, phone, reason });
  await volunteer.save();
  res.json({ message: "Volunteer request submitted!" });
};

export const getAllVolunteers = async (req, res) => {
  const list = await Volunteer.find();
  res.json(list);
};
