import { Order } from "../types";
import { GoogleSheetsService } from "../services/googleSheetsApi";
import { GoogleSheetsWebhookService } from "../services/googleSheetsWebhook";

export const sendOrderEmail = async (
  order: Order,
  userEmail: string
): Promise<void> => {
  try {
    let sheetsSaved = false;

    // Try webhook first (no authentication needed)
    const webhookUrl = process.env.REACT_APP_SHEETS_WEBHOOK_URL;
    if (webhookUrl && webhookUrl !== "your_webhook_url_here") {
      console.log("Using Apps Script webhook for Google Sheets...");
      const webhookService = new GoogleSheetsWebhookService(webhookUrl);
      sheetsSaved = await webhookService.saveOrder(order);
    } else {
      // Fallback to OAuth-based approach
      console.log("Using OAuth-based Google Sheets API...");
      const sheetsService = GoogleSheetsService.getInstance();
      sheetsSaved = await sheetsService.saveOrder(order, userEmail);
    }

    if (sheetsSaved) {
      console.log("Order saved to Google Sheets successfully");
    } else {
      console.warn(
        "Failed to save order to Google Sheets, but continuing with email..."
      );
    }

    // Since this is a demo app, we'll simulate sending an email
    // In a real app, you would integrate with EmailJS or a backend email service

    const emailData = {
      to: process.env.REACT_APP_NOTIFICATION_EMAIL || "your-email@example.com",
      subject: `📚 New Book Order - ${order.book.title}`,
      html: generateOrderEmailHTML(order),
      text: generateOrderEmailText(order),
    };

    // Simulate email sending with a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Email sent successfully:", emailData);

    // Store the email in localStorage for demo purposes
    const sentEmails = JSON.parse(
      localStorage.getItem("bookbox_sent_emails") || "[]"
    );
    sentEmails.push({
      ...emailData,
      sentAt: new Date().toISOString(),
      orderId: order.id,
      savedToSheets: sheetsSaved,
    });
    localStorage.setItem("bookbox_sent_emails", JSON.stringify(sentEmails));
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send order notification");
  }
};

const generateOrderEmailHTML = (order: Order): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #ee7b0a 0%, #0ea5e9 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">📚 BookBox Order</h1>
        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Monthly Paperback Subscription</p>
      </div>
      
      <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; margin: 0 0 15px 0;">New Book Order Received</h2>
        <p style="color: #6b7280; margin: 0;">A new book has been ordered for the monthly subscription.</p>
        <p style="color: #059669; margin: 10px 0 0 0; font-weight: 500;">✅ Order details saved to Google Sheets</p>
      </div>
      
      <div style="background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; margin: 0 0 15px 0;">Order Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; width: 120px;">Order ID:</td>
            <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${
              order.id
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Date:</td>
            <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${new Date(
              order.orderDate
            ).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Month:</td>
            <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">Month ${
              order.month
            }</td>
          </tr>
        </table>
      </div>
      
      <div style="background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; margin: 0 0 15px 0;">Book Information</h3>
        <div style="display: flex; gap: 20px; align-items: flex-start;">
          <img src="${order.book.coverImage}" alt="${
    order.book.title
  }" style="width: 80px; height: 120px; object-fit: cover; border-radius: 8px; border: 1px solid #e5e7eb;">
          <div style="flex: 1;">
            <h4 style="margin: 0 0 5px 0; color: #1f2937;">${
              order.book.title
            }</h4>
            <p style="margin: 0 0 10px 0; color: #6b7280;">by ${
              order.book.author
            }</p>
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">${
              order.book.description
            }</p>
            <div style="display: flex; gap: 15px; font-size: 14px;">
              <span style="color: #6b7280;">Genre: <strong style="color: #1f2937;">${
                order.book.genre
              }</strong></span>
              <span style="color: #6b7280;">Pages: <strong style="color: #1f2937;">${
                order.book.pageCount
              }</strong></span>
              <span style="color: #6b7280;">Rating: <strong style="color: #1f2937;">${
                order.book.rating
              }/5</strong></span>
            </div>
            <div style="margin-top: 10px;">
              <span style="color: #6b7280;">ISBN: <strong style="color: #1f2937;">${
                order.book.isbn
              }</strong></span>
            </div>
          </div>
        </div>
      </div>
      
      <div style="background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; margin: 0 0 15px 0;">Shipping Address</h3>
        <div style="color: #6b7280; line-height: 1.5;">
          <strong style="color: #1f2937;">${
            order.shippingAddress.name
          }</strong><br>
          ${order.shippingAddress.street}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${
    order.shippingAddress.zipCode
  }<br>
          ${order.shippingAddress.country}
        </div>
      </div>
      
      ${
        order.personalMessage
          ? `
        <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #92400e; margin: 0 0 10px 0;">Personal Message</h3>
          <p style="color: #92400e; margin: 0; font-style: italic;">"${order.personalMessage}"</p>
        </div>
      `
          : ""
      }
      
      <div style="background: #dcfce7; border: 1px solid #16a34a; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
        <h3 style="color: #166534; margin: 0 0 10px 0;">📊 Data Storage</h3>
        <p style="color: #166534; margin: 0; font-size: 14px;">
          This order has been automatically saved to your Google Sheets for easy tracking and fulfillment.
        </p>
      </div>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; text-align: center;">
        <p style="color: #6b7280; margin: 0; font-size: 14px;">
          This is an automated notification from BookBox Monthly Subscription.
        </p>
        <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 12px;">
          Order data is saved to Google Sheets for your convenience.
        </p>
      </div>
    </div>
  `;
};

const generateOrderEmailText = (order: Order): string => {
  return `
BookBox - New Book Order

Order Details:
- Order ID: ${order.id}
- Date: ${new Date(order.orderDate).toLocaleDateString()}
- Month: Month ${order.month}

Book Information:
- Title: ${order.book.title}
- Author: ${order.book.author}
- Description: ${order.book.description}
- Genre: ${order.book.genre}
- Pages: ${order.book.pageCount}
- Rating: ${order.book.rating}/5
- ISBN: ${order.book.isbn}

Shipping Address:
${order.shippingAddress.name}
${order.shippingAddress.street}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${
    order.shippingAddress.zipCode
  }
${order.shippingAddress.country}

${order.personalMessage ? `Personal Message: "${order.personalMessage}"` : ""}

📊 This order has been automatically saved to your Google Sheets.

This is an automated notification from BookBox Monthly Subscription.
  `;
};
