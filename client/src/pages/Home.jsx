import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import EventCard from '../components/EventCard';

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

// Featured Slider — Auto-sliding carousel of top front events
const FeaturedSlider = ({ events }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const featuredList = events.slice(0, 5);

    useEffect(() => {
        if (featuredList.length <= 1 || isHovered) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredList.length);
        }, 4500);
        return () => clearInterval(timer);
    }, [featuredList.length, isHovered]);

    if (!featuredList.length) return null;
    const current = featuredList[currentIndex];

    const prevSlide = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? featuredList.length - 1 : prev - 1));
    };

    const nextSlide = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % featuredList.length);
    };

    return (
        <div
            className="relative h-[48vh] min-h-[340px] max-h-[500px] overflow-hidden bg-[#181818]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={current._id}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <Link to={`/events/${current._id}`} className="block w-full h-full relative group">
                        {current.imageUrl ? (
                            <img
                                src={current.imageUrl}
                                alt={current.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop";
                                }}
                            />
                        ) : (
                            <div className="w-full h-full bg-[#1c1c1c] flex items-center justify-center text-gray-700 text-6xl font-black uppercase">
                                {current.category?.[0] || 'E'}
                            </div>
                        )}

                        {/* Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/80 via-transparent to-transparent" />

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-3xl">
                            <span className="inline-block bg-[#E50914] text-white text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded mb-3">
                                {current.category} · Featured
                            </span>
                            <h2 className="text-white text-2xl md:text-4xl font-bold leading-tight mb-3 line-clamp-2 drop-shadow-md">
                                {current.title}
                            </h2>
                            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-300 mb-4">
                                <span>{new Date(current.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                <span className="text-gray-600">·</span>
                                <span>{current.location}</span>
                                <span className="text-gray-600">·</span>
                                <span className="font-semibold text-white">
                                    {current.ticketPrice === 0 ? <span className="text-green-400">Free</span> : `₹${current.ticketPrice}`}
                                </span>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </AnimatePresence>

            {/* Prev & Next Buttons */}
            {featuredList.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/10 hover:scale-110 shadow-lg"
                        aria-label="Previous event"
                    >
                        <FaChevronLeft className="text-sm" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/10 hover:scale-110 shadow-lg"
                        aria-label="Next event"
                    >
                        <FaChevronRight className="text-sm" />
                    </button>

                    {/* Pagination Indicators */}
                    <div className="absolute bottom-4 right-6 z-10 flex items-center gap-2">
                        {featuredList.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setCurrentIndex(idx);
                                }}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    idx === currentIndex ? 'w-6 bg-[#E50914]' : 'w-2 bg-white/40 hover:bg-white/70'
                                }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

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

    return (
        <div className="min-h-screen bg-[#141414]">
            {/* Auto-sliding hero slider for top events */}
            {!search && !loading && <FeaturedSlider events={events} />}
            {loading && <div className="skeleton h-[48vh] min-h-[340px] w-full" />}

            {/* Search + Grid section */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                {/* Search Header */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <h2 className="text-white text-lg font-semibold flex-shrink-0">
                        {search ? `Search results for "${search}"` : 'All Events'}
                    </h2>
                    <div className="relative w-full max-w-xs">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                        <input
                            id="event-search-input"
                            type="text"
                            placeholder="Search events..."
                            className="w-full pl-9 pr-3 py-2 bg-[#1c1c1c] border border-white/10 rounded text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : events.length === 0 ? (
                    <p className="py-20 text-center text-gray-500 text-sm">
                        {search ? 'No events match that search.' : 'No events found.'}
                    </p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {events.map(event => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                )}
            </div>

            <footer className="border-t border-white/5 py-6 px-6 mt-12">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <span className="text-white text-sm font-semibold">Eventora</span>
                    <span className="text-gray-600 text-xs">© {new Date().getFullYear()} Eventora. All rights reserved.</span>
                </div>
            </footer>
        </div>
    );
};

export default Home;
