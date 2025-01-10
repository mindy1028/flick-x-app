/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'markdown-it-mathjax3' {
  import MarkdownIt from 'markdown-it'
  const markdownItMathjax3: MarkdownIt.PluginSimple
  export default markdownItMathjax3
}

type PageName =
  | 'chat'
  | 'chat-assistant'
  | 'chat-plugin'
  | 'ai-drawing'
  | 'knowledge-base'
  | 'calendar'
  | 'translator'
  | 'collect'
  | 'ai-app'
type BigModelProvider = 'FlickX'
type AIDrawingProvider = 'FlickX'
type AIAudioProvider = 'FlickX'
type TranslatorProvider = 'youdao' | 'baiduTranslation'
type AssistantType = 'chat'
type ChatMsgType = 'text' | 'img'
type ChatRole = 'user' | 'assistant' | 'system' | 'tool'
type CalendarReportType = 'day' | 'week' | 'month' | 'year'
type MiniProgramType = 'webview' | 'local'
type AppNotificationType = 'info' | 'warn' | 'error'
type ChatPluginType = 'function'
// https://json-schema.org/understanding-json-schema/reference/type
type ChatPluginParameterType = 'string' | 'number' | 'integer' | 'object' | 'array' | 'boolean'
type CollectionItemType = 'chat' | 'image' | 'note'

interface Assistant {
  // 通用
  id: string
  type: AssistantType
  name: string
  provider: BigModelProvider
  model: string
  createTime: number
  lastUpdateTime: number
  chatMessageList: ChatMessage[]
  clearContextMessageId?: string | null
  chatPluginIdList: string[]

  // 对话
  instruction: string
  inputMaxTokens: number
  maxTokens: number
  contextSize: number

  // 发音
  speechModel?: string
  speechVoice?: string
  speechSpeed?: number
}

interface BaseMessage {
  role: ChatRole
  name?: string
  content: string
  image?: string
  fileList?: MessageFile[]
}

interface ChatMessage extends BaseMessage {
  id: string
  type: ChatMsgType
  createTime: number
}

interface MessageFile {
  id: string
  name: string
  path: string
  size: number
}

interface CollectionItem {
  id: string
  type: CollectionItemType
  createTime: number

  // 对话收藏
  chat?: Assistant
  // 图片收藏
  image?: DrawingTask
  // 笔记收藏
  note?: CollectionNote
}

interface CollectionNote {
  title: string
  content: string
}

interface KnowledgeBase {
  id: string
  name: string
  description: string
  redisConfig: RedisConfig
  indexName: string
  createTime: number
  lastUpdateTime: number
}

interface RedisConfig {
  url: string
  username?: string
  password?: string
}

interface KnowledgeFile {
  key: string
  text: string
  createTime: number
  updateTime: number
}

interface CalendarReport {
  id: string
  content: string
  createTime: number
  updateTime: number
  startTime: number
  endTime: number
}

interface MiniProgramChangeLog {
  currentVersion: string; // 对应 JSON 中的 "currentVersion"
  updateTime: string; // 对应 JSON 中的 "updateTime"
  updateDescription: string; // 对应 JSON 中的 "updateDescription"
}

interface MiniProgram {
  agentId: string; // 对应 JSON 中的 "agentId"
  name: string; // 对应 JSON 中的 "name"
  nickname: string; // 对应 JSON 中的 "nickname"
  isActive: number; // 对应 JSON 中的 "isActive"，转换为布尔类型
  cost: number; // 对应 JSON 中的 "cost"，转换为数字类型
  currentVersion: string; // 对应 JSON 中的 "currentVersion"
  avatar: string;
  description: { // 对应 JSON 中的 "description"
    short: string; // 对应 JSON 中的 "short"
    medium: string; // 对应 JSON 中的 "medium"
    long: string; // 对应 JSON 中的 "long"
  };
  features: { // 对应 JSON 中的 "features"
    requirementsAnalysis: { // 对应 JSON 中的 "requirementsAnalysis"
      documentReading: string; // 对应 JSON 中的 "documentReading"
      informationExtraction: string; // 对应 JSON 中的 "informationExtraction"
    };
    codeWriting: { // 对应 JSON 中的 "codeWriting"
      codeGeneration: string; // 对应 JSON 中的 "codeGeneration"
      codeModification: string; // 对应 JSON 中的 "codeModification"
    };
    fileManagement: { // 对应 JSON 中的 "fileManagement"
      localFileManagement: string; // 对应 JSON 中的 "localFileManagement"
    };
  };
  usageInstructions: { // 对应 JSON 中的 "usageInstructions"
    overview: string; // 对应 JSON 中的 "overview"
    attentionMatters: string[]; // 对应 JSON 中的 "attentionMatters"
  };
  changeLog: MiniProgramChangeLog[];
}

interface AppNotification {
  type: AppNotificationType
  content: string
  createTime: number
}

interface ChatPlugin {
  id: string
  type: ChatPluginType
  description: string
  name: string
  code: string
  parameters: ChatPluginParameter[]
  createTime: number
  lastUpdateTime: number
}

interface ChatPluginParameter {
  name: string
  type: ChatPluginParameterType
  description: string
}

interface DrawingTask {
  // 关键参数
  id: string
  provider: AIDrawingProvider
  model: string
  imageList: string[]
  prompt: string
  negativePrompt?: string

  // 选项（更换模型时清空）
  options: {
    n?: number
    quality?: string
    size?: string
    style?: string
    steps?: number
    samplerIndex?: string
    cfgScale?: number
  }
}
