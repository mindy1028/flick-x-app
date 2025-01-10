// import { chat2deepSeek } from '@renderer/utils/big-model/deep-seek-util'
import { chat2openai, drawingByOpenAI, speechByOpenAI } from '@renderer/utils/big-model/openai-util'

type ChatFunctionMap = {
  [provider in BigModelProvider]: (option: CommonChatOption) => Promise<any>
}

type DrawingFunctionMap = {
  [provider in AIDrawingProvider]: (option: CommonDrawingOption) => Promise<any>
}

type SpeechFunctionMap = {
  [provider in AIAudioProvider]: (option: CommonSpeechOption) => Promise<any>
}

export interface CommonChatOption {
  appId?: string
  secretKey?: string
  apiKey?: string
  baseURL?: string
  model: string
  instruction: string
  inputMaxTokens?: number
  contextSize: number
  maxTokens?: number
  messages?: ChatMessage[]
  abortCtr?: AbortController
  sessionId: string
  chatPlugins?: ChatPlugin[]
  startAnswer?: (sessionId: string, content?: string) => void
  appendAnswer?: (sessionId: string, content: string) => void
  end?: (sessionId: string, err?: any) => void
}

export interface CommonDrawingOption {
  appId?: string
  secretKey?: string
  apiKey?: string
  baseURL?: string
  sessionId: string
  prompt: string
  negativePrompt?: string
  model: string
  size?: string
  quality?: string
  style?: string
  n?: number
  steps?: number
  samplerIndex?: string
  cfgScale?: number
  imageGenerated?: (sessionId: string, imageUrls: string[]) => void
  end?: (sessionId: string, errMsg?: any) => void
  abortCtr?: AbortController
}

export interface CommonSpeechOption {
  apiKey?: string
  baseURL?: string
  model?: string
  voice?: string
  speed?: number
  input: string
}

const chatFunctionMap: ChatFunctionMap = {
  FlickX: chat2openai
}

const drawingFunctionMap: DrawingFunctionMap = {
  FlickX: drawingByOpenAI
}

const speechFunctionMap: SpeechFunctionMap = {
  FlickX: speechByOpenAI
}

export const chat2bigModel = async (provider: keyof ChatFunctionMap, option: CommonChatOption) => {
  const chatFunction = chatFunctionMap[provider]
  if (chatFunction) {
    return chatFunction(option)
  } else {
    throw new Error(`Unsupported provider: ${provider}`)
  }
}

export const drawingByBigModel = async (
  provider: keyof DrawingFunctionMap,
  option: CommonDrawingOption
) => {
  const drawingFunction = drawingFunctionMap[provider]
  if (drawingFunction) {
    return drawingFunction(option)
  } else {
    throw new Error(`Unsupported provider: ${provider}`)
  }
}

export const speechByBigModel = async (
  provider: keyof SpeechFunctionMap,
  option: CommonSpeechOption
) => {
  const speechFunction = speechFunctionMap[provider]
  if (speechFunction) {
    return speechFunction(option)
  } else {
    throw new Error(`Unsupported provider: ${provider}`)
  }
}
