import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: './.env' });
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js"

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);


// Root test route
app.get("/", (req, res) => {
    res.send("API is running successfully!");
});

// Connect mongoDB
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("Connected to mongoDB");
        })
        .catch((error) => {
            console.log("MongoDB connection error:", error);
        });
} else {
    console.warn("Warning: MONGODB_URI is not set in .env file");
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
});