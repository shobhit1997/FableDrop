# Google Sheets Proxy Server

This proxy server handles communication between your React app and Google Apps Script, avoiding CORS issues.

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Create a `.env` file** in this directory with the following configuration:

   ```env
   # Required: Your Google Apps Script Web App URL
   GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec

   # Optional: Server port (default: 5001)
   PORT=5001

   # Optional: CORS origin (default: http://localhost:3000)
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Get your Google Apps Script URL:**
   - Go to [Google Apps Script](https://script.google.com)
   - Create or open your project
   - Click "Deploy" → "New deployment"
   - Choose "Web app" as type
   - Set "Who has access" to "Anyone, even anonymous"
   - Copy the web app URL

## Usage

### Development

```bash
npm start
```

### Production

```bash
NODE_ENV=production npm start
```

## Endpoints

- `GET /health` - Health check endpoint
- `POST /submit` - Main proxy endpoint for Google Sheets operations

## Environment Variables

| Variable            | Required | Default               | Description                    |
| ------------------- | -------- | --------------------- | ------------------------------ |
| `GOOGLE_SCRIPT_URL` | ✅ Yes   | -                     | Google Apps Script web app URL |
| `PORT`              | No       | 5001                  | Server port                    |
| `CORS_ORIGIN`       | No       | http://localhost:3000 | Allowed CORS origin            |

## Security

- CORS is configured to only allow requests from specified origins
- No sensitive data is logged
- Graceful shutdown handling

## Troubleshooting

1. **"GOOGLE_SCRIPT_URL environment variable is required"**

   - Make sure you have a `.env` file with the `GOOGLE_SCRIPT_URL` set

2. **CORS errors**

   - Check that `CORS_ORIGIN` matches your React app's URL
   - For production, update `CORS_ORIGIN` to your domain

3. **Connection timeouts**
   - The proxy has a 30-second timeout for Google Apps Script requests
   - Check that your Google Apps Script is deployed and accessible
