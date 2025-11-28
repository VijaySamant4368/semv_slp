import Donate from "../models/Donate.js";

export const donateController = {
  async getAllDonations(req, res) {
    try {
      const donations = await Donate.find()
        .populate("donor", "name email")
        .populate("book", "title author")
        .sort({ createdAt: -1 });
      res.json(donations);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
