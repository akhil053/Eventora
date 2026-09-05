import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate, Link } from 'react-router-dom';

const inputClass = "w-full bg-[#181818] border border-[#2A2A2A] text-[#F2F2F2] text-xs rounded-sm px-3 py-2 placeholder-[#666666] focus:outline-none focus:border-[#444444] transition-colors font-sans";

// Safe date formatter to fix "Invalid Date"
const formatDate = (dateInput) => {
    if (!dateInput) return 'N/A';
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

// Plain text status treatment (No icons, no dots, no pills, no badges, no background colors)
const PlainTextStatus = ({ status }) => {
    if (status === 'confirmed') return <span className="text-xs text-[#F2F2F2] font-medium font-sans">Confirmed</span>;
    if (status === 'pending')   return <span className="text-xs text-[#E6B800] font-medium font-sans">Pending</span>;
    return <span className="text-xs text-[#666666] font-medium font-sans">Cancelled</span>;
};

// ── Admin Event Item for Events Tab ──
const AdminEventItem = ({ event, bookingsForEvent, onDelete }) => {
    const confirmedCount = bookingsForEvent.filter(b => b.status === 'confirmed').length;
    const pendingCount   = bookingsForEvent.filter(b => b.status === 'pending').length;
    const totalBooked    = event.totalSeats - event.availableSeats;
    const isSoldOut      = event.availableSeats <= 0;

    return (
        <div id={`event-card-${event._id}`} className="flex flex-col bg-[#151515] border border-[#2A2A2A] rounded-sm overflow-hidden font-sans">
            {/* Cover Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#181818]">
                {event.imageUrl ? (
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop";
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#666666] font-bold text-3xl uppercase">
                        {event.category?.[0] || 'E'}
                    </div>
                )}

                {/* Sold out tag */}
                {isSoldOut && (
                    <div className="absolute top-2 right-2 bg-[#111111] text-[#E50914] text-[10px] uppercase font-bold px-2 py-0.5 border border-[#2A2A2A]">
                        Sold Out
                    </div>
                )}
            </div>

            {/* Event Info */}
            <div className="p-4 flex flex-col flex-1">
                <p className="text-[#8A8A8A] text-[10px] font-bold uppercase tracking-wider mb-1">
                    {event.category || 'General'}
                </p>

                <h3 className="text-[#F2F2F2] text-sm font-semibold leading-snug mb-1 line-clamp-1">
                    {event.title}
                </h3>

                <p className="text-[#8A8A8A] text-xs mb-3">
                    {formatDate(event.date)} <span className="text-[#666666] mx-1">·</span> {event.location}
                </p>

                <div className="mt-auto pt-3 border-t border-[#2A2A2A] flex items-center justify-between text-xs text-[#8A8A8A]">
                    <div>
                        <span className="text-[#F2F2F2] font-medium">{confirmedCount} confirmed</span>
                        {pendingCount > 0 && <span className="text-[#E6B800] ml-1.5">({pendingCount} pending)</span>}
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[#666666] font-mono">{totalBooked}/{event.totalSeats}</span>
                        <Link to={`/events/${event._id}`} className="text-[#F2F2F2] hover:underline">
                            View
                        </Link>
                        <button
                            id={`delete-event-${event._id}`}
                            onClick={() => onDelete(event._id)}
                            className="text-[#8A8A8A] hover:text-[#E50914] transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Simple Data-Management Table for Bookings Tab ──
const BookingsDataTable = ({ bookings, onConfirm, onCancel }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Counts
    const totalCount     = bookings.length;
    const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
    const pendingCount   = bookings.filter(b => b.status === 'pending').length;
    const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;

    // Filtered bookings
    const filteredBookings = useMemo(() => {
        return bookings.filter(b => {
            if (statusFilter !== 'all' && b.status !== statusFilter) return false;

            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const userName = b.userId?.name?.toLowerCase() || '';
                const userEmail = b.userId?.email?.toLowerCase() || '';
                const eventTitle = b.eventId?.title?.toLowerCase() || '';
                return userName.includes(q) || userEmail.includes(q) || eventTitle.includes(q);
            }

            return true;
        });
    }, [bookings, statusFilter, searchQuery]);

    return (
        <div className="font-sans">
            {/* Bookings Section Sub-header */}
            <div className="mb-4">
                <h2 className="text-sm font-semibold text-[#F2F2F2]">Bookings</h2>
                <p className="text-xs text-[#8A8A8A] mt-0.5">{totalCount} total bookings</p>
            </div>

            {/* Simple Filter & Search Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                {/* Search Input */}
                <div className="w-full sm:w-72">
                    <input
                        type="text"
                        placeholder="Search user, email or event..."
                        className={inputClass}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Status Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                    {[
                        { key: 'all', label: `All (${totalCount})` },
                        { key: 'pending', label: `Pending (${pendingCount})` },
                        { key: 'confirmed', label: `Confirmed (${confirmedCount})` },
                        { key: 'cancelled', label: `Cancelled (${cancelledCount})` },
                    ].map(f => (
                        <button
                            key={f.key}
                            onClick={() => setStatusFilter(f.key)}
                            className={`px-3 py-1.5 rounded-sm transition-colors ${
                                statusFilter === f.key
                                    ? 'bg-[#181818] text-[#F2F2F2] font-semibold border border-[#444444]'
                                    : 'bg-[#151515] text-[#8A8A8A] hover:text-[#F2F2F2] border border-[#2A2A2A]'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Data Table */}
            {filteredBookings.length === 0 ? (
                <div className="py-16 text-center border border-[#2A2A2A] text-[#8A8A8A] text-xs">
                    No bookings found.
                </div>
            ) : (
                <div className="border border-[#2A2A2A] bg-[#151515] rounded-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-[#2A2A2A] bg-[#181818] text-[#8A8A8A] uppercase text-[10px]">
                                <th className="py-3 px-4 font-semibold">User</th>
                                <th className="py-3 px-4 font-semibold">Event</th>
                                <th className="py-3 px-4 font-semibold">Date Booked</th>
                                <th className="py-3 px-4 font-semibold">Amount</th>
                                <th className="py-3 px-4 font-semibold">Status</th>
                                <th className="py-3 px-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2A2A2A]/50">
                            {filteredBookings.map((b) => (
                                <tr key={b._id} className="hover:bg-[#181818]/60 transition-colors">
                                    {/* USER */}
                                    <td className="py-3 px-4">
                                        <div className="font-semibold text-[#F2F2F2] text-xs">
                                            {b.userId?.name || 'User'}
                                        </div>
                                        <div className="text-[11px] text-[#8A8A8A]">
                                            {b.userId?.email || 'N/A'}
                                        </div>
                                    </td>

                                    {/* EVENT */}
                                    <td className="py-3 px-4 text-[#F2F2F2] font-medium">
                                        {b.eventId?.title || 'Deleted Event'}
                                    </td>

                                    {/* DATE BOOKED */}
                                    <td className="py-3 px-4 text-[#8A8A8A]">
                                        {formatDate(b.bookedAt || b.createdAt)}
                                    </td>

                                    {/* AMOUNT */}
                                    <td className="py-3 px-4">
                                        {b.amount === 0 ? (
                                            <span className="text-[#F2F2F2] font-medium">Free</span>
                                        ) : (
                                            <span className="text-[#F2F2F2]">₹{b.amount}</span>
                                        )}
                                    </td>

                                    {/* STATUS (Normal plain text) */}
                                    <td className="py-3 px-4">
                                        <PlainTextStatus status={b.status} />
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="py-3 px-4 text-right">
                                        {b.status === 'pending' ? (
                                            <div className="inline-flex items-center gap-2">
                                                <button
                                                    id={`approve-paid-${b._id}`}
                                                    onClick={() => onConfirm(b._id, 'paid')}
                                                    className="bg-[#181818] hover:bg-[#202020] text-[#F2F2F2] px-2.5 py-1 border border-[#2A2A2A] rounded-sm text-xs transition-colors"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    id={`reject-${b._id}`}
                                                    onClick={() => onCancel(b._id)}
                                                    className="text-[#8A8A8A] hover:text-[#E50914] text-xs transition-colors px-1"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-[#666666]">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState('events');
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '',
        category: '', totalSeats: '', ticketPrice: '', imageUrl: ''
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') { navigate('/login'); return; }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/my')
            ]);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);
            setShowForm(false);
            setFormData({ title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', imageUrl: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating event');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm('Delete this event?')) return;
        try { await api.delete(`/events/${id}`); fetchData(); }
        catch { alert('Error deleting event'); }
    };

    const handleConfirmBooking = async (id, paymentStatus = 'paid') => {
        try {
            await api.put(`/bookings/${id}/confirm`, { paymentStatus });
            await fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Error confirming booking');
        }
    };

    const handleCancelBooking = async (id) => {
        if (!window.confirm('Reject this booking?')) return;
        try {
            await api.delete(`/bookings/${id}`);
            await fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Error rejecting booking');
        }
    };

    const totalPendingCount = bookings.filter(b => b.status === 'pending').length;

    if (loading) return (
        <div className="min-h-screen bg-[#111111] flex items-center justify-center pt-16 font-sans">
            <div className="w-6 h-6 border-2 border-[#2A2A2A] border-t-[#F2F2F2] rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#111111] text-[#F2F2F2] pt-16 pb-20 font-sans">
            <div className="max-w-6xl mx-auto px-6 py-6">

                {/* Page Title & Active Events Subtitle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-3 border-b border-[#2A2A2A]">
                    <div>
                        <h1 className="text-lg font-bold text-[#F2F2F2]">
                            Welcome, <span className="text-[#E50914]">{user?.name || 'Admin'}</span>
                        </h1>
                        <p className="text-[#8A8A8A] text-xs mt-0.5">
                            {user?.email} · Admin Dashboard · {events.length} active events
                        </p>
                    </div>

                    <button
                        id="create-event-btn"
                        onClick={() => setShowForm(!showForm)}
                        className={`text-xs px-3.5 py-1.5 font-semibold rounded-sm transition-colors ${
                            showForm
                                ? 'bg-[#181818] text-[#8A8A8A] border border-[#2A2A2A]'
                                : 'bg-[#E50914] hover:bg-[#c9080f] text-white'
                        }`}
                    >
                        {showForm ? 'Cancel Creation' : '+ Create Event'}
                    </button>
                </div>

                {/* Create Event Form */}
                {showForm && (
                    <div className="bg-[#151515] p-6 mb-6 border border-[#2A2A2A] rounded-sm">
                        <h2 className="text-[#F2F2F2] text-sm font-semibold mb-4">Create New Event</h2>
                        <form id="create-event-form" onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[#8A8A8A] text-xs mb-1">Event Title</label>
                                <input required type="text" placeholder="e.g. React Retreat" className={inputClass}
                                    value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-[#8A8A8A] text-xs mb-1">Category</label>
                                <input required type="text" placeholder="e.g. Technology, Music" className={inputClass}
                                    value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-[#8A8A8A] text-xs mb-1">Date</label>
                                <input required type="date" className={inputClass}
                                    value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-[#8A8A8A] text-xs mb-1">Location / Venue</label>
                                <input required type="text" placeholder="City, Venue Name" className={inputClass}
                                    value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-[#8A8A8A] text-xs mb-1">Total Seats</label>
                                <input required type="number" placeholder="200" className={inputClass}
                                    value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-[#8A8A8A] text-xs mb-1">Ticket Price (₹)</label>
                                <input required type="number" placeholder="0 for Free" className={inputClass}
                                    value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[#8A8A8A] text-xs mb-1">Cover Image URL</label>
                                <input type="text" placeholder="https://images.unsplash.com/..." className={inputClass}
                                    value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[#8A8A8A] text-xs mb-1">Event Description</label>
                                <textarea required rows={3} placeholder="Event details..."
                                    className={`${inputClass} resize-none`}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="md:col-span-2">
                                <button type="submit" id="publish-event-btn"
                                    className="bg-[#E50914] hover:bg-[#c9080f] text-white text-xs font-semibold px-5 py-2 rounded-sm transition-colors">
                                    Publish Event
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Simple Navigation Tabs */}
                <div className="flex gap-6 mb-5 border-b border-[#2A2A2A] text-xs">
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`font-semibold -mb-px pb-2 border-b-2 transition-colors ${
                            activeTab === 'events' ? 'text-[#F2F2F2] border-[#F2F2F2]' : 'text-[#8A8A8A] border-transparent hover:text-[#F2F2F2]'
                        }`}
                    >
                        Events ({events.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`font-semibold -mb-px pb-2 border-b-2 transition-colors ${
                            activeTab === 'bookings' ? 'text-[#F2F2F2] border-[#F2F2F2]' : 'text-[#8A8A8A] border-transparent hover:text-[#F2F2F2]'
                        }`}
                    >
                        Bookings ({bookings.length})
                    </button>
                </div>

                {/* ── EVENTS TAB ── */}
                {activeTab === 'events' && (
                    <div>
                        {events.length === 0 ? (
                            <div className="py-16 text-center border border-[#2A2A2A] text-[#8A8A8A] text-xs">
                                No events created yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {events.map(event => {
                                    const eventBookings = bookings.filter(b => b.eventId?._id === event._id);
                                    return (
                                        <AdminEventItem
                                            key={event._id}
                                            event={event}
                                            bookingsForEvent={eventBookings}
                                            onDelete={handleDeleteEvent}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ── BOOKINGS TAB ── */}
                {activeTab === 'bookings' && (
                    <BookingsDataTable
                        bookings={bookings}
                        onConfirm={handleConfirmBooking}
                        onCancel={handleCancelBooking}
                    />
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;
