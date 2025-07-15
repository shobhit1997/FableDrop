# 🔧 FableDrop Setup Guide

This guide will help you configure the FableDrop app with real Google APIs and deploy it for your users.

## 📋 Prerequisites

- Google Account
- Basic understanding of Google Cloud Console
- Node.js 16+ installed

## 🚀 Quick Setup (Demo Mode)

The app works immediately in demo mode:

1. `npm install`
2. `npm start`
3. Visit `http://localhost:3000`
4. Click "Continue with Google" to sign in with mock data

## 🔑 Google APIs Setup

### Step 1: Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Note your project ID bookshop-465917

### Step 2: Enable APIs

In the Google Cloud Console:

1. **Enable Google Books API:**

   - Go to "APIs & Services" → "Library"
   - Search for "Books API"
   - Click and enable it

2. **Enable Google Sheets API:**
   - Search for "Google Sheets API"
   - Click and enable it

### Step 3: Create API Keys

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key" AIzaSyAHt_lrCUFJ9209tWK5GovzY_qzRdrL5EI
3. Copy the API key
4. Click "Restrict Key" and limit to:
   - Books API
   - Sheets API

## 📊 Google Sheets Setup

### Step 1: Create Order Tracking Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "BookBox Orders" or similar
4. Copy the Sheet ID from the URL: 18N_FP1rSFrJIJNMnh7o5p1YVf5O49stvrFc0-TlN9wo
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```

### Step 2: Share the Sheet

1. Click "Share" in the top right
2. Set sharing to "Anyone with the link can edit"
3. Or add your specific Google account

### Step 3: Configure Headers (Optional)

The app will automatically create headers, but you can pre-populate:

| Order ID | Order Date | Order Time | Month Number | Book Title | Author | Genre | ISBN | Page Count | Rating | Price | Status | Recipient Name | Street Address | City | State | Zip Code | Country | Personal Message | Book Description |

## ⚙️ Environment Configuration

### Option 1: Environment Variables

Create a `.env` file in the project root:

```env
# Google Books API
REACT_APP_GOOGLE_BOOKS_API_KEY=your_api_key_here

# Google Sheets
REACT_APP_GOOGLE_SHEET_ID=your_sheet_id_here
REACT_APP_GOOGLE_SHEETS_API_KEY=your_api_key_here

# Customization
REACT_APP_NOTIFICATION_EMAIL=your-email@example.com
```

### Option 2: Direct Code Configuration

Update `src/services/googleSheetsApi.ts`:

```typescript
config = {
  spreadsheetId: "your_actual_sheet_id",
  sheetName: "Orders",
  apiKey: "your_actual_api_key",
};
```

## 📧 Email Notifications

### Current Implementation

The app simulates email notifications and logs them to:

- Browser console
- LocalStorage (for demo)

### Production Setup Options

1. **EmailJS Integration:**

   ```bash
   npm install emailjs-com
   ```

2. **Backend Email Service:**

   - Setup Node.js backend with nodemailer
   - Connect to SMTP service

3. **Google Apps Script:**
   - Create trigger in Google Sheets
   - Send emails when new rows are added

## 🚀 Deployment Options

### Vercel (Recommended)

1. Push code to GitHub
2. Connect Vercel account
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Netlify

1. Build: `npm run build`
2. Drag `build` folder to Netlify
3. Configure environment variables
4. Custom domain (optional)

### GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:
   ```json
   "homepage": "https://yourusername.github.io/BookSubscription",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```
3. Deploy: `npm run deploy`

## 🎨 Customization

### Branding

1. **Colors:** Update `tailwind.config.js`
2. **Logo:** Replace emoji with custom logo
3. **App Name:** Update throughout codebase

### Content

1. **Genres:** Modify `src/data/mockData.ts`
2. **Welcome Messages:** Update `src/pages/DashboardPage.tsx`
3. **Email Templates:** Customize `src/utils/emailService.ts`

### Shipping Information

Update default shipping in `src/contexts/SubscriptionContext.tsx`:

```typescript
shippingAddress: {
  name: 'Your Girlfriend\'s Name',
  street: 'Her Address',
  city: 'Her City',
  state: 'Her State',
  zipCode: 'Her Zip',
  country: 'USA'
}
```

## 🔧 Troubleshooting

### Books Not Loading

1. Check browser console for API errors
2. Verify Books API is enabled
3. Check API key restrictions
4. Test API key manually:
   ```
   https://www.googleapis.com/books/v1/volumes?q=fiction&key=YOUR_API_KEY
   ```

### Sheets Not Saving

1. Verify Sheets API is enabled
2. Check sheet sharing permissions
3. Test API access manually
4. Review browser console logs

### Login Issues

The demo login should work immediately. For real Google OAuth:

1. Setup OAuth 2.0 client ID
2. Configure authorized domains
3. Update authentication code

## 🎁 Gift Delivery Tips

1. **Test Everything First:**

   - Complete a full order flow
   - Verify email notifications
   - Check Google Sheets logging

2. **Prepare Instructions:**

   - Create simple user guide
   - Include login instructions
   - Explain the 12-month journey

3. **Monitor Orders:**
   - Check Google Sheets regularly
   - Set up mobile notifications
   - Prepare book fulfillment plan

## 🆘 Support

### Demo Mode Issues

- All features work without any API setup
- Data stored in browser localStorage
- Perfect for testing and demonstration

### Production Issues

- Check Google Cloud Console quotas
- Verify API key permissions
- Review browser developer tools

### Getting Help

- Check README.md for overview
- Review component source code
- Check browser console for detailed logs

---

**Happy gifting! 🎁📚**

This setup will create a beautiful, functional book subscription experience that your girlfriend will love exploring each month!
