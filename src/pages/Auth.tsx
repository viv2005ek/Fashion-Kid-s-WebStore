import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEmailSentModal, setShowEmailSentModal] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) throw error;
      navigate('/');
    } else {
      // For signup, check if email confirmation is required
      const { data, error } = await signUp(email, password);
      
      if (error) throw error;
      
      console.log('Signup response:', data);
      
      // Show email sent modal if user needs to confirm email
      if (data.user && !data.session) {
        setShowEmailSentModal(true);
      } else if (data.session) {
        // If auto-confirm is enabled, redirect to home
        navigate('/');
      }
    }
  } catch (error: any) {
    console.error('Auth error:', error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      setShowEmailSentModal(true);
      setShowForgotPassword(false);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-pink-100">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="flex items-center text-pink-500 hover:text-pink-700 mb-4 font-poppins"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign In
            </button>

            <div className="text-center">
              <h2 className="text-3xl font-bold text-cute-charcoal font-baloo mb-2">
                Reset Password 🔐
              </h2>
              <p className="text-cute-charcoal opacity-70 font-poppins">
                Enter your email to receive a password reset link
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pink-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-300 font-poppins"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-poppins"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-20">
        {/* Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 text-pink-300 text-3xl animate-float">💖</div>
          <div className="absolute top-32 right-32 text-purple-300 text-2xl animate-bounce-slow">✨</div>
          <div className="absolute bottom-32 left-1/4 text-blue-300 text-xl animate-float-reverse">🌸</div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-pink-100">
            <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl font-bold text-cute-charcoal font-baloo mb-2"
              >
                {isLogin ? 'Welcome Back! 💕' : 'Join Pastel Dream ✨'}
              </motion.h2>
              <p className="text-cute-charcoal opacity-70 font-poppins">
                {isLogin ? 'Sign in to your account' : 'Create your dreamy account'}
              </p>
            </div>

            {/* Google Sign In Button */}
            <motion.button
              onClick={handleGoogleSignIn}
              disabled={loading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-poppins flex items-center justify-center space-x-3 mt-6"
            >
              <img src="https://cdn.iconscout.com/icon/free/png-512/free-google-icon-svg-download-png-1507807.png?f=webp&w=512" alt="Google" className="w-5 h-5" />
              <span>Continue with Google</span>
            </motion.button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with email</span>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pink-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-300 font-poppins"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-cute-charcoal mb-2 font-poppins">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pink-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border-2 border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-300 font-poppins"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-400 hover:text-pink-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-pink-500 hover:text-pink-700 text-sm font-poppins"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-poppins"
              >
                {loading ? 'Please wait...' : (isLogin ? '💕 Sign In' : '✨ Create Account')}
              </motion.button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-pink-500 hover:text-pink-700 font-medium font-poppins"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Email Sent Modal */}
      {showEmailSentModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full text-center border-2 border-pink-100"
          >
            <div className="text-6xl mb-4">📧</div>
            <h3 className="text-2xl font-bold text-cute-charcoal font-baloo mb-4">
              Check Your Email!
            </h3>
            <p className="text-cute-charcoal opacity-70 font-poppins mb-6">
              We've sent a confirmation email to <strong>{email}</strong>. 
              Please check your inbox and click the link to verify your account.
            </p>
            <motion.button
              onClick={() => {
                setShowEmailSentModal(false);
                if (isLogin) {
                  navigate('/');
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-poppins"
            >
              Got it!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};