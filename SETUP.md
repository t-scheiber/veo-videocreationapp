# Complete Setup Guide for Veo Video Generation App

This guide will help you set up both Google Cloud authentication and Google OAuth for the Veo Video Generation App.

## Prerequisites

1. A Google Cloud Project with Vertex AI API enabled
2. Google Cloud CLI installed (optional but recommended)
3. Node.js and npm installed

## Step 1: Google Cloud Project Setup

### 1.1 Create or Select a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID (you'll need this later)

### 1.2 Enable Required APIs
Enable these APIs in your Google Cloud project:
- Vertex AI API
- Google+ API (for OAuth)

You can enable them in the [Google Cloud Console](https://console.cloud.google.com/apis/library) or using the CLI:

```bash
gcloud services enable aiplatform.googleapis.com
gcloud services enable vertex.googleapis.com
gcloud services enable plus.googleapis.com
```

## Step 2: Google OAuth Setup

### 2.1 Create OAuth 2.0 Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services > Credentials**
3. Click **"Create Credentials" > "OAuth 2.0 Client ID"**
4. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in the required fields (App name, User support email, Developer contact)
   - Add your email to test users
5. Set Application type to **"Web application"**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Click **"Create"**
8. Copy the **Client ID** and **Client Secret** (you'll need these for your `.env.local`)

## Step 3: Google Cloud Authentication Setup

Choose one of these methods:

### Method A: Application Default Credentials (Recommended for Local Development)

1. Install Google Cloud CLI:
   ```bash
   # Windows (using PowerShell)
   (New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
   & $env:Temp\GoogleCloudSDKInstaller.exe
   ```

2. Authenticate with Google Cloud:
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

3. Set your project ID:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

### Method B: Service Account Key (Recommended for Production)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **IAM & Admin > Service Accounts**
3. Create a new service account or use an existing one
4. Grant the service account the **"Vertex AI User"** role
5. Create a new key (JSON format) and download it
6. Place the key file in your project directory

## Step 4: Environment Configuration

Create a `.env.local` file in your project root with the following content:

```env
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your-actual-project-id
GOOGLE_CLOUD_LOCATION=us-central1

# For Method A (Application Default Credentials) - no additional config needed
# For Method B (Service Account) - uncomment and set the path:
# GOOGLE_APPLICATION_CREDENTIALS=./path/to/your-service-account-key.json

# Auth.js v5 Configuration
AUTH_SECRET=your-auth-secret-key-here

# Google OAuth Credentials (from Step 2.1)
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Generate Auth Secret
Generate a random secret for Auth.js:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

## Step 5: Install Dependencies and Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Step 6: Testing the Setup

1. **Test Authentication**: You should see a "Sign in with Google" button
2. **Sign In**: Click the button and complete the Google OAuth flow
3. **Test Video Generation**: Try generating a video with a simple prompt

## Troubleshooting

### Common Issues:

1. **"Authentication required" error**
   - Make sure you're signed in with Google
   - Check that your OAuth credentials are correct

2. **"Unable to authenticate your request" (Google Cloud)**
   - Verify your Google Cloud project ID is correct
   - Make sure you've run `gcloud auth application-default login`
   - Check that the Vertex AI API is enabled

3. **"Invalid client" (OAuth)**
   - Verify your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
   - Check that the redirect URI is properly configured

4. **"Could not load the default credentials"**
   - Ensure your `.env.local` file has the correct project ID
   - For service account method, verify the key file path is correct

### Getting Help:

- [Google Cloud Authentication Documentation](https://cloud.google.com/docs/authentication)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Auth.js Documentation](https://authjs.dev/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
