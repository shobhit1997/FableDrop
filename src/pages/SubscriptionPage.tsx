import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { Book } from "../types";

const SubscriptionPage: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    subscription,
    createSubscription,
    orderBook,
    loading,
    error,
    clearError,
    canOrderThisMonth,
    orders,
  } = useSubscription();
  const navigate = useNavigate();

  const [titleQuery, setTitleQuery] = useState("");
  const [authorQuery, setAuthorQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [personalMessage, setPersonalMessage] = useState("");
  const [showOrderModal, setShowOrderModal] = useState(false);

  const handleSearch = async () => {
    const titleTerm = titleQuery.trim();
    const authorTerm = authorQuery.trim();

    if (!titleTerm && !authorTerm) {
      setSearchResults([]);
      return;
    }

    // Build search query
    let query = "";
    if (titleTerm && authorTerm) {
      query = `intitle:"${titleTerm}" inauthor:"${authorTerm}"`;
    } else if (titleTerm) {
      query = `intitle:"${titleTerm}"`;
    } else if (authorTerm) {
      query = `inauthor:"${authorTerm}"`;
    }

    setIsSearching(true);
    try {
      const { GoogleBooksService } = await import("../services/googleBooksApi");
      const googleBooksService = GoogleBooksService.getInstance();
      const results = await googleBooksService.searchBooks(query, 10);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const clearSearch = () => {
    setTitleQuery("");
    setAuthorQuery("");
    setSearchResults([]);
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setShowOrderModal(true);
  };

  const handleOrderSubmit = async () => {
    if (!selectedBook) return;

    try {
      await orderBook(selectedBook, personalMessage);
      setShowOrderModal(false);
      setSelectedBook(null);
      setPersonalMessage("");
      navigate("/dashboard");
    } catch (err) {
      console.error("Order failed:", err);
      // Error is already set in the context, modal will stay open to show the error
    }
  };

  const closeModal = () => {
    setShowOrderModal(false);
    setSelectedBook(null);
    setPersonalMessage("");
    clearError(); // Clear any errors when closing modal
  };

  const handleCreateSubscription = async () => {
    try {
      await createSubscription(
        { genres: [], authors: [], themes: [] },
        "Story subscription created - you choose your own literary adventure!"
      );
    } catch (error) {
      console.error("Failed to create subscription:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3C2A1E] via-[#5D4037] to-[#2C3E50]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#8B4513]/20 via-[#F6F1EB]/90 to-[#F6F1EB]/70 backdrop-blur-sm border-b border-[#F4A261]/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8B4513] via-[#F4A261] to-[#2C3E50] rounded-full flex items-center justify-center text-white text-lg font-bold mr-3">
                  📚
                </div>
                <h1 className="text-xl font-serif font-bold text-[#2C3E50]">
                  FableDrop
                </h1>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user?.picture && (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm font-medium text-[#2C3E50]">
                  {user?.name}
                </span>
              </div>

              <button
                onClick={logout}
                className="text-sm text-[#8B4513] hover:text-[#A0522D] transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-[#F6F1EB]/90 mb-8">
          <Link to="/dashboard" className="hover:text-[#F4A261] font-serif">
            Dashboard
          </Link>
          <span>→</span>
          <span className="text-[#F4A261] font-serif">Choose Your Books</span>
        </nav>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#F6F1EB] mb-2">
            Choose Your Next Adventure
          </h1>
          <p className="text-[#F6F1EB]/90 font-serif">
            Search our vast library and select the perfect book for your reading
            journey
          </p>
        </div>

        {/* Current Subscription Status */}
        {subscription && (
          <div className="bg-gradient-to-br from-[#8B4513]/20 via-[#F6F1EB]/90 to-[#F6F1EB]/70 rounded-xl shadow-lg border border-[#F4A261]/30 p-6 transition-all duration-300 hover:shadow-xl mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif font-semibold text-[#2C3E50]">
                Current Subscription
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  subscription.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {subscription.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#5D4037] font-serif">
                    Start Date
                  </label>
                  <p className="text-[#2C3E50] font-serif">
                    {new Date(subscription.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#5D4037] font-serif">
                    Months Remaining
                  </label>
                  <p className="text-[#2C3E50] font-semibold text-[#F4A261]">
                    {subscription.monthsRemaining} of 6
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {subscription.giftMessage && (
                  <div>
                    <label className="text-sm font-medium text-[#5D4037] font-serif">
                      Gift Message
                    </label>
                    <div className="mt-1 p-3 bg-gradient-to-r from-[#F4A261]/20 to-[#8B4513]/20 rounded-lg border border-[#F4A261]/30">
                      <p className="text-[#2C3E50] italic font-serif">
                        "{subscription.giftMessage}"
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Link
                    to="/dashboard"
                    className="bg-white/50 backdrop-blur-sm text-[#2C3E50] font-serif font-medium py-3 px-6 rounded-lg border border-[#F4A261]/30 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Subscription Message */}
        {!subscription && (
          <div className="bg-gradient-to-br from-[#8B4513]/20 via-[#F6F1EB]/90 to-[#F6F1EB]/70 rounded-xl shadow-lg border border-[#F4A261]/30 p-6 transition-all duration-300 hover:shadow-xl mb-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-serif font-semibold text-[#2C3E50] mb-2">
                Ready to Start Your Literary Journey?
              </h3>
              <p className="text-[#5D4037] font-serif mb-6">
                Create a subscription and start choosing your own books from our
                vast collection!
              </p>
              <button
                onClick={handleCreateSubscription}
                disabled={loading}
                className="bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] text-[#F6F1EB] font-semibold py-3 px-6 rounded-lg hover:from-[#A0522D] hover:to-[#8B4513] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-[#F4A261]/30"
              >
                {loading ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="small" color="white" />
                    <span className="ml-2">Creating...</span>
                  </div>
                ) : (
                  "Create Subscription"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-gradient-to-br from-[#8B4513]/20 via-[#F6F1EB]/90 to-[#F6F1EB]/70 rounded-xl shadow-lg border border-[#F4A261]/30 p-6 transition-all duration-300 hover:shadow-xl mb-8">
          <h2 className="text-xl font-serif font-semibold text-[#2C3E50] mb-4">
            Search for Books
          </h2>
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] font-serif mb-2">
                  Book Title
                </label>
                <input
                  type="text"
                  value={titleQuery}
                  onChange={(e) => setTitleQuery(e.target.value)}
                  placeholder="Enter book title..."
                  className="w-full px-4 py-3 border border-[#F4A261]/30 rounded-lg focus:ring-2 focus:ring-[#F4A261] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm font-serif"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] font-serif mb-2">
                  Author Name
                </label>
                <input
                  type="text"
                  value={authorQuery}
                  onChange={(e) => setAuthorQuery(e.target.value)}
                  placeholder="Enter author name..."
                  className="w-full px-4 py-3 border border-[#F4A261]/30 rounded-lg focus:ring-2 focus:ring-[#F4A261] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm font-serif"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isSearching}
                className="bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] text-[#F6F1EB] font-semibold py-3 px-6 rounded-lg hover:from-[#A0522D] hover:to-[#8B4513] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isSearching ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="small" color="white" />
                    <span className="ml-2">Searching...</span>
                  </div>
                ) : (
                  "Search Books"
                )}
              </button>
              {(titleQuery || authorQuery) && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-sm text-[#8B4513] hover:text-[#A0522D] transition-colors font-serif underline"
                >
                  Clear Search
                </button>
              )}
            </div>
          </form>

          {(titleQuery || authorQuery) && (
            <div className="mt-4">
              <p className="text-sm text-[#5D4037] font-serif">
                {isSearching ? (
                  "Searching through our vast library..."
                ) : (
                  <>
                    Found {searchResults.length} books
                    {titleQuery && ` for title "${titleQuery}"`}
                    {titleQuery && authorQuery && " and"}
                    {authorQuery && ` by author "${authorQuery}"`}
                    {searchResults.length === 0 && " - Try different keywords"}
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* No Results Message */}
        {(titleQuery || authorQuery) &&
          searchResults.length === 0 &&
          !isSearching && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-serif font-semibold text-[#F6F1EB] mb-2">
                No books found for your search
              </h3>
              <p className="text-[#F6F1EB]/90 font-serif mb-6">
                Try different keywords or browse our curated collections
              </p>
              <button
                onClick={clearSearch}
                className="bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] text-[#F6F1EB] font-semibold py-3 px-6 rounded-lg hover:from-[#A0522D] hover:to-[#8B4513] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-[#F4A261]/30"
              >
                Clear Search
              </button>
            </div>
          )}

        {/* Book Grid */}
        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((book, index) => (
              <div
                key={`${book.id}-${index}`}
                className="bg-gradient-to-br from-[#8B4513]/20 via-[#F6F1EB]/90 to-[#F6F1EB]/70 rounded-xl shadow-lg border border-[#F4A261]/30 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'%3E%3Crect width='400' height='600' fill='%23f3f4f6'/%3E%3Ctext x='200' y='300' font-family='Arial, sans-serif' font-size='24' fill='%239ca3af' text-anchor='middle' dy='0.3em'%3ENo Cover%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
                      ⭐ {book.rating}
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-serif font-semibold text-[#2C3E50] mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-[#5D4037] font-serif mb-2">
                    by {book.author}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-[#F4A261]/20 text-[#8B4513] font-serif">
                      {book.genre}
                    </span>
                    <span className="text-xs text-[#5D4037] font-serif">
                      {book.pageCount} pages
                    </span>
                  </div>

                  <p className="text-sm text-[#2C3E50] font-serif mb-4 line-clamp-3">
                    {book.description}
                  </p>

                  <button
                    onClick={() => handleBookSelect(book)}
                    disabled={!subscription || !canOrderThisMonth()}
                    className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors font-serif ${
                      subscription && canOrderThisMonth()
                        ? "bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] text-[#F6F1EB] hover:from-[#A0522D] hover:to-[#8B4513] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {!subscription
                      ? "Create Subscription First"
                      : !canOrderThisMonth()
                      ? orders.length >= 6
                        ? "Subscription Limit Reached"
                        : "Already Ordered This Month"
                      : "Choose This Book"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Modal */}
        {showOrderModal && selectedBook && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-[#8B4513]/20 via-[#F6F1EB]/90 to-[#F6F1EB]/70 rounded-xl shadow-2xl border border-[#F4A261]/30 max-w-md w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-serif font-semibold text-[#2C3E50]">
                    Confirm Your Choice
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-[#8B4513] hover:text-[#A0522D] text-xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex items-start space-x-4 mb-6">
                  <img
                    src={selectedBook.coverImage}
                    alt={selectedBook.title}
                    className="w-20 h-28 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-serif font-semibold text-[#2C3E50] mb-1">
                      {selectedBook.title}
                    </h3>
                    <p className="text-sm text-[#5D4037] font-serif mb-2">
                      by {selectedBook.author}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-[#8B4513] font-serif">
                      <span>⭐ {selectedBook.rating}</span>
                      <span>•</span>
                      <span>{selectedBook.pageCount} pages</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#5D4037] font-serif mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value)}
                    placeholder="Add a personal note for your reading journey..."
                    className="w-full px-3 py-2 border border-[#F4A261]/30 rounded-lg focus:ring-2 focus:ring-[#F4A261] focus:border-transparent resize-none h-24 bg-white/50 backdrop-blur-sm font-serif"
                  />
                  <p className="text-xs text-[#5D4037] font-serif mt-1">
                    📅 Remember: You can choose 1 book per month (maximum 6
                    books total for your 6-month subscription)
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-serif">{error}</p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 py-2 px-4 border border-[#F4A261]/30 rounded-lg text-[#2C3E50] font-serif hover:bg-white/50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleOrderSubmit}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] text-[#F6F1EB] font-semibold py-2 px-4 rounded-lg hover:from-[#A0522D] hover:to-[#8B4513] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="small" color="white" />
                        <span className="ml-2">Ordering...</span>
                      </div>
                    ) : (
                      "Confirm Choice"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SubscriptionPage;
