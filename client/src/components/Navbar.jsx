import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => setMenuOpen(false), [location]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/70 to-transparent'}`}>
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <FaTicketAlt className="text-[#E50914] text-lg" />
                    <span className="text-white font-bold text-lg tracking-tight">Eventora</span>
                </Link>

                {/* Links */}
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-sm text-gray-300 hover:text-white transition-colors">
                        Events
                    </Link>

                    {user ? (
                        <>
                            <Link
                                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                className="text-sm text-gray-300 hover:text-white transition-colors"
                            >
                                Dashboard
                            </Link>
                            <button
                                id="logout-btn"
                                onClick={handleLogout}
                                className="text-sm text-gray-300 hover:text-white transition-colors"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors">
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                id="signup-nav-btn"
                                className="text-sm bg-[#E50914] hover:bg-[#c9080f] text-white font-medium px-4 py-1.5 rounded transition-colors"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
