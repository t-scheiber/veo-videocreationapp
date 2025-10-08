export interface VideoProvider {
  id: string
  name: string
  description: string
  pricing: {
    costPerSecond: number
    currency: string
    freeTier?: {
      seconds: number
      description: string
    }
  }
  features: string[]
  maxDuration: number
  supportedAspectRatios: string[]
  apiEndpoint: string
  requiresAuth: boolean
  authType: 'api_key' | 'oauth' | 'bearer'
  capabilities: {
    supportsMultipleVideos: boolean
    supportsConditioningImage: boolean
    supportsNegativePrompt: boolean
    supportsResolution: boolean
    supportsFPS: boolean
    maxVideos: number
    supportedResolutions: string[]
    supportedFPS: number[]
    supportedDurations: number[]
  }
}

export const VIDEO_PROVIDERS: Record<string, VideoProvider> = {
  'veo-2': {
    id: 'veo-2',
    name: 'Google Veo 2.0',
    description: 'Google\'s latest video generation model with high quality output',
    pricing: {
      costPerSecond: 0.35, // Official pricing: $0.35 per second
      currency: 'USD',
      freeTier: {
        seconds: 30,
        description: '30 seconds free per month'
      }
    },
    features: ['Text-to-video', 'Image-to-video', 'High quality', 'Fast generation'],
    maxDuration: 8, // Veo 2: 5-8 seconds
    supportedAspectRatios: ['16:9', '9:16'], // Veo 2: landscape and portrait only
    apiEndpoint: 'https://api.gemini.google.com/v1/video/generate',
    requiresAuth: true,
    authType: 'api_key',
    capabilities: {
      supportsMultipleVideos: false, // Veo 2: single video only
      supportsConditioningImage: true,
      supportsNegativePrompt: true,
      supportsResolution: false, // Veo 2: no resolution options
      supportsFPS: false, // Veo 2: no FPS control
      maxVideos: 1,
      supportedResolutions: [],
      supportedFPS: [],
      supportedDurations: [5, 6, 7, 8] // Veo 2: 5-8 seconds
    }
  },
  'veo-3': {
    id: 'veo-3',
    name: 'VEO3 API',
    description: 'Advanced video generation with enhanced capabilities and audio generation',
    pricing: {
      costPerSecond: 0.08, // Official pricing
      currency: 'USD',
      freeTier: {
        seconds: 20,
        description: '20 seconds free per month'
      }
    },
    features: ['Text-to-video', 'Image-to-video', 'Audio generation', 'Enhanced prompts', 'Advanced features'],
    maxDuration: 8, // Veo 3: 4, 6, or 8 seconds
    supportedAspectRatios: ['16:9'], // Veo 3: landscape only
    apiEndpoint: 'https://api.veo3gen.co/api/veo/text-to-video',
    requiresAuth: true,
    authType: 'api_key',
    capabilities: {
      supportsMultipleVideos: false, // Veo 3: single video only
      supportsConditioningImage: true,
      supportsNegativePrompt: true,
      supportsResolution: true, // Veo 3: 720p (default) and 1080p
      supportsFPS: false, // Veo 3: no FPS control
      maxVideos: 1,
      supportedResolutions: ['720p', '1080p'],
      supportedFPS: [],
      supportedDurations: [4, 6, 8] // Veo 3: 4, 6, or 8 seconds
    }
  },
  'runwayml': {
    id: 'runwayml',
    name: 'RunwayML Gen-4',
    description: 'Professional video generation with Gen-4 model featuring enhanced camera controls and style consistency',
    pricing: {
      costPerSecond: 0.05,
      currency: 'USD',
      freeTier: {
        seconds: 125,
        description: '125 seconds free per month'
      }
    },
    features: ['Text-to-video', 'Image-to-video', 'Video-to-video', 'Camera controls', 'Keyframe controls', 'Style consistency'],
    maxDuration: 18,
    supportedAspectRatios: ['16:9', '9:16', '1:1'],
    apiEndpoint: 'https://api.runwayml.com/v1/image_to_video',
    requiresAuth: true,
    authType: 'bearer',
    capabilities: {
      supportsMultipleVideos: true,
      supportsConditioningImage: true,
      supportsNegativePrompt: true,
      supportsResolution: true,
      supportsFPS: true,
      maxVideos: 4,
      supportedResolutions: ['720p', '1080p', '4K'],
      supportedFPS: [24, 30, 60],
      supportedDurations: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
    }
  },
  'luma': {
    id: 'luma',
    name: 'Luma Dream Machine',
    description: 'State-of-the-art video generation producing 120 frames in 2 minutes with character consistency and realistic physics',
    pricing: {
      costPerSecond: 0.02,
      currency: 'USD',
      freeTier: {
        seconds: 30,
        description: '30 seconds free per month'
      }
    },
    features: ['Text-to-video', 'Image-to-video', 'Character consistency', 'Realistic physics', 'Camera motion control', 'Loop creation'],
    maxDuration: 5,
    supportedAspectRatios: ['16:9', '9:16', '1:1'],
    apiEndpoint: 'https://api.lumalabs.ai/dream-machine/v1/generations',
    requiresAuth: true,
    authType: 'bearer',
    capabilities: {
      supportsMultipleVideos: false,
      supportsConditioningImage: true,
      supportsNegativePrompt: true,
      supportsResolution: true,
      supportsFPS: false,
      maxVideos: 1,
      supportedResolutions: ['720p', '1080p'],
      supportedFPS: [],
      supportedDurations: [3, 4, 5]
    }
  },
  'pika': {
    id: 'pika',
    name: 'Pika Labs 2.2',
    description: 'Enhanced video generation with improved image integration and faster generation speeds',
    pricing: {
      costPerSecond: 0.03,
      currency: 'USD',
      freeTier: {
        seconds: 20,
        description: '20 seconds free per month'
      }
    },
    features: ['Text-to-video', 'Image-to-video', 'Custom image integration', 'Faster generation', 'Artistic styles', 'Creative effects'],
    maxDuration: 4,
    supportedAspectRatios: ['16:9', '9:16', '1:1'],
    apiEndpoint: 'https://api.pika.art/v1/generate',
    requiresAuth: true,
    authType: 'bearer',
    capabilities: {
      supportsMultipleVideos: true,
      supportsConditioningImage: true,
      supportsNegativePrompt: true,
      supportsResolution: true,
      supportsFPS: true,
      maxVideos: 3,
      supportedResolutions: ['720p', '1080p'],
      supportedFPS: [24, 30],
      supportedDurations: [3, 4]
    }
  },
  'stability': {
    id: 'stability',
    name: 'Stability AI',
    description: 'Open-source video generation with competitive pricing',
    pricing: {
      costPerSecond: 0.01,
      currency: 'USD',
      freeTier: {
        seconds: 50,
        description: '50 seconds free per month'
      }
    },
    features: ['Text-to-video', 'Open source', 'Highly customizable', 'Cost-effective'],
    maxDuration: 5,
    supportedAspectRatios: ['16:9', '9:16', '1:1', '4:3'],
    apiEndpoint: 'https://api.stability.ai/v2beta/image-to-video',
    requiresAuth: true,
    authType: 'bearer',
    capabilities: {
      supportsMultipleVideos: true,
      supportsConditioningImage: true,
      supportsNegativePrompt: true,
      supportsResolution: true,
      supportsFPS: true,
      maxVideos: 4,
      supportedResolutions: ['720p', '1080p'],
      supportedFPS: [24, 30],
      supportedDurations: [3, 4, 5]
    }
  },
  'openai-sora': {
    id: 'openai-sora',
    name: 'OpenAI Sora',
    description: 'Advanced video generation with exceptional quality and realistic physics',
    pricing: {
      costPerSecond: 0.10,
      currency: 'USD',
      freeTier: {
        seconds: 10,
        description: '10 seconds free per month'
      }
    },
    features: ['Text-to-video', 'Image-to-video', 'Exceptional quality', 'Realistic physics', 'Complex scenes', 'Long-form content'],
    maxDuration: 60,
    supportedAspectRatios: ['16:9', '9:16', '1:1', '4:3', '21:9'],
    apiEndpoint: 'https://api.openai.com/v1/video/generations',
    requiresAuth: true,
    authType: 'bearer',
    capabilities: {
      supportsMultipleVideos: true,
      supportsConditioningImage: true,
      supportsNegativePrompt: true,
      supportsResolution: true,
      supportsFPS: true,
      maxVideos: 4,
      supportedResolutions: ['720p', '1080p', '4K'],
      supportedFPS: [24, 30, 60],
      supportedDurations: [5, 10, 15, 20, 30, 45, 60]
    }
  }
}

export function getProviderById(id: string): VideoProvider | undefined {
  return VIDEO_PROVIDERS[id]
}

export function getAllProviders(): VideoProvider[] {
  return Object.values(VIDEO_PROVIDERS)
}

export function getProvidersByBudget(maxCostPerSecond: number): VideoProvider[] {
  return getAllProviders().filter(provider => provider.pricing.costPerSecond <= maxCostPerSecond)
}

export function calculateCost(provider: VideoProvider, durationSeconds: number): number {
  return provider.pricing.costPerSecond * durationSeconds
}
