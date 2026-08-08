import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                await register(name, email, password);
                setShowOTP(true);
            } else {
                await verifyOTP(email, otp);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <Link to="/" className="text-white font-bold text-2xl">
                        Event<span className="text-[#E50914]">ora</span>
                    </Link>
                </div>

                <div className="bg-[#1f1f1f] rounded-lg px-8 py-10">
                    <h1 className="text-white text-2xl font-bold mb-1">
                        {showOTP ? 'Verify your email' : 'Create account'}
                    </h1>
                    <p className="text-gray-500 text-sm mb-7">
                        {showOTP ? `Enter the code sent to ${email}` : 'Join Eventora today'}
                    </p>

                    {error && (
                        <div className="bg-red-900/30 border border-red-800/50 text-red-400 text-sm px-4 py-3 rounded mb-5">
                            {error}
                        </div>
                    )}

                    <form id="register-form" onSubmit={handleSubmit} className="space-y-4">
                        {!showOTP ? (
                            <>
                                <div>
                                    <label className="block text-gray-400 text-xs font-medium mb-1.5">Full name</label>
                                    <input
                                        id="register-name"
                                        type="text"
                                        required
                                        autoFocus
                                        className="w-full bg-[#2a2a2a] border border-white/10 text-white text-sm rounded px-3 py-2.5 placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs font-medium mb-1.5">Email</label>
                                    <input
                                        id="register-email"
                                        type="email"
                                        required
                                        className="w-full bg-[#2a2a2a] border border-white/10 text-white text-sm rounded px-3 py-2.5 placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs font-medium mb-1.5">Password</label>
                                    <input
                                        id="register-password"
                                        type="password"
                                        required
                                        className="w-full bg-[#2a2a2a] border border-white/10 text-white text-sm rounded px-3 py-2.5 placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-gray-400 text-xs font-medium mb-1.5">Verification code</label>
                                <input
                                    id="register-otp"
                                    type="text"
                                    required
                                    autoFocus
                                    className="w-full bg-[#2a2a2a] border border-white/10 text-white text-sm rounded px-3 py-2.5 placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors tracking-widest text-center font-bold"
                                    placeholder="- - - -"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength="6"
                                />
                                <p className="text-gray-600 text-xs mt-2">Check your inbox for the code.</p>
                            </div>
                        )}

                        <button
                            id="register-submit-btn"
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#E50914] hover:bg-[#c9080f] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded transition-colors mt-2"
                        >
                            {loading ? 'Please wait...' : showOTP ? 'Verify & continue' : 'Create account'}
                        </button>
                    </form>

                    {!showOTP && (
                        <p className="text-gray-500 text-sm text-center mt-6">
                            Already have an account?{' '}
                            <Link to="/login" className="text-white hover:underline">Sign in</Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;
