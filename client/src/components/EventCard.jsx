import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event, onClick }) => (
    <Link
        to={`/events/${event._id}`}
        id={`event-card-${event._id}`}
        onClick={onClick}
        className="group block rounded overflow-hidden bg-[#1c1c1c] hover:bg-[#222] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-white/5"
    >
        <div className="relative h-40 overflow-hidden">
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
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-gray-300 font-semibold uppercase tracking-wider">
                {event.category}
            </div>
        </div>
        <div className="p-3.5">
            <h3 className="text-gray-100 text-sm font-semibold leading-snug line-clamp-2 mb-2 group-hover:text-[#E50914] transition-colors">
                {event.title}
            </h3>
            <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                <span className="font-bold">
                    {event.ticketPrice === 0
                        ? <span className="text-green-400">Free</span>
                        : `₹${event.ticketPrice}`
                    }
                </span>
            </div>
        </div>
    </Link>
);

export default EventCard;
