import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowLeft, FaChair } from 'react-icons/fa';
import EventCard from '../components/EventCard';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [otherEvents, setOtherEvents] = useState([]);
    const [existingBooking, setExistingBooking] = useState(null); // user's booking for this event
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                // Fetch event details, all events, and user's bookings in parallel
                const promises = [
                    api.get(`/events/${id}`),
                    api.get('/events')
                ];
                if (user) promises.push(api.get('/bookings/my'));

                const [eventRes, allEventsRes, bookingsRes] = await Promise.all(promises);
                setEvent(eventRes.data);

                if (allEventsRes.data) {
                    const filtered = allEventsRes.data.filter(e => e._id !== id);
                    setOtherEvents(filtered);
                }

                if (bookingsRes) {
                    const match = bookingsRes.data.find(
                        b => b.eventId?._id === id && b.status !== 'cancelled'
                    );
                    setExistingBooking(match || null);
                }
            } catch {
                setError('Failed to load event.');
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [id, user]);

    const handleBooking = async () => {
        if (!user) { navigate('/login'); return; }
        setBookingLoading(true);
        setError('');
        setSuccessMsg('');
        try {
            if (!showOTP) {
                await api.post('/bookings/send-otp');
                setShowOTP(true);
                setSuccessMsg('OTP sent to your email.');
            } else {
                await api.post('/bookings', { eventId: event._id, otp });
                setSuccessMsg('Booking requested! Awaiting confirmation.');
                setShowOTP(false);
                setEvent({ ...event, availableSeats: event.availableSeats - 1 });
                setExistingBooking({ status: 'pending', amount: event.ticketPrice });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed.');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#141414] flex items-center justify-center pt-16">
            <div className="w-8 h-8 border-2 border-gray-700 border-t-white rounded-full animate-spin" />
        </div>
    );

    if (!event) return (
        <div className="min-h-screen bg-[#141414] flex items-center justify-center pt-16 text-center px-4">
            <div>
                <p className="text-gray-400 mb-4">{error || 'Event not found.'}</p>
                <Link to="/" className="text-sm text-white underline">Go back</Link>
            </div>
        </div>
    );

    const isSoldOut = event.availableSeats <= 0;
    const booked = successMsg && !showOTP;
    const alreadyBooked = !!existingBooking;

    return (
        <div className="min-h-screen bg-[#141414] pt-16">
            {/* Hero */}
            <div className="relative h-[45vh] overflow-hidden">
                {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-[#1f1f1f] flex items-center justify-center text-gray-700 text-7xl font-black uppercase">
                        {event.category?.[0]}
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-transparent" />

                <button
                    id="back-btn"
                    onClick={() => navigate(-1)}
                    className="absolute top-5 left-5 flex items-center gap-1.5 text-gray-300 hover:text-white text-sm bg-black/40 hover:bg-black/60 px-3 py-1.5 rounded transition-colors"
                >
                    <FaArrowLeft className="text-xs" /> Back
                </button>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-10 pb-20">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Details */}
                    <div className="flex-1 min-w-0">
                        <p className="text-[#E50914] text-xs font-semibold uppercase tracking-wide mb-2">{event.category}</p>
                        <h1 className="text-3xl font-bold text-white mb-5 leading-snug">{event.title}</h1>

                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <FaCalendarAlt className="text-gray-600" />
                                {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <FaMapMarkerAlt className="text-gray-600" />
                                {event.location}
                            </div>
                        </div>

                        <div className="bg-[#1f1f1f] rounded-lg p-5 mb-4 border border-white/5">
                            <h2 className="text-white text-sm font-semibold mb-2">About Event</h2>
                            <p className="text-gray-400 text-sm leading-relaxed">{event.description}</p>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-[#1f1f1f] rounded-lg p-4 flex-1 text-center border border-white/5">
                                <p className="text-gray-500 text-xs mb-1">Ticket Price</p>
                                <p className="text-white font-semibold text-sm">
                                    {event.ticketPrice === 0 ? <span className="text-green-400">Free</span> : `₹${event.ticketPrice}`}
                                </p>
                            </div>
                            <div className="bg-[#1f1f1f] rounded-lg p-4 flex-1 text-center border border-white/5">
                                <p className="text-gray-500 text-xs mb-1">Seats Available</p>
                                <p className="text-white font-semibold text-sm flex items-center justify-center gap-1">
                                    <FaChair className="text-gray-500 text-xs" />
                                    {event.availableSeats} / {event.totalSeats}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Panel */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-[#1f1f1f] rounded-lg p-5 sticky top-24 border border-white/5">
                            {alreadyBooked ? (
                                <>
                                    <p className="text-gray-400 text-sm font-medium mb-1">You're registered</p>
                                    <p className="text-gray-500 text-xs mb-5">
                                        Status: <span className={existingBooking.status === 'confirmed' ? 'text-gray-200' : 'text-gray-400'}>
                                            {existingBooking.status === 'confirmed' ? 'Confirmed' : 'Pending approval'}
                                        </span>
                                    </p>

                                    <Link
                                        to="/dashboard"
                                        className="block w-full text-center text-sm py-2.5 rounded border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                                    >
                                        Go to Dashboard
                                    </Link>

                                    <p className="text-gray-700 text-xs text-center mt-4">
                                        {event.availableSeats} seats remaining
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-white font-semibold text-sm mb-4">Book your spot</h3>

                                    {successMsg && !showOTP && (
                                        <div className="bg-green-900/30 border border-green-800/40 text-green-400 text-xs px-3 py-2.5 rounded mb-4">
                                            {successMsg}
                                        </div>
                                    )}
                                    {successMsg && showOTP && (
                                        <div className="bg-[#1a1a2e] border border-blue-800/30 text-blue-300 text-xs px-3 py-2.5 rounded mb-4">
                                            {successMsg}
                                        </div>
                                    )}
                                    {error && (
                                        <div className="bg-red-900/30 border border-red-800/50 text-red-400 text-xs px-3 py-2.5 rounded mb-4">
                                            {error}
                                        </div>
                                    )}

                                    {showOTP && (
                                        <div className="mb-4">
                                            <label className="block text-gray-400 text-xs font-medium mb-1.5">Enter OTP</label>
                                            <input
                                                id="booking-otp-input"
                                                type="text"
                                                placeholder="- - - -"
                                                className="w-full bg-[#2a2a2a] border border-white/10 text-white text-sm rounded px-3 py-2.5 focus:outline-none focus:border-white/30 transition-colors tracking-widest text-center font-bold"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                maxLength="6"
                                            />
                                        </div>
                                    )}

                                    <button
                                        id="book-now-btn"
                                        onClick={handleBooking}
                                        disabled={isSoldOut || bookingLoading || (showOTP && !otp) || booked}
                                        className="w-full bg-[#E50914] hover:bg-[#c9080f] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded transition-colors"
                                    >
                                        {bookingLoading ? 'Processing...'
                                            : booked ? 'Requested'
                                            : isSoldOut ? 'Sold Out'
                                            : showOTP ? 'Confirm with OTP'
                                            : 'Register Now'}
                                    </button>

                                    {!user && (
                                        <p className="text-gray-600 text-xs text-center mt-3">
                                            <Link to="/login" className="text-gray-400 hover:text-white underline">Sign in</Link> to book
                                        </p>
                                    )}

                                    <div className="mt-4 pt-4 border-t border-white/5 text-xs text-gray-600 text-center">
                                        {event.availableSeats} seats remaining
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Other Events You Might Like */}
                {otherEvents.length > 0 && (
                    <div className="mt-16 border-t border-white/10 pt-10">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-white text-xl font-bold">Other Events You Might Like</h2>
                                <p className="text-gray-500 text-xs mt-1">Discover more upcoming events and experiences</p>
                            </div>
                            <Link to="/" className="text-xs text-[#E50914] hover:underline font-semibold">
                                View All
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {otherEvents.slice(0, 4).map((otherEv) => (
                                <EventCard
                                    key={otherEv._id}
                                    event={otherEv}
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDetail;
