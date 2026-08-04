import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import { User } from "./models/user.models.js";
import { Event } from "./models/event.models.js";
import { Booking } from "./models/booking.models.js";

dotenv.config();

const users = [
    {
        name: "Admin User",
        email: "admin@eventora.com",
        password: "password123",
        role: "admin",
    },
    {
        name: "Demo User",
        email: "user@eventora.com",
        password: "password123",
        role: "user",
    },
    {
        name: "Alice Smith",
        email: "alice@eventora.com",
        password: "password123",
        role: "user",
    },
    {
        name: "Bob Johnson",
        email: "bob@eventora.com",
        password: "password123",
        role: "user",
    },
    {
        name: "Charlie Dave",
        email: "charlie@eventora.com",
        password: "password123",
        role: "user",
    },
    {
        name: "Diana Prince",
        email: "diana@eventora.com",
        password: "password123",
        role: "user",
    },
    {
        name: "Ethan Hunt",
        email: "ethan@eventora.com",
        password: "password123",
        role: "user",
    },
    {
        name: "Fiona Gallagher",
        email: "fiona@eventora.com",
        password: "password123",
        role: "user",
    },
    {
        name: "George Miller",
        email: "george@eventora.com",
        password: "password123",
        role: "user",
    },
    {
        name: "Hannah Montana",
        email: "hannah@eventora.com",
        password: "password123",
        role: "user",
    },
];

const events = [
    {
        title: "React & Node.js Developer Retreat",
        description:
            "Join us for a 3-day deep dive into modern full-stack web development.",
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        location: "Silicon Valley Innovation Center, CA",
        category: "Technology",
        totalSeats: 200,
        ticketPrice: 0,
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    },
    {
        title: "Neon Nights EDM Festival",
        description:
            "Experience an unforgettable night of EDM and dazzling light shows.",
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        location: "Grand Arena, New York",
        category: "Music",
        totalSeats: 500,
        ticketPrice: 1500,
        imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
    },
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(
            process.env.MONGODB_URI ||
                "mongodb://localhost:27017/eventora"
        );

        console.log("✅ MongoDB connected");

        await User.deleteMany({});
        await Event.deleteMany({});
        await Booking.deleteMany({});

        console.log("🗑️ Existing data deleted");

        const salt = await bcrypt.genSalt(10);

        const hashedUsers = users.map((user) => ({
            ...user,
            password: bcrypt.hashSync(user.password, salt),
            isVerified: true,
        }));

        const createdUsers = await User.insertMany(hashedUsers);

        const adminUser = createdUsers.find(
            (user) => user.role === "admin"
        );

        const normalUsers = createdUsers.filter(
            (user) => user.role === "user"
        );

        console.log(`👤 ${createdUsers.length} users created`);

        const eventsWithAdmin = events.map((event) => ({
            ...event,
            availableSeats: event.totalSeats,
            createdBy: adminUser._id,
        }));

        const createdEvents = await Event.insertMany(eventsWithAdmin);

        console.log(`🎉 ${createdEvents.length} events created`);

        const bookingsData = [];

        for (const event of createdEvents) {
            const randomCount =
                Math.floor(Math.random() * 4) + 3;

            const shuffledUsers = [...normalUsers].sort(
                () => 0.5 - Math.random()
            );

            const selectedUsers = shuffledUsers.slice(
                0,
                randomCount
            );

            for (const user of selectedUsers) {
                const statuses = [
                    "pending",
                    "confirmed",
                    "cancelled",
                ];

                const status =
                    statuses[
                        Math.floor(
                            Math.random() * statuses.length
                        )
                    ];

                let paymentStatus = "not_paid";

                if (
                    status === "confirmed" &&
                    event.ticketPrice > 0
                ) {
                    paymentStatus =
                        Math.random() > 0.1
                            ? "success"
                            : "not_paid";
                } else if (event.ticketPrice === 0) {
                    paymentStatus = "success";
                }

                bookingsData.push({
                    userId: user._id,
                    eventId: event._id,
                    status,
                    paymentStatus,
                    amount: event.ticketPrice,
                });

                if (status === "confirmed") {
                    event.availableSeats -= 1;
                    await event.save();
                }
            }
        }

        await Booking.insertMany(bookingsData);

        console.log(
            `🎫 ${bookingsData.length} bookings inserted`
        );

        console.log("🚀 Database seeded successfully");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

seedDatabase();