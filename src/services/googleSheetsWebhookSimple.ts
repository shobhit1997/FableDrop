import { Order } from "../types";

// Proxy-based Google Sheets integration
// Uses a local proxy server to avoid CORS issues
// No client-side authentication required!

export interface WebhookConfig {
  webhookUrl: string;
  spreadsheetId: string;
  sheetName: string;
}

export class GoogleSheetsWebhookService {
  private static instance: GoogleSheetsWebhookService;
  private config: WebhookConfig;

  constructor(config: WebhookConfig) {
    this.config = config;
  }

  static getInstance(config?: WebhookConfig): GoogleSheetsWebhookService {
    if (!GoogleSheetsWebhookService.instance) {
      if (!config) {
        config = {
          webhookUrl: process.env.REACT_APP_SHEETS_PROXY_WEBHOOK_URL || "",
          spreadsheetId: process.env.REACT_APP_GOOGLE_SHEET_ID || "",
          sheetName: "Orders",
        };
      }
      GoogleSheetsWebhookService.instance = new GoogleSheetsWebhookService(
        config
      );
    }
    return GoogleSheetsWebhookService.instance;
  }

  // Convert order to webhook payload
  private orderToWebhookPayload(order: Order, userEmail: string) {
    return {
      action: "addOrder",
      userEmail,
      orderId: order.id,
      orderDate: order.orderDate,
      month: order.month,
      bookTitle: order.book.title,
      author: order.book.author,
      genre: order.book.genre,
      isbn: order.book.isbn,
      pageCount: order.book.pageCount,
      rating: order.book.rating,
      coverImage: order.book.coverImage,
      description: order.book.description.substring(0, 200) + "...",
      status: order.status,
      deliveryStatus: order.deliveryStatus,
      recipientName: order.shippingAddress.name,
      streetAddress: order.shippingAddress.street,
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      zipCode: order.shippingAddress.zipCode,
      country: order.shippingAddress.country,
      personalMessage: order.personalMessage || "",
      timestamp: new Date().toISOString(),
    };
  }

  // Save order via proxy
  async saveOrder(order: Order, userEmail: string): Promise<boolean> {
    try {
      if (!this.config.webhookUrl) {
        throw new Error("Webhook URL not configured");
      }

      const payload = this.orderToWebhookPayload(order, userEmail);

      const response = await fetch(this.config.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      return true;
    } catch (error) {
      console.error("Error saving order:", error);
      throw error;
    }
  }

  // Save subscription via proxy
  async saveSubscription(
    subscription: any,
    userEmail: string
  ): Promise<boolean> {
    try {
      if (!this.config.webhookUrl) {
        throw new Error("Webhook URL not configured");
      }

      const payload = {
        action: "addSubscription",
        userEmail,
        subscriptionId: subscription.id,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        monthsRemaining: subscription.monthsRemaining,
        status: subscription.status,
        preferences: JSON.stringify(subscription.preferences),
        giftMessage: subscription.giftMessage || "",
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(this.config.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      return true;
    } catch (error) {
      console.error("Error saving subscription:", error);
      throw error;
    }
  }

  // Get orders for a user
  async getOrdersByEmail(userEmail: string): Promise<Order[]> {
    try {
      if (!this.config.webhookUrl) {
        return [];
      }

      const payload = {
        action: "getOrders",
        userEmail: userEmail,
      };

      const response = await fetch(this.config.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const rawOrders = result.orders || [];

      // Transform flat order data into proper Order objects with nested Book
      return rawOrders.map((orderData: any) => ({
        id: orderData.orderId || orderData.id,
        userId: orderData.userEmail || userEmail,
        subscriptionId: `sub_${userEmail}`,
        bookId: orderData.orderId || orderData.id,
        book: {
          id: orderData.orderId || orderData.id,
          title: orderData.bookTitle || orderData.title || "Unknown Title",
          author: orderData.author || "Unknown Author",
          description: orderData.description || "",
          genre: orderData.genre || "General",
          isbn: orderData.isbn || "",
          coverImage:
            orderData.coverImage ||
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'%3E%3Crect width='400' height='600' fill='%23f3f4f6'/%3E%3Ctext x='200' y='300' font-family='Arial, sans-serif' font-size='24' fill='%239ca3af' text-anchor='middle' dy='0.3em'%3ENo Cover%3C/text%3E%3C/svg%3E",
          publishedDate: orderData.publishedDate || "Unknown",
          pageCount: parseInt(orderData.pageCount) || 0,
          rating: parseFloat(orderData.rating) || 0,
        },
        orderDate: orderData.orderDate || new Date().toISOString(),
        month: parseInt(orderData.month) || 1,
        status: orderData.status || "pending",
        deliveryStatus: orderData.deliveryStatus || "order_placed",
        shippingAddress: {
          name: orderData.recipientName || "Gift Recipient",
          street: orderData.streetAddress || "",
          city: orderData.city || "",
          state: orderData.state || "",
          zipCode: orderData.zipCode || "",
          country: orderData.country || "USA",
        },
        personalMessage: orderData.personalMessage || undefined,
      }));
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  }

  // Get subscription for a user
  async getSubscriptionByEmail(userEmail: string): Promise<any> {
    try {
      if (!this.config.webhookUrl) {
        return null;
      }

      const payload = {
        action: "getSubscription",
        userEmail: userEmail,
      };

      const response = await fetch(this.config.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.subscription || null;
    } catch (error) {
      console.error("Error fetching subscription:", error);
      return null;
    }
  }
}

export { GoogleSheetsWebhookService as default };
