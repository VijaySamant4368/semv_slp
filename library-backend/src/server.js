import "dotenv/config.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";


import memberRoutes from "./routes/memberRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import donateRoutes from "./routes/donateRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import membershipRoutes from "./routes/membershipRoutes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.use("/api/members", memberRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/donations", donateRoutes);
app.use("/api/borrows", borrowRoutes);

app.use("/api/volunteer", volunteerRoutes);
app.use("/api/membership", membershipRoutes);


app.get("/", (_req, res) => res.send({ status: "ok" }));



const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
