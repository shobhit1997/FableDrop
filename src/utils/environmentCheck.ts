// Environment configuration checker
export const checkEnvironment = () => {
  const config = {
    googleBooksApiKey: process.env.REACT_APP_GOOGLE_BOOKS_API_KEY,
    googleSheetId: process.env.REACT_APP_GOOGLE_SHEET_ID,
    googleSheetsApiKey: process.env.REACT_APP_GOOGLE_SHEETS_API_KEY,
    notificationEmail: process.env.REACT_APP_NOTIFICATION_EMAIL,
  };

  const isDemo =
    !config.googleBooksApiKey ||
    !config.googleSheetId ||
    !config.googleSheetsApiKey;

  const status = {
    isDemo,
    isDemoMode: isDemo,
    isProductionMode: !isDemo,
    config: {
      booksApiConfigured: !!config.googleBooksApiKey,
      sheetsApiConfigured:
        !!config.googleSheetId && !!config.googleSheetsApiKey,
      emailConfigured: !!config.notificationEmail,
    },
    messages: {
      mode: isDemo ? "🎭 Demo Mode" : "🚀 Production Mode",
      booksApi: config.googleBooksApiKey
        ? "✅ Google Books API configured"
        : "⚠️ Google Books API using demo mode",
      sheetsApi:
        config.googleSheetId && config.googleSheetsApiKey
          ? "✅ Google Sheets API configured"
          : "⚠️ Google Sheets API using localStorage",
      email: config.notificationEmail
        ? `✅ Email notifications: ${config.notificationEmail}`
        : "⚠️ Email notifications using default",
    },
  };

  return status;
};

// Log environment status to console
export const logEnvironmentStatus = () => {
  const status = checkEnvironment();

  console.log("\n" + "=".repeat(50));
  console.log("📚 FableDrop ENVIRONMENT STATUS");
  console.log("=".repeat(50));
  console.log(`Mode: ${status.messages.mode}`);
  console.log(`Books API: ${status.messages.booksApi}`);
  console.log(`Sheets API: ${status.messages.sheetsApi}`);
  console.log(`Email: ${status.messages.email}`);
  console.log("=".repeat(50) + "\n");

  if (status.isDemo) {
    console.log("🎭 Demo Mode Features:");
    console.log("  • Book data from Google Books API (with rate limits)");
    console.log("  • Order data saved to localStorage");
    console.log("  • Email notifications logged to console");
    console.log("  • Perfect for testing and development");
  } else {
    console.log("🚀 Production Mode Features:");
    console.log("  • Book data from Google Books API (with API key)");
    console.log("  • Order data saved to Google Sheets");
    console.log("  • Email notifications configured");
    console.log("  • Ready for real use!");
  }

  console.log("\n");
};

// Display environment status in UI
export const getEnvironmentStatusForUI = () => {
  const status = checkEnvironment();

  return {
    mode: status.isDemoMode ? "Demo Mode" : "Production Mode",
    color: status.isDemoMode ? "yellow" : "green",
    icon: status.isDemoMode ? "🎭" : "🚀",
    details: [
      status.messages.booksApi,
      status.messages.sheetsApi,
      status.messages.email,
    ],
  };
};
