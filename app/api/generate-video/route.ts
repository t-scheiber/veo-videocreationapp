import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { VideoProviderService } from '@/lib/video-provider-service'

const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || 'your-project-id'
const GOOGLE_CLOUD_LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'
const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const formData = await request.formData()
    const prompt = formData.get('prompt') as string
    const negativePrompt = formData.get('negativePrompt') as string
    const numberOfVideos = parseInt(formData.get('numberOfVideos') as string)
    const aspectRatio = formData.get('aspectRatio') as string
    const durationSeconds = parseInt(formData.get('durationSeconds') as string)
    const provider = formData.get('provider') as string || 'veo-3'
    const conditioningImageFile = formData.get('conditioningImage') as File | null

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    console.log(`Generating video with provider: ${provider}`)

    // Initialize the provider service
    const providerService = new VideoProviderService()

    // Prepare the request data
    const requestData = {
      prompt,
      negativePrompt: negativePrompt || undefined,
      durationSeconds,
      aspectRatio,
      numberOfVideos,
      conditioningImage: conditioningImageFile ? {
        mimeType: conditioningImageFile.type,
        imageBytes: Buffer.from(await conditioningImageFile.arrayBuffer()).toString('base64')
      } : undefined
    }

    // Get the appropriate API key based on provider
    let apiKey: string | undefined
    switch (provider) {
      case 'veo-2':
        // Veo 2 uses the new Gemini API with API key
        apiKey = process.env.GOOGLE_API_KEY
        if (!apiKey) {
          return NextResponse.json({ 
            error: 'Google API key required for Veo 2. Please set GOOGLE_API_KEY in your environment variables.' 
          }, { status: 500 })
        }
        break
      case 'veo-3':
        // VEO3 uses its own API key
        apiKey = process.env.VEO3_API_KEY
        if (!apiKey) {
          return NextResponse.json({ 
            error: 'VEO3 API key required. Please set VEO3_API_KEY in your environment variables.' 
          }, { status: 500 })
        }
        break
      case 'runwayml':
        apiKey = process.env.RUNWAYML_API_KEY
        break
      case 'luma':
        apiKey = process.env.LUMA_API_KEY
        break
      case 'pika':
        apiKey = process.env.PIKA_API_KEY
        break
      case 'stability':
        apiKey = process.env.STABILITY_API_KEY
        break
      case 'openai-sora':
        apiKey = process.env.OPENAI_API_KEY
        break
    }

    // Generate video using the selected provider
    const result = await providerService.generateVideo(provider, requestData, apiKey)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate video' },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      videos: result.videos,
      provider: result.provider,
      cost: result.cost
    })
  } catch (error) {
    console.error('Error generating video:', error)
    
    // Provide more specific error messages for authentication issues
    if (error instanceof Error) {
      if (error.message.includes('authentication') || error.message.includes('credentials')) {
        return NextResponse.json(
          { 
            error: 'Authentication failed. Please check your Google Cloud credentials. Make sure you have set up GOOGLE_APPLICATION_CREDENTIALS or run `gcloud auth login`.' 
          },
          { status: 401 }
        )
      }
      
      if (error.message.includes('project')) {
        return NextResponse.json(
          { 
            error: 'Invalid Google Cloud project. Please check your GOOGLE_CLOUD_PROJECT_ID environment variable.' 
          },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to generate video. Please try again.' },
      { status: 500 }
    )
  }
}
