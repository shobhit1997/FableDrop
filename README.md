# 📦 FableDrop - Stories Dropping at Your Doorstep

A beautiful, personalized story subscription web app that delivers amazing books to your doorstep. Features real book data from Google Books API and order tracking via Google Sheets.

## 🎁 Features

- **Google Books Integration**: Real book data with covers, descriptions, and ratings
- **Google Sheets Order Tracking**: Automatic order logging to spreadsheets
- **Beautiful UI**: Modern, responsive design with gradient themes
- **Story Discovery**: Search millions of books with curated recommendations
- **Order Management**: Track monthly book orders with delivery status
- **Email Notifications**: Automated order confirmations
- **Gift Personalization**: Custom messages and gift experience

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Google Account (for Books API and Sheets integration)

### Installation

1. **Clone and setup:**

   ```bash
   git clone <your-repo>
   cd BookSubscription
   npm install
   ```

2. **Start development server:**

   ```bash
   npm start
   ```

3. **Open in browser:**
   ```
   http://localhost:3000
   ```

## 🔧 Configuration

### Google Books API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the Books API
4. Create credentials (API Key)
5. Add to your environment (optional - app works with demo mode)

### Google Sheets Integration

1. **Create a Google Sheet:**

   - Create a new Google Sheet for order tracking
   - Note the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

2. **Setup API Access:**

   - In Google Cloud Console, enable Google Sheets API
   - Create API credentials (API Key or Service Account)

3. **Configuration:**
   - The app currently simulates Google Sheets integration for demo
   - For production, update the `GoogleSheetsService` with real credentials

### Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
REACT_APP_GOOGLE_BOOKS_API_KEY=your_books_api_key_here
REACT_APP_GOOGLE_SHEET_ID=your_sheet_id_here
REACT_APP_GOOGLE_SHEETS_API_KEY=your_sheets_api_key_here
```

## 📖 How It Works

### For the User

1. **Sign In**: Simple Google OAuth authentication
2. **Activate Subscription**: Quick one-click activation
3. **Search Stories**: Explore books from Google Books API
4. **Monthly Orders**: Select books with delivery tracking
5. **Track Progress**: See order history and delivery status

### For You (Admin)

1. **Order Notifications**: Receive email alerts for each order
2. **Google Sheets Tracking**: All orders logged automatically
3. **Fulfillment Data**: Complete book and shipping information
4. **Progress Monitoring**: Track delivery status and order history

## 📊 Google Sheets Integration

Each order creates a row with:

- Order ID and Date
- Month Number (1-12)
- Book Details (Title, Author, ISBN, Genre, Cover Image)
- Shipping Information
- Personal Messages
- Order Status and Delivery Status

### Sheet Structure

| Order ID  | Order Date | Month | Book Title | Author      | Genre   | Cover Image | Status  | Delivery Status | Personal Message |
| --------- | ---------- | ----- | ---------- | ----------- | ------- | ----------- | ------- | --------------- | ---------------- |
| order_123 | 1/15/2024  | 1     | Book Title | Author Name | Romance | https://... | pending | order_placed    | "Love this!"     |

## 🎨 Customization

### Branding

- Update colors in `tailwind.config.js`
- Modify logo and branding in components
- Customize email templates in `src/utils/emailService.ts`

### Book Selection

- Modify genre categories in `src/data/mockData.ts`
- Adjust book filtering in `src/services/googleBooksApi.ts`
- Customize curation algorithms

### Order Flow

- Update shipping address in `src/contexts/SubscriptionContext.tsx`
- Modify order status workflow
- Customize email recipient

## 🛠️ Technical Details

### Built With

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Google Books API** for book data
- **Google Sheets API** for order tracking
- **LocalStorage** for demo data persistence

### Key Components

- `AuthContext`: User authentication management
- `SubscriptionContext`: Order and book management
- `GoogleBooksService`: API integration for book data
- `GoogleSheetsService`: Spreadsheet integration
- `EmailService`: Order notifications

### File Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts for state management
├── data/              # Mock data and configurations
├── pages/             # Main application pages
├── services/          # API integrations
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect Vercel to your repository
3. Deploy automatically

### Netlify

1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify

### Custom Server

1. Build: `npm run build`
2. Serve the `build` folder with your preferred server

## 💡 Demo Mode

The app includes demo functionality:

- **Simulated Google OAuth**: No real Google account needed
- **Mock Book Data**: Fallback if Google Books API isn't configured
- **LocalStorage Persistence**: Data saved locally for testing
- **Console Logging**: All API calls logged for debugging

## 🤝 Contributing

This is a personal gift project, but feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is created as a personal gift. Feel free to use it as inspiration for your own projects!

## 💖 A Personal Note

FableDrop was created with love to make story discovery and delivery delightful and personal. The integration with Google Sheets ensures you can easily fulfill each order while tracking the journey through amazing literary adventures.

Happy reading! 📚✨

---

**Need Help?** Check the console for detailed logging of all operations, or review the component documentation in the source files.
