'use client'

import { useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { getAllProviders, VideoProvider, calculateCost } from '@/lib/video-providers'

interface VideoGenerationParams {
  prompt: string
  negativePrompt: string
  numberOfVideos: number
  aspectRatio: string
  durationSeconds: number
  conditioningImage: { mimeType: string; imageBytes: string } | null
  provider: string
}

export default function VideoGenerator() {
  const { data: session, status } = useSession()
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [numberOfVideos, setNumberOfVideos] = useState(1)
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [durationSeconds, setDurationSeconds] = useState(5)
  const [conditioningImage, setConditioningImage] = useState<File | null>(null)
  const [provider, setProvider] = useState('veo-3')
  const [isGenerating, setIsGenerating] = useState(false)
  const [message, setMessage] = useState('')
  const [videos, setVideos] = useState<string[]>([])
  const [providers] = useState<VideoProvider[]>(getAllProviders())

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setConditioningImage(file)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Sign in to Generate Videos</h2>
        <p className="text-gray-400">You need to be signed in to use the video generator.</p>
        <button
          onClick={() => signIn('google')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
        >
          Sign in with Google
        </button>
      </div>
    )
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setMessage('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    setMessage('Generating...')
    setVideos([])

    try {
      const formData = new FormData()
      formData.append('prompt', prompt)
      formData.append('negativePrompt', negativePrompt)
      formData.append('numberOfVideos', numberOfVideos.toString())
      formData.append('aspectRatio', aspectRatio)
      formData.append('durationSeconds', durationSeconds.toString())
      formData.append('provider', provider)
      
      if (conditioningImage) {
        formData.append('conditioningImage', conditioningImage)
      }

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to generate video')
      }

      const result = await response.json()
      setVideos(result.videos || [])
      setMessage('Video generated successfully!')
    } catch (error) {
      console.error('Error generating video:', error)
      setMessage('Failed to generate video. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Main Prompt */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-200 block">
          Video Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none backdrop-blur-sm"
          placeholder="Describe the video you want to create... e.g., 'A cinematic shot of a futuristic city at night with neon lights reflecting on wet streets'"
          aria-label="Video generation prompt"
        />
      </div>

      {/* Negative Prompt */}
      <div className="space-y-3">
        <label htmlFor="negative-prompt-input" className="text-sm font-semibold text-gray-200 block">
          Negative Prompt <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <textarea
          id="negative-prompt-input"
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          rows={3}
          className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none backdrop-blur-sm"
          placeholder="What you don't want in the video... e.g., 'text, watermarks, blurry, low quality'"
          aria-label="Video generation negative prompt"
        />
      </div>

      {/* Provider Selection */}
      <div className="space-y-3">
        <label htmlFor="provider-selection" className="text-sm font-semibold text-gray-200 block">
          Video Generation Provider
        </label>
        <div className="relative">
          <select
            id="provider-selection"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl p-3 pr-10 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer"
            aria-label="Video generation provider selection"
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id} className="bg-gray-800 text-white">
                {p.name} - ${p.pricing.costPerSecond.toFixed(2)}/sec
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {(() => {
          const selectedProvider = providers.find(p => p.id === provider)
          if (!selectedProvider) return null
          
          const estimatedCost = calculateCost(selectedProvider, durationSeconds * numberOfVideos)
          
          return (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">{selectedProvider.description}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedProvider.pricing.costPerSecond <= 0.03 
                    ? 'bg-green-900/30 text-green-400 border border-green-600/30' 
                    : selectedProvider.pricing.costPerSecond <= 0.05
                    ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-600/30'
                    : 'bg-red-900/30 text-red-400 border border-red-600/30'
                }`}>
                  ${selectedProvider.pricing.costPerSecond.toFixed(2)}/sec
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Estimated cost: ${estimatedCost.toFixed(2)}</span>
                {selectedProvider.pricing.freeTier && (
                  <span className="text-green-400">
                    {selectedProvider.pricing.freeTier.description}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedProvider.features.map((feature, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )
        })()}
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-3">
          <label htmlFor="number-of-videos" className="text-sm font-semibold text-gray-200 block">
            Number of Videos
          </label>
          <div className="relative">
            <input
              id="number-of-videos"
              type="number"
              min="1"
              max="4"
              value={numberOfVideos}
              onChange={(e) => setNumberOfVideos(parseInt(e.target.value))}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl p-3 pr-12 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              aria-label="Number of videos to generate"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setNumberOfVideos(Math.max(1, numberOfVideos - 1))}
                disabled={numberOfVideos <= 1}
                className="w-6 h-6 rounded-full bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setNumberOfVideos(Math.min(4, numberOfVideos + 1))}
                disabled={numberOfVideos >= 4}
                className="w-6 h-6 rounded-full bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400">Generate 1-4 videos with different variations</p>
        </div>
        
        <div className="space-y-3">
          <label htmlFor="aspect-ratio" className="text-sm font-semibold text-gray-200 block">
            Aspect Ratio
          </label>
          <div className="relative">
            <select
              id="aspect-ratio"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl p-3 pr-10 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer"
              aria-label="Aspect ratio"
            >
              <option value="16:9" className="bg-gray-800 text-white">16:9 (Landscape)</option>
              <option value="21:9" className="bg-gray-800 text-white">21:9 (Cinematic)</option>
              <option value="9:16" className="bg-gray-800 text-white">9:16 (Portrait)</option>
              <option value="1:1" className="bg-gray-800 text-white">1:1 (Square)</option>
              <option value="4:3" className="bg-gray-800 text-white">4:3 (Standard)</option>
              <option value="3:4" className="bg-gray-800 text-white">3:4 (Vertical)</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Landscape</span>
            <span className="font-medium text-blue-400">
              {aspectRatio === '16:9' && '16:9'}
              {aspectRatio === '21:9' && '21:9'}
              {aspectRatio === '9:16' && '9:16'}
              {aspectRatio === '1:1' && '1:1'}
              {aspectRatio === '4:3' && '4:3'}
              {aspectRatio === '3:4' && '3:4'}
            </span>
            <span>Portrait</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <label htmlFor="duration-seconds" className="text-sm font-semibold text-gray-200 block">
            Duration
          </label>
          <div className="relative">
            <input
              id="duration-seconds"
              type="number"
              min="3"
              max="10"
              value={durationSeconds}
              onChange={(e) => setDurationSeconds(parseInt(e.target.value))}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl p-3 pr-12 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              aria-label="Video duration in seconds"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setDurationSeconds(Math.max(3, durationSeconds - 1))}
                disabled={durationSeconds <= 3}
                className="w-6 h-6 rounded-full bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setDurationSeconds(Math.min(10, durationSeconds + 1))}
                disabled={durationSeconds >= 10}
                className="w-6 h-6 rounded-full bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>3s</span>
            <span className="font-medium text-blue-400">{durationSeconds}s</span>
            <span>10s</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-200 block">
            Reference Image <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <input
              type="file"
              id="conditioning-image-input"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
            />
            <label
              htmlFor="conditioning-image-input"
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl p-3 text-white hover:bg-gray-600/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm cursor-pointer block text-center border-dashed hover:border-solid"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Choose Image</span>
              </div>
            </label>
          </div>
          {conditioningImage && (
            <div className="mt-2 p-2 bg-green-900/20 border border-green-600/30 rounded-lg">
              <p className="text-xs text-green-400 font-medium">✓ {conditioningImage.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Generate Button */}
      <div className="pt-4">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating Video with {providers.find(p => p.id === provider)?.name || provider}...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Generate Video with {providers.find(p => p.id === provider)?.name || provider}</span>
            </div>
          )}
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`p-4 rounded-xl border ${
          message.includes('successfully') 
            ? 'bg-green-900/20 border-green-600/30 text-green-400' 
            : message.includes('Failed') || message.includes('Please enter')
            ? 'bg-red-900/20 border-red-600/30 text-red-400'
            : 'bg-blue-900/20 border-blue-600/30 text-blue-400'
        }`}>
          <div className="flex items-center space-x-2">
            {message.includes('successfully') && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {message.includes('Failed') && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{message}</span>
          </div>
        </div>
      )}

      {/* Generated Videos */}
      {videos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Generated Videos</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {videos.map((video, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50">
                <video
                  controls
                  className="w-full h-auto"
                  src={video}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
