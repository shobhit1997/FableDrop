import { Order } from "../types";

// Google Sheets API configuration
const SHEETS_API_BASE = "https://sheets.googleapis.com/v4/spreadsheets";

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  sheetName: string;
  apiKey: string;
  accessToken?: string;
}

export class GoogleSheetsService {
  private static instance: GoogleSheetsService;
  private config: GoogleSheetsConfig;

  constructor(config: GoogleSheetsConfig) {
    this.config = config;
  }

  static getInstance(config?: GoogleSheetsConfig): GoogleSheetsService {
    if (!GoogleSheetsService.instance) {
      if (!config) {
        // Use environment variables for configuration
        config = {
          spreadsheetId:
            process.env.REACT_APP_GOOGLE_SHEET_ID || "your-sheet-id-here",
          sheetName: "Sheet1",
          apiKey:
            process.env.REACT_APP_GOOGLE_SHEETS_API_KEY || "your-api-key-here",
        };
      }
      GoogleSheetsService.instance = new GoogleSheetsService(config);
    }
    return GoogleSheetsService.instance;
  }

  // Update the access token for OAuth authentication
  setAccessToken(token: string | null): void {
    this.config.accessToken = token || undefined;
  }

  // Convert order to row data for Google Sheets
  private orderToRowData(order: Order, userEmail: string): (string | number)[] {
    return [
      userEmail, // Add user email as first column
      order.id,
      order.orderDate, // Store as ISO string instead of locale-specific format
      order.month,
      order.book.title,
      order.book.author,
      order.book.genre,
      order.book.isbn,
      order.book.pageCount,
      order.book.rating,
      order.book.coverImage,
      order.status,
      order.deliveryStatus,
      order.shippingAddress.name,
      order.shippingAddress.street,
      order.shippingAddress.city,
      order.shippingAddress.state,
      order.shippingAddress.zipCode,
      order.shippingAddress.country,
      order.personalMessage || "",
      order.book.description.substring(0, 200) + "...", // Truncate description
    ];
  }

  // Get headers for the spreadsheet
  private getHeaders(): string[] {
    return [
      "User Email",
      "Order ID",
      "Order Date",
      "Month Number",
      "Book Title",
      "Author",
      "Genre",
      "ISBN",
      "Page Count",
      "Rating",
      "Cover Image",
      "Status",
      "Delivery Status",
      "Recipient Name",
      "Street Address",
      "City",
      "State",
      "Zip Code",
      "Country",
      "Personal Message",
      "Book Description",
    ];
  }

  // Initialize the spreadsheet with headers (call this once)
  async initializeSheet(): Promise<boolean> {
    try {
      // First, check if the sheet exists and has headers
      const existingData = await this.getSheetData();

      if (existingData.length === 0) {
        // Sheet is empty, add headers
        const headers = this.getHeaders();
        return await this.appendToSheet([headers]);
      }

      return true;
    } catch (error) {
      console.error("Error initializing sheet:", error);
      return false;
    }
  }

  // Get existing data from the sheet
  async getSheetData(): Promise<any[][]> {
    try {
      const headers: HeadersInit = {};
      let url = `${SHEETS_API_BASE}/${this.config.spreadsheetId}/values/${this.config.sheetName}`;

      if (this.config.accessToken) {
        console.log("Using OAuth access token for sheet read");
        headers["Authorization"] = `Bearer ${this.config.accessToken}`;
      } else {
        console.log("Using API key for sheet read");
        url += `?key=${this.config.apiKey}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error("Error fetching sheet data:", error);
      return [];
    }
  }

  // Append data to the sheet
  async appendToSheet(values: any[][]): Promise<boolean> {
    try {
      // Check if we have real API credentials
      const hasRealCredentials =
        this.config.spreadsheetId !== "your-sheet-id-here" &&
        this.config.apiKey !== "your-api-key-here";

      if (hasRealCredentials) {
        // Use real Google Sheets API
        console.log("Using real Google Sheets API...");

        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        let url = `${SHEETS_API_BASE}/${this.config.spreadsheetId}/values/${this.config.sheetName}:append`;

        if (this.config.accessToken) {
          // Use OAuth token for authentication (required for write operations)
          console.log("Using OAuth access token for sheet write");
          headers["Authorization"] = `Bearer ${this.config.accessToken}`;
          url += `?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
        } else {
          // Fallback to API key (limited permissions)
          console.log("Using API key for sheet write (may fail)");
          url += `?key=${this.config.apiKey}&valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
        }

        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify({
            values: values,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Google Sheets API error:", response.status, errorText);

          if (response.status === 401) {
            console.error(
              "Authentication failed. Writing to Google Sheets requires OAuth authentication."
            );
            console.error(
              "API keys alone cannot write to sheets. Please set up OAuth or use demo mode."
            );
          }

          // Fallback to localStorage on API error
          console.log("Falling back to localStorage...");
          this.saveToLocalStorage(values);
          return false;
        }

        const result = await response.json();
        console.log("Successfully saved to Google Sheets:", result);
        return true;
      } else {
        // Demo mode - simulate the API call
        console.log("Demo mode: Simulating Google Sheets append operation...");
        console.log("Spreadsheet ID:", this.config.spreadsheetId);
        console.log("Sheet Name:", this.config.sheetName);
        console.log("Data to append:", values);

        this.saveToLocalStorage(values);

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return true;
      }
    } catch (error) {
      console.error("Error appending to sheet:", error);

      // Fallback to localStorage on any error
      this.saveToLocalStorage(values);
      return false;
    }
  }

  // Helper method to save to localStorage
  private saveToLocalStorage(values: any[][]): void {
    const existingData = JSON.parse(
      localStorage.getItem("bookbox_sheets_data") || "[]"
    );
    existingData.push(...values);
    localStorage.setItem("bookbox_sheets_data", JSON.stringify(existingData));
  }

  // Check if order already exists
  private async orderExists(
    orderId: string,
    userEmail: string
  ): Promise<boolean> {
    try {
      const orders = await this.getOrdersByEmail(userEmail);
      return orders.some((order) => order.id === orderId);
    } catch (error) {
      console.error("Error checking if order exists:", error);
      return false;
    }
  }

  // Save order to Google Sheets
  async saveOrder(order: Order, userEmail: string): Promise<boolean> {
    try {
      // Check if order already exists
      if (await this.orderExists(order.id, userEmail)) {
        console.log(
          `Order ${order.id} already exists for user ${userEmail}, skipping save`
        );
        return true;
      }

      // Ensure sheet is initialized
      await this.initializeSheet();

      // Convert order to row data
      const rowData = this.orderToRowData(order, userEmail);

      // Append to sheet
      const success = await this.appendToSheet([rowData]);

      if (success) {
        console.log("Order saved to Google Sheets successfully:", order.id);
      }

      return success;
    } catch (error) {
      console.error("Error saving order to Google Sheets:", error);
      return false;
    }
  }

  // Get orders by user email
  async getOrdersByEmail(userEmail: string): Promise<Order[]> {
    try {
      const data = await this.getSheetData();

      if (data.length <= 1) {
        return []; // No data or only headers
      }

      // Skip header row and filter orders by user email
      const orders: Order[] = [];
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row.length >= 13 && row[0] === userEmail) {
          // Ensure minimum required columns and match user email
          try {
            const order: Partial<Order> = {
              id: row[1],
              orderDate: row[2], // ISO string format
              month: parseInt(row[3]),
              status: row[11] as Order["status"],
              deliveryStatus: row[12] as Order["deliveryStatus"],
              personalMessage: row[19] || undefined,
              book: {
                id: row[1], // Use order ID as book ID for simplicity
                title: row[4],
                author: row[5],
                genre: row[6],
                isbn: row[7],
                pageCount: parseInt(row[8]) || 0,
                rating: parseFloat(row[9]) || 0,
                coverImage:
                  row[10] ||
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'%3E%3Crect width='400' height='600' fill='%23f3f4f6'/%3E%3Ctext x='200' y='300' font-family='Arial, sans-serif' font-size='24' fill='%239ca3af' text-anchor='middle' dy='0.3em'%3ENo Cover%3C/text%3E%3C/svg%3E",
                description: row[20] || "",
                publishedDate: "Unknown",
              },
              shippingAddress: {
                name: row[13] || "Gift Recipient",
                street: row[14] || "123 Main St",
                city: row[15] || "City",
                state: row[16] || "State",
                zipCode: row[17] || "12345",
                country: row[18] || "USA",
              },
              userId: userEmail,
              subscriptionId: `sub_${userEmail}`,
            };
            orders.push(order as Order);
          } catch (err) {
            console.error("Error parsing order row:", err);
          }
        }
      }

      return orders;
    } catch (error) {
      console.error("Error fetching orders from Google Sheets:", error);
      return [];
    }
  }

  // Get all orders from the sheet (legacy method)
  async getAllOrders(): Promise<Order[]> {
    try {
      const data = await this.getSheetData();

      if (data.length <= 1) {
        return []; // No data or only headers
      }

      // Skip header row and convert to orders
      const orders: Order[] = [];
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row.length >= 13) {
          // Ensure minimum required columns
          // This is a simplified conversion - in real app you'd want more robust parsing
          // For now, we'll just return empty array and rely on localStorage
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const order: Partial<Order> = {
            id: row[1],
            orderDate: new Date(row[2] + " " + row[3]).toISOString(),
            month: parseInt(row[4]),
            status: row[12] as Order["status"],
            personalMessage: row[19] || undefined,
          };
        }
      }

      return orders;
    } catch (error) {
      console.error("Error fetching orders from Google Sheets:", error);
      return [];
    }
  }

  // Save subscription to Sheet2
  async saveSubscription(
    subscription: any,
    userEmail: string
  ): Promise<boolean> {
    try {
      const subscriptionData = [
        userEmail,
        subscription.id,
        subscription.startDate,
        subscription.endDate,
        subscription.monthsRemaining,
        subscription.status,
        JSON.stringify(subscription.preferences),
        subscription.giftMessage || "",
        new Date().toISOString(), // created/updated timestamp
      ];

      // Use Sheet2 for subscriptions
      const originalSheetName = this.config.sheetName;
      this.config.sheetName = "Sheet2";

      // Initialize Sheet2 with subscription headers
      const headers = [
        "User Email",
        "Subscription ID",
        "Start Date",
        "End Date",
        "Months Remaining",
        "Status",
        "Preferences",
        "Gift Message",
        "Last Updated",
      ];

      const existingData = await this.getSheetData();
      if (existingData.length === 0) {
        await this.appendToSheet([headers]);
      }

      // Check if subscription already exists and update, otherwise append
      let updated = false;
      for (let i = 1; i < existingData.length; i++) {
        if (existingData[i][0] === userEmail) {
          // Subscription exists, update it
          const range = `Sheet2!A${i + 1}:I${i + 1}`;
          const updateResponse = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${this.config.spreadsheetId}/values/${range}?valueInputOption=RAW`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${this.config.accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                values: [subscriptionData],
              }),
            }
          );
          updated = updateResponse.ok;
          if (updated) {
            console.log(`Updated existing subscription for user ${userEmail}`);
          }
          break;
        }
      }

      if (!updated) {
        await this.appendToSheet([subscriptionData]);
        console.log(`Created new subscription for user ${userEmail}`);
      }

      // Restore original sheet name
      this.config.sheetName = originalSheetName;
      return true;
    } catch (error) {
      console.error("Error saving subscription:", error);
      return false;
    }
  }

  // Get subscription by user email from Sheet2
  async getSubscriptionByEmail(userEmail: string): Promise<any | null> {
    try {
      const originalSheetName = this.config.sheetName;
      this.config.sheetName = "Sheet2";

      const data = await this.getSheetData();

      // Restore original sheet name
      this.config.sheetName = originalSheetName;

      if (data.length <= 1) {
        return null;
      }

      // Find subscription by email
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row[0] === userEmail) {
          return {
            id: row[1],
            startDate: row[2],
            endDate: row[3],
            monthsRemaining: parseInt(row[4]) || 6, // Changed default from 12 to 6
            status: row[5],
            preferences: JSON.parse(row[6] || "{}"),
            giftMessage: row[7],
            userId: userEmail,
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error fetching subscription:", error);
      return null;
    }
  }

  // Update configuration
  updateConfig(config: Partial<GoogleSheetsConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Get current configuration (for settings page)
  getConfig(): GoogleSheetsConfig {
    return { ...this.config };
  }
}

// Example usage and setup instructions
export const setupGoogleSheets = () => {
  console.log(`
🔧 Google Sheets Setup Instructions:

1. Create a Google Sheet for your book orders
2. Get the Sheet ID from the URL (the long string between /d/ and /edit)
3. Create a Google Cloud Project and enable the Sheets API
4. Set up OAuth 2.0 Client ID for web application
5. Add these to your environment variables:
   - REACT_APP_GOOGLE_SHEET_ID=your_sheet_id_here
   - REACT_APP_GOOGLE_SHEETS_API_KEY=your_api_key_here
   - REACT_APP_GOOGLE_OAUTH_CLIENT_ID=your_oauth_client_id_here

Note: Writing to Google Sheets requires OAuth authentication, not just API keys.
For demo purposes, the app will simulate API calls and store data in localStorage.
  `);
};
