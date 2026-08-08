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
        password: "password@367288",
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
        description: "Join us for a 3-day deep dive into modern full-stack web development with industry experts. Hands-on workshops, live coding sessions, and networking with top engineers.",
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        location: "Silicon Valley Innovation Center, CA",
        category: "Technology",
        totalSeats: 200,
        ticketPrice: 0,
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop",
    },
    {
        title: "Neon Nights EDM Festival",
        description: "Experience an unforgettable night of EDM and dazzling light shows featuring top DJs from around the world. Food stalls, art installations, and non-stop dancing.",
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        location: "Grand Arena, New York",
        category: "Music",
        totalSeats: 500,
        ticketPrice: 1500,
        imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop",
    },
    {
        title: "Mumbai Street Food Carnival",
        description: "A celebration of Mumbai's iconic street food culture. Over 80 vendors serving everything from vada pav to kebabs. Live music, cooking demos, and food competitions.",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        location: "Bandra Kurla Complex, Mumbai",
        category: "Food",
        totalSeats: 1000,
        ticketPrice: 299,
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop",
    },
    {
        title: "IPL Watch Party — Finals Night",
        description: "Watch the IPL final live on a massive 40-foot screen with 500 fellow fans. Includes unlimited snacks, beverages, and match merchandise. Book fast — limited seats!",
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        location: "Sports Fan Zone, Bengaluru",
        category: "Sports",
        totalSeats: 500,
        ticketPrice: 499,
        imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop",
    },
    {
        title: "Modern Art & Photography Exhibition",
        description: "A curated showcase of emerging Indian photographers and digital artists. 200+ works on display, artist meet-and-greets, and a live portrait session open to visitors.",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        location: "National Gallery of Modern Art, Delhi",
        category: "Art",
        totalSeats: 300,
        ticketPrice: 200,
        imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop",
    },
    {
        title: "Startup Pitch Night — Season 4",
        description: "Watch 12 early-stage startups pitch to a panel of top VCs and angel investors. Network with founders, investors, and mentors over cocktails after the event.",
        date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        location: "91springboard, Hyderabad",
        category: "Business",
        totalSeats: 150,
        ticketPrice: 0,
        imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop",
    },
    {
        title: "Sunrise Yoga & Wellness Retreat",
        description: "A one-day wellness retreat at a lakeside resort. Includes guided yoga, breathwork sessions, meditation, organic breakfast, and an evening sound healing ceremony.",
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        location: "Pawna Lake Resort, Pune",
        category: "Wellness",
        totalSeats: 80,
        ticketPrice: 1200,
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop",
    },
    {
        title: "Bollywood Retro Night",
        description: "A magical evening of classic Bollywood hits from the 70s, 80s, and 90s performed live by a full orchestra. Dress in retro style and relive the golden era of Hindi cinema.",
        date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        location: "NCPA Auditorium, Mumbai",
        category: "Music",
        totalSeats: 600,
        ticketPrice: 800,
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop",
    },
    {
        title: "AI & Machine Learning Summit 2026",
        description: "India's biggest AI conference featuring keynotes from researchers at Google DeepMind, OpenAI, and IIT. Workshops on LLMs, computer vision, and AI ethics.",
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        location: "Bombay Exhibition Centre, Mumbai",
        category: "Technology",
        totalSeats: 1500,
        ticketPrice: 2500,
        imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop",
    },
    {
        title: "Half Marathon — Bengaluru Runs 2026",
        description: "Join 5,000 runners for Bengaluru's most iconic half marathon. Routes through Cubbon Park, MG Road, and the city's iconic landmarks. All fitness levels welcome.",
        date: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        location: "Cubbon Park, Bengaluru",
        category: "Sports",
        totalSeats: 5000,
        ticketPrice: 599,
        imageUrl: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&auto=format&fit=crop",
    },
    {
        title: "Open Mic Comedy Night",
        description: "Laugh out loud with 15 stand-up comedians performing original sets. A casual, intimate evening — bring friends, enjoy craft beers, and discover India's next big comedian.",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        location: "The Comedy Factory, Pune",
        category: "Entertainment",
        totalSeats: 120,
        ticketPrice: 350,
        imageUrl: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&auto=format&fit=crop",
    },
    {
        title: "Craft Beer & Music Festival",
        description: "Sample 50+ craft beers from 20 Indian microbreweries paired with live indie and jazz performances. Artisan food stalls, brewery tours, and beer appreciation workshops.",
        date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        location: "Phoenix Marketcity, Chennai",
        category: "Food",
        totalSeats: 800,
        ticketPrice: 699,
        imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop",
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