# Veo Video Generation App

A Next.js 15.5.4 application for generating videos using Google's Veo AI model.

## Features

- Generate videos using Google's Veo AI model
- Customizable aspect ratios and durations
- Negative prompt support
- Conditioning image upload
- Modern React components with TypeScript
- Tailwind CSS styling

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your Google Cloud configuration:
   ```
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   GOOGLE_CLOUD_LOCATION=us-central1
   GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
   ```

3. **Set up Google Cloud authentication:**
   
   Option A - Service Account (Recommended):
   - Create a service account in Google Cloud Console
   - Download the JSON key file
   - Set `GOOGLE_APPLICATION_CREDENTIALS` to the path of your key file
   
   Option B - Application Default Credentials:
   ```bash
   gcloud auth application-default login
   ```

4. **Enable Vertex AI API:**
   - Go to Google Cloud Console
   - Enable the Vertex AI API for your project

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── api/generate-video/route.ts  # API endpoint for video generation
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Home page
├── components/
│   └── VideoGenerator.tsx           # Main video generation component
├── next.config.js                   # Next.js configuration
├── tailwind.config.js               # Tailwind CSS configuration
└── tsconfig.json                    # TypeScript configuration
```

## Usage

1. Enter a descriptive prompt for your video
2. Optionally add a negative prompt to avoid unwanted elements
3. Select the number of videos, aspect ratio, and duration
4. Optionally upload a conditioning image
5. Click "Generate" to create your video

## Technologies Used

- Next.js 15.5.4
- React 19
- TypeScript
- Tailwind CSS
- Google Cloud Vertex AI
- Google Veo AI Model
