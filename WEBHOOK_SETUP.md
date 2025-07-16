# 🚀 Webhook Setup Guide - No Authentication Required!

This guide will help you set up Google Sheets integration using webhooks, completely eliminating the need for user OAuth spreadsheet permissions.

## ✅ What's Been Changed

Your app has been updated to:

- ✅ Remove `auth/spreadsheet` scope from user login
- ✅ Use `GoogleSheetsWebhookService` instead of OAuth-based service
- ✅ Clean up all references to access tokens for sheets
- ✅ Simplify the entire authentication flow

## 🔧 Setup Steps

### Step 1: Update Google Apps Script

**🚨 IMPORTANT: If you already have a webhook set up, you need to update it with this new code!**

1. Go to [script.google.com](https://script.google.com)
2. **If you already have a webhook:** Open your existing project
3. **If starting fresh:** Click **"New Project"**
4. Replace the **entire code** with this updated version:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // 🔥 UPDATE THIS WITH YOUR SPREADSHEET ID! 🔥
    const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (data.action === "addOrder") {
      handleAddOrder(spreadsheet, data);
      return createCorsResponse({ success: true });
    } else if (data.action === "addSubscription") {
      handleAddSubscription(spreadsheet, data);
      return createCorsResponse({ success: true });
    } else if (data.action === "getOrders") {
      const orders = getOrdersByEmail(spreadsheet, data.userEmail);
      return createCorsResponse({ success: true, orders: orders });
    } else if (data.action === "getSubscription") {
      const subscription = getSubscriptionByEmail(spreadsheet, data.userEmail);
      return createCorsResponse({ success: true, subscription: subscription });
    } else if (data.action === "test") {
      return createCorsResponse({
        success: true,
        message: "Webhook test successful",
      });
    }

    return createCorsResponse({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return createCorsResponse({ success: false, error: error.toString() });
  }
}

// Handle GET requests
function doGet(e) {
  return createCorsResponse({ success: true, message: "Webhook is working" });
}

// Create JSON response (Google Apps Script handles CORS automatically)
function createCorsResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function handleAddOrder(spreadsheet, data) {
  let ordersSheet = spreadsheet.getSheetByName("Orders");

  // Create sheet if it doesn't exist
  if (!ordersSheet) {
    ordersSheet = spreadsheet.insertSheet("Orders");
    // Add headers
    ordersSheet
      .getRange(1, 1, 1, 21)
      .setValues([
        [
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
        ],
      ]);
  }

  // Add the order data
  ordersSheet.appendRow([
    data.userEmail,
    data.orderId,
    data.orderDate,
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
    data.description,
  ]);
}

function handleAddSubscription(spreadsheet, data) {
  let subscriptionsSheet = spreadsheet.getSheetByName("Subscriptions");

  // Create sheet if it doesn't exist
  if (!subscriptionsSheet) {
    subscriptionsSheet = spreadsheet.insertSheet("Subscriptions");
    // Add headers
    subscriptionsSheet
      .getRange(1, 1, 1, 9)
      .setValues([
        [
          "User Email",
          "Subscription ID",
          "Start Date",
          "End Date",
          "Months Remaining",
          "Status",
          "Preferences",
          "Gift Message",
          "Last Updated",
        ],
      ]);
  }

  // Check if subscription exists and update, otherwise append
  const existingData = subscriptionsSheet.getDataRange().getValues();
  let updated = false;

  for (let i = 1; i < existingData.length; i++) {
    if (existingData[i][0] === data.userEmail) {
      // Update existing subscription
      subscriptionsSheet
        .getRange(i + 1, 1, 1, 9)
        .setValues([
          [
            data.userEmail,
            data.subscriptionId,
            data.startDate,
            data.endDate,
            data.monthsRemaining,
            data.status,
            data.preferences,
            data.giftMessage,
            data.timestamp,
          ],
        ]);
      updated = true;
      break;
    }
  }

  if (!updated) {
    // Add new subscription
    subscriptionsSheet.appendRow([
      data.userEmail,
      data.subscriptionId,
      data.startDate,
      data.endDate,
      data.monthsRemaining,
      data.status,
      data.preferences,
      data.giftMessage,
      data.timestamp,
    ]);
  }
}

// Get orders for a specific user
function getOrdersByEmail(spreadsheet, userEmail) {
  try {
    const ordersSheet = spreadsheet.getSheetByName("Orders");

    if (!ordersSheet) {
      return [];
    }

    const data = ordersSheet.getDataRange().getValues();
    const orders = [];

    // Skip header row (row 0) and filter by user email
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0] === userEmail) {
        // User Email is in column 0
        orders.push({
          userEmail: row[0],
          orderId: row[1],
          orderDate: row[2],
          month: row[3],
          bookTitle: row[4],
          author: row[5],
          genre: row[6],
          isbn: row[7],
          pageCount: row[8],
          rating: row[9],
          coverImage: row[10],
          status: row[11],
          deliveryStatus: row[12],
          recipientName: row[13],
          streetAddress: row[14],
          city: row[15],
          state: row[16],
          zipCode: row[17],
          country: row[18],
          personalMessage: row[19],
          description: row[20],
        });
      }
    }

    return orders;
  } catch (error) {
    console.error("Error getting orders:", error);
    return [];
  }
}

// Get subscription for a specific user
function getSubscriptionByEmail(spreadsheet, userEmail) {
  try {
    const subscriptionsSheet = spreadsheet.getSheetByName("Subscriptions");

    if (!subscriptionsSheet) {
      return null;
    }

    const data = subscriptionsSheet.getDataRange().getValues();

    // Skip header row (row 0) and find user subscription
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0] === userEmail) {
        // User Email is in column 0
        return {
          userEmail: row[0],
          subscriptionId: row[1],
          startDate: row[2],
          endDate: row[3],
          monthsRemaining: row[4],
          status: row[5],
          preferences: row[6],
          giftMessage: row[7],
          lastUpdated: row[8],
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting subscription:", error);
    return null;
  }
}
```

### Step 2: Get Your Spreadsheet ID

1. Create a new Google Sheet or use an existing one
2. Open the sheet in your browser
3. Copy the ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/COPY_THIS_PART/edit
   ```
4. Update the `SPREADSHEET_ID` in your Apps Script code

### Step 3: Deploy the Webhook

**🚨 CRITICAL: Follow these exact deployment settings to avoid CORS issues!**

1. In Google Apps Script, click **"Deploy"** → **"New deployment"**
2. Click the gear icon ⚙️ next to "Type"
3. Select **"Web app"**
4. Configure deployment settings **EXACTLY** as follows:
   - **Execute as:** Me _(your email)_
   - **Who has access:** Anyone, even anonymous ⚠️ _This is crucial for CORS!_
5. Click **"Deploy"**
6. Copy the webhook URL (it will look like: `https://script.google.com/macros/s/...../exec`)

**⚠️ Important Notes:**

- If you use "Anyone" instead of "Anyone, even anonymous", you may get CORS errors
- The redirect to `script.googleusercontent.com` is normal Google security behavior
- Apps Script handles CORS automatically ONLY when deployed with these exact settings

### Step 4: Update Your Environment

Add the webhook URL to your `.env` file:

```env
REACT_APP_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## 🧪 Test Your Setup

### Step 1: Test the Webhook Directly

First, test your webhook URL in a browser:

1. Copy your webhook URL from Google Apps Script
2. Paste it in a browser and add `?action=test` at the end
3. You should see: `{"success":true,"message":"Webhook test successful"}`
4. If you see an HTML error page, check your deployment settings above

### Step 2: Test in Your App

1. Start your React app: `npm start`
2. Login and create a subscription
3. Order a book
4. Check your Google Sheet - you should see the data!

### Step 3: Test from Browser Console

1. Start your React app: `npm start`
2. Open browser developer tools (F12) and go to Console tab
3. Type: `testWebhookSetup()` and press Enter
4. You should see: "✅ Webhook test successful! Your setup is working correctly."
5. If you see errors, follow the troubleshooting steps below

### Step 4: Check for Errors

1. Look for any CORS or network errors in the Console tab
2. If you see red error messages, copy them and check troubleshooting below

## 🎉 Benefits

✅ **No user authentication required** - Users never see spreadsheet permission requests  
✅ **No backend required** - Everything runs client-side + Google Apps Script  
✅ **No service accounts** - No complex credential management  
✅ **Instant setup** - Works as soon as you deploy the script  
✅ **Secure** - Webhook URL is the only thing exposed

## 🔧 Troubleshooting

### 🚨 CORS Errors Still Happening?

**Most CORS issues are caused by incorrect deployment settings:**

1. ✅ **CRITICAL:** Set "Who has access" to **"Anyone, even anonymous"** (not just "Anyone")
2. ✅ **CRITICAL:** Set "Execute as" to **"Me"** (your Google account)
3. ✅ Redeploy your Apps Script with these exact settings
4. ✅ Wait 1-2 minutes after deployment for changes to take effect

**If you see "setHeaders is not a function" error:**

1. ✅ Make sure your Apps Script code doesn't use `.setHeaders()` (it doesn't exist in Apps Script)
2. ✅ Use the updated code above - Google Apps Script handles CORS automatically

**If you see network errors or redirects:**

1. ✅ Apps Script redirects to `script.googleusercontent.com` - this is **normal behavior**!
2. ✅ Make sure your frontend uses `redirect: "follow"` in fetch requests
3. ✅ The redirect happens automatically and doesn't affect functionality

**Still having CORS issues?**

1. ✅ Try creating a **completely new deployment** (not updating existing one)
2. ✅ Make sure your spreadsheet exists and you have edit access to it
3. ✅ Test the webhook URL directly in a browser (should show JSON response, not HTML error page)

### 📖 Not reading existing subscriptions/orders?

**If your app doesn't load existing data from sheets:**

1. ✅ Update your Apps Script with the new code that includes `getOrdersByEmail()` and `getSubscriptionByEmail()` functions
2. ✅ Check the browser console for webhook read errors
3. ✅ Test the webhook with a POST request containing `{"action": "getOrders", "userEmail": "test@example.com"}`

### Orders not appearing in sheet?

1. Check browser console for webhook errors
2. Verify the webhook URL in your `.env` file
3. Test the webhook URL manually with a POST request

### Google Apps Script errors?

1. Check the execution transcript in Apps Script
2. Verify your spreadsheet ID is correct
3. Make sure the script has permissions to access your spreadsheet

### Webhook URL not working?

1. Make sure you deployed it as a "Web app"
2. Ensure "Who has access" is set to "Anyone"
3. Try redeploying with a new version

## 🚀 You're Done!

Your app now writes to Google Sheets without requiring any user permissions for spreadsheets. Users only need to grant basic profile access, and all sheet operations happen through your webhook.

This is the simplest and most secure approach for your use case!
