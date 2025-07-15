import { Order } from "../types";

// Google Apps Script webhook service for writing to sheets without OAuth
export class GoogleSheetsWebhookService {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  // Save order via Apps Script webhook
  async saveOrder(order: Order): Promise<boolean> {
    try {
      const orderData = {
        orderId: order.id,
        orderDate: new Date(order.orderDate).toLocaleDateString(),
        orderTime: new Date(order.orderDate).toLocaleTimeString(),
        month: order.month,
        bookTitle: order.book.title,
        author: order.book.author,
        genre: order.book.genre,
        isbn: order.book.isbn,
        pageCount: order.book.pageCount,
        rating: order.book.rating,
        coverImage: order.book.coverImage,
        status: order.status,
        deliveryStatus: order.deliveryStatus,
        recipientName: order.shippingAddress.name,
        streetAddress: order.shippingAddress.street,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        zipCode: order.shippingAddress.zipCode,
        country: order.shippingAddress.country,
        personalMessage: order.personalMessage || "",
        bookDescription: order.book.description.substring(0, 200) + "...",
      };

      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        console.log("Order saved to Google Sheets via Apps Script webhook");
        return true;
      } else {
        console.error(
          "Failed to save to Google Sheets via webhook:",
          response.status
        );
        return false;
      }
    } catch (error) {
      console.error("Error saving order via webhook:", error);
      return false;
    }
  }
}

// Apps Script code to deploy as webhook (copy this to Google Apps Script)
export const APPS_SCRIPT_CODE = `
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Open your Google Sheet by ID
    const spreadsheetId = "18N_FP1rSFrJIJNMnh7o5p1YVf5O49stvrFc0-TlN9wo";
    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Orders");
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      const newSheet = SpreadsheetApp.openById(spreadsheetId).insertSheet("Orders");
      // Add headers
      newSheet.getRange(1, 1, 1, 21).setValues([[
        "Order ID", "Order Date", "Order Time", "Month Number", "Book Title", 
        "Author", "Genre", "ISBN", "Page Count", "Rating", "Cover Image", "Status",
        "Delivery Status", "Recipient Name", "Street Address", "City", "State", "Zip Code", 
        "Country", "Personal Message", "Book Description"
      ]]);
    }
    
    // Add the order data
    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Orders");
    sheet.appendRow([
      data.orderId,
      data.orderDate,
      data.orderTime,
      data.month,
      data.bookTitle,
      data.author,
      data.genre,
      data.isbn,
      data.pageCount,
      data.rating,
      data.coverImage,
      data.status,
      data.deliveryStatus,
      data.recipientName,
      data.streetAddress,
      data.city,
      data.state,
      data.zipCode,
      data.country,
      data.personalMessage,
      data.bookDescription
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;

// Instructions for setting up Apps Script webhook
export const WEBHOOK_SETUP_INSTRUCTIONS = `
🔧 Apps Script Webhook Setup (No Authentication Needed):

1. Go to https://script.google.com
2. Create a new project
3. Replace the code with the APPS_SCRIPT_CODE above
4. Update the spreadsheetId in the code
5. Deploy as web app:
   - Click "Deploy" → "New deployment"
   - Choose "Web app" as type
   - Set execute as "Me"
   - Set access to "Anyone"
   - Deploy and copy the webhook URL

6. Add the webhook URL to your .env file:
   REACT_APP_SHEETS_WEBHOOK_URL=your_webhook_url_here

This allows writing to sheets without user authentication!
`;
