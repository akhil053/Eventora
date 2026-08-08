# Eventora

Eventora is a full-stack web application designed for discovering, booking, and managing events. Built with a React frontend and a Node.js/Express backend powered by MongoDB, the platform delivers a streamlined experience for users attending events and administrators managing catalog items and reservations.

---

## Features

### User Capabilities
- Browse upcoming events with category filtering and real-time search.
- Detailed event pages displaying schedule, venue, available seating, and pricing.
- One-Time Password (OTP) verification for secure user registration and booking validation.
- User dashboard to view registered events and track booking history.

### Admin Capabilities
- Management dashboard to view system-wide events and active reservations.
- Event creation interface to publish new events with seat allocation, category, date, and poster image URLs.
- Admin table to approve or reject pending user bookings with automatic seat count recalculation.
- Real-time status management for confirmed, pending, and cancelled reservations.

---

## Technology Stack

### Frontend
- Framework: React.js (built with Vite)
- Styling: Tailwind CSS, Vanilla CSS
- Navigation: React Router DOM
- Icons & Motion: React Icons, Framer Motion
- HTTP Client: Axios

### Backend
- Runtime: Node.js
- Web Framework: Express.js
- Database: MongoDB with Mongoose ORM
- Authentication: JSON Web Tokens (JWT), Bcrypt password hashing
- Email Service: Resend API for OTP and booking confirmation delivery

---

## Project Structure

```
Eventora/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, etc.)
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── pages/          # Page components (Home, EventDetail, AdminDashboard, etc.)
│   │   ├── utils/          # Axios instance and API utilities
│   │   ├── App.jsx         # Application routes
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express backend application
│   ├── controller/         # Request handlers (auth, event, booking controllers)
│   ├── middleware/         # Custom middleware (JWT protect, admin verification)
│   ├── models/             # Mongoose schemas (User, Event, Booking, OTP)
│   ├── routes/             # Express API routes
│   ├── utils/              # Resend email utility functions
│   ├── index.js            # Server entry point
│   ├── seed.js             # Database seeding script
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js (v18.x or higher recommended)
- npm (v9.x or higher)
- MongoDB instance (Local or MongoDB Atlas cluster)

---

### Environment Configuration

#### Server Environment Variables
Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/eventora
JWT_SECRET=your_jwt_secret_key
RESEND_API_KEY=re_123456789_your_resend_key
EMAIL_FROM=Eventora <onboarding@resend.dev>
```

#### Client Environment Variables
Create a `.env` file inside the `client/` directory (optional for local development):

```env
VITE_API_URL=http://localhost:5000/api
```

---

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/akhil053/Eventora.git
   cd Eventora
   ```

2. **Install and start the Backend Server**
   ```bash
   cd server
   npm install
   npm run start
   ```
   The backend server will run on `http://localhost:5000`.

3. **Seed Initial Database Data (Optional)**
   To populate sample events and admin accounts, run:
   ```bash
   cd server
   node seed.js
   ```

4. **Install and start the Frontend Client**
   Open a new terminal window:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   The frontend application will run on `http://localhost:5173`.

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Register a new user and trigger OTP |
| POST | `/api/auth/verify-otp` | Verify user registration OTP |
| POST | `/api/auth/login` | Authenticate user and issue JWT |

### Events
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/events` | Fetch all active events |
| GET | `/api/events/:id` | Fetch specific event details |
| POST | `/api/events` | Create a new event (Admin only) |
| DELETE | `/api/events/:id` | Delete an event (Admin only) |

### Bookings
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/bookings/my` | Fetch user or admin bookings |
| POST | `/api/bookings/send-otp` | Send OTP for booking validation |
| POST | `/api/bookings` | Submit a booking request with OTP |
| PUT | `/api/bookings/:id/confirm` | Approve booking (Admin only) |
| DELETE | `/api/bookings/:id` | Cancel or reject a booking |

---

## License

This project is open-source and available under the MIT License.
