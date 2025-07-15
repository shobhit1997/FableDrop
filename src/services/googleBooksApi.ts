import { Book } from "../types";

const GOOGLE_BOOKS_API_BASE = "https://www.googleapis.com/books/v1";

export interface GoogleBookItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
    };
    averageRating?: number;
    ratingsCount?: number;
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
  };
  saleInfo?: {
    listPrice?: {
      amount: number;
      currencyCode: string;
    };
  };
}

export interface GoogleBooksResponse {
  items: GoogleBookItem[];
  totalItems: number;
}

// Convert Google Books API response to our Book type
const convertGoogleBookToBook = (googleBook: GoogleBookItem): Book => {
  const { volumeInfo } = googleBook;

  // Get the best available image
  const coverImage =
    volumeInfo.imageLinks?.large ||
    volumeInfo.imageLinks?.medium ||
    volumeInfo.imageLinks?.small ||
    volumeInfo.imageLinks?.thumbnail ||
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'%3E%3Crect width='400' height='600' fill='%23f3f4f6'/%3E%3Ctext x='200' y='300' font-family='Arial, sans-serif' font-size='24' fill='%239ca3af' text-anchor='middle' dy='0.3em'%3ENo Cover%3C/text%3E%3C/svg%3E";

  // Get ISBN
  const isbn =
    volumeInfo.industryIdentifiers?.find(
      (id) => id.type === "ISBN_13" || id.type === "ISBN_10"
    )?.identifier || "N/A";

  // Determine genre from categories
  const categories = volumeInfo.categories || [];
  const genre = mapCategoryToGenre(categories);

  return {
    id: googleBook.id,
    title: volumeInfo.title || "Unknown Title",
    author: volumeInfo.authors?.join(", ") || "Unknown Author",
    description: volumeInfo.description || "No description available.",
    genre,
    isbn,
    coverImage,
    publishedDate: volumeInfo.publishedDate || "Unknown",
    pageCount: volumeInfo.pageCount || 0,
    rating: volumeInfo.averageRating || 4.0,
  };
};

// Map Google Books categories to our genre system
const mapCategoryToGenre = (categories: string[]): string => {
  const categoryStr = categories.join(" ").toLowerCase();

  if (categoryStr.includes("romance")) return "romance";
  if (
    categoryStr.includes("mystery") ||
    categoryStr.includes("thriller") ||
    categoryStr.includes("crime")
  )
    return "mystery";
  if (
    categoryStr.includes("fantasy") ||
    categoryStr.includes("magic") ||
    categoryStr.includes("supernatural")
  )
    return "fantasy";
  if (
    categoryStr.includes("fiction") &&
    (categoryStr.includes("literary") || categoryStr.includes("contemporary"))
  )
    return "literary";
  if (categoryStr.includes("historical")) return "historical";
  if (categoryStr.includes("thriller") || categoryStr.includes("suspense"))
    return "thriller";
  if (categoryStr.includes("fiction")) return "contemporary";
  if (categoryStr.includes("classic")) return "classics";

  return "contemporary"; // Default genre
};

export class GoogleBooksService {
  private static instance: GoogleBooksService;
  private cache: Map<string, GoogleBooksResponse> = new Map();

  static getInstance(): GoogleBooksService {
    if (!GoogleBooksService.instance) {
      GoogleBooksService.instance = new GoogleBooksService();
    }
    return GoogleBooksService.instance;
  }

  async searchBooks(query: string, maxResults: number = 40): Promise<Book[]> {
    const cacheKey = `${query}_${maxResults}`;

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cachedResponse = this.cache.get(cacheKey)!;
      return cachedResponse.items.map(convertGoogleBookToBook);
    }

    try {
      // Use API key from environment if available
      const apiKey = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;
      const baseUrl = `${GOOGLE_BOOKS_API_BASE}/volumes?q=${encodeURIComponent(
        query
      )}&maxResults=${maxResults}&printType=books&langRestrict=en`;

      const url = apiKey ? `${baseUrl}&key=${apiKey}` : baseUrl;

      if (apiKey) {
        console.log("Using Google Books API with API key");
      } else {
        console.log(
          "Using Google Books API without API key (may have rate limits)"
        );
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GoogleBooksResponse = await response.json();

      // Cache the response
      this.cache.set(cacheKey, data);

      return data.items?.map(convertGoogleBookToBook) || [];
    } catch (error) {
      console.error("Error fetching books from Google Books API:", error);
      return [];
    }
  }

  async getBooksByGenre(
    genre: string,
    maxResults: number = 20
  ): Promise<Book[]> {
    const genreQueries = {
      romance: "subject:romance fiction",
      mystery: "subject:mystery fiction",
      fantasy: "subject:fantasy fiction",
      literary: "subject:literary fiction",
      historical: "subject:historical fiction",
      thriller: "subject:thriller fiction",
      contemporary: "subject:contemporary fiction",
      classics: "subject:classics literature",
    };

    const query =
      genreQueries[genre as keyof typeof genreQueries] || "subject:fiction";
    return this.searchBooks(query, maxResults);
  }

  async getPopularBooks(maxResults: number = 40): Promise<Book[]> {
    const popularQueries = [
      "bestseller fiction",
      "award winning fiction",
      "popular fiction 2023",
      "goodreads choice fiction",
    ];

    const allBooks: Book[] = [];

    for (const query of popularQueries) {
      const books = await this.searchBooks(
        query,
        Math.floor(maxResults / popularQueries.length)
      );
      allBooks.push(...books);
    }

    // Remove duplicates based on title and author
    const uniqueBooks = allBooks.filter(
      (book, index, self) =>
        index ===
        self.findIndex(
          (b) =>
            b.title.toLowerCase() === book.title.toLowerCase() &&
            b.author.toLowerCase() === book.author.toLowerCase()
        )
    );

    return uniqueBooks.slice(0, maxResults);
  }

  async getCuratedBooks(): Promise<Book[]> {
    // Get a mix of popular books from different genres
    const promises = [
      this.getBooksByGenre("romance", 8),
      this.getBooksByGenre("mystery", 8),
      this.getBooksByGenre("fantasy", 8),
      this.getBooksByGenre("literary", 8),
      this.getBooksByGenre("contemporary", 8),
    ];

    const results = await Promise.all(promises);
    const allBooks: Book[] = [];
    results.forEach((books) => allBooks.push(...books));

    // Remove duplicates based on book ID
    const uniqueBooks = allBooks.filter(
      (book, index, self) => index === self.findIndex((b) => b.id === book.id)
    );

    // Shuffle and return a curated selection
    return this.shuffleArray(uniqueBooks).slice(0, 40);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  clearCache(): void {
    this.cache.clear();
  }
}
