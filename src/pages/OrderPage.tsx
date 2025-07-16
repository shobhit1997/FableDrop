import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { Book } from "../types";

const OrderPage: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    subscription,
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

  const inspirationalMessages = [
    '"You choose your own adventure in every book you read." - Anonymous',
    '"The best books are chosen by the heart, not curated by others." - Literary Wisdom',
    '"Every reader has the power to discover their perfect story." - FableDrop',
    '"Your reading journey is uniquely yours to craft." - Book Lover\'s Creed',
    '"The magic happens when you choose the story that speaks to your soul." - Reading Philosophy',
    '"Books are waiting for you to discover them." - Literature\'s Truth',
    '"A great book finds its reader when the reader chooses to look." - Bookworm\'s Wisdom',
    '"You are the curator of your own literary adventure." - FableDrop Philosophy',
  ];

  const randomMessage =
    inspirationalMessages[
      Math.floor(Math.random() * inspirationalMessages.length)
    ];

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

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#3C2A1E] via-[#5D4037] to-[#2C3E50] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-serif font-bold text-[#F6F1EB] mb-2">
            No Active Subscription
          </h2>
          <p className="text-[#F6F1EB]/90 font-serif mb-6">
            You need to activate your subscription before you can choose books.
          </p>
          <Link
            to="/subscription"
            className="bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] text-[#F6F1EB] font-semibold py-3 px-6 rounded-lg hover:from-[#A0522D] hover:to-[#8B4513] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-[#F4A261]/30"
          >
            Activate Subscription
          </Link>
        </div>
      </div>
    );
  }

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
        {/* Main Content */}
        <div className="text-center mb-12">
          {/* Inspirational Message */}
          <div className="mb-8">
            <div className="text-6xl mb-6">📖</div>
            <h1 className="text-4xl font-serif font-bold text-[#F6F1EB] mb-6">
              Choose Your Next Great Read
            </h1>
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-[#F6F1EB]/90 font-serif italic leading-relaxed">
                {randomMessage}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#F6F1EB]/90 font-serif mb-2">
                    Book Title
                  </label>
                  <input
                    type="text"
                    value={titleQuery}
                    onChange={(e) => setTitleQuery(e.target.value)}
                    placeholder="Enter book title..."
                    className="w-full px-4 py-3 text-lg border-2 border-[#F4A261]/30 rounded-lg focus:ring-2 focus:ring-[#F4A261] focus:border-[#F4A261] transition-all duration-300 bg-[#F6F1EB]/90 backdrop-blur-sm font-serif text-[#2C3E50] placeholder-[#8B4513]/70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#F6F1EB]/90 font-serif mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={authorQuery}
                    onChange={(e) => setAuthorQuery(e.target.value)}
                    placeholder="Enter author name..."
                    className="w-full px-4 py-3 text-lg border-2 border-[#F4A261]/30 rounded-lg focus:ring-2 focus:ring-[#F4A261] focus:border-[#F4A261] transition-all duration-300 bg-[#F6F1EB]/90 backdrop-blur-sm font-serif text-[#2C3E50] placeholder-[#8B4513]/70"
                  />
                </div>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSearching}
                  className="bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] text-[#F6F1EB] px-8 py-3 rounded-lg hover:from-[#A0522D] hover:to-[#8B4513] disabled:opacity-50 font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isSearching ? "Searching..." : "Search Books"}
                </button>
                {(titleQuery || authorQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setTitleQuery("");
                      setAuthorQuery("");
                      setSearchResults([]);
                    }}
                    className="ml-4 text-[#F6F1EB]/90 hover:text-[#F4A261] transition-colors font-serif underline"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {(titleQuery || authorQuery) && (
          <div className="mt-12">
            <div className="text-center mb-8">
              <p className="text-[#F6F1EB]/90 font-serif text-lg">
                {isSearching ? (
                  <span className="flex items-center justify-center">
                    <LoadingSpinner size="small" />
                    <span className="ml-2">Searching for amazing books...</span>
                  </span>
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

            {/* No Results Message */}
            {(titleQuery || authorQuery) &&
              searchResults.length === 0 &&
              !isSearching && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-serif font-semibold text-[#F6F1EB] mb-4">
                    No books found
                  </h3>
                  <p className="text-[#F6F1EB]/90 font-serif mb-6">
                    Try different keywords or check your spelling
                  </p>
                  <button
                    onClick={() => {
                      setTitleQuery("");
                      setAuthorQuery("");
                      setSearchResults([]);
                    }}
                    className="bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] text-[#F6F1EB] font-semibold py-3 px-6 rounded-lg hover:from-[#A0522D] hover:to-[#8B4513] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-[#F4A261]/30"
                  >
                    Clear Search
                  </button>
                </div>
              )}

            {/* Book Grid */}
            {searchResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {searchResults.map((book, index) => (
                  <div
                    key={`${book.id}-${index}`}
                    className="bg-gradient-to-br from-[#8B4513]/20 via-[#F6F1EB]/90 to-[#F6F1EB]/70 rounded-xl shadow-lg border border-[#F4A261]/30 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative h-64">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'%3E%3Crect width='400' height='600' fill='%23f3f4f6'/%3E%3Ctext x='200' y='300' font-family='Arial, sans-serif' font-size='24' fill='%239ca3af' text-anchor='middle' dy='0.3em'%3ENo Cover%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                          ⭐ {book.rating}
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-serif font-bold text-lg text-[#2C3E50] mb-2 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-[#5D4037] font-serif mb-3">
                        by {book.author}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm px-3 py-1 rounded-full bg-[#F4A261]/20 text-[#8B4513] font-serif">
                          {book.genre}
                        </span>
                        <span className="text-sm text-[#5D4037] font-serif">
                          {book.pageCount} pages
                        </span>
                      </div>

                      <p className="text-sm text-[#2C3E50] font-serif mb-6 line-clamp-3">
                        {book.description}
                      </p>

                      <button
                        onClick={() => handleBookSelect(book)}
                        disabled={!canOrderThisMonth()}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                          canOrderThisMonth()
                            ? "bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] text-[#F6F1EB] hover:from-[#A0522D] hover:to-[#8B4513]"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {canOrderThisMonth()
                          ? "Choose This Book"
                          : orders.length >= 6
                          ? "Subscription Limit Reached"
                          : "Already Ordered This Month"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Order Modal */}
        {showOrderModal && selectedBook && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-[#8B4513]/20 via-[#F6F1EB]/90 to-[#F6F1EB]/70 rounded-xl shadow-2xl border border-[#F4A261]/30 max-w-md w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif font-bold text-[#2C3E50]">
                    Confirm Your Choice
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-[#8B4513] hover:text-[#A0522D] text-xl font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex items-start space-x-4 mb-6">
                  <img
                    src={selectedBook.coverImage}
                    alt={selectedBook.title}
                    className="w-24 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-serif font-bold text-[#2C3E50] mb-2">
                      {selectedBook.title}
                    </h3>
                    <p className="text-[#5D4037] font-serif mb-3">
                      by {selectedBook.author}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-[#8B4513] font-serif">
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
                    placeholder="Add a personal note about why you chose this book..."
                    className="w-full px-3 py-2 border border-[#F4A261]/30 rounded-lg focus:ring-2 focus:ring-[#F4A261] focus:border-transparent resize-none h-24 bg-white/50 backdrop-blur-sm font-serif text-[#2C3E50] placeholder-[#8B4513]/70"
                  />
                </div>

                <div className="bg-[#F4A261]/10 rounded-lg p-4 mb-6">
                  <p className="text-sm text-[#2C3E50] font-serif">
                    💡 <strong>Your Choice:</strong> This book will be delivered
                    to your doorstep as part of your subscription. You chose it
                    because it speaks to your reading preferences!
                  </p>
                  <p className="text-xs text-[#5D4037] font-serif mt-2">
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
                    className="flex-1 py-3 px-4 border border-[#F4A261]/30 rounded-lg text-[#2C3E50] font-serif hover:bg-white/50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleOrderSubmit}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] text-[#F6F1EB] font-semibold py-3 px-4 rounded-lg hover:from-[#A0522D] hover:to-[#8B4513] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="small" color="white" />
                        <span className="ml-2">Confirming...</span>
                      </div>
                    ) : (
                      "Confirm My Choice"
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

export default OrderPage;
