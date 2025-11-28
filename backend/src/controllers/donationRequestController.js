import DonationRequest from "../models/DonationRequest.js";
import Book from "../models/Book.js";
import Donate from "../models/Donate.js";
import Member from "../models/Member.js";

export const donationRequestController = {
    async getAllDonationRequests(req, res) {
        try {
            const donationRequests = await DonationRequest.find()
                .populate("donor", "name email phone")
                .sort({ createdAt: -1 });

            const donationRequestsWithBook = await Promise.all(
                donationRequests.map(async (request) => {
                    const book = await Book.findOne({
                        title: request.title,
                        author: request.author,
                    });

                    request.book = book; 

                    return request;
                })
            );

            res.json(donationRequestsWithBook); 
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },


    async updateDonationRequest(req, res) {
        try {
            const { status, id } = req.params;

            if (!["approved", "rejected"].includes(status)) {
                return res.status(400).json({ message: "Invalid status" });
            }

            const request = await DonationRequest.findById(id).populate("donor");

            if (!request) {
                return res.status(404).json({ message: "Donation request not found" });
            }

            request.status = status;
            await request.save();

            if (status === "approved") {
                const newBook = await Book.create({
                    title: request.title,
                    author: request.author,
                    genres: request.genres,
                    description: request.description,
                    coverImage: request.coverImage || null,
                    donor: request.donor?._id,
                    status: "available",
                });

                await Donate.create({
                    donor: request.donor?._id,
                    book: newBook._id,
                });
            }

            res.status(200).json({
                message: `Donation request ${status} successfully`,
                request, 
            });
        } catch (err) {
            console.error("Error updating donation request:", err);
            res.status(500).json({ message: err.message });
        }
    },
};
