# Google Cloud Service Account Setup Guide

This guide will help you create a Google Cloud service account and download the key file needed for your Veo video generation app.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" at the top
3. Click "New Project"
4. Enter a project name (e.g., "veo-video-app")
5. Click "Create"
6. Wait for the project to be created and select it

## Step 2: Enable Required APIs

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for and enable these APIs:
   - **Vertex AI API**
   - **AI Platform API**

To enable them:
- Click on each API
- Click "Enable"

## Step 3: Create a Service Account

1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Fill in the details:
   - **Service account name**: `veo-video-service`
   - **Service account ID**: `veo-video-service` (auto-generated)
   - **Description**: `Service account for Veo video generation`
4. Click "Create and Continue"

## Step 4: Assign Roles to Service Account

1. In the "Grant this service account access to project" section:
2. Add these roles:
   - **Vertex AI User**
   - **AI Platform Developer**
3. Click "Continue"
4. Click "Done"

## Step 5: Create and Download the Key

1. Find your service account in the list
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create new key"
5. Select "JSON" format
6. Click "Create"
7. The JSON file will download automatically

## Step 6: Place the Key File in Your Project

1. **Rename the downloaded file** to something simple like `google-service-account.json`
2. **Create a `credentials` folder** in your project root:
   ```
   D:\Code\veo-videocreationapp\
   ├── credentials\
   │   └── google-service-account.json
   ├── app\
   ├── components\
   └── ...
   ```
3. **Move the JSON file** into the `credentials` folder

## Step 7: Update Your Environment Variables

Create or update your `.env.local` file in the project root:

```env
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your-actual-project-id
GOOGLE_CLOUD_LOCATION=us-central1

# Service Account Key File Path
GOOGLE_APPLICATION_CREDENTIALS=./credentials/google-service-account.json

# Auth.js Configuration
AUTH_SECRET=your-auth-secret-key-here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 8: Get Your Project ID

1. In Google Cloud Console, go to "Project Settings"
2. Copy your **Project ID** (not the project name)
3. Replace `your-actual-project-id` in your `.env.local` file

## Step 9: Test the Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```
2. Try generating a video
3. Check the console for any remaining errors

## Troubleshooting

### Common Issues:

1. **"File not found" error**:
   - Make sure the JSON file is in the `credentials` folder
   - Check the path in your `.env.local` file
   - Ensure the file name matches exactly

2. **"Permission denied" error**:
   - Make sure you assigned the correct roles to the service account
   - Verify the APIs are enabled

3. **"Invalid project" error**:
   - Double-check your Project ID in `.env.local`
   - Make sure you're using the Project ID, not the project name

### File Structure Example:
```
D:\Code\veo-videocreationapp\
├── credentials\
│   └── google-service-account.json
├── .env.local
├── app\
├── components\
└── package.json
```

## Security Notes:

- **Never commit** the `credentials` folder to version control
- **Add to .gitignore**:
  ```
  credentials/
  .env.local
  ```
- **Keep the JSON file secure** - it contains sensitive credentials

## Getting Help:

- [Google Cloud Service Accounts Documentation](https://cloud.google.com/iam/docs/service-accounts)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Google Cloud Authentication](https://cloud.google.com/docs/authentication)
