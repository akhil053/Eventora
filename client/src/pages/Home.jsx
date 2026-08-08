import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { FaSearch } from 'react-icons/fa';

// Skeleton for grid cards
const SkeletonCard = () => (
    <div className="rounded overflow-hidden bg-[#1c1c1c]">
        <div className="skeleton h-36 w-full" />
        <div className="p-3 space-y-2">
            <div className="skeleton h-2.5 w-1/4" />
            <div className="skeleton h-3.5 w-4/5" />
            <div className="skeleton h-2.5 w-1/3" />
        </div>
    </div>
);

// Featured strip — the soonest event, shown large with its actual image
const FeaturedEvent = ({ event }) => {
    if (!event) return null;
    return (
        <Link
            to={`/events/${event._id}`}
            id={`featured-event-${event._id}`}
            className="group relative block h-[42vh] overflow-hidden"
        >
            {event.imageUrl ? (
                <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
            ) : (
                <div className="w-full h-full bg-[#1c1c1c]" />
            )}
            {/* gradient — heavier at the bottom where the text sits */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-3xl">
                <p className="text-[#E50914] text-xs font-semibold uppercase tracking-widest mb-2">
                    {event.category} &nbsp;·&nbsp; Featured
                </p>
                <h2 className="text-white text-2xl md:text-3xl font-semibold leading-snug mb-3">
                    {event.title}
                </h2>
                <div className="flex items-center gap-5 text-sm text-gray-300">
                    <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    <span className="text-gray-600">·</span>
                    <span>{event.location}</span>
                    <span className="text-gray-600">·</span>
                    <span>{event.ticketPrice === 0 ? <span className="text-green-400">Free</span> : `₹${event.ticketPrice}`}</span>
                </div>
            </div>
        </Link>
    );
};

// Grid card — compact, image-led, whole card is the link
const EventCard = ({ event }) => (
    <Link
        to={`/events/${event._id}`}
        id={`event-card-${event._id}`}
        className="group block rounded overflow-hidden bg-[#1c1c1c] hover:bg-[#222] transition-colors"
    >
        <div className="relative h-36 overflow-hidden">
            {event.imageUrl ? (
                <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop";
                    }}
                />
            ) : (
                <div className="w-full h-full bg-[#252525] flex items-center justify-center text-gray-700 text-3xl font-black uppercase">
                    {event.category?.[0] || 'E'}
                </div>
            )}
        </div>
        <div className="p-3">
            <p className="text-[#E50914] text-[11px] font-semibold uppercase tracking-wider mb-1">
                {event.category}
            </p>
            <h3 className="text-gray-100 text-sm font-medium leading-snug line-clamp-2 mb-2">
                {event.title}
            </h3>
            <div className="flex items-center justify-between text-[11px] text-gray-500">
                <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                <span>
                    {event.ticketPrice === 0
                        ? <span className="text-green-500">Free</span>
                        : `₹${event.ticketPrice}`
                    }
                </span>
            </div>
        </div>
    </Link>
);

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(fetchEvents, 350);
        return () => clearTimeout(t);
    }, [search]);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // First event is the featured one — rest go in the grid
    const featured = !search && events.length > 0 ? events[0] : null;
    const gridEvents = featured ? events.slice(1) : events;

    return (
        <div className="min-h-screen bg-[#141414]">
            {/* Featured event — live content, not a generic banner */}
            {!loading && <FeaturedEvent event={featured} />}
            {loading && <div className="skeleton h-[42vh] w-full" />}

            {/* Search + grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

                {/* Search row */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <h2 className="text-white text-base font-semibold flex-shrink-0">
                        {search ? `"${search}"` : 'All Events'}
                    </h2>
                    <div className="relative w-full max-w-xs">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs" />
                        <input
                            id="event-search-input"
                            type="text"
                            placeholder="Search events..."
                            className="w-full pl-9 pr-3 py-2 bg-[#1c1c1c] border border-white/8 rounded text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-white/20 transition-colors"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : gridEvents.length === 0 && !featured ? (
                    <p className="py-20 text-center text-gray-600 text-sm">
                        {search ? 'No events match that search.' : 'No events yet.'}
                    </p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {gridEvents.map(event => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                )}
            </div>

            <footer className="border-t border-white/5 py-6 px-6 mt-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <span className="text-white text-sm font-semibold">Eventora</span>
                    <span className="text-gray-700 text-xs">© {new Date().getFullYear()}</span>
                </div>
            </footer>
        </div>
    );
};

export default Home;
