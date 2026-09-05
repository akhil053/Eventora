import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const { login, verifyOTP, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleGoogleResponse = useCallback(async (response) => {
        setGoogleLoading(true);
        setError('');
        try {
            const data = await googleLogin(response.credential);
            if (data.role === 'admin') navigate('/admin');
            else navigate('/dashboard');
        } catch (err) {
            setError(err.message || err || 'Google login failed');
        } finally {
            setGoogleLoading(false);
        }
    }, [googleLogin, navigate]);

    useEffect(() => {
        if (window.google && GOOGLE_CLIENT_ID) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleResponse,
            });
            window.google.accounts.id.renderButton(
                document.getElementById('google-signin-btn'),
                {
                    theme: 'filled_black',
                    size: 'large',
                    width: 280,
                    shape: 'rectangular',
                    text: 'signin_with',
                    logo_alignment: 'center',
                }
            );
        }
    }, [handleGoogleResponse]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                const data = await login(email, password);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            } else {
                const data = await verifyOTP(email, otp);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            }
        } catch (err) {
            if (err.needsVerification) {
                setShowOTP(true);
                setError('Account not verified. OTP has been sent to your email.');
            } else {
                setError(err.message || err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="text-white font-bold text-2xl">
                        Event<span className="text-[#E50914]">ora</span>
                    </Link>
                </div>

                <div className="bg-[#1f1f1f] rounded-lg px-8 py-10">
                    <h1 className="text-white text-2xl font-bold mb-1">
                        {showOTP ? 'Check your email' : 'Sign in'}
                    </h1>
                    <p className="text-gray-500 text-sm mb-7">
                        {showOTP ? `We sent a code to ${email}` : 'Welcome back to Eventora'}
                    </p>

                    {error && (
                        <div className="bg-red-900/30 border border-red-800/50 text-red-400 text-sm px-4 py-3 rounded mb-5">
                            {error}
                        </div>
                    )}

                    <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
                        {!showOTP ? (
                            <>
                                <div>
                                    <label className="block text-gray-400 text-xs font-medium mb-1.5">Email</label>
                                    <input
                                        id="login-email"
                                        type="email"
                                        required
                                        autoFocus
                                        className="w-full bg-[#2a2a2a] border border-white/10 text-white text-sm rounded px-3 py-2.5 placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs font-medium mb-1.5">Password</label>
                                    <input
                                        id="login-password"
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
                                <label className="block text-gray-400 text-xs font-medium mb-1.5">One-time code</label>
                                <input
                                    id="login-otp"
                                    type="text"
                                    required
                                    autoFocus
                                    className="w-full bg-[#2a2a2a] border border-white/10 text-white text-sm rounded px-3 py-2.5 placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors tracking-widest text-center font-bold"
                                    placeholder="- - - -"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength="6"
                                />
                            </div>
                        )}

                        <button
                            id="login-submit-btn"
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#E50914] hover:bg-[#c9080f] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded transition-colors mt-2"
                        >
                            {loading ? 'Please wait...' : showOTP ? 'Verify code' : 'Sign in'}
                        </button>
                    </form>

                    {/* Google Sign In */}
                    {!showOTP && (
                        <>
                            <div className="flex items-center gap-3 my-5">
                                <div className="flex-1 h-px bg-white/10"></div>
                                <span className="text-gray-500 text-xs uppercase tracking-wider">or</span>
                                <div className="flex-1 h-px bg-white/10"></div>
                            </div>

                            <div className="flex justify-center">
                                <div id="google-signin-btn" style={{ minHeight: '44px', width: '100%' }}></div>
                            </div>

                            {googleLoading && (
                                <p className="text-gray-400 text-xs text-center mt-3">Signing in with Google...</p>
                            )}
                        </>
                    )}

                    <p className="text-gray-500 text-sm text-center mt-6">
                        New to Eventora?{' '}
                        <Link to="/register" className="text-white hover:underline">Create account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
