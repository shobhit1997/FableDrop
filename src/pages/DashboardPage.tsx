import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSubscription } from "../contexts/SubscriptionContext";

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    subscription,
    orders,
    canOrderThisMonth,
    getOrdersForCurrentMonth,
    getNextOrderDate,
  } = useSubscription();
  const navigate = useNavigate();

  const currentMonthOrders = getOrdersForCurrentMonth();
  const nextOrderDate = getNextOrderDate();

  const handleOrderNow = () => {
    if (canOrderThisMonth()) {
      navigate("/order");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3C2A1E] via-[#5D4037] to-[#2C3E50]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#8B4513]/20 via-[#F6F1EB]/90 to-[#F6F1EB]/70 backdrop-blur-sm border-b border-[#F4A261]/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-[#8B4513] via-[#F4A261] to-[#2C3E50] rounded-full flex items-center justify-center text-white text-lg font-bold mr-3">
                📚
              </div>
              <h1 className="text-xl font-serif font-bold text-[#2C3E50]">
                FableDrop
              </h1>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-[#8B4513]/20 via-[#F6F1EB]/90 to-[#F6F1EB]/70 rounded-xl shadow-lg border border-[#F4A261]/30 p-6 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#2C3E50] mb-2">
                  Welcome back, {user?.name?.split(" ")[0]}! 👋
                </h2>
                <p className="text-[#5D4037] font-serif">
                  📦 Stories dropping at your doorstep
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl mb-2">📚</div>
                <div className="text-sm text-[#8B4513] font-serif">
                  Book Subscription
                </div>
              </div>
            </div>

            {subscription?.giftMessage && (
              <div className="p-4 bg-gradient-to-r from-[#F4A261]/20 to-[#8B4513]/20 rounded-lg border border-[#F4A261]/30">
                <p className="text-sm text-[#2C3E50] italic font-serif">
                  💝 "{subscription.giftMessage}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Subscription Status */}
        {!subscription ? (
          <div className="mb-8">
            <div className="bg-gradient-to-br from-[#8B4513]/20 via-[#F6F1EB]/90 to-[#F6F1EB]/70 rounded-xl shadow-lg border border-[#F4A261]/30 p-6 transition-all duration-300 hover:shadow-xl text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-serif font-semibold text-[#2C3E50] mb-2">
                Ready to Start Your Book Journey?
              </h3>
              <p className="text-[#5D4037] font-serif mb-6">
                Choose from our vast literary collection and create your
                personal reading adventure!
              </p>
              <Link
                to="/subscription"
                className="inline-block bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] text-[#F6F1EB] font-semibold py-3 px-6 rounded-lg hover:from-[#A0522D] hover:to-[#8B4513] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-[#F4A261]/30"
              >
                Set Up Subscription
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Subscription Info */}
            <div className="bg-gradient-to-br from-[#8B4513]/20 via-[#F6F1EB]/90 to-[#F6F1EB]/70 rounded-xl shadow-lg border border-[#F4A261]/30 p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-serif font-semibold text-[#2C3E50]">
                  Subscription
                </h3>
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

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#5D4037] font-serif">Started:</span>
                  <span className="font-medium text-[#2C3E50]">
                    {new Date(subscription.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5D4037] font-serif">
                    Months left:
                  </span>
                  <span className="font-medium text-[#F4A261]">
                    {subscription.monthsRemaining}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5D4037] font-serif">
                    Total books:
                  </span>
                  <span className="font-medium text-[#2C3E50]">
                    {orders.length} / 12
                  </span>
                </div>
              </div>
            </div>

            {/* This Month's Order */}
            <div className="bg-gradient-to-br from-[#8B4513]/20 via-[#F6F1EB]/90 to-[#F6F1EB]/70 rounded-xl shadow-lg border border-[#F4A261]/30 p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-serif font-semibold text-[#2C3E50]">
                  This Month
                </h3>
                <span className="text-2xl">📅</span>
              </div>

              {currentMonthOrders.length > 0 ? (
                <div className="space-y-3">
                  {currentMonthOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-[#F4A261]/30 rounded-lg p-3 bg-white/50"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={order.book.coverImage}
                          alt={order.book.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-[#2C3E50] font-serif">
                            {order.book.title}
                          </h4>
                          <p className="text-xs text-[#5D4037] font-serif">
                            by {order.book.author}
                          </p>
                          <div className="space-y-1">
                            <span
                              className={`text-xs px-2 py-1 rounded ml-1 ${
                                order.deliveryStatus === "order_placed"
                                  ? "bg-gray-100 text-gray-800"
                                  : order.deliveryStatus === "preparing"
                                  ? "bg-orange-100 text-orange-800"
                                  : order.deliveryStatus === "in_transit"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.deliveryStatus === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {order.deliveryStatus?.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  {canOrderThisMonth() ? (
                    <div>
                      <div className="text-4xl mb-2">📖</div>
                      <p className="text-sm text-[#5D4037] font-serif mb-4">
                        Ready to choose this month's book?
                      </p>
                      <button
                        onClick={handleOrderNow}
                        className="bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] text-[#F6F1EB] font-semibold py-2 px-4 rounded-lg hover:from-[#A0522D] hover:to-[#8B4513] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Choose Book
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl mb-2">⏰</div>
                      <p className="text-sm text-[#5D4037] font-serif">
                        Next order available:{" "}
                        {nextOrderDate?.toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-[#8B4513]/20 via-[#F6F1EB]/90 to-[#F6F1EB]/70 rounded-xl shadow-lg border border-[#F4A261]/30 p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-serif font-semibold text-[#2C3E50]">
                  Quick Actions
                </h3>
                <span className="text-2xl">⚡</span>
              </div>

              <div className="space-y-3">
                <Link
                  to="/order"
                  className={`block w-full text-center py-2 px-4 rounded-lg transition-colors font-serif ${
                    canOrderThisMonth()
                      ? "bg-[#F4A261]/20 text-[#8B4513] hover:bg-[#F4A261]/30"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {canOrderThisMonth()
                    ? "📖 Choose Book"
                    : "📅 Order Unavailable"}
                </Link>

                <Link
                  to="/subscription"
                  className="block w-full text-center py-2 px-4 rounded-lg bg-[#F4A261]/20 text-[#8B4513] hover:bg-[#F4A261]/30 transition-colors font-serif"
                >
                  🔍 Search Books
                </Link>

                <div className="pt-2 border-t border-[#F4A261]/30">
                  <p className="text-xs text-[#5D4037] font-serif italic">
                    💡 Tip: You choose your own books from our vast collection!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Orders */}
        {orders.length > 0 && (
          <div className="bg-gradient-to-br from-[#8B4513]/20 via-[#F6F1EB]/90 to-[#F6F1EB]/70 rounded-xl shadow-lg border border-[#F4A261]/30 p-6 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-semibold text-[#2C3E50]">
                Your Reading Journey
              </h3>
              <span className="text-2xl">📚</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.slice(0, 6).map((order) => (
                <div
                  key={order.id}
                  className="bg-white/50 rounded-lg p-4 border border-[#F4A261]/30"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={order.book.coverImage}
                      alt={order.book.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-[#2C3E50] font-serif mb-1">
                        {order.book.title}
                      </h4>
                      <p className="text-xs text-[#5D4037] font-serif mb-2">
                        by {order.book.author}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ml-1 ${
                            order.deliveryStatus === "order_placed"
                              ? "bg-gray-100 text-gray-800"
                              : order.deliveryStatus === "preparing"
                              ? "bg-orange-100 text-orange-800"
                              : order.deliveryStatus === "in_transit"
                              ? "bg-blue-100 text-blue-800"
                              : order.deliveryStatus === "delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.deliveryStatus?.replace("_", " ")}
                        </span>
                        <span className="text-xs text-[#8B4513] font-serif">
                          Month {order.month}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {orders.length > 6 && (
              <div className="text-center mt-6">
                <p className="text-sm text-[#5D4037] font-serif">
                  And {orders.length - 6} more books in your collection...
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
