import { Book, BookGenre } from "../types";

export const mockGenres: BookGenre[] = [
  {
    id: "romance",
    name: "Romance",
    description: "Love stories and romantic fiction",
    color: "#f472b6",
  },
  {
    id: "mystery",
    name: "Mystery",
    description: "Suspenseful and intriguing stories",
    color: "#6366f1",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    description: "Magical worlds and adventures",
    color: "#8b5cf6",
  },
  {
    id: "literary",
    name: "Literary Fiction",
    description: "Thought-provoking and artistic works",
    color: "#10b981",
  },
  {
    id: "historical",
    name: "Historical Fiction",
    description: "Stories set in the past",
    color: "#f59e0b",
  },
  {
    id: "thriller",
    name: "Thriller",
    description: "Fast-paced and exciting stories",
    color: "#ef4444",
  },
  {
    id: "contemporary",
    name: "Contemporary Fiction",
    description: "Modern stories and characters",
    color: "#06b6d4",
  },
  {
    id: "classics",
    name: "Classics",
    description: "Timeless literary works",
    color: "#84cc16",
  },
];

export const mockBooks: Book[] = [
  {
    id: "book_1",
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    description:
      "A captivating novel about a reclusive Hollywood icon finally ready to tell her story.",
    genre: "fiction",
    isbn: "978-1501139239",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1551191168i/32620332.jpg",
    publishedDate: "2017-06-13",
    pageCount: 400,
    rating: 4.5,
  },
  {
    id: "book_2",
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    description:
      "A mystery novel about a young woman who grew up isolated in the marshes of North Carolina.",
    genre: "mystery",
    isbn: "978-0735219090",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1582135294i/36809135.jpg",
    publishedDate: "2018-08-14",
    pageCount: 384,
    rating: 4.3,
  },
  {
    id: "book_3",
    title: "The Midnight Library",
    author: "Matt Haig",
    description:
      "A philosophical novel about a library that exists between life and death.",
    genre: "philosophy",
    isbn: "978-0525559474",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg",
    publishedDate: "2020-08-13",
    pageCount: 288,
    rating: 4.2,
  },
  {
    id: "book_4",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    description:
      "A psychological thriller about a woman who refuses to speak after allegedly murdering her husband.",
    genre: "thriller",
    isbn: "978-1250301697",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1582114742i/40097951.jpg",
    publishedDate: "2019-02-05",
    pageCount: 336,
    rating: 4.1,
  },
  {
    id: "book_5",
    title: "Educated",
    author: "Tara Westover",
    description:
      "A memoir about a woman who grew up in a survivalist family and later pursued education.",
    genre: "biography",
    isbn: "978-0399590504",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1506026635i/35133922.jpg",
    publishedDate: "2018-02-20",
    pageCount: 334,
    rating: 4.4,
  },
  {
    id: "book_6",
    title: "The Song of Achilles",
    author: "Madeline Miller",
    description:
      "A retelling of the Trojan War from the perspective of Patroclus.",
    genre: "history",
    isbn: "978-0062060624",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1445420964i/11250317.jpg",
    publishedDate: "2011-09-20",
    pageCount: 416,
    rating: 4.6,
  },
  {
    id: "book_7",
    title: "The Invisible Life of Addie LaRue",
    author: "V.E. Schwab",
    description:
      "A fantasy novel about a woman cursed to be forgotten by everyone she meets.",
    genre: "fantasy",
    isbn: "978-0765387561",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1584633432i/50623864.jpg",
    publishedDate: "2020-10-06",
    pageCount: 448,
    rating: 4.3,
  },
  {
    id: "book_8",
    title: "The Alchemist",
    author: "Paulo Coelho",
    description:
      "A philosophical novel about a shepherd boy's journey to find treasure.",
    genre: "philosophy",
    isbn: "978-0061122415",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg",
    publishedDate: "1988-01-01",
    pageCount: 208,
    rating: 3.9,
  },
  {
    id: "book_9",
    title: "The Handmaid's Tale",
    author: "Margaret Atwood",
    description:
      "A dystopian novel about a society where women are subjugated and forced to bear children.",
    genre: "science_fiction",
    isbn: "978-0385490818",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1498841230i/38447.jpg",
    publishedDate: "1985-08-17",
    pageCount: 311,
    rating: 4.1,
  },
  {
    id: "book_10",
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    description:
      "A novel about friendship, redemption, and the history of Afghanistan.",
    genre: "fiction",
    isbn: "978-1594631931",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1579036878i/77203.jpg",
    publishedDate: "2003-05-29",
    pageCount: 371,
    rating: 4.3,
  },
  {
    id: "book_11",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description:
      "A classic American novel about the Jazz Age and the American Dream.",
    genre: "fiction",
    isbn: "978-0743273565",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg",
    publishedDate: "1925-04-10",
    pageCount: 180,
    rating: 3.9,
  },
  {
    id: "book_12",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A novel about racial injustice in the American South.",
    genre: "fiction",
    isbn: "978-0061120084",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg",
    publishedDate: "1960-07-11",
    pageCount: 281,
    rating: 4.2,
  },
];
