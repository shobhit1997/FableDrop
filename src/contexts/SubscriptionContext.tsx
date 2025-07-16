import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Subscription, Order, Book, BookGenre } from "../types";
import { mockGenres } from "../data/mockData";
import { GoogleBooksService } from "../services/googleBooksApi";
import { useAuth } from "./AuthContext";
import GoogleSheetsWebhookService from "../services/googleSheetsWebhookSimple";

interface SubscriptionContextType {
  subscription: Subscription | null;
  orders: Order[];
  availableBooks: Book[];
  genres: BookGenre[];
  loading: boolean;
  booksLoading: boolean;
  error: string | null;
  createSubscription: (
    preferences: Subscription["preferences"],
    giftMessage?: string
  ) => Promise<void>;
  orderBook: (book: Book, personalMessage?: string) => Promise<void>;
  getOrdersForCurrentMonth: () => Order[];
  canOrderThisMonth: () => boolean;
  getNextOrderDate: () => Date | null;
  refreshBooks: () => Promise<void>;
  getBooksByGenre: (genre: string) => Book[];
  clearError: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
  const [genres] = useState<BookGenre[]>(mockGenres);
  const [loading, setLoading] = useState(false);
  const [booksLoading, setBooksLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const googleBooksService = GoogleBooksService.getInstance();
  const googleSheetsService = GoogleSheetsWebhookService.getInstance();

  const loadOrdersByEmail = useCallback(
    async (userEmail: string) => {
      try {
        const ordersFromSheets = await googleSheetsService.getOrdersByEmail(
          userEmail
        );

        if (ordersFromSheets && ordersFromSheets.length > 0) {
          setOrders(ordersFromSheets);
          localStorage.setItem(
            "fabledrop_orders",
            JSON.stringify(ordersFromSheets)
          );
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Failed to load orders from Google Sheets:", error);
        // Fallback to localStorage
        const storedOrders = localStorage.getItem("fabledrop_orders");
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        }
      }
    },
    [googleSheetsService]
  );

  const loadSubscriptionByEmail = useCallback(
    async (userEmail: string) => {
      try {
        const subscriptionFromSheets =
          await googleSheetsService.getSubscriptionByEmail(userEmail);

        if (subscriptionFromSheets) {
          setSubscription(subscriptionFromSheets);
          localStorage.setItem(
            "fabledrop_subscription",
            JSON.stringify(subscriptionFromSheets)
          );
        } else {
          setSubscription(null);
        }
      } catch (error) {
        console.error("Failed to load subscription from Google Sheets:", error);
        // Fallback to localStorage
        const storedSubscription = localStorage.getItem(
          "fabledrop_subscription"
        );
        if (storedSubscription) {
          setSubscription(JSON.parse(storedSubscription));
        }
      }
    },
    [googleSheetsService]
  );

  // Load user-specific data when user changes
  useEffect(() => {
    if (user?.email) {
      loadOrdersByEmail(user.email);
      loadSubscriptionByEmail(user.email);
    }
  }, [user?.email, loadOrdersByEmail, loadSubscriptionByEmail]);

  const loadBooks = useCallback(async () => {
    try {
      setBooksLoading(true);
      setError(null);

      // Check if we have cached books
      const cachedBooks = localStorage.getItem("fabledrop_cached_books");
      const cacheTimestamp = localStorage.getItem("fabledrop_cache_timestamp");

      // Use cached books if they're less than 24 hours old
      if (cachedBooks && cacheTimestamp) {
        const cacheAge = Date.now() - parseInt(cacheTimestamp);
        const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        if (cacheAge < oneDay) {
          setAvailableBooks(JSON.parse(cachedBooks));
          setBooksLoading(false);
          return;
        }
      }

      // Fetch fresh books from Google Books API
      const books = await googleBooksService.getCuratedBooks();

      if (books.length > 0) {
        setAvailableBooks(books);

        // Cache the books
        localStorage.setItem("fabledrop_cached_books", JSON.stringify(books));
        localStorage.setItem(
          "fabledrop_cache_timestamp",
          Date.now().toString()
        );
      } else {
        setError("No books found. Please try again later.");
      }
    } catch (err) {
      console.error("Error loading books:", err);
      setError("Failed to load books. Please try again later.");
    } finally {
      setBooksLoading(false);
    }
  }, [googleBooksService]);

  useEffect(() => {
    // Load subscription and orders from localStorage
    const savedSubscription = localStorage.getItem("fabledrop_subscription");
    const savedOrders = localStorage.getItem("fabledrop_orders");

    if (savedSubscription) {
      try {
        setSubscription(JSON.parse(savedSubscription));
      } catch (err) {
        console.error("Error parsing saved subscription:", err);
        localStorage.removeItem("fabledrop_subscription");
      }
    }

    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (err) {
        console.error("Error parsing saved orders:", err);
        localStorage.removeItem("fabledrop_orders");
      }
    }

    // Load books from Google Books API
    loadBooks();
  }, [loadBooks]);

  const refreshBooks = async () => {
    // Clear cache and reload books
    localStorage.removeItem("fabledrop_cached_books");
    localStorage.removeItem("fabledrop_cache_timestamp");
    googleBooksService.clearCache();
    await loadBooks();
  };

  const getBooksByGenre = (genre: string): Book[] => {
    if (genre === "all") return availableBooks;
    return availableBooks.filter((book) => book.genre === genre);
  };

  const createSubscription = async (
    preferences: Subscription["preferences"],
    giftMessage?: string
  ) => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 6); // Changed from 12 to 6 months

      const newSubscription: Subscription = {
        id: `sub_${Date.now()}`,
        userId: user?.email || "user_1",
        status: "active",
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        monthsRemaining: 6, // Changed from 12 to 6 months
        preferences,
        giftMessage,
      };

      setSubscription(newSubscription);
      localStorage.setItem(
        "fabledrop_subscription",
        JSON.stringify(newSubscription)
      );

      // Save to Google Sheets
      if (user?.email) {
        try {
          await googleSheetsService.saveSubscription(
            newSubscription,
            user.email
          );
        } catch (sheetsError) {
          console.error(
            "Failed to save subscription to Google Sheets:",
            sheetsError
          );
        }
      }
    } catch (err) {
      console.error("Error creating subscription:", err);
      setError("Failed to create subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const orderBook = async (book: Book, personalMessage?: string) => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (!subscription) {
        throw new Error("No active subscription found");
      }

      // Check if user has reached the 6-book limit
      if (orders.length >= 6) {
        throw new Error(
          "You have reached the maximum of 6 books for your subscription period."
        );
      }

      // Check if user can order this month (1 book per month limit)
      if (!canOrderThisMonth()) {
        throw new Error(
          "You can only order 1 book per month. Please wait until next month to order another book."
        );
      }

      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const orderMonth =
        (currentYear - new Date(subscription.startDate).getFullYear()) * 12 +
        (currentMonth - (new Date(subscription.startDate).getMonth() + 1)) +
        1;

      const newOrder: Order = {
        id: `order_${Date.now()}`,
        userId: subscription.userId,
        subscriptionId: subscription.id,
        bookId: book.id,
        book: book,
        orderDate: new Date().toISOString(),
        month: orderMonth,
        status: "pending",
        deliveryStatus: "order_placed",
        shippingAddress: {
          name: "Gift Recipient",
          street: "123 Main St",
          city: "City",
          state: "State",
          zipCode: "12345",
          country: "USA",
        },
        personalMessage,
      };

      const updatedOrders = [...orders, newOrder];
      setOrders(updatedOrders);
      localStorage.setItem("fabledrop_orders", JSON.stringify(updatedOrders));

      // Update subscription months remaining
      const updatedSubscription = {
        ...subscription,
        monthsRemaining: subscription.monthsRemaining - 1,
      };
      setSubscription(updatedSubscription);
      localStorage.setItem(
        "fabledrop_subscription",
        JSON.stringify(updatedSubscription)
      );

      // Save order to Google Sheets
      if (user?.email) {
        try {
          await googleSheetsService.saveOrder(newOrder, user.email);
          await googleSheetsService.saveSubscription(
            updatedSubscription,
            user.email
          );
        } catch (sheetsError) {
          console.error("Failed to save to Google Sheets:", sheetsError);
          // Don't throw error here - order was successful locally
        }
      }
    } catch (err) {
      console.error("Error ordering book:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to order book. Please try again."
      );
      throw err; // Re-throw to handle in UI
    } finally {
      setLoading(false);
    }
  };

  const getOrdersForCurrentMonth = () => {
    if (!subscription) return [];

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const orderMonth =
      (currentYear - new Date(subscription.startDate).getFullYear()) * 12 +
      (currentMonth - (new Date(subscription.startDate).getMonth() + 1)) +
      1;

    return orders.filter((order) => order.month === orderMonth);
  };

  const canOrderThisMonth = () => {
    if (!subscription || subscription.status !== "active") return false;
    if (subscription.monthsRemaining <= 0) return false;

    // Check if user has reached the 6-book limit
    if (orders.length >= 6) return false;

    // Check if user has already ordered a book this month (1 book per month limit)
    const currentMonthOrders = getOrdersForCurrentMonth();
    return currentMonthOrders.length === 0;
  };

  const getNextOrderDate = () => {
    if (!subscription || subscription.status !== "active") return null;

    const currentDate = new Date();

    // If we can order this month, return today
    if (canOrderThisMonth()) {
      return currentDate;
    }

    // Otherwise, return the first day of next month
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);

    return nextMonth;
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    subscription,
    orders,
    availableBooks,
    genres,
    loading,
    booksLoading,
    error,
    createSubscription,
    orderBook,
    getOrdersForCurrentMonth,
    canOrderThisMonth,
    getNextOrderDate,
    refreshBooks,
    getBooksByGenre,
    clearError,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
