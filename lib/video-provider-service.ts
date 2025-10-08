import { VideoProvider, getProviderById } from './video-providers'

export interface VideoGenerationRequest {
  prompt: string
  negativePrompt?: string
  durationSeconds: number
  aspectRatio: string
  numberOfVideos: number
  conditioningImage?: {
    mimeType: string
    imageBytes: string
  }
}

export interface VideoGenerationResponse {
  success: boolean
  videos?: string[]
  error?: string
  provider: string
  cost?: number
}

export class VideoProviderService {
  private providers: Map<string, VideoProvider> = new Map()

  constructor() {
    // Initialize providers
    Object.values(require('./video-providers').VIDEO_PROVIDERS).forEach((provider: any) => {
      this.providers.set(provider.id, provider)
    })
  }

  async generateVideo(
    providerId: string, 
    request: VideoGenerationRequest,
    apiKey?: string
  ): Promise<VideoGenerationResponse> {
    const provider = getProviderById(providerId)
    if (!provider) {
      return {
        success: false,
        error: `Provider ${providerId} not found`,
        provider: providerId
      }
    }

    try {
      switch (providerId) {
        case 'veo-2':
        case 'veo-3':
          return await this.generateWithVeo(provider, request, apiKey)
        case 'runwayml':
          return await this.generateWithRunwayML(provider, request, apiKey)
        case 'luma':
          return await this.generateWithLuma(provider, request, apiKey)
        case 'pika':
          return await this.generateWithPika(provider, request, apiKey)
        case 'stability':
          return await this.generateWithStability(provider, request, apiKey)
        case 'openai-sora':
          return await this.generateWithOpenAISora(provider, request, apiKey)
        default:
          return {
            success: false,
            error: `Provider ${providerId} not implemented`,
            provider: providerId
          }
      }
    } catch (error) {
      console.error(`Error generating video with ${providerId}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: providerId
      }
    }
  }

  private async generateWithVeo(
    provider: VideoProvider, 
    request: VideoGenerationRequest,
    apiKey?: string
  ): Promise<VideoGenerationResponse> {
    // For Veo 2, use the new Gemini API endpoint
    if (provider.id === 'veo-2') {
      return await this.generateWithVeo2API(request, apiKey)
    }
    
    // For Veo 3, use the official VEO3 API
    if (provider.id === 'veo-3') {
      return await this.generateWithVeo3API(request, apiKey)
    }
    
    throw new Error(`Unsupported Veo provider: ${provider.id}`)
  }

  private async generateWithVeo3API(
    request: VideoGenerationRequest,
    apiKey?: string
  ): Promise<VideoGenerationResponse> {
    if (!apiKey) {
      throw new Error('VEO3 API key required')
    }

    const requestBody = {
      prompt: request.prompt,
      model: 'veo-3.0-generate-preview',
      generateAudio: true,
      enhancePrompt: true,
      ...(request.negativePrompt && { negativePrompt: request.negativePrompt }),
      ...(request.conditioningImage && { 
        image: `data:${request.conditioningImage.mimeType};base64,${request.conditioningImage.imageBytes}` 
      })
    }

    const response = await fetch('https://api.veo3gen.co/api/veo/text-to-video', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `VEO3 API error: ${response.status}`
      
      if (response.status === 401) {
        errorMessage = 'Authentication failed. Please check your VEO3 API key.'
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.'
      } else if (response.status === 500) {
        errorMessage = 'Server error. Please try again later.'
      }
      
      throw new Error(`${errorMessage} - ${errorText}`)
    }

    const data = await response.json()
    
    if (!data.video_url) {
      throw new Error('No video URL returned from VEO3 API')
    }

    const cost = 0.08 * request.durationSeconds // $0.08 per second

    return {
      success: true,
      videos: [data.video_url],
      provider: 'veo-3',
      cost
    }
  }

  private async generateWithVeo2API(
    request: VideoGenerationRequest,
    apiKey?: string
  ): Promise<VideoGenerationResponse> {
    if (!apiKey) {
      throw new Error('Google API key required for Veo 2')
    }

    const requestBody: any = {
      prompt: request.prompt,
      duration: request.durationSeconds,
      aspect_ratio: request.aspectRatio,
      resolution: '720p' // Default resolution
    }

    if (request.negativePrompt) {
      requestBody.negative_prompt = request.negativePrompt
    }

    if (request.conditioningImage) {
      requestBody.image_url = `data:${request.conditioningImage.mimeType};base64,${request.conditioningImage.imageBytes}`
    }

    // Add seed for reproducibility if needed
    requestBody.seed = Math.floor(Math.random() * 1000000)

    const response = await fetch('https://api.gemini.google.com/v1/video/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Veo 2 API error: ${response.status}`
      
      if (response.status === 401) {
        errorMessage = 'Authentication failed. Please check your API key.'
      } else if (response.status === 406) {
        errorMessage = 'Insufficient credits or quota exceeded.'
      } else if (response.status === 500) {
        errorMessage = 'Server error. Please try again later.'
      }
      
      throw new Error(`${errorMessage} - ${errorText}`)
    }

    const data = await response.json()
    
    if (!data.video_url) {
      throw new Error('No video URL returned from Veo 2 API')
    }

    const cost = 0.35 * request.durationSeconds // $0.35 per second as per documentation

    return {
      success: true,
      videos: [data.video_url],
      provider: 'veo-2',
      cost
    }
  }

  private async generateWithRunwayML(
    provider: VideoProvider, 
    request: VideoGenerationRequest,
    apiKey?: string
  ): Promise<VideoGenerationResponse> {
    if (!apiKey) {
      throw new Error('RunwayML API key required')
    }

    // RunwayML Gen-4 with enhanced features
    const requestBody: any = {
      prompt: request.prompt,
      duration: request.durationSeconds,
      aspect_ratio: request.aspectRatio,
      model: 'gen4', // RunwayML's Gen-4 model
      style_consistency: true, // Gen-4 feature
      camera_controls: true, // Gen-4 feature
      keyframe_controls: true, // Gen-4 feature
      ...(request.negativePrompt && { negative_prompt: request.negativePrompt }),
      ...(request.conditioningImage && {
        image: `data:${request.conditioningImage.mimeType};base64,${request.conditioningImage.imageBytes}`
      })
    }

    const response = await fetch('https://api.runwayml.com/v1/image_to_video', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `RunwayML API error: ${response.status}`
      
      if (response.status === 401) {
        errorMessage = 'Authentication failed. Please check your RunwayML API key.'
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.'
      } else if (response.status === 402) {
        errorMessage = 'Insufficient credits. Please add credits to your RunwayML account.'
      }
      
      throw new Error(`${errorMessage} - ${errorText}`)
    }

    const data = await response.json()
    
    if (!data.video_url && !data.video) {
      throw new Error('No video URL returned from RunwayML API')
    }

    const videoUrl = data.video_url || data.video
    const cost = provider.pricing.costPerSecond * request.durationSeconds * request.numberOfVideos

    return {
      success: true,
      videos: [videoUrl],
      provider: provider.id,
      cost
    }
  }

  private async generateWithLuma(
    provider: VideoProvider, 
    request: VideoGenerationRequest,
    apiKey?: string
  ): Promise<VideoGenerationResponse> {
    if (!apiKey) {
      throw new Error('Luma AI API key required')
    }

    const requestBody: any = {
      prompt: request.prompt,
      duration: request.durationSeconds,
      aspect_ratio: request.aspectRatio,
      model: 'dream_machine_v1', // Luma's Dream Machine model
      ...(request.negativePrompt && { negative_prompt: request.negativePrompt }),
      ...(request.conditioningImage && {
        image: `data:${request.conditioningImage.mimeType};base64,${request.conditioningImage.imageBytes}`
      })
    }

    const response = await fetch('https://api.lumalabs.ai/dream-machine/v1/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Luma AI API error: ${response.status}`
      
      if (response.status === 401) {
        errorMessage = 'Authentication failed. Please check your Luma AI API key.'
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.'
      } else if (response.status === 402) {
        errorMessage = 'Insufficient credits. Please add credits to your Luma AI account.'
      }
      
      throw new Error(`${errorMessage} - ${errorText}`)
    }

    const data = await response.json()
    
    if (!data.video_url && !data.video) {
      throw new Error('No video URL returned from Luma AI API')
    }

    const videoUrl = data.video_url || data.video
    const cost = provider.pricing.costPerSecond * request.durationSeconds * request.numberOfVideos

    return {
      success: true,
      videos: [videoUrl],
      provider: provider.id,
      cost
    }
  }

  private async generateWithPika(
    provider: VideoProvider, 
    request: VideoGenerationRequest,
    apiKey?: string
  ): Promise<VideoGenerationResponse> {
    if (!apiKey) {
      throw new Error('Pika Labs API key required')
    }

    const requestBody: any = {
      prompt: request.prompt,
      duration: request.durationSeconds,
      aspect_ratio: request.aspectRatio,
      model: 'pika_2.2', // Pika 2.2 model
      style: 'cinematic', // Default style
      image_integration: true, // Pika 2.2 feature
      faster_generation: true, // Pika 2.2 feature
      ...(request.negativePrompt && { negative_prompt: request.negativePrompt }),
      ...(request.conditioningImage && {
        image: `data:${request.conditioningImage.mimeType};base64,${request.conditioningImage.imageBytes}`
      })
    }

    const response = await fetch('https://api.pika.art/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Pika Labs API error: ${response.status}`
      
      if (response.status === 401) {
        errorMessage = 'Authentication failed. Please check your Pika Labs API key.'
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.'
      } else if (response.status === 402) {
        errorMessage = 'Insufficient credits. Please add credits to your Pika Labs account.'
      }
      
      throw new Error(`${errorMessage} - ${errorText}`)
    }

    const data = await response.json()
    
    if (!data.video_url && !data.video) {
      throw new Error('No video URL returned from Pika Labs API')
    }

    const videoUrl = data.video_url || data.video
    const cost = provider.pricing.costPerSecond * request.durationSeconds * request.numberOfVideos

    return {
      success: true,
      videos: [videoUrl],
      provider: provider.id,
      cost
    }
  }

  private async generateWithStability(
    provider: VideoProvider, 
    request: VideoGenerationRequest,
    apiKey?: string
  ): Promise<VideoGenerationResponse> {
    if (!apiKey) {
      throw new Error('Stability AI API key required')
    }

    const requestBody: any = {
      prompt: request.prompt,
      duration: request.durationSeconds,
      aspect_ratio: request.aspectRatio,
      model: 'stable-video-diffusion', // Stability's video model
      ...(request.negativePrompt && { negative_prompt: request.negativePrompt }),
      ...(request.conditioningImage && {
        image: `data:${request.conditioningImage.mimeType};base64,${request.conditioningImage.imageBytes}`
      })
    }

    const response = await fetch('https://api.stability.ai/v2beta/image-to-video', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Stability AI API error: ${response.status}`
      
      if (response.status === 401) {
        errorMessage = 'Authentication failed. Please check your Stability AI API key.'
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.'
      } else if (response.status === 402) {
        errorMessage = 'Insufficient credits. Please add credits to your Stability AI account.'
      }
      
      throw new Error(`${errorMessage} - ${errorText}`)
    }

    const data = await response.json()
    
    if (!data.video_url && !data.video) {
      throw new Error('No video URL returned from Stability AI API')
    }

    const videoUrl = data.video_url || data.video
    const cost = provider.pricing.costPerSecond * request.durationSeconds * request.numberOfVideos

    return {
      success: true,
      videos: [videoUrl],
      provider: provider.id,
      cost
    }
  }

  private async generateWithOpenAISora(
    provider: VideoProvider, 
    request: VideoGenerationRequest,
    apiKey?: string
  ): Promise<VideoGenerationResponse> {
    if (!apiKey) {
      throw new Error('OpenAI API key required for Sora')
    }

    const requestBody: any = {
      model: 'sora-1.0',
      prompt: request.prompt,
      duration: request.durationSeconds,
      aspect_ratio: request.aspectRatio,
      quality: 'hd', // High definition quality
      ...(request.negativePrompt && { negative_prompt: request.negativePrompt }),
      ...(request.conditioningImage && {
        image: `data:${request.conditioningImage.mimeType};base64,${request.conditioningImage.imageBytes}`
      })
    }

    const response = await fetch('https://api.openai.com/v1/video/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `OpenAI Sora API error: ${response.status}`
      
      if (response.status === 401) {
        errorMessage = 'Authentication failed. Please check your OpenAI API key.'
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.'
      } else if (response.status === 402) {
        errorMessage = 'Insufficient credits. Please add credits to your OpenAI account.'
      }
      
      throw new Error(`${errorMessage} - ${errorText}`)
    }

    const data = await response.json()
    
    if (!data.video_url && !data.video) {
      throw new Error('No video URL returned from OpenAI Sora API')
    }

    const videoUrl = data.video_url || data.video
    const cost = provider.pricing.costPerSecond * request.durationSeconds * request.numberOfVideos

    return {
      success: true,
      videos: [videoUrl],
      provider: provider.id,
      cost
    }
  }
}
