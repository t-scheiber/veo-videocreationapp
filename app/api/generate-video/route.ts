import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { VertexAI } from '@google-cloud/vertexai'

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
    const conditioningImageFile = formData.get('conditioningImage') as File | null

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Check if we have proper authentication setup
    if (!GOOGLE_CLOUD_PROJECT_ID || GOOGLE_CLOUD_PROJECT_ID === 'your-project-id') {
      return NextResponse.json({ 
        error: 'Google Cloud Project ID not configured. Please set GOOGLE_CLOUD_PROJECT_ID in your environment variables.' 
      }, { status: 500 })
    }

    // Initialize VertexAI with proper authentication
    const vertexAIConfig: any = {
      project: GOOGLE_CLOUD_PROJECT_ID,
      location: GOOGLE_CLOUD_LOCATION,
    }

    // Add authentication method if available
    if (GOOGLE_APPLICATION_CREDENTIALS) {
      vertexAIConfig.keyFilename = GOOGLE_APPLICATION_CREDENTIALS
    }

    const vertexAI = new VertexAI(vertexAIConfig)

    const model = vertexAI.getGenerativeModel({
      model: 'veo-3.0-generate-preview',
    })

    const requestData: any = {
      prompt,
      config: {
        aspect_ratio: aspectRatio,
        duration: durationSeconds,
        number_of_videos: numberOfVideos,
      },
    }

    if (negativePrompt) {
      requestData.negativePrompt = negativePrompt
    }

    if (conditioningImageFile) {
      const imageBuffer = await conditioningImageFile.arrayBuffer()
      const imageBase64 = Buffer.from(imageBuffer).toString('base64')
      requestData.image = {
        mimeType: conditioningImageFile.type,
        imageBytes: imageBase64,
      }
    }

    const result = await model.generateContent(requestData)
    const response = result.response

    if (!response.candidates || response.candidates.length === 0) {
      return NextResponse.json(
        { error: 'No videos generated. Please try again with a simpler prompt.' },
        { status: 400 }
      )
    }

    // Extract video URLs from the response
    const videos = response.candidates.map((candidate: any) => candidate.content?.parts?.[0]?.text || '').filter(Boolean)

    return NextResponse.json({ videos })
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
