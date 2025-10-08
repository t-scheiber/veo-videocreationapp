# AI Video Generation Tool

A comprehensive Next.js application for generating high-quality AI videos for web project hero sections and other creative needs. Built because I needed a reliable tool to create AI videos for different web projects, so I created my own multi-provider solution.

## 🎯 Why I Built This

I was working on multiple web projects and needed high-quality AI-generated videos for hero sections, but existing solutions were either too expensive, limited, or unreliable. So I built my own tool that supports multiple AI video generation providers, giving me flexibility and cost control.

## ✨ Features

- **7 AI Video Providers**: Choose from Google Veo 2/3, RunwayML Gen-4, Luma Dream Machine, Pika Labs 2.2, Stability AI, and OpenAI Sora
- **Cost Comparison**: Real-time cost estimation for each provider
- **Smart Provider Selection**: Choose the best provider based on your budget and quality needs
- **Multiple Aspect Ratios**: 16:9, 9:16, 1:1, 4:3, 21:9 support
- **Image-to-Video**: Upload reference images for better results
- **Negative Prompts**: Specify what you don't want in your videos
- **Batch Generation**: Create multiple video variations
- **Modern UI**: Beautiful, responsive interface with real-time feedback

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   ```
   
   Add your API keys for the providers you want to use:
   ```bash
   # Choose your providers (you don't need all of them)
   GOOGLE_API_KEY=your-google-api-key-here      # For Veo 2
   VEO3_API_KEY=your-veo3-api-key-here          # For VEO3
   RUNWAYML_API_KEY=your-runwayml-api-key-here  # For RunwayML Gen-4
   LUMA_API_KEY=your-luma-api-key-here           # For Luma Dream Machine
   PIKA_API_KEY=your-pika-api-key-here           # For Pika Labs 2.2
   STABILITY_API_KEY=your-stability-api-key-here # For Stability AI
   OPENAI_API_KEY=your-openai-api-key-here      # For OpenAI Sora
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 💰 Cost Comparison

| Provider | Cost/Second | Best For | Free Tier |
|----------|-------------|----------|-----------|
| **Stability AI** | $0.01 | Budget projects | 50s/month |
| **Luma Dream Machine** | $0.02 | Fast generation | 30s/month |
| **Pika Labs 2.2** | $0.03 | Creative styles | 20s/month |
| **RunwayML Gen-4** | $0.05 | Professional quality | 125s/month |
| **VEO3 API** | $0.08 | Advanced features | 20s/month |
| **Google Veo 2** | $0.35 | Highest quality | 30s/month |
| **OpenAI Sora** | $0.10 | Complex scenes | 10s/month |

## 🎬 Perfect for Web Projects

This tool is specifically designed for web developers and designers who need:
- **Hero section videos** for landing pages
- **Background videos** for websites
- **Product demos** and showcases
- **Social media content** for marketing
- **Prototype videos** for client presentations

## 🏗️ Project Structure

```
├── app/
│   ├── api/generate-video/route.ts  # Multi-provider API endpoint
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Home page
├── components/
│   └── VideoGenerator.tsx           # Main video generation component
├── lib/
│   ├── video-providers.ts           # Provider configurations
│   └── video-provider-service.ts    # Provider service logic
├── next.config.js                   # Next.js configuration
├── tailwind.config.js               # Tailwind CSS configuration
└── tsconfig.json                    # TypeScript configuration
```

## 🎯 How to Use

1. **Choose your provider** based on budget and quality needs
2. **Enter a descriptive prompt** for your video
3. **Add negative prompts** to avoid unwanted elements
4. **Select aspect ratio and duration** for your use case
5. **Upload reference images** for better results (optional)
6. **Generate multiple variations** to find the perfect video
7. **Download and use** in your web projects

## 🛠️ Technologies Used

- **Next.js 15.5.4** - React framework
- **React 19** - UI components
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Multi-Provider Architecture** - 7 AI video providers
- **Real-time Cost Estimation** - Budget control
- **Modern UI/UX** - Beautiful, responsive design

## 📈 Use Cases

- **Landing Page Heroes**: Create stunning background videos
- **Product Showcases**: Demonstrate features with AI-generated content
- **Marketing Campaigns**: Generate social media content at scale
- **Client Presentations**: Create professional demo videos
- **Prototype Development**: Visualize concepts before production

## 🤝 Contributing

This project was built to solve a real need for AI video generation in web development. Feel free to fork, modify, and use it for your own projects!

## 📄 License

MIT License - Use it for your own web projects and commercial applications.
