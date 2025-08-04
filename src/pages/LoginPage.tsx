import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import LoadingSpinner from "../components/LoadingSpinner";

// Create a separate component for the login form that uses the Google OAuth hook
const LoginForm: React.FC = () => {
  const { login, isAuthenticated, loading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to dashboard after successful login
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log("Google login success:", tokenResponse);

        // Get user info using the access token
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        const userData = await response.json();

        // Store user data for fallback
        localStorage.setItem("fabledrop_jwt_payload", JSON.stringify(userData));

        // Use the access token for API calls
        await login(tokenResponse.access_token);
      } catch (err) {
        console.error("Login failed:", err);
      }
    },
    onError: () => {
      console.log("Login Failed");
    },
    scope:
      "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3C2A1E] via-[#5D4037] to-[#2C3E50]">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        {/* Bookstore Background Effects */}
        <div className="absolute inset-0">
          {/* Warm lighting overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#F4A261]/20 via-transparent to-[#2C3E50]/30"></div>

          {/* Floating book particles */}
          <div className="absolute top-20 left-10 text-[#F4A261]/30 text-2xl animate-pulse">
            📖
          </div>
          <div className="absolute top-32 right-16 text-[#F4A261]/20 text-xl animate-pulse delay-500">
            📚
          </div>
          <div className="absolute bottom-40 left-20 text-[#F4A261]/25 text-3xl animate-pulse delay-1000">
            📓
          </div>
          <div className="absolute bottom-60 right-10 text-[#F4A261]/30 text-2xl animate-pulse delay-700">
            📕
          </div>

          {/* Bookshelf shadows */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[#2C3E50]/40 to-transparent"></div>
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[#2C3E50]/40 to-transparent"></div>
        </div>

        <div className="max-w-4xl w-full mx-auto text-center relative z-10">
          {/* Cozy Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-[#8B4513] via-[#F4A261] to-[#2C3E50] rounded-full mb-6 shadow-2xl border-4 border-[#F6F1EB]/30">
              <span className="text-4xl">📚</span>
              <span className="text-2xl ml-2">☕</span>
            </div>
            <h1 className="text-6xl font-serif font-bold text-[#F6F1EB] mb-4 leading-tight drop-shadow-lg">
              FableDrop
            </h1>
            <p className="text-[#F4A261] font-serif text-lg italic tracking-wide">
              ~ A Literary Sanctuary ~
            </p>
          </div>

          {/* Hero Content */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#F6F1EB] mb-6 leading-tight drop-shadow-lg">
              A Magical Book Box,
              <br />
              <span className="text-[#F4A261]">Delivered Monthly</span>
            </h2>
            <p className="text-xl text-[#F6F1EB]/90 mb-8 max-w-2xl mx-auto leading-relaxed font-serif">
              Like finding a hidden gem in your favorite bookstore corner —
              handpicked paperbacks that whisper stories of heartwarming tales,
              thrilling adventures, and quiet escapes.
            </p>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Google Login */}
            <div className="max-w-md mx-auto mb-8">
              <button
                onClick={() => googleLogin()}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] text-[#F6F1EB] font-semibold rounded-lg hover:from-[#A0522D] hover:to-[#8B4513] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-[#F4A261]/30"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                📖 Enter the Literary Haven
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
              <div className="p-6 bg-gradient-to-br from-[#8B4513]/20 via-[#F6F1EB]/90 to-[#F6F1EB]/70 rounded-lg shadow-lg backdrop-blur-sm border border-[#F4A261]/30">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="font-serif font-semibold text-[#2C3E50] mb-2">
                  Curated by booklovers
                </h3>
                <p className="text-sm text-[#5D4037] font-serif italic">
                  Like a trusted friend's recommendation
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-[#8B4513]/20 via-[#F6F1EB]/90 to-[#F6F1EB]/70 rounded-lg shadow-lg backdrop-blur-sm border border-[#F4A261]/30">
                <div className="text-4xl mb-3">📦</div>
                <h3 className="font-serif font-semibold text-[#2C3E50] mb-2">
                  Delivered with care
                </h3>
                <p className="text-sm text-[#5D4037] font-serif italic">
                  Wrapped like a precious gift
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-[#8B4513]/20 via-[#F6F1EB]/90 to-[#F6F1EB]/70 rounded-lg shadow-lg backdrop-blur-sm border border-[#F4A261]/30">
                <div className="text-4xl mb-3">🕯️</div>
                <h3 className="font-serif font-semibold text-[#2C3E50] mb-2">
                  One book, once a month
                </h3>
                <p className="text-sm text-[#5D4037] font-serif italic">
                  Perfect for cozy evenings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#F4A261] rounded-full flex justify-center">
            <div className="w-1 h-3 bg-[#F4A261] rounded-full mt-2"></div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-20 bg-gradient-to-b from-[#2C3E50] to-[#3C2A1E] relative">
        {/* Bookstore ambiance */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-16 text-[#F4A261]/20 text-xl animate-pulse">
            📖
          </div>
          <div className="absolute bottom-16 right-20 text-[#F4A261]/15 text-2xl animate-pulse delay-1000">
            ☕
          </div>
          <div className="absolute top-32 right-32 text-[#F4A261]/25 text-lg animate-pulse delay-500">
            🕯️
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-serif font-bold text-[#F6F1EB] mb-8 drop-shadow-lg">
            Why FableDrop?
          </h2>
          <p className="text-xl text-[#F6F1EB]/90 leading-relaxed max-w-3xl mx-auto font-serif">
            We believe in the quiet magic of turning pages and the joy of
            discovery. Like a trusted librarian, we provide access to a vast
            literary world where
            <span className="text-[#F4A261] font-semibold italic">
              {" "}
              you choose your own adventures
            </span>{" "}
            — finding stories that speak to your soul, one page at a time.
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-[#F6F1EB]/50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-[#2C3E50] text-center mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#F4A261] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-serif font-semibold text-[#2C3E50] mb-4">
                You Subscribe
              </h3>
              <p className="text-gray-600">
                Choose a plan that fits your reading pace — quarterly,
                half-yearly, or annual.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#F4A261] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-serif font-semibold text-[#2C3E50] mb-4">
                You Choose
              </h3>
              <p className="text-gray-600">
                Browse our vast collection and select books that captivate you.
                From moving memoirs to gripping fiction — the choice is yours.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#F4A261] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-serif font-semibold text-[#2C3E50] mb-4">
                You Read
              </h3>
              <p className="text-gray-600">
                Your chosen book arrives. You brew a cuppa. The world disappears
                for a while.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-[#2C3E50] text-center mb-16">
            What Readers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#F6F1EB]/50 p-8 rounded-2xl">
              <p className="text-lg text-gray-700 mb-4 italic">
                "It's the only subscription that feels like a hug."
              </p>
              <p className="text-[#F4A261] font-semibold">– Rhea, Bangalore</p>
            </div>
            <div className="bg-[#F6F1EB]/50 p-8 rounded-2xl">
              <p className="text-lg text-gray-700 mb-4 italic">
                "I've discovered stories I'd never have picked myself — and I'm
                so glad I did."
              </p>
              <p className="text-[#F4A261] font-semibold">– Aarav, Pune</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-[#F6F1EB]/50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-[#2C3E50] text-center mb-16">
            Choose Your Adventure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-serif font-semibold text-[#2C3E50] mb-4">
                Quarterly Plan
              </h3>
              <p className="text-3xl font-bold text-[#F4A261] mb-4">
                ₹1,499{" "}
                <span className="text-lg text-gray-600 font-normal">
                  / 3 months
                </span>
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-600">
                  <span className="mr-3">📚</span>3 books you choose + surprise
                  bookmarks
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="mr-3">📮</span>
                  Free shipping across India
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="mr-3">🎯</span>
                  Perfect for casual readers
                </li>
              </ul>
              <button className="w-full bg-[#2C3E50] text-white py-3 rounded-full font-semibold hover:bg-[#34495E] transition-colors duration-300">
                Choose Quarterly
              </button>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg ring-4 ring-[#F4A261] relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#F4A261] text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-serif font-semibold text-[#2C3E50] mb-4">
                Half Yearly Plan
              </h3>
              <p className="text-3xl font-bold text-[#F4A261] mb-4">
                ₹2,499{" "}
                <span className="text-lg text-gray-600 font-normal">
                  / 6 months
                </span>
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-600">
                  <span className="mr-3">💰</span>
                  Save 15% + bonus bookish goodies
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="mr-3">📚</span>6 books you choose + surprises
                </li>
              </ul>
              <button className="w-full bg-[#F4A261] text-white py-3 rounded-full font-semibold hover:bg-[#E8956A] transition-colors duration-300">
                Choose Half Yearly
              </button>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-serif font-semibold text-[#2C3E50] mb-4">
                Annual Plan
              </h3>
              <p className="text-3xl font-bold text-[#F4A261] mb-4">
                ₹3,499{" "}
                <span className="text-lg text-gray-600 font-normal">
                  / 12 months
                </span>
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-600">
                  <span className="mr-3">🎯</span>
                  Save 25% + premium benefits
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="mr-3">📚</span>
                  12 books you choose + monthly surprises
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="mr-3">👑</span>
                  Priority access to new releases
                </li>
              </ul>
              <button className="w-full bg-[#2C3E50] text-white py-3 rounded-full font-semibold hover:bg-[#34495E] transition-colors duration-300">
                Choose Annual
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#2C3E50] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-2xl mr-2">📚</span>
            <span className="text-xl font-serif font-bold">FableDrop</span>
          </div>
          <p className="text-gray-300 mb-4">
            Stories dropping at your doorstep
          </p>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Link
              to="/privacy"
              className="text-sm text-gray-400 hover:text-[#F4A261] transition-colors underline"
            >
              Privacy Policy
            </Link>
          </div>
          <p className="text-sm text-gray-400">
            © 2024 FableDrop. Crafted with love for book lovers.
          </p>
        </div>
      </div>
    </div>
  );
};

const LoginPage: React.FC = () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Configuration Error
            </h2>
            <p className="text-gray-600 mb-4">
              Google OAuth Client ID is missing. Please check your environment
              configuration.
            </p>
            <p className="text-sm text-gray-500">
              Make sure REACT_APP_GOOGLE_CLIENT_ID is set in your .env file.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <LoginForm />
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
