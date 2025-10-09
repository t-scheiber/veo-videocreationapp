# Complete Setup Guide for AI Video Generation App

This guide will help you set up the AI Video Generation App with VEO3 and other video generation providers.

## Prerequisites

1. Node.js and npm installed
2. API keys for the video generation providers you want to use
3. Google OAuth credentials (for user authentication)

## Step 1: Get API Keys

### 1.1 VEO3 API Key (Primary Provider)
1. Visit [https://api.veo3gen.app/](https://api.veo3gen.app/)
2. Sign up for an account
3. Generate an API key (starts with `veo_`)
4. Note: VEO3 offers 20 seconds free per month

### 1.2 Other Provider API Keys (Optional)
- **RunwayML**: [https://runwayml.com/](https://runwayml.com/) - 125s free/month
- **Luma AI**: [https://lumalabs.ai/](https://lumalabs.ai/) - 30s free/month  
- **OpenAI Sora**: [https://platform.openai.com/](https://platform.openai.com/) - 10s free/month

> **Note**: Pika Labs 2.2 is temporarily disabled while awaiting API access approval.

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

## Step 3: Environment Configuration

Create a `.env.local` file in your project root with the following content:

```env
# VEO3 API Key (Primary Provider)
VEO3_API_KEY=veo_your-veo3-api-key-here

# Other Provider API Keys (Optional - only add the ones you want to use)
RUNWAYML_API_KEY=your-runwayml-api-key-here
LUMA_API_KEY=your-luma-api-key-here
OPENAI_API_KEY=your-openai-api-key-here

# Pika Labs 2.2 is temporarily disabled (awaiting API access)
# PIKA_API_KEY=your-pika-api-key-here

# Auth.js Configuration
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

## Step 4: Install Dependencies and Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Step 5: Testing the Setup

1. **Test Authentication**: You should see a "Sign in with Google" button
2. **Sign In**: Click the button and complete the Google OAuth flow
3. **Test Video Generation**: Try generating a video with VEO3 using a simple prompt

## Troubleshooting

### Common Issues:

1. **"Authentication required" error**
   - Make sure you're signed in with Google
   - Check that your OAuth credentials are correct

2. **"VEO3 API key required" error**
   - Make sure you've added your VEO3 API key to `.env.local`
   - Verify the API key starts with `veo_`

3. **"Invalid client" (OAuth)**
   - Verify your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
   - Check that the redirect URI is properly configured

4. **Video generation fails**
   - Check that your VEO3 API key is valid and has credits
   - Try a simpler prompt first
   - Check the browser console for detailed error messages

### Getting Help:

- [VEO3 API Documentation](https://api.veo3gen.app/)
- [Auth.js Documentation](https://authjs.dev/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
