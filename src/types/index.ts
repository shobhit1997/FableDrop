export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  googleId: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  isbn: string;
  coverImage: string;
  publishedDate: string;
  pageCount: number;
  rating: number;
}

export interface Subscription {
  id: string;
  userId: string;
  status: "active" | "inactive" | "cancelled";
  startDate: string;
  endDate: string;
  monthsRemaining: number;
  preferences: {
    genres: string[];
    authors: string[];
    themes: string[];
  };
  giftMessage?: string;
}

export interface Order {
  id: string;
  userId: string;
  subscriptionId: string;
  bookId: string;
  book: Book;
  orderDate: string;
  month: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  deliveryStatus:
    | "order_placed"
    | "preparing"
    | "in_transit"
    | "delivered"
    | "delayed";
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  personalMessage?: string;
}

export interface BookGenre {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface AppState {
  user: User | null;
  subscription: Subscription | null;
  orders: Order[];
  availableBooks: Book[];
  genres: BookGenre[];
  loading: boolean;
  error: string | null;
}
