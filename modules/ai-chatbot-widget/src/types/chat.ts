export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt?: Date
}

export interface ChatConfig {
  title: string
  placeholder: string
  systemPrompt: string
  model: string
}
