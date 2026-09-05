import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

// Plain text status — no dots, no pills, no badges, no icons
const PlainStatusText = ({ status }) => {
    if (status === 'confirmed') return <span className="text-xs text-gray-200 font-medium">Confirmed</span>;
    if (status === 'pending')   return <span className="text-xs text-gray-400 font-medium">Pending</span>;
    return <span className="text-xs text-gray-500 font-medium">Cancelled</span>;
};

// Registered event card — image-first, clean, neutral
const RegisteredEventCard = ({ booking, onCancel }) => {
    const event = booking.eventId;
    if (!event) return null;

    const dateObj = new Date(event.date);
    const day   = dateObj.toLocaleDateString(undefined, { day: 'numeric' });
    const month = dateObj.toLocaleDateString(undefined, { month: 'short' });
    const time  = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    return (
        <div
            id={`registered-card-${booking._id}`}
            className="group relative flex-shrink-0 w-60 rounded-sm overflow-hidden bg-[#181818] border border-white/10"
        >
            {/* Image — primary visual */}
            <div className="relative h-36 overflow-hidden bg-[#222]">
                {event.imageUrl ? (
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop";
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700 text-4xl font-black uppercase">
                        {event.category?.[0] || 'E'}
                    </div>
                )}

                {/* Date chip */}
                <div className="absolute top-2.5 left-2.5 bg-black/80 px-2 py-1 rounded-sm text-center leading-none border border-white/10">
                    <p className="text-white text-xs font-bold">{day}</p>
                    <p className="text-gray-400 text-[10px] uppercase tracking-wide">{month}</p>
                </div>

                {/* Status — plain small text */}
                <div className="absolute top-2.5 right-2.5 bg-black/80 px-2 py-1 rounded-sm border border-white/10">
                    <PlainStatusText status={booking.status} />
                </div>
            </div>

            {/* Info */}
            <div className="p-3.5 pt-3">
                <p className="text-[#E50914] text-[10px] font-bold uppercase tracking-wider mb-1">
                    {event.category}
                </p>
                <h3 className="text-white text-sm font-semibold leading-snug line-clamp-2 mb-2">
                    {event.title}
                </h3>
                <div className="space-y-1 mb-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1.5">
                        <FaMapMarkerAlt className="flex-shrink-0 text-gray-600 text-[10px]" />
                        <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <FaCalendarAlt className="flex-shrink-0 text-gray-600 text-[10px]" />
                        <span>{time}</span>
                        <span className="text-gray-600">·</span>
                        <span>{event.ticketPrice === 0 ? <span className="text-gray-300">Free</span> : `₹${event.ticketPrice}`}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 border-t border-white/10 pt-3">
                    <Link
                        to={`/events/${event._id}`}
                        id={`view-ticket-${booking._id}`}
                        className="flex-1 text-center text-xs font-semibold py-1.5 rounded-sm bg-white/5 border border-white/10 text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        View Details
                    </Link>
                    {booking.status === 'pending' && (
                        <button
                            id={`cancel-booking-${booking._id}`}
                            onClick={() => onCancel(booking._id)}
                            className="text-xs text-gray-500 hover:text-red-400 transition-colors px-1"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// Horizontal scroll row
const HorizontalScrollRow = ({ bookings, onCancel }) => {
    const scrollRef = useRef(null);

    const scroll = (dir) => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: dir * 260, behavior: 'smooth' });
    };

    return (
        <div className="relative group/row">
            <button
                onClick={() => scroll(-1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-7 h-7 rounded-full bg-[#181818] border border-white/10 text-gray-400 hover:text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
                aria-label="Scroll left"
            >
                <FaChevronLeft className="text-xs" />
            </button>
            <button
                onClick={() => scroll(1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-7 h-7 rounded-full bg-[#181818] border border-white/10 text-gray-400 hover:text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
                aria-label="Scroll right"
            >
                <FaChevronRight className="text-xs" />
            </button>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {bookings.map(booking => (
                    <RegisteredEventCard
                        key={booking._id}
                        booking={booking}
                        onCancel={onCancel}
                    />
                ))}
            </div>
        </div>
    );
};

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        if (!window.confirm('Cancel this booking?')) return;
        try {
            await api.delete(`/bookings/${id}`);
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.message || 'Error cancelling booking');
        }
    };

    const activeBookings = bookings.filter(b => b.eventId && b.status !== 'cancelled');
    const allBookings    = bookings;

    if (loading) return (
        <div className="min-h-screen bg-[#111111] flex items-center justify-center pt-16 font-sans">
            <div className="w-6 h-6 border-2 border-gray-700 border-t-white rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#111111] text-[#F2F2F2] pt-16 pb-20 font-sans">
            <div className="max-w-5xl mx-auto px-6 py-8">

                {/* ── User Header ── */}
                <div className="mb-8 pb-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            Welcome back, <span className="text-[#E50914]">{user?.name || 'User'}</span>
                        </h1>
                        <p className="text-gray-400 text-xs md:text-sm mt-1">
                            {user?.email} · Manage your registered events and booking history
                        </p>
                    </div>
                    <div>
                        <span className="text-xs px-3 py-1.5 rounded bg-white/5 border border-white/10 text-gray-300 font-medium capitalize">
                            {user?.role || 'User'} Account
                        </span>
                    </div>
                </div>

                {/* ── Registered Events ── */}
                <section className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white text-base font-semibold">Registered Events</h2>
                        {activeBookings.length > 0 && (
                            <Link to="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                                + Find more
                            </Link>
                        )}
                    </div>

                    {activeBookings.length === 0 ? (
                        <div className="rounded-sm bg-[#151515] border border-white/10 py-12 flex flex-col items-center gap-3">
                            <p className="text-gray-500 text-xs">No registered events yet.</p>
                            <Link
                                to="/"
                                id="explore-events-btn"
                                className="text-xs font-semibold px-4 py-2 rounded-sm bg-[#E50914] hover:bg-[#c9080f] text-white transition-colors"
                            >
                                Explore Events
                            </Link>
                        </div>
                    ) : (
                        <HorizontalScrollRow bookings={activeBookings} onCancel={cancelBooking} />
                    )}
                </section>

                {/* ── All Bookings (Detail List) ── */}
                {allBookings.length > 0 && (
                    <section>
                        <h2 className="text-white text-base font-semibold mb-1">Booking History</h2>
                        <p className="text-gray-500 text-xs mb-4">{allBookings.length} total · including cancelled</p>

                        <div className="divide-y divide-white/10 border-t border-b border-white/10">
                            {allBookings.map(booking => (
                                <div key={booking._id} className="py-3.5 flex items-center justify-between gap-4">
                                    {/* Event Details */}
                                    <div className="min-w-0">
                                        <p className="text-gray-200 text-sm font-semibold truncate">
                                            {booking.eventId?.title || <span className="text-gray-600 italic">Deleted event</span>}
                                        </p>
                                        <p className="text-gray-500 text-xs mt-0.5">
                                            {booking.eventId
                                                ? new Date(booking.eventId.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
                                                : '—'
                                            }
                                            <span className="mx-2 text-gray-700">·</span>
                                            {booking.amount === 0 ? 'Free' : `₹${booking.amount}`}
                                        </p>
                                    </div>

                                    {/* Status — plain plain text */}
                                    <PlainStatusText status={booking.status} />
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 mt-2">
                            <Link to="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                                ← Back to events
                            </Link>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
